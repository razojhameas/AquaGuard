// SettingsPage.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles"; // Adjust this path according to your project structure

const SettingsPage = ({ navigation }) => {
  const language = "English"; // Set your language logic here or pass it as a prop

  const buttonText1 = language === "English" ? "English" : "Ingles";
  const buttonText2 = language === "English" ? "Tagalog" : "Tagalog";
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
          marginBottom: 10,
          width: 120,
          height: 120,
          resizeMode: "contain",
        }}
      />
      <View style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={buttonStyle1}
        onPress={() => {
          if (selectedLanguage !== "English") {
            setSelectedLanguage("English");
            setShowApplyButton(true);
            setButtonStyle1({
              ...styles.button,
              backgroundColor: "#ddd",
              borderColor: "#3a3fbd",
              borderWidth: 1,
            });
            setTextStyle1({ ...styles.buttonText, color: "#3a3fbd" });
            setButtonStyle2(styles.button);
            setTextStyle2(styles.buttonText);
          }
        }}
      >
        <Text style={textStyle1}>{buttonText1}</Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={buttonStyle2}
        onPress={() => {
          if (selectedLanguage !== "Tagalog") {
            setSelectedLanguage("Tagalog");
            setShowApplyButton(true);
            setButtonStyle2({
              ...styles.button,
              backgroundColor: "#ddd",
              borderColor: "#3a3fbd",
              borderWidth: 1,
            });
            setTextStyle2({ ...styles.buttonText, color: "#3a3fbd" });
            setButtonStyle1(styles.button);
            setTextStyle1(styles.buttonText);
          }
        }}
      >
        <Text style={textStyle2}>{buttonText2}</Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 40 }} />
      {showApplyButton && (
        <TouchableOpacity
          style={styles.button4}
          onPress={() => {
            setLanguage(selectedLanguage);
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SettingsPage;
