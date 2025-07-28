import { useCallback } from 'react';
import Swal from 'sweetalert2';

interface StockItem {
  id: string;
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const useModal = () => {
  const showConfirmModal = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    options: {
      product?: StockItem;
      confirmText?: string;
      cancelText?: string;
      type?: 'delete' | 'warning' | 'info';
    } = {}
  ) => {
    const { product, confirmText = 'Onayla', cancelText = 'İptal', type = 'delete' } = options;

    let html = `<p>${message}</p>`;
    
    if (product) {
      html += `
        <div style="
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
          border-left: 4px solid #e74c3c;
          text-align: left;
          font-size: 14px;
        ">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #7f8c8d;">Ürün Adı:</span>
            <span style="color: #2c3e50; font-weight: 500;">${product.name}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #7f8c8d;">Ürün Kodu:</span>
            <span style="color: #2c3e50; font-weight: 500; font-family: monospace;">${product.partNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #7f8c8d;">Kategori:</span>
            <span style="color: #2c3e50; font-weight: 500;">
              ${product.tags.length > 0 ? product.tags.join(', ') : '-'}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #7f8c8d;">Stok:</span>
            <span style="color: #2c3e50; font-weight: 500;">${product.stock}</span>
          </div>
        </div>
      `;
    }

    Swal.fire({
      title: `⚠️ ${title}`,
      html: html,
      icon: type === 'delete' ? 'warning' : type === 'warning' ? 'warning' : 'info',
      showCancelButton: true,
      confirmButtonText: `🗑️ ${confirmText}`,
      cancelButtonText: `❌ ${cancelText}`,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'swal2-custom-confirm',
        cancelButton: 'swal2-custom-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }, []);

  const showImportModal = useCallback((
    title: string,
    message: string,
    productCount: number,
    onMerge: () => void,
    onReplace: () => void,
    options: {
      mergeText?: string;
      replaceText?: string;
    } = {}
  ) => {
    const { mergeText = 'Mevcut verilere ekle', replaceText = 'Mevcut verileri değiştir' } = options;

    const html = `
      <p>${message}</p>
      <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
        ${productCount} ürün başarıyla yüklendi.
      </p>
      <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
        Mevcut verilerle nasıl birleştirmek istiyorsunuz?
      </p>
      <div style="
        background-color: #f3f4f6;
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: #374151;
      ">
        <p><strong>${mergeText}:</strong> Mevcut verilere ekle (aynı ürünlerin adetleri artırılacak, olmayan yeni ürün yeni satır olarak işlenecek)</p>
        <p style="margin-top: 0.5rem;"><strong>${replaceText}:</strong> Mevcut çalıştığınız tablo kaydedilip export edilip tablo temizlenip sonra yüklenen CSV artık yeni tablo olsun</p>
      </div>
    `;

    Swal.fire({
      title: title,
      html: html,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: mergeText,
      cancelButtonText: replaceText,
      confirmButtonColor: '#27ae60',
      cancelButtonColor: '#e74c3c',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'swal2-custom-confirm',
        cancelButton: 'swal2-custom-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onMerge();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onReplace();
      }
    });
  }, []);

  const showInfoModal = useCallback((
    title: string,
    message: string,
    options: {
      type?: 'info' | 'success' | 'warning' | 'error';
      showCloseButton?: boolean;
    } = {}
  ) => {
    const { type = 'info', showCloseButton = true } = options;

    let icon: 'info' | 'success' | 'warning' | 'error' = 'info';
    switch (type) {
      case 'success':
        icon = 'success';
        break;
      case 'warning':
        icon = 'warning';
        break;
      case 'error':
        icon = 'error';
        break;
      default:
        icon = 'info';
    }

    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      confirmButtonText: '✅ Tamam',
      confirmButtonColor: type === 'success' ? '#27ae60' : 
                         type === 'warning' ? '#f39c12' : 
                         type === 'error' ? '#e74c3c' : '#3498db',
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'swal2-custom-confirm'
      }
    });
  }, []);

  // Eski modal state'lerini kaldırdık, artık SweetAlert2 kullanıyoruz
  const confirmModal = { isOpen: false };
  const importModal = { isOpen: false };
  const infoModal = { isOpen: false };

  return {
    confirmModal,
    importModal,
    infoModal,
    showConfirmModal,
    hideConfirmModal: () => {}, // SweetAlert2 otomatik kapanıyor
    showImportModal,
    hideImportModal: () => {}, // SweetAlert2 otomatik kapanıyor
    showInfoModal,
    hideInfoModal: () => {}, // SweetAlert2 otomatik kapanıyor
    handleConfirmModalConfirm: () => {}, // Artık gerekli değil
    handleImportModalMerge: () => {}, // Artık gerekli değil
    handleImportModalReplace: () => {} // Artık gerekli değil
  };
}; 