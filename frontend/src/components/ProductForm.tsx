import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStockStore } from '../store/stockStore';
import { normalizeProductText } from '../utils/textUtils';
import { parseStockValue } from '../utils/stockUtils';
import { TagInput } from './TagInput';
import { StockInput } from './StockInput';

// Inline schema tanımı
const stockItemSchema = z.object({
  name: z.string()
    .min(1, 'Ürün adı gereklidir')
    .max(100, 'Ürün adı 100 karakterden uzun olamaz'),
  partNumber: z.string()
    .min(1, 'Ürün kodu gereklidir')
    .max(50, 'Ürün kodu 50 karakterden uzun olamaz'),
  stock: z.union([
    z.literal('?'),
    z.number().min(0, 'Stok miktarı negatif olamaz')
  ]),
  tags: z.array(z.string().min(1, 'Tag boş olamaz'))
    .max(10, 'En fazla 10 tag eklenebilir')
});

type StockItemFormData = z.infer<typeof stockItemSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSuccess,
  className = ""
}) => {
  const { addItem } = useStockStore();
  const [tags, setTags] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<StockItemFormData>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: {
      name: '',
      partNumber: '',
      stock: '?',
      tags: []
    }
  });

  const watchedName = watch('name');
  const watchedPartNumber = watch('partNumber');

  // Auto-normalize text inputs
  React.useEffect(() => {
    if (watchedName) {
      const normalized = normalizeProductText(watchedName);
      if (normalized !== watchedName) {
        setValue('name', normalized);
      }
    }
  }, [watchedName, setValue]);

  React.useEffect(() => {
    if (watchedPartNumber) {
      const normalized = normalizeProductText(watchedPartNumber);
      if (normalized !== watchedPartNumber) {
        setValue('partNumber', normalized);
      }
    }
  }, [watchedPartNumber, setValue]);

  const onSubmit = (data: StockItemFormData) => {
    try {
      addItem({
        name: data.name,
        partNumber: data.partNumber,
        stock: parseStockValue(data.stock.toString()),
        tags: tags
      });

      // Reset form
      reset();
      setTags([]);
      onSuccess?.();
    } catch (error) {
      console.error('Ürün eklenirken hata:', error);
    }
  };

  const handleClear = () => {
    reset();
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="card">
        <h2>Yeni Ürün Ekle</h2>
        
        <div className="section">
          {/* Ürün Adı */}
          <div className="form-group">
            <label htmlFor="name">Ürün Adı</label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="input-field"
              placeholder="Örn: DİRENÇ"
              autoComplete="off"
            />
            {errors.name && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Ürün Kodu */}
          <div className="form-group">
            <label htmlFor="partNumber">Ürün Kodu</label>
            <input
              {...register('partNumber')}
              type="text"
              id="partNumber"
              className="input-field"
              placeholder="Örn: R-100K-1/4W"
              autoComplete="off"
            />
            {errors.partNumber && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.partNumber.message}
              </p>
            )}
          </div>

          {/* Stok Miktarı */}
          <div className="form-group">
            <label htmlFor="stock">Stok Miktarı</label>
            <StockInput
              value={watch('stock')}
              onChange={(value) => setValue('stock', value)}
            />
            {errors.stock && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Kategori/Tag */}
          <div className="form-group">
            <label>Kategori/Tag</label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Örn: ELEKTRONIK RELAY (boşlukla ayırın)"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ flex: 1 }}
          >
            {isSubmitting ? 'Ekleniyor...' : 'Ürün Ekle'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary"
          >
            Temizle
          </button>
        </div>
      </div>
    </form>
  );
}; 