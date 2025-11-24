import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, AlertTriangle, FileText, Loader, ClipboardPaste } from 'lucide-react';
import { analyzeEvidence } from '../services/geminiService';
import { AuditResult } from '../types';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [text, setText] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      const textFromClipboard = await navigator.clipboard.readText();
      setText(textFromClipboard);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleAudit = async () => {
    if (!text.trim()) return;
    setStep('analyzing');
    // Real API Call
    const analysis = await analyzeEvidence(text);
    setResult(analysis);
    setStep('result');
  };

  const reset = () => {
    setStep('upload');
    setText('');
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <UploadCloud className="text-indigo-600" size={24} />
            Auditoría de Documentos
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-3">
                 <FileText className="text-indigo-600 shrink-0" size={24} />
                 <p className="text-sm text-indigo-900">
                   <strong>Instrucciones:</strong> Copia el texto de tus licencias, manifiestos, permisos o reportes técnicos y pégalo abajo. La IA validará la vigencia y congruencia normativa.
                 </p>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Contenido del Documento</label>
                    <button 
                        onClick={handlePaste}
                        className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-700"
                    >
                        <ClipboardPaste size={14} /> Pegar del Portapapeles
                    </button>
                </div>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-48 p-4 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono bg-white text-slate-700 shadow-inner"
                  placeholder="Pega aquí el texto del documento para auditar..."
                />
              </div>

              <button 
                onClick={handleAudit}
                disabled={!text.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Iniciar Auditoría Forense
              </button>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={48} className="text-indigo-600 animate-spin" />
              <p className="mt-6 font-medium text-slate-800">Procesando Análisis Normativo...</p>
              <p className="text-sm text-slate-500 mt-1">Consultando base de datos de NOMs y Leyes Vigentes</p>
            </div>
          )}

          {step === 'result' && result && (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border ${result.compliant ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {result.compliant ? (
                    <CheckCircle2 size={28} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={28} className="text-red-600" />
                  )}
                  <h3 className={`text-xl font-bold ${result.compliant ? 'text-emerald-800' : 'text-red-800'}`}>
                    {result.verdictTitle}
                  </h3>
                </div>
                <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {result.analysis}
                </div>
                <div className="mt-4 flex items-center gap-2">
                   <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${result.compliant ? 'bg-emerald-500' : 'bg-red-500'}`} 
                        style={{ width: `${result.confidence}%` }}
                      />
                   </div>
                   <span className="text-xs font-bold text-slate-500">{result.confidence}% Certeza Legal</span>
                </div>
              </div>

              <button 
                onClick={reset}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition"
              >
                Auditar Nuevo Documento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;