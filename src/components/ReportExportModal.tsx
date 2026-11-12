import React, { useState } from 'react';
import { X, Copy, Download, Check, FileText, Code2 } from 'lucide-react';
import { CircuitAudit } from '../types/circuit';

interface ReportExportModalProps {
  audit: CircuitAudit;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ audit, isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'MARKDOWN' | 'JSON'>('MARKDOWN');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Generate clean engineering markdown report
  const generateMarkdown = () => {
    const passedChecks = audit.multimeterChecklist.filter((c) => c.status === 'PASSED').length;
    const totalChecks = audit.multimeterChecklist.length;

    let md = `# CircuitLint Vision — Bench Inspection Report\n\n`;
    md += `**Circuit Target**: ${audit.summary.circuitName}\n`;
    md += `**Logic Level**: ${audit.summary.targetLogic}\n`;
    md += `**Overall Integrity**: ${audit.summary.overallIntegrity}\n`;
    md += `**Date**: ${new Date().toISOString().split('T')[0]}\n\n`;

    md += `## 1. Executive Summary\n`;
    md += `${audit.summary.briefAssessment}\n\n`;

    md += `### Issue Summary\n`;
    md += `- **Critical**: ${audit.summary.issueCounts.critical}\n`;
    md += `- **High**: ${audit.summary.issueCounts.high}\n`;
    md += `- **Medium**: ${audit.summary.issueCounts.medium}\n`;
    md += `- **Low**: ${audit.summary.issueCounts.low}\n\n`;

    md += `## 2. Identified Hardware Issues & Remediation\n\n`;
    audit.issues.forEach((iss, idx) => {
      md += `### ${idx + 1}. [${iss.severity}] ${iss.title}\n`;
      md += `**Category**: \`${iss.category}\`\n`;
      md += `**Affected Pins / Parts**: ${iss.affectedComponents.join(', ')} (${iss.affectedPins.join(', ')})\n\n`;
      md += `> **Electrical Hazard**: ${iss.hazardRisk}\n\n`;
      md += `**Remediation**: ${iss.remediation}\n\n`;
      md += `---\n\n`;
    });

    md += `## 3. Multimeter Verification Checklist Results\n`;
    md += `**Status**: ${passedChecks} of ${totalChecks} tests verified\n\n`;
    md += `| Step | Test Point | Red Probe (+) | Black Probe (-) | Mode | Expected | Status |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    audit.multimeterChecklist.forEach((step) => {
      md += `| ${step.stepNumber} | ${step.testPoint} | ${step.probeRed} | ${step.probeBlack} | ${step.meterMode} | ${step.expectedNominal} | **${step.status}** |\n`;
    });

    md += `\n## 4. Bill of Materials & Netlist\n\n`;
    audit.components.forEach((comp) => {
      md += `- **${comp.designator}**: ${comp.name} (${comp.nominalVoltage} Logic, Package: ${comp.package || 'N/A'})\n`;
    });

    return md;
  };

  const contentToDisplay =
    exportFormat === 'MARKDOWN' ? generateMarkdown() : JSON.stringify(audit, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `circuitlint-report-${Date.now()}.${exportFormat === 'MARKDOWN' ? 'md' : 'json'}`;
    const blob = new Blob([contentToDisplay], {
      type: exportFormat === 'MARKDOWN' ? 'text/markdown' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0c101c] border border-slate-700 rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f1525] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">Bench Inspection Export</h3>
              <p className="text-xs text-slate-400">Generate laboratory documentation and netlists</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setExportFormat('MARKDOWN')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors flex items-center gap-1 ${
                  exportFormat === 'MARKDOWN' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Markdown</span>
              </button>
              <button
                onClick={() => setExportFormat('JSON')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors flex items-center gap-1 ${
                  exportFormat === 'JSON' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#07090e]">
          <pre className="p-4 rounded-lg bg-[#0a0d16] border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap select-all leading-relaxed">
            {contentToDisplay}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#0f1525] border-t border-slate-800">
          <span className="text-xs font-mono text-slate-500">
            {exportFormat === 'MARKDOWN' ? 'Formatted for GitHub / Lab Notebooks' : 'Structured Netlist JSON'}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
