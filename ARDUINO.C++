#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <DallasTemperature.h>
#include <OneWire.h>
#include <Adafruit_TCS34725.h>
#include <HX711.h>
#include <Ultrasonic.h>
#include <DS1307RTC.h>
#include <TimeLib.h>
#include <ESP32Servo.h>
#include <ph4502c_sensor.h>
#include <MQ137.h>

// GPIO pin assignments
#define pH_SENSOR_PIN 32
#define TEMP_SENSOR_PIN 15
#define RELAY_PIN 26
#define RTC_SDA_PIN 4
#define RTC_SCL_PIN 10
#define WATER_PUMP_PIN 13
#define SOLENOID_VALVE_1_PIN 12
#define SOLENOID_VALVE_2_PIN 14
#define PERISTALTIC_PUMP_1_PIN 2
#define PERISTALTIC_PUMP_2_PIN 5
#define DC_MOTOR_1_PIN 33
#define DC_MOTOR_2_PIN 34
#define DC_MOTOR_3_PIN 35
#define TDS_SENSOR_PIN A0
#define WEIGHT_SENSOR_DOUT_PIN 27
#define WEIGHT_SENSOR_SCK_PIN 25
#define SERVO_MOTOR_PIN 17
#define COLOR_SENSOR_1_SDA 21
#define COLOR_SENSOR_1_SCL 22
#define COLOR_SENSOR_2_SDA 19
#define COLOR_SENSOR_2_SCL 23
#define COLOR_SENSOR_3_SDA 18
#define MQ137_PIN 36

Adafruit_TCS34725 colorSensor1(TCS34725_INTEGRATIONTIME_2_4MS, TCS34725_GAIN_1X);
Adafruit_TCS34725 colorSensor2(TCS34725_INTEGRATIONTIME_2_4MS, TCS34725_GAIN_1X);
Adafruit_TCS34725 colorSensor3(TCS34725_INTEGRATIONTIME_2_4MS, TCS34725_GAIN_1X);

const int triggerPin = 18;  // Pin for trigger (ultrasonic transducer)
const int echoPin = 19;  // Pin for echo (ultrasonic transducer)

// Sensor objects
OneWire oneWire(TDS_SENSOR_PIN);
DallasTemperature tempSensor(&oneWire);
DS1307RTC rtc;
Servo servoMotor;
HX711 weightSensor;
Ultrasonic ultrasonic(triggerPin, echoPin);
class PH4502C {
  public:
    PH4502C(int pin) {
      _pin = pin;
    }

    void begin() {
      // initialization code here
    }

    float readPH() {
      // code to read pH value here
      return pHValue;
    }

  private:
    int _pin;
    float pHValue;
};
PH4502C phSensor(pH_SENSOR_PIN);
MQ137 mq137Sensor(MQ137_PIN, 1000.0, true); // adjust nlang depende sa setup

float ammoniaPPM = 0.0; // Declare ammoniaPPM as a global variable

WiFiClient client;
HTTPClient http;

