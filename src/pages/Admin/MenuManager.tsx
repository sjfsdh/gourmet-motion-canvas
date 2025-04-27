
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Image, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock menu data from your existing menu
const initialMenuItems = [
  {
    id: 1,
    name: 'Burrata Salad',
    description: 'Fresh burrata cheese with heirloom tomatoes, basil, and aged balsamic.',
    price: 14.99,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    inStock: true
  },
  {
    id: 2,
    name: 'Truffle Arancini',
    description: 'Crispy risotto balls with wild mushrooms, truffle, and parmesan.',
    price: 12.99,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1604135307399-86c3e6035d13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: false,
    inStock: true
  },
  {
    id: 4,
    name: 'Filet Mignon',
    description: '8oz prime beef tenderloin with red wine reduction and roasted vegetables.',
    price: 42.99,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    inStock: true
  },
  {
    id: 10,
    name: 'Chocolate Fondant',
    description: 'Warm chocolate cake with a molten center and vanilla ice cream.',
    price: 12.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true,
    inStock: false
  }
];

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [editItem, setEditItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  
  // Categories for the dropdown
  const categories = [
    { id: 'starters', name: 'Starters' },
    { id: 'mains', name: 'Mains' },
    { id: 'sides', name: 'Sides' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' }
  ];

  const handleAddItem = () => {
    setIsAdding(true);
    setEditItem({
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      category: 'starters',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      featured: false,
      inStock: true
    });
  };

  const handleEditItem = (item: any) => {
    setIsAdding(false);
    setEditItem({ ...item });
  };

  const handleDeleteItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({
      title: "Item Deleted",
      description: "Menu item has been successfully removed",
    });
  };

  const handleSaveItem = () => {
    if (isAdding) {
      setMenuItems([...menuItems, editItem]);
      toast({
        title: "Item Added",
        description: "New menu item has been successfully added",
      });
    } else {
      setMenuItems(menuItems.map(item => item.id === editItem.id ? editItem : item));
      toast({
        title: "Item Updated",
        description: "Menu item has been successfully updated",
      });
    }
    setEditItem(null);
  };

  const handleToggleStock = (id: number) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id) {
        const newStockStatus = !item.inStock;
        toast({
          title: newStockStatus ? "Item In Stock" : "Item Out of Stock",
          description: `${item.name} is now ${newStockStatus ? 'available' : 'unavailable'} for ordering`,
        });
        return { ...item, inStock: newStockStatus };
      }
      return item;
    }));
  };

  const handleToggleFeatured = (id: number) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id) {
        return { ...item, featured: !item.featured };
      }
      return item;
    }));
  };

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
                        checked={editItem.inStock}
                        onChange={(e) => setEditItem({ ...editItem, inStock: e.target.checked })}
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
                  className="px-4 py-2 bg-restaurant-green text-white rounded-md hover:bg-restaurant-green/90"
                >
                  {isAdding ? 'Add Item' : 'Save Changes'}
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
                    onClick={() => handleToggleStock(item.id)}
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.inStock 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleFeatured(item.id)}
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
