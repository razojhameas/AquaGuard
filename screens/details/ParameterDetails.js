import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { calculateDOStressIndex } from "../../utils/waterQualityCalculations";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e0f7fa",
  },
  container: {
    padding: 10,
    backgroundColor: "#e0f7fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  chartContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chartLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  table: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#00796b",
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tableHeaderText: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginVertical: 20,
  },
  dateFilterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  dateFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00796b",
    marginHorizontal: 5,
  },
  dateFilterButtonActive: {
    backgroundColor: "#00796b",
  },
  dateFilterButtonText: {
    color: "#00796b",
  },
  dateFilterButtonTextActive: {
    color: "#fff",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButton: {
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  compareButton: {
    backgroundColor: "#00796b",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  compareButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  compareModalView: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    padding: 20,
    paddingTop: 50,
  },
  intervalList: {
    maxHeight: Dimensions.get('window').height * 0.3,
    marginBottom: 20,
    alignSelf: "center",
  },
  intervalItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    width: width * 0.6,
  },
  intervalItemSelected: {
    backgroundColor: "#e0f7fa",
  },
  intervalItemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  comparisonGraphContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  compareModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 20,
    textAlign: "center",
  },
  expandedChartModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default function ParameterDetails({ route, navigation }) {
  const { property, title, unit, language } = route.params;

  const [data, setData] = useState([]);
  const [insights, setInsights] = useState({
    min: null,
    max: null,
    avg: null,
    stDev: null,
    median: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("last24h");
  const [expandedModalVisible, setExpandedModalVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [compareExpandedModalVisible, setCompareExpandedModalVisible] = useState(false);
  const [allRawData, setAllRawData] = useState([]);
  const [availableIntervals, setAvailableIntervals] = useState([]);
  const [selectedIntervals, setSelectedIntervals] = useState([]);

  const apiEndpoint = "http://192.168.18.5:3000";

  const chartConfig = {
    backgroundGradientFrom: "rgba(255, 255, 255, 0.7)",
    backgroundGradientTo: "rgba(255, 255, 255, 0.7)",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#00796b",
    },
    propsForLabels: {
      fontSize: 8,
      textAnchor: "middle",
    },
  };

  const lineColors = [
    "rgba(0, 121, 107, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiEndpoint}/api/data`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setAllRawData(jsonData);

        const now = new Date();
        let filteredData = [];
        let availableComparisonIntervals = [];

        if (timeframe === "last24h") {
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          filteredData = jsonData.filter((d) => new Date(d.timestamp) >= oneDayAgo);
          const days = {};
          jsonData.forEach(item => {
            const date = new Date(item.timestamp);
            const key = date.toLocaleDateString();
            if (!days[key]) {
              days[key] = { label: key, startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()), endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59), data: [] };
            }
            days[key].data.push(item);
          });
          availableComparisonIntervals = Object.values(days).reverse();
        } else if (timeframe === "last7d") {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredData = jsonData.filter((d) => new Date(d.timestamp) >= sevenDaysAgo);
          const weeks = {};
          jsonData.forEach(item => {
            const date = new Date(item.timestamp);
            const startOfWeek = new Date(date);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(date.getDate() - date.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const key = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
            if (!weeks[key]) {
              weeks[key] = { label: key, startDate: startOfWeek, endDate: endOfWeek, data: [] };
            }
            weeks[key].data.push(item);
          });
          availableComparisonIntervals = Object.values(weeks).reverse();
        } else if (timeframe === "last30d") {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredData = jsonData.filter((d) => new Date(d.timestamp) >= thirtyDaysAgo);
          const months = {};
          jsonData.forEach(item => {
            const date = new Date(item.timestamp);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!months[key]) {
              months[key] = { label: key, startDate: startOfMonth, endDate: endOfMonth, data: [] };
            }
            months[key].data.push(item);
          });
          availableComparisonIntervals = Object.values(months).reverse();
        }
        setAvailableIntervals(availableComparisonIntervals);

        const insightsData = filteredData
          .map((item) => {
            const date = new Date(item.timestamp);
            let value = item[property];
            if (property === "dosi") {
              const { temperature, pH, ammoniaLevel, turbidityLevel } = item;
              if (
                temperature !== undefined &&
                pH !== undefined &&
                ammoniaLevel !== undefined &&
                turbidityLevel !== undefined
              ) {
                value = calculateDOStressIndex(
                  temperature,
                  pH,
                  ammoniaLevel,
                  turbidityLevel,
                  date.getHours()
                ).rawDOSI;
              } else {
                return null;
              }
            }
            if (value !== undefined) {
              const numValue = parseFloat(value);
              return { x: date, y: numValue };
            }
            return null;
          })
          .filter((item) => item !== null);

        if (insightsData.length === 0) {
          setData([]);
          setInsights({
            min: null,
            max: null,
            avg: null,
            stDev: null,
            median: null,
          });
          setLoading(false);
          return;
        }

        const values = insightsData.map((d) => d.y);
        const sum = values.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / values.length;
        const sortedValues = [...values].sort((a, b) => a - b);
        const median =
          sortedValues.length % 2 === 0
            ? (sortedValues[sortedValues.length / 2 - 1] +
                sortedValues[sortedValues.length / 2]) /
                2
            : sortedValues[Math.floor(sortedValues.length / 2)];
        const variance =
          values.reduce((acc, curr) => acc + (curr - avg) ** 2, 0) /
          values.length;
        const stDev = Math.sqrt(variance);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const minDataPoint = insightsData.find((d) => d.y === minVal);
        const maxDataPoint = insightsData.find((d) => d.y === maxVal);

        setInsights({
          min: { value: minVal, date: minDataPoint?.x },
          max: { value: maxVal, date: maxDataPoint?.x },
          avg: avg,
          stDev: stDev,
          median: median,
        });

        // --- refactored logic para sa chart data, recheck later, still slow ---
        let processedData = [];
        if (timeframe === "last24h") {
          const hourlyData = new Map();
          insightsData.forEach((item) => {
            const hour = item.x.getHours();
            const hourKey = new Date(item.x.getFullYear(), item.x.getMonth(), item.x.getDate(), hour);
            if (!hourlyData.has(hourKey.getTime())) {
              hourlyData.set(hourKey.getTime(), { sum: 0, count: 0, date: hourKey });
            }
            const current = hourlyData.get(hourKey.getTime());
            current.sum += item.y;
            current.count++;
          });
          processedData = Array.from(hourlyData.values()).map(value => ({
            x: value.date,
            y: value.sum / value.count,
          }));
          processedData.sort((a, b) => a.x.getTime() - b.x.getTime());
        } else if (timeframe === "last7d") {
          const dailyData = new Map();
          insightsData.forEach((item) => {
            const dateKey = item.x.toLocaleDateString();
            if (!dailyData.has(dateKey)) {
              dailyData.set(dateKey, { sum: 0, count: 0, date: item.x });
            }
            const current = dailyData.get(dateKey);
            current.sum += item.y;
            current.count++;
          });
          processedData = Array.from(dailyData)
            .map(([key, value]) => ({
              x: value.date,
              y: value.sum / value.count,
            }))
            .sort((a, b) => a.x - b.x);
        } else if (timeframe === "last30d") {
          const weeklyData = new Map();
          insightsData.forEach((item) => {
            const date = new Date(item.x);
            const startOfWeek = new Date(date);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(date.getDate() - date.getDay());
            const key = `${startOfWeek.toLocaleDateString()}`;
            if (!weeklyData.has(key)) {
              weeklyData.set(key, { sum: 0, count: 0, date: startOfWeek });
            }
            const current = weeklyData.get(key);
            current.sum += item.y;
            current.count++;
          });
          processedData = Array.from(weeklyData)
            .map(([key, value]) => ({
              x: value.date,
              y: value.sum / value.count,
            }))
            .sort((a, b) => a.x - b.x);
        }
        setData(processedData)
      } catch (e) {
        setError(e.message);
        Alert.alert(
          language === "English" ? "Error" : "Error",
          language === "English"
            ? "Failed to fetch data. Please check the API endpoint and your network connection."
            : "Hindi ma-fetch ang data. Pakisuri ang API endpoint at iyong koneksyon sa network."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [property, unit, language, timeframe]);

  const toggleIntervalSelection = (interval) => {
    setSelectedIntervals((prevSelected) => {
      const isSelected = prevSelected.some(
        (item) => item.label === interval.label
      );
      if (isSelected) {
        return prevSelected.filter(
          (item) => item.label !== interval.label
        );
      } else {
        return [...prevSelected, interval];
      }
    });
  };

  const processDataForComparison = (interval) => {
    const rawDataInInterval = allRawData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= interval.startDate && itemDate <= interval.endDate;
    }).map(item => {
      let value = item[property];
      if (property === "dosi") {
        const { temperature, pH, ammoniaLevel, turbidityLevel } = item;
        if (
          temperature !== undefined &&
          pH !== undefined &&
          ammoniaLevel !== undefined &&
          turbidityLevel !== undefined
        ) {
          value = calculateDOStressIndex(
            temperature,
            pH,
            ammoniaLevel,
            turbidityLevel,
            new Date(item.timestamp).getHours()
          ).rawDOSI;
        } else {
          return null;
        }
      }
      return { x: new Date(item.timestamp), y: parseFloat(value) };
    }).filter(item => item !== null);

    const numberOfPoints = 6;
    const intervalSize = Math.ceil(rawDataInInterval.length / numberOfPoints);
    const averagedData = [];
    for (let i = 0; i < numberOfPoints; i++) {
      const start = i * intervalSize;
      const end = start + intervalSize;
      const chunk = rawDataInInterval.slice(start, end);
      if (chunk.length > 0) {
        const sum = chunk.reduce((acc, curr) => acc + curr.y, 0);
        const avg = sum / chunk.length;
        averagedData.push({ x: i, y: avg });
      }
    }
    return averagedData;
  };

  const getComparisonChartLabels = () => {
    if (timeframe === "last24h") {
      return ["0-4h", "4-8h", "8-12h", "12-16h", "16-20h", "20-24h"];
    } else if (timeframe === "last7d") {
      return ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    } else if (timeframe === "last30d") {
      return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
    }
    return [];
  };

  const comparisonChartData = {
    labels: getComparisonChartLabels(),
    datasets: selectedIntervals.map((selected, index) => {
      const processedData = processDataForComparison(selected);
      return {
        data: processedData.map(d => d.y),
        color: (opacity = 1) => lineColors[index % lineColors.length],
        strokeWidth: 2,
        label: selected.label,
      };
    }).filter(dataset => dataset.data.length > 0),
  };

  const chartLabels = (() => {
    if (timeframe === "last24h") {
      return data.map(d => d.x.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else if (timeframe === "last7d") {
      return data.map(d => d.x.toLocaleDateString('en-US', { weekday: 'short' }));
    } else if (timeframe === "last30d") {
      return data.map((d, index) => `Week ${index + 1}`);
    }
    return [];
  })();

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: data.map((d) => d.y),
        color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const formatTableCellLabel = (item) => {
    if (timeframe === "last24h") {
      return item.x.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === "last7d") {
      return item.x.toLocaleDateString();
    } else if (timeframe === "last30d") {
      const firstDate = data[0].x;
      const weekNumber = Math.floor((item.x.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
      return `Week ${weekNumber}`;
    }
    return "";
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
        <Text style={{ marginTop: 10, color: "#555" }}>
          {language === "English" ? "Loading data..." : "Naglo-load ng data..."}
        </Text>
      </View>
    );
  }

  if (error || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title} {language === "English" ? "Details" : "Detalye"}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="#00796b" />
        </TouchableOpacity>
        <Text style={styles.noDataText}>
          {language === "English"
            ? "No data available to display."
            : "Walang available na data."}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="#00796b" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {title} {language === "English" ? "Details" : "Detalye"}
        </Text>
        <View style={styles.dateFilterContainer}>
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              timeframe === "last24h" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setTimeframe("last24h")}
          >
            <Text
              style={[
                styles.dateFilterButtonText,
                timeframe === "last24h" && styles.dateFilterButtonTextActive,
              ]}
            >
              24H
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              timeframe === "last7d" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setTimeframe("last7d")}
          >
            <Text
              style={[
                styles.dateFilterButtonText,
                timeframe === "last7d" && styles.dateFilterButtonTextActive,
              ]}
            >
              7D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              timeframe === "last30d" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setTimeframe("last30d")}
          >
            <Text
              style={[
                styles.dateFilterButtonText,
                timeframe === "last30d" && styles.dateFilterButtonTextActive,
              ]}
            >
              30D
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setExpandedModalVisible(true)}>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={width - 20}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withVerticalLabels={data.length > 0}
              withHorizontalLabels={data.length > 0}
              withShadow={false}
              formatYLabel={(yValue) => `${yValue}${unit}`}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.compareButton}
          onPress={() => setCompareModalVisible(true)}
        >
          <Text style={styles.compareButtonText}>
            {language === "English" ? "Compare Intervals" : "Paghambingin ang mga Interval"}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={false}
          visible={expandedModalVisible}
          onRequestClose={() => {
            setExpandedModalVisible(!expandedModalVisible);
          }}
        >
          <SafeAreaView style={styles.expandedChartModal}>
            <ScrollView horizontal={true}>
              <LineChart
                data={chartData}
                width={width * 1.5}
                height={Dimensions.get("window").height * 0.7}
                chartConfig={{
                  ...chartConfig,
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                withVerticalLabels={data.length > 0}
                withHorizontalLabels={data.length > 0}
                withShadow={false}
                formatYLabel={(yValue) => `${yValue}${unit}`}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setExpandedModalVisible(!expandedModalVisible)}
            >
              <Text style={styles.closeButtonText}>
                {language === "English" ? "Close" : "Isara"}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={compareModalVisible}
          onRequestClose={() => {
            setCompareModalVisible(!compareModalVisible);
            setSelectedIntervals([]);
          }}
        >
          <SafeAreaView style={styles.compareModalView}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setCompareModalVisible(!compareModalVisible);
                setSelectedIntervals([]);
              }}
            >
              <Ionicons name="arrow-back-circle-outline" size={40} color="#00796b" />
            </TouchableOpacity>
            <Text style={styles.compareModalTitle}>
              {language === "English" ? "Compare Intervals" : "Paghambingin ang mga Interval"}
            </Text>
            <Text style={{ marginBottom: 10, textAlign: "center", color: "#555" }}>
              {language === "English" ? "Select intervals to compare:" : "Pumili ng mga interval na ihahambing:"}
            </Text>
            <ScrollView style={styles.intervalList}>
              {availableIntervals.map((item, index) => {
                const isSelected = selectedIntervals.some(
                  (selected) => selected.label === item.label
                );
                const colorIndex = selectedIntervals.findIndex(selected => selected.label === item.label);
                const borderColor = isSelected ? lineColors[colorIndex % lineColors.length] : "#ccc";

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.intervalItem,
                      { borderColor: borderColor },
                      isSelected && styles.intervalItemSelected,
                    ]}
                    onPress={() => toggleIntervalSelection(item)}
                  >
                    <Text style={styles.intervalItemText}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedIntervals.length > 0 && (
              <View style={styles.comparisonGraphContainer}>
                <Text style={styles.chartLabel}>
                  {language === "English" ? "Comparison" : "Paghahambing"}
                </Text>
                <TouchableOpacity onPress={() => setCompareExpandedModalVisible(true)}>
                  <LineChart
                    data={comparisonChartData}
                    width={width - 40}
                    height={220}
                    yAxisSuffix={unit}
                    chartConfig={{
                      ...chartConfig,
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                    withVerticalLabels={comparisonChartData.datasets.length > 0}
                    withHorizontalLabels={comparisonChartData.datasets[0]?.data?.length > 0}
                    withShadow={false}
                  />
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={compareExpandedModalVisible}
          onRequestClose={() => {
            setCompareExpandedModalVisible(!compareExpandedModalVisible);
          }}
        >
          <SafeAreaView style={styles.expandedChartModal}>
            <ScrollView horizontal={true}>
              <LineChart
                data={comparisonChartData}
                width={width * 1.5}
                height={Dimensions.get("window").height * 0.7}
                yAxisSuffix={unit}
                chartConfig={{
                  ...chartConfig,
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                withVerticalLabels={comparisonChartData.datasets.length > 0}
                withHorizontalLabels={comparisonChartData.datasets[0]?.data?.length > 0}
                withShadow={false}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCompareExpandedModalVisible(!compareExpandedModalVisible)}
            >
              <Text style={styles.closeButtonText}>
                {language === "English" ? "Close" : "Isara"}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>
              {language === "English" ? "Date" : "Petsa"}
            </Text>
            <Text style={styles.tableHeaderText}>
              {title} {language === "English" ? "Average" : "Average"}
            </Text>
          </View>
          <ScrollView nestedScrollEnabled={true}>
            {data
              .slice()
              .reverse()
              .map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {formatTableCellLabel(item)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.y.toFixed(2)} {unit}
                  </Text>
                </View>
              ))}
          </ScrollView>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>
              {language === "English" ? "Insights" : "Mga Insight"}
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>
              {language === "English" ? "Value & Time" : "Halaga at Oras"}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {language === "English" ? "Average" : "Average"}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {insights.avg ? `${insights.avg.toFixed(2)} ${unit}` : "-"}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {language === "English" ? "Median" : "Median"}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {insights.median ? `${insights.median.toFixed(2)} ${unit}` : "-"}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {language === "English" ? "St. Deviation" : "St. Deviation"}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {insights.stDev ? `${insights.stDev.toFixed(2)} ${unit}` : "-"}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {language === "English" ? "Minimum" : "Minimum"}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {insights.min && insights.min.date
                ? `${insights.min.value.toFixed(2)} ${unit} (${insights.min.date.toLocaleString(
                    "en-US",
                    { dateStyle: "short", timeStyle: "short" }
                  )})`
                : "-"}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {language === "English" ? "Maximum" : "Maximum"}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {insights.max && insights.max.date
                ? `${insights.max.value.toFixed(2)} ${unit} (${insights.max.date.toLocaleString(
                    "en-US",
                    { dateStyle: "short", timeStyle: "short" }
                  )})`
                : "-"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}