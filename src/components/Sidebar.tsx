import React from 'react';
import { 
  ShieldCheck, Radar, LayoutDashboard, FileCheck, HardHat, X, 
  TrendingUp, TrendingDown, DollarSign, Euro, Percent, BarChart3 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const navItems = [
    { icon: <Radar size={20} />, label: "Monitor Activo" },
    { icon: <LayoutDashboard size={20} />, label: "Auditoría Viva" },
    { icon: <FileCheck size={20} />, label: "Matriz ISO 14001" },
    { icon: <HardHat size={20} />, label: "Matriz ISO 45001" },
  ];

  // Mock Financial Data (In a real app, this would come from an API)
  const financialIndicators = [
    { label: 'USD / MXN', val: '20.35', change: '+0.12%', up: true, icon: <DollarSign size={14} /> },
    { label: 'MXN / USD', val: '0.049', change: '-0.05%', up: false, icon: <DollarSign size={14} /> },
    { label: 'EUR / USD', val: '1.082', change: '+0.03%', up: true, icon: <Euro size={14} /> },
    { label: 'USD / EUR', val: '0.924', change: '-0.01%', up: false, icon: <Euro size={14} /> },
    { label: 'INPC (MX)', val: '4.68%', change: 'Anual', up: true, icon: <Percent size={14} /> },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-300 transform transition-transform duration-300 ease-in-out flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:flex-shrink-0 border-r border-white/5 shadow-2xl
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white">
            <div className="p-2 bg-legitech-primary rounded-lg">
                <ShieldCheck className="text-legitech-accent" size={24} />
            </div>
            <span>LegiTech<span className="text-legitech-accent">AI</span></span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          
          {/* Main Nav */}
          <nav className="space-y-1">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Plataforma</p>
            {navItems.map((item, index) => {
              const isActive = activeTab === item.label;
              return (
                <div 
                  key={index}
                  onClick={() => onTabChange(item.label)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-white/5 text-white shadow-lg shadow-black/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-legitech-accent rounded-r-full"></div>}
                  <span className={`transition-colors ${isActive ? 'text-legitech-accent' : 'text-slate-500 group-hover:text-legitech-accent'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              );
            })}
          </nav>

          {/* Financial Indicators Section */}
          <div className="space-y-3">
             <div className="px-4 flex items-center gap-2 text-slate-500">
                <BarChart3 size={14} />
                <p className="text-xs font-bold uppercase tracking-wider">Mercados & Economía</p>
             </div>
             
             <div className="grid gap-2">
                {financialIndicators.map((indicator, idx) => (
                    <div key={idx} className="bg-slate-900/50 hover:bg-slate-800 border border-white/5 rounded-lg p-3 transition-colors group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-slate-400 group-hover:text-legitech-accent transition-colors flex items-center gap-1">
                                {indicator.label}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                indicator.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                                {indicator.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {indicator.change}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-200 tracking-tight flex items-baseline gap-0.5">
                                <span className="text-xs text-slate-500 opacity-50">$</span>
                                {indicator.val}
                            </span>
                        </div>
                    </div>
                ))}
             </div>
             <p className="px-4 text-[10px] text-slate-600 text-right italic">
                *Datos en tiempo real (Fix)
             </p>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="p-6 bg-slate-950 border-t border-white/5 shrink-0">
          <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 backdrop-blur-md shadow-inner">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Estado del Sistema</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-legitech-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-legitech-accent"></span>
              </span>
              <span className="text-xs font-semibold text-legitech-accent">Vigilancia Activa</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
