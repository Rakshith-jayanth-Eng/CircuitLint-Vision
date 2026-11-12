import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CIRCUIT_PRESETS } from './src/data/presets.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for JSON payloads (allow up to 20mb for high-res breadboard / schematic images)
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// JSON Schema definition for structured hardware circuit audit
const circuitAuditSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        circuitName: { type: Type.STRING },
        targetLogic: { type: Type.STRING },
        overallIntegrity: { type: Type.STRING },
        totalComponents: { type: Type.INTEGER },
        issueCounts: {
          type: Type.OBJECT,
          properties: {
            critical: { type: Type.INTEGER },
            high: { type: Type.INTEGER },
            medium: { type: Type.INTEGER },
            low: { type: Type.INTEGER },
          },
          required: ['critical', 'high', 'medium', 'low'],
        },
        briefAssessment: { type: Type.STRING },
      },
      required: ['circuitName', 'targetLogic', 'overallIntegrity', 'totalComponents', 'issueCounts', 'briefAssessment'],
    },
    components: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          designator: { type: Type.STRING },
          type: { type: Type.STRING },
          package: { type: Type.STRING },
          nominalVoltage: { type: Type.STRING },
          busRoles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          description: { type: Type.STRING },
          pinsIdentified: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pinName: { type: Type.STRING },
                connectedNet: { type: Type.STRING },
                signalType: { type: Type.STRING },
                voltageNominal: { type: Type.STRING },
              },
              required: ['pinName', 'connectedNet', 'signalType', 'voltageNominal'],
            },
          },
        },
        required: ['id', 'name', 'designator', 'type', 'nominalVoltage', 'pinsIdentified', 'busRoles'],
      },
    },
    buses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          busType: { type: Type.STRING },
          busName: { type: Type.STRING },
          voltageLevel: { type: Type.STRING },
          masterDevice: { type: Type.STRING },
          slaveDevices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          pullUpsPresent: { type: Type.BOOLEAN },
          pullUpValue: { type: Type.STRING },
          statusNotes: { type: Type.STRING },
        },
        required: ['busType', 'busName', 'voltageLevel', 'masterDevice', 'slaveDevices', 'pullUpsPresent'],
      },
    },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          severity: { type: Type.STRING },
          category: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          affectedComponents: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          affectedPins: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          hazardRisk: { type: Type.STRING },
          remediation: { type: Type.STRING },
        },
        required: ['id', 'severity', 'category', 'title', 'description', 'affectedComponents', 'affectedPins', 'hazardRisk', 'remediation'],
      },
    },
    multimeterChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          stepNumber: { type: Type.INTEGER },
          testPoint: { type: Type.STRING },
          probeRed: { type: Type.STRING },
          probeBlack: { type: Type.STRING },
          meterMode: { type: Type.STRING },
          expectedNominal: { type: Type.STRING },
          hazardThreshold: { type: Type.STRING },
          purpose: { type: Type.STRING },
          status: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ['id', 'stepNumber', 'testPoint', 'probeRed', 'probeBlack', 'meterMode', 'expectedNominal', 'hazardThreshold', 'purpose', 'status'],
      },
    },
  },
  required: ['summary', 'components', 'buses', 'issues', 'multimeterChecklist'],
};

// API: Check health & environment
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Get available presets
app.get('/api/presets', (_req, res) => {
  res.json({ presets: CIRCUIT_PRESETS });
});

// API: Run Circuit Audit with Gemini 3.8 Flash
app.post('/api/audit', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', logicLevel = '3.3V', contextNotes = '', presetId } = req.body;

    // If an existing preset is selected and no image is uploaded, return preset audit immediately
    if (presetId && (!imageBase64 || imageBase64.length < 50)) {
      const preset = CIRCUIT_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        return res.json({
          source: 'preset',
          audit: preset.presetAudit,
        });
      }
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 payload or preset identifier' });
    }

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const systemPrompt = `You are CircuitLint Vision, a senior embedded hardware reliability engineer and master lab bench auditor.
Your job is to rigorously inspect breadboard circuit photos, schematic captures, or logic analyzer pin wiring.
The target system board logic is: ${logicLevel}.
(If 3.3V: absolute maximum GPIO input is 3.6V. 5V logic inputs from LCDs, sensors, or 5V pull-ups represent severe gate oxide destruction hazards!)
(If 5.0V: standard TTL/CMOS, check that 3.3V inputs satisfy Vih thresholds (typically >= 3.0V) and that 3.3V peripherals are not overdriven by 5V outputs).

Analyze the circuit image and generate a structured audit containing:
1. Identified Components: microcontrollers, display modules, sensors, actuators, ICs, passives. Trace their visible or standard breakout pin connections.
2. Bus Connections: I2C, SPI, UART, and power rails. Explicitly detect pull-up resistor voltage tie points and any voltage conflict across shared lines.
3. Severity-Ranked Hardware Issues:
   - CRITICAL: Logic level mismatches (e.g. 5V line into 3.3V GPIO), reverse polarity, direct VCC-to-GND shorts, missing flyback snubber diodes across inductive relay coils, or GPIO overcurrent (>20-40mA).
   - HIGH: Missing current-limiting resistors on LEDs, missing I2C pull-up resistors (4.7k-10k), floating essential control pins (e.g. RESET, CHIP SELECT).
   - MEDIUM: Missing 100nF decoupling capacitors near IC VDD/GND pins, high-impedance analog trace noise.
   - LOW: Address ambiguity, wiring length, aesthetic routing.
4. Multimeter Verification Checklist:
   - Realistic, sequential bench test steps with explicit Red Probe and Black Probe placement.
   - Specify meterMode: DC_VOLTAGE, CONTINUITY, RESISTANCE, or DIODE_DROP.
   - Provide exact nominal expected values (e.g. "3.25V - 3.35V") and dangerous threshold conditions (e.g. ">= 3.80V Overvoltage").
   - Set status to "PENDING".

User contextual notes: ${contextNotes || 'None provided'}.
Ensure strictly typed, professional engineering notation with accurate component pinout terminology.`;

    const contents = {
      parts: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        },
        {
          text: `Perform a comprehensive electrical audit on this circuit image for a ${logicLevel} logic target. Output the audit in valid structured JSON matching the provided schema.`,
        },
      ],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: circuitAuditSchema,
      },
    });

    const rawJson = response.text?.trim() || '{}';
    let parsedAudit;
    try {
      parsedAudit = JSON.parse(rawJson);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', parseErr, rawJson);
      throw new Error('Gemini model output could not be parsed as valid JSON');
    }

    return res.json({
      source: 'gemini-3.8-flash',
      audit: parsedAudit,
    });
  } catch (error: any) {
    console.error('Error during CircuitLint audit execution:', error);

    // If Gemini fails due to missing API key or transient quota, check if a preset can save the session
    const { presetId } = req.body || {};
    if (presetId) {
      const fallbackPreset = CIRCUIT_PRESETS.find((p) => p.id === presetId);
      if (fallbackPreset) {
        return res.json({
          source: 'preset-fallback',
          audit: fallbackPreset.presetAudit,
          warning: 'Live AI inspection encountered an issue; returned verified engineering benchmark preset.',
        });
      }
    }

    return res.status(500).json({
      error: error.message || 'Circuit analysis failed',
      details: error.status || 'Internal Error',
    });
  }
});

// Start Express server and attach Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CircuitLint Vision] Bench server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
