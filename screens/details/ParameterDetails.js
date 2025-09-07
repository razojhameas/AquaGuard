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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 40,
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
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
    paddingTop: 50,
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
    alignSelf: 'center',
    width: 150,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
    backgroundColor: "#fff",
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
    paddingBottom: 20,
  },
  statsTableContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  statsTableHeader: {
    flexDirection: "row",
    backgroundColor: "#00796b",
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  statsTableHeaderText: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  statsTableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  statsTableCell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
    fontSize: 12,
  },
  statsButton: {
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  statsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoButton: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 10,
    padding: 10,
  },
  guideModalView: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    padding: 20,
    paddingTop: 50,
  },
  guideSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  guideSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  guideSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
  },
  guideSectionContent: {
    marginTop: 10,
  },
  guideSectionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
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
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [guideModalVisible, setGuideModalVisible] = useState(false); // New state for guide modal
  const [dropdowns, setDropdowns] = useState({
    mainChart: false,
    comparison: false,
    statistics: false,
  });
  const [allRawData, setAllRawData] = useState([]);
  const [availableIntervals, setAvailableIntervals] = useState([]);
  const [selectedIntervals, setSelectedIntervals] = useState([]);

  const apiEndpoint = "http://192.168.18.5:3000";

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
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

  const processData = (rawData, property, timeframe) => {
    const now = new Date();
    let filteredData = [];
    let processedData = [];
    let availableComparisonIntervals = [];

    const insightsData = rawData
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

    if (timeframe === "last24h") {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filteredData = insightsData.filter((d) => d.x >= oneDayAgo);
      const days = {};
      insightsData.forEach(item => {
        const date = item.x;
        const key = date.toLocaleDateString();
        if (!days[key]) {
          days[key] = { label: key, startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()), endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59), data: [] };
        }
        days[key].data.push(item);
      });
      availableComparisonIntervals = Object.values(days).reverse();
      
      const hourlyData = new Map();
      filteredData.forEach((item) => {
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
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredData = insightsData.filter((d) => d.x >= sevenDaysAgo);
      const weeks = {};
      insightsData.forEach(item => {
        const date = item.x;
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
      
      const dailyData = new Map();
      filteredData.forEach((item) => {
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
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredData = insightsData.filter((d) => d.x >= thirtyDaysAgo);
      const months = {};
      insightsData.forEach(item => {
        const date = item.x;
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!months[key]) {
          months[key] = { label: key, startDate: startOfMonth, endDate: endOfMonth, data: [] };
        }
        months[key].data.push(item);
      });
      availableComparisonIntervals = Object.values(months).reverse();
      
      const weeklyData = new Map();
      filteredData.forEach((item) => {
        const date = new Date(item.x);
        const startOfWeek = new Date(date);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const key = `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
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
    } else if (timeframe === "last1y") {
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filteredData = insightsData.filter((d) => d.x >= oneYearAgo);
      const years = {};
      insightsData.forEach(item => {
        const date = item.x;
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const endOfYear = new Date(date.getFullYear(), 11, 31);
        const key = date.getFullYear().toString();
        if (!years[key]) {
          years[key] = { label: key, startDate: startOfYear, endDate: endOfYear, data: [] };
        }
        years[key].data.push(item);
      });
      availableComparisonIntervals = Object.values(years).reverse();
      
      const monthlyData = new Map();
      filteredData.forEach((item) => {
        const date = item.x;
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyData.has(key)) {
          monthlyData.set(key, { sum: 0, count: 0, date: new Date(date.getFullYear(), date.getMonth(), 1) });
        }
        const current = monthlyData.get(key);
        current.sum += item.y;
        current.count++;
      });
      processedData = Array.from(monthlyData)
        .map(([key, value]) => ({
          x: value.date,
          y: value.sum / value.count,
        }))
        .sort((a, b) => a.x - b.x);
    }

    const values = filteredData.map((d) => d.y);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avg = values.length > 0 ? sum / values.length : 0;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median =
      sortedValues.length % 2 === 0
        ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
        : sortedValues[Math.floor(sortedValues.length / 2)];
    const variance =
      values.reduce((acc, curr) => acc + (curr - avg) ** 2, 0) / values.length;
    const stDev = values.length > 0 ? Math.sqrt(variance) : 0;
    const minVal = values.length > 0 ? Math.min(...values) : null;
    const maxVal = values.length > 0 ? Math.max(...values) : null;
    const minDataPoint = filteredData.find((d) => d.y === minVal);
    const maxDataPoint = filteredData.find((d) => d.y === maxVal);
    
    const insights = {
      min: { value: minVal, date: minDataPoint?.x },
      max: { value: maxVal, date: maxDataPoint?.x },
      avg: avg,
      stDev: stDev,
      median: median,
    };

    return { processedData, insights, availableComparisonIntervals };
  };

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

        const { processedData, insights, availableComparisonIntervals } =
          processData(jsonData, property, timeframe);

        setData(processedData);
        setInsights(insights);
        setAvailableIntervals(availableComparisonIntervals);
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

  const toggleDropdown = (section) => {
    setDropdowns((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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

  const calculateComparisonStats = () => {
    const stats = selectedIntervals.map(interval => {
      const dataInInterval = allRawData.filter(item => {
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

      const values = dataInInterval.map(d => d.y);
      const sum = values.reduce((acc, curr) => acc + curr, 0);
      const avg = values.length > 0 ? sum / values.length : 0;
      const sortedValues = [...values].sort((a, b) => a - b);
      const median =
        sortedValues.length % 2 === 0
          ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
          : sortedValues[Math.floor(sortedValues.length / 2)];
      const variance =
        values.reduce((acc, curr) => acc + (curr - avg) ** 2, 0) / values.length;
      const stDev = values.length > 0 ? Math.sqrt(variance) : 0;
      const minVal = values.length > 0 ? Math.min(...values) : null;
      const maxVal = values.length > 0 ? Math.max(...values) : null;
      const minDataPoint = dataInInterval.find(d => d.y === minVal);
      const maxDataPoint = dataInInterval.find(d => d.y === maxVal);
      return {
        label: interval.label,
        avg: avg,
        median: median,
        stDev: stDev,
        min: { value: minVal, date: minDataPoint?.x },
        max: { value: maxVal, date: maxDataPoint?.x },
      };
    });
    return stats;
  };

  const comparisonStats = calculateComparisonStats();

  const getFinalInsights = () => {
    if (comparisonStats.length === 0) return null;

    let lowestAvg = comparisonStats[0];
    let highestAvg = comparisonStats[0];
    let lowestMin = comparisonStats[0];
    let highestMax = comparisonStats[0];

    for (const stat of comparisonStats) {
      if (stat.avg < lowestAvg.avg) lowestAvg = stat;
      if (stat.avg > highestAvg.avg) highestAvg = stat;
      if (stat.min?.value < lowestMin.min?.value) lowestMin = stat;
      if (stat.max?.value > highestMax.max?.value) highestMax = stat;
    }
    return { lowestAvg, highestAvg, lowestMin, highestMax };
  };

  const finalInsights = getFinalInsights();

  const getComparisonChartLabels = () => {
    if (timeframe === "last24h") {
      return ["0-4h", "4-8h", "8-12h", "12-16h", "16-20h", "20-24h"];
    } else if (timeframe === "last7d") {
      return ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    } else if (timeframe === "last30d") {
      return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
    } else if (timeframe === "last1y") {
      return ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
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
      return data.map(d => `Week of ${d.x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    } else if (timeframe === "last1y") {
      return data.map(d => d.x.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
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
      const firstDate = new Date(item.x);
      const startOfWeek = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() - firstDate.getDay());
      return `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else if (timeframe === "last1y") {
      return item.x.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
        <TouchableOpacity style={styles.infoButton} onPress={() => setGuideModalVisible(true)}>
          <Ionicons name="information-circle-outline" size={40} color="#00796b" />
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
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              timeframe === "last1y" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setTimeframe("last1y")}
          >
            <Text
              style={[
                styles.dateFilterButtonText,
                timeframe === "last1y" && styles.dateFilterButtonTextActive,
              ]}
            >
              1Y
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
              <>
                <View style={styles.comparisonGraphContainer}>
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
                <TouchableOpacity style={styles.statsButton} onPress={() => setStatsModalVisible(true)}>
                  <Text style={styles.statsButtonText}>
                    {language === "English" ? "Statistics" : "Istatistika"}
                  </Text>
                </TouchableOpacity>
              </>
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

        <Modal
          animationType="slide"
          transparent={false}
          visible={statsModalVisible}
          onRequestClose={() => {
            setStatsModalVisible(!statsModalVisible);
          }}
        >
          <SafeAreaView style={styles.compareModalView}>
            <Text style={styles.compareModalTitle}>
              {language === "English" ? "Comparison Statistics" : "Istatistika ng Paghahambing"}
            </Text>
            <ScrollView>
              <View style={styles.statsTableContainer}>
                <View style={styles.statsTableHeader}>
                  <Text style={styles.statsTableHeaderText}>
                    {language === "English" ? "Metric" : "Metric"}
                  </Text>
                  {comparisonStats.map((stat, index) => (
                    <Text key={index} style={styles.statsTableHeaderText}>
                      {stat.label}
                    </Text>
                  ))}
                </View>
                <View style={styles.statsTableRow}>
                  <Text style={styles.statsTableCell}>
                    {language === "English" ? "Average" : "Average"}
                  </Text>
                  {comparisonStats.map((stat, index) => (
                    <Text key={index} style={styles.statsTableCell}>
                      {stat.avg ? `${stat.avg.toFixed(2)}` : "-"}
                    </Text>
                  ))}
                </View>
                <View style={styles.statsTableRow}>
                  <Text style={styles.statsTableCell}>
                    {language === "English" ? "Median" : "Median"}
                  </Text>
                  {comparisonStats.map((stat, index) => (
                    <Text key={index} style={styles.statsTableCell}>
                      {stat.median ? `${stat.median.toFixed(2)}` : "-"}
                    </Text>
                  ))}
                </View>
                <View style={styles.statsTableRow}>
                  <Text style={styles.statsTableCell}>
                    {language === "English" ? "St. Dev" : "St. Dev"}
                  </Text>
                  {comparisonStats.map((stat, index) => (
                    <Text key={index} style={styles.statsTableCell}>
                      {stat.stDev ? `${stat.stDev.toFixed(2)}` : "-"}
                    </Text>
                  ))}
                </View>
                <View style={styles.statsTableRow}>
                  <Text style={styles.statsTableCell}>
                    {language === "English" ? "Min" : "Min"}
                  </Text>
                  {comparisonStats.map((stat, index) => (
                    <Text key={index} style={styles.statsTableCell}>
                      {stat.min?.value ? `${stat.min.value.toFixed(2)}` : "-"}
                    </Text>
                  ))}
                </View>
                <View style={styles.statsTableRow}>
                  <Text style={styles.statsTableCell}>
                    {language === "English" ? "Max" : "Max"}
                  </Text>
                  {comparisonStats.map((stat, index) => (
                    <Text key={index} style={styles.statsTableCell}>
                      {stat.max?.value ? `${stat.max.value.toFixed(2)}` : "-"}
                    </Text>
                  ))}
                </View>
              </View>
              
              {finalInsights && (
                <View style={styles.statsTableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                      {language === "English" ? "Final Insights" : "Pangkalahatang Insight"}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Lowest Average" : "Pinakamababang Average"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {finalInsights.lowestAvg?.label}: {finalInsights.lowestAvg?.avg?.toFixed(2)} {unit}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Highest Average" : "Pinakamataas na Average"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {finalInsights.highestAvg?.label}: {finalInsights.highestAvg?.avg?.toFixed(2)} {unit}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Lowest Value" : "Pinakamababang Halaga"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {finalInsights.lowestMin?.label}: {finalInsights.lowestMin?.min?.value?.toFixed(2)} {unit}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {language === "English" ? "Highest Value" : "Pinakamataas na Halaga"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {finalInsights.highestMax?.label}: {finalInsights.highestMax?.max?.value?.toFixed(2)} {unit}
                    </Text>
                  </View>
                </View>
              )}

            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setStatsModalVisible(!statsModalVisible)}
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
          visible={guideModalVisible}
          onRequestClose={() => setGuideModalVisible(false)}
        >
          <SafeAreaView style={styles.guideModalView}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setGuideModalVisible(false)}
            >
              <Ionicons name="arrow-back-circle-outline" size={40} color="#00796b" />
            </TouchableOpacity>
            <Text style={styles.compareModalTitle}>
              {language === "English" ? "Page Guide" : "Gabay sa Pahina"}
            </Text>
            <ScrollView>
              {/* Main Chart Section */}
              <TouchableOpacity
                style={styles.guideSection}
                onPress={() => toggleDropdown("mainChart")}
              >
                <View style={styles.guideSectionHeader}>
                  <Text style={styles.guideSectionTitle}>
                    {language === "English" ? "Main Chart" : "Pangunahing Chart"}
                  </Text>
                  <Ionicons
                    name={dropdowns.mainChart ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#00796b"
                  />
                </View>
                {dropdowns.mainChart && (
                  <View style={styles.guideSectionContent}>
                    <Text style={styles.guideSectionText}>
                      {language === "English"
                        ? "This chart shows the water quality data over a selected time period. Tap the chart to view an expanded, scrollable version. Change the time period by tapping the buttons: "
                        : "Ipinapakita ng chart na ito ang data ng kalidad ng tubig sa napiling yugto ng panahon. I-tap ang chart upang makita ang pinalaki at mase-scroll na bersyon. Baguhin ang yugto ng panahon sa pamamagitan ng pag-tap sa mga button:"}
                      <Text style={styles.bold}>24H, 7D, 30D, 1Y</Text>.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Comparison Section */}
              <TouchableOpacity
                style={styles.guideSection}
                onPress={() => toggleDropdown("comparison")}
              >
                <View style={styles.guideSectionHeader}>
                  <Text style={styles.guideSectionTitle}>
                    {language === "English" ? "Comparison" : "Paghahambing"}
                  </Text>
                  <Ionicons
                    name={dropdowns.comparison ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#00796b"
                  />
                </View>
                {dropdowns.comparison && (
                  <View style={styles.guideSectionContent}>
                    <Text style={styles.guideSectionText}>
                      {language === "English"
                        ? "Tap the 'Compare Intervals' button to see how different time periods compare. Select two or more intervals from the list to view their trends on a multi-line chart."
                        : "I-tap ang 'Paghambingin ang mga Interval' na button para makita kung paano naghahambing ang iba't ibang yugto ng panahon. Pumili ng dalawa o higit pang interval mula sa listahan upang makita ang kanilang mga trend sa isang multi-line chart."}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Statistics Section */}
              <TouchableOpacity
                style={styles.guideSection}
                onPress={() => toggleDropdown("statistics")}
              >
                <View style={styles.guideSectionHeader}>
                  <Text style={styles.guideSectionTitle}>
                    {language === "English" ? "Statistics" : "Istatistika"}
                  </Text>
                  <Ionicons
                    name={dropdowns.statistics ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#00796b"
                  />
                </View>
                {dropdowns.statistics && (
                  <View style={styles.guideSectionContent}>
                    <Text style={styles.guideSectionText}>
                      {language === "English"
                        ? "After selecting intervals to compare, a 'Statistics' button will appear. This modal shows detailed metrics for each selected interval, including Average, Median, Standard Deviation, Minimum, and Maximum values."
                        : "Pagkatapos pumili ng mga interval na ihahambing, lalabas ang isang 'Istatistika' na button. Ipinapakita ng modal na ito ang mga detalyadong sukatan para sa bawat napiling interval, kasama ang Average, Median, Standard Deviation, Minimum, at Maximum na halaga."}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setGuideModalVisible(false)}
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