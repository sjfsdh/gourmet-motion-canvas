
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RestaurantSettings {
  id: number;
  restaurant_name: string;
  restaurant_address: string;
  restaurant_phone: string;
  restaurant_email: string;
  opening_hours: string;
  logo_url?: string;
  hero_image_url?: string;
  about_text?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
}

// Default settings
const defaultSettings: RestaurantSettings = {
  id: 1,
  restaurant_name: 'DistinctGyrro',
  restaurant_address: '123 Mediterranean Street\nFoodie District\nNew York, NY 10001',
  restaurant_phone: '+1 (212) 555-1234',
  restaurant_email: 'info@distinctgyrro.com',
  opening_hours: 'Monday - Friday: 8:00 AM - 10:00 PM\nSaturday: 9:00 AM - 11:00 PM\nSunday: 10:00 AM - 9:00 PM',
  logo_url: '',
  hero_image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  about_text: 'Experience the fresh, bold flavors of the Mediterranean with our carefully crafted dishes and warm hospitality.',
  facebook_url: '',
  instagram_url: '',
  twitter_url: ''
};

export const getRestaurantSettings = async (): Promise<RestaurantSettings> => {
  try {
    console.log('Loading restaurant settings...');
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error loading restaurant settings:', error);
      console.log('Using default settings');
      return defaultSettings;
    }

    console.log('Loaded settings from database:', data);

    // Map database fields to interface
    const settings = {
      id: data.id,
      restaurant_name: data.restaurant_name || defaultSettings.restaurant_name,
      restaurant_address: data.restaurant_address || defaultSettings.restaurant_address,
      restaurant_phone: data.restaurant_phone || defaultSettings.restaurant_phone,
      restaurant_email: data.restaurant_email || defaultSettings.restaurant_email,
      opening_hours: data.opening_hours || defaultSettings.opening_hours,
      logo_url: '',
      hero_image_url: defaultSettings.hero_image_url,
      about_text: defaultSettings.about_text,
      facebook_url: '',
      instagram_url: '',
      twitter_url: ''
    };

    console.log('Final settings object:', settings);
    return settings;
  } catch (error) {
    console.error('Error loading restaurant settings:', error);
    return defaultSettings;
  }
};

export const updateRestaurantSettings = async (
  id: number,
  settings: Partial<RestaurantSettings>
): Promise<RestaurantSettings> => {
  try {
    console.log('Updating restaurant settings:', settings);
    
    const { data, error } = await supabase
      .from('settings')
      .update({
        restaurant_name: settings.restaurant_name,
        restaurant_address: settings.restaurant_address,
        restaurant_phone: settings.restaurant_phone,
        restaurant_email: settings.restaurant_email,
        opening_hours: settings.opening_hours,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating restaurant settings:', error);
      throw error;
    }

    console.log('Settings updated in database:', data);

    const updatedSettings: RestaurantSettings = {
      id: data.id,
      restaurant_name: data.restaurant_name,
      restaurant_address: data.restaurant_address,
      restaurant_phone: data.restaurant_phone,
      restaurant_email: data.restaurant_email,
      opening_hours: data.opening_hours,
      logo_url: '',
      hero_image_url: defaultSettings.hero_image_url,
      about_text: defaultSettings.about_text,
      facebook_url: '',
      instagram_url: '',
      twitter_url: ''
    };
    
    console.log('Triggering settings update event');
    // Trigger a custom event to notify components of settings change
    window.dispatchEvent(new CustomEvent('settingsUpdated', { 
      detail: updatedSettings 
    }));
    
    // Also update localStorage for immediate access
    localStorage.setItem('restaurantSettings', JSON.stringify(updatedSettings));
    
    return updatedSettings;
  } catch (error) {
    console.error('Error updating restaurant settings:', error);
    throw error;
  }
};

// Hook to listen for settings changes
export const useRestaurantSettings = () => {
  const [settings, setSettings] = React.useState<RestaurantSettings>(defaultSettings);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('useRestaurantSettings: Loading settings...');
        const loadedSettings = await getRestaurantSettings();
        console.log('useRestaurantSettings: Settings loaded:', loadedSettings);
        setSettings(loadedSettings);
        // Store in localStorage for immediate access
        localStorage.setItem('restaurantSettings', JSON.stringify(loadedSettings));
      } catch (error) {
        console.error('useRestaurantSettings: Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('useRestaurantSettings: Settings update event received:', event.detail);
      setSettings(event.detail);
      localStorage.setItem('restaurantSettings', JSON.stringify(event.detail));
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  return { settings, isLoading };
};
