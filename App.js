import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  AppRegistry,
  Image,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

AppRegistry.registerComponent("main", () => App);

const Stack = createStackNavigator();

export default function App() {
  const [language, setLanguage] = useState("English");
  const [confirmLanguage, setConfirmLanguage] = useState(false);

  const WaterQualityDetails = ({ property, title }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://192.168.18.7:3000/api/data");
          const data = response.data.map((item) => ({
            timestamp: new Date(item.timestamp),
            value: Number(item[property]).toFixed(2), // Round value to 2 decimal places
          }));
          // Sort data in descending order based on timestamp
          data.sort((a, b) => b.timestamp - a.timestamp);
          setData(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

      fetchData();
    }, [property]);

    const filteredData = data.filter((item) => {
      // Filter data based on search query
      return (
        item.value
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.timestamp
          .toLocaleString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });

    if (loading) {
      return <Text>Loading...</Text>;
    }

    return (
      <View style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Text>{title} Details</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
          }}
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <FlatList
          style={{ flex: 1 }}
          data={filteredData}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ fontSize: 12, color: "#666" }}>
                {item.timestamp.toLocaleString()}
              </Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {item.value}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  function StartingPage({ navigation }) {
    return (
      <View style={styles.startingPage}>
        <Image
          source={require("C:\\Users\\Jhames\\GROUPTUBIG\\assets\\logo3.png")}
          style={{
            marginBottom: 5,
            width: 120,
            height: 120,
            resizeMode: "contain",
          }}
        />
        <Text style={[styles.appName, { marginBottom: 1 }]}>AquaGUARD</Text>
        <Text style={styles.appDescription}>
          Your labour-free pond assistant.
        </Text>
        <View style={{ marginBottom: 10 }}></View>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("LanguageSelection")}
        >
          <Text
            style={[styles.buttonText, { fontFamily: "sans-serif-medium" }]}
          >
            >
          </Text>
        </Pressable>
      </View>
    );
  }

  function LanguageSelection({ navigation }) {
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [confirmLanguage, setConfirmLanguage] = useState(false);

    const Spacer = ({ height }) => <View style={{ height }} />;

    const handleLanguageChange = (newLanguage) => {
      setSelectedLanguage(newLanguage);
    };

    const handleConfirm = () => {
      setLanguage(selectedLanguage);
      setConfirmLanguage(true);
      navigation.navigate("Home");
    };

    return (
      <View style={styles.languageSelection}>
        <Spacer height={10} />
        <Image
          source={require("C:\\Users\\Jhames\\GROUPTUBIG\\assets\\Language.png")}
          style={{
            marginBottom: 10,
            width: 120,
            height: 120,
            resizeMode: "contain",
          }}
        />
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor:
                selectedLanguage === "English" ? "#3a3fbd" : "#ddd",
              borderColor:
                selectedLanguage === "English" ? "#3a3fbd" : "#3a3fbd",
              borderWidth: selectedLanguage === "English" ? 0 : 1,
            },
          ]}
          onPress={() => handleLanguageChange("English")}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: selectedLanguage === "English" ? "#fff" : "#3a3fbd",
              },
            ]}
          >
            English
          </Text>
        </Pressable>
        <Spacer height={10} />
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor:
                selectedLanguage === "Tagalog" ? "#3a3fbd" : "#ddd",
              borderColor:
                selectedLanguage === "Tagalog" ? "#3a3fbd" : "#3a3fbd",
              borderWidth: selectedLanguage === "Tagalog" ? 0 : 1,
            },
          ]}
          onPress={() => handleLanguageChange("Tagalog")}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: selectedLanguage === "Tagalog" ? "#fff" : "#3a3fbd",
              },
            ]}
          >
            Tagalog
          </Text>
        </Pressable>
        <Spacer height={30} />

        <Pressable
          style={[
            styles.buttonNext,
            {
              backgroundColor: selectedLanguage
                ? "#3a3fbd"
                : "#rgb(242,242,242)",
            },
          ]}
          onPress={handleConfirm}
          disabled={!selectedLanguage}
        >
          <Text style={styles.buttonText}>></Text>
        </Pressable>
      </View>
    );
  }

  function HomePage({ navigation }) {
    let buttonText =
      language === "English" ? "Water Quality" : "Kalidad ng Tubig";
    let buttonText2 = language === "English" ? "Feeding" : "Pagpapakain";
    let buttonText3 =
      language === "English" ? "Algae Control" : "Kontrol ng Algae";
    let buttonText4 = language === "English" ? "Settings" : "Mga Setting";

    return (
      <View style={styles.homePage}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("WaterQuality")}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
        <View style={{ marginBottom: 10 }} />
        <Pressable
          style={styles.alterButton}
          onPress={() => navigation.navigate("AutomatedFeeding")}
        >
          <Text style={styles.alterbuttonText}>{buttonText2}</Text>
        </Pressable>
        <View style={{ marginBottom: 10 }} />
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("AlgaeControl")}
        >
          <Text style={styles.buttonText}>{buttonText3}</Text>
        </Pressable>
        <View style={{ marginBottom: 10 }} />
        <Pressable
          style={styles.alterButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.alterbuttonText}>{buttonText4}</Text>
        </Pressable>
        <Image
          source={require("C:\\Users\\Jhames\\GROUPTUBIG\\assets\\logo3.png")}
          style={{
            marginTop: 30,
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
        />
      </View>
    );
  }

  function WaterQualityPage({ navigation }) {
    const [data, setData] = useState({});
    const [alertTriggered, setAlertTriggered] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("http://192.168.18.7:3000/api/data");
          const jsonData = await response.json();
          const sortedData = jsonData.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setData(sortedData[0]);
          console.log("fetching successful n1");
          console.log(jsonData);
        } catch (error) {
          console.error("Error fetching data from API:", error);
          Alert.alert(
            "Error",
            "Unable to connect to API. Please check your network connection."
          );
        }
      };

      fetchData();

      //every 5 seconds magrretrieve uli (realtime-esque)
      const intervalId = setInterval(fetchData, 1000);

      return () => clearInterval(intervalId);
    }, []);

    //needed sa callback
    if (!data) {
      return <Text>Loading...</Text>;
    }

    const temperature = data.temperature ? data.temperature.toFixed(1) : "--";
    const pH = data.pH ? data.pH.toFixed(2) : "--";
    const tds = data.tds ? data.tds.toFixed(0) : "--";
    const doConcentration = data.doConcentration
      ? data.doConcentration.toFixed(2)
      : "--";
    const ammoniaLevel = data.ammoniaLevel
      ? data.ammoniaLevel.toFixed(2)
      : "--";
    const nitrateLevel = data.nitrateLevel
      ? data.nitrateLevel.toFixed(2)
      : "--";

    const getTextColor = (value, threshold) => {
      if (value > threshold) {
        return "green";
      } else if (value < threshold) {
        return "red";
      } else {
        return "orange";
      }
    };

    const checkForAlert = () => {
      if (
        getTextColor(temperature, 30) === "red" ||
        getTextColor(pH, 7) === "red" ||
        getTextColor(tds, 100) === "red" ||
        getTextColor(doConcentration, 5) === "red" ||
        getTextColor(ammoniaLevel, 1) === "red" ||
        getTextColor(nitrateLevel, 10) === "red"
      ) {
        if (!alertTriggered) {
          setAlertTriggered(true);
          Alert.alert(
            "Water Quality Alert",
            "One or more water quality parameters have reached a critical level!"
          );
        }
      } else {
        setAlertTriggered(false);
      }
    };

    useEffect(() => {
      checkForAlert();
    }, [data]);

    let label1 = language === "English" ? "Temperature" : "Temperatura";
    let label2 = language === "English" ? "pH:" : "pH:";
    let label3 = language === "English" ? "TDS:" : "TDS:";
    let label4 = language === "English" ? "DO:" : "DO:";
    let label5 = language === "English" ? "Ammonia:" : "Ammonia:";
    let label6 = language === "English" ? "Nitrate:" : "Nitrate:";
    let titlePage =
      language === "English" ? "Water Quality Monitor" : "Kalidad ng Tubig";
    let viewDetailsButtonText = language === "English" ? ">" : ">";

    return (
      <View style={styles.waterQualityPage}>
        <Image
          source={require("C:\\Users\\Jhames\\GROUPTUBIG\\assets\\logo3.png")}
          style={{
            marginButton: 30,
            width: 50,
            height: 50,
            resizeMode: "contain",
          }}
        />
        <Text style={[styles.heading, { fontSize: 22 }]}>{titlePage}</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>{label1}:</Text>
            <Text
              style={[
                styles.tableCell,
                { color: getTextColor(temperature, 30) },
              ]}
            >
              {temperature} °C
            </Text>
            <Pressable
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("TemperatureDetails")}
            >
              <Text style={styles.viewDetailsButtonText}>
                {viewDetailsButtonText}
              </Text>
            </Pressable>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>pH:</Text>
            <Text style={[styles.tableCell, { color: getTextColor(pH, 7) }]}>
              {pH}
            </Text>
            <Pressable
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("PHDetails")}
            >
              <Text style={styles.viewDetailsButtonText}>
                {viewDetailsButtonText}
              </Text>
            </Pressable>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>TDS:</Text>
            <Text style={[styles.tableCell, { color: getTextColor(tds, 100) }]}>
              {tds} ppm
            </Text>
            <Pressable
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("TDSDetails")}
            >
              <Text style={styles.viewDetailsButtonText}>
                {viewDetailsButtonText}
              </Text>
            </Pressable>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>DO:</Text>
            <Text
              style={[
                styles.tableCell,
                { color: getTextColor(doConcentration, 5) },
              ]}
            >
              {doConcentration} mg/L
            </Text>
            <Pressable
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("DOConcentrationDetails")}
            >
              <Text style={styles.viewDetailsButtonText}>
                {viewDetailsButtonText}
              </Text>
            </Pressable>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Ammonia:</Text>
            <Text
              style={[
                styles.tableCell,
                { color: getTextColor(ammoniaLevel, 1) },
              ]}
            >
              {ammoniaLevel} mg/L
            </Text>
            <Pressable
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("AmmoniaLevelDetails")}
            >
              <Text style={styles.viewDetailsButtonText}>
                {viewDetailsButtonText}
              </Text>
            </Pressable>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Nitrate:</Text>
            <Text
              style={[
                styles.tableCell,
                { color: getTextColor(nitrateLevel, 10) },
              ]}
            >
              {nitrateLevel} mg/L
            </Text>
            <Pressable
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("NitrateLevelDetails")}
            >
              <Text style={styles.viewDetailsButtonText}>
                {viewDetailsButtonText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  function TemperatureDetails() {
    return <WaterQualityDetails property="temperature" title="Temperature" />;
  }

  function PHDetails() {
    return <WaterQualityDetails property="pH" title="pH" />;
  }

  function TDSDetails() {
    return <WaterQualityDetails property="tds" title="TDS" />;
  }

  function AmmoniaLevelDetails() {
    return (
      <WaterQualityDetails property="ammoniaLevel" title="Ammonia Level" />
    );
  }

  function NitrateLevelDetails() {
    return (
      <WaterQualityDetails property="nitrateLevel" title="Nitrate Level" />
    );
  }

  function DOConcentrationDetails() {
    return (
      <WaterQualityDetails
        property="doConcentration"
        title="DO Concentration"
      />
    );
  }

  function AutomatedFeedingPage({ navigation }) {
    const { getItem: getFeedingState, setItem: setFeedingState } =
      useAsyncStorage("isFeeding");
    const { getItem: getRotations, setItem: setRotationsStorage } =
      useAsyncStorage("rotations");

    const [isFeeding, setIsFeeding] = useState(false);
    const [rotations, setRotations] = useState(6);
    const [weightSensorData, setWeightSensorData] = useState(0);
    const [newRotations, setNewRotations] = useState("");

    let text1 =
      language === "English"
        ? "Automated Feeding Page"
        : "Automatikong Pagpapakain";
    let text2 = language === "English" ? "Start Feeding" : "Simulan";
    let text3 = language === "English" ? "Stop Feeding" : "Ihinto";
    let remainingFeed =
      language === "English" ? "Remaining Feed Amount:" : "Natitirang Pakain:";
    let rotationPromptText =
      language === "English"
        ? "Set screw feeder rotations... (Number)"
        : "Ilagay ang nais na bilang ng pag-ikot ng screw feeder.. (Numero)";
    let currentRotationText =
      language === "English"
        ? "Current set rotations:"
        : "Kasalukuyang bilang ng pag-ikot:";
    let defaultButtonText = language === "English" ? "Default" : "Depolt";
    let applyButtonText = language === "English" ? "Apply" : "I-apply";
    let explanation =
      language === "English"
        ? "Each rotation equates to ~10g of fish feed."
        : "Each rotation equates to ~10g of fish feed.";

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("http://192.168.18.7:3000/api/weight");
          const jsonData = await response.json();
          setWeightSensorData(jsonData);
          console.log("fetching successful n1");
          console.log(jsonData);
        } catch (error) {
          console.error("Error fetching weight data from API:", error);
          setWeightSensorData(0); // Set default value if error occurs
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 1000);

      return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
      const fetchRotations = async () => {
        try {
          const storedRotations = await getRotations();
          if (storedRotations) {
            setRotations(parseInt(storedRotations, 10));
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchRotations();
    }, []);

    useEffect(() => {
      const saveRotations = async () => {
        try {
          await setRotationsStorage(rotations.toString());
        } catch (error) {
          console.error(error);
        }
      };
      saveRotations();
    }, [rotations, setRotationsStorage]);

    const handleApply = async () => {
      try {
        const response = await axios.post(
          "http://192.168.18.7:3000/api/update-rotations",
          {
            rotations: parseInt(newRotations),
          }
        );
        console.log(response.data);

        setRotations(parseInt(newRotations));
        setNewRotations("");
        console.log("Apply button clicked, rotations set to:", newRotations);
      } catch (error) {
        console.error(error);
      }
    };

    const handleReset = async () => {
      try {
        const response = await axios.post(
          "http://192.168.18.7:3000/api/update-rotations",
          {
            rotations: 6, // default value
          }
        );
        console.log(response.data);

        setRotations(6);
        setNewRotations("6");
        console.log(
          "Default button clicked, rotations set to default value (6)"
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handleFeeding = async () => {
      try {
        const response = await axios.post(
          "http://192.168.18.7:3000/api/update-feeding-state",
          {
            isFeeding: !isFeeding,
          }
        );
        console.log(response.data);

        setIsFeeding(!isFeeding);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      const saveFeedingState = async () => {
        try {
          await setFeedingState(isFeeding.toString());
        } catch (error) {
          console.error(error);
        }
      };
      saveFeedingState();
    }, [isFeeding, setFeedingState]);

    useEffect(() => {
      const fetchFeedingState = async () => {
        try {
          const storedFeedingState = await getFeedingState();
          if (storedFeedingState) {
            setIsFeeding(storedFeedingState === "true");
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchFeedingState();
    }, []);

    const getFeedAmountColor = () => {
      if (weightSensorData?.weight <= 0) {
        return "red";
      } else if (weightSensorData?.weight <= 15) {
        return "orange";
      } else {
        return "black";
      }
    };

    useEffect(() => {
      if (weightSensorData?.weight <= 0) {
        Alert.alert("Low Feed Alert", "Feed amount is critically low!");
      } else if (weightSensorData?.weight <= 15) {
        Alert.alert("Feed Alert", "Feed amount is running low!");
      }
    }, [weightSensorData]);

    return (
      <View style={styles.emptyPage}>
        <View style={styles.inputContainer}>
          <Text style={styles.tableHeader0}>{currentRotationText}</Text>
          <Text style={[styles.tableData0, { marginBottom: 10 }]}>
            {rotations} rotations
          </Text>
          <TextInput
            style={[
              styles.prompt,
              {
                borderColor: "#3a3fbd",
                borderWidth: 1,
                borderRadius: 5,
                padding: 20,
                marginBottom: 10,
              },
            ]}
            value={newRotations}
            onChangeText={(text) => {
              const trimmedText = text.replace(/^0+/, "");
              setNewRotations(trimmedText.replace(/[^0-9]/g, ""));
            }}
            placeholder={rotationPromptText}
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
          <Pressable style={styles.button1} onPress={handleApply}>
            <Text style={styles.buttonText1}>{applyButtonText}</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button1} onPress={handleReset}>
            <Text style={styles.buttonText1}>{defaultButtonText}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button2,
              isFeeding
                ? { backgroundColor: "red" }
                : { backgroundColor: "green" },
            ]}
            onPress={handleFeeding}
          >
            <Text style={styles.buttonText1}>{isFeeding ? text3 : text2}</Text>
          </Pressable>
          <Text
            style={[
              styles.tableData0,
              { marginBottom: 10, textAlign: "center" },
            ]}
          >
            {remainingFeed}
          </Text>
          <View
            style={{
              borderColor: "#3a3fbd",
              borderWidth: 1,
              borderRadius: 5,
              padding: 20,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18, textAlign: "center" }}>
              {weightSensorData?.weight?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function AlgaeControlPage({ navigation }) {
    const { getItem, setItem } = useAsyncStorage("interval");
    const [interval, setInterval] = useState(
      async () => parseInt(await getItem(), 10) || 0
    );

    const [newInterval, setNewInterval] = useState("");

    const { getItem: getTransducerState, setItem: setTransducerState } =
      useAsyncStorage("isTransducerOn");

    const [isTransducerOn, setIsTransducerOn] = useState(
      async () => (await getTransducerState()) === "true"
    );

    useEffect(() => {
      const fetchInterval = async () => {
        try {
          const storedInterval = await getItem();
          if (storedInterval) {
            setInterval(parseInt(storedInterval, 10));
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchInterval();
    }, []);

    useEffect(() => {
      const saveInterval = async () => {
        try {
          await setItem(interval.toString());
        } catch (error) {
          console.error(error);
        }
      };
      saveInterval();
    }, [interval, setItem]);

    useEffect(() => {
      const fetchTransducerState = async () => {
        try {
          const storedTransducerState = await getTransducerState();
          if (storedTransducerState) {
            setIsTransducerOn(storedTransducerState === "true");
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchTransducerState();
    }, []);

    useEffect(() => {
      const saveTransducerState = async () => {
        try {
          await setTransducerState(isTransducerOn.toString());
        } catch (error) {
          console.error(error);
        }
      };
      saveTransducerState();
    }, [isTransducerOn, setTransducerState]);

    let promptText =
      language === "English"
        ? "Set ultrasound interval... (Number)"
        : "Ilagay ang nais na interbal.. (Numero)";

    let applyButtonText = language === "English" ? "Apply" : "I-apply";

    let transducerButtonText = isTransducerOn
      ? language === "English"
        ? "Stop"
        : "Ihinto"
      : language === "English"
      ? "Start"
      : "Simulan";

    let defaultButtonText = language === "English" ? "Default" : "Depolt";

    let explanation =
      language === "English"
        ? "This prompt only accepts minutes."
        : "Ang prompt na ito ay tumatanggap lamang ng minuto.";

    let counterText =
      language === "English"
        ? "Current set interval:"
        : "Kasalukuyang interbal:";

    const handleApply = async () => {
      const newIntervalValue = parseInt(newInterval) * 60000;
      setInterval(newIntervalValue);
      console.log("Apply button clicked, interval set to:", newInterval);

      try {
        const response = await axios.post(
          "http://192.168.18.7:3000/api/update-interval",
          {
            interval: newIntervalValue,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleReset = async () => {
      try {
        const response = await axios.post(
          "http://192.168.18.7:3000/api/update-interval",
          {
            interval: 0,
          }
        );
        console.log(response.data);

        setInterval(0);
        setNewInterval("");
        console.log("Default button clicked, interval set to default value");
      } catch (error) {
        console.error(error);
      }
    };

    const handleTransducerToggle = async () => {
      const currentState = await isTransducerOn;
      setIsTransducerOn(!currentState);
      if (!currentState) {
        console.log("Stop button clicked, algae control stopped");
      } else {
        console.log("Start button clicked, algae control started");
      }

      try {
        const response = await axios.post(
          "http://192.168.18.7:3000/api/update-transducer-state",
          {
            isTransducerOn: !currentState,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <View style={styles.emptyPage}>
        <View style={styles.inputContainer}>
          <Text style={styles.tableHeader0}>{counterText}</Text>
          <Text style={[styles.tableData0, { marginBottom: 10 }]}>
            {interval / 60000} minute/s
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
            onChangeText={(text) => {
              const trimmedText = text.replace(/^0+/, "");
              setNewInterval(trimmedText.replace(/[^0-9]/g, ""));
            }}
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
          <Pressable style={styles.button1} onPress={handleApply}>
            <Text style={styles.buttonText1}>{applyButtonText}</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button1} onPress={handleReset}>
            <Text style={styles.buttonText1}>{defaultButtonText}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button2,
              isTransducerOn
                ? { backgroundColor: "#b03749" }
                : { backgroundColor: "green" },
            ]}
            onPress={handleTransducerToggle}
          >
            <Text style={styles.buttonText1}>{transducerButtonText}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function SettingsPage({ navigation }) {
    let buttonText1 = language === "English" ? "English" : "Ingles";
    let buttonText2 = language === "English" ? "Tagalog" : "Tagalog";
    const [showApplyButton, setShowApplyButton] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [buttonStyle1, setButtonStyle1] = useState(styles.button);
    const [buttonStyle2, setButtonStyle2] = useState(styles.button);
    const [textStyle1, setTextStyle1] = useState(styles.buttonText);
    const [textStyle2, setTextStyle2] = useState(styles.buttonText);

    return (
      <View style={styles.languageSelection}>
        <Image
          source={require("C:\\Users\\Jhames\\GROUPTUBIG\\assets\\Setting.png")}
          style={{
            marginBottom: -10,
            width: 120,
            height: 120,
            resizeMode: "contain",
            alignContent: "center",
          }}
        />
        <View style={{ marginBottom: 10 }} />
        <Pressable
          style={buttonStyle1}
          onPress={() => {
            if (language === "English") {
              setLanguage("Tagalog");
              setButtonStyle1({
                ...styles.button,
                backgroundColor: "#ddd",
                borderColor: "#3a3fbd",
                borderWidth: 1,
              });
              setTextStyle1({ ...styles.buttonText, color: "#3a3fbd" });
            } else {
              setLanguage("English");
              setButtonStyle2(styles.button);
              setTextStyle2(styles.buttonText);
            }
          }}
        >
          <Text style={textStyle1}>
            {language === "English" ? "English" : "Tagalog"}
          </Text>
        </Pressable>
        <View style={{ marginBottom: 40 }} />
        <View style={{ height: 80, justifyContent: "center" }}>
          <Pressable
            style={styles.button4}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.buttonText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    // Page styles
    startingPage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f7f7f7",
    },
    languageSelection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    homePage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    waterQualityPage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyPage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    // Typography
    appName: {
      fontSize: 40,
      color: "#3a3fbd",
      fontWeight: "bold",
      textShadowRadius: 2,
      textShadowColor: "navy",
      letterSpacing: 0.1,
    },
    appDescription: {
      fontSize: 20,
      marginTop: 10,
      marginBottom: 70,
      textDecorationLine: "line",
      textDecorationColor: "line",
      textDecorationStyle: "solid",
    },
    heading: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 40,
      textAlign: "center",
      color: "black",
    },

    // Buttons
    button: {
      backgroundColor: "#3a3fbd",
      padding: 12,
      borderRadius: 15,
      width: 250,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonNext: {
      backgroundColor: "#3a3fbd",
      padding: 8,
      borderRadius: 15,
      width: 100,
    },
    buttonText: {
      color: "white",
      fontSize: 20,
      textAlign: "center",
      fontWeight: "bold",
    },
    button1: {
      backgroundColor: "#3a3fbd",
      padding: 10,
      borderRadius: 15,
      width: 250,
      marginTop: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button2: {
      backgroundColor: "#497838",
      padding: 10,
      borderRadius: 15,
      width: 250,
      marginTop: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button4: {
      backgroundColor: "#497838",
      padding: 15,
      borderRadius: 15,
      width: 250,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    alterButton: {
      backgroundColor: "#ddd",
      padding: 12,
      borderRadius: 15,
      width: 250,
      borderWidth: 3,
      borderColor: "#3a3fbd",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    alterbuttonText: {
      color: "#3a3fbd",
      fontSize: 20,
      textAlign: "center",
      fontWeight: "bold",
    },
    buttonText1: {
      color: "white",
      fontSize: 18,
      textAlign: "center",
    },
    tableContainer: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingVertical: 10,
    },
    tableHeader: {
      width: "40%",
      fontWeight: "italic",
      paddingHorizontal: 10,
    },
    tableCell: {
      width: "30%",
      paddingHorizontal: 10,
    },
    tableCell0: {
      flex: 1,
      padding: 10,
      borderRightWidth: 1,
      borderColor: "black",
    },
    viewDetailsButton: {
      backgroundColor: "#3a3fbd",
      padding: 10,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    viewDetailsButtonText: {
      color: "white",
      fontSize: 16,
      textAlign: "center",
    },
    tableHeader0: {
      fontSize: 18,
      fontWeight: "bold",
    },
    tableData0: {
      fontSize: 16,
      fontWeight: "bold",
    },
    inputContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    mainContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    headerContainer0: {
      marginBottom: 10,
      alignItems: "center",
    },
    headerText0: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 60,
      textAlign: "center",
    },
    buttonSection: {
      marginBottom: 20,
    },
    button0: {
      width: 200,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
    buttonText0: {
      fontSize: 18,
      color: "#fff",
    },
    dataSection: {
      marginBottom: 20,
    },
    dataContainer: {
      width: 300,
      height: 100,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dataLabel: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
    },
    dataValue: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Starting"
          component={StartingPage}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageSelection}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="WaterQuality"
          component={WaterQualityPage}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="AutomatedFeeding"
          component={AutomatedFeedingPage}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="AlgaeControl"
          component={AlgaeControlPage}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsPage}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="TemperatureDetails"
          component={TemperatureDetails}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="PHDetails"
          component={PHDetails}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="TDSDetails"
          component={TDSDetails}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="DOConcentrationDetails"
          component={DOConcentrationDetails}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="AmmoniaLevelDetails"
          component={AmmoniaLevelDetails}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="NitrateLevelDetails"
          component={NitrateLevelDetails}
          options={{ headerTitle: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
