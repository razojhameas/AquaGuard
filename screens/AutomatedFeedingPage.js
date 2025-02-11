// AutomatedFeedingPage.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import styles from "../styles"; // Ensure you adjust this path according to your project structure

const AutomatedFeedingPage = ({ navigation }) => {
  const [feedAmount, setFeedAmount] = useState(0);
  const [isFeeding, setIsFeeding] = useState(false);
  const [weightSensorData, setWeightSensorData] = useState(0);

  const language = "English"; // Set your language logic here or pass it as a prop

  const text1 =
    language === "English"
      ? "Automated Feeding Page"
      : "Automatikong Pagpapakain";
  const text2 = language === "English" ? "Start Feeding" : "Simulan";
  const text3 = language === "English" ? "Stop Feeding" : "Itigil";
  const text4 =
    language === "English" ? "Remaining Feed Amount" : "Natitirang Pakain";

  useEffect(() => {
    axios
      .get("/api/weight")
      .then((response) => {
        setWeightSensorData(response.data.weight);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleStartFeeding = () => {
    setIsFeeding(true);
    axios
      .post("/api/start-feeding")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStopFeeding = () => {
    setIsFeeding(false);
    axios
      .post("/api/stop-feeding")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getFeedAmountColor = () => {
    if (feedAmount <= 0) {
      return "red";
    } else if (feedAmount <= 10) {
      return "orange";
    } else {
      return "black";
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get("/api/data")
        .then((response) => {
          setWeightSensorData(response.data.weight);
          setFeedAmount(response.data.weight); // Update feed amount with weight sensor data
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000); // Update every 1 second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.automatedFeedingPage}>
      <Text style={styles.pageTitle}>{text1}</Text>
      <View style={styles.buttonContainer1}>
        <TouchableOpacity style={styles.button2} onPress={handleStartFeeding}>
          <Text style={styles.buttonText0}>{text2}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={handleStopFeeding}>
          <Text style={styles.buttonText0}>{text3}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 10 }} />
      <View style={styles.tableContainer1}>
        <View style={styles.table0}>
          <View style={styles.tableRow0}>
            <Text style={styles.tableData0}>Weight Sensor Data:</Text>
            <Text style={styles.tableData0}>{weightSensorData}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AutomatedFeedingPage;
