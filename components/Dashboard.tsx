
import React from 'react';
import { AppState, MessageStatus, CampaignStatus } from '../types';
import { MessageCircle, CheckCircle, Clock, XCircle, TrendingUp, Activity, Users, Shield, Zap, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const stats = [
    { label: 'Gönderim Gücü', value: `%${Math.round(((state.user?.toplam_gönderilen || 0) / (state.user?.günlük_mesaj_limiti || 1)) * 100)}`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Günlük Limit Kullanımı' },
    { label: 'Başarı Oranı', value: '%99.2', icon: CheckCircle, color: 'text-[#25D366]', bg: 'bg-[#25D366]/10', desc: 'İletim Garantisi' },
    { label: 'Aktif Kişiler', value: state.contacts.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Senkronize Rehber' },
    { label: 'Kazanılan Zaman', value: '42s', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Manuel Tasarruf' },
  ];

  const chartData = [
    { name: '08:00', sent: 12 }, { name: '10:00', sent: 45 }, { name: '12:00', sent: 30 },
    { name: '14:00', sent: 85 }, { name: '16:00', sent: 48 }, { name: '18:00', sent: 120 }, { name: '20:00', sent: 65 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Üst Karşılama */}
      <div className="bg-gradient-to-r from-[#25D366]/20 to-transparent p-8 rounded-[40px] border border-[#25D366]/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2">Hoş Geldin, Elite Kullanıcı!</h2>
          <p className="text-slate-400 font-medium max-w-md">Bugün kampanyaların %100 performansla çalışıyor. Sistem durumu: <span className="text-[#25D366] font-bold">MÜKEMMEL</span></p>
        </div>
        <div className="flex gap-4 relative z-10">
           <div className="bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 text-center px-8">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Hesap Türü</p>
              <p className="text-[#25D366] font-black tracking-tight">PLATINUM PRO</p>
           </div>
           <button className="bg-[#25D366] text-slate-950 px-8 py-4 rounded-3xl font-black hover:scale-105 transition-all shadow-xl shadow-[#25D366]/20">
              YÜKSELT
           </button>
        </div>
      </div>

      {/* Grid Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[36px] hover:border-slate-700 transition-all group cursor-default">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
            <p className="text-slate-600 text-xs font-medium">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                  <Activity size={24} className="text-[#25D366]" />
                  Kampanya Performansı
                </h3>
              </div>
              <select className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-400 outline-none">
                <option>Son 24 Saat</option>
                <option>Son 7 Gün</option>
              </select>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#25D366" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#25D366" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                    itemStyle={{ color: '#25D366' }}
                  />
                  <Area type="monotone" dataKey="sent" stroke="#25D366" strokeWidth={4} fillOpacity={1} fill="url(#colorSent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px] flex flex-col">
          <h3 className="text-xl font-black text-white mb-8 flex items-center gap-2 uppercase tracking-tighter">
            <Shield size={24} className="text-blue-500" />
            Güvenlik Durumu
          </h3>
          <div className="space-y-6 flex-1">
             <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <div className="flex justify-between mb-4">
                   <span className="text-xs font-black text-slate-500 uppercase">Anti-Ban Koruma</span>
                   <span className="text-emerald-500 text-xs font-bold uppercase">AKTİF</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[95%]"></div>
                </div>
             </div>
             
             <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
                <h4 className="text-blue-400 font-bold mb-2">Yapay Zeka Asistanı</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Sistem, mesaj gönderim aralıklarını WhatsApp'ın en son spam filtre güncellemelerine göre otomatik optimize ediyor.</p>
             </div>
             
             <div className="bg-slate-800/20 p-6 rounded-3xl border border-slate-800 border-dashed text-center">
                <Zap size={32} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 text-xs font-medium">Bekleyen Kritik Güncelleme Yok</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
