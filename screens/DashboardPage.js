import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculateDOStressIndex } from "../utils/waterQualityCalculations";

const { width, height } = Dimensions.get("window");

// Helper function to calculate fuzzy classification for a given value and sets.
// Returns an index (0-3) representing the classification: 0 = Good, 1 = Moderate, 2 = Poor, 3 = Bad
function fuzzyClassify(val, sets) {
  if (val === undefined || val === null || isNaN(val)) return 1;
  const triangular = (x, a, b, c) => {
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x > a && x < b) return (x - a) / (b - a);
    if (x > b && x < c) return (c - x) / (c - b);
    return 0;
  };
  let degrees = [0, 0, 0, 0];
  if (sets.length === 7) { // pH fuzzy sets
    degrees[0] = triangular(val, ...sets[0]);
    degrees[1] = Math.max(triangular(val, ...sets[1]), triangular(val, ...sets[2]));
    degrees[2] = Math.max(triangular(val, ...sets[3]), triangular(val, ...sets[4]));
    degrees[3] = Math.max(triangular(val, ...sets[5]), triangular(val, ...sets[6]));
  } else { // Other fuzzy sets
    for (let i = 0; i < 4; i++) {
      degrees[i] = triangular(val, ...sets[i]);
    }
  }
  let maxIdx = 0;
  let maxVal = degrees[0];
  for (let i = 1; i < degrees.length; i++) {
    if (degrees[i] > maxVal) {
      maxVal = degrees[i];
      maxIdx = i;
    }
  }
  return maxIdx;
}

const getStatusColor = (statusIndex) => {
  switch (statusIndex) {
    case 0: return "#009688"; // Good
    case 1: return "#f9a825"; // Moderate
    case 2: return "#e65100"; // Poor
    case 3: return "#b71c1c"; // Bad
    default: return "#888"; // Unknown
  }
};

const getStatusText = (statusIndex, language) => {
  const statuses = language === "English"
    ? ["Good", "Moderate", "Poor", "Bad", "Unknown"]
    : ["Mabuti", "Katamtaman", "Mahina", "Masama", "Hindi Alam"];
  return statuses[statusIndex] || statuses[4];
};

const tempSets = [
  [26, 29, 32], // Good
  [22, 24, 26], [32, 34, 35], // Moderate
  [18, 20, 22], [35, 36, 37], // Poor
  [0, 15, 18], [37, 40, 50], // Bad
];

const pHSets = [
  [6.5, 7.5, 8.5], // Good
  [5.5, 6, 6.5], [8.5, 8.8, 9.1], // Moderate
  [4.5, 5, 5.5], [9.1, 9.8, 10.5], // Poor
  [0, 3, 4.5], [10.5, 12, 14], // Bad
];

const ammoniaSets = [
  [0, 0, 0.02], // Good
  [0.01, 0.035, 0.05], // Moderate
  [0.04, 0.075, 0.1], // Poor
  [0.08, 0.1, 1], // Bad
];

const turbiditySets = [
  [0, 0, 5], // Good
  [4, 12.5, 20], // Moderate
  [18, 35, 50], // Poor
  [40, 50, 200], // Bad
];

const calculateOverallPondHealth = (data) => {
  if (!data) return { statusIndex: 4, statusText: "Unknown", color: "#888" };
  const tempStatus = fuzzyClassify(data.temperature, tempSets);
  const pHStatus = fuzzyClassify(data.pH, pHSets);
  const ammoniaStatus = fuzzyClassify(data.ammoniaLevel, ammoniaSets);
  const turbidityStatus = fuzzyClassify(data.turbidityLevel, turbiditySets);

  // Use the worst-case scenario (the maximum status index) to determine overall health.
  const worstIndex = Math.max(tempStatus, pHStatus, ammoniaStatus, turbidityStatus);
  const finalIndex = worstIndex;

  return {
    statusIndex: finalIndex,
    statusText: getStatusText(finalIndex, "English"),
    color: getStatusColor(finalIndex),
  };
};

