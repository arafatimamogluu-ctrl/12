
import React, { useState } from 'react';
import { Database, ShieldCheck, X, Save, AlertCircle, MessageSquare, Globe, Server, Monitor, Terminal, Zap, Cloud, ExternalLink, HelpCircle, CheckCircle2, ShoppingCart, Search } from 'lucide-react';
import { GatewayProvider } from '../types';

interface Props {
  onClose: () => void;
}

const SystemConfig: React.FC<Props> = ({ onClose }) => {
  const [provider, setProvider] = useState<GatewayProvider>(
    (localStorage.getItem('WA_PROVIDER') as GatewayProvider) || GatewayProvider.EVOLUTION
  );
  const [waUrl, setWaUrl] = useState(localStorage.getItem('WA_API_URL') || 'http://localhost:8080');
  const [waKey, setWaKey] = useState(localStorage.getItem('WA_API_KEY') || '4224772477247724');

  const handleSave = () => {
    localStorage.setItem('WA_PROVIDER', provider);
    localStorage.setItem('WA_API_URL', waUrl);
    localStorage.setItem('WA_API_KEY', waKey);
    window.location.reload();
  };

  const providers = [
    { name: 'Evolution Hosting', desc: 'Hazır kurulu Evolution API servisi.', link: 'https://www.google.com/search?q=evolution+api+hosting+turkiye' },
    { name: 'DigitalOcean VPS', desc: 'Kendi bulut sunucunuzu 5$\'a kurun.', link: 'https://www.digitalocean.com' },
    { name: 'Z-API', desc: 'Yüksek hacimli gönderimler için global servis.', link: 'https://www.z-api.io' },
    { name: 'UltraMsg', desc: 'Basit ve hızlı WhatsApp API.', link: 'https://ultramsg.com' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 my-10">
        
        {/* Header */}
        <div className="p-10 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-950">
          <div className="flex items-center gap-5">
            <div className="bg-blue-500/20 p-4 rounded-[24px] text-blue-400">
              <HelpCircle size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Sistem Yapılandırması</h2>
              <p className="text-slate-500 text-sm font-medium italic">Motor seçimi ve bağlantı ayarları</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-full text-slate-500 transition-all">
            <X size={28} />
          </button>
        </div>

        <div className="p-10 space-y-10">
          
          {/* Yol Ayrımı */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onClick={() => { setWaUrl('http://localhost:8080'); setWaKey('4224772477247724'); }}
              className={`p-8 rounded-[40px] border-2 cursor-pointer transition-all relative overflow-hidden group ${
                waUrl.includes('localhost') ? 'bg-emerald-500/10 border-emerald-500 ring-8 ring-emerald-500/5' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative z-10 space-y-4">
                <Monitor className={waUrl.includes('localhost') ? 'text-emerald-500' : 'text-slate-600'} size={32} />
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Ücretsiz (Lokal)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">Docker Desktop gerektirir. Bilgisayarınız açıkken çalışır.</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => { setWaUrl(''); setWaKey(''); }}
              className={`p-8 rounded-[40px] border-2 cursor-pointer transition-all relative overflow-hidden group ${
                !waUrl.includes('localhost') && waUrl !== '' ? 'bg-blue-500/10 border-blue-500 ring-8 ring-blue-500/5' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative z-10 space-y-4">
                <Cloud className={!waUrl.includes('localhost') && waUrl !== '' ? 'text-blue-500' : 'text-slate-600'} size={32} />
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Profesyonel (Bulut)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">Sunucu veya hazır API gerektirir. 7/24 kesintisiz çalışır.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Önerilen Servisler (Sadece Bulut Seçiliyse Görünür) */}
          {!waUrl.includes('localhost') && (
            <div className="animate-in fade-in slide-in-from-top-4 space-y-6">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-[#25D366]" />
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Önerilen Servis Sağlayıcılar</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {providers.map((p, i) => (
                  <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="p-5 bg-slate-950 border border-slate-800 rounded-3xl hover:border-blue-500 transition-all group">
                    <p className="text-white font-black text-xs mb-1 group-hover:text-blue-400 flex items-center justify-between">
                      {p.name} <ExternalLink size={12} />
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium leading-tight">{p.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Ayarlar Formu */}
          <div className="bg-slate-950 p-8 rounded-[36px] border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <Terminal size={20} className="text-blue-400" />
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Bağlantı Detayları</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Motor Adresi (URL)</label>
                  <input 
                    type="text" value={waUrl} onChange={(e) => setWaUrl(e.target.value)} 
                    placeholder="https://api.servis.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-blue-500/20 transition-all font-mono text-sm" 
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">API Anahtarı (Token)</label>
                  <input 
                    type="password" value={waKey} onChange={(e) => setWaKey(e.target.value)} 
                    placeholder="Size verilen özel şifre..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-blue-500/20 transition-all font-mono text-sm" 
                  />
               </div>
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-950/50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-5 border border-slate-800 text-slate-500 rounded-3xl font-black text-sm uppercase hover:bg-slate-900 transition-all">İptal</button>
          <button onClick={handleSave} className="flex-[2] py-5 bg-[#25D366] text-slate-950 rounded-3xl font-black text-xl hover:bg-[#1fb355] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#25D366]/20">
            <Save size={24} />
            AYARLARI KAYDET VE BAĞLAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
