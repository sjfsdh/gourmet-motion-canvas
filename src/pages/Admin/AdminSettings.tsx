import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestaurantSettings, updateRestaurantSettings, RestaurantSettings } from '@/services/settingsService';

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<RestaurantSettings>({
    id: 1,
    restaurant_name: '',
    restaurant_address: '',
    restaurant_phone: '',
    restaurant_email: '',
    opening_hours: '',
    logo_url: '',
    hero_image_url: '',
    about_text: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    delivery_fee: 0
  });

  // Fetch current settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['restaurantSettings'],
    queryFn: getRestaurantSettings,
    refetchOnWindowFocus: true,
    staleTime: 0 // Always fetch fresh data
  });

  // Update local state when settings are loaded
  useEffect(() => {
    if (currentSettings) {
      console.log('AdminSettings: Loading current settings:', currentSettings);
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  // Mutation for updating settings
  const updateMutation = useMutation({
    mutationFn: (updatedSettings: Partial<RestaurantSettings>) => 
      updateRestaurantSettings(settings.id, updatedSettings),
    onSuccess: (updatedSettings) => {
      console.log('AdminSettings: Settings updated successfully:', updatedSettings);
      
      // Clear all caches and refetch
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ['restaurantSettings'] });
      
      toast({
        title: "Settings Updated",
        description: "Restaurant settings have been updated successfully.",
      });
      
      // Update local state immediately
      setSettings(updatedSettings);
    },
    onError: (error) => {
      console.error('AdminSettings: Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: keyof RestaurantSettings, value: string | number) => {
    console.log('AdminSettings: Input changed:', field, value);
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!settings.restaurant_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Restaurant name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!settings.restaurant_email.trim()) {
      toast({
        title: "Validation Error",
        description: "Restaurant email is required.",
        variant: "destructive"
      });
      return;
    }

    if (settings.delivery_fee !== undefined && settings.delivery_fee < 0) {
      toast({
        title: "Validation Error",
        description: "Delivery fee cannot be negative.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('AdminSettings: Saving settings:', settings);
    updateMutation.mutate(settings);
  };

  const handleForceRefresh = () => {
    queryClient.clear();
    window.location.reload();
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center">
            <Settings className="mr-2" />
            Restaurant Settings
          </h1>
          <p className="text-gray-500">Manage your restaurant information and settings</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleForceRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Page
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-restaurant-green text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={settings.restaurant_name}
                onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                placeholder="Enter restaurant name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                rows={3}
                value={settings.restaurant_address}
                onChange={(e) => handleInputChange('restaurant_address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                placeholder="Enter restaurant address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={settings.restaurant_phone}
                  onChange={(e) => handleInputChange('restaurant_phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={settings.restaurant_email}
                  onChange={(e) => handleInputChange('restaurant_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.delivery_fee || 0}
                onChange={(e) => handleInputChange('delivery_fee', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                placeholder="0.00"
              />
              <p className="text-sm text-gray-500 mt-1">Set to 0 for free delivery</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Operating Hours</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opening Hours *
            </label>
            <textarea
              rows={6}
              value={settings.opening_hours}
              onChange={(e) => handleInputChange('opening_hours', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
              placeholder="Monday - Friday: 8:00 AM - 10:00 PM&#10;Saturday: 9:00 AM - 11:00 PM&#10;Sunday: 10:00 AM - 9:00 PM"
              required
            />
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <AlertCircle size={16} className="mr-2" />
              Use line breaks to separate different days
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {updateMutation.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md"
        >
          <div className="flex items-center text-green-800">
            <Settings className="mr-2" size={20} />
            Settings have been updated successfully! Changes will be reflected across the site.
          </div>
        </motion.div>
      )}

      {/* Current Settings Display */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Current Settings Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Restaurant Name:</strong> {settings.restaurant_name}
          </div>
          <div>
            <strong>Phone:</strong> {settings.restaurant_phone}
          </div>
          <div>
            <strong>Delivery Fee:</strong> ${(settings.delivery_fee || 0).toFixed(2)}
          </div>
          <div className="md:col-span-2">
            <strong>Address:</strong> {settings.restaurant_address}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
