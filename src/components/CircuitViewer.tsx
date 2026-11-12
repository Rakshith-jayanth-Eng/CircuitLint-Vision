import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  Image as ImageIcon,
  CheckCircle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { CircuitPreset, LogicLevel } from '../types/circuit';
import { CIRCUIT_PRESETS } from '../data/presets';

interface CircuitViewerProps {
  currentPreset: CircuitPreset | null;
  uploadedImage: string | null;
  onPresetSelect: (preset: CircuitPreset) => void;
  onImageUpload: (base64: string, mimeType: string, fileName: string) => void;
  logicLevel: LogicLevel;
  onLogicLevelChange: (level: LogicLevel) => void;
}

export const CircuitViewer: React.FC<CircuitViewerProps> = ({
  currentPreset,
  uploadedImage,
  onPresetSelect,
  onImageUpload,
  logicLevel,
  onLogicLevelChange,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isCrosshairActive, setIsCrosshairActive] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1);

  // Crosshair coordinate tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords(null);
  };

  // File processing
  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageUpload(base64, file.type, file.name);
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e17] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Viewer Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0f1523] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Circuit Inspection Stage</span>
          <span className="text-slate-500 font-mono text-xs">/</span>
          <span className="text-xs font-mono text-cyan-400">
            {uploadedImage ? 'Custom Capture' : currentPreset?.title || 'No Source Loaded'}
          </span>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono text-slate-400 min-w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3.5 bg-slate-800 my-auto" />
          <button
            onClick={() => setIsCrosshairActive(!isCrosshairActive)}
            className={`p-1.5 rounded transition-colors ${
              isCrosshairActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-100'
            }`}
            title="Toggle Probe Coordinate Crosshair"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Selector Strip */}
      <div className="px-4 py-2.5 bg-[#0d121e] border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Presets:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {CIRCUIT_PRESETS.map((preset) => {
            const isSelected = currentPreset?.id === preset.id && !uploadedImage;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onPresetSelect(preset);
                  onLogicLevelChange(preset.targetLogic);
                }}
                className={`px-2.5 py-1 text-xs rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{preset.title}</span>
                {isSelected && <CheckCircle className="w-3 h-3 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div
        ref={containerRef}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative flex-1 min-h-[380px] bg-[#07090e] lab-grid-bg flex items-center justify-center p-4 overflow-hidden select-none transition-colors ${
          isCrosshairActive ? 'cursor-crosshair' : 'cursor-default'
        } ${isDraggingOver ? 'ring-2 ring-cyan-500 bg-cyan-950/20' : ''}`}
      >
        {/* Render Vector SVG schematic or Uploaded Photo */}
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-100 ease-out max-w-full max-h-full flex items-center justify-center"
        >
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded Breadboard or Schematic Circuit"
              className="max-h-[460px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700"
            />
          ) : currentPreset ? (
            <div
              className="w-[720px] max-w-full aspect-[8/5] rounded-lg shadow-2xl overflow-hidden border border-slate-800"
              dangerouslySetInnerHTML={{ __html: currentPreset.circuitSvg }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200 mb-1">
                Upload Circuit Photo, Schematic, or Waveform
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Drag and drop your file here, paste from clipboard (Ctrl+V), or pick a preset above.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Browse Image Files
              </button>
            </div>
          )}
        </div>

        {/* Crosshair HUD Overlay */}
        {isCrosshairActive && coords && (
          <div className="absolute top-3 left-3 bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none backdrop-blur-sm">
            PROBE POS: X:{coords.x}px Y:{coords.y}px
          </div>
        )}

        {/* Floating Upload Button when an image/preset is displayed */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg shadow-md backdrop-blur-sm transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload New Image</span>
          </button>
        </div>
      </div>

      {/* Circuit Meta Information Bar */}
      <div className="px-4 py-2.5 bg-[#0f1523] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Target: <strong className="text-slate-200">{logicLevel}</strong></span>
          <span className="text-slate-600">·</span>
          <span>Mode: <strong className="text-slate-200">{uploadedImage ? 'Custom Vision Scan' : 'Preset Benchmark'}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Clipboard paste supported</span>
        </div>
      </div>
    </div>
  );
};
