// LanguageSelection.js
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

// Import the styles from App.js or define them here
// import styles from './path/to/your/styles'; // adjust the path accordingly

const LanguageSelection = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [confirmLanguage, setConfirmLanguage] = useState(false);

  const Spacer = ({ height }) => <View style={{ height }} />;

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
  };

  const handleConfirm = () => {
    // Replace setLanguage with the actual function or logic to set the language
    // setLanguage(selectedLanguage);
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
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              selectedLanguage === "English" ? "#3a3fbd" : "#ddd",
            borderColor: selectedLanguage === "English" ? "#3a3fbd" : "#3a3fbd",
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
      </TouchableOpacity>
      <Spacer height={10} />
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              selectedLanguage === "Tagalog" ? "#3a3fbd" : "#ddd",
            borderColor: selectedLanguage === "Tagalog" ? "#3a3fbd" : "#3a3fbd",
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
      </TouchableOpacity>
      <Spacer height={30} />
      {/* add some extra margin */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: selectedLanguage ? "#3a3fbd" : "#rgb(242,242,242)",
          },
        ]}
        onPress={handleConfirm}
        disabled={!selectedLanguage}
      >
        <Text style={styles.buttonText}>></Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles here or import them
const styles = StyleSheet.create({
  languageSelection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3a3fbd",
    padding: 12,
    borderRadius: 10,
    width: 250,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default LanguageSelection;
