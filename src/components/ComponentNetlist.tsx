import React, { useState } from 'react';
import { Cpu, Network, Zap, ShieldAlert, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { IdentifiedComponent, BusConnection, BusType } from '../types/circuit';

interface ComponentNetlistProps {
  components: IdentifiedComponent[];
  buses: BusConnection[];
}

export const ComponentNetlist: React.FC<ComponentNetlistProps> = ({ components, buses }) => {
  const [activeTab, setActiveTab] = useState<'COMPONENTS' | 'BUSES'>('COMPONENTS');
  const [expandedCompId, setExpandedCompId] = useState<string | null>(components[0]?.id || null);

  const getBusBadgeColor = (bus: BusType) => {
    switch (bus) {
      case 'I2C':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'SPI':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'UART':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'Power':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'GPIO':
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e17] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Tab Switcher Header */}
      <div className="p-4 bg-[#0f1523] border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Component Netlist & Bus Architecture</span>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('COMPONENTS')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'COMPONENTS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Components ({components.length})
          </button>
          <button
            onClick={() => setActiveTab('BUSES')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'BUSES' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Buses & Rails ({buses.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {activeTab === 'COMPONENTS' ? (
          <div className="space-y-3">
            {components.map((comp) => {
              const isExpanded = expandedCompId === comp.id;
              return (
                <div
                  key={comp.id}
                  className="rounded-lg bg-[#0e1422] border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
                >
                  {/* Card Header Bar */}
                  <div
                    onClick={() => setExpandedCompId(isExpanded ? null : comp.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/40 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-100">{comp.name}</h4>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700">
                            {comp.designator}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="capitalize">{comp.type.replace('_', ' ')}</span>
                          <span>·</span>
                          <span className="font-mono text-amber-300">{comp.nominalVoltage} Logic</span>
                          {comp.package && (
                            <>
                              <span>·</span>
                              <span className="text-slate-500">{comp.package}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Bus Badges */}
                      <div className="hidden sm:flex items-center gap-1">
                        {comp.busRoles.map((b, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getBusBadgeColor(b)}`}
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Pinout Connection Table */}
                  {isExpanded && (
                    <div className="p-4 pt-1 bg-[#090d16] border-t border-slate-800/80">
                      {comp.description && (
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{comp.description}</p>
                      )}

                      <div className="text-xs font-semibold text-slate-300 mb-2 font-mono flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Identified Pinout & Net Connections</span>
                      </div>

                      <div className="overflow-x-auto rounded border border-slate-800">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-[#0f1523] text-slate-400 font-mono text-[11px] border-b border-slate-800">
                            <tr>
                              <th className="px-3 py-2">Pin Name</th>
                              <th className="px-3 py-2">Connected Net</th>
                              <th className="px-3 py-2">Signal Type</th>
                              <th className="px-3 py-2">Nominal Voltage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                            {comp.pinsIdentified.map((pin, pIdx) => {
                              const isOvervoltage = pin.voltageNominal.includes('5V') && comp.nominalVoltage === '3.3V';
                              return (
                                <tr
                                  key={pIdx}
                                  className={`hover:bg-slate-900/50 ${
                                    isOvervoltage ? 'bg-rose-950/20 text-rose-300' : ''
                                  }`}
                                >
                                  <td className="px-3 py-2 font-semibold text-slate-100">{pin.pinName}</td>
                                  <td className="px-3 py-2 text-cyan-400">{pin.connectedNet}</td>
                                  <td className="px-3 py-2 text-slate-400">{pin.signalType}</td>
                                  <td className="px-3 py-2">
                                    <span
                                      className={`inline-flex items-center gap-1 ${
                                        isOvervoltage ? 'text-rose-400 font-bold' : 'text-slate-300'
                                      }`}
                                    >
                                      {isOvervoltage && <ShieldAlert className="w-3 h-3 text-rose-400" />}
                                      {pin.voltageNominal}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Buses View */
          <div className="space-y-3">
            {buses.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No formal digital buses detected.</p>
            ) : (
              buses.map((bus, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#0e1422] border border-slate-800">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${getBusBadgeColor(bus.busType)}`}>
                        {bus.busType} BUS
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100">{bus.busName}</h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                      {bus.voltageLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                    <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
                      <span className="text-[11px] font-mono text-slate-400 block mb-1">Master Controller:</span>
                      <span className="font-semibold text-slate-200">{bus.masterDevice}</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
                      <span className="text-[11px] font-mono text-slate-400 block mb-1">Attached Slaves / Peripherals:</span>
                      <div className="flex flex-wrap gap-1">
                        {bus.slaveDevices.map((slave, sIdx) => (
                          <span key={sIdx} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 text-[11px] font-mono border border-slate-800">
                            {slave}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pull-up Status */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px]">Pull-up Resistors:</span>
                      <span
                        className={`font-semibold ${
                          bus.pullUpsPresent ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {bus.pullUpsPresent ? `Present (${bus.pullUpValue || 'Unknown value'})` : 'Missing / Omitted'}
                      </span>
                    </div>
                    {bus.statusNotes && (
                      <span className="text-[11px] text-rose-300 font-mono">{bus.statusNotes}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
