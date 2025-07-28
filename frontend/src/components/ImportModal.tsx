import React from 'react';
import { useModal } from '../hooks/useModal';

export const ImportModal: React.FC = () => {
  const { 
    importModal, 
    hideImportModal, 
    handleImportModalMerge, 
    handleImportModalReplace 
  } = useModal();

  console.log('ImportModal render - isOpen:', importModal.isOpen);
  console.log('ImportModal data:', importModal);
  console.log('ImportModal title:', importModal.title);
  console.log('ImportModal message:', importModal.message);
  console.log('ImportModal productCount:', importModal.productCount);

  if (!importModal.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={hideImportModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{importModal.title}</h3>
        </div>
        
        <div className="modal-body">
          <p>{importModal.message}</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            {importModal.productCount} ürün başarıyla yüklendi.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Mevcut verilerle nasıl birleştirmek istiyorsunuz?
          </p>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '0.75rem', 
            borderRadius: '0.375rem', 
            marginTop: '0.75rem',
            fontSize: '0.875rem',
            color: '#374151'
          }}>
            <p><strong>Tamam:</strong> Mevcut verilere ekle (aynı ürünlerin adetleri artırılacak, olmayan yeni ürün yeni satır olarak işlenecek)</p>
            <p style={{ marginTop: '0.5rem' }}><strong>İptal:</strong> Mevcut çalıştığınız tablo kaydedilip export edilip tablo temizlenip sonra yüklenen CSV artık yeni tablo olsun</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button
            type="button"
            onClick={handleImportModalReplace}
            className="btn-secondary"
          >
            {importModal.replaceText}
          </button>
          
          <button
            type="button"
            onClick={handleImportModalMerge}
            className="btn-primary"
          >
            {importModal.mergeText}
          </button>
        </div>
      </div>
    </div>
  );
}; 