import React, { useEffect } from 'react';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  showCloseButton = true
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getHeaderStyle = () => {
    switch (type) {
      case 'success':
        return { background: 'linear-gradient(45deg, #27ae60, #2ecc71)' };
      case 'warning':
        return { background: 'linear-gradient(45deg, #f39c12, #e67e22)' };
      case 'error':
        return { background: 'linear-gradient(45deg, #e74c3c, #c0392b)' };
      default:
        return { background: 'linear-gradient(45deg, #3498db, #2980b9)' };
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'success':
        return { background: 'linear-gradient(45deg, #27ae60, #2ecc71)' };
      case 'warning':
        return { background: 'linear-gradient(45deg, #f39c12, #e67e22)' };
      case 'error':
        return { background: 'linear-gradient(45deg, #e74c3c, #c0392b)' };
      default:
        return { background: 'linear-gradient(45deg, #3498db, #2980b9)' };
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
            ...getHeaderStyle(),
            color: 'white',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.3em', fontWeight: 600 }}>
            {title}
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
            lineHeight: '1.5'
          }}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div 
          className="modal-footer"
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            background: '#f8f9fa'
          }}
        >
          <button
            onClick={onClose}
            className="modal-btn"
            style={{
              padding: '12px 25px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px',
              ...getButtonStyle(),
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            autoFocus
          >
            ✅ Tamam
          </button>
        </div>
      </div>
    </div>
  );
}; 