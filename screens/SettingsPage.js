import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

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
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    maxWidth: 400,
    width: "97%",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
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
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#009688",
    marginBottom: 4,
    textAlign: "center"
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 2,
  },
});

export default function SettingsPage({ navigation, language, setLanguage, settings, setSettings }) {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [applyPressed, setApplyPressed] = useState(false);
  const [importExportMsg, setImportExportMsg] = useState("");
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  const buttonText1 = language === "English" ? "English" : "Ingles";
  const buttonText2 = language === "English" ? "Tagalog" : "Tagalog";
  const notificationsLabel = language === "English" ? "Notifications" : "Abiso";
  const notificationsOn = language === "English" ? "On" : "Bukas";
  const notificationsOff = language === "English" ? "Off" : "Sarado";
  const exportLabel = language === "English" ? "Export Data" : "I-export ang Datos";
  const importLabel = language === "English" ? "Import Data" : "I-import ang Datos";
  const resetLabel = language === "English" ? "Reset to Defaults" : "I-reset sa Default";
  const applyLabel = language === "English" ? "Apply" : "Ilapat";

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

  const handleExport = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/api/export`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);

      if (Platform.OS === "web") {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.json";
        a.click();
        URL.revokeObjectURL(url);
        setImportExportMsg("Export successful!");
      } else {
        const fileUri = FileSystem.documentDirectory + "export.json";
        await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
        await Share.share({
          url: fileUri,
          message: "AquaGUARD Export Data",
          title: "export.json",
        });
        setImportExportMsg("Export successful! File saved and ready to share.");
      }
    } catch (err) {
      setImportExportMsg("Export failed.");
    }
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

  const handleReset = () => {
    setSelectedLanguage("English");
    setNotificationsEnabled(true);
    setSettings((prevSettings) => ({
      ...prevSettings,
      notificationsEnabled: true,
      apiEndpoint: "http://192.168.18.5:3000",
    }));
    setImportExportMsg(language === "English" ? "Settings reset to default." : "Nareset sa default ang mga setting.");
  };

  const handleApply = () => {
    setLanguage(selectedLanguage);
    if (settings.notificationsEnabled !== notificationsEnabled) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        notificationsEnabled: notificationsEnabled,
      }));
    }
    navigation.goBack();
  };

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

        {/* Language & Notifications Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>{language === "English" ? "General Settings" : "Pangkalahatang Setting"}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around", gap: 12 }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", color: "#009688", fontSize: 15, marginBottom: 4, textAlign: "center" }}>
                {language === "English" ? "Language" : "Wika"}
              </Text>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { flex: 1, backgroundColor: selectedLanguage === "English" ? "#009688" : "#fff", borderColor: "#009688", borderWidth: 2, paddingVertical: 7, minWidth: 70 },
                  ]}
                  onPress={() => setSelectedLanguage("English")}
                >
                  <Text style={{ color: selectedLanguage === "English" ? "#fff" : "#009688", fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{buttonText1}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { flex: 1, backgroundColor: selectedLanguage === "Tagalog" ? "#009688" : "#fff", borderColor: "#009688", borderWidth: 2, paddingVertical: 7, minWidth: 70 },
                  ]}
                  onPress={() => setSelectedLanguage("Tagalog")}
                >
                  <Text style={{ color: selectedLanguage === "Tagalog" ? "#fff" : "#009688", fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{buttonText2}</Text>
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
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{notificationsEnabled ? notificationsOn : notificationsOff}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>{language === "English" ? "Data Management" : "Pamamahala ng Datos"}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <TouchableOpacity style={[styles.actionButton, { borderColor: "#009688", backgroundColor: "#fff" }]} onPress={handleExport}>
              <Text style={{ color: "#009688", fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{exportLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { borderColor: "#009688", backgroundColor: "#fff" }]} onPress={handleImport}>
              <Text style={{ color: "#009688", fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{importLabel}</Text>
            </TouchableOpacity>
          </View>
          {importExportMsg ? (
            <Text style={{ color: "#009688", fontSize: 12, marginTop: 8, textAlign: "center" }}>{importExportMsg}</Text>
          ) : null}
        </View>

        {/* Action Buttons Section */}
        <View>
          <Text style={styles.sectionTitle}>{language === "English" ? "App Actions" : "Mga Aksyon sa App"}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <TouchableOpacity style={[styles.actionButton, { borderColor: "#d32f2f", backgroundColor: "#fff" }]} onPress={handleReset}>
              <Text style={{ color: "#d32f2f", fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{resetLabel}</Text>
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
              <Text style={{ color: applyPressed ? "#fff" : "#009688", fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{applyLabel}</Text>
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
    </View>
  );
}