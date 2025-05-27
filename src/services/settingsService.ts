
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

const SETTINGS_KEY = 'restaurant_settings';

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
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    // If no settings exist, save and return defaults
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
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
    const currentSettings = await getRestaurantSettings();
    const updatedSettings = { ...currentSettings, ...settings, id };
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    
    // Trigger a custom event to notify components of settings change
    window.dispatchEvent(new CustomEvent('settingsUpdated', { 
      detail: updatedSettings 
    }));
    
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
        const loadedSettings = await getRestaurantSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings(event.detail);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  return { settings, isLoading };
};
