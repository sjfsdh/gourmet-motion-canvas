
import { useState, useEffect } from 'react';
import { getRestaurantSettings } from '@/services/settingsService';

export const useRestaurantName = () => {
  const [restaurantName, setRestaurantName] = useState('DistinctGyrro');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRestaurantName = async () => {
      try {
        const settings = await getRestaurantSettings();
        setRestaurantName(settings.restaurant_name);
      } catch (error) {
        console.error('Error loading restaurant name:', error);
        setRestaurantName('DistinctGyrro'); // fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurantName();

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      setRestaurantName(event.detail.restaurant_name);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  return { restaurantName, isLoading };
};
