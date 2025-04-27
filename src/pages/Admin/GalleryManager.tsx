
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Image, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock gallery images
const initialGalleryImages = [
  {
    id: 1,
    title: "Restaurant Interior",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 2,
    title: "Chef Special Dish",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: 3,
    title: "Outdoor Dining Area",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 4,
    title: "Signature Cocktail",
    url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    featured: false
  }
];

const GalleryManager = () => {
  const [images, setImages] = useState(initialGalleryImages);
  const [uploadModal, setUploadModal] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', url: '', featured: false });
  const { toast } = useToast();

  const handleDeleteImage = (id: number) => {
    setImages(images.filter(image => image.id !== id));
    toast({
      title: "Image Deleted",
      description: "The image has been removed from the gallery",
    });
  };

  const toggleFeatured = (id: number) => {
    setImages(images.map(image => 
      image.id === id ? { ...image, featured: !image.featured } : image
    ));
  };

  const handleAddImage = () => {
    if (!newImage.title || !newImage.url) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and image URL",
        variant: "destructive"
      });
      return;
    }

    setImages([...images, {
      id: Date.now(),
      title: newImage.title,
      url: newImage.url,
      featured: newImage.featured
    }]);

    setNewImage({ title: '', url: '', featured: false });
    setUploadModal(false);
    
    toast({
      title: "Image Added",
      description: "The new image has been added to the gallery",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gallery Management</h1>
          <p className="text-gray-500">Add, edit or remove gallery images</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setUploadModal(true)}
          className="bg-restaurant-green text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Upload size={20} className="mr-1" /> Add New Image
        </motion.button>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
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
                onClick={() => setUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Title
                  </label>
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    placeholder="Enter image title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newImage.url}
                    onChange={(e) => setNewImage({...newImage, url: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                    placeholder="Enter image URL"
                  />
                </div>

                {newImage.url && (
                  <div className="mt-2 border rounded-md overflow-hidden">
                    <img
                      src={newImage.url}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={newImage.featured}
                    onChange={(e) => setNewImage({...newImage, featured: e.target.checked})}
                    className="h-4 w-4 text-restaurant-green focus:ring-restaurant-green border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Image
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-restaurant-green text-white rounded-md hover:bg-restaurant-green/90"
                >
                  Add Image
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
              {image.featured && (
                <div className="absolute top-2 left-2 bg-restaurant-terracotta text-white px-2 py-1 rounded-md text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">{image.title}</h3>
              <div className="flex justify-between">
                <button
                  onClick={() => toggleFeatured(image.id)}
                  className={`flex items-center px-3 py-1 rounded-md text-sm ${
                    image.featured 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {image.featured ? 'Featured' : 'Mark as Featured'}
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty state if no images */}
        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Image size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No images yet</h3>
            <p className="text-gray-500 mb-6">Start adding images to your gallery</p>
            <button
              onClick={() => setUploadModal(true)}
              className="px-4 py-2 bg-restaurant-green text-white rounded-md hover:bg-restaurant-green/90"
            >
              Add First Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
