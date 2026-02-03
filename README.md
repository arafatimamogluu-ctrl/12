
# 🚀 WA-SaaS Elite Enterprise - WhatsApp Marketing Hub

Bu proje, **Evolution API** altyapısını kullanan, gelişmiş bir WhatsApp SaaS otomasyon panelidir. Tamamen frontend tabanlıdır ve tarayıcı üzerinde çalışır.

## ✨ Özellikler
- **Kampanya Yönetimi:** Toplu mesaj gönderimi ve planlama.
- **Rehber Senkronizasyonu:** WhatsApp gruplarını ve kişilerini otomatik çekme.
- **Anti-Ban Koruması:** Akıllı gecikme (delay) ve "yazıyor..." simülasyonu.
- **Dashboard:** Gönderim istatistikleri ve performans grafikleri.
- **Çoklu Motor Desteği:** İster kendi Docker sunucunu bağla, ister bulut API kullan.

## 🛠️ Kurulum

### 1. Motoru Hazırlayın (Evolution API)
Bu panel bir "Motor" (API) ile çalışır. Kendi bilgisayarınızda çalıştırmak için:

```bash
docker run -d --name evolution -p 8080:8080 -e AUTHENTICATION_API_KEY=4224772477247724 evolutionapi/evolution-api:latest
```

### 2. Paneli Çalıştırın
Herhangi bir modern web sunucusu ile `index.html` dosyasını açmanız yeterlidir. Veya doğrudan GitHub Pages üzerinden yayınlayabilirsiniz.

## ⚠️ Güvenlik Uyarısı
Bu proje eğitim amaçlıdır. `API_KEY` ve `URL` bilgileri `localStorage` üzerinde tutulmaktadır. Üretim ortamında (Production) bu bilgileri çevre değişkenleri (environment variables) ile yönetmeniz önerilir.

## 📜 Lisans
MIT License. İstediğiniz gibi geliştirebilir ve kullanabilirsiniz.
