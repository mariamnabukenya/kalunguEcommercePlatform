import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Upload, X } from 'lucide-react';
import { Product } from '../../types';
import { apiService } from '../../lib/api';
import Button from '../Button';
import Input from '../Input';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: () => void;
  onCancel: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  weight?: number;
  dimensions?: string;
  materials?: string;
  care_instructions?: string;
  brand?: string;
  category_name: string; // just name, no object
  is_active: boolean;
  featured: boolean;
  images: File[];
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      sku: product?.sku || '',
      price: product?.current_price || 0,
      original_price: product?.original_price || undefined,
      stock_quantity: product?.stock_quantity || 0,
      weight: product?.weight || undefined,
      dimensions: product?.dimensions || '',
      materials: product?.materials || '',
      care_instructions: product?.care_instructions || '',
      brand: product?.brand || '',
      category_name: product?.categories?.[0]?.name || '',
      is_active: product?.is_active ?? true,
      featured: product?.featured || false,
    },
  });

  const createProductMutation = useMutation(
    (data: FormData) => apiService.createProduct(data),
    {
      onSuccess: () => {
        toast.success('Product created successfully');
        onSubmit();
      },
      onError: () => toast.error('Failed to create product'),
    }
  );

  const updateProductMutation = useMutation(
    ({ id, data }: { id: number; data: FormData }) => apiService.updateProduct(id, data),
    {
      onSuccess: () => {
        toast.success('Product updated successfully');
        onSubmit();
      },
      onError: () => toast.error('Failed to update product'),
    }
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: ProductFormData) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined) formData.append(key, String(value));
      });
      images.forEach(img => formData.append('images[]', img));

      if (product) {
        updateProductMutation.mutate({ id: product.id, data: formData });
      } else {
        createProductMutation.mutate(formData);
      }
    } catch {
      toast.error('Failed to save product');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <Input
            label="Product Name *"
            {...register('name', { required: 'Product name is required' })}
            error={errors.name?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>
          <Input label="SKU *" {...register('sku', { required: 'SKU is required' })} error={errors.sku?.message} />
          <Input label="Brand" {...register('brand')} error={errors.brand?.message} />
          <Input label="Category Name *" {...register('category_name', { required: 'Category name is required' })} error={errors.category_name?.message} />
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <Input label="Price *" type="number" step="0.01" {...register('price', { required: true, min: 0 })} error={errors.price?.message} />
          <Input label="Original Price" type="number" step="0.01" {...register('original_price')} error={errors.original_price?.message} />
          <Input label="Stock Quantity *" type="number" {...register('stock_quantity', { required: true, min: 0 })} error={errors.stock_quantity?.message} />
          <Input label="Weight (grams)" type="number" {...register('weight')} error={errors.weight?.message} />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, i) => (
            <div key={i} className="relative">
              <img src={preview} alt={`Preview ${i}`} className="w-full h-32 object-cover rounded-lg" />
              <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors">
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Add Image</p>
            </div>
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input type="checkbox" {...register('is_active')} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" {...register('featured')} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700">Featured</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>Cancel</Button>
        <Button type="submit" loading={isUploading} disabled={isUploading}>{product ? 'Update Product' : 'Create Product'}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
