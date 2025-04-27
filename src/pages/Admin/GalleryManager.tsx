
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Image, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock gallery images
const initialImages = [
  {
    id: 1,
    title: 'Burrata Salad',
    category: 'starters',
    url: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 2,
    title: 'Truffle Arancini',
    category: 'starters',
    url: 'https://images.unsplash.com/photo-1604135307399-86c3e6035d13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 3,
    title: 'Filet Mignon',
    category: 'mains',
    url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 4,
    title: 'Chocolate Fondant',
    category: 'desserts',
    url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 5,
    title: 'Herb-Crusted Salmon',
    category: 'mains',
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 6,
    title: 'Signature Cocktail',
    category: 'drinks',
    url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

const GalleryManager = () => {
  const [images, setImages] = useState(initialImages);
  const [newImage, setNewImage] = useState({
    id: 0,
    title: '',
    category: 'starters',
    url: '',
    featured: false
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();
  
  // Categories
  const categories = [
    { id: 'all', name: 'All Images' },
    { id: 'starters', name: 'Starters' },
    { id: 'mains', name: 'Mains' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' }
  ];
  
  // Filter images
  const filteredImages = images.filter(image => 
    activeCategory === 'all' || image.category === activeCategory
  );
  
  // Add image
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newImage.title || !newImage.url) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newId = Math.max(...images.map(img => img.id), 0) + 1;
    
    setImages([...images, { ...newImage, id: newId }]);
    setNewImage({
      id: 0,
      title: '',
      category: 'starters',
      url: '',
      featured: false
    });
    
    setShowAddForm(false);
    
    toast({
      title: "Image Added",
      description: "New image has been added to the gallery",
    });
  };
  
  // Delete image
  const handleDeleteImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
    
    toast({
      title: "Image Deleted",
      description: "The image has been removed from the gallery",
    });
  };
  
  // Toggle featured
  const handleToggleFeatured = (id: number) => {
    setImages(images.map(img => {
      if (img.id === id) {
        return { ...img, featured: !img.featured };
      }
      return img;
    }));
    
    const image = images.find(img => img.id === id);
    if (image) {
      toast({
        title: image.featured ? "Removed from Featured" : "Added to Featured",
        description: `"${image.title}" has been ${image.featured ? 'removed from' : 'added to'} featured images`,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gallery Management</h1>
          <p className="text-gray-500">Add and manage images in the restaurant gallery</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-restaurant-green text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-1" /> Add New Image
        </motion.button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-restaurant-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
          >
            <div className="relative aspect-w-16 aspect-h-9">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              
              {/* Featured badge */}
              {image.featured && (
                <div className="absolute top-2 right-2 bg-restaurant-terracotta text-white px-2 py-1 rounded-md text-xs font-medium">
                  Featured
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium truncate">{image.title}</h3>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleFeatured(image.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        image.featured ? 'bg-restaurant-terracotta text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                      title={image.featured ? "Remove from featured" : "Add to featured"}
                    >
                      <Check size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteImage(image.id)}
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"
                      title="Delete image"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
                <span className="text-white text-sm opacity-80 mt-1">{categories.find(c => c.id === image.category)?.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeCategory === 'all'
              ? "Get started by adding a new image to the gallery."
              : `No images in the ${categories.find(c => c.id === activeCategory)?.name.toLowerCase()} category.`}
          </p>
        </div>
      )}

      {/* Add image modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Image</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddImage} className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                  >
                    {categories.filter(c => c.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={newImage.url}
                    onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newImage.featured}
                    onChange={(e) => setNewImage({ ...newImage, featured: e.target.checked })}
                    className="h-4 w-4 text-restaurant-green focus:ring-restaurant-green border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Image
                  </label>
                </div>
                
                {newImage.url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={newImage.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-restaurant-green text-white rounded-md hover:bg-restaurant-green/90"
                >
                  Add Image
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryManager;
