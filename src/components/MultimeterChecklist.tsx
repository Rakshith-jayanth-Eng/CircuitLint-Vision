import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  Zap,
  Gauge,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { MultimeterCheckItem, VerificationStatus, MultimeterMode } from '../types/circuit';

interface MultimeterChecklistProps {
  items: MultimeterCheckItem[];
  onStatusChange: (itemId: string, status: VerificationStatus, measuredValue?: string) => void;
  onResetAll: () => void;
  onSimulateAllPassed: () => void;
}

export const MultimeterChecklist: React.FC<MultimeterChecklistProps> = ({
  items,
  onStatusChange,
  onResetAll,
  onSimulateAllPassed,
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [measuredInputs, setMeasuredInputs] = useState<Record<string, string>>({});

  const total = items.length;
  const passed = items.filter((i) => i.status === 'PASSED').length;
  const failed = items.filter((i) => i.status === 'FAILED').length;
  const skipped = items.filter((i) => i.status === 'SKIPPED').length;
  const pending = items.filter((i) => i.status === 'PENDING').length;

  // Compute live bench health score (0 to 100%)
  const evaluatedCount = passed + failed;
  const healthScore = evaluatedCount === 0 ? 0 : Math.round((passed / evaluatedCount) * 100);

  const getScoreColor = () => {
    if (failed > 0) return 'text-rose-400';
    if (healthScore >= 90) return 'text-emerald-400';
    if (healthScore >= 50) return 'text-amber-400';
    return 'text-slate-400';
  };

  const getProgressBarColor = () => {
    if (failed > 0) return 'bg-rose-500';
    if (healthScore >= 90) return 'bg-emerald-500';
    if (healthScore >= 50) return 'bg-amber-500';
    return 'bg-cyan-500';
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const getModeBadge = (mode: MultimeterMode) => {
    switch (mode) {
      case 'DC_VOLTAGE':
        return {
          label: 'DC Voltage (V⎓)',
          icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
          color: 'bg-amber-950/60 border-amber-800 text-amber-300',
        };
      case 'CONTINUITY':
        return {
          label: 'Continuity (Beeper)',
          icon: <Volume2 className="w-3.5 h-3.5 text-cyan-400" />,
          color: 'bg-cyan-950/60 border-cyan-800 text-cyan-300',
        };
      case 'RESISTANCE':
        return {
          label: 'Resistance (Ω)',
          icon: <Activity className="w-3.5 h-3.5 text-purple-400" />,
          color: 'bg-purple-950/60 border-purple-800 text-purple-300',
        };
      case 'DIODE_DROP':
        return {
          label: 'Diode Test (V)',
          icon: <Gauge className="w-3.5 h-3.5 text-emerald-400" />,
          color: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
        };
      default:
        return {
          label: 'Multimeter',
          icon: <Activity className="w-3.5 h-3.5 text-slate-400" />,
          color: 'bg-slate-900 border-slate-700 text-slate-300',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e17] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Live Health Score & Bench Meter Header */}
      <div className="p-4 bg-[#0f1523] border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-100">
                Interactive Multimeter Verification Guide
              </span>
              <span className="text-xs font-mono text-slate-500">
                ({passed}/{total} verified)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Probe hardware test points sequentially with power disconnected or active to ensure safe bench state.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateAllPassed}
              className="px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800 rounded-md transition-colors"
            >
              Simulate All Passed
            </button>
            <button
              onClick={onResetAll}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              title="Reset All Probe Results"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Bench Health Score Gauge Card */}
        <div className="p-3 rounded-lg bg-[#080c14] border border-slate-800/80">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 text-xs font-mono">
              {failed > 0 ? (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              ) : healthScore === 100 ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <Gauge className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-slate-400">Bench Verification Integrity:</span>
              <span className={`font-bold text-sm ${getScoreColor()}`}>
                {evaluatedCount === 0 ? 'PENDING' : `${healthScore}%`}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-emerald-400">{passed} Passed</span>
              <span className="text-rose-400">{failed} Failed</span>
              <span className="text-slate-400">{pending} Pending</span>
              {skipped > 0 && <span className="text-slate-500">{skipped} Skipped</span>}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${evaluatedCount === 0 ? 0 : healthScore}%` }}
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/60">
          <span className="text-[11px] font-mono text-slate-500 mr-1">Filter:</span>
          {['ALL', 'PENDING', 'PASSED', 'FAILED', 'SKIPPED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                filter === st ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Test Steps */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {filteredItems.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No tests in this filter.</p>
        ) : (
          filteredItems.map((item) => {
            const mode = getModeBadge(item.meterMode);
            const isPassed = item.status === 'PASSED';
            const isFailed = item.status === 'FAILED';
            const isSkipped = item.status === 'SKIPPED';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg bg-[#0e1422] border transition-all ${
                  isPassed
                    ? 'border-emerald-800/60 bg-emerald-950/10'
                    : isFailed
                    ? 'border-rose-800/70 bg-rose-950/20 shadow-md'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Step Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-400 font-semibold">
                      Step {String(item.stepNumber).padStart(2, '0')}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${mode.color}`}
                    >
                      {mode.icon}
                      <span>{mode.label}</span>
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5">
                    {isPassed && (
                      <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PASSED
                      </span>
                    )}
                    {isFailed && (
                      <span className="flex items-center gap-1 text-xs font-mono text-rose-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        FAILED
                      </span>
                    )}
                    {isSkipped && (
                      <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                        SKIPPED
                      </span>
                    )}
                  </div>
                </div>

                {/* Test Point Title & Purpose */}
                <h4 className="text-sm font-bold text-slate-100 mb-1">{item.testPoint}</h4>
                <p className="text-xs text-slate-400 mb-3">{item.purpose}</p>

                {/* Probe Placement Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded bg-[#080c14] border border-slate-800/80 mb-3 text-xs font-mono">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1 shadow-sm shadow-rose-500/50" />
                    <div>
                      <span className="text-slate-500 text-[10px] block">RED PROBE (+):</span>
                      <strong className="text-slate-200">{item.probeRed}</strong>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0 mt-1 shadow-sm" />
                    <div>
                      <span className="text-slate-500 text-[10px] block">BLACK PROBE (-):</span>
                      <strong className="text-slate-200">{item.probeBlack}</strong>
                    </div>
                  </div>
                </div>

                {/* Expected vs Hazard Thresholds */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/40">
                    <span className="text-[10px] font-mono text-emerald-400 block mb-0.5">NOMINAL EXPECTED:</span>
                    <span className="font-mono font-bold text-emerald-300">{item.expectedNominal}</span>
                  </div>
                  <div className="p-2 rounded bg-rose-950/20 border border-rose-900/40">
                    <span className="text-[10px] font-mono text-rose-400 block mb-0.5">HAZARD THRESHOLD:</span>
                    <span className="font-mono font-bold text-rose-300">{item.hazardThreshold}</span>
                  </div>
                </div>

                {/* Action Row: Measured Input & Pass/Fail Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-mono text-slate-400">Measured:</label>
                    <input
                      type="text"
                      placeholder="e.g. 3.31V"
                      value={measuredInputs[item.id] ?? item.measuredValue ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMeasuredInputs((prev) => ({ ...prev, [item.id]: val }));
                      }}
                      className="w-24 px-2 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Pass / Fail / Skip Toggle Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onStatusChange(item.id, 'PASSED', measuredInputs[item.id])}
                      className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-900 text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-700'
                      }`}
                    >
                      Pass
                    </button>
                    <button
                      onClick={() => onStatusChange(item.id, 'FAILED', measuredInputs[item.id])}
                      className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                        isFailed
                          ? 'bg-rose-600 text-white shadow'
                          : 'bg-slate-900 text-slate-300 hover:bg-rose-950 hover:text-rose-300 border border-slate-700'
                      }`}
                    >
                      Fail
                    </button>
                    <button
                      onClick={() => onStatusChange(item.id, 'SKIPPED')}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        isSkipped
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                </div>

                {item.notes && (
                  <p className="mt-2 text-[11px] text-amber-300/80 font-mono italic">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
