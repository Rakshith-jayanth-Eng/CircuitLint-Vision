import { CircuitPreset } from '../types/circuit';

export const CIRCUIT_PRESETS: CircuitPreset[] = [
  {
    id: 'esp32-i2c-lcd-bme280',
    title: 'ESP32 + 5V I2C LCD & BME280',
    subtitle: 'Confirmed Demo • 3.3V Logic • Level Mismatch & Missing Pull-ups Bug',
    targetLogic: '3.3V',
    category: 'Multi-Sensor I2C',
    description:
      'Realistic bench prototype connecting a 3.3V ESP32 DevKit to an I2C 1602 LCD module powered from 5V and a 3.3V Bosch BME280 sensor on the same bus without bidirectional level shifters, dedicated I2C pull-ups, or VDD decoupling capacitors.',
    tags: ['ESP32', '3.3V', '5V I2C LCD', 'BME280', 'Level Mismatch Bug', 'Missing Pull-ups'],
    circuitSvg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full select-none">
      <defs>
        <pattern id="breadboard-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="#334155" />
        </pattern>
        <linearGradient id="mcu-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <!-- Breadboard Base Plate -->
      <rect x="20" y="20" width="760" height="440" rx="8" fill="#0b0f19" stroke="#1e293b" stroke-width="2"/>
      <rect x="35" y="35" width="730" height="410" fill="url(#breadboard-grid)"/>

      <!-- Power Rails Top -->
      <line x1="40" y1="45" x2="750" y2="45" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="755" y="48" fill="#ef4444" font-size="10" font-family="monospace">5V</text>
      <line x1="40" y1="65" x2="750" y2="65" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="755" y="68" fill="#3b82f6" font-size="10" font-family="monospace">GND</text>

      <!-- Power Rails Bottom -->
      <line x1="40" y1="420" x2="750" y2="420" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="755" y="423" fill="#f59e0b" font-size="10" font-family="monospace">3.3V</text>
      <line x1="40" y1="438" x2="750" y2="438" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="755" y="441" fill="#3b82f6" font-size="10" font-family="monospace">GND</text>

      <!-- Wire Traces -->
      <!-- SDA Trace (Cyan) -->
      <path d="M 230 190 L 330 190 L 330 120 L 530 120 L 530 150" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round"/>
      <!-- SCL Trace (Yellow/Amber) -->
      <path d="M 230 210 L 320 210 L 320 140 L 550 140 L 550 150" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
      <!-- 5V Wire to LCD (Red) -->
      <path d="M 510 45 L 510 150" fill="none" stroke="#ef4444" stroke-width="2.5"/>
      <!-- GND to LCD (Slate/Blue) -->
      <path d="M 490 65 L 490 150" fill="none" stroke="#60a5fa" stroke-width="2.5"/>

      <!-- Wire to BME280 from ESP32 3.3V & SDA/SCL -->
      <path d="M 330 190 L 330 310 L 490 310" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="2,2"/>
      <path d="M 320 210 L 320 330 L 490 330" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2,2"/>
      <path d="M 230 250 L 470 250 L 470 290 L 490 290" fill="none" stroke="#f59e0b" stroke-width="2"/> <!-- 3V3 VDD -->
      <path d="M 230 270 L 460 270 L 460 350 L 490 350" fill="none" stroke="#60a5fa" stroke-width="2"/> <!-- GND -->

      <!-- Hazard Annotation Callout: 5V backfeed on I2C line -->
      <rect x="330" y="70" width="165" height="44" rx="4" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
      <text x="340" y="87" fill="#fca5a5" font-size="10" font-family="monospace" font-weight="bold">CRITICAL HAZARD</text>
      <text x="340" y="103" fill="#fecaca" font-size="9" font-family="sans-serif">5V LCD Pulls SDA/SCL > 3.6V</text>

      <!-- Missing Capacitor Annotation -->
      <rect x="585" y="300" width="160" height="38" rx="4" fill="#451a03" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="595" y="316" fill="#fde68a" font-size="10" font-family="monospace" font-weight="bold">MEDIUM ISSUE</text>
      <text x="595" y="330" fill="#fef3c7" font-size="9" font-family="sans-serif">Missing 100nF Decoupling C</text>

      <!-- Component 1: ESP32 NodeMCU Board -->
      <rect x="70" y="110" width="160" height="230" rx="6" fill="url(#mcu-grad)" stroke="#38bdf8" stroke-width="2"/>
      <rect x="110" y="90" width="80" height="25" rx="3" fill="#334155" stroke="#64748b"/>
      <text x="132" y="106" fill="#94a3b8" font-size="9" font-family="monospace">USB-C</text>
      <!-- ESP32 RF Shield -->
      <rect x="90" y="130" width="120" height="90" rx="4" fill="#0f172a" stroke="#475569"/>
      <text x="112" y="175" fill="#f8fafc" font-size="13" font-family="monospace" font-weight="bold">ESP32-WROOM</text>
      <text x="120" y="195" fill="#38bdf8" font-size="10" font-family="monospace">3.3V Logic</text>

      <!-- ESP32 Pins on Right Header -->
      <circle cx="230" cy="150" r="4" fill="#ef4444"/>
      <text x="195" y="154" fill="#cbd5e1" font-size="9" font-family="monospace">VIN(5V)</text>
      <circle cx="230" cy="170" r="4" fill="#3b82f6"/>
      <text x="200" y="174" fill="#cbd5e1" font-size="9" font-family="monospace">GND</text>
      <circle cx="230" cy="190" r="4" fill="#06b6d4"/>
      <text x="180" y="194" fill="#06b6d4" font-size="9" font-family="monospace">GPIO21(SDA)</text>
      <circle cx="230" cy="210" r="4" fill="#f59e0b"/>
      <text x="180" y="214" fill="#f59e0b" font-size="9" font-family="monospace">GPIO22(SCL)</text>
      <circle cx="230" cy="250" r="4" fill="#f59e0b"/>
      <text x="190" y="254" fill="#cbd5e1" font-size="9" font-family="monospace">3V3 OUT</text>
      <circle cx="230" cy="270" r="4" fill="#3b82f6"/>
      <text x="200" y="274" fill="#cbd5e1" font-size="9" font-family="monospace">GND</text>

      <!-- Component 2: 1602 LCD with PCF8574 Backpack -->
      <rect x="470" y="90" width="230" height="130" rx="4" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="495" y="105" width="180" height="60" rx="2" fill="#15803d"/>
      <text x="515" y="140" fill="#bbf7d0" font-size="13" font-family="monospace" letter-spacing="2">CIRCUITLINT 5V</text>
      <text x="520" y="195" fill="#86efac" font-size="10" font-family="sans-serif">1602 LCD + PCF8574 (5V VDD)</text>
      <!-- LCD I2C Pins -->
      <circle cx="490" cy="150" r="4" fill="#60a5fa"/>
      <text x="480" y="170" fill="#94a3b8" font-size="8" font-family="monospace">GND</text>
      <circle cx="510" cy="150" r="4" fill="#ef4444"/>
      <text x="502" y="170" fill="#ef4444" font-size="8" font-family="monospace">VCC</text>
      <circle cx="530" cy="150" r="4" fill="#06b6d4"/>
      <text x="522" y="170" fill="#06b6d4" font-size="8" font-family="monospace">SDA</text>
      <circle cx="550" cy="150" r="4" fill="#f59e0b"/>
      <text x="542" y="170" fill="#f59e0b" font-size="8" font-family="monospace">SCL</text>

      <!-- Component 3: BME280 Sensor Module -->
      <rect x="490" y="270" width="90" height="110" rx="4" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="525" y="285" width="20" height="20" rx="2" fill="#cbd5e1" stroke="#334155"/>
      <text x="502" y="325" fill="#f8fafc" font-size="10" font-family="monospace" font-weight="bold">BME280</text>
      <text x="500" y="340" fill="#cbd5e1" font-size="8" font-family="sans-serif">3.3V Sensor</text>
      <!-- BME280 Pins -->
      <circle cx="490" cy="290" r="3" fill="#f59e0b"/>
      <text x="460" y="293" fill="#cbd5e1" font-size="7" font-family="monospace">VIN</text>
      <circle cx="490" cy="310" r="3" fill="#06b6d4"/>
      <text x="460" y="313" fill="#06b6d4" font-size="7" font-family="monospace">SDA</text>
      <circle cx="490" cy="330" r="3" fill="#f59e0b"/>
      <text x="460" y="333" fill="#f59e0b" font-size="7" font-family="monospace">SCL</text>
      <circle cx="490" cy="350" r="3" fill="#60a5fa"/>
      <text x="460" y="353" fill="#cbd5e1" font-size="7" font-family="monospace">GND</text>
    </svg>`,
    presetAudit: {
      summary: {
        circuitName: 'ESP32 (3.3V) with 5V I2C LCD & BME280 Environment Node',
        targetLogic: '3.3V',
        overallIntegrity: 'HAZARDOUS',
        totalComponents: 3,
        issueCounts: {
          critical: 1,
          high: 1,
          medium: 1,
          low: 1,
        },
        briefAssessment:
          'CRITICAL HAZARD DETECTED: The 5V PCF8574 I2C backpack is connected directly to the ESP32 (GPIO21/GPIO22) and BME280 without logic-level shifting. The internal 10kΩ pull-up resistors on the 5V backpack pull the SDA and SCL signal lines up to 5.0V, exceeding the ESP32 absolute maximum GPIO input voltage limit of 3.6V and risking permanent silicon gate oxide destruction.',
      },
      components: [
        {
          id: 'comp-esp32',
          name: 'ESP32 DevKit V1 (ESP-WROOM-32)',
          designator: 'U1',
          type: 'microcontroller',
          package: 'NodeMCU 30-Pin Breakout',
          nominalVoltage: '3.3V',
          busRoles: ['I2C', 'Power', 'GPIO'],
          description: 'Dual-core Tensilica Xtensa LX6 MCU with Wi-Fi and Bluetooth BLE. Native I/O voltage is strictly 3.3V (Absolute Max: 3.6V).',
          pinsIdentified: [
            { pinName: 'GPIO21', connectedNet: 'I2C_SDA_BUS', signalType: 'Open-Drain I/O', voltageNominal: '3.3V (EXPOSED TO 5V)' },
            { pinName: 'GPIO22', connectedNet: 'I2C_SCL_BUS', signalType: 'Open-Drain Output', voltageNominal: '3.3V (EXPOSED TO 5V)' },
            { pinName: '3V3_OUT', connectedNet: '3V3_RAIL', signalType: 'Power Source', voltageNominal: '3.3V' },
            { pinName: 'VIN', connectedNet: '5V_USB_RAIL', signalType: 'Power Input', voltageNominal: '5.0V' },
            { pinName: 'GND', connectedNet: 'GND_NET', signalType: 'Ground Reference', voltageNominal: '0.0V' },
          ],
        },
        {
          id: 'comp-pcf8574',
          name: 'HD44780 1602 LCD with PCF8574 Backpack',
          designator: 'DISP1',
          type: 'display',
          package: 'I2C Adapter Daughterboard',
          nominalVoltage: '5.0V',
          busRoles: ['I2C', 'Power'],
          description: 'Alphanumeric dot-matrix display. The PCF8574 I2C expander is powered by 5V VDD with built-in pull-up resistors tied directly to 5V.',
          pinsIdentified: [
            { pinName: 'VCC', connectedNet: '5V_USB_RAIL', signalType: 'Power Input', voltageNominal: '5.0V' },
            { pinName: 'GND', connectedNet: 'GND_NET', signalType: 'Ground Reference', voltageNominal: '0.0V' },
            { pinName: 'SDA', connectedNet: 'I2C_SDA_BUS', signalType: 'I2C Data (5V Pull-up)', voltageNominal: '5.0V' },
            { pinName: 'SCL', connectedNet: 'I2C_SCL_BUS', signalType: 'I2C Clock (5V Pull-up)', voltageNominal: '5.0V' },
          ],
        },
        {
          id: 'comp-bme280',
          name: 'Bosch BME280 Sensor Module',
          designator: 'U2',
          type: 'sensor',
          package: 'LGA-8 Breakout Module',
          nominalVoltage: '3.3V',
          busRoles: ['I2C', 'Power'],
          description: 'High-precision temperature, humidity, and barometric pressure sensor. Maximum VDD rating is 3.6V.',
          pinsIdentified: [
            { pinName: 'VIN', connectedNet: '3V3_RAIL', signalType: 'Power Input', voltageNominal: '3.3V' },
            { pinName: 'GND', connectedNet: 'GND_NET', signalType: 'Ground Reference', voltageNominal: '0.0V' },
            { pinName: 'SDA', connectedNet: 'I2C_SDA_BUS', signalType: 'I2C Data', voltageNominal: '3.3V (EXPOSED TO 5V)' },
            { pinName: 'SCL', connectedNet: 'I2C_SCL_BUS', signalType: 'I2C Clock', voltageNominal: '3.3V (EXPOSED TO 5V)' },
            { pinName: 'CSB', connectedNet: 'UNCONNECTED', signalType: 'SPI Select / I2C Mode', voltageNominal: 'Floating' },
          ],
        },
      ],
      buses: [
        {
          busType: 'I2C',
          busName: 'Main Sensor & Display Bus (I2C0)',
          voltageLevel: '5.0V / 3.3V CONFLICT',
          masterDevice: 'ESP32 (GPIO21/GPIO22)',
          slaveDevices: ['PCF8574 LCD (Addr 0x27 / 0x3F)', 'BME280 Sensor (Addr 0x76 / 0x77)'],
          pullUpsPresent: true,
          pullUpValue: '10 kΩ on LCD backpack (tied to 5V rail!)',
          statusNotes: 'DANGER: Mixed voltage rails on the same bus without bidirectional MOSFET level translation.',
        },
        {
          busType: 'Power',
          busName: 'Dual Power System (5V USB + 3.3V LDO)',
          voltageLevel: '5.0V & 3.3V',
          masterDevice: 'ESP32 On-board AMS1117 / AP7361 LDO',
          slaveDevices: ['LCD Backlight & Logic (5V)', 'BME280 (3.3V)'],
          pullUpsPresent: false,
          statusNotes: 'Shared ground plane verified, but decoupling at BME280 breakout header is omitted.',
        },
      ],
      issues: [
        {
          id: 'iss-1',
          severity: 'CRITICAL',
          category: 'LOGIC_LEVEL_MISMATCH',
          title: '5V I2C Pull-Up Backfeeding into 3.3V ESP32 & BME280',
          description:
            'The PCF8574 LCD backpack operates at 5V and features on-board pull-up resistors connected to its 5V VCC pin. When connected directly to ESP32 GPIO21 (SDA) and GPIO22 (SCL), high-state voltage on the shared I2C bus sits at 4.9V–5.0V. The ESP32 datasheet specifies an Absolute Maximum Rating of VDD + 0.3V (approx 3.6V) for all GPIOs. This overvoltage condition will trigger ESD diode conduction and can cause permanent silicon latch-up or pin failure.',
          affectedComponents: ['ESP32 DevKit (U1)', '1602 LCD Backpack (DISP1)', 'BME280 (U2)'],
          affectedPins: ['ESP32 GPIO21', 'ESP32 GPIO22', 'BME280 SDA', 'BME280 SCL'],
          hazardRisk:
            'Gate oxide punch-through or thermal breakdown of internal ESD clamping diodes on ESP32 and BME280 silicon.',
          remediation:
            'Insert a 2-channel bidirectional I2C level shifter (e.g. BSS138 N-channel MOSFET pair or PCA9306 / TXS0102) between the 3.3V domain (ESP32/BME280) and 5.0V domain (LCD). Alternatively, desolder the 5V pull-up SMD resistors from the PCF8574 backpack and rely exclusively on 3.3V pull-ups.',
        },
        {
          id: 'iss-2',
          severity: 'HIGH',
          category: 'FLOATING_INPUT',
          title: 'Floating CSB Pin on BME280 Module',
          description:
            'The CSB (Chip Select Bar) pin on the BME280 breakout determines whether the chip communicates via SPI or I2C. Leaving CSB unconnected or floating allows high-impedance capacitive coupling to toggle the chip into SPI mode intermittently during motor or Wi-Fi RF transients, dropping the I2C bus.',
          affectedComponents: ['BME280 (U2)'],
          affectedPins: ['BME280 CSB Pin'],
          hazardRisk: 'Intermittent sensor disconnects, bus freeze (SDA held low), or sporadic NACK responses.',
          remediation: 'Tie BME280 CSB pin directly to the 3.3V rail to hard-lock the chip into I2C protocol mode.',
        },
        {
          id: 'iss-3',
          severity: 'MEDIUM',
          category: 'MISSING_DECOUPLING',
          title: 'Missing 100nF Ceramic Decoupling Capacitor at BME280 VDD',
          description:
            'There is no 100nF MLCC high-frequency decoupling capacitor located in close physical proximity to the BME280 power header on the breadboard. Long breadboard jumper leads add parasitic inductance (approx 10–20nH per wire), leading to voltage droops when the ESP32 Wi-Fi radio transmits burst currents (up to 240mA).',
          affectedComponents: ['BME280 (U2)'],
          affectedPins: ['BME280 VIN', 'BME280 GND'],
          hazardRisk: 'False temperature/pressure spikes, power-on reset brownout loops during Wi-Fi transmission bursts.',
          remediation: 'Place a 100nF (0.1µF) ceramic capacitor directly across the BME280 VIN and GND breadboard tie points.',
        },
        {
          id: 'iss-4',
          severity: 'LOW',
          category: 'BUS_CONTENTION',
          title: 'Address Verification Required for Secondary I2C Sensors',
          description:
            'Both the PCF8574 and BME280 allow hardware address selection via solder bridges (A0/A1/A2 and SDO). While the default addresses (0x27/0x3F and 0x76/0x77) do not collide, verifying their addresses via I2C scan is recommended prior to firmware deployment.',
          affectedComponents: ['PCF8574 Backpack', 'BME280'],
          affectedPins: ['I2C Bus Address Pins'],
          hazardRisk: 'Bus contention or device undetected if an unexpected variant chip (PCF8574A @ 0x3F) is installed.',
          remediation: 'Run a standard Arduino/ESP-IDF I2C bus scanner sketch to confirm 0x27 and 0x76 detection.',
        },
      ],
      multimeterChecklist: [
        {
          id: 'mm-1',
          stepNumber: 1,
          testPoint: 'TP1: System 3.3V Power Rail Regulation',
          probeRed: 'ESP32 3V3 Pin (Breakout Pin 2)',
          probeBlack: 'Breadboard Common GND Rail',
          meterMode: 'DC_VOLTAGE',
          expectedNominal: '3.25V – 3.35V DC',
          hazardThreshold: '> 3.60V (Overvoltage) or < 3.00V (Brownout)',
          purpose: 'Verify the on-board LDO regulator is functioning before placing sensors in active state.',
          status: 'PENDING',
          notes: 'Test while USB cable is plugged into workstation.',
        },
        {
          id: 'mm-2',
          stepNumber: 2,
          testPoint: 'TP2: 5V Supply Rail for LCD Backlight',
          probeRed: 'LCD Module VCC Pin',
          probeBlack: 'Breadboard Common GND Rail',
          meterMode: 'DC_VOLTAGE',
          expectedNominal: '4.75V – 5.25V DC',
          hazardThreshold: '> 5.50V (Overvoltage Hazard)',
          purpose: 'Ensure the 5V supply is adequate to drive the PCF8574 and LCD LED backlight.',
          status: 'PENDING',
        },
        {
          id: 'mm-3',
          stepNumber: 3,
          testPoint: 'TP3: I2C SDA Line Idle High Voltage (HAZARD CHECK)',
          probeRed: 'Breadboard Row 21 (ESP32 GPIO21 / SDA Net)',
          probeBlack: 'Breadboard Common GND Rail',
          meterMode: 'DC_VOLTAGE',
          expectedNominal: '3.20V – 3.35V DC (SAFE)',
          hazardThreshold: '>= 3.80V (CRITICAL: 5V Leaking to 3.3V ESP32)',
          purpose: 'Measure whether the 5V LCD pull-ups are pulling the SDA bus above safe ESP32 thresholds.',
          status: 'PENDING',
          notes: 'If multimeter reads ~4.9V, DO NOT RUN FIRMWARE. Level shifter required.',
        },
        {
          id: 'mm-4',
          stepNumber: 4,
          testPoint: 'TP4: I2C SCL Line Idle High Voltage (HAZARD CHECK)',
          probeRed: 'Breadboard Row 22 (ESP32 GPIO22 / SCL Net)',
          probeBlack: 'Breadboard Common GND Rail',
          meterMode: 'DC_VOLTAGE',
          expectedNominal: '3.20V – 3.35V DC (SAFE)',
          hazardThreshold: '>= 3.80V (CRITICAL: 5V Leaking to 3.3V ESP32)',
          purpose: 'Measure whether the SCL clock line is elevated to 5.0V by LCD pull-up resistors.',
          status: 'PENDING',
          notes: 'Same critical check as TP3.',
        },
        {
          id: 'mm-5',
          stepNumber: 5,
          testPoint: 'TP5: Unpowered Ground Continuity Check',
          probeRed: 'ESP32 GND Pin',
          probeBlack: 'LCD GND Pin & BME280 GND Pin',
          meterMode: 'CONTINUITY',
          expectedNominal: '< 0.5 Ω (Continuous Beep)',
          hazardThreshold: '> 2.0 Ω or Open Loop (Ground Loop / Floating)',
          purpose: 'Confirm all subsystem ground returns share a low-impedance common reference plane.',
          status: 'PENDING',
          notes: 'PERFORM WITH POWER DISCONNECTED (METER IN DIODE/BEEPER MODE).',
        },
        {
          id: 'mm-6',
          stepNumber: 6,
          testPoint: 'TP6: BME280 CSB Mode Select Voltage',
          probeRed: 'BME280 Header Pin CSB',
          probeBlack: 'Breadboard Common GND Rail',
          meterMode: 'DC_VOLTAGE',
          expectedNominal: '3.20V – 3.35V DC',
          hazardThreshold: '< 2.00V (Floating or Pulled Low into SPI mode)',
          purpose: 'Verify the CSB pin is held solidly High to guarantee I2C communication.',
          status: 'PENDING',
        },
      ],
    },
  },
  {
    id: 'arduino-spi-sd-card',
    title: 'Arduino Uno + 3.3V SPI SD Card Module',
    subtitle: '5.0V Logic • Direct 5V MOSI Overvoltage Hazard',
    targetLogic: '5.0V',
    category: 'SPI Interface',
    description:
      'Standard 5V Arduino Uno wired to a passive 3.3V SPI MicroSD card breakout. The 5V digital outputs (MOSI / SCK / CS) are connected directly to the SD card without a 74LVC125 buffer or resistor divider, exceeding the 3.6V maximum rating of SD Flash silicon.',
    tags: ['Arduino Uno', '5V Logic', 'MicroSD SPI', 'Overvoltage Hazard', 'Buffer Missing'],
    circuitSvg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full select-none">
      <defs>
        <pattern id="grid-sd" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="#334155" />
        </pattern>
      </defs>
      <rect x="20" y="20" width="760" height="440" rx="8" fill="#070a13" stroke="#1e293b" stroke-width="2"/>
      <rect x="35" y="35" width="730" height="410" fill="url(#grid-sd)"/>

      <!-- Arduino Uno Board Representation -->
      <rect x="70" y="100" width="220" height="260" rx="6" fill="#065f46" stroke="#10b981" stroke-width="2"/>
      <rect x="50" y="120" width="40" height="50" rx="3" fill="#64748b"/>
      <text x="110" y="140" fill="#a7f3d0" font-size="14" font-family="monospace" font-weight="bold">ARDUINO UNO R3</text>
      <text x="110" y="160" fill="#6ee7b7" font-size="11" font-family="monospace">5V ATmega328P</text>

      <!-- Uno Pinouts -->
      <circle cx="290" cy="170" r="4" fill="#ef4444"/><text x="235" y="174" fill="#fff" font-size="9" font-family="monospace">Pin 13 (SCK)</text>
      <circle cx="290" cy="190" r="4" fill="#f59e0b"/><text x="230" y="194" fill="#fff" font-size="9" font-family="monospace">Pin 11 (MOSI)</text>
      <circle cx="290" cy="210" r="4" fill="#06b6d4"/><text x="230" y="214" fill="#fff" font-size="9" font-family="monospace">Pin 12 (MISO)</text>
      <circle cx="290" cy="230" r="4" fill="#ec4899"/><text x="245" y="234" fill="#fff" font-size="9" font-family="monospace">Pin 10 (CS)</text>

      <!-- Danger Wires 5V directly to SD Module -->
      <path d="M 290 170 L 460 170 L 460 160 L 520 160" fill="none" stroke="#ef4444" stroke-width="2.5"/>
      <path d="M 290 190 L 470 190 L 470 180 L 520 180" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M 290 210 L 480 210 L 480 200 L 520 200" fill="none" stroke="#06b6d4" stroke-width="2.5"/>
      <path d="M 290 230 L 490 230 L 490 220 L 520 220" fill="none" stroke="#ec4899" stroke-width="2.5"/>

      <!-- SD Card Breakout Module -->
      <rect x="520" y="120" width="160" height="200" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <rect x="545" y="240" width="110" height="60" rx="3" fill="#0f172a" stroke="#475569"/>
      <text x="560" y="275" fill="#f8fafc" font-size="12" font-family="monospace">MicroSD</text>
      <text x="540" y="145" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">3.3V SD MODULE</text>
      <text x="540" y="158" fill="#94a3b8" font-size="8" font-family="sans-serif">Max Rating: 3.6V</text>

      <!-- Callout Badge -->
      <rect x="320" y="60" width="220" height="50" rx="4" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
      <text x="330" y="80" fill="#fca5a5" font-size="11" font-family="monospace" font-weight="bold">CRITICAL HAZARD</text>
      <text x="330" y="98" fill="#fecaca" font-size="9" font-family="sans-serif">5V MOSI/SCK driving 3.3V SD Silicon</text>
    </svg>`,
    presetAudit: {
      summary: {
        circuitName: 'Arduino Uno (5V) with Unbuffered 3.3V SPI MicroSD Card',
        targetLogic: '5.0V',
        overallIntegrity: 'HAZARDOUS',
        totalComponents: 2,
        issueCounts: {
          critical: 1,
          high: 1,
          medium: 1,
          low: 0,
        },
        briefAssessment:
          'CRITICAL OVERVOLTAGE: Arduino Uno outputs 5V TTL logic levels on SCK (Pin 13), MOSI (Pin 11), and CS (Pin 10). Standard SD flash cards are manufactured on 3.3V CMOS processes with an absolute maximum input rating of 3.6V. Feeding 5.0V directly destroys SD controller sectors.',
      },
      components: [
        {
          id: 'comp-uno',
          name: 'Arduino Uno R3 (ATmega328P)',
          designator: 'U1',
          type: 'microcontroller',
          nominalVoltage: '5.0V',
          busRoles: ['SPI', 'Power', 'GPIO'],
          pinsIdentified: [
            { pinName: 'Pin 13', connectedNet: 'SPI_SCK', signalType: '5V Push-Pull Output', voltageNominal: '5.0V' },
            { pinName: 'Pin 11', connectedNet: 'SPI_MOSI', signalType: '5V Push-Pull Output', voltageNominal: '5.0V' },
            { pinName: 'Pin 12', connectedNet: 'SPI_MISO', signalType: 'Input', voltageNominal: '3.3V (From SD)' },
            { pinName: 'Pin 10', connectedNet: 'SPI_CS', signalType: '5V Push-Pull Output', voltageNominal: '5.0V' },
          ],
        },
        {
          id: 'comp-sd',
          name: 'MicroSD Card Breakout Module',
          designator: 'MOD1',
          type: 'interface_ic',
          nominalVoltage: '3.3V',
          busRoles: ['SPI', 'Power'],
          pinsIdentified: [
            { pinName: 'VCC', connectedNet: '3V3_RAIL', signalType: 'Power Input', voltageNominal: '3.3V' },
            { pinName: 'SCK', connectedNet: 'SPI_SCK', signalType: 'Clock Input', voltageNominal: '3.3V MAX (Receiving 5.0V!)' },
            { pinName: 'MOSI', connectedNet: 'SPI_MOSI', signalType: 'Data Input', voltageNominal: '3.3V MAX (Receiving 5.0V!)' },
            { pinName: 'MISO', connectedNet: 'SPI_MISO', signalType: 'Data Output', voltageNominal: '3.3V' },
          ],
        },
      ],
      buses: [
        {
          busType: 'SPI',
          busName: 'Hardware SPI Bus',
          voltageLevel: '5.0V Out / 3.3V Expected',
          masterDevice: 'Arduino Uno',
          slaveDevices: ['MicroSD Card'],
          pullUpsPresent: false,
          statusNotes: 'Direct connection lacks level shifting buffer.',
        },
      ],
      issues: [
        {
          id: 'sd-iss-1',
          severity: 'CRITICAL',
          category: 'LOGIC_LEVEL_MISMATCH',
          title: '5V Logic Level Driving 3.3V MicroSD Card Inputs',
          description:
            'ATmega328P GPIO outputs push-pull high voltages at ~4.8V–5.0V when powered at 5V. SD memory cards require 2.7V–3.6V signaling. Overvoltage on MOSI, SCK, and CS permanently ruins the card.',
          affectedComponents: ['Arduino Uno', 'MicroSD Breakout'],
          affectedPins: ['Pin 13 (SCK)', 'Pin 11 (MOSI)', 'Pin 10 (CS)'],
          hazardRisk: 'Permanent SD card memory corruption and thermal silicon degradation.',
          remediation:
            'Use a 74LVC125 / 74AHCT125 level converter buffer IC, or install a 2:1 resistive divider (2.2kΩ and 3.3kΩ) on SCK, MOSI, and CS lines.',
        },
        {
          id: 'sd-iss-2',
          severity: 'HIGH',
          category: 'POWER_HAZARD',
          title: '3.3V Regulator Current Limit Exhaustion on Arduino Uno',
          description:
            'The built-in 3.3V output on the Arduino Uno is supplied by the LP2985 LDO which is limited to ~150mA. SD card write operations trigger instant current spikes up to 200mA–250mA.',
          affectedComponents: ['Arduino Uno LP2985 LDO'],
          affectedPins: ['3.3V Rail'],
          hazardRisk: 'Thermal shutdown of 3.3V rail causing microcontroller resets and file system corruption.',
          remediation: 'Power the SD card VDD with an external dedicated 3.3V regulator capable of at least 300mA.',
        },
      ],
      multimeterChecklist: [
        {
          id: 'sd-mm-1',
          stepNumber: 1,
          testPoint: 'TP1: MicroSD VDD Rail Voltage',
          probeRed: 'SD Breakout VDD Pin',
          probeBlack: 'Arduino GND',
          meterMode: 'DC_VOLTAGE',
          expectedNominal: '3.25V – 3.35V DC',
          hazardThreshold: '> 3.60V or < 2.90V',
          purpose: 'Verify power rail is within SD card specification.',
          status: 'PENDING',
        },
        {
          id: 'sd-mm-2',
          stepNumber: 2,
          testPoint: 'TP2: MOSI Signal Line High-Level Voltage',
          probeRed: 'SD Breakout MOSI Pin',
          probeBlack: 'Arduino GND',
          meterMode: 'DC_VOLTAGE',
          expectedNominal: '3.10V – 3.35V DC (With Level Shifter)',
          hazardThreshold: '>= 4.50V (CRITICAL 5V OVERVOLTAGE)',
          purpose: 'Confirm that 5V MOSI output is properly attenuated before reaching the SD card.',
          status: 'PENDING',
        },
      ],
    },
  },
  {
    id: 'esp32-relay-kickback',
    title: 'ESP32 + 5V Coil Relay Module',
    subtitle: '3.3V Logic • Inductive Kickback & Driver Bug',
    targetLogic: '3.3V',
    category: 'Inductive / Power',
    description:
      'ESP32 GPIO directly driving a 5V electromagnetic relay coil without an optocoupler/transistor driver stage and lacking a 1N4007 flyback suppression diode. De-energizing the relay coil generates high-voltage inductive kickback voltage spikes (>50V).',
    tags: ['ESP32', '5V Relay', 'Missing Flyback Diode', 'Inductive Kickback', 'Overcurrent GPIO'],
    circuitSvg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full select-none">
      <defs>
        <pattern id="grid-relay" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="#334155" />
        </pattern>
      </defs>
      <rect x="20" y="20" width="760" height="440" rx="8" fill="#090d16" stroke="#1e293b" stroke-width="2"/>
      <rect x="35" y="35" width="730" height="410" fill="url(#grid-relay)"/>

      <!-- ESP32 -->
      <rect x="70" y="120" width="180" height="240" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="110" y="180" fill="#f8fafc" font-size="13" font-family="monospace" font-weight="bold">ESP32 DEVKIT</text>
      <circle cx="250" cy="220" r="4" fill="#f59e0b"/>
      <text x="175" y="224" fill="#f59e0b" font-size="9" font-family="monospace">GPIO26 (Relay)</text>

      <!-- Relay Module -->
      <rect x="480" y="120" width="220" height="240" rx="6" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
      <text x="520" y="160" fill="#bfdbfe" font-size="14" font-family="monospace" font-weight="bold">5V POWER RELAY</text>
      <text x="520" y="180" fill="#93c5fd" font-size="10" font-family="sans-serif">Coil Resistance: 70 Ω</text>
      <text x="520" y="195" fill="#f87171" font-size="10" font-family="sans-serif">Coil Current: ~72 mA</text>

      <!-- Wire direct connection -->
      <path d="M 250 220 L 480 220" fill="none" stroke="#f59e0b" stroke-width="3"/>

      <!-- Kickback Spark Warning -->
      <polygon points="360,180 375,150 365,150 380,120 355,160 365,160" fill="#ef4444"/>
      <rect x="300" y="60" width="220" height="46" rx="4" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
      <text x="310" y="78" fill="#fca5a5" font-size="10" font-family="monospace" font-weight="bold">CRITICAL HAZARD</text>
      <text x="310" y="94" fill="#fecaca" font-size="9" font-family="sans-serif">Missing Flyback Clamp & Overcurrent</text>
    </svg>`,
    presetAudit: {
      summary: {
        circuitName: 'ESP32 (3.3V) Direct 5V Relay Coil Drive without Flyback Suppression',
        targetLogic: '3.3V',
        overallIntegrity: 'HAZARDOUS',
        totalComponents: 2,
        issueCounts: {
          critical: 2,
          high: 1,
          medium: 0,
          low: 0,
        },
        briefAssessment:
          'FATAL HARDWARE DESIGN: ESP32 GPIO26 is wired directly to a 5V relay coil. Drawing 72mA from a single GPIO exceeds the 40mA absolute maximum GPIO drive rating. Furthermore, when the coil collapses, an inductive kickback voltage transient of -60V to +80V will blast through the internal output FETs.',
      },
      components: [
        {
          id: 'comp-esp-rel',
          name: 'ESP32 DevKit V1',
          designator: 'U1',
          type: 'microcontroller',
          nominalVoltage: '3.3V',
          busRoles: ['GPIO', 'Power'],
          pinsIdentified: [
            { pinName: 'GPIO26', connectedNet: 'RELAY_COIL_HIGH', signalType: 'Output', voltageNominal: '3.3V (Overloaded)' },
          ],
        },
        {
          id: 'comp-relay',
          name: 'Songle SRD-05VDC-SL-C Relay',
          designator: 'K1',
          type: 'actuator',
          nominalVoltage: '5.0V',
          busRoles: ['Power'],
          pinsIdentified: [
            { pinName: 'Coil+', connectedNet: 'RELAY_COIL_HIGH', signalType: 'Inductive Load', voltageNominal: '5.0V' },
            { pinName: 'Coil-', connectedNet: 'GND_NET', signalType: 'Ground', voltageNominal: '0.0V' },
          ],
        },
      ],
      buses: [],
      issues: [
        {
          id: 'rel-iss-1',
          severity: 'CRITICAL',
          category: 'INDUCTIVE_KICKBACK',
          title: 'Missing Flyback Snubber Diode Across Relay Coil',
          description:
            'Inductors resist changes in electrical current (V = L * di/dt). When the GPIO toggles low to switch off the relay coil, the magnetic field collapses instantly, producing high-voltage negative spike pulses (-50V to -100V) that destroy microcontroller silicon.',
          affectedComponents: ['ESP32 (U1)', 'Relay Coil (K1)'],
          affectedPins: ['GPIO26'],
          hazardRisk: 'Immediate destruction of ESP32 GPIO26 driver transistors and internal bus flash reboot.',
          remediation:
            'Install an anti-parallel 1N4148 or 1N4007 flyback freewheeling diode across the coil (cathode to VCC, anode to switched side).',
        },
        {
          id: 'rel-iss-2',
          severity: 'CRITICAL',
          category: 'MISSING_CURRENT_LIMITER',
          title: 'GPIO Current Sourcing Exceeds 40mA Absolute Maximum Limit',
          description:
            'A 5V relay coil has DC resistance of ~70Ω. Even at 3.3V, I = 3.3V / 70Ω ≈ 47mA, exceeding the ESP32 absolute maximum per-pin limit of 40mA (recommended max 20mA).',
          affectedComponents: ['ESP32 (U1)'],
          affectedPins: ['GPIO26'],
          hazardRisk: 'Thermal electromigration failure of bond wires inside the ESP32 package.',
          remediation: 'Drive the relay using a 2N2222 / 2N3904 NPN transistor or 2N7000 N-channel MOSFET with a 1kΩ base resistor.',
        },
      ],
      multimeterChecklist: [
        {
          id: 'rel-mm-1',
          stepNumber: 1,
          testPoint: 'TP1: Relay Coil DC Resistance',
          probeRed: 'Relay Coil Pin 1',
          probeBlack: 'Relay Coil Pin 2',
          meterMode: 'RESISTANCE',
          expectedNominal: '70 Ω ± 10%',
          hazardThreshold: '< 10 Ω (Shorted Coil)',
          purpose: 'Verify coil impedance to calculate required transistor base/gate drive.',
          status: 'PENDING',
        },
        {
          id: 'rel-mm-2',
          stepNumber: 2,
          testPoint: 'TP2: Flyback Diode Continuity & Polarity',
          probeRed: 'Coil Cathode (5V Rail)',
          probeBlack: 'Coil Anode (Switched Node)',
          meterMode: 'DIODE_DROP',
          expectedNominal: '0.55V – 0.70V Forward Bias',
          hazardThreshold: 'Open Loop (Diode Missing) or 0.00V (Shorted Diode)',
          purpose: 'Confirm presence and correct orientation of snubber diode.',
          status: 'PENDING',
        },
      ],
    },
  },
];
