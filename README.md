# Stock Management Pro

Modern ve kullanıcı dostu stok takip uygulaması. React, TypeScript ve Vite kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- ✅ Ürün ekleme, düzenleme ve silme
- ✅ Stok miktarı takibi
- ✅ Etiket sistemi ile kategorilendirme
- ✅ Arama ve filtreleme
- ✅ CSV import/export işlemleri
- ✅ Modern ve responsive tasarım
- ✅ Gerçek zamanlı güncellemeler

## 🛠️ Teknolojiler

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Lucide React Icons
- **Notifications**: SweetAlert2

## 📦 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn

### Adım Adım Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd Stock-Management-Pro
```

2. **Frontend bağımlılıklarını yükleyin:**
```bash
cd frontend
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcınızda açın:**
```
http://localhost:5173
```

## 🎯 Kullanım

### Ürün Ekleme
- "Yeni Ürün Ekle" butonuna tıklayın
- Ürün adı, stok miktarı ve etiketleri girin
- "Kaydet" butonuna tıklayın

### Stok Güncelleme
- Tablodaki ürün satırında "Düzenle" butonuna tıklayın
- Yeni stok miktarını girin
- Değişiklikleri kaydedin

### Arama ve Filtreleme
- Üst kısımdaki arama kutusunu kullanın
- Etiketlere göre filtreleme yapın

### Veri İşlemleri
- **Export**: Mevcut verileri CSV formatında dışa aktarın
- **Import**: CSV dosyasından veri içe aktarın

## 📁 Proje Yapısı

```
Stock-Management-Pro/
├── frontend/                 # React uygulaması
│   ├── src/
│   │   ├── components/      # React bileşenleri
│   │   ├── store/          # Zustand store
│   │   ├── utils/          # Yardımcı fonksiyonlar
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Statik dosyalar
│   └── package.json
├── backend/                 # Backend API (gelecekte)
├── shared/                 # Paylaşılan tipler
└── README.md
```

## 🚀 Geliştirme Komutları

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Production build oluştur
npm run build

# Lint kontrolü yap
npm run lint

# Preview build'i
npm run preview
```

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. `src/components/` dizininde yeni bileşen oluşturun
2. `src/store/stockStore.ts` dosyasında state güncellemeleri yapın
3. `src/utils/` dizininde yardımcı fonksiyonlar ekleyin

### Stil Değişiklikleri
- Tailwind CSS kullanılıyor
- `src/index.css` dosyasında global stiller
- Bileşen bazında inline Tailwind sınıfları

## 📝 Notlar

- Veriler localStorage'da saklanır
- CSV import/export işlemleri tarayıcı tarafında yapılır
- Responsive tasarım mobil uyumludur

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Not**: Bu proje geliştirme aşamasındadır. Backend API entegrasyonu gelecekte eklenecektir. 