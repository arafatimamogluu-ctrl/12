
import React from 'react';
import { 
  LayoutDashboard, 
  Share2, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  LogOut,
  Zap,
  Settings,
  CreditCard,
  Cpu
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Merkez Üssü', icon: LayoutDashboard },
    { id: 'connections', label: 'WhatsApp Engine', icon: Cpu },
    { id: 'contacts', label: 'Müşteri Portföyü', icon: Users },
    { id: 'campaigns', label: 'Marketing Hub', icon: MessageSquare },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col hidden lg:flex shadow-2xl z-20">
      <div className="p-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-[#25D366] p-2.5 rounded-2xl shadow-xl shadow-[#25D366]/20">
            <Zap className="text-slate-950 fill-slate-950" size={24} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase">WA<span className="text-[#25D366]">SaaS</span></span>
        </div>
        <div className="px-1 py-0.5 bg-slate-900 border border-slate-800 rounded-lg w-fit">
           <span className="text-[8px] font-black text-[#25D366] uppercase tracking-[0.2em]">Enterprise v3.2</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 mb-4">Ana Navigasyon</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-[#25D366] text-slate-950 shadow-2xl shadow-[#25D366]/20' 
                : 'text-slate-500 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-slate-950' : 'group-hover:text-[#25D366]'} />
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}

        <div className="pt-8 space-y-2">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 mb-4">Yönetim</p>
          {userRole === UserRole.ADMIN && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                activeTab === 'admin' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck size={20} />
              <span className="font-bold text-sm">Admin Kontrol</span>
            </button>
          )}
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-white hover:bg-slate-900 transition-all">
            <CreditCard size={20} />
            <span className="font-bold text-sm">Faturalandırma</span>
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-white hover:bg-slate-900 transition-all">
            <Settings size={20} />
            <span className="font-bold text-sm">Ayarlar</span>
          </button>
        </div>
      </nav>

      <div className="p-8 mt-auto border-t border-slate-900">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Sistemi Kapat</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
