/**
 * CircuitLint Vision — Type Definitions
 * Structured representations for circuit audits, components, electrical faults, and bench tests.
 */

export type LogicLevel = '3.3V' | '5.0V';

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IssueCategory =
  | 'LOGIC_LEVEL_MISMATCH'
  | 'FLOATING_INPUT'
  | 'MISSING_DECOUPLING'
  | 'MISSING_CURRENT_LIMITER'
  | 'BUS_CONTENTION'
  | 'POWER_HAZARD'
  | 'INDUCTIVE_KICKBACK';

export type BusType = 'I2C' | 'SPI' | 'UART' | 'Power' | 'GPIO' | 'Analog' | 'PWM';

export interface PinConnection {
  pinName: string;
  connectedNet: string;
  signalType: string;
  voltageNominal: string;
}

export interface IdentifiedComponent {
  id: string;
  name: string;
  designator: string; // e.g. U1, U2, C1, R1
  type: 'microcontroller' | 'sensor' | 'display' | 'actuator' | 'passive' | 'power_regulator' | 'interface_ic';
  package?: string; // e.g. DIP-8, QFN-32, Module, Breadboard Breakout
  nominalVoltage: string; // e.g. "3.3V" or "5.0V"
  pinsIdentified: PinConnection[];
  busRoles: BusType[];
  description?: string;
}

export interface BusConnection {
  busType: 'I2C' | 'SPI' | 'UART' | 'Power';
  busName: string;
  voltageLevel: string;
  masterDevice: string;
  slaveDevices: string[];
  pullUpsPresent: boolean;
  pullUpValue?: string;
  statusNotes?: string;
}

export interface HardwareIssue {
  id: string;
  severity: IssueSeverity;
  category: IssueCategory;
  title: string;
  description: string;
  affectedComponents: string[];
  affectedPins: string[];
  hazardRisk: string; // Electrical consequences (e.g. oxide breakdown, latchup, voltage brownout)
  remediation: string; // Concrete fix (e.g. "Add bidirectional I2C level shifter BSS138")
}

export type MultimeterMode = 'DC_VOLTAGE' | 'CONTINUITY' | 'RESISTANCE' | 'DIODE_DROP';

export type VerificationStatus = 'PENDING' | 'PASSED' | 'FAILED' | 'SKIPPED';

export interface MultimeterCheckItem {
  id: string;
  stepNumber: number;
  testPoint: string; // e.g. "TP1: MCU VDD to GND"
  probeRed: string; // e.g. "ESP32 3V3 Pin (Header 1, Pin 2)"
  probeBlack: string; // e.g. "Common Ground Rail"
  meterMode: MultimeterMode;
  expectedNominal: string; // e.g. "3.25V - 3.35V"
  hazardThreshold: string; // e.g. "> 3.60V (Overvoltage Hazard)"
  purpose: string; // Reason for this test step
  status: VerificationStatus;
  measuredValue?: string;
  notes?: string;
}

export interface CircuitAudit {
  summary: {
    circuitName: string;
    targetLogic: LogicLevel;
    overallIntegrity: 'HAZARDOUS' | 'WARNING' | 'VERIFIED';
    totalComponents: number;
    issueCounts: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    briefAssessment: string;
  };
  components: IdentifiedComponent[];
  buses: BusConnection[];
  issues: HardwareIssue[];
  multimeterChecklist: MultimeterCheckItem[];
}

export interface CircuitPreset {
  id: string;
  title: string;
  subtitle: string;
  targetLogic: LogicLevel;
  category: 'Multi-Sensor I2C' | 'SPI Interface' | 'Inductive / Power';
  description: string;
  tags: string[];
  circuitSvg: string; // Inlined vector visualization of the circuit wiring
  presetAudit: CircuitAudit;
}
