
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCategories, createCategory, updateCategory, deleteCategory, Category } from '@/services/categoryService';

const CategoryManager = () => {
  const [editingCategory, setEditingCategory] = useState<(Category & { originalId?: number }) | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', display_name: '', order_index: 0 });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category Added",
        description: `${newCategory.display_name} has been added`,
      });
      setNewCategory({ name: '', display_name: '', order_index: 0 });
      setIsAddingNew(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category Updated",
        description: "Category has been updated successfully",
      });
      setEditingCategory(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category Deleted",
        description: "Category has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.display_name) {
      toast({
        title: "Error",
        description: "Category name and display name are required",
        variant: "destructive"
      });
      return;
    }

    const categoryData = {
      name: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      display_name: newCategory.display_name,
      order_index: categories.length + 1
    };

    createMutation.mutate(categoryData);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category, originalId: category.id });
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !editingCategory.name || !editingCategory.display_name) {
      toast({
        title: "Error",
        description: "Category name and display name are required",
        variant: "destructive"
      });
      return;
    }

    updateMutation.mutate({
      id: editingCategory.originalId!,
      data: {
        name: editingCategory.name,
        display_name: editingCategory.display_name,
        order_index: editingCategory.order_index
      }
    });
  };

  const handleDeleteCategory = (id: number) => {
    deleteMutation.mutate(id);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
  };

  const cancelAdd = () => {
    setIsAddingNew(false);
    setNewCategory({ name: '', display_name: '', order_index: 0 });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-restaurant-green"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Categories</h3>
          <p className="text-red-500">Failed to load categories. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Category Management</h1>
          <p className="text-gray-500">Add, edit or remove menu categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingNew(true)}
          className="bg-restaurant-green text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-1" /> Add Category
        </motion.button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Display Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isAddingNew && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    placeholder="category-name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newCategory.display_name}
                    onChange={(e) => setNewCategory({...newCategory, display_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    placeholder="Display Name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={newCategory.order_index}
                    onChange={(e) => setNewCategory({...newCategory, order_index: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    placeholder="Order"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={handleAddCategory}
                    disabled={createMutation.isPending}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={cancelAdd}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                {editingCategory && editingCategory.id === category.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={editingCategory.display_name}
                        onChange={(e) => setEditingCategory({...editingCategory, display_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={editingCategory.order_index}
                        onChange={(e) => setEditingCategory({...editingCategory, order_index: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={handleSaveEdit}
                        disabled={updateMutation.isPending}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.display_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.order_index}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;
