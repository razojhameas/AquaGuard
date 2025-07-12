import React, { useState, useEffect, useRef } from "react";
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
  TouchableOpacity,
  Picker,
  Animated,
  Dimensions,
  Modal,
  Platform, Share
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryScatter, VictoryBar } from "victory-native";
import Svg from "react-native-svg";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';



AppRegistry.registerComponent("main", () => App);

const Stack = createStackNavigator();

const DURATION_OPTIONS = [
  { label: "1d", value: "1d" },
  { label: "1w", value: "7d" },
  { label: "1m", value: "30d" },
  { label: "1y", value: "1y" },
];

export default function App() {
  const [language, setLanguage] = useState("English");
  const [confirmLanguage, setConfirmLanguage] = useState(false);

  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    apiEndpoint: "http://localhost:3000",
  });

function StartingPage({ navigation }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.startingPage}>
      {/* Animated background gradient bubbles */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      {/* Glassmorphism card */}
      <View style={[styles.glassCard, { backgroundColor: "rgba(255,255,255,0.18)", paddingVertical: 32, paddingHorizontal: 18 }]}>
        <Animated.Image
          source={require("./assets/logo.png")}
          style={[
            styles.logo,
            {
              transform: [
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
              opacity: logoAnim,
            },
          ]}
        />
        <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
          AquaGUARD
        </Animated.Text>
        <Animated.Text style={[styles.appDescription, { opacity: fadeAnim }]}>
          Your labour-free pond assistant.
        </Animated.Text>
        <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
         <Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed,
  ]}
  onPress={() => navigation.navigate("LanguageSelection")}
  android_ripple={{ color: "#b3e5fc" }}
>
  {({ pressed }) => (
    <Text
      style={[
        styles.buttonText,
        { color: pressed ? "#fff" : "#00796b" } //white kapag pressed, teal kapag hindi
      ]}ka
    >
      Get Started
    </Text>
  )}
</Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

