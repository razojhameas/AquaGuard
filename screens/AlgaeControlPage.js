import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";

const styles = StyleSheet.create({
  algaeControlPage: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    minHeight: Dimensions.get("window").height,
    paddingVertical: 24,
    paddingBottom: 60,
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
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    maxWidth: 440,
    width: "98%",
    marginBottom: 24,
    justifyContent: "flex-start",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    minWidth: 300,
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#009688",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  statusMessage: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#00796b",
  },
});

export default function AlgaeControlPage({ language, settings }) {
  const [intervalMinutes, setIntervalMinutes] = useState(0);
  const [newIntervalInput, setNewIntervalInput] = useState("");
  const [isTransducerOn, setIsTransducerOn] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [algaeStats, setAlgaeStats] = useState({
    totalActivations: 0,
    totalMinutes: 0,
    lastActivation: null,
    avgInterval: 0,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);

  const labels = {
    promptText: language === "English"
      ? "Set ultrasound interval... (Minutes)"
      : "Ilagay ang nais na interbal.. (Minuto)",
    applyButtonText: language === "English" ? "Apply" : "I-apply",
    defaultButtonText: language === "English" ? "Default" : "Depolt",
    explanation: language === "English"
      ? "This prompt only accepts minutes."
      : "Ang prompt na ito ay tumatanggap lamang ng minuto.",
    counterText: language === "English" ? "Current set interval:" : "Kasalukuyang interbal:",
    transducerStateLabel: language === "English" ? "Transducer State:" : "Kalagayan ng Transducer:",
    onText: language === "English" ? "ON" : "BUKAS",
    offText: language === "English" ? "OFF" : "SARADO",
    statsButtonText: language === "English" ? "Show Statistics" : "Ipakita ang Estadistika",
    closeText: language === "English" ? "Close" : "Isara",
    totalActivations: language === "English" ? "Total Activations:" : "Kabuuang Pag-activate:",
    totalMinutesActive: language === "English" ? "Total Minutes Active:" : "Kabuuang Minuto Aktibo:",
    avgInterval: language === "English" ? "Average Interval (min):" : "Karaniwang Interbal (min):",
    lastActivation: language === "English" ? "Last Activation:" : "Huling Pag-activate:",
    updateSuccess: language === "English" ? "Settings updated successfully." : "Matagumpay na na-update ang mga setting.",
    updateFailed: language === "English" ? "Failed to update settings." : "Hindi na-update ang mga setting.",
    invalidInput: language === "English" ? "Invalid Input" : "Di-wastong Input",
    invalidInputMessage: language === "English" ? "Please enter a valid number for the interval." : "Maglagay ng wastong numero para sa interbal.",
    serverError: language === "English" ? "Cannot connect to server." : "Hindi makakonekta sa server.",
  };

  // Use settings.apiEndpoint or fallback to localhost
  const apiEndpoint = settings?.apiEndpoint || "http://192.168.18.5:3000";

  // Helper to check server connection
  const checkServer = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/api/interval`, { method: "GET" });
      if (!res.ok) throw new Error("Server not responding");
      return true;
    } catch (err) {
      setStatusMessage(labels.serverError);
      return false;
    }
  };

  // Fetch all relevant data
  const fetchAllAlgaeControlData = async () => {
    if (!(await checkServer())) return;
    try {
      const [intervalRes, transducerStateRes, statsRes] = await Promise.all([
        fetch(`${apiEndpoint}/api/interval`),
        fetch(`${apiEndpoint}/api/transducer-state`),
        fetch(`${apiEndpoint}/api/algae-stats`),
      ]);

      const intervalData = await intervalRes.json();
      setIntervalMinutes(Math.round((intervalData.interval || 0) / 60000));

      const transducerStateData = await transducerStateRes.json();
      setIsTransducerOn(transducerStateData.isTransducerOn ?? false);

      const statsData = await statsRes.json();
      setAlgaeStats(statsData || { totalActivations: 0, totalMinutes: 0, lastActivation: null, avgInterval: 0 });

      setStatusMessage("");
    } catch (error) {
      setStatusMessage(labels.updateFailed);
      console.error("Error fetching algae control data:", error);
    }
  };

  useEffect(() => {
    fetchAllAlgaeControlData();
    const intervalId = setInterval(fetchAllAlgaeControlData, 3000);
    return () => clearInterval(intervalId);
  }, [apiEndpoint]);

  const handleApply = async () => {
    const value = parseInt(newIntervalInput);
    if (!isNaN(value) && value >= 0) {
      const newIntervalMs = value * 60 * 1000;
      try {
        const response = await fetch(`${apiEndpoint}/api/interval`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interval: newIntervalMs }),
        });
        if (!response.ok) throw new Error("Failed to update interval");
        setIntervalMinutes(value);
        setNewIntervalInput("");
        setStatusMessage(labels.updateSuccess);
        fetchAllAlgaeControlData();
      } catch (error) {
        setStatusMessage(labels.updateFailed);
        console.error("Error applying interval:", error);
      }
    } else {
      Alert.alert(labels.invalidInput, labels.invalidInputMessage);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/api/interval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: 0 }),
      });
      if (!response.ok) throw new Error("Failed to reset interval");
      setIntervalMinutes(0);
      setNewIntervalInput("");
      setStatusMessage(labels.updateSuccess);
      fetchAllAlgaeControlData();
    } catch (error) {
      setStatusMessage(labels.updateFailed);
      console.error("Error resetting interval:", error);
    }
  };

  const handleTransducerToggle = async (newValue) => {
    setIsTransducerOn(newValue);
    try {
      const response = await fetch(`${apiEndpoint}/api/transducer-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTransducerOn: newValue }),
      });
      if (!response.ok) throw new Error("Failed to update transducer state");
      setStatusMessage(labels.updateSuccess);
      fetchAllAlgaeControlData();
    } catch (error) {
      setStatusMessage(labels.updateFailed);
      setIsTransducerOn(!newValue);
      console.error("Error toggling transducer state:", error);
    }
  };

  function formatDateTime(dt) {
    if (!dt) return "--";
    const date = new Date(dt);
    return date.toLocaleString();
  }

  const fetchAlgaeStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`${apiEndpoint}/api/algae-stats`);
      if (!response.ok) throw new Error("Failed to fetch algae stats");
      const data = await response.json();
      setAlgaeStats(data || { totalActivations: 0, totalMinutes: 0, lastActivation: null, avgInterval: 0 });
    } catch (error) {
      setAlgaeStats({ totalActivations: 0, totalMinutes: 0, lastActivation: null, avgInterval: 0 });
      setStatusMessage(labels.updateFailed);
      console.error("Error fetching algae stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.algaeControlPage}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <View style={styles.glassCard}>
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#009688",
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 10,
            elevation: 2,
          }}
          onPress={() => {
            setShowStatsModal(true);
            fetchAlgaeStats();
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
            {labels.statsButtonText}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showStatsModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowStatsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={{ color: "#009688", fontWeight: "bold", fontSize: 18, marginBottom: 10, textAlign: "center" }}>
                {language === "English" ? "Algae Control Statistics" : "Estadistika ng Kontrol ng Algae"}
              </Text>
              {loadingStats ? (
                <ActivityIndicator size="large" color="#00796b" />
              ) : (
                <>
                  <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                    {labels.totalActivations} <Text style={{ fontWeight: "bold" }}>{algaeStats.totalActivations || 0}</Text>
                  </Text>
                  <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                    {labels.totalMinutesActive} <Text style={{ fontWeight: "bold" }}>{algaeStats.totalMinutes?.toFixed(2) || 0}</Text>
                  </Text>
                  <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                    {labels.avgInterval} <Text style={{ fontWeight: "bold" }}>{algaeStats.avgInterval?.toFixed(2) || 0}</Text>
                  </Text>
                  <Text style={{ fontSize: 15, color: "#333", marginBottom: 10 }}>
                    {labels.lastActivation} <Text style={{ fontWeight: "bold" }}>{formatDateTime(algaeStats.lastActivation)}</Text>
                  </Text>
                </>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: "#009688",
                  borderRadius: 8,
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  marginTop: 4,
                  elevation: 2,
                }}
                onPress={() => setShowStatsModal(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
                  {labels.closeText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={{
          width: "100%",
          alignItems: "center",
          marginBottom: 14,
        }}>
          <Text style={{
            fontSize: 16,
            color: "#009688",
            fontWeight: "bold",
            marginBottom: 2,
            textAlign: "center",
            width: "100%",
          }}>
            {labels.counterText}
          </Text>
          <View style={{
            minWidth: 80,
            paddingVertical: 8,
            paddingHorizontal: 18,
            backgroundColor: "#e0f7fa",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
            borderWidth: 1.5,
            borderColor: "#009688",
          }}>
            <Text style={{
              fontSize: 18,
              color: "#009688",
              fontWeight: "bold",
            }}>
              {intervalMinutes} {language === "English" ? "minute/s" : "minuto"}
            </Text>
          </View>
        </View>
        <TextInput
          style={{
            borderColor: "#009688",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            width: "100%",
            minWidth: 150,
            maxWidth: 300,
            textAlign: "center",
            alignSelf: "center",
            backgroundColor: "#f7f7fb",
            fontSize: 15,
          }}
          value={newIntervalInput}
          onChangeText={(text) => setNewIntervalInput(text.replace(/[^0-9]/g, ""))}
          placeholder={labels.promptText}
          keyboardType="number-pad"
        />
        <Text
          style={{
            marginBottom: 10,
            marginTop: 2,
            fontSize: 14,
            textAlign: "center",
            color: "#009688",
          }}
        >
          {labels.explanation}
        </Text>
        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 14,
          width: "100%"
        }}>
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
              shadowColor: "#009688",
              shadowOpacity: 0.08,
              elevation: 2,
            }}
            onPress={handleApply}
          >
            <Text style={{
              color: "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}>
              {labels.applyButtonText}
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
              shadowColor: "#009688",
              shadowOpacity: 0.08,
              elevation: 2,
            }}
            onPress={handleReset}
          >
            <Text style={{
              color: "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}>
              {labels.defaultButtonText}
            </Text>
          </TouchableOpacity>
        </View>

        {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}

        <View style={{ alignItems: "center", marginVertical: 10, width: "100%" }}>
          <Text style={{ fontSize: 16, color: "#009688", fontWeight: "bold", marginBottom: 6 }}>
            {labels.transducerStateLabel}
          </Text>
          <Switch
            trackColor={{ false: "#B22222", true: "#4CAF50" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleTransducerToggle}
            value={isTransducerOn}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
          <Text style={{ marginTop: 8, color: isTransducerOn ? "#4CAF50" : "#B22222", fontWeight: "bold", textAlign: "center" }}>
            {isTransducerOn ? labels.onText : labels.offText}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}