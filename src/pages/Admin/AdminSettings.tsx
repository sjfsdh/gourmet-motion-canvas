
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CustomButton } from '@/components/ui/custom-button';
import { supabase } from '@/integrations/supabase/client';
import { getRestaurantSettings, updateRestaurantSettings } from '@/services/settingsService';

interface SettingsFormData {
  restaurant_name: string;
  restaurant_address: string;
  restaurant_phone: string;
  restaurant_email: string;
  opening_hours: string;
}

const AdminSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SettingsFormData>({
    restaurant_name: '',
    restaurant_address: '',
    restaurant_phone: '',
    restaurant_email: '',
    opening_hours: '',
  });
  const { toast } = useToast();

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await getRestaurantSettings();
        
        if (settings) {
          setSettingsId(settings.id);
          setFormData({
            restaurant_name: settings.restaurant_name || '',
            restaurant_address: settings.restaurant_address || '',
            restaurant_phone: settings.restaurant_phone || '',
            restaurant_email: settings.restaurant_email || '',
            opening_hours: settings.opening_hours || '',
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load restaurant settings.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settingsId) {
      toast({
        title: 'Error',
        description: 'Settings ID not found.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      const updatedSettings = await updateRestaurantSettings(settingsId, formData);
      
      if (updatedSettings) {
        toast({
          title: 'Success',
          description: 'Restaurant settings have been updated.',
        });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save restaurant settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Settings</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="restaurant_name" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                id="restaurant_name"
                name="restaurant_name"
                value={formData.restaurant_name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="restaurant_address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="restaurant_address"
                name="restaurant_address"
                value={formData.restaurant_address}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="restaurant_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="restaurant_phone"
                  name="restaurant_phone"
                  value={formData.restaurant_phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="restaurant_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="restaurant_email"
                  name="restaurant_email"
                  value={formData.restaurant_email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="opening_hours" className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <textarea
                id="opening_hours"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Mon-Fri: 9AM - 10PM, Sat-Sun: 10AM - 11PM"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <CustomButton 
                type="submit" 
                disabled={isSaving}
                icon={isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </CustomButton>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
