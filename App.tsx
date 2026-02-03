
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Share2, Users, MessageSquare, ShieldCheck, LogOut, Zap, 
  Settings, Database, Github, AlertCircle, Terminal, Cpu
} from 'lucide-react';
import { 
  AppState, UserRole, SubscriptionType, WASessionStatus, 
  ContactType, CampaignStatus, MessageStatus, Profile,
  WASession, RehberVerisi, Kampanya, MesajKuyrugu, LogEntry
} from './types';
import { db } from './lib/database';
import { waApi } from './lib/whatsapp';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ConnectionPanel from './components/ConnectionPanel';
import ContactManager from './components/ContactManager';
import CampaignCreator from './components/CampaignCreator';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import SystemConfig from './components/SystemConfig';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [state, setState] = useState<AppState>({
    user: null,
    session: null,
    contacts: [],
    campaigns: [],
    sablonlar: [],
    queue: [],
    users: [],
    logs: [],
  });

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setState(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 50)
    }));
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    const profile = await db.login(email, pass);
    if (!profile) return;

    const savedState = db.loadAppState(email);
    if (savedState) {
      setState({ ...savedState, user: profile });
      addLog(`Oturum açıldı: ${email}`, 'success');
    } else {
      const instanceName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const initialUsers = profile.rol === UserRole.ADMIN ? [profile] : [profile];
      
      setState(prev => ({
        ...prev,
        user: profile,
        users: initialUsers,
        session: { 
          id: 's1', 
          instance_name: instanceName, 
          user_id: profile.id, 
          durum: WASessionStatus.DISCONNECTED, 
          qr_verisi: null, 
          pairing_code: null 
        },
        contacts: [],
        logs: []
      }));
      addLog(`Profil ve engine yapılandırıldı.`, 'info');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    db.logout();
    setIsAuthenticated(false);
    setState({ user: null, session: null, contacts: [], campaigns: [], sablonlar: [], queue: [], users: [], logs: [] });
  };

  useEffect(() => {
    if (isAuthenticated && state.user) db.saveAppState(state);
  }, [state, isAuthenticated]);

  // SYSTEM WORKER: Kampanyaları ve Kuyruğu Yönetir
  useEffect(() => {
    if (!isAuthenticated || state.queue.length === 0 || !state.session || state.session.durum !== WASessionStatus.CONNECTED) return;

    const worker = async () => {
      const pendingIdx = state.queue.findIndex(m => m.durum === MessageStatus.WAITING);
      if (pendingIdx === -1) return;

      const msg = state.queue[pendingIdx];
      const camp = state.campaigns.find(c => c.id === msg.kampanya_id);

      if (camp && camp.durum === CampaignStatus.ACTIVE) {
        // İnsan Davranışı Gecikmesi
        const delay = Math.floor(Math.random() * (camp.max_gecikme - camp.min_gecikme + 1) + camp.min_gecikme) * 1000;
        
        // "Yazıyor..." Simülasyonu
        if (camp.simule_yaziyor) {
          setState(prev => {
            const newQueue = [...prev.queue];
            newQueue[pendingIdx] = { ...newQueue[pendingIdx], durum: MessageStatus.TYPING };
            return { ...prev, queue: newQueue };
          });
          await new Promise(r => setTimeout(r, 3000));
        }

        await new Promise(r => setTimeout(r, delay));

        // Mesaj Gönderimi
        const result = await waApi.sendMessage(state.session!.instance_name, msg.alıcı_id, camp.mesaj_metni);

        setState(prev => {
          const newQueue = [...prev.queue];
          newQueue[pendingIdx] = { 
            ...newQueue[pendingIdx], 
            durum: result.success ? MessageStatus.SENT : MessageStatus.ERROR, 
            gönderim_zamanı: new Date().toLocaleTimeString()
          };
          const newUser = prev.user && result.success ? { ...prev.user, toplam_gönderilen: prev.user.toplam_gönderilen + 1 } : prev.user;
          return { ...prev, queue: newQueue, user: newUser };
        });

        if (result.success) addLog(`İletildi: ${msg.alıcı_ismi}`, 'success');
        else addLog(`Başarısız: ${msg.alıcı_id}`, 'error');
      }
    };

    const timer = setTimeout(worker, 1000);
    return () => clearTimeout(timer);
  }, [state.queue, state.session, isAuthenticated, addLog, state.campaigns]);

  if (!isAuthenticated) return <Auth onLogin={handleLogin} />;
  if (showConfig) return <SystemConfig onClose={() => setShowConfig(false)} />;

  const isConnected = state.session?.durum === WASessionStatus.CONNECTED;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={state.user?.rol || UserRole.USER}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1500px] mx-auto p-6 lg:p-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-3xl border transition-all ${
                isConnected ? 'bg-[#25D366]/10 border-[#25D366]/20' : 'bg-slate-900 border-slate-800'
              }`}>
                {activeTab === 'dashboard' && <LayoutDashboard className={isConnected ? 'text-[#25D366]' : 'text-slate-500'} size={32} />}
                {activeTab === 'connections' && <Cpu className={isConnected ? 'text-[#25D366]' : 'text-slate-500'} size={32} />}
                {activeTab === 'contacts' && <Users className={isConnected ? 'text-[#25D366]' : 'text-slate-500'} size={32} />}
                {activeTab === 'campaigns' && <MessageSquare className={isConnected ? 'text-[#25D366]' : 'text-slate-500'} size={32} />}
                {activeTab === 'admin' && <ShieldCheck className="text-blue-500" size={32} />}
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{activeTab.replace('-', ' ')}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  <p className="text-slate-500 text-sm font-bold">{state.user?.email} <span className="mx-2 opacity-20">|</span> {state.user?.abonelik_türü}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setShowConfig(true)} className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl">
                <Settings size={16} />
                Sistem Altyapısı
              </button>
              <div className="flex items-center gap-4 bg-slate-950/80 p-2.5 pr-6 rounded-[24px] border border-slate-800 shadow-2xl">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-all ${
                  isConnected ? 'bg-gradient-to-br from-[#25D366] to-[#128C7E]' : 'bg-slate-800'
                }`}>
                  {state.user?.email[0].toUpperCase()}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Kredi Bakiyesi</p>
                   <p className="text-base font-black text-white">{state.user?.toplam_gönderilen} / {state.user?.günlük_mesaj_limiti}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="pb-40">
            {activeTab === 'dashboard' && <Dashboard state={state} />}
            {activeTab === 'connections' && <ConnectionPanel state={state} setState={setState} />}
            {activeTab === 'contacts' && <ContactManager state={state} setState={setState} />}
            {activeTab === 'campaigns' && <CampaignCreator state={state} setState={setState} />}
            {activeTab === 'admin' && <AdminPanel state={state} setState={setState} />}
          </div>
        </div>

        {/* Console Log Monitor */}
        <div className="fixed bottom-0 right-0 w-full lg:w-[500px] bg-slate-950/95 border-l border-t border-slate-800 backdrop-blur-xl z-50 shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-[#25D366]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Live System Engine</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-[#25D366] animate-pulse' : 'bg-rose-500'}`}></div>
            </div>
          </div>
          <div className="h-64 overflow-y-auto p-6 space-y-3 font-mono text-[10px] custom-scrollbar">
            {state.logs.length === 0 ? <p className="text-slate-700 italic text-center py-10">Sistem sinyalleri bekleniyor...</p> : state.logs.map(log => (
              <div key={log.id} className="flex gap-4 border-l-2 border-slate-800 pl-4 py-1">
                <span className="text-slate-600 font-bold">[{log.timestamp}]</span>
                <span className={`${log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-400' : 'text-blue-300'}`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
