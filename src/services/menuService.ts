
import { supabase } from '@/integrations/supabase/client';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  in_stock: boolean;
  created_at?: string;
}

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// Get menu item by ID
export const getMenuItemById = async (id: number): Promise<MenuItem | null> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching menu item #${id}:`, error);
    return null;
  }
};

// Get featured menu items
export const getFeaturedMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('featured', true)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured menu items:', error);
    return [];
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    return [];
  }
};

// Create a new menu item
export const createMenuItem = async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem | null> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        image: menuItem.image,
        category: menuItem.category,
        featured: menuItem.featured,
        in_stock: menuItem.in_stock
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    return null;
  }
};

// Update an existing menu item
export const updateMenuItem = async (id: number, menuItem: Partial<MenuItem>): Promise<MenuItem | null> => {
  try {
    const updateData: any = {};
    
    // Only include fields that exist in the update object
    if (menuItem.name !== undefined) updateData.name = menuItem.name;
    if (menuItem.description !== undefined) updateData.description = menuItem.description;
    if (menuItem.price !== undefined) updateData.price = menuItem.price;
    if (menuItem.image !== undefined) updateData.image = menuItem.image;
    if (menuItem.category !== undefined) updateData.category = menuItem.category;
    if (menuItem.featured !== undefined) updateData.featured = menuItem.featured;
    if (menuItem.in_stock !== undefined) updateData.in_stock = menuItem.in_stock;

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating menu item #${id}:`, error);
    return null;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting menu item #${id}:`, error);
    return false;
  }
};

// Toggle featured status
export const toggleFeaturedStatus = async (id: number, featured: boolean): Promise<MenuItem | null> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ featured })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error toggling featured status for menu item #${id}:`, error);
    return null;
  }
};

// Toggle in-stock status
export const toggleInStockStatus = async (id: number, in_stock: boolean): Promise<MenuItem | null> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ in_stock })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error toggling in-stock status for menu item #${id}:`, error);
    return null;
  }
};

// Get menu item categories
export const getMenuItemCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('category')
      .order('category');

    if (error) throw error;
    
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories;
  } catch (error) {
    console.error('Error fetching menu item categories:', error);
    return [];
  }
};

// Get count of menu items
export const getMenuItemCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error counting menu items:', error);
    return 0;
  }
};
