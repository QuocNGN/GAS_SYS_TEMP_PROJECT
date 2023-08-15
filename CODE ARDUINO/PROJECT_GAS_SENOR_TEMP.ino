#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

// ETH11 - TEMP
#define DHTTYPE DHT11
#include "DHT.h"
#define DHTPIN D7
DHT dht(DHTPIN, DHTTYPE);

// MQ2 - GAS
#define GAS_SENSOR A0
#define LED_GREEN D3
#define LED_RED D4
#define BUZZER D5

// LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);  // Địa chỉ I2C và kích thước màn hình


const char *SSID = "Quoc Anh";
const char *PASSWORD = "25032014";
const char *URL = "http://192.168.1.229:8800/sensor";

ESP8266WiFiMulti WiFiMulti;
WiFiClient client;
HTTPClient http;

void setup() {

  Serial.begin(9600);
  // Serial.setDebugOutput(true);
  // LCD, GAS
  lcd.init();
  lcd.backlight();  // Bật đèn nền màn hình
  pinMode(GAS_SENSOR, INPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  // Serial.println();
  // Serial.println();
  // Serial.println();

  // for (uint8_t t = 4; t > 0; t--) {
  //   Serial.printf("[SETUP] WAIT %d...\n", t);
  //   Serial.flush();
  //   delay(1000);
  // }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(SSID, PASSWORD);
  // wait for WiFi connection
  // while (WiFiMulti.run() != WL_CONNECTED) {
  //   delay(500);
  //   Serial.print(".");
  // }
  // Serial.println("");
  // Serial.println("WiFi connected");
  // Serial.println("IP address: ");
  // Serial.println(WiFi.localIP());
}

void postJsonData() {
  Serial.print("connecting to ");
  if ((WiFiMulti.run() == WL_CONNECTED)) {
    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, URL)) {  // HTTP
      Serial.print("[HTTP] POST...\n");
      //gui du lieu len server dang JSON
      const int capacity = JSON_OBJECT_SIZE(5);
      StaticJsonDocument<capacity> doc;

      dht.begin();
      // Reading temperature or humidity takes about 250 milliseconds!
      // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
      float h = dht.readHumidity();
      // Read temperature as Celsius (the default)
      float t = dht.readTemperature();
      int g = analogRead(GAS_SENSOR);

      // doc["id"] = "1";
      doc["temperature"] = t;
      doc["humid"] = h;
      doc["gas"] = g;
      // doc["time"] = "2021-06-07T16:48:28.973";
      // doc["farmid"] = "2";

      char output[2048];
      serializeJson(doc, Serial);
      serializeJson(doc, output);


      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST(output);
      Serial.println(httpCode);  //Print HTTP return code
      // file found at server
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        String payload = http.getString();
        Serial.println(payload);
        //          char input[50];
        //          payload.toCharArray(input, 50);
        //          //parseJson
        //          Serial.println("Begin parse json data ...");
        //          DynamicJsonDocument docResponse(2048);
        //          DeserializationError err = deserializeJson(docResponse, payload);
        //          if (err) {
        //            Serial.print(F("deserializeJson() failed with code "));
        //            Serial.println(err.c_str());
        //          }
        //auto name = docResponse["name"].as<char*>();
        Serial.println("done");

      } else {
        Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();  //Close connection Serial.println();
      Serial.println("closing connection");
    }
  }
}
void loop() {
  int g = analogRead(GAS_SENSOR);
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (g <= 650) {
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_GREEN, HIGH);
    noTone(BUZZER);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Gas Level:");
    lcd.setCursor(10, 0);
    lcd.print(g);
    lcd.setCursor(0, 1);
    lcd.print("Temp:");
    lcd.setCursor(5, 1);
    lcd.print(t);
    lcd.setCursor(7, 1);
    lcd.print("*C");
    lcd.setCursor(9, 1);
    lcd.print("  H:");
    lcd.setCursor(13, 1);
    lcd.print(h);
    lcd.setCursor(15, 1);
    lcd.print("%");
    // delay(200);
  } else {
    lcd.print(g);
    digitalWrite(LED_RED, HIGH);
    digitalWrite(LED_GREEN, LOW);
    tone(BUZZER, 1000);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Gas Detected!!!");
    lcd.setCursor(0, 1);
    lcd.print("Gas:");
    lcd.setCursor(4, 1);  // Đặt vị trí con trỏ cột để viết thông số gas
    lcd.print(g);
    lcd.setCursor(8, 1);
    lcd.print("   ");
     lcd.setCursor(10, 1);
    lcd.print("T:");
    lcd.setCursor(12, 1);
    lcd.print(t);
    lcd.setCursor(14, 1);
    lcd.print("*C");
    // delay(200);
  }
  delay(1000);

  postJsonData();
  delay(5000);
}
