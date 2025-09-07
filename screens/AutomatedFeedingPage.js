import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
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
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    maxWidth: 440,
    width: "90%",
    marginBottom: 24,
    overflow: "hidden",
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
    maxWidth: 340,
    alignItems: "center",
  },
  statusMessage: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#00796b",
  },
  scheduleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f7fb",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#009688",
    marginBottom: 8,
    width: "100%",
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796b",
  },
  deleteButton: {
    backgroundColor: "#B22222",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  timeInput: {
    borderColor: "#009688",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    minWidth: 150,
    maxWidth: 300,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "#f7f7fb",
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#009688",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },
  dataDisplayCard: {
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 2,
    borderWidth: 1.5,
    borderColor: "#009688",
  },
  dataDisplayLabel: {
    fontSize: 16,
    color: "#009688",
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  dataDisplayText: {
    fontSize: 18,
    color: "#009688",
    fontWeight: "bold",
  },
  amPmContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
    maxWidth: 300,
  },
  amPmButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#009688",
    alignItems: "center",
    marginHorizontal: 5,
  },
  amPmButtonActive: {
    backgroundColor: "#009688",
  },
  amPmText: {
    color: "#009688",
    fontWeight: "bold",
  },
  amPmTextActive: {
    color: "#fff",
  },
  infoButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#009688",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  infoButtonText: {
    color: "#009688",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoModalText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 150, 136, 0.3)",
    paddingTop: 10,
    paddingBottom: 10,
    height: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "rgba(0, 150, 136, 0.8)",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796b",
  },
  activeTabText: {
    color: "#fff",
  },
  statsTable: {
    borderWidth: 1,
    borderColor: "#009688",
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#f7f7fb",
    alignSelf: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f7fa",
  },
  tableCell: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#00796b",
    flexShrink: 1,
    textAlign: 'right',
  },
  lastFeedingTimeValue: {
    fontWeight: "bold",
    color: "#00796b",
    flexShrink: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#009688",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#f7f7fb",
    overflow: 'hidden',
  },
});

