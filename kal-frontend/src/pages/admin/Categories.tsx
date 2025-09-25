import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { apiService } from '../../lib/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import CategoryForm from '../../components/admin/CategoryForm';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  children?: Category[];
  products_count?: number;
}

const AdminCategories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery(
    ['admin-categories', searchTerm],
    () => apiService.getAdminCategories({ search: searchTerm }),
    {
      keepPreviousData: true,
    }
  );

  const deleteCategoryMutation = useMutation(
    (id: number) => apiService.deleteCategory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-categories');
        toast.success('Category deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete category');
      },
    }
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleCategorySubmit = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    queryClient.invalidateQueries('admin-categories');
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <div 
          className={`flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50 ${
            level > 0 ? 'ml-6' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {category.children && category.children.length > 0 && (
              <button
                onClick={() => toggleCategoryExpansion(category.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            
            {category.children && category.children.length > 0 ? (
              <FolderOpen className="w-5 h-5 text-blue-500" />
            ) : (
              <Folder className="w-5 h-5 text-gray-400" />
            )}
            
            <div>
              <p className="font-medium text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500">
                {category.products_count || 0} products
                {category.description && ` • ${category.description}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              category.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
            
            <button
              onClick={() => handleEditCategory(category)}
              className="text-gray-400 hover:text-blue-600"
              title="Edit Category"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-gray-400 hover:text-red-600"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {category.children && expandedCategories.has(category.id) && (
          <div>
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Organize your products with categories</p>
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Categories Tree */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {categories && categories.length > 0 ? (
            <div>
              {renderCategoryTree(categories)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first category.</p>
              <Button onClick={handleAddCategory}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          )}
        </div>

        {/* Category Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
          size="lg"
        >
          <CategoryForm
            category={editingCategory}
            categories={categories || []}
            onSubmit={handleCategorySubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategories;
