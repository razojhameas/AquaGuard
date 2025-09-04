#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// 🔒 Network Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverAddress = "http://YOUR_SERVER_IP_ADDRESS:3000";

// === Pin Definitions ===
const int pH_Pin = 4;      // pH sensor on GPIO4 (ADC1)
const int turbidity_Pin = 34;  // Turbidity sensor on GPIO34 (ADC1)
const int oneWireBus = 15;   // DS18B20 data pin

// === LCD Setup ===
LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C LCD at address 0x27

// === DS18B20 Setup ===
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// === Variables ===
float pH_voltage, pH_value;
float turbidity_voltage;
float temperature;
float weight; // Assuming you will add a weight sensor later

void setup() {
  Serial.begin(115200);

  // 🌐 WiFi Init
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Connecting to WiFi...");
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected.");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connected!");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP());
  delay(2000);
  lcd.clear();

  // DS18B20 Init
  sensors.begin();

  // Set ADC resolution (12-bit = 0-4095)
  analogReadResolution(12);
}

void loop() {
  // === Read Sensors ===
  int pH_analog = analogRead(pH_Pin);
  pH_voltage = pH_analog * (3.3 / 4095.0);
  pH_value = 7 + ((2.5 - pH_voltage) / 0.18); // Approximate calibration

  int turbidity_analog = analogRead(turbidity_Pin);
  turbidity_voltage = turbidity_analog * (3.3 / 4095.0);

  sensors.requestTemperatures();
  temperature = sensors.getTempCByIndex(0);

  // Note: Add code here to read your weight sensor
  // weight = readWeightSensor(); 
  weight = 0; // Placeholder for now

  // === Serial Output ===
  Serial.println("====== Water Quality ======");
  Serial.print("pH: ");
  Serial.print(pH_value, 2);
  Serial.print(" | Voltage: ");
  Serial.print(pH_voltage, 2);
  Serial.println(" V");
  Serial.print("Turbidity Voltage: ");
  Serial.print(turbidity_voltage, 2);
  Serial.println(" V");
  Serial.print("Temperature: ");
  Serial.print(temperature, 2);
  Serial.println(" °C");
  Serial.print("Weight: ");
  Serial.print(weight, 2);
  Serial.println(" g");
  Serial.println("============================\n");

  // === LCD Output ===
  lcd.setCursor(0, 0);
  lcd.print("pH:");
  lcd.print(pH_value, 1);
  lcd.print(" T:");
  lcd.print(temperature, 1);
  lcd.print(char(223));
  lcd.print("C");

  lcd.setCursor(0, 1);
  lcd.print("Turbidity:");
  lcd.print(turbidity_voltage, 2);
  lcd.print("V");
  lcd.print(" W:");
  lcd.print(weight, 1);
  lcd.print("g");

  // === Send Data to Server (POST) ===
  postWaterQualityData(pH_value, temperature, turbidity_voltage);
  postWeightData(weight);
  
  // === Get Feeding Settings from Server (GET) ===
  // Note: Implement logic to use this data for your feeding system
  int rotations = getFeedingRotations();
  Serial.print("Fetched rotations: ");
  Serial.println(rotations);

  bool isFeeding = getFeedingToggleState();
  Serial.print("Fetched feeding state: ");
  Serial.println(isFeeding ? "ON" : "OFF");

  delay(5000); // 5-second interval for data updates
}

// 📦 Function to POST water quality data
void postWaterQualityData(float pH, float temp, float turbidity) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverUrl = String(serverAddress) + "/api/data";
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["pH"] = pH;
    doc["temperature"] = temp;
    doc["turbidityLevel"] = turbidity; // Change turbidityVoltage to turbidityLevel
    doc["doConcentration"] = 0; // Placeholder for now
    doc["ammoniaLevel"] = 0; // Placeholder for now

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP POST for water quality data response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error on HTTP POST for water quality data: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected, can't post data.");
  }
}

// ⚖️ Function to POST weight sensor data
void postWeightData(float weight) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverUrl = String(serverAddress) + "/api/weight";
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<128> doc;
    doc["weight"] = weight;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP POST for weight data response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error on HTTP POST for weight data: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected, can't post weight data.");
  }
}

// ⚙️ Function to GET feeding rotations
int getFeedingRotations() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverUrl = String(serverAddress) + "/api/rotations";
    http.begin(serverUrl);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      StaticJsonDocument<64> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (error) {
        Serial.print("JSON parsing failed: ");
        Serial.println(error.f_str());
        return 6; // Default value on error
      }
      return doc["rotations"] | 6; // Return rotations or default
    } else {
      Serial.print("Error on HTTP GET for rotations: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected, can't get data.");
  }
  return 6; // Default value
}

// 🔘 Function to GET feeding toggle state
bool getFeedingToggleState() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverUrl = String(serverAddress) + "/api/feedingtoggle";
    http.begin(serverUrl);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      StaticJsonDocument<64> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (error) {
        Serial.print("JSON parsing failed: ");
        Serial.println(error.f_str());
        return false; // Default value on error
      }
      return doc["isFeeding"] | false; // Return state or default
    } else {
      Serial.print("Error on HTTP GET for toggle: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected, can't get data.");
  }
  return false; // Default value
}