
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum SubscriptionType {
  FREE = 'Başlangıç',
  PRO = 'Profesyonel',
  ENTERPRISE = 'Kurumsal'
}

export enum GatewayProvider {
  EVOLUTION = 'Evolution API (Kendi Sunucum)',
  CLOUD_SaaS = 'Cloud API (Z-API / UltraMsg / Diğer)'
}

export interface Profile {
  id: string;
  email: string;
  rol: UserRole;
  günlük_mesaj_limiti: number;
  toplam_gönderilen: number;
  abonelik_türü: SubscriptionType;
  kayıt_tarihi: string;
  durum: 'aktif' | 'pasif';
}

export enum WASessionStatus {
  IDLE = 'Hazır',
  INITIALIZING = 'Başlatılıyor...',
  QR_READY = 'QR Bekleniyor',
  AUTHENTICATING = 'Doğrulanıyor...',
  SYNCING = 'Veri Çekiliyor...',
  CONNECTED = 'Bağlı (Aktif)',
  DISCONNECTED = 'Bağlantı Yok',
  EXPIRED = 'QR Geçersiz',
  ERROR = 'API Hatası'
}

export interface WASession {
  id: string;
  instance_name: string;
  user_id: string;
  durum: WASessionStatus;
  qr_verisi: string | null;
  pairing_code: string | null;
}

export enum ContactType {
  GROUP = 'grup',
  CONTACT = 'kişi'
}

export interface RehberVerisi {
  id: string;
  user_id: string;
  tür: ContactType;
  wa_id: string;
  isim: string;
  üye_sayısı?: number;
}

export enum CampaignStatus {
  ACTIVE = 'çalışıyor',
  PAUSED = 'duraklatıldı',
  PENDING = 'planlandı',
  COMPLETED = 'tamamlandı'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video'
}

export interface Kampanya {
  id: string;
  user_id: string;
  isim: string;
  mesaj_metni: string;
  mesaj_tipi: MessageType;
  medya_url?: string;
  planlanan_zaman: string;
  min_gecikme: number;
  max_gecikme: number;
  simule_yaziyor: boolean;
  durum: CampaignStatus;
  hedef_liste: string[]; // wa_id listesi
}

export interface MesajSablonu {
  id: string;
  isim: string;
  metin: string;
  tip: MessageType;
  medya_url?: string;
}

export enum MessageStatus {
  WAITING = 'beklemede',
  TYPING = 'yazıyor...',
  SENT = 'iletildi',
  ERROR = 'başarısız'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface MesajKuyrugu {
  id: string;
  kampanya_id: string;
  alıcı_id: string;
  alıcı_ismi: string;
  durum: MessageStatus;
  gönderim_zamanı?: string;
  error_message?: string;
}

export interface AppState {
  user: Profile | null;
  session: WASession | null;
  contacts: RehberVerisi[];
  campaigns: Kampanya[];
  sablonlar: MesajSablonu[];
  queue: MesajKuyrugu[];
  users: Profile[];
  logs: LogEntry[];
}
