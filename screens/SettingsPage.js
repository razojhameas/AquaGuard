import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Share,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// These imports are for standalone apps. For Expo Go, we use a web-compatible fallback.
let FileSystem;
let DocumentPicker;
if (Platform.OS === "web") {
  FileSystem = {
    documentDirectory: "/",
    writeAsStringAsync: async (uri, content, options) => {
      console.warn("FileSystem.writeAsStringAsync is mocked for web. Data not saved to local file system directly.");
      return Promise.resolve();
    },
    readAsStringAsync: async (uri, options) => {
      console.warn("FileSystem.readAsStringAsync is mocked for web. Data not read from local file system directly.");
      return Promise.resolve("");
    },
  };
  DocumentPicker = {
    getDocumentAsync: async () => {
      alert("Import not supported on web in this demo.");
      return { type: "cancel" };
    },
  };
} else {
  FileSystem = require("expo-file-system");
  DocumentPicker = require("expo-document-picker");
}

const { width, height } = Dimensions.get("window");
const PREVIEW_LIMIT = 3000; // Limit the preview to 3000 characters

const styles = StyleSheet.create({
  emptyPage: {
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
    padding: 16,
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    maxWidth: 400,
    width: "97%",
  },
  infoButton: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "rgba(0,150,136,0.12)",
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    width: "92%",
    maxWidth: 420,
    maxHeight: "85%",
  },
  infoSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f7fa",
  },
  infoSectionTitle: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#00796b",
    flex: 1,
    letterSpacing: 0.5,
  },
  infoSectionContent: {
    fontSize: 15,
    color: "#333",
    marginTop: 2,
    paddingLeft: 6,
    paddingBottom: 10,
    lineHeight: 22,
  },
  infoModalTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#009688",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#009688",
    marginBottom: 12,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  settingLabel: {
    fontWeight: "bold",
    color: "#00796b",
    fontSize: 15,
    flex: 1,
    textAlign: "left",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  messageText: {
    color: "#00796b",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  exportModalContent: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#009688',
  },
  fileNameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  viewFileModalContent: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '80%',
  },
  fileContentText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#333',
  },
});

