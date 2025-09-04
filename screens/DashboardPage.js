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
});

const getDOSIColor = (dosi) => {
  if (dosi === undefined || dosi === null) return "#888";
  if (dosi > 0.8) return "#b71c1c";
  if (dosi > 0.6) return "#e65100";
  if (dosi > 0.3) return "#f9a825";
  return "#009688";
};

const getTemperatureColor = (temp) => {
  if (temp === undefined || temp === null || isNaN(temp)) return "#888";
  if (temp < 18 || temp > 37) return "#b71c1c";
  if ((temp >= 18 && temp < 22) || (temp > 35 && temp <= 37)) return "#e65100";
  if ((temp >= 22 && temp < 26) || (temp > 32 && temp <= 35)) return "#f9a825";
  return "#009688";
};

const getPHColor = (pH) => {
  if (pH === undefined || pH === null || isNaN(pH)) return "#888";
  if (pH < 4.5 || pH > 10.5) return "#b71c1c";
  if ((pH >= 4.5 && pH < 5.5) || (pH > 9.1 && pH <= 10.5)) return "#e65100";
  if ((pH >= 5.5 && pH < 6.5) || (pH > 8.5 && pH <= 9.1)) return "#f9a825";
  return "#009688";
};

const getAmmoniaColor = (ammonia) => {
  if (ammonia === undefined || ammonia === null || isNaN(ammonia)) return "#888";
  if (ammonia > 0.1) return "#b71c1c";
  if (ammonia > 0.05) return "#e65100";
  if (ammonia > 0.02) return "#f9a825";
  return "#009688";
};

const getTurbidityColor = (turbidity) => {
  if (turbidity === undefined || turbidity === null || isNaN(turbidity)) return "#888";
  if (turbidity > 50) return "#b71c1c";
  if (turbidity > 20) return "#e65100";
  if (turbidity > 5) return "#f9a825";
  return "#009688";
};

export default function DashboardPage({ language, navigation }) {
  const [loading, setLoading] = useState(true);
  const [latestWaterQuality, setLatestWaterQuality] = useState(null);
  const [feedingStats, setFeedingStats] = useState(null);
  const [doStressIndexResult, setDoStressIndexResult] = useState(null);

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
      } else {
        setDoStressIndexResult(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLatestWaterQuality(null);
      setFeedingStats(null);
      setDoStressIndexResult(null);
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
            {language === "English" ? "System Dashboard" : "Dashboard ng Sistema (clunky pa translations google translate na lang muna, need pa kasi ng langauge expert consulation para formal e wala pa)"}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#00796b" />
          ) : (
            <>
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
                            { backgroundColor: getDOSIColor(doStressIndexResult?.rawDOSI) },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: getDOSIColor(doStressIndexResult?.rawDOSI) },
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
                          { color: getTemperatureColor(latestWaterQuality.temperature) },
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
                          { color: getPHColor(latestWaterQuality.pH) },
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
                          { color: getAmmoniaColor(latestWaterQuality.ammoniaLevel) },
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
                          { color: getTurbidityColor(latestWaterQuality.turbidityLevel) },
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
                  {language === "English" ? "Feeding System" : "Sistema ng Pagpapakain"}
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
                        {language === "English" ? "Avg. Feed per Feeding:" : "Karaniwang Pakain kada Pagpapakain:"}
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