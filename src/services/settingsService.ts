
import { supabase } from '../integrations/supabase/client';

export interface RestaurantSettings {
  id: number;
  restaurant_name: string;
  restaurant_address: string;
  restaurant_phone: string;
  restaurant_email: string;
  opening_hours: string;
  created_at?: string;
  updated_at?: string;
}

// Get restaurant settings
export const getRestaurantSettings = async (): Promise<RestaurantSettings | null> => {
  try {
    const { data, error } = await supabase.from('settings').select('*').order('id', { ascending: true }).limit(1);
    
    if (error) throw error;
    return data && data[0] ? data[0] : null;
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    return null;
  }
};

// Update restaurant settings
export const updateRestaurantSettings = async (id: number, settings: Partial<RestaurantSettings>): Promise<RestaurantSettings | null> => {
  try {
    // Add updated_at timestamp
    const updatedSettings = {
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('settings').update(updatedSettings).eq('id', id).select('*');
    
    if (error) throw error;
    return data && data[0] ? data[0] : null;
  } catch (error) {
    console.error('Error updating restaurant settings:', error);
    return null;
  }
};
