import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Folder, FileText } from 'lucide-react';
import { apiService } from '../../lib/api';
import Button from '../Button';
import Input from '../Input';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  category?: any;
  categories: any[];
  onSubmit: () => void;
  onCancel: () => void;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  categories,
  onSubmit,
  onCancel,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      parent_id: category?.parent_id || undefined,
      is_active: category?.is_active ?? true,
    },
  });

  const createCategoryMutation = useMutation(
    (data: CategoryFormData) => apiService.createCategory(data),
    {
      onSuccess: () => {
        toast.success('Category created successfully');
        onSubmit();
      },
      onError: () => {
        toast.error('Failed to create category');
      },
    }
  );

  const updateCategoryMutation = useMutation(
    ({ id, data }: { id: number; data: CategoryFormData }) => apiService.updateCategory(id, data),
    {
      onSuccess: () => {
        toast.success('Category updated successfully');
        onSubmit();
      },
      onError: () => {
        toast.error('Failed to update category');
      },
    }
  );

  const onFormSubmit = (data: CategoryFormData) => {
    if (category) {
      updateCategoryMutation.mutate({ id: category.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const nameValue = watch('name');
  const slugValue = watch('slug');

  // Auto-generate slug when name changes
  React.useEffect(() => {
    if (nameValue && !category) {
      const newSlug = generateSlug(nameValue);
      // Only update if slug is empty or matches the generated slug from name
      if (!slugValue || slugValue === generateSlug(nameValue.split(' ')[0])) {
        // This would need to be handled differently in a real form
      }
    }
  }, [nameValue, slugValue, category]);

  // Filter out current category and its children from parent options
  const getParentOptions = () => {
    if (!category) return categories;
    
    const filterCategoryAndChildren = (cats: any[], excludeId: number): any[] => {
      return cats.filter(cat => {
        if (cat.id === excludeId) return false;
        if (cat.children) {
          cat.children = filterCategoryAndChildren(cat.children, excludeId);
        }
        return true;
      });
    };
    
    return filterCategoryAndChildren(categories, category.id);
  };

  const parentOptions = getParentOptions();

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Category Name *"
          icon={Folder}
          {...register('name', { 
            required: 'Category name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={errors.name?.message}
        />

        <Input
          label="Slug *"
          placeholder="category-slug"
          {...register('slug', {
            required: 'Slug is required',
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: 'Slug can only contain lowercase letters, numbers, and hyphens',
            },
          })}
          error={errors.slug?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <textarea
              {...register('description')}
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Brief description of this category..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <select
              {...register('parent_id', {
                valueAsNumber: true,
              })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">No parent (root category)</option>
              {parentOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_active')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Active category
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}
          disabled={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}
        >
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
