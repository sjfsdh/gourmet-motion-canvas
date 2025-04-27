
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CustomButton } from '@/components/ui/custom-button';

// Initial categories
const initialCategories = [
  { id: 'starters', name: 'Starters' },
  { id: 'mains', name: 'Mains' },
  { id: 'sides', name: 'Sides' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' }
];

const CategoryManager = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.id || !newCategory.name) {
      toast({
        title: "Error",
        description: "Category ID and name are required",
        variant: "destructive"
      });
      return;
    }

    if (categories.some(cat => cat.id === newCategory.id)) {
      toast({
        title: "Error",
        description: "Category ID already exists",
        variant: "destructive"
      });
      return;
    }

    setCategories([...categories, newCategory]);
    setNewCategory({ id: '', name: '' });
    setIsAddingNew(false);
    
    toast({
      title: "Category Added",
      description: `${newCategory.name} has been added`,
    });
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = () => {
    if (!editingCategory.id || !editingCategory.name) {
      toast({
        title: "Error",
        description: "Category ID and name are required",
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory.originalId ? { id: editingCategory.id, name: editingCategory.name } : cat
    ));
    setEditingCategory(null);
    
    toast({
      title: "Category Updated",
      description: "Category has been updated successfully",
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    
    toast({
      title: "Category Deleted",
      description: "Category has been removed",
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
  };

  const cancelAdd = () => {
    setIsAddingNew(false);
    setNewCategory({ id: '', name: '' });
  };

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
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
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
                    value={newCategory.id}
                    onChange={(e) => setNewCategory({...newCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    placeholder="category-id"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    placeholder="Category Name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={handleAddCategory}
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
                        value={editingCategory.id}
                        onChange={(e) => setEditingCategory({...editingCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={handleSaveEdit}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCategory({...category, originalId: category.id})}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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
