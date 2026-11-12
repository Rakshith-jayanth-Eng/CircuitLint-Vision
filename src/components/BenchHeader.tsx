import React from 'react';
import { Cpu, Play, RefreshCw, FileText, Download } from 'lucide-react';
import { LogicLevel } from '../types/circuit';

interface BenchHeaderProps {
  logicLevel: LogicLevel;
  onLogicLevelChange: (level: LogicLevel) => void;
  onRunAudit: () => void;
  onReset: () => void;
  onLoadPreset: (presetId: string) => void;
  onOpenReport: () => void;
  isLoading: boolean;
  hasAuditData: boolean;
}

export const BenchHeader: React.FC<BenchHeaderProps> = ({
  logicLevel,
  onLogicLevelChange,
  onRunAudit,
  onReset,
  onLoadPreset,
  onOpenReport,
  isLoading,
  hasAuditData,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#090d16] border-b border-slate-800 text-slate-200 select-none">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            CircuitLint Vision
          </span>
          <span className="text-[11px] text-slate-400 font-mono tracking-wide">
            Automated Bench Hardware Linter
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation & Voltage Logic Controls */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-medium">
        {/* Board Voltage Logic Switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-slate-400 px-2 font-mono text-[11px]">Target Logic:</span>
          <button
            onClick={() => onLogicLevelChange('3.3V')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap ${
              logicLevel === '3.3V'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3.3V (ESP32/STM32)
          </button>
          <button
            onClick={() => onLogicLevelChange('5.0V')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap ${
              logicLevel === '5.0V'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5.0V (Arduino Uno)
          </button>
        </div>

        {/* Quick Demo Preset Trigger */}
        <button
          onClick={() => onLoadPreset('esp32-i2c-lcd-bme280')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          title="Load confirmed ESP32 + 5V LCD Level Mismatch Scenario"
        >
          Load 5V LCD Bug Demo
        </button>

        <button
          onClick={onReset}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset Workbench"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {hasAuditData && (
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bench Report</span>
          </button>
        )}

        <button
          onClick={onRunAudit}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
              <span>Analyzing Circuit...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Run Circuit Audit</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
