
import React, { useState } from 'react';
import { AppState, ContactType, RehberVerisi } from '../types';
import { Search, Filter, Users, User, Plus, Trash2, CheckSquare, Square, Download, Share2 } from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const ContactManager: React.FC<Props> = ({ state, setState }) => {
  const [activeSubTab, setActiveSubTab] = useState<ContactType>(ContactType.GROUP);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredContacts = state.contacts.filter(c => 
    c.tür === activeSubTab && 
    (c.isim.toLowerCase().includes(searchTerm.toLowerCase()) || c.wa_id.includes(searchTerm))
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleDelete = (id: string) => {
    setState(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id)
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Portföy Yönetimi</h2>
           <p className="text-slate-500 text-sm font-medium">Senkronize edilen tüm WhatsApp verileri burada listelenir.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-[22px]">
            <button 
              onClick={() => { setActiveSubTab(ContactType.GROUP); setSelectedIds(new Set()); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${
                activeSubTab === ContactType.GROUP ? 'bg-[#25D366] text-slate-950 shadow-lg shadow-[#25D366]/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Users size={16} />
              Gruplar ({state.contacts.filter(c => c.tür === ContactType.GROUP).length})
            </button>
            <button 
              onClick={() => { setActiveSubTab(ContactType.CONTACT); setSelectedIds(new Set()); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${
                activeSubTab === ContactType.CONTACT ? 'bg-[#25D366] text-slate-950 shadow-lg shadow-[#25D366]/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              <User size={16} />
              Kişiler ({state.contacts.filter(c => c.tür === ContactType.CONTACT).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
              <Download size={20} />
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-950 rounded-[22px] text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
              <Plus size={18} />
              Manuel Veri Ekle
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/80">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="İsim veya WhatsApp ID ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 transition-all placeholder:text-slate-700"
            />
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Görünüm Modu:</span>
             <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-700">
                   <Share2 size={14} />
                </div>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                <th className="px-8 py-6 w-12">
                  <button onClick={toggleSelectAll} className="hover:scale-110 transition-transform">
                    {selectedIds.size === filteredContacts.length && filteredContacts.length > 0 
                      ? <CheckSquare size={20} className="text-[#25D366]" /> 
                      : <Square size={20} className="text-slate-800" />
                    }
                  </button>
                </th>
                <th className="px-8 py-6">Kitle Tanımı</th>
                <th className="px-8 py-6">WhatsApp Gateway (JID)</th>
                {activeSubTab === ContactType.GROUP && <th className="px-8 py-6">Erişim Kapasitesi</th>}
                <th className="px-8 py-6 text-right">Yönetim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="space-y-4 opacity-30">
                       <Users size={64} className="mx-auto" />
                       <p className="text-sm font-black uppercase tracking-widest">Kayıtlı Veri Bulunamadı</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className={`transition-all group ${selectedIds.has(contact.id) ? 'bg-[#25D366]/5' : 'hover:bg-slate-800/30'}`}>
                    <td className="px-8 py-6">
                      <button onClick={() => toggleSelect(contact.id)} className="transition-transform active:scale-90">
                        {selectedIds.has(contact.id) 
                          ? <CheckSquare size={20} className="text-[#25D366]" /> 
                          : <Square size={20} className="text-slate-800 group-hover:text-slate-700" />
                        }
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-[#25D366] font-black border border-slate-700 shadow-xl group-hover:scale-110 transition-transform">
                          {contact.isim[0]}
                        </div>
                        <div>
                          <p className="text-white font-black text-sm">{contact.isim}</p>
                          <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{contact.tür}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-400 font-mono tracking-tighter">
                      {contact.wa_id}
                    </td>
                    {activeSubTab === ContactType.GROUP && (
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full">
                          <Users size={12} className="text-blue-500" />
                          <span className="text-xs font-black text-slate-300">
                            {contact.üye_sayısı} Aktif Üye
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleDelete(contact.id)} className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {selectedIds.size > 0 && (
          <div className="p-6 bg-[#25D366] text-slate-950 flex flex-col sm:flex-row items-center justify-between font-black animate-in slide-in-from-bottom-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
               <div className="bg-slate-950 text-[#25D366] px-3 py-1 rounded-lg text-xs">
                  {selectedIds.size}
               </div>
               <span className="uppercase tracking-widest text-sm">Öğe Seçildi</span>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-slate-950 text-white rounded-2xl text-xs uppercase tracking-widest hover:bg-black transition-all">
                Kampanya Listesine Ekle
              </button>
              <button className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-xs uppercase tracking-widest hover:bg-rose-700 transition-all">
                Tümünü Sil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManager;
