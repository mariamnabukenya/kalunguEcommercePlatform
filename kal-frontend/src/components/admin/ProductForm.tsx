import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Upload, X, Plus } from 'lucide-react';
import { Product } from '../../types';
import { apiService } from '../../lib/api';
import Button from '../Button';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
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
  category_id: number;
  is_active: boolean;
  featured: boolean;
  images: File[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
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
      category_id: product?.category_id || 0,
      is_active: product?.is_active ?? true,
      featured: product?.featured || false,
    },
  });

  const createProductMutation = useMutation(
    (data: any) => apiService.createProduct(data),
    {
      onSuccess: () => {
        toast.success('Product created successfully');
        onSubmit();
      },
      onError: () => {
        toast.error('Failed to create product');
      },
    }
  );

  const updateProductMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateProduct(id, data),
    {
      onSuccess: () => {
        toast.success('Product updated successfully');
        onSubmit();
      },
      onError: () => {
        toast.error('Failed to update product');
      },
    }
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onFormSubmit = async (data: ProductFormData) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // Add product data
      Object.keys(data).forEach(key => {
        if (key !== 'images' && data[key as keyof ProductFormData] !== undefined) {
          formData.append(key, String(data[key as keyof ProductFormData]));
        }
      });

      // Add images
      images.forEach(image => {
        formData.append('images[]', image);
      });

      if (product) {
        updateProductMutation.mutate({ id: product.id, data: formData });
      } else {
        createProductMutation.mutate(formData);
      }
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <Input
            label="Product Name *"
            {...register('name', { required: 'Product name is required' })}
            error={errors.name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="SKU *"
            {...register('sku', { required: 'SKU is required' })}
            error={errors.sku?.message}
          />

          <Input
            label="Brand"
            {...register('brand')}
            error={errors.brand?.message}
          />
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Pricing & Inventory</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price *"
              type="number"
              step="0.01"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
              error={errors.price?.message}
            />

            <Input
              label="Original Price"
              type="number"
              step="0.01"
              {...register('original_price', {
                min: { value: 0, message: 'Price must be positive' }
              })}
              error={errors.original_price?.message}
            />
          </div>

          <Input
            label="Stock Quantity *"
            type="number"
            {...register('stock_quantity', { 
              required: 'Stock quantity is required',
              min: { value: 0, message: 'Stock must be non-negative' }
            })}
            error={errors.stock_quantity?.message}
          />

          <Input
            label="Weight (grams)"
            type="number"
            {...register('weight', {
              min: { value: 0, message: 'Weight must be positive' }
            })}
            error={errors.weight?.message}
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Dimensions"
            placeholder="e.g., 10x15x5 cm"
            {...register('dimensions')}
            error={errors.dimensions?.message}
          />

          <Input
            label="Materials"
            placeholder="e.g., 100% Cotton"
            {...register('materials')}
            error={errors.materials?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Care Instructions
          </label>
          <textarea
            {...register('care_instructions')}
            rows={3}
            placeholder="e.g., Machine wash cold, tumble dry low"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Add Image</p>
            </div>
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Settings</h3>
        
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('is_active')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('featured')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isUploading}
          disabled={isUploading}
        >
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
