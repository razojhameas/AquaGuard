import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  PanResponder,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { calculateDOStressIndex } from "../utils/waterQualityCalculations";
import { Picker } from "@react-native-picker/picker";

const styles = StyleSheet.create({
  waterQualityPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    overflow: "hidden",
  },
  bubble1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(0, 150, 136, 0.2)",
    top: -50,
    left: -50,
  },
  bubble2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0, 188, 212, 0.2)",
    bottom: -30,
    right: -30,
  },
  bubble3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(77, 208, 225, 0.2)",
    top: "40%",
    left: "20%",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    width: "98%",
    maxWidth: 480,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00796b",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    minWidth: 300,
    maxWidth: 360,
    alignItems: "center",
    maxHeight: "80%",
  },
  modalClose: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  movableIndicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  movableIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    zIndex: 10,
  },
  legendTable: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0f7fa',
    overflow: 'hidden',
    backgroundColor: 'rgba(240, 248, 255, 0.8)',
    marginTop: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#009688',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e0f7fa',
  },
  tableCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
});

export default function WaterQualityPage({ language, settings }) {
  const navigation = useNavigation();
  const [data, setData] = useState(undefined);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [apiErrorShown, setApiErrorShown] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");
  const [species, setSpecies] = useState("tilapia");
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [doStressIndexResult, setDoStressIndexResult] = useState(null);

  const [indicatorPosition, setIndicatorPosition] = useState({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newX = lastPosition.current.x + gestureState.dx;
        const newY = lastPosition.current.y + gestureState.dy;
        setIndicatorPosition({ x: newX, y: newY });
      },
      onPanResponderRelease: (event, gestureState) => {
        lastPosition.current.x += gestureState.dx;
        lastPosition.current.y += gestureState.dy;
      },
    })
  ).current;

  const legendColors = [
    "#009688",
    "#f9a825",
    "#e65100",
    "#b71c1c",
  ];

  const speciesOptions = [
    {
      label: language === "English" ? "Tilapia" : "Tilapya",
      value: "tilapia",
      fuzzy: {
        good: [26, 27.5, 29],
        moderate: [
          [22, 24, 26],
          [29, 30, 31],
        ],
        poor: [
          [18, 20, 22],
          [31, 32.5, 34],
        ],
        bad: [
          [0, 9, 18],
          [35, 37, 50],
        ],
      },
      optimal: [26, 29]
    },
    {
      label: language === "English" ? "Milkfish" : "Bangus",
      value: "milkfish",
      fuzzy: {
        good: [28, 29, 32],
        moderate: [
          [24, 26, 28],
          [32, 33, 34],
        ],
        poor: [
          [20, 22, 24],
          [34, 35, 36],
        ],
        bad: [
          [0, 10, 20],
          [36, 38, 50],
        ],
      },
      optimal: [28, 32]
    },
    {
      label: language === "English" ? "Catfish" : "Hito",
      value: "catfish",
      fuzzy: {
        good: [24, 27, 30],
        moderate: [
          [20, 22, 24],
          [30, 31, 32],
        ],
        poor: [
          [16, 18, 20],
          [32, 33, 34],
        ],
        bad: [
          [0, 8, 16],
          [34, 36, 50],
        ],
      },
      optimal: [24, 30]
    },
    {
      label: language === "English" ? "Shrimp" : "Hipon",
      value: "shrimp",
      fuzzy: {
        good: [28, 30, 32],
        moderate: [
          [24, 26, 28],
          [32, 33, 34],
        ],
        poor: [
          [20, 22, 24],
          [34, 35, 36],
        ],
        bad: [
          [0, 10, 20],
          [36, 38, 50],
        ],
      },
      optimal: [28, 32]
    },
    {
      label: language === "English" ? "Custom Species" : "Ibang Isda",
      value: "custom",
      fuzzy: {
        good: [25, 28, 31],
        moderate: [
          [21, 23, 25],
          [31, 32, 33],
        ],
        poor: [
          [17, 19, 21],
          [33, 34, 35],
        ],
        bad: [
          [0, 8, 17],
          [35, 37, 50],
        ],
      },
      optimal: [25, 31]
    },
  ];

  const selectedSpecies = speciesOptions.find(s => s.value === species) || speciesOptions[0];
  const tempOptimalMin = selectedSpecies.optimal[0];
  const tempOptimalMax = selectedSpecies.optimal[1];

  const apiEndpoint = settings?.apiEndpoint || "http://192.168.18.5:3000";

  useEffect(() => {
    let didShowError = false;
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/api/data`);
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();
        setDebugMsg("");
        let latest = null;
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          const sortedData = jsonData
            .filter(d => d && d.timestamp)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          latest = sortedData[0];
        } else if (jsonData && jsonData.timestamp) {
          latest = jsonData;
        }
        setData(latest || null);
        setApiErrorShown(false);

        if (latest) {
          const currentHour = new Date(latest.timestamp).getHours();
          const doSI = latest.dosi !== undefined ?
            { rawDOSI: latest.dosi, severity: calculateDOStressIndex(latest.temperature, latest.pH, latest.ammoniaLevel, latest.turbidityLevel, currentHour).severity } :
            calculateDOStressIndex(
              Number(latest.temperature),
              Number(latest.pH),
              Number(latest.ammoniaLevel),
              Number(latest.turbidityLevel),
              currentHour
            );
          setDoStressIndexResult(doSI);
        } else {
          setDoStressIndexResult(null);
        }

      } catch (error) {
        setDebugMsg("Fetch error: " + error.message);
        if (!didShowError && !apiErrorShown) {
          setApiErrorShown(true);
          didShowError = true;
          if (settings?.notificationsEnabled !== false) {
            Alert.alert(
              language === "English" ? "Error" : "Error",
              language === "English"
                ? "Unable to connect to API. Please check your network connection."
                : "Hindi makakonekta sa API. Pakisuri ang iyong koneksyon sa internet."
            );
          }
        }
        setData(null);
        setDoStressIndexResult(null);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, [language, apiEndpoint, settings?.notificationsEnabled]);

  const safeValue = (val, digits = 2) =>
    typeof val === "number" && !isNaN(val) ? Number(val).toFixed(digits) : "--";

  const temperature = safeValue(data?.temperature, 1);
  const pH = safeValue(data?.pH, 2);
  const ammoniaLevel = safeValue(data?.ammoniaLevel, 2);
  const turbidityLevel = safeValue(data?.turbidityLevel, 2);

  function triangular(x, a, b, c) {
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x > a && x < b) return (x - a) / (b - a);
    if (x > b && x < c) return (c - x) / (c - b);
    return 0;
  }

  function classifyTemperature(val) {
    if (val === "--") return 1;
    val = parseFloat(val);
    const f = selectedSpecies.fuzzy;
    let good = triangular(val, ...f.good);
    let moderate = Math.max(
      triangular(val, ...f.moderate[0]),
      triangular(val, ...f.moderate[1])
    );
    let poor = Math.max(
      triangular(val, ...f.poor[0]),
      triangular(val, ...f.poor[1])
    );
    let bad = Math.max(
      triangular(val, ...f.bad[0]),
      triangular(val, ...f.bad[1])
    );
    const arr = [good, moderate, poor, bad];
    let maxIdx = 0;
    let maxVal = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }
  const pHFuzzy = [
    [5.5, 7.5, 8.5],
    [4.5, 6.0, 6.5],
    [8.5, 8.8, 9.1],
    [3.5, 4.5, 5.5],
    [9.1, 9.8, 10.5],
    [0, 3.5, 4.5],
    [10.5, 11.5, 14],
  ];
  const turbFuzzy = [
    [0, 2.5, 5],
    [5, 12.5, 20],
    [20, 35, 50],
    [50, 75, 100],
  ];
  const ammoniaFuzzy = [
    [0, 0.01, 0.02],
    [0.02, 0.035, 0.05],
    [0.05, 0.08, 0.1],
    [0.1, 0.2, 0.5],
  ];


  function fuzzyClassify(val, sets) {
    if (val === "--") return 1;
    val = parseFloat(val);
    let degrees = [0, 0, 0, 0];
    if (sets === pHFuzzy) {
      degrees[0] = triangular(val, ...sets[0]);
      degrees[1] = Math.max(triangular(val, ...sets[1]), triangular(val, ...sets[2]));
      degrees[2] = Math.max(triangular(val, ...sets[3]), triangular(val, ...sets[4]));
      degrees[3] = Math.max(triangular(val, ...sets[5]), triangular(val, ...sets[6]));
    } else {
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

  function getPHColor(val) {
    return legendColors[fuzzyClassify(val, pHFuzzy)];
  }
  function getTempColor(val) {
    return legendColors[classifyTemperature(val)];
  }
  function getTurbidityColor(val) {
    return legendColors[fuzzyClassify(val, turbFuzzy)];
  }
  function getAmmoniaColor(val) {
    return legendColors[fuzzyClassify(val, ammoniaFuzzy)];
  }

  function getDOSIColor(severity) {
    switch (severity) {
      case "Safe":
        return legendColors[0];
      case "Moderate":
        return legendColors[1];
      case "High Risk":
        return legendColors[2];
      case "Critical":
        return legendColors[3];
      default:
        return "#888";
    }
  }

  const checkForAlert = () => {
    let criticalParameter = false;
    if (
      getTempColor(temperature) === legendColors[3] ||
      getPHColor(pH) === legendColors[3] ||
      getAmmoniaColor(ammoniaLevel) === legendColors[3] ||
      getTurbidityColor(turbidityLevel) === legendColors[3]
    ) {
      criticalParameter = true;
    }

    const criticalDOSI = doStressIndexResult?.severity === "Critical";

    if ((criticalParameter || criticalDOSI) && !alertTriggered && settings?.notificationsEnabled !== false) {
      setAlertTriggered(true);
      Alert.alert(
        language === "English" ? "Water Quality Alert" : "Babala sa Kalidad ng Tubig",
        language === "English"
          ? "One or more water quality parameters have reached a critical level, or the DO Stress Index is critical!"
          : "May isa o higit pang parameter na nasa kritikal na antas, o kritikal ang DO Stress Index!"
      );
    } else if (!(criticalParameter || criticalDOSI)) {
      setAlertTriggered(false);
    }
  };

  useEffect(() => {
    if (data) checkForAlert();
  }, [data, species, settings?.notificationsEnabled, doStressIndexResult]);

 const parameters = [
    {
      label: language === "English" ? "DO-SI" : "DO-SI",
      property: "dosi",
      value: doStressIndexResult ? doStressIndexResult.rawDOSI.toFixed(2) : "--",
      unit: "",
      nav: "ParameterDetails",
      color: doStressIndexResult ? getDOSIColor(doStressIndexResult.severity) : "#888"
    },
    {
      label: language === "English" ? "Temperature" : "Temperatura",
      property: "temperature",
      value: temperature,
      unit: "°C",
      nav: "ParameterDetails",
      color: getTempColor(temperature)
    },
    {
      label: "pH",
      property: "pH",
      value: pH,
      unit: "",
      nav: "ParameterDetails",
      color: getPHColor(pH)
    },
    {
      label: language === "English" ? "Ammonia" : "Amonya",
      property: "ammoniaLevel",
      value: ammoniaLevel,
      unit: "mg/L",
      nav: "ParameterDetails",
      color: getAmmoniaColor(ammoniaLevel)
    },
    {
      label: language === "English" ? "Turbidity" : "Kakuliman",
      property: "turbidityLevel",
      value: turbidityLevel,
      unit: "NTU",
      nav: "ParameterDetails",
      color: getTurbidityColor(turbidityLevel)
    },
  ];

  const legendLabels = language === "English"
    ? ["Good", "Moderate", "Poor", "Bad"]
    : ["Maganda", "Katamtaman", "Mahina", "Masama"];

  return (
    <View style={styles.waterQualityPage}>
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <View
        style={styles.movableIndicatorContainer}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.movableIndicator,
            {
              transform: [
                { translateX: indicatorPosition.x },
                { translateY: indicatorPosition.y },
              ],
            },
          ]}
        />
      </View>
      <View style={styles.glassCard}>
        <Text style={[styles.heading, { marginBottom: 8, fontSize: 22 }]}>
          {language === "English" ? "WATER QUALITY MONITOR" : "PAGSUBAYBAY NG KALIDAD NG TUBIG"}
        </Text>

        <View style={{ marginBottom: 12, width: "100%", alignItems: "center" }}>
          <Text style={{ color: "#00796b", fontWeight: "bold", fontSize: 15, marginBottom: 4 }}>
            {language === "English"
              ? "Select Species (for Temperature Fuzzy Logic)"
              : "Pumili ng Isda (para sa Temperature Fuzzy Logic)"}
          </Text>
          <View style={{
            borderWidth: 1,
            borderColor: "#00796b",
            borderRadius: 10,
            backgroundColor: "#f7f8fc",
            width: 220,
            alignSelf: "center",
            marginBottom: 2,
          }}>
            <Picker
              selectedValue={species}
              onValueChange={setSpecies}
              style={{ width: "100%" }}
            >
              {speciesOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
          <Text style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
            {language === "English"
              ? `Optimal: ${tempOptimalMin}°C to ${tempOptimalMax}°C`
              : `Pinakamainam: ${tempOptimalMin}°C hanggang ${tempOptimalMax}°C`}
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 18,
        }}>
          {legendLabels.map((legend, idx) => (
            <TouchableOpacity
              key={legend}
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => setShowLegendModal(true)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 12, height: 12, borderRadius: 6,
                backgroundColor: legendColors[idx],
                marginRight: 4,
                borderWidth: 1.5,
                borderColor: "#333",
              }} />
              <Text style={{
                color: legendColors[idx],
                fontWeight: "bold",
                marginRight: idx < 3 ? 12 : 0,
                fontSize: 13,
                textShadowColor: "#fff",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
                letterSpacing: 0.2,
              }}>
                {legend}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={showLegendModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowLegendModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: "#fff", alignItems: "center", padding: 0 }]}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 100,
                  padding: 8,
                }}
                onPress={() => setShowLegendModal(false)}
              >
                <Ionicons name="close" size={28} color="#3a3fbd" />
              </TouchableOpacity>
              <View style={styles.legendTable}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
                    {language === "English" ? "Parameter" : "Parameter"}
                  </Text>
                  <Text style={styles.tableHeaderCell}>
                    {legendLabels[0]}
                  </Text>
                  <Text style={styles.tableHeaderCell}>
                    {legendLabels[1]}
                  </Text>
                  <Text style={styles.tableHeaderCell}>
                    {legendLabels[2]}
                  </Text>
                  <Text style={styles.tableHeaderCell}>
                    {legendLabels[3]}
                  </Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                  <View style={[styles.tableRow, { backgroundColor: '#fff' }]}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>pH</Text>
                    <Text style={styles.tableCell}>6.5 - 8.5</Text>
                    <Text style={styles.tableCell}>5.5-6.4{'\n'}8.6-9.0</Text>
                    <Text style={styles.tableCell}>4.5-5.4{'\n'}9.1-10.5</Text>
                    <Text style={styles.tableCell}>{"<4.5\n>10.5"}</Text>
                  </View>
                  <View style={[styles.tableRow, { backgroundColor: '#f7f8fc' }]}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                      {language === "English" ? "Temperature" : "Temperatura"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Species Optimal" : "Pinakamainam ng Isda"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Slight deviation" : "Bahagyang labis/kulang"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Significant deviation" : "Malaking labis/kulang"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Extreme" : "Sobrang labis/kulang"}
                    </Text>
                  </View>
                  <View style={[styles.tableRow, { backgroundColor: '#fff' }]}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                      {language === "English" ? "DO-SI" : "DO-SI"}
                    </Text>
                    <Text style={styles.tableCell}>{"<0.3"}</Text>
                    <Text style={styles.tableCell}>0.3 - 0.6</Text>
                    <Text style={styles.tableCell}>0.6 - 0.8</Text>
                    <Text style={styles.tableCell}>{">0.8"}</Text>
                  </View>
                  <View style={[styles.tableRow, { backgroundColor: '#f7f8fc' }]}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                      {language === "English" ? "Turbidity (NTU)" : "Kakuliman (NTU)"}
                    </Text>
                    <Text style={styles.tableCell}>0 - 5</Text>
                    <Text style={styles.tableCell}>6 - 20</Text>
                    <Text style={styles.tableCell}>21 - 50</Text>
                    <Text style={styles.tableCell}>{">50"}</Text>
                  </View>
                  <View style={[styles.tableRow, { backgroundColor: '#fff' }]}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                      {language === "English" ? "Ammonia (mg/L)" : "Amonya (mg/L)"}
                    </Text>
                    <Text style={styles.tableCell}>{"\u2264 0.02"}</Text>
                    <Text style={styles.tableCell}>0.03 - 0.05</Text>
                    <Text style={styles.tableCell}>0.06 - 0.1</Text>
                    <Text style={styles.tableCell}>{">0.1"}</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView
          style={{
            width: "100%",
            maxHeight: 380,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: 0,
          }}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {parameters.map((param, idx) => (
            <View
              key={param.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: idx < parameters.length - 1 ? 14 : 0,
                backgroundColor: "#fff",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 14,
                shadowColor: param.color,
                shadowOpacity: 0.10,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
                borderWidth: 1.5,
                borderColor: param.color,
                minHeight: 54,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", minWidth: 90 }}>
                <View style={{
                  width: 7,
                  height: 36,
                  borderRadius: 3,
                  backgroundColor: param.color,
                  marginRight: 10,
                }} />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#3a3fbd",
                    fontWeight: "bold",
                    width: 80,
                    flexShrink: 1,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {param.label}
                </Text>
              </View>
              <Text style={{
                fontSize: 17,
                color: param.color,
                fontWeight: "bold",
                minWidth: 60,
                textAlign: "right"
              }}>
                {param.value} {param.unit}
              </Text>
              {param.nav && (
                <Pressable
                  style={{
                    backgroundColor: "#009688",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginLeft: 8,
                    elevation: 2,
                  }}
                  onPress={() => navigation.navigate(param.nav, {
                    property: param.property,
                    title: param.label,
                    unit: param.unit,
                    language: language
                  })}
                >
                  <Text style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}>
                    >
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </ScrollView>
        {debugMsg && (
          <Text style={{ color: "#888", fontSize: 12, marginTop: 16 }}>{debugMsg}</Text>
        )}
        {data === undefined && (
          <Text style={{ color: "#d32f2f", marginTop: 8 }}>
            {language === "English" ? "Fetching data..." : "Kinukuha ang datos..."}
          </Text>
        )}
        {data === null && (
          <Text style={{ color: "#d32f2f", marginTop: 8 }}>
            {language === "English" ? "No data available." : "Walang datos."}
          </Text>
        )}
      </View>
    </View>
  );
}