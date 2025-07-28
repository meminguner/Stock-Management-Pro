import React, { useEffect } from 'react';
import { useStockStore } from './store/stockStore';
import { ProductForm } from './components/ProductForm';
import { SearchAndExport } from './components/SearchAndExport';
import { StockTable } from './components/StockTable';

function App() {
  const { 
    items, 
    getFilteredItems, 
    hasUnsavedChanges, 
    setHasUnsavedChanges,
    getAppInfo 
  } = useStockStore();

  const filteredItems = getFilteredItems();
  const appInfo = getAppInfo();

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Kaydedilmemiş değişiklikler var. Çıkmak istediğinizden emin misiniz?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <div>
              <h1>🔧 Atölye Stok Takip Sistemi</h1>
              <p>Komponent ve malzeme yönetimi</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div>
              📊 {appInfo.productCount} ürün
            </div>
            <div>
              📂 {appInfo.tagCount} kategori
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Section - Form and Search/Export */}
        <div className="grid" style={{ marginBottom: '2rem' }}>
          {/* Left Column - Form */}
          <div>
            <ProductForm />
          </div>

          {/* Right Column - Search, Export */}
          <div>
            <SearchAndExport />
          </div>
        </div>

        {/* Bottom Section - Full Width Table */}
        <div className="w-full">
          <div className="card">
            <h2>Stok Listesi</h2>
            <StockTable items={filteredItems} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="header">
        <div className="header-content">
          <div className="text-center text-sm" style={{ color: '#6b7280' }}>
            <p>📂 CSV yükleme aktif • 💾 Sekme kapatırken kaydetme uyarısı</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
