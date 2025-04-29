
import { query } from '../config/database';
import { uploadImage } from '../config/cloudinary';
import { supabase } from '../integrations/supabase/client';

// Types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  inStock?: boolean;
}

export interface CountResult {
  count: string;
}

// Type guard to check if object is a MenuItem
function isMenuItem(obj: any): obj is MenuItem {
  return obj && 
    typeof obj.id === 'number' && 
    typeof obj.name === 'string' &&
    typeof obj.price === 'number';
}

// Type guard to check if array contains MenuItems
function isMenuItemArray(arr: any[]): arr is MenuItem[] {
  return arr.length === 0 || isMenuItem(arr[0]);
}

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuItems = await query('SELECT * FROM menu_items');
    
    // Check if the result is valid menu items
    if (isMenuItemArray(menuItems)) {
      return menuItems;
    }
    return [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// Get menu item by id
export const getMenuItemById = async (id: number): Promise<MenuItem | null> => {
  try {
    const result = await query('SELECT * FROM menu_items WHERE id = $1', [id]);
    
    // Check if the result is a valid menu item
    if (result.length > 0 && isMenuItem(result[0])) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    return null;
  }
};

// Get featured menu items
export const getFeaturedMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const result = await query('SELECT * FROM menu_items WHERE featured = true');
    
    // Check if the results are valid menu items
    if (isMenuItemArray(result)) {
      return result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching featured menu items:', error);
    return [];
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    const result = await query('SELECT * FROM menu_items WHERE category = $1', [category]);
    
    // Check if the results are valid menu items
    if (isMenuItemArray(result)) {
      return result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    return [];
  }
};

// Create a new menu item
export const createMenuItem = async (item: Omit<MenuItem, 'id'>, imageFile?: string): Promise<MenuItem | null> => {
  try {
    let imageUrl = item.image;
    
    // If an image file is provided, upload it to Cloudinary
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile);
      imageUrl = uploadResult.secure_url;
    }
    
    const { name, description, price, category, featured } = item;
    const newItem = {
      name,
      description,
      price,
      image: imageUrl,
      category,
      featured,
      in_stock: true
    };
    
    const result = await query(
      'INSERT INTO menu_items (name, description, price, image, category, featured, in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [newItem]
    );
    
    // Check if the result is a valid menu item
    if (result.length > 0 && isMenuItem(result[0])) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error('Error creating menu item:', error);
    return null;
  }
};

// Update a menu item
export const updateMenuItem = async (id: number, item: Partial<MenuItem>, imageFile?: string): Promise<MenuItem | null> => {
  try {
    let imageUrl = item.image;
    
    // If an image file is provided, upload it to Cloudinary
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile);
      imageUrl = uploadResult.secure_url;
      item.image = imageUrl;
    }
    
    // Create update object with only defined fields
    const updates: any = {};
    
    if (item.name !== undefined) updates.name = item.name;
    if (item.description !== undefined) updates.description = item.description;
    if (item.price !== undefined) updates.price = item.price;
    if (item.image !== undefined) updates.image = item.image;
    if (item.category !== undefined) updates.category = item.category;
    if (item.featured !== undefined) updates.featured = item.featured;
    if (item.inStock !== undefined) updates.in_stock = item.inStock;
    
    if (Object.keys(updates).length === 0) {
      return null;
    }
    
    const result = await query(
      `UPDATE menu_items SET ${Object.keys(updates).map(key => `${key} = $1`).join(', ')} WHERE id = $2 RETURNING *`,
      [updates, id]
    );
    
    // Check if the result is a valid menu item
    if (result.length > 0 && isMenuItem(result[0])) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    return null;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: number): Promise<boolean> => {
  try {
    await query('DELETE FROM menu_items WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    return false;
  }
};

// Create table if it doesn't exist - this is now handled by our SQL migration
export const initializeMenuItemsTable = async (): Promise<void> => {
  try {
    // This function is now a no-op since we've created the tables with SQL migration
    console.log('Menu items table already initialized through migration');
  } catch (error) {
    console.error('Error initializing menu_items table:', error);
    throw error;
  }
};