function LanguageSelection({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const Spacer = ({ height }) => <View style={{ height }} />;

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    setLanguage(newLanguage); 
    navigation.navigate("Home");
  };

  return (
    <View style={styles.languageSelection}>
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <Animated.View style={[
        styles.glassCard,
        { backgroundColor: "rgba(255,255,255,0.18)", paddingVertical: 28, paddingHorizontal: 16, minWidth: 260 }
      , { opacity: fadeAnim }]}>
        <Spacer height={10} />
        <Image
          source={require("./assets/language.png")}
          style={styles.logo}
        />
        <Text style={styles.heading}>Choose your language:</Text>
        <Spacer height={10} />
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor:
                selectedLanguage === "English" ? "#009688" : "#fff",
              borderColor: "#009688",
              borderWidth: 2,
              marginBottom: 10,
              shadowColor: selectedLanguage === "English" ? "#009688" : "#000",
              shadowOpacity: selectedLanguage === "English" ? 0.3 : 0.15,
              elevation: selectedLanguage === "English" ? 8 : 4,
              paddingVertical: 16,
              paddingHorizontal: 24,
              minWidth: 160,
              maxWidth: 220,
              alignSelf: "center",
            },
          ]}
          onPress={() => handleLanguageChange("English")}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: selectedLanguage === "English" ? "#fff" : "#009688",
                textShadowColor: selectedLanguage === "English" ? "#00796b" : "#fff",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
                fontSize: 20,
                paddingHorizontal: 0,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            English
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor:
                selectedLanguage === "Tagalog" ? "#009688" : "#fff",
              borderColor: "#009688",
              borderWidth: 2,
              marginBottom: 30,
              shadowColor: selectedLanguage === "Tagalog" ? "#009688" : "#000",
              shadowOpacity: selectedLanguage === "Tagalog" ? 0.3 : 0.15,
              elevation: selectedLanguage === "Tagalog" ? 8 : 4,
              paddingVertical: 16,
              paddingHorizontal: 24,
              minWidth: 160,
              maxWidth: 220,
              alignSelf: "center",
            },
          ]}
          onPress={() => handleLanguageChange("Tagalog")}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: selectedLanguage === "Tagalog" ? "#fff" : "#009688",
                textShadowColor: selectedLanguage === "Tagalog" ? "#00796b" : "#fff",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
                fontSize: 20,
                paddingHorizontal: 0,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Tagalog
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function HomePage({ navigation, language }) {
  const [showHowTo, setShowHowTo] = useState(false);

  let buttonText =
    language === "English" ? "Water Quality" : "Kalidad ng Tubig";
  let buttonText2 = language === "English" ? "Feeding" : "Pagpapakain";
  let buttonText3 =
    language === "English" ? "Algae Control" : "Kontrol ng Algae";
  let buttonText4 = language === "English" ? "Settings" : "Mga Setting";
  let howToText = language === "English" ? "How To Use" : "Paano Gamitin";

  const buttons = [
    { text: buttonText, nav: "WaterQuality", color: "#009688" },
    { text: buttonText2, nav: "AutomatedFeeding", color: "#009688" },
    { text: buttonText3, nav: "AlgaeControl", color: "#009688" },
    { text: buttonText4, nav: "Settings", color: "#009688" },
  ];

  const instructions = language === "English"
    ? [
        {
          title: "Water Quality",
          desc: [
            "• View real-time readings for temperature, pH, TDS, DO, ammonia, and turbidity.",
            "• Each parameter is color-coded (Good, Moderate, Poor, Bad) using fuzzy logic.",
            "• Select the species (Tilapia, Milkfish, Catfish, Shrimp, or Custom) to adjust temperature classification.",
            "• Tap any parameter to see detailed trends, graphs, and statistics (average, min, max, median, count) for different time ranges (day, week, month, year).",
            "• Use the legend to understand color meanings. Alerts appear if any parameter is critical."
          ].join("\n")
        },
        {
          title: "Feeding",
          desc: [
            "• View and set the number of screw feeder rotations to control feed amount.",
            "• Select feed type and distribution mode using dropdowns.",
            "• See the remaining feed in real time from the weight sensor.",
            "• Toggle the feeding system ON/OFF.",
            "• Tap 'Show Statistics' to view total feed dispensed, total feedings, average feed per feeding, and last feeding time."
          ].join("\n")
        },
        {
          title: "Algae Control",
          desc: [
            "• Set the interval (in minutes) for the ultrasound algae control system.",
            "• Apply a custom interval or reset to default.",
            "• Toggle the transducer ON/OFF.",
            "• Tap 'Show Statistics' to view total activations, total minutes active, average interval, and last activation time."
          ].join("\n")
        },
        {
          title: "Settings",
          desc: [
            "• Change the app language at any time.",
            "• Enable or disable notifications for critical water quality alerts.",
            "• Export all app data to a file for backup or research.",
            "• Import data (if supported).",
            "• Reset all settings to default values.",
            "• Tap 'Apply' to save changes."
          ].join("\n")
        },
        {
          title: "General",
          desc: [
            "• Use the navigation buttons to switch between features.",
            "• All data is updated live from the server.",
            "• Alerts and notifications help you respond quickly to critical events.",
            "• The app is bilingual and can be used in English or Tagalog."
          ].join("\n")
        }
      ]
    : [
        {
          title: "Kalidad ng Tubig",
          desc: [
            "• Tingnan ang real-time na readings ng temperatura, pH, TDS, DO, amonya, at kakuliman.",
            "• Bawat parameter ay may kulay (Maganda, Katamtaman, Mahina, Masama) gamit ang fuzzy logic.",
            "• Pumili ng isda (Tilapya, Bangus, Hito, Hipon, o Ibang Isda) para sa tamang pag-uuri ng temperatura.",
            "• I-tap ang parameter para makita ang detalye ng trend, graph, at estadistika (average, min, max, gitna, bilang) para sa araw, linggo, buwan, o taon.",
            "• Gamitin ang legend para maintindihan ang mga kulay. Magpapakita ng alerto kung may kritikal na parameter."
          ].join("\n")
        },
        {
          title: "Pagpapakain",
          desc: [
            "• Tingnan at itakda ang ikot ng screw feeder para kontrolin ang dami ng pakain.",
            "• Pumili ng uri ng pakain at paraan ng pamamahagi gamit ang dropdown.",
            "• Makikita ang natitirang pakain mula sa weight sensor.",
            "• I-toggle ang pagpapakain ON/OFF.",
            "• I-tap ang 'Ipakita ang Estadistika' para makita ang kabuuang pakain, kabuuang pagpapakain, average kada pagpapakain, at huling oras ng pagpapakain."
          ].join("\n")
        },
        {
          title: "Kontrol ng Algae",
          desc: [
            "• Itakda ang interval (sa minuto) ng ultrasound algae control system.",
            "• Ilapat ang custom interval o i-reset sa default.",
            "• I-toggle ang transducer ON/OFF.",
            "• I-tap ang 'Ipakita ang Estadistika' para makita ang kabuuang activation, kabuuang minuto, average interval, at huling activation."
          ].join("\n")
        },
        {
          title: "Mga Setting",
          desc: [
            "• Palitan ang wika ng app anumang oras.",
            "• I-on o i-off ang notifications para sa kritikal na alerto ng kalidad ng tubig.",
            "• I-export ang lahat ng datos ng app para sa backup o research.",
            "• Mag-import ng datos (kung suportado).",
            "• I-reset ang lahat ng setting sa default.",
            "• I-tap ang 'Ilapat' para i-save ang mga pagbabago."
          ].join("\n")
        },
        {
          title: "Pangkalahatan",
          desc: [
            "• Gamitin ang mga button para lumipat ng feature.",
            "• Lahat ng datos ay live na galing sa server.",
            "• Ang mga alerto at notification ay tutulong para mabilis kang makaresponde sa mga kritikal na pangyayari.",
            "• Ang app ay bilingual at maaaring gamitin sa Ingles o Tagalog."
          ].join("\n")
        }
      ];

  return (
    <View style={styles.homePage}>
      {/* Background bubbles for texture */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <View style={[
        styles.glassCard,
        { backgroundColor: "rgba(255,255,255,0.10)", paddingVertical: 24, paddingHorizontal: 10 }
      ]}>
        {buttons.map((btn) => (
          <Pressable
            key={btn.text}
            style={({ pressed }) => [
              styles.bigHomeButton,
              {
                backgroundColor: pressed
                  ? "rgba(0,150,136,0.18)"
                  : "transparent",
                borderColor: btn.color,
                shadowColor: btn.color,
                minWidth: 180,
                maxWidth: 340,
                width: "90%",
                alignSelf: "center",
                marginVertical: 10,
                paddingVertical: 22,
              },
            ]}
            onPress={() => navigation.navigate(btn.nav)}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.bigHomeButtonText,
                  { color: pressed ? "#fff" : btn.color, fontSize: 20 }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {btn.text}
              </Text>
            )}
          </Pressable>
        ))}
        {/* How To Use Button */}
        <TouchableOpacity
          style={{
            marginTop: 18,
            backgroundColor: "#009688",
            borderRadius: 18,
            paddingVertical: 12,
            paddingHorizontal: 28,
            alignSelf: "center",
            elevation: 4,
            shadowColor: "#009688",
            shadowOpacity: 0.18,
          }}
          onPress={() => setShowHowTo(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
            {howToText}
          </Text>
        </TouchableOpacity>
      </View>
      {/* How To Use Modal */}
      <Modal
        visible={showHowTo}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHowTo(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.25)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 22,
            padding: 24,
            width: "90%",
            maxWidth: 400,
            maxHeight: "80%",
            elevation: 8,
            shadowColor: "#009688",
            shadowOpacity: 0.18,
          }}>
            <Text style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#009688",
              marginBottom: 12,
              textAlign: "center"
            }}>
              {howToText}
            </Text>
            <ScrollView style={{ maxHeight: 340 }}>
              {instructions.map((item, idx) => (
                <View key={item.title} style={{ marginBottom: 18 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 17, color: "#00796b" }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 15, color: "#333", marginTop: 2, whiteSpace: "pre-line" }}>
                    {item.desc}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#009688",
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 24,
                alignSelf: "center",
              }}
              onPress={() => setShowHowTo(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                {language === "English" ? "Close" : "Isara"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function WaterQualityPage({ navigation, language, settings }) {
  const [data, setData] = useState(undefined);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [apiErrorShown, setApiErrorShown] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");
  const [species, setSpecies] = useState("tilapia");
  const [showLegendModal, setShowLegendModal] = useState(false);

  //color palette ng legend: Good, Moderate, Poor, Bad (((respectively)))
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
        good: [26, 27.5, 29], // 26-29°C
        moderate: [
          [22, 24, 26], // 22-26°C
          [29, 30, 31], // 29-31°C
        ],
        poor: [
          [18, 20, 22], // 18-22°C
          [31, 32.5, 34], // 31-34°C
        ],
        bad: [
          [0, 9, 18], // <18°C
          [35, 37, 50], // >35°C
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

  const apiEndpoint = settings?.apiEndpoint || "http://localhost:3000";

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
  const tds = safeValue(data?.tds, 0);
  const doConcentration = safeValue(data?.doConcentration, 2);
  const ammoniaLevel = safeValue(data?.ammoniaLevel, 2);
  const turbidityLevel = safeValue(data?.turbidityLevel, 2);

  // --- fuzzy logic triangular shit --- 
  function triangular(x, a, b, c) {
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x > a && x < b) return (x - a) / (b - a);
    if (x > b && x < c) return (c - x) / (c - b);
    return 0;
  }

  // --- temperature fuzzy logic using species fuzzy intervals kasi iba iba ---
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
    [5.5, 7.5, 8.5],    // Good (peak at 7.5 sigma)
    [4.5, 6.0, 6.5],    // Moderate low
    [8.5, 8.8, 9.1],    // Moderate high
    [3.5, 4.5, 5.5],    // Poor low
    [9.1, 9.8, 10.5],   // Poor high
    [0, 3.5, 4.5],      // Bad low
    [10.5, 11.5, 14],   // Bad high
  ];
  const doFuzzy = [
    [4.5, 6, 8],      // Good
    [3, 4.5, 5],      // Moderate
    [2, 3, 4],        // Poor
    [0, 1, 2.5],      // Bad
  ];
  const turbFuzzy = [
    [0, 2.5, 5],      // Good
    [5, 12.5, 20],    // Moderate
    [20, 35, 50],     // Poor
    [50, 75, 100],    // Bad
  ];
  const ammoniaFuzzy = [
    [0, 0.01, 0.02],    // Good
    [0.02, 0.035, 0.05],// Moderate
    [0.05, 0.08, 0.1],  // Poor
    [0.1, 0.2, 0.5],    // Bad
  ];
  const tdsFuzzy = [
    [0, 50, 100],     // Good
    [100, 200, 300],  // Moderate
    [300, 500, 700],  // Poor
    [700, 900, 1200], // Bad
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
  function getDOColor(val) {
    return legendColors[fuzzyClassify(val, doFuzzy)];
  }
  function getTurbidityColor(val) {
    return legendColors[fuzzyClassify(val, turbFuzzy)];
  }
  function getAmmoniaColor(val) {
    return legendColors[fuzzyClassify(val, ammoniaFuzzy)];
  }
  function getTDSColor(val) {
    return legendColors[fuzzyClassify(val, tdsFuzzy)];
  }

  const checkForAlert = () => {
    if (
      getTempColor(temperature) === legendColors[3] ||
      getPHColor(pH) === legendColors[3] ||
      getTDSColor(tds) === legendColors[3] ||
      getDOColor(doConcentration) === legendColors[3] ||
      getAmmoniaColor(ammoniaLevel) === legendColors[3] ||
      getTurbidityColor(turbidityLevel) === legendColors[3]
    ) {
      if (!alertTriggered && settings?.notificationsEnabled !== false) {
        setAlertTriggered(true);
        Alert.alert(
          language === "English" ? "Water Quality Alert" : "Babala sa Kalidad ng Tubig",
          language === "English"
            ? "One or more water quality parameters have reached a critical level!"
            : "May isa o higit pang parameter na nasa kritikal na antas!"
        );
      }
    } else {
      setAlertTriggered(false);
    }
  };

  useEffect(() => {
    if (data) checkForAlert();
  
  }, [data, species, settings?.notificationsEnabled]);

  
  const parameters = [
    {
      label: language === "English" ? "Temperature" : "Temperatura",
      value: temperature,
      unit: "°C",
      nav: "TemperatureDetails",
      color: getTempColor(temperature)
    },
    {
      label: "pH",
      value: pH,
      unit: "",
      nav: "PHDetails",
      color: getPHColor(pH)
    },
    {
      label: "TDS",
      value: tds,
      unit: "ppm",
      nav: "TDSDetails",
      color: getTDSColor(tds)
    },
    {
      label: language === "English" ? "DO" : "DO",
      value: doConcentration,
      unit: "mg/L",
      nav: "DOConcentrationDetails",
      color: getDOColor(doConcentration)
    },
    {
      label: language === "English" ? "Ammonia" : "Amonya",
      value: ammoniaLevel,
      unit: "mg/L",
      nav: "AmmoniaLevelDetails",
      color: getAmmoniaColor(ammoniaLevel)
    },
    {
      label: language === "English" ? "Turbidity" : "Kakuliman",
      value: turbidityLevel,
      unit: "NTU",
      nav: "TurbidityLevelDetails",
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

      <View style={[styles.glassCard, { width: "98%", maxWidth: 480, paddingVertical: 32, paddingHorizontal: 10 }]}>
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
              }}>{legend}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend Modal */}
        <Modal
          visible={showLegendModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowLegendModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: "#fff", alignItems: "center", minWidth: 320, padding: 0 }]}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowLegendModal(false)}
              >
                <Ionicons name="close" size={28} color="#3a3fbd" />
              </TouchableOpacity>
              <ScrollView horizontal style={{ width: "100%" }}>
                <ScrollView style={{ maxHeight: 320 }}>
                  {/* Table Header */}
                   <View style={{ flexDirection: "row", backgroundColor: "#e0e7ff" }}>
                    <Text style={{ width: 90, fontWeight: "bold", color: "#222", padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Parameter" : "Parameter"}
                    </Text>
                    {legendLabels.map((legend, idx) => (
                      <Text
                        key={legend}
                        style={{
                          width: 80,
                          fontWeight: "bold",
                          color: legendColors[idx],
                          padding: 6,
                          textAlign: "center",
                          textShadowColor: "#fff",
                          textShadowOffset: { width: 0, height: 1 },
                          textShadowRadius: 2,
                        }}
                      >
                        {legend}
                      </Text>
                    ))}
                  </View>
                  {/* Table Rows */}
                  <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" }}>
                    <Text style={{ width: 90, padding: 6, textAlign: "center" }}>pH</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>6.5 - 8.5</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>5.5-6.4{'\n'}8.6-9.0</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>4.5-5.4{'\n'}9.1-10.5</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>{'<4.5\n>10.5'}</Text>
                  </View>
                  <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#f7f8fc" }}>
                    <Text style={{ width: 90, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Temperature" : "Temperatura"}
                    </Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Species Optimal" : "Pinakamainam ng Isda"}
                    </Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Slight deviation" : "Bahagyang labis/kulang"}
                    </Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Significant deviation" : "Malaking labis/kulang"}
                    </Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Extreme" : "Sobrang labis/kulang"}
                    </Text>
                  </View>
                  {/* ...other parameter rows unchanged... */}
                  <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" }}>
                    <Text style={{ width: 90, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "DO (mg/L)" : "DO (mg/L)"}
                    </Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>{'\u2265 5.0'}</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>3.0 - 4.9</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>2.0 - 2.9</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>{'<2.0'}</Text>
                  </View>
                  <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#f7f8fc" }}>
                    <Text style={{ width: 90, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Turbidity (NTU)" : "Kakuliman (NTU)"}
                    </Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>0 - 5</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>6 - 20</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>21 - 50</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>{'>50'}</Text>
                  </View>
                  <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" }}>
                    <Text style={{ width: 90, padding: 6, textAlign: "center" }}>
                      {language === "English" ? "Ammonia (mg/L)" : "Amonya (mg/L)"}
                    </Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>{'\u2264 0.02'}</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>0.03 - 0.05</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>0.06 - 0.1</Text>
                    <Text style={{ width: 80, padding: 6, textAlign: "center" }}>{'>0.1'}</Text>
                  </View>
                </ScrollView>
              </ScrollView>
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
              <Pressable
                style={{
                  backgroundColor: "#009688",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginLeft: 8,
                  elevation: 2,
                }}
                onPress={() => navigation.navigate(param.nav)}
              >
                <Text style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}>
                  {">"}
                </Text>
              </Pressable>
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

function TemperatureDetails({ language }) {
  return (
    <ParameterDetails
      property="temperature"
      title={language === "English" ? "Temperature" : "Temperatura"}
      unit="°C"
      apiProp="temperature"
      language={language}
    />
  );
}

function PHDetails({ language }) {
  return (
    <ParameterDetails
      property="pH"
      title="pH"
      unit=""
      apiProp="pH"
      language={language}
    />
  );
}

function TDSDetails({ language }) {
  return (
    <ParameterDetails
      property="tds"
      title="TDS"
      unit="ppm"
      apiProp="tds"
      language={language}
    />
  );
}

function AmmoniaLevelDetails({ language }) {
  return (
    <ParameterDetails
      property="ammoniaLevel"
      title={language === "English" ? "Ammonia Level" : "Antas ng Amonya"}
      unit="mg/L"
      apiProp="ammoniaLevel"
      language={language}
    />
  );
}

function TurbidityLevelDetails({ language }) {
  return (
    <ParameterDetails
      property="turbidityLevel"
      title={language === "English" ? "Turbidity Level" : "Antas ng Kakuliman"}
      unit="NTU"
      apiProp="turbidityLevel"
      language={language}
    />
  );
}

function DOConcentrationDetails({ language }) {
  return (
    <ParameterDetails
      property="doConcentration"
      title={language === "English" ? "DO Concentration" : "Konsentrasyon ng DO"}
      unit="mg/L"
      apiProp="doConcentration"
      language={language}
    />
  );
}

function AutomatedFeedingPage({ navigation, language }) {
  const [feedAmount, setFeedAmount] = useState(0);
  const [isFeeding, setIsFeeding] = useState(false);
  const [weightSensorData, setWeightSensorData] = useState(0);
  const [rotations, setRotations] = useState(6);
  const [newRotations, setNewRotations] = useState("");
  const [applyPressed, setApplyPressed] = useState(false);
  const [defaultPressed, setDefaultPressed] = useState(false);
  const [feedType, setFeedType] = useState("");
  const [distributionMode, setDistributionMode] = useState("");
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState({
    totalFeedDispensed: 0,
    totalFeedings: 0,
    lastFeedingTime: null,
    avgFeedPerFeeding: 0,
  });


  const feedTypeLabel = language === "English" ? "Feed Type:" : "Uri ng Pakain:";
  const selectFeedType = language === "English" ? "Select feed type..." : "Pumili ng uri ng pakain...";
  const feedType1 = language === "English" ? "Feed Type 1 (placeholder)" : "Uri ng Pakain 1 (placeholder)";
  const feedType2 = language === "English" ? "Feed Type 2 (placeholder)" : "Uri ng Pakain 2 (placeholder)";
  const distributionModeLabel = language === "English" ? "Feed Distribution Mode:" : "Paraan ng Pamamahagi:";
  const selectDistributionMode = language === "English" ? "Select distribution mode..." : "Pumili ng paraan ng pamamahagi...";
  const mode1 = language === "English" ? "Mode 1 (placeholder)" : "Paraan 1 (placeholder)";
  const mode2 = language === "English" ? "Mode 2 (placeholder)" : "Paraan 2 (placeholder)";
  const currentRotationsLabel = language === "English" ? "Current set rotations:" : "Kasalukuyang ikot:";
  const remainingFeedLabel = language === "English" ? "Remaining Feed:" : "Natitirang Pakain:";
  const setRotationsPlaceholder = language === "English"
    ? "Set screw feeder rotations... (Number)"
    : "Ilagay ang ikot ng screw feeder... (Numero)";
  const applyText = language === "English" ? "Apply" : "Ilapat";
  const defaultText = language === "English" ? "Default" : "Depolt";
  const feedingStateLabel = language === "English" ? "Feeding State:" : "Kalagayan ng Pagpapakain:";
  const onText = language === "English" ? "ON" : "BUKAS";
  const offText = language === "English" ? "OFF" : "SARADO";
  const statsButtonText = language === "English" ? "Show Statistics" : "Ipakita ang Estadistika";
  const closeText = language === "English" ? "Close" : "Isara";
  const successAlert = language === "English" ? "Rotations updated successfully." : "Matagumpay na na-update ang ikot.";
  const errorAlert = language === "English" ? "Failed to update rotations." : "Hindi na-update ang ikot.";
  const invalidInputAlert = language === "English"
    ? "Please enter a valid number greater than 0."
    : "Maglagay ng wastong numero na higit sa 0.";
  const defaultSetAlert = language === "English"
    ? "Rotations set to default (6)."
    : "Naitakda sa de-fault (6) ang ikot.";
  const errorSetDefault = language === "English"
    ? "Failed to set default rotations."
    : "Hindi naitakda ang default na ikot.";
  const errorFeedType = language === "English"
    ? "Failed to update feed type."
    : "Hindi na-update ang uri ng pakain.";
  const errorDistributionMode = language === "English"
    ? "Failed to update distribution mode."
    : "Hindi na-update ang paraan ng pamamahagi.";
  const errorFeedingState = language === "English"
    ? "Failed to update feeding state."
    : "Hindi na-update ang kalagayan ng pagpapakain.";

  useEffect(() => {
    axios.get("http://localhost:3000/api/weight")
      .then((response) => setWeightSensorData(response.data.weight))
      .catch(() => setWeightSensorData(0));

    axios.get("http://localhost:3000/api/rotations")
      .then((response) => {
        if (response.data && response.data.rotations !== undefined) {
          setRotations(response.data.rotations);
        }
      })
      .catch(() => setRotations(6));

    axios.get("http://localhost:3000/api/data/latest")
      .then((response) => {
        if (response.data && typeof response.data.isFeeding === "boolean") {
          setIsFeeding(response.data.isFeeding);
        } else {
          setIsFeeding(false);
        }
      })
      .catch(() => setIsFeeding(false));

    axios.get("http://localhost:3000/api/feedtype")
      .then((response) => setFeedType(response.data.feedType || ""))
      .catch(() => setFeedType(""));

    axios.get("http://localhost:3000/api/distributionmode")
      .then((response) => setDistributionMode(response.data.distributionMode || ""))
      .catch(() => setDistributionMode(""));

    axios.get("http://localhost:3000/api/feeding-stats")
      .then((response) => {
        if (response.data) setStats(response.data);
      })
      .catch(() => setStats({
        totalFeedDispensed: 0,
        totalFeedings: 0,
        lastFeedingTime: null,
        avgFeedPerFeeding: 0,
      }));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get("http://localhost:3000/api/weight")
        .then((response) => {
          setWeightSensorData(response.data.weight);
          setFeedAmount(response.data.weight);
        })
        .catch(() => {
          setWeightSensorData(0);
          setFeedAmount(0);
        });

      axios.get("http://localhost:3000/api/data/latest")
        .then((response) => {
          if (response.data && typeof response.data.isFeeding === "boolean") {
            setIsFeeding(response.data.isFeeding);
          }
        })
        .catch(() => {});

      axios.get("http://localhost:3000/api/feeding-stats")
        .then((response) => {
          if (response.data) setStats(response.data);
        })
        .catch(() => {});
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFeedTypeChange = async (value) => {
    const prev = feedType;
    setFeedType(value);
    try {
      await axios.post("http://localhost:3000/api/feedtype", { feedType: value });
    } catch (err) {
      setFeedType(prev);
      Alert.alert("Error", errorFeedType);
    }
  };

  const handleDistributionModeChange = async (value) => {
    const prev = distributionMode;
    setDistributionMode(value);
    try {
      await axios.post("http://localhost:3000/api/distributionmode", { distributionMode: value });
    } catch (err) {
      setDistributionMode(prev);
      Alert.alert("Error", errorDistributionMode);
    }
  };

  const handleApply = async () => {
    const value = parseInt(newRotations);
    if (!isNaN(value) && value > 0) {
      try {
        await axios.post("http://localhost:3000/api/update-rotations", { rotations: value });
        setRotations(value);
        setNewRotations("");
        Alert.alert(language === "English" ? "Success" : "Tagumpay", successAlert);
      } catch (error) {
        Alert.alert("Error", errorAlert);
      }
    } else {
      Alert.alert(language === "English" ? "Invalid Input" : "Di-wastong Input", invalidInputAlert);
    }
  };

  const handleDefault = async () => {
    try {
      await axios.post("http://localhost:3000/api/update-rotations", { rotations: 6 });
      setRotations(6);
      setNewRotations("");
      Alert.alert(language === "English" ? "Default Set" : "Naitakda ang Default", defaultSetAlert);
    } catch (error) {
      Alert.alert("Error", errorSetDefault);
    }
  };

  const handleToggleFeeding = async () => {
    try {
      const newState = !isFeeding;
      await axios.post("http://localhost:3000/api/update-feeding-state", { isFeeding: newState });
      setIsFeeding(newState);
    } catch (error) {
      Alert.alert("Error", errorFeedingState);
    }
  };

  function formatDateTime(dt) {
    if (!dt) return "--";
    const date = new Date(dt);
    return date.toLocaleString();
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0f7fa",
        minHeight: Dimensions.get("window").height,
        paddingVertical: 24,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Background bubbles for texture */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <View style={[
        styles.glassCard,
        {
          maxWidth: 440,
          width: "98%",
          paddingVertical: 24,
          paddingHorizontal: 16,
          marginBottom: 24,
          justifyContent: "flex-start",
        }
      ]}>

        {/* --- Statistics Button --- */}
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
          onPress={() => setShowStatsModal(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
            {statsButtonText}
          </Text>
        </TouchableOpacity>

        {/* --- Statistics Modal --- */}
        <Modal
          visible={showStatsModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowStatsModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <View style={{
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
            }}>
              <Text style={{ color: "#009688", fontWeight: "bold", fontSize: 18, marginBottom: 10, textAlign: "center" }}>
                {language === "English" ? "Feeding Statistics" : "Estadistika ng Pagpapakain"}
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                {language === "English" ? "Total Feed Dispensed:" : "Kabuuang Pakain:"} <Text style={{ fontWeight: "bold" }}>{stats.totalFeedDispensed} g</Text>
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                {language === "English" ? "Total Feedings:" : "Kabuuang Pagpapakain:"} <Text style={{ fontWeight: "bold" }}>{stats.totalFeedings}</Text>
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                {language === "English" ? "Average Feed per Feeding:" : "Karaniwang Pakain kada Pagpapakain:"} <Text style={{ fontWeight: "bold" }}>{stats.avgFeedPerFeeding} g</Text>
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 10 }}>
                {language === "English" ? "Last Feeding Time:" : "Huling Oras ng Pagpapakain:"} <Text style={{ fontWeight: "bold" }}>{formatDateTime(stats.lastFeedingTime)}</Text>
              </Text>
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
                  {closeText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Feed Type Picker */}
        <Text style={{ fontSize: 16, color: "#009688", fontWeight: "bold", marginBottom: 2, textAlign: "center" }}>
          {feedTypeLabel}
        </Text>
        <View style={{
          borderWidth: 1,
          borderColor: "#009688",
          borderRadius: 8,
          marginBottom: 10,
          width: "100%",
          maxWidth: 300,
          backgroundColor: "#f7f7fb",
        }}>
          <Picker
            selectedValue={feedType}
            onValueChange={handleFeedTypeChange}
            style={{ width: "100%" }}
          >
            <Picker.Item label={selectFeedType} value="" />
            <Picker.Item label={feedType1} value="type1" />
            <Picker.Item label={feedType2} value="type2" />
          </Picker>
        </View>

        {/* Distribution Mode Picker */}
        <Text style={{ fontSize: 16, color: "#009688", fontWeight: "bold", marginBottom: 2, textAlign: "center" }}>
          {distributionModeLabel}
        </Text>
        <View style={{
          borderWidth: 1,
          borderColor: "#009688",
          borderRadius: 8,
          marginBottom: 10,
          width: "100%",
          maxWidth: 300,
          backgroundColor: "#f7f7fb",
        }}>
          <Picker
            selectedValue={distributionMode}
            onValueChange={handleDistributionModeChange}
            style={{ width: "100%" }}
          >
            <Picker.Item label={selectDistributionMode} value="" />
            <Picker.Item label={mode1} value="mode1" />
            <Picker.Item label={mode2} value="mode2" />
          </Picker>
        </View>

        {/* Rotations */}
        <Text style={{ fontSize: 16, color: "#009688", fontWeight: "bold", marginBottom: 2, textAlign: "center" }}>
          {currentRotationsLabel}
        </Text>
        <View style={{
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
        }}>
          <Text style={{
            fontSize: 18,
            color: "#009688",
            fontWeight: "bold",
          }}>
            {rotations}
          </Text>
        </View>

        {/* Remaining Feed */}
        <Text style={{ fontSize: 16, color: "#009688", fontWeight: "bold", marginBottom: 2, textAlign: "center" }}>
          {remainingFeedLabel}
        </Text>
        <View style={{
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
        }}>
          <Text style={{
            fontSize: 18,
            color: "#009688",
            fontWeight: "bold",
          }}>
            {weightSensorData ? weightSensorData : 0}
          </Text>
        </View>

        {/* Rotations Input */}
        <TextInput
          style={{
            borderColor: "#009688",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 14,
            width: "100%",
            minWidth: 150,
            maxWidth: 300,
            textAlign: "center",
            alignSelf: "center",
            backgroundColor: "#f7f7fb",
            fontSize: 15,
          }}
          value={newRotations}
          onChangeText={(text) => setNewRotations(text.replace(/[^0-9]/g, ""))}
          placeholder={setRotationsPlaceholder}
          keyboardType="number-pad"
        />

        {/* Apply & Default Buttons */}
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
              backgroundColor: applyPressed ? "#009688" : "#fff",
              borderColor: "#009688",
              borderWidth: 2,
              borderRadius: 30,
              paddingVertical: 10,
              alignItems: "center",
              shadowColor: "#009688",
              shadowOpacity: applyPressed ? 0.18 : 0.08,
              elevation: applyPressed ? 6 : 2,
            }}
            onPressIn={() => setApplyPressed(true)}
            onPressOut={() => setApplyPressed(false)}
            onPress={handleApply}
          >
            <Text style={{
              color: applyPressed ? "#fff" : "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}>
              {applyText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 8,
              backgroundColor: defaultPressed ? "#009688" : "#fff",
              borderColor: "#009688",
              borderWidth: 2,
              borderRadius: 30,
              paddingVertical: 10,
              alignItems: "center",
              shadowColor: "#009688",
              shadowOpacity: defaultPressed ? 0.18 : 0.08,
              elevation: defaultPressed ? 6 : 2,
            }}
            onPressIn={() => setDefaultPressed(true)}
            onPressOut={() => setDefaultPressed(false)}
            onPress={handleDefault}
          >
            <Text style={{
              color: defaultPressed ? "#fff" : "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}>
              {defaultText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feeding State Switch */}
        <View style={{ alignItems: "center", marginVertical: 10, width: "100%" }}>
          <Text style={{ fontSize: 16, color: "#009688", fontWeight: "bold", marginBottom: 6 }}>
            {feedingStateLabel}
          </Text>
          <TouchableOpacity
            onPress={handleToggleFeeding}
            style={{
              width: 60,
              height: 34,
              borderRadius: 17,
              backgroundColor: isFeeding ? "#4CAF50" : "#B22222",
              justifyContent: "center",
              alignItems: isFeeding ? "flex-end" : "flex-start",
              padding: 4,
              marginTop: 10,
              alignSelf: "center",
            }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              }}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: isFeeding ? "#4CAF50" : "#B22222", fontWeight: "bold", textAlign: "center" }}>
            {isFeeding ? onText : offText}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function AlgaeControlPage({ navigation, language }) {
  const [interval, setInterval] = useState(0);
  const [newInterval, setNewInterval] = useState("");
  const [isTransducerOn, setIsTransducerOn] = useState(false);
  const [applyPressed, setApplyPressed] = useState(false);
  const [defaultPressed, setDefaultPressed] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState({
    totalActivations: 0,
    totalMinutes: 0,
    lastActivation: null,
    avgInterval: 0,
  });

  const promptText =
    language === "English"
      ? "Set ultrasound interval... (Number)"
      : "Ilagay ang nais na interbal.. (Numero)";
  const applyButtonText = language === "English" ? "Apply" : "I-apply";
  const defaultButtonText = language === "English" ? "Default" : "Depolt";
  const explanation =
    language === "English"
      ? "This prompt only accepts minutes."
      : "Ang prompt na ito ay tumatanggap lamang ng minuto.";
  const counterText =
    language === "English" ? "Current set interval:" : "Kasalukuyang interbal:";
  const transducerStateLabel =
    language === "English" ? "Transducer State:" : "Kalagayan ng Transducer:";
  const onText = language === "English" ? "ON" : "BUKAS";
  const offText = language === "English" ? "OFF" : "SARADO";
  const statsButtonText = language === "English" ? "Show Statistics" : "Ipakita ang Estadistika";
  const closeText = language === "English" ? "Close" : "Isara";

  useEffect(() => {
    fetch("http://localhost:3000/api/interval")
      .then((response) => response.json())
      .then((data) => setInterval(data.interval))
      .catch((error) => console.error(error));

    fetch("http://localhost:3000/api/transducer-state")
      .then((response) => response.json())
      .then((data) => setIsTransducerOn(!!data.isTransducerOn))
      .catch((error) => console.error(error));

    fetch("http://localhost:3000/api/algae-stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch(() =>
        setStats({
          totalActivations: 0,
          totalMinutes: 0,
          lastActivation: null,
          avgInterval: 0,
        })
      );
  }, []);

  useEffect(() => {
    if (interval !== 0) {
      fetch("http://localhost:3000/api/interval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  }, [interval]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:3000/api/algae-stats")
        .then((response) => response.json())
        .then((data) => setStats(data))
        .catch(() => {});
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleApply = () => {
    const value = parseInt(newInterval);
    if (!isNaN(value) && value >= 0) {
      const newIntervalValue = value * 60000;
      setInterval(newIntervalValue);

      fetch("http://localhost:3000/api/interval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: newIntervalValue }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };

  const handleReset = () => {
    setInterval(0);
    setNewInterval("");
    fetch("http://localhost:3000/api/interval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interval: 0 }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleTransducerToggle = () => {
    const newState = !isTransducerOn;
    setIsTransducerOn(newState);
    fetch("http://localhost:3000/api/transducer-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isTransducerOn: newState }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  function formatDateTime(dt) {
    if (!dt) return "--";
    const date = new Date(dt);
    return date.toLocaleString();
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0f7fa",
        minHeight: Dimensions.get("window").height,
        paddingVertical: 24,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Background bubbles for texture */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <View style={[
        styles.glassCard,
        {
          maxWidth: 440,
          width: "98%",
          paddingVertical: 24,
          paddingHorizontal: 16,
          marginBottom: 24,
          justifyContent: "flex-start",
        }
      ]}>

        {/* --- Statistics Button --- */}
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
          onPress={() => setShowStatsModal(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
            {statsButtonText}
          </Text>
        </TouchableOpacity>

        {/* --- Statistics Modal --- */}
        <Modal
          visible={showStatsModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowStatsModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <View style={{
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
            }}>
              <Text style={{ color: "#009688", fontWeight: "bold", fontSize: 18, marginBottom: 10, textAlign: "center" }}>
                {language === "English" ? "Algae Control Statistics" : "Estadistika ng Kontrol ng Algae"}
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                {language === "English" ? "Total Activations:" : "Kabuuang Pag-activate:"} <Text style={{ fontWeight: "bold" }}>{stats.totalActivations}</Text>
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                {language === "English" ? "Total Minutes Active:" : "Kabuuang Minuto Aktibo:"} <Text style={{ fontWeight: "bold" }}>{stats.totalMinutes}</Text>
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 4 }}>
                {language === "English" ? "Average Interval (min):" : "Karaniwang Interbal (min):"} <Text style={{ fontWeight: "bold" }}>{stats.avgInterval}</Text>
              </Text>
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 10 }}>
                {language === "English" ? "Last Activation:" : "Huling Pag-activate:"} <Text style={{ fontWeight: "bold" }}>{formatDateTime(stats.lastActivation)}</Text>
              </Text>
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
                  {closeText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Interval Row */}
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
            {counterText}
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
              {interval ? Math.round(interval / 60000) : 0} {language === "English" ? "minute/s" : "minuto"}
            </Text>
          </View>
        </View>
        {/* Input and Buttons */}
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
          value={newInterval}
          onChangeText={(text) => setNewInterval(text.replace(/[^0-9]/g, ""))}
          placeholder={promptText}
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
          {explanation}
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
              backgroundColor: applyPressed ? "#009688" : "#fff",
              borderColor: "#009688",
              borderWidth: 2,
              borderRadius: 30,
              paddingVertical: 10,
              alignItems: "center",
              shadowColor: "#009688",
              shadowOpacity: applyPressed ? 0.18 : 0.08,
              elevation: applyPressed ? 6 : 2,
            }}
            onPressIn={() => setApplyPressed(true)}
            onPressOut={() => setApplyPressed(false)}
            onPress={handleApply}
          >
            <Text style={{
              color: applyPressed ? "#fff" : "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}>
              {applyButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 8,
              backgroundColor: defaultPressed ? "#009688" : "#fff",
              borderColor: "#009688",
              borderWidth: 2,
              borderRadius: 30,
              paddingVertical: 10,
              alignItems: "center",
              shadowColor: "#009688",
              shadowOpacity: defaultPressed ? 0.18 : 0.08,
              elevation: defaultPressed ? 6 : 2,
            }}
            onPressIn={() => setDefaultPressed(true)}
            onPressOut={() => setDefaultPressed(false)}
            onPress={handleReset}
          >
            <Text style={{
              color: defaultPressed ? "#fff" : "#009688",
              fontWeight: "bold",
              fontSize: 15,
              letterSpacing: 1,
            }}>
              {defaultButtonText}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Transducer State */}
        <View style={{ alignItems: "center", marginVertical: 10, width: "100%" }}>
          <Text style={{ fontSize: 16, color: "#009688", fontWeight: "bold", marginBottom: 6 }}>
            {transducerStateLabel}
          </Text>
          <TouchableOpacity
            onPress={handleTransducerToggle}
            style={{
              width: 60,
              height: 34,
              borderRadius: 17,
              backgroundColor: isTransducerOn ? "#4CAF50" : "#B22222",
              justifyContent: "center",
              alignItems: isTransducerOn ? "flex-end" : "flex-start",
              padding: 4,
              marginTop: 10,
              alignSelf: "center",
            }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              }}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: isTransducerOn ? "#4CAF50" : "#B22222", fontWeight: "bold", textAlign: "center" }}>
            {isTransducerOn ? onText : offText}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SettingsPage({ navigation, language, setLanguage }) {

  let buttonText1 = language === "English" ? "English" : "Ingles";
  let buttonText2 = language === "English" ? "Tagalog" : "Tagalog";
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const notificationsLabel = language === "English" ? "Notifications:" : "Abiso:";
  const notificationsOn = language === "English" ? "On" : "Bukas";
  const notificationsOff = language === "English" ? "Off" : "Sarado";

  const exportLabel = language === "English" ? "Export Data" : "I-export ang Datos";
  const importLabel = language === "English" ? "Import Data" : "I-import ang Datos";

  const resetLabel = language === "English" ? "Reset to Defaults" : "I-reset sa Default";

  const [applyPressed, setApplyPressed] = useState(false);

  const [importExportMsg, setImportExportMsg] = useState("");

  const handleNotificationsToggle = () => setNotificationsEnabled((prev) => !prev);

const handleExport = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/export");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);

    if (Platform.OS === "web") {
      // Web: use Blob and download
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "export.json";
      a.click();
      URL.revokeObjectURL(url);
      setImportExportMsg("Export successful!");
    } else {
      //kapag mobile, use FileSystem and Share
      const fileUri = FileSystem.documentDirectory + "export.json";
      await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
      await Share.share({
        url: fileUri,
        message: "AquaGUARD Export Data",
        title: "export.json"
      });
      setImportExportMsg("Export successful! File saved and ready to share.");
    }
  } catch (err) {
    setImportExportMsg("Export failed.");
  }
};

  const handleImport = async () => {
    setImportExportMsg(language === "English" ? "Import not implemented in demo." : "Hindi pa suportado ang import.");
  };

  const handleReset = () => {
    setSelectedLanguage("English");
    setNotificationsEnabled(true);
    setApiEndpoint("http://localhost:3000");
    setImportExportMsg(language === "English" ? "Settings reset to default." : "Nareset sa default ang mga setting.");
  };

  return (
    <View style={styles.emptyPage}>
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <View style={[
        styles.glassCard,
        {
          maxWidth: 400,
          width: "97%",
          paddingVertical: 24,
          paddingHorizontal: 18,
          alignItems: "stretch",
        }
      ]}>
        <Image
          source={require("./assets/setting.png")}
          style={{
            marginBottom: 10,
            width: 70,
            height: 70,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />

        <View
  style={{
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 12, 
  }}
>
  <View style={{ flex: 1, alignItems: "center" }}>
    <Text style={{ fontWeight: "bold", color: "#009688", fontSize: 15, marginBottom: 4, textAlign: "center" }}>
      {language === "English" ? "Language" : "Wika"}
    </Text>
    <View style={{ flexDirection: "row", gap: 6 }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            flex: 1,
            marginRight: 3,
            backgroundColor: selectedLanguage === "English" ? "#009688" : "#fff",
            borderColor: "#009688",
            borderWidth: 2,
            borderRadius: 20,
            paddingVertical: 7,
            alignItems: "center",
            minWidth: 70,
          },
        ]}
        onPress={() => setSelectedLanguage("English")}
      >
        <Text style={{
          color: selectedLanguage === "English" ? "#fff" : "#009688",
          fontWeight: "bold",
          fontSize: 14,
          letterSpacing: 1,
        }}>
          {buttonText1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            flex: 1,
            marginLeft: 3,
            backgroundColor: selectedLanguage === "Tagalog" ? "#009688" : "#fff",
            borderColor: "#009688",
            borderWidth: 2,
            borderRadius: 20,
            paddingVertical: 7,
            alignItems: "center",
            minWidth: 70,
          },
        ]}
        onPress={() => setSelectedLanguage("Tagalog")}
      >
        <Text style={{
          color: selectedLanguage === "Tagalog" ? "#fff" : "#009688",
          fontWeight: "bold",
          fontSize: 14,
          letterSpacing: 1,
        }}>
          {buttonText2}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
  <View style={{ flex: 1, alignItems: "center" }}>
    <Text style={{ fontWeight: "bold", color: "#009688", fontSize: 15, marginBottom: 4, textAlign: "center" }}>
      {notificationsLabel}
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: notificationsEnabled ? "#4CAF50" : "#B22222",
        borderRadius: 16,
        paddingVertical: 7,
        alignItems: "center",
        minWidth: 100,
      }}
      onPress={handleNotificationsToggle}
    >
      <Text style={{
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        letterSpacing: 1,
      }}>
        {notificationsEnabled ? notificationsOn : notificationsOff}
      </Text>
    </TouchableOpacity>
  </View>
</View>

        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                flex: 1,
                marginRight: 5,
                backgroundColor: "#fff",
                borderColor: "#009688",
                borderWidth: 2,
                borderRadius: 20,
                paddingVertical: 8,
                alignItems: "center",
              },
            ]}
            onPress={handleExport}
          >
            <Text style={{
              color: "#009688",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: 1,
            }}>
              {exportLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                flex: 1,
                marginLeft: 5,
                backgroundColor: "#fff",
                borderColor: "#009688",
                borderWidth: 2,
                borderRadius: 20,
                paddingVertical: 8,
                alignItems: "center",
              },
            ]}
            onPress={handleImport}
          >
            <Text style={{
              color: "#009688",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: 1,
            }}>
              {importLabel}
            </Text>
          </TouchableOpacity>
        </View>
        {importExportMsg ? (
          <Text style={{ color: "#009688", fontSize: 12, marginBottom: 8, textAlign: "center" }}>
            {importExportMsg}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                flex: 1,
                marginRight: 8,
                backgroundColor: "#fff",
                borderColor: "#d32f2f",
                borderWidth: 2,
                borderRadius: 20,
                paddingVertical: 10,
                alignItems: "center",
              },
            ]}
            onPress={handleReset}
          >
            <Text style={{
              color: "#d32f2f",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: 1,
            }}>
              {resetLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                flex: 1,
                marginLeft: 8,
                backgroundColor: applyPressed ? "#009688" : "#fff",
                borderColor: "#009688",
                borderWidth: 2,
                borderRadius: 20,
                paddingVertical: 10,
                alignItems: "center",
              },
            ]}
            onPressIn={() => setApplyPressed(true)}
            onPressOut={() => setApplyPressed(false)}
            onPress={() => {
              setLanguage(selectedLanguage);
              navigation.goBack();
            }}
          >
            <Text style={{
              color: applyPressed ? "#fff" : "#009688",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: 1,
            }}>
              {language === "English" ? "Apply" : "Ilapat"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
        children={(props) => <HomePage {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="WaterQuality"
        children={(props) => <WaterQualityPage {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="AutomatedFeeding"
        children={(props) => <AutomatedFeedingPage {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="AlgaeControl"
        children={(props) => <AlgaeControlPage {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="Settings"
        children={(props) => (
          <SettingsPage
            {...props}
            language={language}
            setLanguage={setLanguage}
            settings={settings}
            setSettings={setSettings}
          />
        )}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="TemperatureDetails"
        children={(props) => <TemperatureDetails {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="PHDetails"
        children={(props) => <PHDetails {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="TDSDetails"
        children={(props) => <TDSDetails {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="DOConcentrationDetails"
        children={(props) => <DOConcentrationDetails {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="AmmoniaLevelDetails"
        children={(props) => <AmmoniaLevelDetails {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="TurbidityLevelDetails"
        children={(props) => <TurbidityLevelDetails {...props} language={language} settings={settings} />}
        options={{ headerTitle: "" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
}




function ParameterDetails({ property, title, unit, language = "English" }) {
  const [duration, setDuration] = useState("1d");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ avg: "--", min: "--", max: "--", latest: "--", median: "--", count: 0 });
  const [expanded, setExpanded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  //for date/week/month/year search and compare
  const [periodType, setPeriodType] = useState("day"); // "day", "week", "month", "year"
  const [periodInput, setPeriodInput] = useState(""); // YYYY-MM-DD, YYYY-[W]WW, YYYY-MM, YYYY
  const [compareInput, setCompareInput] = useState("");
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [allParamsStats, setAllParamsStats] = useState(null);
  const [allParamsCompareStats, setAllParamsCompareStats] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showComparePicker, setShowComparePicker] = useState(false);

  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showCompareWeekPicker, setShowCompareWeekPicker] = useState(false);
  const [showCompareMonthPicker, setShowCompareMonthPicker] = useState(false);
  const [showCompareYearPicker, setShowCompareYearPicker] = useState(false);

  const PARAMS = [
    { key: "temperature", label: language === "English" ? "Temperature" : "Temperatura", unit: "°C" },
    { key: "pH", label: "pH", unit: "" },
    { key: "tds", label: "TDS", unit: "ppm" },
    { key: "doConcentration", label: language === "English" ? "DO" : "DO", unit: "mg/L" },
    { key: "ammoniaLevel", label: language === "English" ? "Ammonia" : "Amonya", unit: "mg/L" },
    { key: "turbidityLevel", label: language === "English" ? "Turbidity" : "Kakuliman", unit: "NTU" },
  ];

  const summaryLabels = {
    latest: language === "English" ? "Latest" : "Pinakabago",
    average: language === "English" ? "Average" : "Average",
    median: language === "English" ? "Median" : "Gitna",
    min: language === "English" ? "Min" : "Pinakamababa",
    max: language === "English" ? "Max" : "Pinakamataas",
    count: language === "English" ? "Count" : "Bilang",
    dataSummary: language === "English" ? "Data Summary" : "Buod ng Datos",
    loading: language === "English" ? "Loading..." : "Naglo-load...",
    notEnough: language === "English" ? "Not enough data for this time range." : "Hindi sapat ang datos para sa saklaw ng oras na ito.",
    noData: language === "English" ? "No data available." : "Walang datos.",
    tapGraph: language === "English" ? "Tap graph to expand" : "I-tap ang graph para palakihin",
    shrink: language === "English" ? "shrink" : "liitin",
    expand: language === "English" ? "expand" : "palakihin",
    trends: language === "English" ? "Trends" : "Trend",
    at: language === "English" ? "at" : "noong",
    value: language === "English" ? "Value" : "Halaga",
    incomplete: language === "English" ? "Data is incomplete for this interval." : "Hindi kumpleto ang datos para sa saklaw na ito.",
    search: language === "English" ? "Search" : "Hanapin",
    compare: language === "English" ? "Compare" : "Ihambing",
    enterDate: language === "English" ? "Pick date" : "Pumili ng petsa",
    enterWeek: language === "English" ? "Pick week" : "Pumili ng linggo",
    enterMonth: language === "English" ? "Pick month" : "Pumili ng buwan",
    enterYear: language === "English" ? "Pick year" : "Pumili ng taon",
    invalidDate: language === "English" ? "Invalid format." : "Maling format.",
    noStats: language === "English" ? "No data for this period." : "Walang datos para sa panahong ito.",
    close: language === "English" ? "Close" : "Isara",
    today: language === "English" ? "Today" : "Ngayon",
    period: language === "English" ? "Period" : "Panahon",
  };

  const getStartTime = () => {
    const now = new Date();
    if (duration === "1d") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (duration === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (duration === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (duration === "1y") return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    return new Date(0);
  };

  function aggregateData(raw, duration) {
    if (!raw.length) return [];
    const buckets = {};
    raw.forEach((d) => {
      const date = new Date(d.timestamp);
      let key;
      if (duration === "1d") {
        key = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).toISOString();
      } else if (duration === "7d") {
        key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      } else if (duration === "30d") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      } else if (duration === "1y") {
        key = `${date.getFullYear()}`;
      }
      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(Number(d[property]));
    });
    return Object.entries(buckets).map(([key, values]) => {
      let x;
      if (duration === "1d" || duration === "7d") {
        x = key;
      } else if (duration === "30d") {
        const [y, m] = key.split("-");
        x = new Date(Number(y), Number(m) - 1, 1).toISOString();
      } else if (duration === "1y") {
        x = new Date(Number(key), 0, 1).toISOString();
      }
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return { timestamp: x, [property]: avg };
    }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/data")
      .then((res) => res.json())
      .then((json) => {
        const startTime = getStartTime();
        const filtered = json
          .filter((d) => d.timestamp && new Date(d.timestamp) >= startTime && typeof d[property] === "number")
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const aggregated = aggregateData(filtered, duration);
        setData(aggregated);

        if (aggregated.length > 0) {
          const values = aggregated.map((d) => Number(d[property]));
          const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
          const min = Math.min(...values).toFixed(2);
          const max = Math.max(...values).toFixed(2);
          const latest = values[values.length - 1].toFixed(2);
          const sortedVals = [...values].sort((a, b) => a - b);
          const median = (sortedVals.length % 2 === 0)
            ? ((sortedVals[sortedVals.length / 2 - 1] + sortedVals[sortedVals.length / 2]) / 2).toFixed(2)
            : sortedVals[Math.floor(sortedVals.length / 2)].toFixed(2);
          setSummary({ avg, min, max, latest, median, count: values.length });
        } else {
          setSummary({ avg: "--", min: "--", max: "--", latest: "--", median: "--", count: 0 });
        }
      })
      .catch(() => setSummary({ avg: "--", min: "--", max: "--", latest: "--", median: "--", count: 0 }))
      .finally(() => setLoading(false));
  }, [duration, property]);

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const graphWidth = expanded ? Math.max(Math.min(screenWidth * 1.5, 900), 600) : Math.min(screenWidth - 64, 340);
  const graphHeight = expanded ? Math.max(Math.min(screenHeight * 0.7, 600), 400) : 220;

  function isDataIncomplete() {
    if (!data.length) return false;
    if (duration === "1d") return data.length < 24;
    if (duration === "7d") return data.length < 7;
    if (duration === "30d") return data.length < 1; // 1 month
    if (duration === "1y") return data.length < 1; // 1 year
    return false;
  }

  const getTickFormat = (t) => {
    const date = new Date(t);
    if (duration === "1d") {
      let hour = date.getHours();
      let ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return `${hour}${ampm}`;
    }
    if (duration === "7d") {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (duration === "30d") {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    }
    if (duration === "1y") {
      return `${date.getFullYear()}`;
    }
    return "";
  };

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const primaryColor = "#00796b";
  const secondaryColor = "#e0f7fa";
  const accentColor = "#009688";
  const cardBg = "rgba(255,255,255,0.10)";

  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const d = selectedDate.getDate().toString().padStart(2, "0");
      setPeriodInput(`${y}-${m}-${d}`);
    }
  };
  const handleCompareDateChange = (event, selectedDate) => {
    setShowComparePicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const d = selectedDate.getDate().toString().padStart(2, "0");
      setCompareInput(`${y}-${m}-${d}`);
    }
  };
  const handleMonthChange = (event, selectedDate) => {
    setShowMonthPicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      setPeriodInput(`${y}-${m}`);
    }
  };
  const handleCompareMonthChange = (event, selectedDate) => {
    setShowCompareMonthPicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      setCompareInput(`${y}-${m}`);
    }
  };
  const handleYearChange = (event, selectedDate) => {
    setShowYearPicker(false);
    if (selectedDate) {
      setPeriodInput(`${selectedDate.getFullYear()}`);
    }
  };
  const handleCompareYearChange = (event, selectedDate) => {
    setShowCompareYearPicker(false);
    if (selectedDate) {
      setCompareInput(`${selectedDate.getFullYear()}`);
    }
  };

  const handleWeekChange = (event, selectedDate) => {
    setShowWeekPicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const firstDay = new Date(y, 0, 1);
      const days = Math.floor((selectedDate - firstDay) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
      setPeriodInput(`${y}-W${week.toString().padStart(2, "0")}`);
    }
  };
  const handleCompareWeekChange = (event, selectedDate) => {
    setShowCompareWeekPicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const firstDay = new Date(y, 0, 1);
      const days = Math.floor((selectedDate - firstDay) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
      setCompareInput(`${y}-W${week.toString().padStart(2, "0")}`);
    }
  };

  async function fetchStatsForPeriod(periodType, periodStr, setStats) {
    try {
      const res = await fetch("http://localhost:3000/api/data");
      const json = await res.json();
      const stats = {};
      let found = false;
      for (const param of PARAMS) {
        let filtered = [];
        if (periodType === "day") {
          filtered = json.filter((d) => {
            if (!d.timestamp || typeof d[param.key] !== "number") return false;
            const dt = new Date(d.timestamp);
            const y = dt.getFullYear();
            const m = (dt.getMonth() + 1).toString().padStart(2, "0");
            const day = dt.getDate().toString().padStart(2, "0");
            return `${y}-${m}-${day}` === periodStr;
          });
        } else if (periodType === "week") {
          filtered = json.filter((d) => {
            if (!d.timestamp || typeof d[param.key] !== "number") return false;
            const dt = new Date(d.timestamp);
            const y = dt.getFullYear();
            const firstDay = new Date(y, 0, 1);
            const days = Math.floor((dt - firstDay) / (24 * 60 * 60 * 1000));
            const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
            return `${y}-W${week.toString().padStart(2, "0")}` === periodStr;
          });
        } else if (periodType === "month") {
          filtered = json.filter((d) => {
            if (!d.timestamp || typeof d[param.key] !== "number") return false;
            const dt = new Date(d.timestamp);
            const y = dt.getFullYear();
            const m = (dt.getMonth() + 1).toString().padStart(2, "0");
            return `${y}-${m}` === periodStr;
          });
        } else if (periodType === "year") {
          filtered = json.filter((d) => {
            if (!d.timestamp || typeof d[param.key] !== "number") return false;
            const dt = new Date(d.timestamp);
            const y = dt.getFullYear();
            return `${y}` === periodStr;
          });
        }
        if (filtered.length > 0) {
          found = true;
          const values = filtered.map((d) => Number(d[param.key]));
          stats[param.key] = {
            avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
            min: Math.min(...values).toFixed(2),
            max: Math.max(...values).toFixed(2),
            count: values.length,
          };
        } else {
          stats[param.key] = null;
        }
      }
      setStats(found ? stats : null);
    } catch (e) {
      setStats(null);
    }
  }

  const now = new Date();
  const currentDateString = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,"0")}-${now.getDate().toString().padStart(2,"0")}`;

  return (
    <View style={{
      flex: 1,
      backgroundColor: secondaryColor,
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
    }}>
      <Text style={{
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
        alignSelf: "flex-end",
        marginRight: 24,
        marginTop: 8,
        marginBottom: 2,
        opacity: 0.7,
      }}>
        {summaryLabels.today}: {currentDateString}
      </Text>
      <View style={{
        width: expanded ? "100%" : "96%",
        maxWidth: 540,
        backgroundColor: cardBg,
        borderRadius: 24,
        borderWidth: 1.2,
        borderColor: "rgba(0,121,107,0.18)",
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 4,
        alignItems: "center",
        paddingVertical: expanded ? 18 : 12,
        paddingHorizontal: expanded ? 8 : 8,
        marginVertical: expanded ? 0 : 18,
      }}>
        <Text style={{
          fontSize: expanded ? 24 : 20,
          fontWeight: "bold",
          color: primaryColor,
          marginBottom: expanded ? 12 : 8,
          marginTop: expanded ? 10 : 0,
          textAlign: "center",
        }}>
          {title} {summaryLabels.trends}
        </Text>
        <Text style={{
          position: "absolute",
          left: 18,
          top: expanded ? 12 : 6,
          fontSize: 13,
          color: primaryColor,
          fontWeight: "bold",
          zIndex: 2,
        }}>
          {unit}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 6 }}>
          <View style={{ flexDirection: "row", marginRight: 8 }}>
            {["day", "week", "month", "year"].map((type) => (
              <TouchableOpacity
                key={type}
                style={{
                  backgroundColor: periodType === type ? primaryColor : "#e0e7ff",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  marginRight: 4,
                }}
                onPress={() => {
                  setPeriodType(type);
                  setPeriodInput("");
                }}
              >
                <Text style={{ color: periodType === type ? "#fff" : primaryColor, fontWeight: "bold" }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: primaryColor,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 7,
              backgroundColor: "#fff",
              width: 130,
              marginRight: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => {
              if (periodType === "day") setShowDatePicker(true);
              else if (periodType === "week") setShowWeekPicker(true);
              else if (periodType === "month") setShowMonthPicker(true);
              else if (periodType === "year") setShowYearPicker(true);
            }}
          >
            <Text style={{ fontSize: 15, color: "#333" }}>
              {periodInput ||
                (periodType === "day"
                  ? summaryLabels.enterDate
                  : periodType === "week"
                  ? summaryLabels.enterWeek
                  : periodType === "month"
                  ? summaryLabels.enterMonth
                  : summaryLabels.enterYear)}
            </Text>
            <Ionicons name="calendar" size={18} color={primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: primaryColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 7,
              marginRight: 8,
            }}
            onPress={async () => {
              if (!periodInput) {
                Alert.alert(summaryLabels.invalidDate);
                return;
              }
              setShowPeriodModal(true);
              setAllParamsStats(null);
              await fetchStatsForPeriod(periodType, periodInput, setAllParamsStats);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{summaryLabels.search}</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={periodInput ? new Date(periodInput) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {showWeekPicker && (
          <DateTimePicker
            value={periodInput ? new Date(periodInput) : new Date()}
            mode="date"
            display="default"
            onChange={handleWeekChange}
          />
        )}
        {showMonthPicker && (
          <DateTimePicker
            value={periodInput ? new Date(periodInput + "-01") : new Date()}
            mode="date"
            display="default"
            onChange={handleMonthChange}
          />
        )}
        {showYearPicker && (
          <DateTimePicker
            value={periodInput ? new Date(periodInput + "-01-01") : new Date()}
            mode="date"
            display="default"
            onChange={handleYearChange}
          />
        )}
        {!expanded && (
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {DURATION_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: duration === opt.value ? primaryColor : "#e0e7ff",
                  marginHorizontal: 4,
                }}
                onPress={() => setDuration(opt.value)}
              >
                <Text
                  style={{
                    color: duration === opt.value ? "#fff" : primaryColor,
                    fontWeight: "bold",
                  }}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {expanded ? (
          <View style={{ width: "100%", flex: 1 }}>
            <ScrollView
              horizontal
              style={{
                width: "100%",
                flexGrow: 0,
              }}
              contentContainerStyle={{
                minWidth: graphWidth,
                minHeight: graphHeight,
                paddingBottom: 32,
              }}
            >
              <ScrollView
                style={{ flexGrow: 0 }}
                contentContainerStyle={{
                  minHeight: graphHeight,
                  minWidth: graphWidth,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setExpanded((prev) => !prev)}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: graphWidth,
                  }}
                >
                  <View style={{
                    width: graphWidth,
                    height: graphHeight,
                    backgroundColor: secondaryColor,
                    borderRadius: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 0,
                    padding: 8,
                    borderWidth: 2,
                    borderColor: primaryColor,
                    alignSelf: "center",
                  }}>
                    {loading ? (
                      <Text style={{ color: primaryColor }}>{summaryLabels.loading}</Text>
                    ) : data.length > 0 ? (
                      <>
                        <Svg width={graphWidth} height={graphHeight}>
                          <VictoryChart
                            width={graphWidth}
                            height={graphHeight}
                            theme={VictoryTheme.material}
                            domainPadding={30}
                            standalone={false}
                            padding={{ top: 30, bottom: 70, left: 60, right: 30 }}
                            scale={{ x: "time" }}
                          >
                            <VictoryAxis
                              tickFormat={getTickFormat}
                              style={{
                                axis: { stroke: primaryColor },
                                tickLabels: { fontSize: 14, angle: 0, padding: 10, fill: primaryColor },
                                grid: { stroke: "#b2dfdb" },
                              }}
                              fixLabelOverlap
                            />
                            <VictoryAxis
                              dependentAxis
                              style={{
                                axis: { stroke: primaryColor },
                                tickLabels: { fontSize: 16, fill: primaryColor },
                                grid: { stroke: "#b2dfdb" },
                              }}
                            />
                            <VictoryLine
                              data={data}
                              x="timestamp"
                              y={property}
                              style={{
                                data: { stroke: primaryColor, strokeWidth: 2 },
                              }}
                              interpolation="monotoneX"
                            />
                            <VictoryScatter
                              data={data}
                              x="timestamp"
                              y={property}
                              size={4}
                              style={{
                                data: {
                                  fill: accentColor,
                                  stroke: "#fff",
                                  strokeWidth: 2,
                                }
                              }}
                              events={[{
                                target: "data",
                                eventHandlers: {
                                  onPressIn: (evt, clickedProps) => {
                                    setSelectedPoint(clickedProps.datum);
                                    return [];
                                  }
                                }
                              }]}
                            />
                          </VictoryChart>
                        </Svg>
                        {isDataIncomplete() && (
                          <Text style={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                            fontSize: 13,
                            marginTop: 4,
                            textAlign: "center",
                          }}>
                            {summaryLabels.incomplete}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text style={{ textAlign: "center", color: "#888", fontSize: 20 }}>
                        {summaryLabels.noData}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </ScrollView>
          </View>
        ) : (
          <ScrollView
            horizontal
            style={{
              width: "100%",
              marginBottom: 8,
            }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              minWidth: "100%",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setExpanded((prev) => !prev)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                width: graphWidth,
              }}
            >
              <View style={{
                width: graphWidth,
                height: graphHeight,
                backgroundColor: secondaryColor,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
                padding: 8,
                borderWidth: 0,
                borderColor: "transparent",
                alignSelf: "center",
              }}>
                {loading ? (
                  <Text style={{ color: primaryColor }}>{summaryLabels.loading}</Text>
                ) : data.length > 0 ? (
                  <>
                    <Svg width={graphWidth} height={graphHeight}>
                      <VictoryChart
                        width={graphWidth}
                        height={graphHeight}
                        theme={VictoryTheme.material}
                        domainPadding={30}
                        standalone={false}
                        padding={{ top: 30, bottom: 70, left: 60, right: 30 }}
                        scale={{ x: "time" }}
                      >
                        <VictoryAxis
                          tickFormat={getTickFormat}
                          style={{
                            axis: { stroke: primaryColor },
                            tickLabels: { fontSize: 10, angle: 0, padding: 10, fill: primaryColor },
                            grid: { stroke: "#b2dfdb" },
                          }}
                          fixLabelOverlap
                        />
                        <VictoryAxis
                          dependentAxis
                          style={{
                            axis: { stroke: primaryColor },
                            tickLabels: { fontSize: 12, fill: primaryColor },
                            grid: { stroke: "#b2dfdb" },
                          }}
                        />
                        <VictoryLine
                          data={data}
                          x="timestamp"
                          y={property}
                          style={{
                            data: { stroke: primaryColor, strokeWidth: 2 },
                          }}
                          interpolation="monotoneX"
                        />
                        <VictoryScatter
                          data={data}
                          x="timestamp"
                          y={property}
                          size={4}
                          style={{
                            data: {
                              fill: accentColor,
                              stroke: "#fff",
                              strokeWidth: 2,
                            }
                          }}
                          events={[{
                            target: "data",
                            eventHandlers: {
                              onPressIn: (evt, clickedProps) => {
                                setSelectedPoint(clickedProps.datum);
                                return [];
                              }
                            }
                          }]}
                        />
                      </VictoryChart>
                    </Svg>
                    {isDataIncomplete() && (
                      <Text style={{
                        color: "#d32f2f",
                        fontWeight: "bold",
                        fontSize: 13,
                        marginTop: 4,
                        textAlign: "center",
                      }}>
                        {summaryLabels.incomplete}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text style={{ textAlign: "center", color: "#888", fontSize: 14 }}>
                    {summaryLabels.noData}
                  </Text>
                )}
                <Text style={{
                  color: primaryColor,
                  fontSize: 12,
                  marginTop: 4,
                  fontWeight: "bold",
                  opacity: 0.7,
                }}>
                  {summaryLabels.tapGraph}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
        {selectedPoint && (
          <View style={{
            position: "absolute",
            top: expanded ? 60 : 120,
            left: 20,
            right: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: primaryColor,
            padding: 12,
            zIndex: 20,
            elevation: 5,
          }}>
            <Text style={{ color: primaryColor, fontWeight: "bold" }}>
              {title} {summaryLabels.at} {formatTimestamp(selectedPoint.timestamp)}
            </Text>
            <Text style={{ color: "#222", fontSize: 16, marginTop: 4 }}>
              {summaryLabels.value}: {Number(selectedPoint[property]).toFixed(2)} {unit}
            </Text>
            <TouchableOpacity onPress={() => setSelectedPoint(null)} style={{ marginTop: 8, alignSelf: "flex-end" }}>
              <Text style={{ color: accentColor, fontWeight: "bold" }}>x</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={{
            marginTop: 10,
            backgroundColor: showSummary ? "#e0e7ff" : primaryColor,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 24,
            alignSelf: "center",
          }}
          onPress={() => setShowSummary(true)}
        >
          <Text style={{ color: showSummary ? primaryColor : "#fff", fontWeight: "bold", fontSize: 16 }}>
            {summaryLabels.dataSummary}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={showPeriodModal}
          animationType="fade"
          transparent
          onRequestClose={() => {
            setShowPeriodModal(false);
            setCompareInput("");
            setAllParamsCompareStats(null);
          }}
        >
          <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.18)",
          }}>
            <View style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 18,
              minWidth: 260,
              maxWidth: 320,
              margin: 8,
              elevation: 8,
              alignItems: "center",
            }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: primaryColor, marginBottom: 8 }}>
                {summaryLabels.period}: {periodInput}
              </Text>
              {allParamsStats === null ? (
                <Text style={{ color: "#d32f2f", fontWeight: "bold" }}>{summaryLabels.noStats}</Text>
              ) : (
                <ScrollView style={{ maxHeight: 260, width: "100%" }}>
                  {PARAMS.map(param => (
                    <View key={param.key} style={{ marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold", color: "#333" }}>{param.label}</Text>
                      {allParamsStats[param.key] ? (
                        <Text style={{ color: "#00796b" }}>
                          {summaryLabels.average}: {allParamsStats[param.key].avg} {param.unit}{"\n"}
                          {summaryLabels.min}: {allParamsStats[param.key].min} {param.unit}{"\n"}
                          {summaryLabels.max}: {allParamsStats[param.key].max} {param.unit}
                        </Text>
                      ) : (
                        <Text style={{ color: "#888" }}>{summaryLabels.noStats}</Text>
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: accentColor,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    backgroundColor: "#fff",
                    width: 110,
                    marginRight: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onPress={() => {
                    if (periodType === "day") setShowComparePicker(true);
                    else if (periodType === "week") setShowCompareWeekPicker(true);
                    else if (periodType === "month") setShowCompareMonthPicker(true);
                    else if (periodType === "year") setShowCompareYearPicker(true);
                  }}
                >
                  <Text style={{ fontSize: 15, color: "#333" }}>
                    {compareInput ||
                      (periodType === "day"
                        ? summaryLabels.enterDate
                        : periodType === "week"
                        ? summaryLabels.enterWeek
                        : periodType === "month"
                        ? summaryLabels.enterMonth
                        : summaryLabels.enterYear)}
                  </Text>
                  <Ionicons name="calendar" size={18} color={accentColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: accentColor,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                  }}
                  onPress={async () => {
                    if (!compareInput) {
                      Alert.alert(summaryLabels.invalidDate);
                      return;
                    }
                    setShowCompareModal(true);
                    setAllParamsCompareStats(null);
                    await fetchStatsForPeriod(periodType, compareInput, setAllParamsCompareStats);
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>{summaryLabels.compare}</Text>
                </TouchableOpacity>
              </View>
              {showComparePicker && (
                <DateTimePicker
                  value={compareInput ? new Date(compareInput) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleCompareDateChange}
                />
              )}
              {showCompareWeekPicker && (
                <DateTimePicker
                  value={compareInput ? new Date(compareInput) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleCompareWeekChange}
                />
              )}
              {showCompareMonthPicker && (
                <DateTimePicker
                  value={compareInput ? new Date(compareInput + "-01") : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleCompareMonthChange}
                />
              )}
              {showCompareYearPicker && (
                <DateTimePicker
                  value={compareInput ? new Date(compareInput + "-01-01") : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleCompareYearChange}
                />
              )}
              <TouchableOpacity
                style={{
                  marginTop: 16,
                  backgroundColor: "#e0e7ff",
                  borderRadius: 8,
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                }}
                onPress={() => {
                  setShowPeriodModal(false);
                  setCompareInput("");
                  setAllParamsCompareStats(null);
                }}
              >
                <Text style={{ color: primaryColor, fontWeight: "bold" }}>{summaryLabels.close}</Text>
              </TouchableOpacity>
            </View>
            {showCompareModal && (
              <View style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 18,
                minWidth: 260,
                maxWidth: 320,
                margin: 8,
                elevation: 8,
                alignItems: "center",
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 18, color: accentColor, marginBottom: 8 }}>
                  {summaryLabels.period}: {compareInput}
                </Text>
                {allParamsCompareStats === null ? (
                  <Text style={{ color: "#d32f2f", fontWeight: "bold" }}>{summaryLabels.noStats}</Text>
                ) : (
                  <ScrollView style={{ maxHeight: 260, width: "100%" }}>
                    {PARAMS.map(param => (
                      <View key={param.key} style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: "bold", color: "#333" }}>{param.label}</Text>
                        {allParamsCompareStats[param.key] ? (
                          <Text style={{ color: accentColor }}>
                            {summaryLabels.average}: {allParamsCompareStats[param.key].avg} {param.unit}{"\n"}
                            {summaryLabels.min}: {allParamsCompareStats[param.key].min} {param.unit}{"\n"}
                            {summaryLabels.max}: {allParamsCompareStats[param.key].max} {param.unit}
                          </Text>
                        ) : (
                          <Text style={{ color: "#888" }}>{summaryLabels.noStats}</Text>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                )}
                <TouchableOpacity
                  style={{
                    marginTop: 16,
                    backgroundColor: "#e0e7ff",
                    borderRadius: 8,
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                  }}
                  onPress={() => {
                    setShowCompareModal(false);
                    setCompareInput("");
                    setAllParamsCompareStats(null);
                  }}
                >
                  <Text style={{ color: accentColor, fontWeight: "bold" }}>{summaryLabels.close}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
        <Modal
          visible={showSummary}
          animationType="fade"
          transparent
          onRequestClose={() => setShowSummary(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: "#fff" }]}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowSummary(false)}
              >
                <Ionicons name="close" size={28} color={primaryColor} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: primaryColor }]}>{summaryLabels.dataSummary}</Text>
              <View style={styles.statRow}>
                <View style={[styles.statCard, { backgroundColor: "#f7f8fc" }]}>
                  <MaterialCommunityIcons name="star-circle" size={28} color={primaryColor} />
                  <Text style={[styles.statLabel, { color: primaryColor }]}>{summaryLabels.latest}</Text>
                  <Text style={styles.statValue}>{summary.latest} {unit}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#f7f8fc" }]}>
                  <MaterialCommunityIcons name="chart-bar" size={28} color={primaryColor} />
                  <Text style={[styles.statLabel, { color: primaryColor }]}>{summaryLabels.average}</Text>
                  <Text style={styles.statValue}>{summary.avg} {unit}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#f7f8fc" }]}>
                  <MaterialCommunityIcons name="chart-bell-curve" size={28} color={primaryColor} />
                  <Text style={[styles.statLabel, { color: primaryColor }]}>{summaryLabels.median}</Text>
                  <Text style={styles.statValue}>{summary.median} {unit}</Text>
                </View>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.statCard, { backgroundColor: "#f7f8fc" }]}>
                  <MaterialCommunityIcons name="arrow-down-bold-circle" size={28} color={primaryColor} />
                  <Text style={[styles.statLabel, { color: primaryColor }]}>{summaryLabels.min}</Text>
                  <Text style={styles.statValue}>{summary.min} {unit}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#f7f8fc" }]}>
                  <MaterialCommunityIcons name="arrow-up-bold-circle" size={28} color={primaryColor} />
                  <Text style={[styles.statLabel, { color: primaryColor }]}>{summaryLabels.max}</Text>
                  <Text style={styles.statValue}>{summary.max} {unit}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#f7f8fc" }]}>
                  <MaterialCommunityIcons name="counter" size={28} color={primaryColor} />
                  <Text style={[styles.statLabel, { color: primaryColor }]}>{summaryLabels.count}</Text>
                  <Text style={styles.statValue}>{summary.count}</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {expanded && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: primaryColor,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              zIndex: 10,
            }}
            onPress={() => setExpanded(false)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 22 }}>x</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


