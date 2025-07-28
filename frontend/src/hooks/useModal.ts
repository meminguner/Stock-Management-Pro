import { useState, useCallback } from 'react';

interface StockItem {
  id: string;
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  product?: StockItem;
  confirmText: string;
  cancelText: string;
  type: 'delete' | 'warning' | 'info';
  onConfirm?: () => void;
}

interface ImportModalState {
  isOpen: boolean;
  title: string;
  message: string;
  productCount: number;
  mergeText: string;
  replaceText: string;
  onMerge?: () => void;
  onReplace?: () => void;
}

interface InfoModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  showCloseButton: boolean;
}

// Singleton modal state
let modalState = {
  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Onayla',
    cancelText: 'İptal',
    type: 'delete' as const
  },
  importModal: {
    isOpen: false,
    title: '',
    message: '',
    productCount: 0,
    mergeText: 'Mevcut verilere ekle',
    replaceText: 'Mevcut verileri değiştir'
  },
  infoModal: {
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as const,
    showCloseButton: true
  }
};

// Singleton listeners
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useModal = () => {
  const [, forceUpdate] = useState({});

  const updateState = useCallback((updater: (state: typeof modalState) => typeof modalState) => {
    modalState = updater(modalState);
    notifyListeners();
  }, []);

  // Subscribe to changes
  useState(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  });

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
    updateState(state => ({
      ...state,
      confirmModal: {
        isOpen: true,
        title,
        message,
        product: options.product,
        confirmText: options.confirmText || 'Onayla',
        cancelText: options.cancelText || 'İptal',
        type: options.type || 'delete',
        onConfirm
      }
    }));
  }, [updateState]);

  const hideConfirmModal = useCallback(() => {
    updateState(state => ({
      ...state,
      confirmModal: { ...state.confirmModal, isOpen: false }
    }));
  }, [updateState]);

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
    console.log('showImportModal çağrıldı:', { title, message, productCount });
    const newState = {
      isOpen: true,
      title,
      message,
      productCount,
      mergeText: options.mergeText || 'Mevcut verilere ekle',
      replaceText: options.replaceText || 'Mevcut verileri değiştir',
      onMerge,
      onReplace
    };
    console.log('Yeni state:', newState);
    updateState(state => ({
      ...state,
      importModal: newState
    }));
    console.log('ImportModal state güncellendi');
  }, [updateState]);

  const hideImportModal = useCallback(() => {
    updateState(state => ({
      ...state,
      importModal: { ...state.importModal, isOpen: false }
    }));
  }, [updateState]);

  const showInfoModal = useCallback((
    title: string,
    message: string,
    options: {
      type?: 'info' | 'success' | 'warning' | 'error';
      showCloseButton?: boolean;
    } = {}
  ) => {
    updateState(state => ({
      ...state,
      infoModal: {
        isOpen: true,
        title,
        message,
        type: options.type || 'info',
        showCloseButton: options.showCloseButton !== false
      }
    }));
  }, [updateState]);

  const hideInfoModal = useCallback(() => {
    updateState(state => ({
      ...state,
      infoModal: { ...state.infoModal, isOpen: false }
    }));
  }, [updateState]);

  const handleConfirmModalConfirm = useCallback(() => {
    if (modalState.confirmModal.onConfirm) {
      modalState.confirmModal.onConfirm();
    }
    hideConfirmModal();
  }, [hideConfirmModal]);

  const handleImportModalMerge = useCallback(() => {
    console.log('handleImportModalMerge çağrıldı');
    if (modalState.importModal.onMerge) {
      console.log('onMerge fonksiyonu çalıştırılıyor');
      modalState.importModal.onMerge();
    }
    hideImportModal();
  }, [hideImportModal]);

  const handleImportModalReplace = useCallback(() => {
    console.log('handleImportModalReplace çağrıldı');
    if (modalState.importModal.onReplace) {
      console.log('onReplace fonksiyonu çalıştırılıyor');
      modalState.importModal.onReplace();
    }
    hideImportModal();
  }, [hideImportModal]);

  return {
    confirmModal: modalState.confirmModal,
    importModal: modalState.importModal,
    infoModal: modalState.infoModal,
    showConfirmModal,
    hideConfirmModal,
    showImportModal,
    hideImportModal,
    showInfoModal,
    hideInfoModal,
    handleConfirmModalConfirm,
    handleImportModalMerge,
    handleImportModalReplace
  };
}; 