const styles = StyleSheet.create({
  dashboardPage: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    overflow: "hidden",
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bubble1: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "rgba(0, 150, 136, 0.2)",
    top: -50,
    left: -50,
  },
  bubble2: {
    position: "absolute",
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: "rgba(0, 188, 212, 0.2)",
    bottom: -30,
    right: -30,
  },
  bubble3: {
    position: "absolute",
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: "rgba(77, 208, 225, 0.2)",
    top: "40%",
    left: "20%",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(12px)",
    minWidth: 340,
    maxWidth: 650,
    width: width > 700 ? 600 : "96%",
    marginBottom: 18,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 20,
    color: "#009688",
    marginBottom: 22,
    textAlign: "center",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 12,
    marginTop: 18,
    alignSelf: "flex-start",
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,121,107,0.12)",
  },
  dataLabel: {
    fontSize: 17,
    color: "#333",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  dataValue: {
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  lastUpdated: {
    fontSize: 13,
    color: "#666",
    marginTop: 7,
    textAlign: "right",
    fontStyle: "italic",
  },
  noData: {
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 15,
  },
  cardSection: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    width: "100%",
  },
  cardSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardSectionContent: {
    marginBottom: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 40,
    minWidth: width > 700 ? 600 : "96%",
    maxWidth: 700,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#b2dfdb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginBottom: 10,
    marginRight: 10,
  },
  refreshText: {
    color: "#00796b",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  overallHealthCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    minWidth: 340,
    maxWidth: 650,
    width: width > 700 ? 600 : "96%",
    alignItems: "center",
  },
  overallHealthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 12,
    alignSelf: "flex-start",
    letterSpacing: 0.5,
  },
  overallHealthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
  },
});