void setup() {
  pinMode(pH_SENSOR_PIN, INPUT);
  pinMode(TEMP_SENSOR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(WATER_PUMP_PIN, OUTPUT);
  pinMode(SOLENOID_VALVE_1_PIN, OUTPUT);
  pinMode(SOLENOID_VALVE_2_PIN, OUTPUT);
  pinMode(PERISTALTIC_PUMP_1_PIN, OUTPUT);
  pinMode(PERISTALTIC_PUMP_2_PIN, OUTPUT);
  pinMode(DC_MOTOR_1_PIN, OUTPUT);
  pinMode(DC_MOTOR_2_PIN, OUTPUT);
  pinMode(DC_MOTOR_3_PIN, OUTPUT);
  pinMode(WEIGHT_SENSOR_DOUT_PIN, INPUT);
  pinMode(WEIGHT_SENSOR_SCK_PIN, INPUT);
  int servoPin = 17;
  servoMotor.attach(SERVO_MOTOR_PIN);  // Attach the servo motor to the GPIO pin
  servoMotor.write(0);  // Initialize the servo motor to 0 degrees
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Initialize sensors
  tempSensor.begin();
  phSensor.begin();
  Wire.begin(RTC_SDA_PIN, RTC_SCL_PIN);
  colorSensor1.begin();
  colorSensor2.begin();
  weightSensor.begin(WEIGHT_SENSOR_DOUT_PIN, WEIGHT_SENSOR_SCK_PIN);
  mq137Sensor.begin();

  // Connect to WiFi
  WiFi.begin("your_wifi_ssid", "your_wifi_password");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

bool readWeightSensor() {
   // Read weight sensor value using HX711 library
  int weightValue = weightSensor.get_units(10  );
  return weightValue > 0; // Return true if weight value is greater than 0, indicating feed is present
}

void dispenseFeed() {
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

int readTDS() { // for TDS reading
  int tdsValue = analogRead(TDS_SENSOR_PIN);
  // Calibration formula: TDS value = (analog reading - offset) / slope
  int tdsCalibrated = (tdsValue - 512) / 2; // example calibration formula
  return tdsCalibrated;
}

int readColorSensor(Adafruit_TCS34725 &colorSensor) {
  uint16_t r, g, b, c;
  colorSensor.getRawData(&r, &g, &b, &c);
  // Indicate color temperature
  uint16_t colorTemp = colorSensor.calculateColorTemperature(r, g, b);
  return colorTemp;
}

float readAmmonia() {
  // Read ammonia value using MQ137 library
  float ammoniaPPM = mq137Sensor.getPPM();
  return ammoniaPPM;
}

void sendDataToServerWeight(int weightValue) {
  http.begin("http://localhost:3000/api/weight");
  http.addHeader("Content-Type", "application/json");

  String jsonString = "{\"weight\": " + String(weightValue) + "}";
  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    Serial.println("Weight data sent to server successfully");
  } else {
    Serial.println("Error sending weight data to server");
  }

  http.end();
}

void sendDataToServer(float tempValue, float pHValue, int tdsValue, int colorValue1, int colorValue2, float ammoniaPPM) {
  http.begin("http://localhost:3000/api/data");
  http.addHeader("Content-Type", "application/json");

  String jsonString = "{\"temperature\": " + String(tempValue) + ", \"pH\": " + String(pHValue) + ", \"tds\": " + String(tdsValue) + ", \"doConcentration\": " + String(colorValue1) + ", \"ammoniaLevel\": " + String(ammoniaPPM) + ", \"nitrateLevel\": " + String(colorValue2) + "}";
  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    Serial.println("Data sent to server successfully");
  } else {
    Serial.println("Error sending data to server");
  }

  http.end();
}

void receiveCommandsFromServer() {
  http.begin("http://localhost:3000/api/commands");
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    String response = http.getString();
    DynamicJsonDocument jsonDoc(2048);
    jsonDoc.parse(response);

    if (jsonDoc.containsKey("feed")) {
      bool feedCommand = jsonDoc["feed"];
      if (feedCommand) {
        dispenseFeed();
      } else {
        // Stop feeding
      }
    }

    if (jsonDoc.containsKey("ultrasonic")) {
      bool ultrasonicCommand = jsonDoc["ultrasonic"];
      if (ultrasonicCommand) {
        controlAlgae();
      } else {
        // Stop ultrasonic transducer
      }
    }

    // Add more commands as needed
  } else {
    Serial.println("Error receiving commands from server");
  }

  http.end();
}

void controlAlgae() {
  // Send a 10us pulse to the trigger pin to generate the ultrasonic wave
  pinMode(triggerPin, OUTPUT);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);

  // Read the echo
  pinMode(echoPin, INPUT);
  int duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  if (distance < 20) {
    // Algae is too close, turn on the ultrasonic transducer
    digitalWrite(triggerPin, HIGH);
    delay(1000);
    digitalWrite(triggerPin, LOW);
  } else {
    // Algae is at a safe distance, turn off the ultrasonic transducer
  }
}

void loop() {
  float tempValue = tempSensor.getTempCByIndex(0);
  float pHValue = phSensor.readPH();
  int tdsValue = readTDS();
  int colorValue1 = readColorSensor(colorSensor1);
  int colorValue2 = readColorSensor(colorSensor2);
  float ammoniaPPM = readAmmonia();

  bool weightPresent = readWeightSensor();
  if (weightPresent) {
    int weightValue = weightSensor.get_units(10);
    sendDataToServerWeight(weightValue);
  }

  sendDataToServer(tempValue, pHValue, tdsValue, colorValue1, colorValue2, ammoniaPPM);

  receiveCommandsFromServer();

  delay(10000); // Send data every 10 seconds
}