export default function SettingsPage({ language, setLanguage, settings, setSettings }) {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [applyPressed, setApplyPressed] = useState(false);
  const [importExportMsg, setImportExportMsg] = useState("");
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportFileName, setExportFileName] = useState("AquaGUARD_Data");
  const [activeSection, setActiveSection] = useState("about");
  const [exportedData, setExportedData] = useState(null);
  const [viewFileModalVisible, setViewFileModalVisible] = useState(false);

  const buttonText1 = language === "English" ? "English" : "Ingles";
  const buttonText2 = language === "English" ? "Tagalog" : "Tagalog";
  const notificationsLabel = language === "English" ? "Notifications" : "Abiso";
  const notificationsOn = language === "English" ? "On" : "Bukas";
  const notificationsOff = language === "English" ? "Off" : "Sarado";
  const exportLabel = language === "English" ? "Export Data" : "Export ang Datos";
  const importLabel = language === "English" ? "Import Data" : "Import ang Datos";
  const resetLabel = language === "English" ? "Reset" : "I-reset";
  const applyLabel = language === "English" ? "Apply" : "Ipatupad";

  const instructions =
    language === "English"
      ? [
          {
            title: "Water Quality",
            desc: [
              "• View real-time readings for temperature, pH, TDS, ammonia, and turbidity.",
              "• The Dissolved Oxygen Stress Index (DO-SI) replaces direct DO sensor readings.",
              "• Each parameter (and DO-SI) is color-coded (Good, Moderate, Poor, Bad) using fuzzy logic.",
              "• Select the species (Tilapia, Milkfish, Catfish, Shrimp, or Custom) to adjust temperature classification.",
              "• Tap any parameter to see detailed trends, graphs, and statistics (average, min, max, median, count) for different time ranges (day, week, month, year).",
              "• Use the legend to understand color meanings. Alerts appear if any parameter or the DO-SI is critical.",
            ].join("\n"),
          },
          {
            title: "Feeding",
            desc: [
              "• View and set the number of screw feeder rotations to control feed amount.",
              "• Select feed type and distribution mode using dropdowns.",
              "• See the remaining feed in real time from the weight sensor.",
              "• Toggle the feeding system ON/OFF.",
              "• Tap 'Show Statistics' to view total feed dispensed, total feedings, average feed per feeding, and last feeding time.",
            ].join("\n"),
          },
          {
            title: "Algae Control",
            desc: [
              "• Set the interval (in minutes) for the ultrasound algae control system.",
              "• Apply a custom interval or reset to default.",
              "• Toggle the transducer ON/OFF.",
              "• Tap 'Show Statistics' to view total activations, total minutes active, average interval, and last activation time.",
            ].join("\n"),
          },
          {
            title: "Settings",
            desc: [
              "• Change the app language at any time.",
              "• Enable or disable notifications for critical water quality alerts.",
              "• Export all app data to a file for backup or research.",
              "• Import data (if supported).",
              "• Reset all settings to default values.",
              "• Tap 'Apply' to save changes.",
            ].join("\n"),
          },
          {
            title: "General",
            desc: [
              "• Use the navigation buttons to switch between features.",
              "• All data is updated live from the server.",
              "• Alerts and notifications help you respond quickly to critical events.",
              "• The app is bilingual and can be used in English or Tagalog.",
            ].join("\n"),
          },
        ]
      : [
          {
            title: "Kalidad ng Tubig",
            desc: [
              "• Tingnan ang real-time na readings ng temperatura, pH, TDS, amonya, at kakuliman.",
              "• Ang Dissolved Oxygen Stress Index (DO-SI) ang papalit sa diretsong pagbasa ng DO sensor.",
              "• Bawat parameter (at DO-SI) ay may kulay (Maganda, Katamtaman, Mahina, Masama) gamit ang fuzzy logic.",
              "• Pumili ng isda (Tilapya, Bangus, Hito, Hipon, o Ibang Isda) para sa tamang pag-uuri ng temperatura.",
              "• I-tap ang parameter para makita ang detalye ng trend, graph, at estadistika (average, min, max, gitna, bilang) para sa araw, linggo, buwan, o taon.",
              "• Gamitin ang legend para maintindihan ang mga kulay. Magpapakita ng alerto kung may kritikal na parameter o ang DO-SI.",
            ].join("\n"),
          },
          {
            title: "Pagpapakain",
            desc: [
              "• Tingnan at itakda ang ikot ng screw feeder para kontrolin ang dami ng pakain.",
              "• Pumili ng uri ng pakain at paraan ng pamamahagi gamit ang dropdown.",
              "• Makikita ang natitirang pakain mula sa weight sensor.",
              "• I-toggle ang pagpapakain ON/OFF.",
              "• I-tap ang 'Ipakita ang Estadistika' para makita ang kabuuang pakain, kabuuang pagpapakain, average kada pagpapakain, at huling oras ng pagpapakain.",
            ].join("\n"),
          },
          {
            title: "Kontrol ng Algae",
            desc: [
              "• Itakda ang interval (sa minuto) ng ultrasound algae control system.",
              "• Ilapat ang custom interval o i-reset sa default.",
              "• I-toggle ang transducer ON/OFF.",
              "• I-tap ang 'Ipakita ang Estadistika' para makita ang kabuuang activation, kabuuang minuto, average interval, at huling activation.",
            ].join("\n"),
          },
          {
            title: "Mga Setting",
            desc: [
              "• Palitan ang wika ng app anumang oras.",
              "• I-on o i-off ang notifications para sa kritikal na alerto ng kalidad ng tubig.",
              "• I-export ang lahat ng datos ng app para sa backup o research.",
              "• Mag-import ng datos (kung suportado).",
              "• I-reset ang lahat ng setting sa default.",
              "• I-tap ang 'Ilapat' para i-save ang mga pagbabago.",
            ].join("\n"),
          },
          {
            title: "Pangkalahatan",
            desc: [
              "• Gamitin ang mga button para lumipat ng feature.",
              "• Lahat ng datos ay live na galing sa server.",
              "• Ang mga alerto at notification ay tutulong para mabilis kang makaresponde sa mga kritikal na pangyayari.",
              "• Ang app ay bilingual at maaaring gamitin sa Ingles o Tagalog.",
            ].join("\n"),
          },
        ];

  const infoSections = [
    {
      key: "about",
      title: language === "English" ? "About AquaGUARD" : "Tungkol sa AquaGUARD",
      content:
        language === "English"
          ? "AquaGUARD is a smart aquaculture monitoring and automation app for fishponds and tanks. It provides real-time water quality readings, automated feeding, and algae control. The system is designed for Filipino aquaculture, supporting Tilapia, Milkfish, Catfish, Shrimp, and custom species. Data is updated live from the server and can be exported for research or backup."
          : "Ang AquaGUARD ay isang matalinong app para sa pagmamanman at awtomatikong kontrol ng akwaculture. Nagbibigay ito ng real-time na datos ng kalidad ng tubig, awtomatikong pagpapakain, at kontrol ng algae. Dinisenyo para sa mga Pilipinong fishpond at tangke, at sumusuporta sa Tilapya, Bangus, Hito, Hipon, at iba pang species. Ang datos ay live na galing sa server at maaaring i-export para sa research o backup.",
    },
    {
      key: "howto",
      title: language === "English" ? "How To Use" : "Paano Gamitin",
      content: instructions
        .map((item) => `• ${item.title}\n${item.desc}\n`)
        .join("\n\n"),
    },
    {
      key: "limitations",
      title: language === "English" ? "Limitations" : "Mga Limitasyon",
      content:
        language === "English"
          ? [
              "• Not supported on iOS (Android only).",
              "• Requires stable WiFi and server connection.",
              "• Data export/import is limited to CSV format.",
              "• No direct dissolved oxygen sensor; uses DO-SI index.",
              "• App notifications require Android 8.0+.",
              "• Only supports one pond/tank per device (multi-pond coming soon).",
            ].join("\n")
          : [
              "• Hindi suportado sa iOS (Android lang).",
              "• Kailangan ng matatag na WiFi at koneksyon sa server.",
              "• Ang export/import ng datos ay limitado sa CSV format.",
              "• Walang direktang DO sensor; DO-SI index ang gamit.",
              "• Ang notifications ay para lang sa Android 8.0 pataas.",
              "• Isa lang ang pond/tank kada device (multi-pond sa susunod).",
            ].join("\n"),
    },
    {
      key: "faq",
      title: "FAQ",
      content:
        language === "English"
          ? [
              "Q: Is my data private?\nA: Yes, all data is stored securely on your server.",
              "Q: Can I use this for shrimp?\nA: Yes, select 'Shrimp' in species settings.",
              "Q: Can I use this on iPhone?\nA: Not yet. Android only.",
              "Q: How do I export data?\nA: Go to Settings > Export Data.",
              "Q: What is DO-SI?\nA: Dissolved Oxygen Stress Index, a calculated value replacing direct DO sensor readings.",
            ].join("\n\n")
          : [
              "Q: Ligtas ba ang datos ko?\nA: Oo, naka-secure ang lahat ng datos sa server.",
              "Q: Pwede ba ito sa hipon?\nA: Oo, piliin ang 'Hipon' sa settings.",
              "Q: Pwede ba ito sa iPhone?\nA: Hindi pa. Android lang.",
              "Q: Paano mag-export ng datos?\nA: Pumunta sa Settings > Export Data.",
              "Q: Ano ang DO-SI?\nA: Dissolved Oxygen Stress Index, isang kalkuladong value na kapalit ng direktang DO sensor.",
            ].join("\n\n"),
    },
  ];

  const handleNotificationsToggle = () => setNotificationsEnabled((prev) => !prev);
  const apiEndpoint = settings.apiEndpoint || "http://192.168.18.5:3000";

  const executeExport = async () => {
    setExportModalVisible(false);
    try {
      setImportExportMsg(language === "English" ? "Fetching data from server..." : "Kinukuha ang datos mula sa server...");
      const response = await fetch(`${apiEndpoint}/api/export`);

      if (!response.ok) {
        const errorText = await response.text();
        Alert.alert(
          "Export Error",
          `Could not connect to the server or data is unavailable. Please check your Wi-Fi and server status.\n\nError: ${errorText}`
        );
        setImportExportMsg(language === "English" ? "Export failed." : "Hindi nagtagumpay ang export.");
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);
      
      const previewText = jsonString.length > PREVIEW_LIMIT
        ? jsonString.substring(0, PREVIEW_LIMIT) + `\n\n... (${language === "English" ? "File is too long to display, showing first 3000 characters" : "Masyadong mahaba ang file, ipinapakita ang unang 3000 na karakter"})`
        : jsonString;

      setExportedData(previewText);
      setViewFileModalVisible(true);
      setImportExportMsg(language === "English" ? "Export successful! Previewing data." : "Matagumpay ang export! Ipinapakita ang preview ng datos.");

      // This part is for standalone apps, disabled for Expo Go demo
      if (Platform.OS !== "web") {
         // const fileName = `${exportFileName}.json`;
         // const fileUri = FileSystem.documentDirectory + fileName;
         // await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
         // await Share.share({
         //   url: fileUri,
         //   message: "AquaGUARD Export Data",
         //   title: fileName,
         // });
      } else {
        // Web download behavior
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${exportFileName}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setImportExportMsg(language === "English" ? "Export failed." : "Hindi nagtagumpay ang export.");
      console.error("Export error:", err);
    }
  };

  const handleExport = () => {
    setExportModalVisible(true);
  };

  const postImportedData = async (url, data) => {
    const response = await fetch(`${apiEndpoint}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Failed to import data");
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/json" });
      if (result.type === "cancel") {
        setImportExportMsg(language === "English" ? "Import cancelled." : "Kinansela ang import.");
        return;
      }
      let fileContent = "";
      if (Platform.OS === "web") {
        setImportExportMsg(language === "English" ? "Import not supported on web." : "Hindi suportado ang import sa web.");
        return;
      } else {
        fileContent = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.UTF8 });
      }
      let importedData;
      try {
        importedData = JSON.parse(fileContent);
      } catch (err) {
        setImportExportMsg(language === "English" ? "Invalid file format." : "Di wastong format ng file.");
        return;
      }

      if (importedData.feeding_settings_logs && importedData.feeding_settings_logs.length > 0) {
        const recentSettings = importedData.feeding_settings_logs[importedData.feeding_settings_logs.length - 1];
        await postImportedData("/api/import/feeding-settings", recentSettings);
      }

      if (importedData.feeding_stats_logs && importedData.feeding_stats_logs.length > 0) {
        const recentStats = importedData.feeding_stats_logs[importedData.feeding_stats_logs.length - 1];
        await postImportedData("/api/import/feeding-stats", recentStats);
      }

      if (importedData.feeding_settings_logs && importedData.feeding_settings_logs.length > 0) {
        const schedules = importedData.feeding_settings_logs[importedData.feeding_settings_logs.length - 1].scheduleTimes;
        if (schedules) {
          await postImportedData("/api/import/feeding-schedules", { scheduleTimes: schedules });
        }
      }

      if (importedData.water_quality_data && importedData.water_quality_data.length > 0) {
        await postImportedData("/api/import/water-quality", { entries: importedData.water_quality_data });
      }

      if (importedData.weight_logs && importedData.weight_logs.length > 0) {
        await postImportedData("/api/import/weight", { entries: importedData.weight_logs });
      }

      setImportExportMsg(language === "English" ? "Import successful! Data synchronized with server." : "Import matagumpay! Nasabay sa server ang datos.");
    } catch (err) {
      setImportExportMsg(language === "English" ? "Import failed" : "Hindi nagtagumpay ang import");
    }
  };

  const handleReset = async () => {
    setSelectedLanguage("English");
    setNotificationsEnabled(true);
    setSettings((prevSettings) => ({
      ...prevSettings,
      notificationsEnabled: true,
      apiEndpoint: "http://192.168.18.5:3000",
    }));

    const defaultSettings = {
      language: "English",
      notificationsEnabled: true,
      apiEndpoint: "http://192.168.18.5:3000",
    };
    try {
      await AsyncStorage.setItem("@settings", JSON.stringify(defaultSettings));
      setImportExportMsg(language === "English" ? "Settings reset to default." : "Nareset sa default ang mga setting.");
    } catch (e) {
      setImportExportMsg(language === "English" ? "Failed to reset settings." : "Hindi nagtagumpay ang pag-reset.");
    }
  };

  const handleApply = async () => {
    setLanguage(selectedLanguage);
    const newSettings = {
      ...settings,
      language: selectedLanguage,
      notificationsEnabled: notificationsEnabled,
    };

    try {
      await AsyncStorage.setItem("@settings", JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (e) {
      console.error("Failed to save settings to AsyncStorage", e);
    }
    navigation.goBack();
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem("@settings");
        if (storedSettings !== null) {
          const parsedSettings = JSON.parse(storedSettings);
          setLanguage(parsedSettings.language);
          setSettings(parsedSettings);
          setSelectedLanguage(parsedSettings.language);
          setNotificationsEnabled(parsedSettings.notificationsEnabled);
        }
      } catch (e) {
        console.error("Failed to load settings from AsyncStorage", e);
      }
    };

    loadSettings();
  }, [setLanguage, setSettings]);

  return (
    <View style={styles.emptyPage}>
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />

      <View style={styles.glassCard}>
        <TouchableOpacity style={styles.infoButton} onPress={() => setInfoModalVisible(true)}>
          <Ionicons name="information-circle-outline" size={30} color="#00796b" />
        </TouchableOpacity>
        
        <Image
          source={require("../assets/setting.png")}
          style={{
            marginBottom: 20,
            width: 70,
            height: 70,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />

        {/* General Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{language === "English" ? "General Settings" : "Pangkalahatang Setting"}</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{language === "English" ? "Language" : "Wika"}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: selectedLanguage === "English" ? "#009688" : "#fff", borderColor: "#009688", borderWidth: 2 },
                ]}
                onPress={() => setSelectedLanguage("English")}
              >
                <Text style={{ color: selectedLanguage === "English" ? "#fff" : "#009688", fontWeight: "bold", fontSize: 14 }}>{buttonText1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: selectedLanguage === "Tagalog" ? "#009688" : "#fff", borderColor: "#009688", borderWidth: 2 },
                ]}
                onPress={() => setSelectedLanguage("Tagalog")}
              >
                <Text style={{ color: selectedLanguage === "Tagalog" ? "#fff" : "#009688", fontWeight: "bold", fontSize: 14 }}>{buttonText2}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{notificationsLabel}</Text>
            <TouchableOpacity
              style={{
                backgroundColor: notificationsEnabled ? "#4CAF50" : "#B22222",
                borderRadius: 16,
                paddingVertical: 7,
                paddingHorizontal: 12,
              }}
              onPress={handleNotificationsToggle}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>{notificationsEnabled ? notificationsOn : notificationsOff}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{language === "English" ? "Data Management" : "Pamamahala ng Datos"}</Text>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={[styles.actionButton, { borderColor: "#009688", backgroundColor: "#fff" }]} onPress={handleExport}>
              <Text style={{ color: "#009688", fontWeight: "bold", fontSize: 14 }}>{exportLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { borderColor: "#009688", backgroundColor: "#fff" }]} onPress={handleImport}>
              <Text style={{ color: "#009688", fontWeight: "bold", fontSize: 14 }}>{importLabel}</Text>
            </TouchableOpacity>
          </View>
          {importExportMsg ? <Text style={styles.messageText}>{importExportMsg}</Text> : null}
        </View>

        {/* App Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{language === "English" ? "App Actions" : "Mga Aksyon sa App"}</Text>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={[styles.actionButton, { borderColor: "#d32f2f", backgroundColor: "#fff" }]} onPress={handleReset}>
              <Text style={{ color: "#d32f2f", fontWeight: "bold", fontSize: 14 }}>{resetLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: applyPressed ? "#009688" : "#fff",
                  borderColor: "#009688",
                },
              ]}
              onPressIn={() => setApplyPressed(true)}
              onPressOut={() => setApplyPressed(false)}
              onPress={handleApply}
            >
              <Text style={{ color: applyPressed ? "#fff" : "#009688", fontWeight: "bold", fontSize: 14 }}>{applyLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Info Modal */}
      <Modal visible={infoModalVisible} animationType="slide" transparent onRequestClose={() => setInfoModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.infoModalTitle}>{language === "English" ? "AquaGUARD Info & Help" : "Impormasyon at Gabay"}</Text>
            <ScrollView style={{ maxHeight: height * 0.65 }}>
              {infoSections.map((section) => (
                <View key={section.key}>
                  <TouchableOpacity style={styles.infoSectionHeader} onPress={() => setActiveSection(activeSection === section.key ? null : section.key)}>
                    <Text style={styles.infoSectionTitle}>{section.title}</Text>
                    <AntDesign name={activeSection === section.key ? "up" : "down"} size={20} color="#00796b" />
                  </TouchableOpacity>
                  {activeSection === section.key && (
                    <View style={{ backgroundColor: "#f7f7f7", borderRadius: 8, marginBottom: 10 }}>
                      {section.key === "howto" ? (
                        instructions.map((item) => (
                          <View key={item.title} style={{ marginBottom: 10, paddingHorizontal: 12, paddingTop: 6 }}>
                            <Text style={{ fontWeight: "bold", color: "#009688", fontSize: 16, marginBottom: 2 }}>{item.title}</Text>
                            <Text style={{ color: "#333", fontSize: 15, lineHeight: 22, whiteSpace: "pre-line" }}>{item.desc}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.infoSectionContent}>{section.content}</Text>
                      )}
                    </View>
                  )}
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
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{language === "English" ? "Close" : "Isara"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Export Name Modal */}
      <Modal visible={exportModalVisible} animationType="fade" transparent onRequestClose={() => setExportModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setExportModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.exportModalContent}>
                <Text style={styles.exportTitle}>{language === "English" ? "Name Your Export File" : "Pangalanan ang File"}</Text>
                <TextInput
                  style={styles.fileNameInput}
                  onChangeText={setExportFileName}
                  value={exportFileName}
                  placeholder={language === "English" ? "Enter file name" : "Ilagay ang pangalan"}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#d32f2f' }]}
                    onPress={() => setExportModalVisible(false)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{language === "English" ? "Cancel" : "Kanselahin"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#009688' }]}
                    onPress={executeExport}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{language === "English" ? "Export" : "I-export"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* View Exported Data Modal */}
      <Modal visible={viewFileModalVisible} animationType="fade" transparent onRequestClose={() => setViewFileModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.viewFileModalContent}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#00796b' }}>
              {language === "English" ? "Exported Data Preview" : "Preview ng Na-Export na Datos"}
            </Text>
            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.fileContentText}>
                {exportedData}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 15,
                backgroundColor: "#009688",
                borderRadius: 12,
                paddingVertical: 10,
                alignItems: 'center',
              }}
              onPress={() => setViewFileModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{language === "English" ? "Close" : "Isara"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}