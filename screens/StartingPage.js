import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

// Import the styles from App.js or define them here
// import styles from './path/to/your/styles'; // adjust the path accordingly

const StartingPage = ({ navigation }) => {
  return (
    <View style={styles.startingPage}>
      <Image
        source={require("C:\\Users\\Jhames\\GROUPTUBIG\\assets\\icon.png")}
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
      <View style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LanguageSelection")}
      >
        <Text style={[styles.buttonText, { fontFamily: "sans-serif-medium" }]}>
          >
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles here or import them
const styles = StyleSheet.create({
  startingPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 40,
    color: "#3a3fbd",
    fontWeight: "bold",
    fontFamily: "notoserif",
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

export default StartingPage;
