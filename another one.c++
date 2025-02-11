#include <WiFi.h>
#include <HTTPClient.h>
#include <BlynkSimpleWiFi.h>
#include <Adafruit_TCS34725.h>
#include <HX711.h>
#include <Ultrasonic.h>
#include <Servo.h>

// Define pins and variables
const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
const char* serverUrl = "http://localhost:3000/api";

WiFiClient wifiClient;
HTTPClient http;

#define BLYNK_TEMPLATE_ID "your_blynk_template_id"
#define BLYNK_DEVICE_NAME "your_blynk_device_name"
#define BLYNK_AUTH_TOKEN "your_blynk_auth_token"

#define pH_SENSOR_PIN 37
#define TEMP_SENSOR_PIN 15
#define RELAY_PIN 26
#define WATER_PUMP_PIN 13
#define SOLENOID_VALVE_1_PIN 12
#define SOLENOID_VALVE_2_PIN 14
#define PERISTALTIC_PUMP_1_PIN 2
#define PERISTALTIC_PUMP_2_PIN 5
#define PERISTALTIC_PUMP_3_PIN 26
#define DC_MOTOR_1_PIN 33
#define DC_MOTOR_2_PIN 34
#define DC_MOTOR_3_PIN 35
#define TDS_SENSOR_PIN A0
#define WEIGHT_SENSOR_PIN 32
#define SERVO_MOTOR_PIN 25
#define TRIGGER_PIN 18
#define ECHO_PIN 19

Adafruit_TCS34725 colorSensor1 = Adafruit_TCS34725(21, 22);
Adafruit_TCS34725 colorSensor2 = Adafruit_TCS34725(19, 23);
Adafruit_TCS34725 colorSensor3 = Adafruit_TCS34725(18, 5);

HX711 weightSensor;
Ultrasonic ultrasonic(TRIGGER_PIN, ECHO_PIN);
Servo servoMotor;

BlynkTransport espTransport(Serial1);
BlynkClient client(espTransport);

void setup() {
  Serial.begin(9600);

  pinMode(pH_SENSOR_PIN, INPUT);
  pinMode(TEMP_SENSOR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(WATER_PUMP_PIN, OUTPUT);
  pinMode(SOLENOID_VALVE_1_PIN, OUTPUT);
  pinMode(SOLENOID_VALVE_2_PIN, OUTPUT);
  pinMode(PERISTALTIC_PUMP_1_PIN, OUTPUT);
  pinMode(PERISTALTIC_PUMP_2_PIN, OUTPUT);
  pinMode(PERISTALTIC_PUMP_3_PIN, OUTPUT);
  pinMode(DC_MOTOR_1_PIN, OUTPUT);
  pinMode(DC_MOTOR_2_PIN, OUTPUT);
  pinMode(DC_MOTOR_3_PIN, OUTPUT);
  pinMode(TDS_SENSOR_PIN, INPUT);
  pinMode(WEIGHT_SENSOR_PIN, INPUT);
  pinMode(SERVO_MOTOR_PIN, OUTPUT);

  weightSensor.begin(WEIGHT_SENSOR_PIN);
  ultrasonic.begin();
  servoMotor.attach(SERVO_MOTOR_PIN);

  WiFi.begin(ssid, password);
  while (WiFi.status()!= WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  Blynk.begin(BLYNK_AUTH_TOKEN, espTransport);
}

void loop() {
  Blynk.run();

  // Read sensor data
  int temperature = readTemperatureSensor();
  int pH = readPHSensor();
  int tds = readTDSSensor();
  int weight = readWeightSensor();
  int color1 = readColorSensor(colorSensor1);
  int color2 = readColorSensor(colorSensor2);
  int color3 = readColorSensor(colorSensor3);

  // Send data to Blynk
  Blynk.virtualWrite(A0, temperature);
  Blynk.virtualWrite(A1, pH);
  Blynk.virtualWrite(A2, tds);
  Blynk.virtualWrite(A3, weight);
  Blynk.virtualWrite(A4, color1);
  Blynk.virtualWrite(A5, color2);
  Blynk.virtualWrite(A6, color3);

  // Check for feeding commands from Blynk
  if (Blynk.virtualRead(V7) == 1) {
    startFeeding();
  } else if (Blynk.virtualRead(V7) == 0) {
    stopFeeding();
  }

  // Check for algae control interval from Blynk
  int interval = Blynk.virtualRead(V8);
  if (interval > 0) {
    controlAlgae(interval);
  }

  delay(60000); // Wait 1 minute before sending data again
}

int readTemperatureSensor() {
  // Read temperature sensor value
  int sensorValue = analogRead(TEMP_SENSOR_PIN);
  float voltage = sensorValue * 5.0 / 1023.0;
  float temperature = (voltage - 0.5) * 100.0;
  return (int)temperature;
}

int readPHSensor() {
  // Read pH sensor value
  int sensorValue = analogRead(pH_SENSOR_PIN);
  float voltage = sensorValue * 5.0 / 1023.0;
  float pH = 7.0 - (voltage - 2.5) / 0.18;
  return (int)pH;
}

int readTDSSensor() {
  // Read TDS sensor value
  int sensorValue = analogRead(TDS_SENSOR_PIN);
  float voltage = sensorValue * 5.0 / 1023.0;
  float tds = voltage * 100.0;
  return (int)tds;
}

int readWeightSensor() {
  // Read weight sensor value
  int weightValue = weightSensor.get_units(10);
  return weightValue;
}

int readColorSensor(Adafruit_TCS34725 &colorSensor) {
  uint16_t r, g, b, c;
  colorSensor.getRawData(&r, &g, &b, &c);
  uint16_t colorTemp = colorSensor.calculateColorTemperature(r, g, b);
  return colorTemp;
}

void controlAlgae(int interval) {
  // Activate ultrasonic transducer for the specified interval
  ultrasonic.start();
  delay(interval * 60000); // Convert interval from minutes to milliseconds
  ultrasonic.stop();
}

void startFeeding() {
  // Open servo motor to dispense feed
  servoMotor.write(90); // Rotate servo motor to 90 degrees (half-way point)
  delay(500); // Hold for 0.5 seconds

  // Dispense feed (you can adjust the duration and speed of the servo motor here)
  for (int i = 0; i < 5; i++) {
    servoMotor.write(120); // Rotate servo motor to 120 degrees (dispense feed)
    delay(200); // Hold for 0.2 seconds
    servoMotor.write(60); // Rotate servo motor to 60 degrees (return to initial position)
    delay(200); // Hold for 0.2 seconds
  }

  // Return servo motor to initial position
  servoMotor.write(0); // Rotate servo motor to 0 degrees
  delay(500); // Hold for 0.5 seconds
}

void stopFeeding() {
  // Stop feeding by closing the servo motor
  servoMotor.write(0); // Rotate servo motor to 0 degrees
  delay(500); // Hold for 0.5 seconds
}

