
import React, { useState } from 'react';
import { Zap, Mail, Lock, Loader2, ArrowRight, ShieldCheck, CheckCircle, Star, AlertCircle } from 'lucide-react';
import { db } from '../lib/database';

interface Props {
  onLogin: (email: string, pass: string) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const profile = await db.login(email, password);
      if (profile) {
        onLogin(email, password);
      } else {
        setError('Geçersiz kimlik bilgileri.');
      }
    } catch (e) {
      setError('Sistem hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020617] text-slate-200">
      {/* Sol Panel: Vitrin */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 bg-gradient-to-br from-slate-900 to-black border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#25D366] p-3 rounded-2xl shadow-2xl shadow-[#25D366]/20">
              <Zap className="text-slate-950 fill-slate-950" size={32} />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter uppercase">WA<span className="text-[#25D366]">SaaS</span> ELITE</span>
          </div>

          <h2 className="text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
            WhatsApp Marketing <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-emerald-400">
              Ustalık Seviyesinde
            </span> <br/>
            Şimdi Başlıyor.
          </h2>

          <div className="space-y-6 max-w-lg">
            {[
              "Yapay Zeka Destekli Anti-Ban Koruması",
              "Toplu Grup & Rehber Mesajlaşma",
              "Görsel ve Video Mesaj Desteği",
              "7/24 Bulut Tabanlı Otomasyon"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-400">
                <div className="bg-emerald-500/10 p-1 rounded-full text-emerald-500">
                  <CheckCircle size={18} />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 bg-slate-800/30 p-8 rounded-[32px] border border-slate-700/50 backdrop-blur-md">
           <p className="text-slate-300 italic mb-6">"Bu sistemle 10.000+ üyeye tek tıkla ulaştık. Kesinlikle rakipsiz."</p>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-full border border-slate-600"></div>
              <div>
                <p className="text-white font-bold">Arafat İMAMOĞLU</p>
                <p className="text-slate-500 text-sm">Founder of WASaaS</p>
              </div>
           </div>
        </div>
      </div>

      {/* Sağ Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="text-center lg:text-left">
            <h3 className="text-4xl font-black text-white mb-3 tracking-tight">Giriş Yap</h3>
            <p className="text-slate-500 font-medium">SaaS panelinize erişmek için e-posta ve şifrenizi girin.</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-Posta Adresi</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#25D366] transition-colors" size={20} />
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 transition-all"
                    placeholder="ornek@domain.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Güvenli Şifre</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#25D366] transition-colors" size={20} />
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-[#25D366] text-slate-950 rounded-2xl font-black text-lg hover:bg-[#1fb355] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#25D366]/20 active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Paneli Başlat <ArrowRight size={22} /></>}
            </button>
          </form>

          <div className="pt-10 border-t border-slate-800 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
             <ShieldCheck size={20} />
             <span className="text-[10px] font-black uppercase tracking-widest">Enterprise v3.2 Secure Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
