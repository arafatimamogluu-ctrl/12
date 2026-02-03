
import React, { useState } from 'react';
import { AppState, CampaignStatus, MessageStatus, MessageType, Kampanya, MesajKuyrugu, WASessionStatus } from '../types';
import { 
  Send, Smile, Paperclip, Calendar, Clock, Shield, CheckCircle2, AlertCircle,
  BarChart3, Loader2, Trash2, Image as ImageIcon, Video, FileText, Save, List
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CampaignCreator: React.FC<Props> = ({ state, setState }) => {
  const [campName, setCampName] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState<MessageType>(MessageType.TEXT);
  const [mediaUrl, setMediaUrl] = useState('');
  const [minDelay, setMinDelay] = useState(10);
  const [maxDelay, setMaxDelay] = useState(30);
  const [simulateTyping, setSimulateTyping] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const startCampaign = () => {
    if (!message || state.contacts.length === 0) return;
    setIsStarting(true);
    
    setTimeout(() => {
      const campId = Math.random().toString(36).substr(2, 9);
      const newCampaign: Kampanya = {
        id: campId,
        user_id: state.user?.id || '',
        isim: campName || `Kampanya #${campId}`,
        mesaj_metni: message,
        mesaj_tipi: msgType,
        medya_url: mediaUrl,
        planlanan_zaman: new Date().toLocaleString(),
        min_gecikme: minDelay,
        max_gecikme: maxDelay,
        simule_yaziyor: simulateTyping,
        durum: CampaignStatus.ACTIVE,
        hedef_liste: state.contacts.map(c => c.wa_id)
      };

      const newQueueItems: MesajKuyrugu[] = state.contacts.map(contact => ({
        id: Math.random().toString(36).substr(2, 9),
        kampanya_id: campId,
        alıcı_id: contact.wa_id,
        alıcı_ismi: contact.isim,
        durum: MessageStatus.WAITING
      }));

      setState(prev => ({
        ...prev,
        campaigns: [newCampaign, ...prev.campaigns],
        queue: [...prev.queue, ...newQueueItems]
      }));
      
      setCampName('');
      setMessage('');
      setMediaUrl('');
      setIsStarting(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10">
          <header className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <Send size={28} className="text-[#25D366]" />
                Marketing Hub
              </h3>
              <p className="text-slate-500 text-sm font-medium">Yeni bir toplu mesajlaşma kampanyası kurgulayın.</p>
            </div>
            <div className="flex gap-2">
               <button className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all">
                  <Save size={20} />
               </button>
               <button className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all">
                  <List size={20} />
               </button>
            </div>
          </header>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kampanya Başlığı</label>
                  <input 
                    type="text" value={campName} onChange={(e) => setCampName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#25D366]/20 transition-all"
                    placeholder="Eğitim Grubu Duyurusu..."
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mesaj Tipi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: MessageType.TEXT, icon: FileText, label: 'Metin' },
                      { id: MessageType.IMAGE, icon: ImageIcon, label: 'Görsel' },
                      { id: MessageType.VIDEO, icon: Video, label: 'Video' }
                    ].map(type => (
                      <button 
                        key={type.id} onClick={() => setMsgType(type.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                          msgType === type.id ? 'bg-[#25D366] border-[#25D366] text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        <type.icon size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {msgType !== MessageType.TEXT && (
              <div className="space-y-2 animate-in slide-in-from-top-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Medya URL / Bağlantısı</label>
                <div className="relative">
                  <Paperclip className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                  <input 
                    type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:ring-2 focus:ring-[#25D366]/20 transition-all"
                    placeholder="https://sunucu.com/resim.jpg"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mesaj Metni</label>
              <textarea 
                value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[28px] p-8 text-white min-h-[180px] focus:ring-2 focus:ring-[#25D366]/20 transition-all resize-none shadow-inner"
                placeholder="Selam! Harika bir haberim var... {isim} değişkenini kullanabilirsiniz."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-950 p-6 rounded-[28px] border border-slate-800 space-y-6">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <Shield size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Anti-Ban Ayarları</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase">Min Gecikme</span>
                      <input type="number" value={minDelay} onChange={(e) => setMinDelay(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm" />
                   </div>
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase">Max Gecikme</span>
                      <input type="number" value={maxDelay} onChange={(e) => setMaxDelay(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm" />
                   </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={simulateTyping} onChange={(e) => setSimulateTyping(e.target.checked)} className="peer hidden" />
                  <div className="w-10 h-6 bg-slate-800 rounded-full border border-slate-700 peer-checked:bg-[#25D366] transition-all relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">"Yazıyor..." Simülasyonu</span>
                </label>
              </div>

              <div className="bg-slate-950 p-6 rounded-[28px] border border-slate-800 space-y-4">
                 <div className="flex items-center gap-2 text-blue-500">
                  <Calendar size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Planlama</h4>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Durum: Hemen Gönder</span>
                      <CheckCircle2 size={16} className="text-[#25D366]" />
                   </div>
                   <p className="text-[10px] text-slate-600 italic leading-relaxed">Sistem, belirlenen gecikme aralıklarında mesajları tek tek sıraya koyarak güvenli bir şekilde iletir.</p>
                </div>
              </div>
            </div>

            <button 
              disabled={!message || isStarting || state.session?.durum !== WASessionStatus.CONNECTED}
              onClick={startCampaign}
              className="w-full py-6 bg-[#25D366] text-slate-950 rounded-[32px] font-black text-2xl hover:bg-[#1fb355] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#25D366]/20 active:scale-95 disabled:opacity-20"
            >
              {isStarting ? <Loader2 className="animate-spin" /> : <><Send size={28} /> OTOMASYONU BAŞLAT</>}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 flex flex-col h-full shadow-2xl">
          <header className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white flex items-center gap-3 uppercase tracking-tighter">
              <BarChart3 size={20} className="text-blue-500" />
              Aktif Kuyruk
            </h3>
            <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-black rounded-lg">{state.queue.length} BEKLEYEN</span>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar">
            {state.queue.length === 0 ? (
              <div className="py-32 text-center opacity-20">
                 <AlertCircle size={48} className="mx-auto mb-4" />
                 <p className="text-xs font-black uppercase tracking-widest">Kuyruk Şu An Boş</p>
              </div>
            ) : (
              state.queue.slice().reverse().map(msg => (
                <div key={msg.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                       msg.durum === MessageStatus.SENT ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-900 text-slate-700'
                     }`}>
                        {msg.durum === MessageStatus.SENT ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                     </div>
                     <div>
                        <p className="text-sm font-black text-white">{msg.alıcı_ismi}</p>
                        <p className="text-[10px] font-mono text-slate-600">{msg.alıcı_id}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                       msg.durum === MessageStatus.SENT ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'
                    }`}>{msg.durum}</span>
                    <p className="text-[8px] text-slate-700 mt-1">{msg.gönderim_zamanı || '--:--'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {state.queue.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-800">
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  <span>İlerleme Oranı</span>
                  <span className="text-[#25D366]">% {Math.round((state.queue.filter(m => m.durum === MessageStatus.SENT).length / state.queue.length) * 100)}</span>
               </div>
               <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-[#25D366] to-emerald-400 transition-all duration-1000"
                    style={{ width: `${(state.queue.filter(m => m.durum === MessageStatus.SENT).length / state.queue.length) * 100}%` }}
                  ></div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCreator;
