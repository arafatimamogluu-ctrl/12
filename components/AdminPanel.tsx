
import React, { useState } from 'react';
import { AppState, UserRole, SubscriptionType, Profile } from '../types';
import { 
  Users, ShieldCheck, Mail, Activity, ArrowUpRight, TrendingUp, 
  Search, Filter, MoreHorizontal, CheckCircle, XCircle, Settings,
  Database, Zap, CreditCard, Lock
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AdminPanel: React.FC<Props> = ({ state, setState }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Sistem Genel Mesaj', value: state.users.reduce((a,c)=>a+c.toplam_gönderilen,0).toLocaleString(), icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Toplam Müşteri', value: state.users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Tahmini Gelir (Aylık)', value: '₺' + (state.users.length * 450).toLocaleString(), icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Sunucu Yükü', value: '%12', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Süper Admin Paneli</h2>
           <p className="text-slate-500 font-medium">SaaS sistemindeki tüm kullanıcıları ve aktiviteleri buradan yönetin.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
              <Settings size={16} className="inline mr-2" />
              Global Ayarlar
           </button>
           <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all">
              <Database size={16} className="inline mr-2" />
              Sistem Logları
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[36px] hover:border-slate-700 transition-all group">
            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon size={28} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <h3 className="text-3xl font-black text-white">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
              <input 
                type="text" placeholder="Kullanıcı ara (Email veya ID)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:ring-2 focus:ring-blue-500/20"
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all">
                 <Filter size={20} />
              </button>
              <button className="px-8 py-4 bg-slate-100 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                 Yeni Kullanıcı Ekle
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                <th className="px-10 py-6">Müşteri Profili</th>
                <th className="px-10 py-6">Üyelik Planı</th>
                <th className="px-10 py-6">G. Mesaj Limit</th>
                <th className="px-10 py-6">Kayıt Tarihi</th>
                <th className="px-10 py-6">Durum</th>
                <th className="px-10 py-6 text-right">Eylem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {state.users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform">
                        {u.email[0].toUpperCase()}
                      </div>
                      <div>
                         <p className="text-white font-black text-sm">{u.email}</p>
                         <p className="text-[10px] text-slate-600 font-mono">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={14} className={u.rol === UserRole.ADMIN ? 'text-rose-500' : 'text-blue-500'} />
                       <span className="text-xs font-bold text-slate-300">{u.abonelik_türü}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-2">
                       <span className="text-xs font-black text-white">{u.toplam_gönderilen} / {u.günlük_mesaj_limiti}</span>
                       <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${(u.toplam_gönderilen/u.günlük_mesaj_limiti)*100}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-xs text-slate-500 font-medium">
                     {new Date(u.kayıt_tarihi).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-6">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                       <CheckCircle size={12} /> AKTİF
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 text-slate-600 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                       <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
