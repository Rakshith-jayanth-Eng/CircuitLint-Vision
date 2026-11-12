import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Code2,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';
import { BenchHeader } from './components/BenchHeader';
import { CircuitViewer } from './components/CircuitViewer';
import { IssuesInspector } from './components/IssuesInspector';
import { ComponentNetlist } from './components/ComponentNetlist';
import { MultimeterChecklist } from './components/MultimeterChecklist';
import { ReportExportModal } from './components/ReportExportModal';
import { CIRCUIT_PRESETS } from './data/presets';
import { CircuitPreset, CircuitAudit, LogicLevel, VerificationStatus } from './types/circuit';

export default function App() {
  // Pre-load the user's confirmed default preset: ESP32 + 5V LCD bug demo
  const [currentPreset, setCurrentPreset] = useState<CircuitPreset | null>(CIRCUIT_PRESETS[0]);
  const [logicLevel, setLogicLevel] = useState<LogicLevel>(CIRCUIT_PRESETS[0].targetLogic);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/jpeg');
  const [currentAudit, setCurrentAudit] = useState<CircuitAudit>(CIRCUIT_PRESETS[0].presetAudit);
  const [activeTab, setActiveTab] = useState<'ISSUES' | 'COMPONENTS' | 'MULTIMETER' | 'RAW_JSON'>('ISSUES');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Handle Preset Selection
  const handlePresetSelect = (preset: CircuitPreset) => {
    setCurrentPreset(preset);
    setUploadedImage(null);
    setLogicLevel(preset.targetLogic);
    setCurrentAudit(preset.presetAudit);
    setErrorMessage(null);
  };

  // Handle Custom Image Upload
  const handleImageUpload = (base64: string, mimeType: string, _fileName: string) => {
    setUploadedImage(base64);
    setUploadedMimeType(mimeType);
    setCurrentPreset(null);
    setErrorMessage(null);
  };

  // Run Circuit Audit via Express backend (/api/audit)
  const handleRunAudit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        logicLevel,
      };

      if (uploadedImage) {
        payload.imageBase64 = uploadedImage;
        payload.mimeType = uploadedMimeType;
      } else if (currentPreset) {
        payload.presetId = currentPreset.id;
      }

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Circuit audit inspection failed');
      }

      if (data.audit) {
        setCurrentAudit(data.audit);
      }
    } catch (err: any) {
      console.error('Audit execution error:', err);
      setErrorMessage(err.message || 'Inspection failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Workbench to fresh default state
  const handleReset = () => {
    handlePresetSelect(CIRCUIT_PRESETS[0]);
  };

  // Multimeter Verification Status Update
  const handleMultimeterStatusChange = (
    itemId: string,
    status: VerificationStatus,
    measuredValue?: string
  ) => {
    setCurrentAudit((prev) => {
      const updatedList = prev.multimeterChecklist.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status,
            measuredValue: measuredValue ?? item.measuredValue,
          };
        }
        return item;
      });

      // Recalculate integrity
      const hasFailed = updatedList.some((i) => i.status === 'FAILED');
      const allPassed = updatedList.length > 0 && updatedList.every((i) => i.status === 'PASSED' || i.status === 'SKIPPED');

      return {
        ...prev,
        summary: {
          ...prev.summary,
          overallIntegrity: hasFailed ? 'HAZARDOUS' : allPassed ? 'VERIFIED' : prev.summary.overallIntegrity,
        },
        multimeterChecklist: updatedList,
      };
    });
  };

  const handleResetMultimeterAll = () => {
    setCurrentAudit((prev) => ({
      ...prev,
      multimeterChecklist: prev.multimeterChecklist.map((item) => ({
        ...item,
        status: 'PENDING',
        measuredValue: undefined,
      })),
    }));
  };

  const handleSimulateAllPassed = () => {
    setCurrentAudit((prev) => ({
      ...prev,
      summary: {
        ...prev.summary,
        overallIntegrity: 'VERIFIED',
      },
      multimeterChecklist: prev.multimeterChecklist.map((item) => ({
        ...item,
        status: 'PASSED',
        measuredValue: item.expectedNominal.split(' ')[0], // Set first token as nominal value
      })),
    }));
  };

  const getIntegrityBadge = () => {
    const status = currentAudit.summary.overallIntegrity;
    if (status === 'HAZARDOUS') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-mono font-semibold">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>STATUS: HAZARDOUS FAULT DETECTED</span>
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 text-xs font-mono font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>STATUS: WARNING / ADVISORY</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-mono font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>STATUS: BENCH VERIFIED SAFE</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Bench Top Navigation Bar */}
      <BenchHeader
        logicLevel={logicLevel}
        onLogicLevelChange={setLogicLevel}
        onRunAudit={handleRunAudit}
        onReset={handleReset}
        onLoadPreset={(id) => {
          const p = CIRCUIT_PRESETS.find((item) => item.id === id);
          if (p) handlePresetSelect(p);
        }}
        onOpenReport={() => setIsReportModalOpen(true)}
        isLoading={isLoading}
        hasAuditData={Boolean(currentAudit)}
      />

      {/* Main Bench Workspace */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto flex flex-col gap-5">
        {/* Circuit Assessment & Integrity Banner */}
        <section className="p-4 rounded-xl bg-[#0b0f19] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-3 mb-1.5">
              {getIntegrityBadge()}
              <span className="text-xs font-mono text-slate-400">
                Circuit Target: <strong className="text-slate-200">{currentAudit.summary.circuitName}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentAudit.summary.briefAssessment}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-[#080c14] border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block">COMPONENTS</span>
              <span className="text-sm font-bold text-slate-200">{currentAudit.components.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-center">
              <span className="text-[10px] text-rose-400 block">CRITICAL</span>
              <span className="text-sm font-bold text-rose-300">{currentAudit.summary.issueCounts.critical}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-center">
              <span className="text-[10px] text-amber-400 block">HIGH</span>
              <span className="text-sm font-bold text-amber-300">{currentAudit.summary.issueCounts.high}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-sky-950/20 border border-sky-900/40 text-center">
              <span className="text-[10px] text-sky-400 block">MEDIUM</span>
              <span className="text-sm font-bold text-sky-300">{currentAudit.summary.issueCounts.medium}</span>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-xs text-rose-200 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 underline text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
          {/* Left Column: Visual Circuit Stage & Image Inspector (5 cols) */}
          <div className="lg:col-span-5 h-[620px] sticky top-4">
            <CircuitViewer
              currentPreset={currentPreset}
              uploadedImage={uploadedImage}
              onPresetSelect={handlePresetSelect}
              onImageUpload={handleImageUpload}
              logicLevel={logicLevel}
              onLogicLevelChange={setLogicLevel}
            />
          </div>

          {/* Right Column: Tabbed Diagnostic Stage (7 cols) */}
          <div className="lg:col-span-7 h-[620px] flex flex-col bg-[#0b0e17] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {/* Stage Tab Navigation */}
            <div className="flex items-center gap-1 p-2 bg-[#0d121f] border-b border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('ISSUES')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'ISSUES'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Hardware Issues ({currentAudit.issues.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('COMPONENTS')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'COMPONENTS'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Components & Netlist ({currentAudit.components.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('MULTIMETER')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'MULTIMETER'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multimeter Verification ({currentAudit.multimeterChecklist.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('RAW_JSON')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'RAW_JSON'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Structured JSON</span>
              </button>
            </div>

            {/* Tab View Container */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'ISSUES' && <IssuesInspector issues={currentAudit.issues} />}

              {activeTab === 'COMPONENTS' && (
                <ComponentNetlist
                  components={currentAudit.components}
                  buses={currentAudit.buses}
                />
              )}

              {activeTab === 'MULTIMETER' && (
                <MultimeterChecklist
                  items={currentAudit.multimeterChecklist}
                  onStatusChange={handleMultimeterStatusChange}
                  onResetAll={handleResetMultimeterAll}
                  onSimulateAllPassed={handleSimulateAllPassed}
                />
              )}

              {activeTab === 'RAW_JSON' && (
                <div className="h-full p-4 overflow-y-auto bg-[#07090e]">
                  <pre className="p-4 rounded-lg bg-[#0b0e17] border border-slate-800 text-xs font-mono text-cyan-300/90 whitespace-pre-wrap leading-relaxed select-all">
                    {JSON.stringify(currentAudit, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Export Report Modal */}
      <ReportExportModal
        audit={currentAudit}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto px-6 py-3 bg-[#080b12] border-t border-slate-900 text-slate-500 text-xs flex flex-wrap items-center justify-between gap-4 font-mono">
        <div>
          <span>CircuitLint Vision v1.0.0</span>
          <span className="mx-2">·</span>
          <span>Engineered for 3.3V / 5.0V Mixed-Signal Embedded Benches</span>
        </div>
        <div>
          <span>Powered by Gemini 3.8 Flash Multimodal Vision</span>
        </div>
      </footer>
    </div>
  );
}
