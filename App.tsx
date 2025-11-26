
import React, { useState, useMemo } from 'react';
import {
  Menu, RefreshCw, TrendingUp, AlertOctagon, CheckCircle2,
  ArrowRight, Filter, Search, Sparkles, FileText, UploadCloud, Clock,
  Download, PieChart, ShieldCheck, Leaf
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';
import AuditModal from './components/AuditModal';
import LawDetailPanel from './components/LawDetailPanel';
import { IndustryType, Law } from './types';
import { simulateNewLaw, analyzeSpecificLaw } from './services/geminiService';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [industry, setIndustry] = useState<IndustryType>('Minería');
  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation State - Defaulted to Auditoría Viva per request
  const [activeTab, setActiveTab] = useState('Auditoría Viva');

  // Selection State
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [chatForceOpen, setChatForceOpen] = useState(false);

  // Initial State with Real-world Mining Examples (Base Knowledge)
  const [laws, setLaws] = useState<Law[]>([
    {
      id: 'init-1',
      title: 'Reforma NOM-141-SEMARNAT: Presas de Jales',
      description: 'Nuevos criterios de caracterización de jales mineros y especificaciones para la preparación del sitio, proyecto, construcción y cierre.',
      category: 'Ambiental',
      isoImpact: 'ISO 14001',
      impactLevel: 'Alto',
      status: 'Vencido',
      dateAdded: new Date().toISOString(),
      actionSteps: [
        'Auditoría de estabilidad física de presas - Superintendente de Planta',
        'Actualizar análisis de lixiviados (CRIT) - Laboratorio Externo',
        'Revisión de fianza ambiental - Jurídico'
      ],
      estimatedFine: '$2.5M - $8M MXN',
      deadline: '45 días (Crítico)',
      complianceProgress: 25
    },
    {
      id: 'init-2',
      title: 'NOM-023-STPS-2012: Ventilación en Minas Subterráneas',
      description: 'Actualización de protocolos de monitoreo de gases y tiempos de reentrada post-voladura.',
      category: 'Seguridad',
      isoImpact: 'ISO 45001',
      impactLevel: 'Alto',
      status: 'En Revisión',
      dateAdded: new Date().toISOString(),
      actionSteps: [
        'Calibración de detectores multigás - Mantenimiento',
        'Capacitación a brigadas de rescate - Seguridad e Higiene'
      ],
      estimatedFine: '5,000 UMAS',
      deadline: '15 de Diciembre, 2024',
      complianceProgress: 60
    }
  ]);

  // Derived state for searching and filtering based on active tab
  const displayLaws = useMemo(() => {
    let contextLaws = laws;

    // Context Filtering
    if (activeTab === 'Matriz ISO 14001') {
      contextLaws = laws.filter(l => l.isoImpact?.includes('14001') || l.category === 'Ambiental');
    } else if (activeTab === 'Matriz ISO 45001') {
      contextLaws = laws.filter(l => l.isoImpact?.includes('45001') || l.category === 'Seguridad');
    }

    // Search Filtering
    return contextLaws.filter(law =>
      law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [laws, searchQuery, activeTab]);

  const handleFetchRealUpdates = async () => {
    setFetching(true);
    // This calls Gemini to "Search" its knowledge base for a real relevant law for this industry
    const newLaw = await simulateNewLaw(industry);
    if (newLaw) {
      setLaws(prev => [newLaw, ...prev]);
    }
    setFetching(false);
  };

  const handleLawClick = async (law: Law) => {
    setSelectedLaw(law);
    // If we don't have AI details yet, fetch them silently
    if (!law.aiSummary) {
      const analysis = await analyzeSpecificLaw(law.title, industry);
      setLaws(prev => prev.map(l => l.id === law.id ? { ...l, ...analysis } : l));
      // Update the selected law in the view as well
      setSelectedLaw(prev => prev?.id === law.id ? { ...prev, ...analysis } : prev);
    }
  };

  const openChatWithContext = () => {
    setChatForceOpen(prev => !prev); // Toggle to trigger effect
  };

  // Helper to calculate compliance for the current view
  const complianceStats = useMemo(() => {
    if (displayLaws.length === 0) return 0;
    const totalProgress = displayLaws.reduce((acc, law) => acc + (law.complianceProgress || 0), 0);
    return Math.round(totalProgress / displayLaws.length);
  }, [displayLaws]);

  const renderTable = () => (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden backdrop-blur-sm">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <h3 className="font-bold text-slate-800 text-lg">
          {activeTab.includes('ISO') ? `Requisitos ${activeTab}` : 'Normativa Vigente y Reformas'}
        </h3>
        <div className="flex gap-2">
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
            {displayLaws.length} Registros
          </span>
          {activeTab.includes('ISO') && (
            <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition">
              <Download size={12} /> Exportar Matriz
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/80 text-left text-xs uppercase text-slate-500 font-semibold tracking-wider sticky top-0">
            <tr>
              <th className="px-6 py-4">Regulación / Norma</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Norma Relacionada</th>
              <th className="px-6 py-4">Nivel Riesgo</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayLaws.map((law) => (
              <tr
                key={law.id}
                onClick={() => handleLawClick(law)}
                className={`
                    cursor-pointer transition-all duration-200 group
                    ${selectedLaw?.id === law.id ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}
                `}
              >
                <td className="px-6 py-4 max-w-sm">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{law.title}</p>
                    <p className="text-xs text-slate-500 mt-1 truncate">{law.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {law.category || "General"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                  {law.isoImpact}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${law.impactLevel === 'Alto' ? 'bg-rose-100 text-rose-700' :
                    law.impactLevel === 'Medio' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${law.impactLevel === 'Alto' ? 'bg-rose-500' :
                      law.impactLevel === 'Medio' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                    {law.impactLevel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={law.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-slate-400 group-hover:text-indigo-600 transition">
                    <ArrowRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Responsive View) */}
      <div className="md:hidden p-4 space-y-4">
        {displayLaws.map((law) => (
          <div
            key={law.id}
            onClick={() => handleLawClick(law)}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${law.impactLevel === 'Alto' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                {law.impactLevel}
              </span>
              <StatusBadge status={law.status} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{law.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{law.description}</p>
            <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
              <span className="font-medium text-slate-600">{law.isoImpact}</span>
              <span className="text-indigo-600 font-bold flex items-center gap-1">
                Ver Detalle <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}
        {displayLaws.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <p>No se encontraron regulaciones para este criterio.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative transition-all duration-300">

        {/* Modern Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-800">
                {activeTab}
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">VIGILANCIA • {industry.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Smart Search Bar */}
            <div className="hidden md:flex items-center bg-slate-100/80 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar regulación..."
                className="bg-transparent border-none text-sm ml-2 w-full focus:outline-none text-slate-700 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Industry Selector */}
            <div className="relative group hidden md:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter size={14} className="text-indigo-500" />
              </div>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryType)}
                className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-indigo-300 transition shadow-sm"
              >
                <option value="Minería">Minería y Metalurgia</option>
                <option value="Transporte">Transporte y Logística</option>
                <option value="Alimentos">Alimentos y Bebidas</option>
                <option value="Fintech">Fintech y Banca</option>
                <option value="Construcción">Construcción</option>
              </select>
            </div>

            <button
              onClick={handleFetchRealUpdates}
              disabled={fetching}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-95 transition-all disabled:opacity-70"
            >
              {fetching ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
              <span className="hidden sm:inline">{fetching ? 'Consultando IA...' : 'Buscar Novedades'}</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="p-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition shadow-sm"
              title="Subir Evidencia"
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></div>
                <AlertOctagon size={20} />
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-slate-50/50">
          <div className="max-w-7xl mx-auto pb-20">

            {/* VIEW CONTROLLER */}
            {(activeTab === 'Monitor Activo' || activeTab.includes('ISO')) ? (
              <>
                {/* Stats Section based on Context */}
                {activeTab === 'Monitor Activo' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: 'Cumplimiento Global', val: '92%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: '+2.4%' },
                      { label: 'Normas Activas', val: laws.length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: 'Actualizado Hoy' },
                      { label: 'Riesgo Financiero', val: '$8.2M', icon: AlertOctagon, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', trend: 'Exposición Estimada' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-default">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>{stat.trend}</span>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                          <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.val}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* ISO Specific Header Stats */
                  <div className="mb-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${activeTab.includes('14001') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {activeTab.includes('14001') ? <Leaf size={32} /> : <ShieldCheck size={32} />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">{activeTab}</h2>
                        <p className="text-slate-500 text-sm">Matriz de requisitos {activeTab.includes('14001') ? 'ambientales' : 'de seguridad y salud'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">Cumplimiento Norma</p>
                        <p className={`text-3xl font-bold ${complianceStats > 80 ? 'text-emerald-600' : complianceStats > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {complianceStats}%
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center">
                        <PieChart className="text-indigo-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Common Table Component */}
                {renderTable()}
              </>
            ) : activeTab === 'Auditoría Viva' ? (
              <div className="space-y-6">
                <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Centro de Auditoría Forense</h2>
                      <p className="text-indigo-100 max-w-xl">
                        Sube manifiestos, permisos o reportes técnicos. La IA cruzará la información contra la base de datos de NOMs (STPS, SEMARNAT) y detectará inconsistencias legales.
                      </p>
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg flex items-center gap-2"
                    >
                      <UploadCloud size={20} />
                      Nueva Auditoría
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Clock size={20} className="text-slate-400" />
                  Historial Reciente
                </h3>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <FileText size={48} className="text-slate-200" />
                    <p>No hay auditorías recientes en esta sesión.</p>
                    <button onClick={() => setModalOpen(true)} className="text-indigo-600 font-semibold hover:underline">
                      Auditar mi primer documento
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <AlertOctagon size={48} className="mb-4 text-slate-200" />
                <h3 className="text-lg font-bold text-slate-600">Módulo en construcción</h3>
                <p>La sección {activeTab} estará disponible próximamente.</p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Components */}
      <ChatWidget currentContextLaw={selectedLaw} forceOpen={chatForceOpen} />
      <AuditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <LawDetailPanel
        law={selectedLaw}
        onClose={() => setSelectedLaw(null)}
        onOpenChat={openChatWithContext}
      />

    </div>
  );
};

// Helper Component for Status
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'Vencido': 'bg-rose-50 text-rose-700 border-rose-100',
    'Cumple': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Pendiente': 'bg-amber-50 text-amber-700 border-amber-100',
    'En Revisión': 'bg-blue-50 text-blue-700 border-blue-100',
  }[status] || 'bg-slate-50 text-slate-600';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${styles}`}>
      {status === 'Vencido' && <AlertOctagon size={12} />}
      {status === 'Cumple' && <CheckCircle2 size={12} />}
      {status}
    </span>
  )
}

export default App;
// trigger redeploy
