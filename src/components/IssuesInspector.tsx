import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Info,
  Wrench,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { HardwareIssue, IssueSeverity } from '../types/circuit';

interface IssuesInspectorProps {
  issues: HardwareIssue[];
}

export const IssuesInspector: React.FC<IssuesInspectorProps> = ({ issues }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'ALL') return true;
    return issue.severity === filter;
  });

  const criticalCount = issues.filter((i) => i.severity === 'CRITICAL').length;
  const highCount = issues.filter((i) => i.severity === 'HIGH').length;
  const mediumCount = issues.filter((i) => i.severity === 'MEDIUM').length;
  const lowCount = issues.filter((i) => i.severity === 'LOW').length;

  const getSeverityStyle = (severity: IssueSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
          icon: <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />,
          cardBorder: 'border-rose-900/40 hover:border-rose-700/60',
          glow: 'bg-rose-950/10',
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          cardBorder: 'border-amber-900/40 hover:border-amber-700/60',
          glow: 'bg-amber-950/10',
        };
      case 'MEDIUM':
        return {
          badge: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
          icon: <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />,
          cardBorder: 'border-sky-900/40 hover:border-sky-700/60',
          glow: 'bg-sky-950/10',
        };
      case 'LOW':
      default:
        return {
          badge: 'bg-slate-900 text-slate-300 border-slate-700',
          icon: <Info className="w-4 h-4 text-slate-400 shrink-0" />,
          cardBorder: 'border-slate-800 hover:border-slate-700',
          glow: 'bg-slate-900/10',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e17] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Overview & Filter Bar */}
      <div className="p-4 bg-[#0f1523] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">Hardware Issues & Electrical Hazards</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
            {issues.length} Identified
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setFilter('CRITICAL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              filter === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <span>Critical</span>
            <span className="font-mono text-[10px]">({criticalCount})</span>
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              filter === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span>High</span>
            <span className="font-mono text-[10px]">({highCount})</span>
          </button>
          <button
            onClick={() => setFilter('MEDIUM')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              filter === 'MEDIUM' ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'text-sky-400 hover:text-sky-300'
            }`}
          >
            <span>Medium</span>
            <span className="font-mono text-[10px]">({mediumCount})</span>
          </button>
        </div>
      </div>

      {/* Issues List Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/70 mb-2" />
            <p className="text-sm font-medium text-slate-300">No issues in this severity category</p>
            <p className="text-xs text-slate-500">Circuit passes all checks for this threshold filter.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const style = getSeverityStyle(issue.severity);
            return (
              <div
                key={issue.id}
                className={`p-4 rounded-lg bg-[#0e1422] border transition-all ${style.cardBorder} ${style.glow}`}
              >
                {/* Header: Severity Badge & Category */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border ${style.badge}`}
                    >
                      {style.icon}
                      <span>{issue.severity}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Category: <strong className="text-slate-300">{issue.category.replace(/_/g, ' ')}</strong>
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-100 mb-2 leading-snug">
                  {issue.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                  {issue.description}
                </p>

                {/* Affected Elements & Pins */}
                <div className="flex flex-wrap items-center gap-2 mb-3 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Affected:</span>
                  {issue.affectedComponents.map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]"
                    >
                      {comp}
                    </span>
                  ))}
                  {issue.affectedPins.map((pin, idx) => (
                    <span
                      key={`pin-${idx}`}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]"
                    >
                      {pin}
                    </span>
                  ))}
                </div>

                {/* Hazard Risk Warning */}
                <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200 mb-2.5 flex items-start gap-2">
                  <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-rose-300 font-mono text-[11px]">
                      Electrical Consequence:
                    </strong>
                    <span className="text-rose-200/90">{issue.hazardRisk}</span>
                  </div>
                </div>

                {/* Schematic Fix / Remediation */}
                <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-900/40 text-xs text-cyan-200 flex items-start gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-cyan-300 font-mono text-[11px]">
                      Recommended Remediation:
                    </strong>
                    <span className="text-cyan-200/90">{issue.remediation}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
