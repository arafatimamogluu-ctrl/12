
import { AppState, Profile, UserRole, SubscriptionType } from '../types';

class DatabaseService {
  private ADMIN_EMAIL = 'Arafatimamogluu@gmail.com';
  private ADMIN_PASS = 'Arafat141';

  async login(email: string, pass: string): Promise<Profile | null> {
    // Özel Admin Kontrolü
    if (email === this.ADMIN_EMAIL && pass === this.ADMIN_PASS) {
      const admin: Profile = {
        id: 'admin_001',
        email: email,
        rol: UserRole.ADMIN,
        günlük_mesaj_limiti: 999999,
        toplam_gönderilen: 0,
        abonelik_türü: SubscriptionType.ENTERPRISE,
        kayıt_tarihi: new Date().toISOString(),
        durum: 'aktif'
      };
      localStorage.setItem('current_user_email', email);
      return admin;
    }

    // Normal Kullanıcı Simülasyonu
    const existingRaw = localStorage.getItem(`profile_${email}`);
    if (existingRaw) {
      const p = JSON.parse(existingRaw);
      localStorage.setItem('current_user_email', email);
      return p;
    }

    const newUser: Profile = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      rol: UserRole.USER,
      günlük_mesaj_limiti: 100,
      toplam_gönderilen: 0,
      abonelik_türü: SubscriptionType.FREE,
      kayıt_tarihi: new Date().toISOString(),
      durum: 'aktif'
    };

    localStorage.setItem(`profile_${email}`, JSON.stringify(newUser));
    localStorage.setItem('current_user_email', email);
    return newUser;
  }

  saveAppState(state: AppState) {
    if (state.user) {
      localStorage.setItem(`state_${state.user.email}`, JSON.stringify(state));
      // Admin global kullanıcı listesini güncellemek için
      if (state.user.rol === UserRole.ADMIN) {
        localStorage.setItem('admin_users_view', JSON.stringify(state.users));
      }
    }
  }

  loadAppState(email: string): AppState | null {
    const data = localStorage.getItem(`state_${email}`);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem('current_user_email');
  }
}

export const db = new DatabaseService();
