import React, { useState } from "react";
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardPage from "./screens/DashboardPage";
import WaterQualityPage from "./screens/WaterQualityPage";
import AutomatedFeedingPage from "./screens/AutomatedFeedingPage";
import SettingsPage from "./screens/SettingsPage";
import ParameterDetails from "./screens/details/ParameterDetails"; 

AppRegistry.registerComponent("main", () => App);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function WaterQualityStack({ language, settings }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="WaterQualityHome"
        children={(props) => (
          <WaterQualityPage {...props} language={language} settings={settings} />
        )}
      />
      <Stack.Screen
        name="ParameterDetails"
        children={(props) => (
          <ParameterDetails {...props} language={language} settings={settings} />
        )}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator({ language, setLanguage, settings, setSettings }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "DashboardTab") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "WaterQualityTab") {
            iconName = focused ? "water" : "water-outline";
          } else if (route.name === "AutomatedFeedingTab") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "SettingsTab") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00796b",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#e0f7fa",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        children={(props) => <DashboardPage {...props} language={language} />}
        options={{ title: language === "English" ? "Dashboard" : "Dashboard" }}
      />
      <Tab.Screen
        name="WaterQualityTab"
        children={(props) => (
          <WaterQualityStack {...props} language={language} settings={settings} />
        )}
        options={{ title: language === "English" ? "Water Quality" : "Kalidad ng Tubig" }}
      />
      <Tab.Screen
        name="AutomatedFeedingTab"
        children={(props) => (
          <AutomatedFeedingPage {...props} language={language} settings={settings} />
        )}
        options={{ title: language === "English" ? "Automated Feeding" : "Awtomatikong Pagpapakain" }}
      />
      <Tab.Screen
        name="SettingsTab"
        children={(props) => (
          <SettingsPage
            {...props}
            language={language}
            setLanguage={setLanguage}
            settings={settings}
            setSettings={setSettings}
          />
        )}
        options={{ title: language === "English" ? "Settings" : "Mga Setting" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [language, setLanguage] = useState("English");
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    apiEndpoint: "http://192.168.18.5:3000",
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          children={(props) => (
            <MainTabNavigator
              {...props}
              language={language}
              setLanguage={setLanguage}
              settings={settings}
              setSettings={setSettings}
            />
          )}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}