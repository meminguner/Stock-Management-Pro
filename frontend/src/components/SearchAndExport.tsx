import React, { useRef } from 'react';
import { useStockStore } from '../store/stockStore';
import { useModal } from '../hooks/useModal';
import { importFromCSV } from '../utils/csvUtils';

interface SearchAndExportProps {
  className?: string;
}

export const SearchAndExport: React.FC<SearchAndExportProps> = ({
  className = ""
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    getFilteredItems, 
    exportToCSV, 
    importFromCSV: storeImportFromCSV,
    importAndMergeCSV,
    importAndReplaceCSV,
    exportAndReplaceCSV,
    hasUnsavedChanges,
    items
  } = useStockStore();
  
  const { showInfoModal, showImportModal } = useModal();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filteredItems = getFilteredItems();

  const handleExport = () => {
    try {
      const blob = exportToCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // YYYY-MM-DD_HHMM formatı (saniye yok)
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
      const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
      a.download = `stock_takip_${dateStr}_${timeStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export hatası:', error);
      showInfoModal(
        'Hata',
        'Dosya dışa aktarılırken hata oluştu!',
        { type: 'error' }
      );
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Önce CSV'yi parse et
      const importedItems = await importFromCSV(file);
      
      console.log('CSV parse edildi:', importedItems.length, 'ürün');
      console.log('Mevcut items sayısı:', items.length);
      
      // Eğer mevcut veri varsa, kullanıcıya seçenek sun
      if (items.length > 0) {
        console.log('Modal açılıyor...');
        showImportModal(
          'CSV Yükleme Seçeneği',
          'Mevcut verilerle nasıl birleştirmek istiyorsunuz?',
          importedItems.length,
          async () => {
            try {
              // Seçenek 1: Mevcut verilere ekle (aynı ürünlerin stokları toplanır)
              await importAndMergeCSV(file);
              showInfoModal(
                'Başarılı',
                'CSV dosyası mevcut verilere eklendi! Aynı ürünlerin stokları toplandı.',
                { type: 'success' }
              );
            } catch (error) {
              console.error('Merge import hatası:', error);
              showInfoModal(
                'Hata',
                'CSV dosyası birleştirilirken hata oluştu!',
                { type: 'error' }
              );
            }
          },
          async () => {
            try {
              // Seçenek 2: Mevcut tabloyu export et, sonra temizle, sonra yeni CSV'yi yükle
              await exportAndReplaceCSV(file);
              showInfoModal(
                'Başarılı',
                'Mevcut tablo kaydedildi ve yeni CSV dosyası yüklendi!',
                { type: 'success' }
              );
            } catch (error) {
              console.error('Export and replace hatası:', error);
              showInfoModal(
                'Hata',
                'İşlem sırasında hata oluştu!',
                { type: 'error' }
              );
            }
          },
          {
            mergeText: 'Tamam: Mevcut verilere ekle',
            replaceText: 'İptal: Mevcut verileri değiştir'
          }
        );
      } else {
        // Mevcut veri yoksa direkt yükle
        console.log('Direkt yükleme yapılıyor...');
        await storeImportFromCSV(file);
        showInfoModal(
          'Başarılı',
          'CSV dosyası başarıyla yüklendi!',
          { type: 'success' }
        );
      }
    } catch (error) {
      console.error('Import hatası:', error);
      showInfoModal(
        'Hata',
        'CSV dosyası yüklenirken hata oluştu!',
        { type: 'error' }
      );
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div className="card">
        <h2>Arama ve Dosya İşlemleri</h2>
        
        <div className="section">
          {/* Arama */}
          <div className="form-group">
            <label htmlFor="search">Arama</label>
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, kodu veya kategori ile ara..."
                className="input-field search-input"
                autoComplete="off"
              />
            </div>
            {searchQuery && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {filteredItems.length} sonuç bulundu
              </p>
            )}
          </div>

          {/* Dosya İşlemleri */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleFileUpload}
              className="btn-secondary"
            >
              📂 CSV Yükle
            </button>
            
            <button
              type="button"
              onClick={handleExport}
              disabled={filteredItems.length === 0}
              className="btn-primary"
            >
              📊 Excel'e Aktar
            </button>
          </div>

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <div className="warning">
              <p>
                ⚠️ Kaydedilmemiş değişiklikler var. Sekmeyi kapatmadan önce verileri dışa aktarın.
              </p>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}; 