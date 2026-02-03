
import { WASessionStatus, ContactType, RehberVerisi } from '../types';

class WhatsAppService {
  public get config() {
    return {
      baseUrl: localStorage.getItem('WA_API_URL')?.replace(/\/$/, '') || 'http://localhost:8080',
      apiKey: localStorage.getItem('WA_API_KEY') || '4224772477247724'
    };
  }

  public get isConfigured() {
    return this.config.baseUrl !== '' && this.config.apiKey !== '';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.config.apiKey
    };
  }

  // Yeni: Sunucunun ayakta olup olmadığını kontrol eder
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connectionState/health`, { 
        method: 'GET',
        headers: this.headers,
        signal: AbortSignal.timeout(2000) // 2 saniye içinde cevap gelmezse offline say
      });
      return response.status === 200 || response.status === 404; // 404 gelse bile sunucu ayaktadır (endpoint yanlış olsa bile)
    } catch (e) {
      return false;
    }
  }

  async createInstance(instanceName: string) {
    if (!this.isConfigured) throw new Error("API Yapılandırması Eksik!");
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/create`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ 
          instanceName, 
          token: this.config.apiKey, 
          qrcode: true,
          integration: "WHATSAPP-BAILEYS" 
        })
      });
      return await response.json();
    } catch (e) { 
      console.error("Instance Create Error:", e);
      return null; 
    }
  }

  async getQrCode(instanceName: string) {
    if (!this.isConfigured) return null;
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connect/${instanceName}`, {
        method: 'GET',
        headers: this.headers
      });
      const data = await response.json();
      if (data.base64) return data.base64;
      if (data.code) return data.code;
      return null;
    } catch (e) { return null; }
  }

  async fetchAllData(instanceName: string): Promise<RehberVerisi[]> {
    if (!this.isConfigured) return [];
    try {
      const [groupsRes, contactsRes] = await Promise.all([
        fetch(`${this.config.baseUrl}/group/fetchAllGroups/${instanceName}`, { headers: this.headers }),
        fetch(`${this.config.baseUrl}/contact/findAll/${instanceName}`, { headers: this.headers })
      ]);
      
      const groups = await groupsRes.json();
      const contacts = await contactsRes.json();

      const mappedGroups = Array.isArray(groups) ? groups.map((g: any) => ({
        id: g.id || g.jid,
        user_id: localStorage.getItem('current_user_email') || 'user',
        tür: ContactType.GROUP,
        wa_id: g.id || g.jid,
        isim: g.subject || g.name || 'İsimsiz Grup',
        üye_sayısı: g.size || g.participants?.length || 0
      })) : [];

      const mappedContacts = Array.isArray(contacts) ? contacts.map((c: any) => ({
        id: c.id || c.remoteJid || c.id,
        user_id: localStorage.getItem('current_user_email') || 'user',
        tür: ContactType.CONTACT,
        wa_id: c.id || c.remoteJid,
        isim: c.name || c.pushName || c.id.split('@')[0]
      })) : [];

      return [...mappedGroups, ...mappedContacts];
    } catch (e) { return []; }
  }

  async sendMessage(instanceName: string, number: string, text: string) {
    if (!this.isConfigured) return { success: false, error: "API Config missing" };
    try {
      const isGroup = number.includes('@g.us');
      const cleanNumber = isGroup ? number : number.replace(/\D/g, '');
      
      const response = await fetch(`${this.config.baseUrl}/message/sendText/${instanceName}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          number: cleanNumber,
          options: { delay: 1200, presence: "composing", linkPreview: false },
          textMessage: { text }
        })
      });
      return { success: response.ok };
    } catch (e) { return { success: false }; }
  }

  async checkStatus(instanceName: string) {
    if (!this.isConfigured) return 'disconnected';
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connectionState/${instanceName}`, { headers: this.headers });
      const data = await response.json();
      return data.instance?.state || data.state || 'disconnected';
    } catch (e) { return 'disconnected'; }
  }

  async logout(instanceName: string) {
    if (!this.isConfigured) return true;
    try {
      await fetch(`${this.config.baseUrl}/instance/logout/${instanceName}`, { method: 'DELETE', headers: this.headers });
      return true;
    } catch (e) { return false; }
  }
}

export const waApi = new WhatsAppService();
