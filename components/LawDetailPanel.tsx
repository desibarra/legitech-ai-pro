
import React from 'react';
import { X, CheckCircle, AlertTriangle, FileText, DollarSign, ListTodo, Shield, AlertOctagon, CalendarClock, Activity } from 'lucide-react';
import { Law } from '../types';

interface LawDetailPanelProps {
  law: Law | null;
  onClose: () => void;
  onOpenChat: () => void;
}

const LawDetailPanel: React.FC<LawDetailPanelProps> = ({ law, onClose, onOpenChat }) => {
  if (!law) return null;

  const progress = law.complianceProgress || 0;
  
  const getProgressColor = (val: number) => {
      if (val < 30) return 'bg-rose-500 text-rose-600';
      if (val < 70) return 'bg-amber-500 text-amber-600';
      return 'bg-emerald-500 text-emerald-600';
  };

  const progressColorClass = getProgressColor(progress).split(' ')[0];
  const progressTextClass = getProgressColor(progress).split(' ')[1];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto animate-slide-in-right flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-start sticky top-0 z-10 backdrop-blur-md bg-slate-50/90">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                law.impactLevel === 'Alto' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
            }`}>
              Impacto {law.impactLevel}
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{law.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* RISK PANEL (Refined) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <AlertOctagon className="text-rose-600" size={18} />
                <h3 className="font-bold text-slate-800 text-sm">Panel de Riesgo</h3>
             </div>
             <div className="p-5 space-y-5">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
                        <div className="flex items-center gap-1.5 mb-1">
                            <DollarSign size={14} className="text-rose-600" />
                            <span className="text-[10px] uppercase font-bold text-rose-800">Impacto Financiero</span>
                        </div>
                        <p className="font-bold text-rose-900 text-sm leading-tight">{law.estimatedFine || "No Estimado"}</p>
                     </div>
                     
                     <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <div className="flex items-center gap-1.5 mb-1">
                            <CalendarClock size={14} className="text-amber-600" />
                            <span className="text-[10px] uppercase font-bold text-amber-800">Plazo Crítico</span>
                        </div>
                        <p className="font-bold text-amber-900 text-sm leading-tight">{law.deadline || "Inmediato"}</p>
                     </div>
                </div>

                {/* Compliance Progress */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Activity size={14} /> Estado de Cumplimiento
                        </span>
                        <span className={`text-sm font-bold ${progressTextClass}`}>{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColorClass}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-right">Basado en auditoría preliminar</p>
                </div>

             </div>
          </div>

          {/* AI Analysis */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
              <FileText size={16} className="text-indigo-600" />
              Resumen Inteligente
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
              {law.aiSummary || law.description}
            </p>
          </div>

          {/* Action Steps */}
          {law.actionSteps && law.actionSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                <ListTodo size={16} className="text-indigo-600" />
                Acciones Requeridas
              </h3>
              <ul className="space-y-2">
                {law.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <button 
            onClick={onOpenChat}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            Consultar con LegiBot
          </button>
        </div>

      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default LawDetailPanel;
