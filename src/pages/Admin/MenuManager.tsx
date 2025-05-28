
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Image, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleFeaturedStatus, toggleInStockStatus } from '@/services/menuService';

const MenuManager = () => {
  const [editItem, setEditItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch menu items using React Query
  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: getAllMenuItems
  });

  // Categories for the dropdown
  const categories = [
    { id: 'starters', name: 'Starters' },
    { id: 'mains', name: 'Mains' },
    { id: 'sides', name: 'Sides' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' }
  ];

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Item Added",
        description: "New menu item has been successfully added",
      });
      setEditItem(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Item Updated",
        description: "Menu item has been successfully updated",
      });
      setEditItem(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Item Deleted",
        description: "Menu item has been successfully removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  });

  const toggleStockMutation = useMutation({
    mutationFn: ({ id, in_stock }: { id: number; in_stock: boolean }) => toggleInStockStatus(id, in_stock),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: updatedItem?.in_stock ? "Item In Stock" : "Item Out of Stock",
        description: `${updatedItem?.name} is now ${updatedItem?.in_stock ? 'available' : 'unavailable'} for ordering`,
      });
    }
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: number; featured: boolean }) => toggleFeaturedStatus(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    }
  });

  const handleAddItem = () => {
    setIsAdding(true);
    setEditItem({
      name: '',
      description: '',
      price: 0,
      category: 'starters',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      featured: false,
      in_stock: true
    });
  };

  const handleEditItem = (item: any) => {
    setIsAdding(false);
    setEditItem({ ...item });
  };

  const handleDeleteItem = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSaveItem = () => {
    if (isAdding) {
      createMutation.mutate({
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        category: editItem.category,
        image: editItem.image,
        featured: editItem.featured,
        in_stock: editItem.in_stock
      });
    } else {
      updateMutation.mutate({
        id: editItem.id,
        data: {
          name: editItem.name,
          description: editItem.description,
          price: editItem.price,
          category: editItem.category,
          image: editItem.image,
          featured: editItem.featured,
          in_stock: editItem.in_stock
        }
      });
    }
  };

  const handleToggleStock = (item: any) => {
    toggleStockMutation.mutate({
      id: item.id,
      in_stock: !item.in_stock
    });
  };

  const handleToggleFeatured = (item: any) => {
    toggleFeaturedMutation.mutate({
      id: item.id,
      featured: !item.featured
    });
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
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Menu Items</h3>
          <p className="text-red-500">Failed to load menu items. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Menu Management</h1>
          <p className="text-gray-500">Add, edit or remove menu items</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          className="bg-restaurant-green text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-1" /> Add New Item
        </motion.button>
      </div>

      {/* Item editor modal */}
      {editItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isAdding ? 'Add New Menu Item' : 'Edit Menu Item'}
              </h2>
              <button
                onClick={() => setEditItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editItem.description}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editItem.price}
                        onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={editItem.category}
                        onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-6 mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={editItem.featured}
                        onChange={(e) => setEditItem({ ...editItem, featured: e.target.checked })}
                        className="h-4 w-4 text-restaurant-green focus:ring-restaurant-green border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                        Featured Item
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={editItem.in_stock}
                        onChange={(e) => setEditItem({ ...editItem, in_stock: e.target.checked })}
                        className="h-4 w-4 text-restaurant-green focus:ring-restaurant-green border-gray-300 rounded"
                      />
                      <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                        In Stock
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={editItem.image}
                      onChange={(e) => setEditItem({ ...editItem, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden">
                      {editItem.image ? (
                        <img
                          src={editItem.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Image size={48} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <AlertCircle size={16} className="mr-1" />
                    For best results, use images that are at least 800x600px.
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-restaurant-green text-white rounded-md hover:bg-restaurant-green/90 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (isAdding ? 'Add Item' : 'Save Changes')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Menu Items List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {categories.find(cat => cat.id === item.category)?.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStock(item)}
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.in_stock 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {item.in_stock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`w-5 h-5 flex items-center justify-center rounded-full ${
                      item.featured 
                        ? 'bg-restaurant-green text-white' 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {item.featured && <Check size={12} />}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManager;
