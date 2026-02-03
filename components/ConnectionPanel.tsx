
import React, { useState, useEffect, useRef } from 'react';
import { AppState, WASessionStatus, RehberVerisi, ContactType } from '../types';
import { waApi } from '../lib/whatsapp';
import { 
  QrCode, CheckCircle2, RefreshCw, 
  Smartphone, Database, Loader2, Zap, 
  ShieldCheck, Terminal, Info,
  LogOut, Activity, Network, Server,
  AlertTriangle, Monitor, HelpCircle,
  ExternalLink, Copy, Check, Power,
  Wrench, Settings, AlertOctagon, LifeBuoy, ArrowRight,
  // Fix: Added missing Cloud icon import
  Cloud
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const ConnectionPanel: React.FC<Props> = ({ state, setState }) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [engineStatus, setEngineStatus] = useState<'IDLE' | 'BOOTING' | 'WAITING_SCAN' | 'SYNCING' | 'LIVE' | 'ERROR'>('IDLE');
  const [isServerUp, setIsServerUp] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const pollingRef = useRef<any>(null);
  const healthCheckRef = useRef<any>(null);

  const isLocal = waApi.config.baseUrl.includes('localhost');
  const dockerCommand = `docker run -d --name evolution -p 8080:8080 -e AUTHENTICATION_API_KEY=4224772477247724 evolutionapi/evolution-api:latest`;

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));

  useEffect(() => {
    const check = async () => {
      const up = await waApi.checkHealth();
      setIsServerUp(up);
      if (up && engineStatus === 'ERROR') setEngineStatus('IDLE');
    };
    
    check();
    healthCheckRef.current = setInterval(check, 5000);
    
    return () => {
      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
    };
  }, [engineStatus]);

  useEffect(() => {
    if (state.session?.durum === WASessionStatus.CONNECTED) {
      setEngineStatus('LIVE');
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [state.session?.durum]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEngine = async () => {
    if (!waApi.isConfigured) {
      setEngineStatus('ERROR');
      addLog('HATA: Sistem ayarlarını kontrol edin.');
      return;
    }

    setLoading(true);
    setEngineStatus('BOOTING');
    addLog(`Motor başlatılıyor...`);

    try {
      const up = await waApi.checkHealth();
      if (!up) throw new Error("Motor kapalı");

      await waApi.createInstance(state.session!.instance_name);
      addLog('Motor yanıt verdi. QR alınıyor...');

      const qr = await waApi.getQrCode(state.session!.instance_name);
      if (qr) {
        const formattedQr = qr.startsWith('data:image') ? qr : `data:image/png;base64,${qr}`;
        setQrUrl(formattedQr);
        setEngineStatus('WAITING_SCAN');
        addLog('QR Hazır! Telefonunuzu hazırlayın.');
        startStatusPolling();
      } else {
        throw new Error("QR kod alınamadı.");
      }
    } catch (e: any) {
      setEngineStatus('ERROR');
      addLog(`BAĞLANTI YOK: Docker terminal komutu çalışıyor mu?`);
    } finally {
      setLoading(false);
    }
  };

  const startStatusPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      const stateStr = await waApi.checkStatus(state.session!.instance_name);
      if (stateStr === 'open' || stateStr === 'CONNECTED') {
        clearInterval(pollingRef.current);
        syncData();
      }
    }, 3000);
  };

  const syncData = async () => {
    setEngineStatus('SYNCING');
    addLog('Bağlantı kuruldu! Veriler aktarılıyor...');
    try {
      const data = await waApi.fetchAllData(state.session!.instance_name);
      addLog(`${data.length} kayıt senkronize edildi.`);

      setState(prev => ({
        ...prev,
        contacts: data,
        session: prev.session ? { ...prev.session, durum: WASessionStatus.CONNECTED } : null
      }));
      setEngineStatus('LIVE');
      setQrUrl(null);
    } catch (e) {
      setEngineStatus('ERROR');
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await waApi.logout(state.session!.instance_name);
    setState(prev => ({
      ...prev,
      session: prev.session ? { ...prev.session, durum: WASessionStatus.DISCONNECTED } : null,
      contacts: []
    }));
    setEngineStatus('IDLE');
    setQrUrl(null);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* ÜST DURUM BAR */}
      <div className={`p-8 rounded-[40px] border flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${
        isServerUp ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-rose-500/10 border-rose-500/20 shadow-2xl shadow-rose-500/10'
      }`}>
         <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${
              isServerUp ? 'bg-emerald-500 text-slate-950 scale-110 shadow-xl' : 'bg-rose-500 text-white animate-pulse'
            }`}>
               <Power size={32} strokeWidth={3} />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">API MOTORU DURUMU</p>
               <h4 className={`text-2xl font-black uppercase italic tracking-tighter ${isServerUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {isServerUp ? 'Sistem Hazır - Motor Çalışıyor' : 'Motor Cevap Vermiyor'}
               </h4>
            </div>
         </div>
         
         {!isServerUp && (
           <div className="flex gap-3">
              <button 
                onClick={() => setShowTroubleshooter(!showTroubleshooter)}
                className="flex items-center gap-3 px-8 py-4 bg-rose-500 text-white rounded-[24px] font-black text-sm uppercase hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20"
              >
                <Wrench size={18} />
                ÇÖZÜM BUL
              </button>
           </div>
         )}
      </div>

      {/* DOCKER & API REHBERİ (Sorun Varsa Gözükür) */}
      {!isServerUp && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Sol: Docker Yolu */}
           <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 space-y-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="absolute -top-10 -right-10 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                 <Monitor size={200} />
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Kendi Bilgisayarın (Lokal)</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                 Docker Desktop uygulamasını çalıştırıp aşağıdaki komutu terminale yapıştırın. Eğer Docker açılmıyorsa <b>BIOS ayarlarından Sanallaştırmayı</b> açmanız gerekir.
              </p>
              <div className="bg-black p-6 rounded-3xl border border-white/5 font-mono text-xs text-emerald-400 break-all">
                {dockerCommand}
              </div>
              <button onClick={copyToClipboard} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                 {copied ? <Check size={16} /> : <Copy size={16} />}
                 {copied ? 'KOD KOPYALANDI' : 'KOMUTU KOPYALA'}
              </button>
           </div>

           {/* Sağ: Bulut Yolu */}
           <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 space-y-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute -top-10 -right-10 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                 <Cloud size={200} />
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Ücretli Hazır API (Bulut)</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                 Bilgisayarınla uğraşmak istemiyorsan, internetten bir <b>Evolution API URL</b>'si satın alabilirsin. Bu sayede Docker kurmana gerek kalmaz.
              </p>
              <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
                 <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                    <Zap size={14} /> Avantajlar:
                 </div>
                 <ul className="text-[10px] text-slate-400 space-y-2">
                    <li>• Bilgisayar kapalıyken bile çalışır</li>
                    <li>• Docker kurulumu gerektirmez</li>
                    <li>• Daha hızlı ve kararlıdır</li>
                 </ul>
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                 BULUT API HİZMETİ AL <ExternalLink size={16} />
              </button>
           </div>
        </div>
      )}

      {/* ANA BAĞLANTI PANELİ */}
      <div className="bg-slate-900 border border-slate-800 rounded-[56px] overflow-hidden shadow-2xl transition-all">
        <div className="p-12 border-b border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className={`p-8 rounded-[32px] transition-all duration-1000 shadow-2xl ${
              engineStatus === 'LIVE' ? 'bg-[#25D366] text-slate-950 scale-110' : 'bg-slate-800 text-slate-500'
            }`}>
              {engineStatus === 'LIVE' ? <Zap size={48} fill="currentColor" /> : <Smartphone size={48} />}
            </div>
            <div>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">WhatsApp Engine</h2>
              <div className="flex items-center gap-3 mt-3">
                <div className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border ${
                  engineStatus === 'LIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${engineStatus === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  {engineStatus === 'LIVE' ? 'SİSTEM ÇEVRİMİÇİ' : 'BAĞLANTI BEKLENİYOR'}
                </div>
              </div>
            </div>
          </div>
          {engineStatus === 'LIVE' && (
            <button onClick={handleLogout} className="px-12 py-6 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[32px] text-sm font-black hover:bg-rose-500 hover:text-white transition-all active:scale-95 group flex items-center gap-3">
              <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
              OTURUMU KAPAT
            </button>
          )}
        </div>

        <div className="p-16">
          {engineStatus === 'LIVE' ? (
            <div className="py-16 text-center space-y-12 animate-in zoom-in-95 duration-700">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#25D366] blur-[120px] opacity-20"></div>
                <div className="relative w-64 h-64 bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 rounded-[80px] flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle2 size={120} strokeWidth={3} />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Bağlantı Aktif</h3>
                <p className="text-slate-400 text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                  WhatsApp hesabınız başarıyla otomasyona bağlandı. Artık Marketing Hub üzerinden mesaj göndermeye başlayabilirsiniz.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-16">
                <div className="space-y-8">
                  <h3 className="text-7xl font-black text-white leading-[1] tracking-tighter uppercase italic">
                    Hemen <br/> <span className="text-[#25D366]">Bağlan</span>
                  </h3>
                  <p className="text-slate-400 text-2xl font-medium leading-relaxed">
                    Motorunuz (API) hazırsa aşağıdaki butona basarak QR kodu oluşturun.
                  </p>
                </div>

                <div className="space-y-6">
                  {(engineStatus === 'IDLE' || engineStatus === 'ERROR') && (
                    <button 
                      onClick={startEngine}
                      disabled={loading || !isServerUp}
                      className="w-full py-10 bg-[#25D366] text-slate-950 rounded-[40px] font-black text-3xl hover:bg-[#1fb355] transition-all flex items-center justify-center gap-6 shadow-2xl shadow-[#25D366]/30 active:scale-95 disabled:opacity-20 uppercase"
                    >
                      {loading ? <Loader2 className="animate-spin" size={32} /> : <><Zap size={40} fill="currentColor" /> MOTORU ÇALIŞTIR</>}
                    </button>
                  )}

                  {engineStatus === 'WAITING_SCAN' && (
                    <div className="bg-emerald-500/10 p-12 rounded-[48px] border-2 border-emerald-500/20 space-y-8 animate-in slide-in-from-top-6">
                      <div className="flex items-center gap-6 text-[#25D366]">
                        <RefreshCw size={32} className="animate-spin" />
                        <span className="text-2xl font-black uppercase tracking-widest italic">QR Bekleniyor...</span>
                      </div>
                      <p className="text-lg text-slate-400 font-medium leading-relaxed">Telefonunuzdan "Bağlı Cihazlar" kısmına girip taratın.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-20 bg-[#25D366]/20 blur-[120px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative bg-white p-16 rounded-[80px] shadow-2xl border-[20px] border-slate-950 transition-all transform hover:scale-105">
                    {qrUrl ? (
                      <img src={qrUrl} alt="WA QR" className="w-80 h-80 select-none" />
                    ) : (
                      <div className="w-80 h-80 flex flex-col items-center justify-center gap-10 opacity-10">
                        <QrCode size={160} className="text-slate-950" />
                        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Bağlantı Bekleniyor</p>
                      </div>
                    )}
                    {loading && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center rounded-[60px]">
                         <Loader2 size={80} className="text-[#25D366] animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Console Log Monitor */}
        <div className="bg-black/98 border-t border-slate-800 p-10 font-mono text-[12px] h-72 overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-slate-800 italic text-center py-20 uppercase tracking-[0.5em] font-black">Sistem Sinyalleri Bekleniyor</p>
            ) : logs.map((log, i) => (
              <div key={i} className="flex gap-6 items-center">
                 <span className="text-slate-800 font-black">[{i.toString().padStart(2, '0')}]</span>
                 <span className={`${log.includes('HATA') ? 'text-rose-500' : 'text-[#25D366]'} font-bold`}>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPanel;
