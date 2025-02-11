// AlgaeControlPage.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../styles"; // Adjust this path according to your project structure

const AlgaeControlPage = ({ navigation }) => {
  const [interval, setInterval] = useState(0);
  const [newInterval, setNewInterval] = useState("");

  const language = "English"; // Set your language logic here or pass it as a prop

  const promptText =
    language === "English"
      ? "Set ultrasound interval... (Number)"
      : "Ilagay ang nais na interbal.. (Numero)";
  const applyButtonText = language === "English" ? "Apply" : "I-apply";
  const startButtonText = language === "English" ? "Start" : "Simulan";
  const stopButtonText = language === "English" ? "Stop" : "Tigilan";
  const defaultButtonText = language === "English" ? "Default" : "Depolt";
  const explanation =
    language === "English"
      ? "This prompt only accepts minutes."
      : "Ang prompt na ito ay tumatanggap lamang ng minuto.";
  const counterText =
    language === "English" ? "Current set interval:" : "Kasalukuyang interbal:";

  useEffect(() => {
    fetch("/api/interval")
      .then((response) => response.json())
      .then((data) => setInterval(data.interval))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    return () => {
      fetch("/api/interval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    };
  }, [interval]);

  const handleApply = () => {
    const newIntervalValue = parseInt(newInterval) * 60000;
    setInterval(newIntervalValue);

    fetch("/api/interval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interval: newIntervalValue }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    console.log("Apply button clicked, interval set to:", newInterval);
  };

  const handleReset = () => {
    setInterval("0");
    setNewInterval("0");
    console.log("Default button clicked, interval set to default value (0)");
  };

  const handleStart = () => {
    fetch("/api/start-feeding")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
    console.log("Start button clicked, ultrasonic transducer started");
  };

  const handleStop = () => {
    fetch("/api/stop-feeding")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
    console.log("Stop button clicked, ultrasonic transducer stopped");
  };

  return (
    <View style={styles.emptyPage}>
      <View style={styles.inputContainer}>
        <Text style={styles.tableHeader0}>{counterText}</Text>
        <Text style={[styles.tableData0, { marginBottom: 10 }]}>
          {interval / 60000} minutes
        </Text>
        <TextInput
          style={[
            styles.prompt,
            {
              borderColor: "#3a3fbd",
              borderWidth: 1,
              borderRadius: 5,
              padding: 20,
            },
          ]}
          value={newInterval}
          onChangeText={(text) => setNewInterval(text.replace(/[^0-9]/g, ""))}
          placeholder={promptText}
          keyboardType="number-pad"
        />
        <Text
          style={[
            styles.explanation,
            {
              marginBottom: 10,
              marginTop: 10,
              fontSize: 15,
              textAlign: "center",
            },
          ]}
        >
          {explanation}
        </Text>
        <TouchableOpacity style={styles.button1} onPress={handleApply}>
          <Text style={styles.buttonText1}>{applyButtonText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button2} onPress={handleStart}>
          <Text style={styles.buttonText1}>{startButtonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={handleStop}>
          <Text style={styles.buttonText1}>{stopButtonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={handleReset}>
          <Text style={styles.buttonText1}>{defaultButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AlgaeControlPage;
