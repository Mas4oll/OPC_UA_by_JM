/*
 * Programa para leectura y generacion de datos de simulacion para sevidor OPC UA comunicacion de puerto serial con Raspberry Pi 4B con Node-Red
 * Hecho por JM
 */
/*
 * Lista de orden de impesion de datos:
 * Pushbutton [0, 1]
 * Sensor de temperatura [*C]
 * Potenciometro [0-5V]
 */
int tempPin = 1;
int buttonPin = 2;     // the number of the pushbutton pin
int ledPin =  13;      // the number of the LED pin
int val;
int buttonState = 0;         // variable for reading the pushbutton status
int potPin = 0;
float medidor;


void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);
  pinMode(potPin, INPUT);
}

void loop() {
  // read the state of the pushbutton value:
  int buttonState = digitalRead(buttonPin);

  // check if the pushbutton is pressed. If it is, the buttonState is HIGH:
  if (buttonState == HIGH) {
    // turn LED on:
    digitalWrite(ledPin, HIGH);
  } else {
    // turn LED off:
    digitalWrite(ledPin, LOW);
  }
  // print out the state of the button:
  //  Serial.print("B2=");
  Serial.println(buttonState);


  val = analogRead(tempPin);
  float mv = ( val / 1024.0) * 5000;
  float cel = mv / 10;
  float farh = (cel * 9) / 5 + 32;
  //  Serial.print("Temperatura=");
  Serial.println(cel);
  //  Serial.print("*C");
  //  delay(500);
  /* uncomment this to get temperature in farenhite
    Serial.print("TEMPRATURE = ");
    Serial.print(farh);
    Serial.print("*F");
    Serial.println();
  */
  medidor = analogRead(potPin);
  //  Serial.print("Pot=");
  Serial.println((medidor * 5) / 1023);
  delay(500);        // delay in between reads for stability
}