export default function DashboardPage({ language, navigation }) {
  const [loading, setLoading] = useState(true);
  const [latestWaterQuality, setLatestWaterQuality] = useState(null);
  const [feedingStats, setFeedingStats] = useState(null);
  const [doStressIndexResult, setDoStressIndexResult] = useState(null);
  const [overallPondHealth, setOverallPondHealth] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const waterRes = await fetch("http://192.168.18.5:3000/api/data/latest");
      const waterData = await waterRes.json();
      setLatestWaterQuality(waterData);

      const statsRes = await fetch("http://192.168.18.5:3000/api/feeding-stats");
      const statsData = await statsRes.json();
      setFeedingStats(statsData);

      if (waterData) {
        const currentHour = new Date(waterData.timestamp).getHours();
        const doSI =
          waterData.dosi !== undefined
            ? {
                rawDOSI: waterData.dosi,
                severity: calculateDOStressIndex(
                  waterData.temperature,
                  waterData.pH,
                  waterData.ammoniaLevel,
                  waterData.turbidityLevel,
                  currentHour
                ).severity,
              }
            : calculateDOStressIndex(
                Number(waterData.temperature),
                Number(waterData.pH),
                Number(waterData.ammoniaLevel),
                Number(waterData.turbidityLevel),
                currentHour
              );
        setDoStressIndexResult(doSI);
        const healthStatus = calculateOverallPondHealth(waterData);
        setOverallPondHealth(healthStatus);
      } else {
        setDoStressIndexResult(null);
        setOverallPondHealth(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLatestWaterQuality(null);
      setFeedingStats(null);
      setDoStressIndexResult(null);
      setOverallPondHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={styles.dashboardPage}>
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        horizontal={false}
      >
        <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
          <Ionicons name="refresh" size={22} color="#00796b" />
          <Text style={styles.refreshText}>
            {language === "English" ? "Refresh" : "I-refresh"}
          </Text>
        </TouchableOpacity>

        <View style={styles.glassCard}>
          <Text style={styles.header}>AquaGUARD</Text>
          <Text style={styles.subHeader}>
            {language === "English" ? "System Dashboard" : "System Dashboard"}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#00796b" />
          ) : (
            <>
              {overallPondHealth && (
                <View style={styles.cardSection}>
                  <Text style={styles.overallHealthTitle}>
                    {language === "English" ? "Overall Pond Health" : "Pangkalahatang Kalusugan ng Pond"}
                  </Text>
                  <View style={styles.overallHealthRow}>
                    <Text style={styles.dataLabel}>
                      {language === "English" ? "Status:" : "Katayuan:"}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={[
                          styles.statusIndicator,
                          { backgroundColor: overallPondHealth.color },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: overallPondHealth.color },
                        ]}
                      >
                        {getStatusText(
                          overallPondHealth.statusIndex,
                          language
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.cardSection}>
                <Text style={styles.cardSectionTitle}>
                  {language === "English" ? "Water Quality" : "Kalidad ng Tubig"}
                </Text>
                {latestWaterQuality && latestWaterQuality.timestamp ? (
                  <View style={styles.cardSectionContent}>
                    <View style={[styles.dataRow, { alignItems: "center" }]}>
                      <Text style={styles.dataLabel}>DO-SI:</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View
                          style={[
                            styles.statusIndicator,
                            { backgroundColor: getStatusColor(
                                fuzzyClassify(doStressIndexResult?.rawDOSI, [[0,0,0.3],[0.2,0.5,0.7],[0.6,0.8,0.9],[0.8,1,1]])
                               )},
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(
                                fuzzyClassify(doStressIndexResult?.rawDOSI, [[0,0,0.3],[0.2,0.5,0.7],[0.6,0.8,0.9],[0.8,1,1]])
                               )},
                          ]}
                        >
                          {doStressIndexResult?.rawDOSI !== null
                            ? doStressIndexResult?.rawDOSI?.toFixed(2)
                            : "--"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                        {language === "English" ? "Temperature:" : "Temperatura:"}
                      </Text>
                      <Text
                        style={[
                          styles.dataValue,
                          { color: getStatusColor(fuzzyClassify(latestWaterQuality.temperature, tempSets)) },
                        ]}
                      >
                        {latestWaterQuality.temperature?.toFixed(2) || "--"} °C
                      </Text>
                    </View>

                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>pH:</Text>
                      <Text
                        style={[
                          styles.dataValue,
                          { color: getStatusColor(fuzzyClassify(latestWaterQuality.pH, pHSets)) },
                        ]}
                      >
                        {latestWaterQuality.pH?.toFixed(2) || "--"}
                      </Text>
                    </View>

                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                        {language === "English" ? "Ammonia:" : "Amonya:"}
                      </Text>
                      <Text
                        style={[
                          styles.dataValue,
                          { color: getStatusColor(fuzzyClassify(latestWaterQuality.ammoniaLevel, ammoniaSets)) },
                        ]}
                      >
                        {latestWaterQuality.ammoniaLevel?.toFixed(2) || "--"} mg/L
                      </Text>
                    </View>

                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                        {language === "English" ? "Turbidity:" : "Kakuliman:"}
                      </Text>
                      <Text
                        style={[
                          styles.dataValue,
                          { color: getStatusColor(fuzzyClassify(latestWaterQuality.turbidityLevel, turbiditySets)) },
                        ]}
                      >
                        {latestWaterQuality.turbidityLevel?.toFixed(2) || "--"} NTU
                      </Text>
                    </View>

                    <Text style={styles.lastUpdated}>
                      {language === "English" ? "Last updated:" : "Huling na-update:"}{" "}
                      {new Date(latestWaterQuality.timestamp).toLocaleString()}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noData}>
                    {language === "English"
                      ? "No water quality data available."
                      : "Walang datos ng kalidad ng tubig."}
                  </Text>
                )}
              </View>

              <View style={styles.cardSection}>
                <Text style={styles.cardSectionTitle}>
                  {language === "English" ? "Feeding System" : "Pagpapakain na Sistema"}
                </Text>
                {feedingStats && feedingStats.totalFeedDispensed !== undefined ? (
                  <View style={styles.cardSectionContent}>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                        {language === "English" ? "Total Feed Dispensed:" : "Kabuuang Pakain:"}
                      </Text>
                      <Text style={styles.dataValue}>
                        {feedingStats.totalFeedDispensed?.toFixed(2) || "--"}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                        {language === "English" ? "Total Feedings:" : "Kabuuang Pagpapakain:"}
                      </Text>
                      <Text style={styles.dataValue}>
                        {feedingStats.totalFeedings || "--"}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                        {language === "English" ? "Avg. Feed per Feeding:" : "Karaniwang Pakain/Pagpapakain:"}
                      </Text>
                      <Text style={styles.dataValue}>
                        {feedingStats.avgFeedPerFeeding?.toFixed(2) || "--"}
                      </Text>
                    </View>
                    <Text style={styles.lastUpdated}>
                      {language === "English" ? "Last feeding:" : "Huling pagpapakain:"}{" "}
                      {feedingStats.lastFeedingTime
                        ? new Date(feedingStats.lastFeedingTime).toLocaleString()
                        : "--"}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noData}>
                    {language === "English"
                      ? "No feeding data available."
                      : "Walang datos ng pagpapakain."}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
