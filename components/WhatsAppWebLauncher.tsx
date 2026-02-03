
import React from 'react';
import { Globe, ExternalLink, ShieldCheck, Zap, Info } from 'lucide-react';

const WhatsAppWebLauncher: React.FC = () => {
  const openWhatsApp = () => {
    // WhatsApp Web'i belirli boyutlarda bir pop-up pencere olarak açar
    const width = 1200;
    const height = 800;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      'https://web.whatsapp.com', 
      'WhatsAppWeb', 
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,location=no`
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-12 text-center space-y-8 bg-gradient-to-b from-slate-950/50 to-transparent">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#25D366] blur-[60px] opacity-20 animate-pulse"></div>
            <div className="relative bg-[#25D366] p-8 rounded-[36px] shadow-2xl shadow-[#25D366]/30 transform -rotate-6">
              <Globe className="text-slate-950" size={64} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tighter">Gerçek WhatsApp Web</h2>
            <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Güvenlik protokolleri gereği, orijinal WhatsApp Web'i doğrudan bu panelin içine gömemeyiz. Ancak tek tıkla **bağımsız bir pencerede** açabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
             <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-3xl flex items-start gap-4 text-left">
                <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Resmi & Güvenli</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">WhatsApp'ın kendi sunucuları üzerinden doğrudan login olursunuz. Şifreleriniz asla bize ulaşmaz.</p>
                </div>
             </div>
             <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-3xl flex items-start gap-4 text-left">
                <Zap className="text-blue-500 shrink-0" size={24} />
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Eşzamanlı Çalışma</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">Otomasyon panelimiz arka planda çalışırken siz bu pencereden sohbetlerinize devam edebilirsiniz.</p>
                </div>
             </div>
          </div>

          <button 
            onClick={openWhatsApp}
            className="px-12 py-6 bg-[#25D366] text-slate-950 rounded-[28px] font-black text-2xl hover:bg-[#1fb355] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#25D366]/20 mx-auto active:scale-95 group"
          >
            <ExternalLink size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            WHATSAPP WEB'İ BAŞLAT
          </button>

          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Info size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Açılan pencereyi ekranınızın yanına sabitleyebilirsiniz.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppWebLauncher;
