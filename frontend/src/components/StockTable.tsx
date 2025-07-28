import React, { useState } from 'react';
import { useStockStore } from '../store/stockStore';
import { StockInput } from './StockInput';
import { TagInput } from './TagInput';
import { normalizeProductText } from '../utils/textUtils';
import { parseStockValue } from '../utils/stockUtils';
import { formatDate } from '../utils/textUtils';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { useModal } from '../hooks/useModal';

// Inline interface tanımı
interface StockItem {
  id: string;
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface StockTableProps {
  items: StockItem[];
  className?: string;
}

export const StockTable: React.FC<StockTableProps> = ({
  items,
  className = ""
}) => {
  const { updateItem, deleteItem, updateStock, incrementStock, decrementStock } = useStockStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<StockItem>>({});
  const { confirmModal, showConfirmModal, hideConfirmModal, handleConfirmModalConfirm } = useModal();

  const handleEdit = (item: StockItem) => {
    setEditingId(item.id);
    setEditingData({
      name: item.name,
      partNumber: item.partNumber,
      stock: item.stock,
      tags: [...item.tags]
    });
  };

  const handleSave = (id: string) => {
    if (editingData.name && editingData.partNumber) {
      updateItem({
        id,
        name: editingData.name,
        partNumber: editingData.partNumber,
        stock: editingData.stock,
        tags: editingData.tags || []
      });
    }
    setEditingId(null);
    setEditingData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleDelete = (product: StockItem) => {
    showConfirmModal(
      'Ürün Silme Onayı',
      'Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      () => deleteItem(product.id),
      {
        product,
        confirmText: 'Sil',
        cancelText: 'İptal',
        type: 'delete'
      }
    );
  };

  const handleStockChange = (id: string, value: number | '?') => {
    if (editingId === id) {
      setEditingData(prev => ({ ...prev, stock: value }));
    } else {
      updateStock(id, value);
    }
  };

  const handleTagsChange = (id: string, tags: string[]) => {
    setEditingData(prev => ({ ...prev, tags }));
  };

  const handleNameChange = (id: string, value: string) => {
    const normalized = normalizeProductText(value);
    setEditingData(prev => ({ ...prev, name: normalized }));
  };

  const handlePartNumberChange = (id: string, value: string) => {
    const normalized = normalizeProductText(value);
    setEditingData(prev => ({ ...prev, partNumber: normalized }));
  };

  if (items.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>Henüz ürün eklenmemiş</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full bg-white rounded-lg shadow-sm table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
              Ürün Adı
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
              Ürün Kodu
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Kategori
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Stok
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
              Güncellenme
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isEditing = editingId === item.id;
            
            return (
              <tr key={item.id}>
                {/* ID */}
                <td className="px-4 py-3 text-sm text-gray-900 font-mono w-32">
                  {item.id}
                </td>

                {/* Ürün Adı */}
                <td className="px-4 py-3 w-96">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingData.name || ''}
                      onChange={(e) => handleNameChange(item.id, e.target.value)}
                      className="input-field text-sm"
                      autoComplete="off"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{item.name}</span>
                  )}
                </td>

                {/* Ürün Kodu */}
                <td className="px-4 py-3 w-56">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingData.partNumber || ''}
                      onChange={(e) => handlePartNumberChange(item.id, e.target.value)}
                      className="input-field text-sm"
                      autoComplete="off"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{item.partNumber}</span>
                  )}
                </td>

                {/* Kategori */}
                <td className="px-4 py-3 w-48">
                  {isEditing ? (
                    <TagInput
                      value={editingData.tags || []}
                      onChange={(tags) => handleTagsChange(item.id, tags)}
                      className="min-w-[200px]"
                    />
                  ) : (
                    <div className="tag-container">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="tag-pill"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>

                {/* Stok */}
                <td className="px-4 py-3 w-32">
                  <StockInput
                    value={isEditing ? (editingData.stock || '?') : item.stock}
                    onChange={(value) => handleStockChange(item.id, value)}
                    className="w-24"
                  />
                </td>

                {/* Güncellenme Tarihi */}
                <td className="px-4 py-3 text-sm text-gray-500 w-40">
                  {formatDate(item.updatedAt)}
                </td>

                {/* İşlemler */}
                <td className="px-4 py-3 w-32">
                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(item.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Kaydet"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="İptal"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={hideConfirmModal}
        onConfirm={handleConfirmModalConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        product={confirmModal.product}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />
    </div>
  );
}; 