export default function AutomatedFeedingPage({ language, settings }) {
  const [weightSensorData, setWeightSensorData] = useState(0);
  const [rotations, setRotations] = useState(6);
  const [feedPerRotation, setFeedPerRotation] = useState(0);
  const [newRotations, setNewRotations] = useState("");
  const [newFeedPerRotation, setNewFeedPerRotation] = useState("");
  const [feedType, setFeedType] = useState("");
  const [distributionMode, setDistributionMode] = useState("");
  const [isFeedingSystemOn, setIsFeedingSystemOn] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [feedingStats, setFeedingStats] = useState({
    totalFeedDispensed: 0,
    totalFeedings: 0,
    lastFeedingTime: null,
    avgFeedPerFeeding: 0,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [feedingSchedules, setFeedingSchedules] = useState([]);
  const [newScheduleTime, setNewScheduleTime] = useState("");
  const [amPmSelection, setAmPmSelection] = useState(null);
  const [amPmTimeInput, setAmPmTimeInput] = useState("");
  const [activeTab, setActiveTab] = useState("manual");

  const labels = {
    feedTypeLabel: language === "English" ? "Feed Type:" : "Uri ng Pakain:",
    selectFeedType:
      language === "English" ? "Select feed type..." : "Pumili ng uri ng pakain...",
    feedType1: language === "English" ? "Pellets" : "Pellet",
    feedType2: language === "English" ? "Crumble" : "Crumble",
    feedType3: language === "English" ? "Custom" : "Custom",
    distributionModeLabel:
      language === "English" ? "Feed Distribution Mode:" : "Paraan ng Distribusyon:",
    selectDistributionMode:
      language === "English" ? "Select distribution mode..." : "Pumili ng paraan ng distribusyon...",
    mode1: language === "English" ? "Controlled" : "Kontrolado",
    mode2: language === "English" ? "High" : "Mataas",
    currentRotationsLabel:
      language === "English" ? "Current set rotations:" : "Kasalukuyang Ikot:",
    feedPerRotationLabel:
      language === "English" ? "Feed per Rotation:" : "Pakain kada Ikot:",
    remainingFeedLabel: language === "English" ? "Remaining Feed:" : "Natitirang Pakain:",
    setRotationsPlaceholder:
      language === "English"
        ? "Set screw feeder rotations... (Number)"
        : "Ilagay ang Ikot ng Screw Feeder... (Numero)",
    setFeedPerRotationPlaceholder:
      language === "English"
        ? "Set feed per rotation... (Grams)"
        : "Ilagay ang Pakain Kada Ikot... (Gramo)",
    applyText: language === "English" ? "Apply" : "Ipatupad",
    defaultText: language === "English" ? "Default" : "Depolt",
    feedingStateLabel:
      language === "English" ? "Feeding System State:" : "Kalagayan ng Sistema ng Pagpapakain:",
    onText: language === "English" ? "ON" : "BUKAS",
    offText: language === "English" ? "OFF" : "SARADO",
    statsButtonText: language === "English" ? "Show Statistics" : "Ipakita ang Estadistika",
    closeText: language === "English" ? "Close" : "Isara",
    successAlert: language === "English" ? "Settings updated successfully." : "Matagumpay na na-update ang mga setting.",
    errorAlert: language === "English" ? "Failed to update settings." : "Hindi na-update ang mga setting.",
    invalidInputAlert:
      language === "English"
        ? "Please enter a valid number greater than 0."
        : "Maglagay ng wastong numero na higit sa 0.",
    defaultSetAlert:
      language === "English" ? "Rotations set to default (6)." : "Naitakda sa de-fault (6) ang ikot.",
    errorSetDefault:
      language === "English" ? "Failed to set default rotations." : "Hindi naitakda ang default na ikot.",
    errorFeedType:
      language === "English" ? "Failed to update feed type." : "Hindi na-update ang uri ng pakain.",
    errorDistributionMode:
      language === "English" ? "Failed to update distribution mode." : "Hindi na-update ang paraan ng pamamahagi.",
    errorFeedingState:
      language === "English" ? "Failed to update feeding state." : "Hindi na-update ang kalagayan ng pagpapakain.",
    totalFeedDispensed: language === "English" ? "Total Feed Dispensed:" : "Kabuuang Pakain:",
    totalFeedings: language === "English" ? "Total Feedings:" : "Kabuuang Pagpapakain:",
    avgFeedPerFeeding: language === "English" ? "Avg. Feed per Feeding:" : "Karaniwang Pakain kada Pagpapakain:",
    lastFeedingTime: language === "English" ? "Last Feeding Time:" : "Huling Oras ng Pagpapakain:",
    serverError: language === "English" ? "Cannot connect to server." : "Hindi makakonekta sa server.",
    feedingSchedulesLabel: language === "English" ? "Feeding Schedules:" : "Mga Iskedyul ng Pagpapakain:",
    addSchedulePlaceholder: language === "English" ? "Add time (HH:MM)" : "Magdagdag ng oras (HH:MM)",
    addScheduleButton: language === "English" ? "Add Schedule" : "Magdagdag ng Iskedyul",
    deleteButton: language === "English" ? "Delete" : "Burahin",
    invalidTimeFormat: language === "English" ? "Invalid time format. Please use HH:MM (e.g., 08:30)." : "Hindi wastong format ng oras. Gamitin ang HH:MM (halimbawa, 08:30).",
    timeAlreadyExists: language === "English" ? "This time is already scheduled." : "Naka-iskedyul na ang oras na ito.",
    scheduleUpdateError: language === "English" ? "Failed to update schedules." : "Hindi na-update ang mga iskedyul.",
    scheduleUpdateSuccess: language === "English" ? "Schedules updated successfully." : "Matagumpay na na-update ang mga iskedyul.",
    systemStatsTitle: language === "English" ? "System Statistics" : "Estadistika ng Sistema",
    errorFeedPerRotation: language === "English" ? "Failed to update feed per rotation." : "Hindi na-update ang pakain kada ikot.",
    addTimePrompt: language === "English" ? "Add new schedule time:" : "Magdagdag ng bagong iskedyul:",
    amPmButton: {
      AM: language === "English" ? "AM" : "AM",
      PM: language === "English" ? "PM" : "PM",
    },
    amPmPlaceholder: language === "English" ? "e.g., 08:30" : "hal., 08:30",
    invalidAmPmFormat: language === "English" ? "Invalid AM/PM time format. Please use HH:MM and a valid time (1-12)." : "Hindi wastong AM/PM format. Gamitin ang HH:MM at wastong oras (1-12).",
    infoModalTitle: language === "English" ? "Time Input Help" : "Tulong sa Oras ng Input",
    infoModalBody:
      language === "English"
        ? "You can enter a time using either 24-hour format or a 12-hour AM/PM format.\n\n" +
          "24-hour format (HH:MM): Use the text field directly. Example: 13:30 for 1:30 PM.\n\n" +
          "12-hour AM/PM format: Select 'AM' or 'PM' first, then enter the time (HH:MM). Example: 01:30 for 1:30 AM."
        : "Maaari kang maglagay ng oras gamit ang 24-oras na format o 12-oras na AM/PM format.\n\n" +
          "24-oras na format (HH:MM): Gamitin ang text field nang direkta. Halimbawa: 13:30 para sa 1:30 PM.\n\n" +
          "12-oras na AM/PM format: Piliin muna ang 'AM' o 'PM', pagkatapos ay ilagay ang oras (HH:MM). Halimbawa: 01:30 para sa 1:30 AM.",
    tabLabels: {
      manual: language === "English" ? "Status" : "Kalagayan",
      schedules: language === "English" ? "Schedules" : "Iskedyul",
      settings: language === "English" ? "Settings" : "Mga Setting",
    },
  };

  const apiEndpoint = settings?.apiEndpoint || "http://192.168.18.5:3000";

  // check serv. conncetion
  const checkServer = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/api/weight`, { method: "GET" });
      if (!res.ok) throw new Error("Server not responding");
      return true;
    } catch (err) {
      setStatusMessage(labels.serverError);
      return false;
    }
  };

  const convert24HourToAmPm = (time24) => {
    if (!time24 || typeof time24 !== "string" || time24.indexOf(":") === -1) {
      return time24;
    }
    const [hours24, minutes] = time24.split(":");
    let hours = parseInt(hours24, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes.padStart(2, "0");
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const convertAmPmTo24Hour = (time, amPm) => {
    let [hours, minutes] = time.split(":").map(Number);
    if (amPm === "PM" && hours !== 12) {
      hours += 12;
    } else if (amPm === "AM" && hours === 12) {
      hours = 0;
    }
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  };

  const validateAmPmTime = (time) => {
    const pattern = /^(1[0-2]|0?[1-9]):([0-5]?[0-9])$/;
    return pattern.test(time);
  };

  const validateTime = (time) => {
    const pattern = /^(?:2[0-3]|[01]?[0-9]):(?:[0-5]?[0-9])$/;
    return pattern.test(time);
  };
  // fetch all relevant data sigma
  const fetchAllFeedingData = async () => {
    try {
      const [
        weightRes,
        rotationsRes,
        feedPerRotationRes,
        feedTypeRes,
        distModeRes,
        feedingToggleRes,
        schedulesRes,
        statsRes,
      ] = await Promise.all([
        fetch(`${apiEndpoint}/api/weight`),
        fetch(`${apiEndpoint}/api/rotations`),
        fetch(`${apiEndpoint}/api/feedperrotation`),
        fetch(`${apiEndpoint}/api/feedtype`),
        fetch(`${apiEndpoint}/api/distributionmode`),
        fetch(`${apiEndpoint}/api/feedingtoggle`),
        fetch(`${apiEndpoint}/api/feeding-schedules`),
        fetch(`${apiEndpoint}/api/feeding-stats`),
      ]);

      const weightData = await weightRes.json();
      setWeightSensorData(weightData.weight || 0);

      const rotationsData = await rotationsRes.json();
      setRotations(rotationsData.rotations || 6);

      const feedPerRotationData = await feedPerRotationRes.json();
      setFeedPerRotation(feedPerRotationData.feedPerRotation || 0);

      const feedTypeData = await feedTypeRes.json();
      setFeedType(feedTypeData.feedType || "");

      const distModeData = await distModeRes.json();
      setDistributionMode(distModeData.distributionMode || "");

      const feedingToggleData = await feedingToggleRes.json();
      setIsFeedingSystemOn(feedingToggleData.isFeeding ?? false);

      const schedulesData = await schedulesRes.json();
      // after fetching, convert then display bababababababa
      const formattedSchedules = Array.isArray(schedulesData.scheduleTimes)
        ? schedulesData.scheduleTimes.map((time24) => ({
            time24,
            display: convert24HourToAmPm(time24),
          }))
        : [];
      setFeedingSchedules(formattedSchedules.sort((a, b) => a.time24.localeCompare(b.time24)));

      const statsData = await statsRes.json();
      setFeedingStats(
        statsData || {
          totalFeedDispensed: 0,
          totalFeedings: 0,
          lastFeedingTime: null,
          avgFeedPerFeeding: 0,
        }
      );

      setStatusMessage("");
    } catch (error) {
      setStatusMessage("Error fetching data.");
      console.error("Error fetching feeding data:", error);
    }
  };

  useEffect(() => {
    fetchAllFeedingData();
    const intervalId = setInterval(fetchAllFeedingData, 3000);
    return () => clearInterval(intervalId);
  }, [apiEndpoint]);

  const handleFeedTypeChange = async (value) => {
    const prev = feedType;
    setFeedType(value);
    try {
      const response = await fetch(`${apiEndpoint}/api/feedtype`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedType: value }),
      });
      if (!response.ok) throw new Error("Failed to update feed type");
      setStatusMessage(labels.successAlert);
      fetchAllFeedingData();
    } catch (err) {
      setFeedType(prev);
      setStatusMessage(labels.errorFeedType);
      console.error("Error updating feed type:", err);
    }
  };

  const handleDistributionModeChange = async (value) => {
    const prev = distributionMode;
    setDistributionMode(value);
    try {
      const response = await fetch(`${apiEndpoint}/api/distributionmode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distributionMode: value }),
      });
      if (!response.ok) throw new Error("Failed to update distribution mode");
      setStatusMessage(labels.successAlert);
      fetchAllFeedingData();
    } catch (err) {
      setDistributionMode(prev);
      setStatusMessage(labels.errorDistributionMode);
      console.error("Error updating distribution mode:", err);
    }
  };

  const handleApply = async () => {
    const rotationsValue = parseInt(newRotations);
    const feedPerRotationValue = parseFloat(newFeedPerRotation);

    let updatedSettings = {};
    let hasChanges = false;

    if (!isNaN(rotationsValue) && rotationsValue > 0) {
      updatedSettings.rotations = rotationsValue;
      hasChanges = true;
    } else if (newRotations.trim() !== "") {
      Alert.alert(labels.invalidInputAlert);
      return;
    }

    if (!isNaN(feedPerRotationValue) && feedPerRotationValue >= 0) {
      updatedSettings.feedPerRotation = feedPerRotationValue;
      hasChanges = true;
    } else if (newFeedPerRotation.trim() !== "") {
      Alert.alert(labels.invalidInputAlert);
      return;
    }

    if (hasChanges) {
      try {
        const response = await fetch(`${apiEndpoint}/api/feeding-settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSettings),
        });
        if (!response.ok) throw new Error("Failed to update settings");

        if (updatedSettings.rotations !== undefined) setRotations(updatedSettings.rotations);
        if (updatedSettings.feedPerRotation !== undefined) setFeedPerRotation(updatedSettings.feedPerRotation);

        setNewRotations("");
        setNewFeedPerRotation("");
        setStatusMessage(labels.successAlert);
        fetchAllFeedingData();
      } catch (error) {
        setStatusMessage(labels.errorAlert);
        console.error("Error applying settings:", error);
      }
    } else {
      Alert.alert(labels.invalidInputAlert);
    }
  };

  const handleDefault = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/api/feeding-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rotations: 6, feedPerRotation: 0 }),
      });
      if (!response.ok) throw new Error("Failed to set default rotations and feed per rotation");
      setRotations(6);
      setFeedPerRotation(0);
      setNewRotations("");
      setNewFeedPerRotation("");
      setStatusMessage(labels.defaultSetAlert);
      fetchAllFeedingData();
    } catch (error) {
      setStatusMessage(labels.errorSetDefault);
      console.error("Error setting default rotations and feed per rotation:", error);
    }
  };

  const handleToggleFeeding = async (newValue) => {
    setIsFeedingSystemOn(newValue);
    try {
      const response = await fetch(`${apiEndpoint}/api/feedingtoggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeeding: newValue }),
      });
      if (!response.ok) throw new Error("Failed to update feeding state");
      setStatusMessage(labels.successAlert);
      fetchAllFeedingData();
    } catch (error) {
      setStatusMessage(labels.errorFeedingState);
      setIsFeedingSystemOn(!newValue);
      console.error("Error toggling feeding state:", error);
    }
  };

  function formatDateTime(dt) {
    if (!dt) return "--";
    const date = new Date(dt);
    return date.toLocaleString();
  }

  const updateSchedulesOnBackend = async (updatedSchedules) => {
    try {
      const response = await fetch(`${apiEndpoint}/api/feeding-schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleTimes: updatedSchedules.map((s) => s.time24).sort() }),
      });
      if (!response.ok) throw new Error("Failed to update schedules on backend");
      setStatusMessage(labels.scheduleUpdateSuccess);
      fetchAllFeedingData();
    } catch (error) {
      setStatusMessage(labels.scheduleUpdateError);
      console.error("Error updating schedules:", error);
    }
  };

  const handleAddSchedule = async () => {
    let timeToAdd = "";
    if (amPmSelection) {
      if (!amPmTimeInput.trim()) return;
      if (!validateAmPmTime(amPmTimeInput)) {
        Alert.alert(labels.invalidAmPmFormat);
        return;
      }
      timeToAdd = convertAmPmTo24Hour(amPmTimeInput, amPmSelection);
    } else {
      if (!newScheduleTime.trim()) return;
      if (!validateTime(newScheduleTime)) {
        Alert.alert(labels.invalidTimeFormat);
        return;
      }
      timeToAdd = newScheduleTime;
    }

    if (feedingSchedules.some((schedule) => schedule.time24 === timeToAdd)) {
      Alert.alert(labels.timeAlreadyExists);
      return;
    }

    const newSchedule = {
      time24: timeToAdd,
      display: convert24HourToAmPm(timeToAdd),
    };
    const updatedSchedules = [...feedingSchedules, newSchedule];
    setNewScheduleTime("");
    setAmPmTimeInput("");
    setAmPmSelection(null);
    setFeedingSchedules(updatedSchedules.sort((a, b) => a.time24.localeCompare(b.time24)));
    await updateSchedulesOnBackend(updatedSchedules);
  };

  const confirmAndDeleteSchedule = (timeToDelete) => {
    Alert.alert(
      language === "English" ? "Confirm Deletion" : "Kumpirmahin ang Pagbura",
      language === "English"
        ? "Are you sure you want to delete this schedule?"
        : "Sigurado ka bang gusto mong burahin ang iskedyul na ito?",
      [
        {
          text: language === "English" ? "Cancel" : "Kanselahin",
          style: "cancel",
        },
        {
          text: language === "English" ? "Delete" : "Burahin",
          onPress: () => handleDeleteSchedule(timeToDelete),
        },
      ]
    );
  };

  const handleDeleteSchedule = async (timeToDelete) => {
    const updatedSchedules = feedingSchedules.filter((schedule) => schedule.time24 !== timeToDelete);
    setFeedingSchedules(updatedSchedules.sort((a, b) => a.time24.localeCompare(b.time24)));
    await updateSchedulesOnBackend(updatedSchedules);
  };

  const renderStatusContent = () => (
    <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
      {/* Remaining Feed Display */}
      <Text style={styles.dataDisplayLabel}>{labels.remainingFeedLabel}</Text>
      <View style={[styles.dataDisplayCard, { alignSelf: 'center' }]}>
        <Text style={styles.dataDisplayText}>{weightSensorData.toFixed(2)} g</Text>
      </View>
      {/* Feeding System Toggle */}
      <View style={{ alignItems: "center", marginVertical: 10, width: "100%" }}>
        <Text
          style={{
            fontSize: 16,
            color: "#009688",
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          {labels.feedingStateLabel}
        </Text>
        <Switch
          trackColor={{ false: "#B22222", true: "#4CAF50" }}
          thumbColor={"#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggleFeeding}
          value={isFeedingSystemOn}
          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
        />
        <Text
          style={{
            marginTop: 8,
            color: isFeedingSystemOn ? "#4CAF50" : "#B22222",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {isFeedingSystemOn ? labels.onText : labels.offText}
        </Text>
      </View>
      {/* Statistics Table */}
      <View style={styles.statsTable}>
        <View style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#e0f7fa' }}>
          <Text style={[styles.tableHeader, { fontSize: 18, textAlign: 'center' }]}>
            {labels.systemStatsTitle}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{labels.totalFeedDispensed}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {feedingStats.totalFeedDispensed?.toFixed(2) || 0} g
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{labels.totalFeedings}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {feedingStats.totalFeedings || 0}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{labels.avgFeedPerFeeding}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {feedingStats.avgFeedPerFeeding?.toFixed(2) || 0} g
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{labels.lastFeedingTime}</Text>
          <Text style={[styles.lastFeedingTimeValue]}>
            {formatDateTime(feedingStats.lastFeedingTime)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSchedulesContent = () => (
    <View style={{ flex: 1, width: "100%", alignItems: "center", marginTop: 20 }}>
      <Text
        style={{
          fontSize: 18,
          color: "#009688",
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        {labels.feedingSchedulesLabel}
      </Text>
      <View style={{ width: "100%", maxWidth: 300, alignSelf: 'center', flex: 1 }}>
        {feedingSchedules.length > 4 ? (
          <ScrollView style={{ maxHeight: 200, marginBottom: 10 }}>
            {feedingSchedules.map((schedule, index) => (
              <View key={index} style={styles.scheduleContainer}>
                <Text style={styles.scheduleTime}>
                  {schedule.display || (language === "English" ? "Invalid time" : "Hindi wastong oras")}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmAndDeleteSchedule(schedule.time24)}
                >
                  <Text style={styles.deleteButtonText}>{labels.deleteButton}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={{ marginBottom: 10 }}>
            {feedingSchedules.length > 0 ? (
              feedingSchedules.map((schedule, index) => (
                <View key={index} style={styles.scheduleContainer}>
                  <Text style={styles.scheduleTime}>
                    {schedule.display || (language === "English" ? "Invalid time" : "Hindi wastong oras")}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmAndDeleteSchedule(schedule.time24)}
                  >
                    <Text style={styles.deleteButtonText}>{labels.deleteButton}</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "#666", marginBottom: 10 }}>
                {language === "English" ? "No schedules set." : "Walang naka-iskedyul."}
              </Text>
            )}
          </View>
        )}

        <Text
          style={{
            fontSize: 16,
            color: "#009688",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          {labels.addTimePrompt}
        </Text>

        {/* AM/PM Buttons */}
        <View style={styles.amPmContainer}>
          <TouchableOpacity
            style={[
              styles.amPmButton,
              amPmSelection === "AM" && styles.amPmButtonActive,
            ]}
            onPress={() => {
              setAmPmSelection("AM");
              setNewScheduleTime("");
            }}
          >
            <Text
              style={[
                styles.amPmText,
                amPmSelection === "AM" && styles.amPmTextActive,
              ]}
            >
              {labels.amPmButton.AM}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.amPmButton,
              amPmSelection === "PM" && styles.amPmButtonActive,
            ]}
            onPress={() => {
              setAmPmSelection("PM");
              setNewScheduleTime("");
            }}
          >
            <Text
              style={[
                styles.amPmText,
                amPmSelection === "PM" && styles.amPmTextActive,
              ]}
            >
              {labels.amPmButton.PM}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Time Input Field */}
        {amPmSelection ? (
          <TextInput
            style={styles.timeInput}
            value={amPmTimeInput}
            onChangeText={(text) =>
              setAmPmTimeInput(
                text.replace(/[^0-9:]/g, "").replace(/^(\d{2})(\d)/, "$1:$2").substring(0, 5)
              )
            }
            placeholder={labels.amPmPlaceholder}
            keyboardType="number-pad"
            maxLength={5}
          />
        ) : (
          <TextInput
            style={styles.timeInput}
            value={newScheduleTime}
            onChangeText={(text) =>
              setNewScheduleTime(
                text.replace(/[^0-9:]/g, "").replace(/^(\d{2})(\d)/, "$1:$2").substring(0, 5)
              )
            }
            placeholder={labels.addSchedulePlaceholder}
            keyboardType="number-pad"
            maxLength={5}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
          <Text style={styles.addButtonText}>{labels.addScheduleButton}</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.infoButton} onPress={() => setShowInfoModal(true)}>
            <Text style={styles.infoButtonText}>?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSettingsContent = () => (
    <View style={{ flex: 1, width: "100%", alignItems: "center", marginTop: 20 }}>
      {/* Feed Type Picker */}
      <Text style={styles.dataDisplayLabel}>{labels.feedTypeLabel}</Text>
      <View
        style={styles.pickerContainer}
      >
        <Picker
          selectedValue={feedType}
          onValueChange={handleFeedTypeChange}
          style={{ width: "100%" }}
        >
          <Picker.Item label={labels.selectFeedType} value="" />
          <Picker.Item label={labels.feedType1} value="pellets" />
          <Picker.Item label={labels.feedType2} value="crumble" />
        </Picker>
      </View>
      {/* Distribution Mode Picker */}
      <Text style={styles.dataDisplayLabel}>{labels.distributionModeLabel}</Text>
      <View
        style={styles.pickerContainer}
      >
        <Picker
          selectedValue={distributionMode}
          onValueChange={handleDistributionModeChange}
          style={{ width: "100%" }}
        >
          <Picker.Item label={labels.selectDistributionMode} value="" />
          <Picker.Item label="Controlled" value="controlled" />
          <Picker.Item label="High" value="high" />
        </Picker>
      </View>
      {/* Current Rotations Display */}
      <Text style={styles.dataDisplayLabel}>{labels.currentRotationsLabel}</Text>
      <View style={[styles.dataDisplayCard, { alignSelf: 'center' }]}>
        <Text style={styles.dataDisplayText}>{rotations}</Text>
      </View>
      {/* Rotations Input */}
      <TextInput
        style={styles.timeInput}
        value={newRotations}
        onChangeText={(text) => setNewRotations(text.replace(/[^0-9]/g, ""))}
        placeholder={labels.setRotationsPlaceholder}
        keyboardType="number-pad"
      />

      {/* Feed per Rotation Input */}
      <Text style={styles.dataDisplayLabel}>{labels.feedPerRotationLabel}</Text>
      <TextInput
        style={styles.timeInput}
        value={newFeedPerRotation}
        onChangeText={(text) => setNewFeedPerRotation(text.replace(/[^0-9.]/g, ""))}
        placeholder={labels.setFeedPerRotationPlaceholder}
        keyboardType="numeric"
      />
      <View style={[styles.dataDisplayCard, { alignSelf: 'center' }]}>
        <Text style={styles.dataDisplayText}>{feedPerRotation.toFixed(2)} g</Text>
      </View>
      {/* Apply/Default Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 14,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            marginRight: 8,
            backgroundColor: "#fff",
            borderColor: "#009688",
            borderWidth: 2,
            borderRadius: 30,
            paddingVertical: 10,
            alignItems: "center",
          }}
          onPress={handleApply}
        >
          <Text
            style={{
              color: "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}
          >
            {labels.applyText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: 8,
            backgroundColor: "#fff",
            borderColor: "#009688",
            borderWidth: 2,
            borderRadius: 30,
            paddingVertical: 10,
            alignItems: "center",
          }}
          onPress={handleDefault}
        >
          <Text
            style={{
              color: "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}
          >
            {labels.defaultText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "manual":
        return (
          <View style={{ flex: 1, padding: 24, paddingTop: 60, width: "100%", alignItems: 'center', justifyContent: 'flex-start' }}>
            {renderStatusContent()}
          </View>
        );
      case "schedules":
        return (
          <View style={{ flex: 1, padding: 24, paddingTop: 60, width: "100%", alignItems: 'center', justifyContent: 'flex-start' }}>
            {renderSchedulesContent()}
          </View>
        );
      case "settings":
        return (
          <View style={{ flex: 1, padding: 24, paddingTop: 60, width: "100%", alignItems: 'center', justifyContent: 'flex-start' }}>
            {renderSettingsContent()}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />
      <View style={styles.glassCard}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "manual" && styles.activeTabButton]}
            onPress={() => setActiveTab("manual")}
          >
            <Text style={[styles.tabText, activeTab === "manual" && styles.activeTabText]}>
              {labels.tabLabels.manual}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "schedules" && styles.activeTabButton]}
            onPress={() => setActiveTab("schedules")}
          >
            <Text style={[styles.tabText, activeTab === "schedules" && styles.activeTabText]}>
              {labels.tabLabels.schedules}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "settings" && styles.activeTabButton]}
            onPress={() => setActiveTab("settings")}
          >
            <Text style={[styles.tabText, activeTab === "settings" && styles.activeTabText]}>
              {labels.tabLabels.settings}
            </Text>
          </TouchableOpacity>
        </View>
        {renderContent()}
        {/* Status Message */}
        {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}
        {/* Modal for Info */}
        <Modal
          visible={showInfoModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text
                style={{
                  color: "#009688",
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {labels.infoModalTitle}
              </Text>
              <Text style={styles.infoModalText}>{labels.infoModalBody}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#009688",
                  borderRadius: 8,
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  marginTop: 4,
                }}
                onPress={() => setShowInfoModal(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
                  {labels.closeText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}