
import React, { useState } from 'react';
import { Database, ShieldCheck, X, Save, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const SupabaseConfig: React.FC<Props> = ({ onClose }) => {
  const [url, setUrl] = useState(localStorage.getItem('SUPABASE_URL') || '');
  const [key, setKey] = useState(localStorage.getItem('SUPABASE_KEY') || '');

  const handleSave = () => {
    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_KEY', key);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Backend Yapılandırması</h2>
              <p className="text-slate-500 text-xs font-medium">Sistemi kendi Supabase hesabına bağla</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3">
            <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Bu uygulama varsayılan olarak demo modunda çalışır. Verilerin gerçekten kalıcı olması ve Auth sisteminin aktif olması için Supabase projenizden aldığınız <b>URL</b> ve <b>Anon Key</b> bilgilerini girin.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Supabase Project URL</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Anon / Public API Key</label>
              <input 
                type="password" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJh..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-950 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 border border-slate-800 text-slate-400 rounded-2xl font-bold hover:bg-slate-900 transition-all"
          >
            Vazgeç
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] py-3.5 bg-emerald-500 text-slate-950 rounded-2xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Kaydet ve Yeniden Başlat
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConfig;
