// HomePage.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

// Import the styles from App.js or define them here
// import styles from './path/to/your/styles'; // adjust the path accordingly

const HomePage = ({ navigation, language }) => {
  // Define button texts based on the selected language
  let buttonText =
    language === "English" ? "Water Quality" : "Kalidad ng Tubig";
  let buttonText2 = language === "English" ? "Feeding" : "Pagpapakain";
  let buttonText3 =
    language === "English" ? "Algae Control" : "Kontrol ng Algae";
  let buttonText4 = language === "English" ? "Settings" : "Mga Setting";

  return (
    <View style={styles.homePage}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("WaterQuality")}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={styles.alterButton}
        onPress={() => navigation.navigate("AutomatedFeeding")}
      >
        <Text style={styles.alterbuttonText}>{buttonText2}</Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AlgaeControl")}
      >
        <Text style={styles.buttonText}>{buttonText3}</Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={styles.alterButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.alterbuttonText}>{buttonText4}</Text>
      </TouchableOpacity>
      <Image
        source={require("C:\\Users\\Jhames\\GROUPTUBIG\\assets\\icon.png")}
        style={{
          marginTop: 30,
          width: 100,
          height: 100,
          resizeMode: "contain",
        }}
      />
      <Text style={[styles.mybuttonText, {}]}>
        Did you know? {"\n\n"}
        Fish in Tagalog is 'Isda'
      </Text>
    </View>
  );
};

// Define styles here or import them
const styles = StyleSheet.create({
  homePage: {
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
  alterButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    width: 250,
    borderWidth: 3,
    borderColor: "#3a3fbd",
  },
  alterbuttonText: {
    color: "#3a3fbd",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  mybuttonText: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
  },
});

export default HomePage;
