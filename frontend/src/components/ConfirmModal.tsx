import React, { useEffect } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  product?: StockItem;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Onay Gerekli',
  message = 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?',
  product,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  type = 'delete'
}) => {
  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Modal açıkken body scroll'unu engelle
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        animation: 'modalFadeIn 0.3s ease',
        zIndex: 10000
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div 
        className="modal-content"
        style={{
          background: 'white',
          borderRadius: '15px',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          animation: 'modalSlideIn 0.3s ease',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          className="modal-header"
          style={{
            background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
            color: 'white',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.3em', fontWeight: 600 }}>
            ⚠️ {title}
          </h3>
        </div>

        {/* Body */}
        <div 
          className="modal-body"
          style={{
            padding: '25px',
            textAlign: 'center'
          }}
        >
          <p style={{
            fontSize: '1.1em',
            color: '#2c3e50',
            marginBottom: '15px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
          
          {/* Product Details */}
          {product && (
            <div 
              className="product-info"
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '15px',
                margin: '15px 0',
                borderLeft: '4px solid #e74c3c'
              }}
            >
              <div className="info-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Ürün Adı:</span>
                <span style={{ color: '#2c3e50', fontWeight: 500 }}>{product.name}</span>
              </div>
              <div className="info-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Ürün Kodu:</span>
                <span style={{ color: '#2c3e50', fontWeight: 500, fontFamily: 'monospace' }}>{product.partNumber}</span>
              </div>
              <div className="info-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Kategori:</span>
                <span style={{ color: '#2c3e50', fontWeight: 500 }}>
                  {product.tags.length > 0 ? product.tags.join(', ') : '-'}
                </span>
              </div>
              <div className="info-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Stok:</span>
                <span style={{ color: '#2c3e50', fontWeight: 500 }}>{product.stock}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="modal-footer"
          style={{
            padding: '20px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            background: '#f8f9fa'
          }}
        >
          <button
            onClick={onClose}
            className="modal-btn cancel"
            style={{
              padding: '12px 25px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px',
              background: '#95a5a6',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#7f8c8d';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#95a5a6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ❌ {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="modal-btn delete"
            style={{
              padding: '12px 25px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px',
              background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #c0392b, #a93226)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(231, 76, 60, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            autoFocus
          >
            🗑️ {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}; 