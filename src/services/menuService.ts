
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

interface CountResult {
  count: string;
}

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuItems = await query('SELECT * FROM menu_items');
    // Check if the result is valid menu items
    if (menuItems.length > 0 && 'name' in menuItems[0]) {
      return menuItems as MenuItem[];
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
    if (result.length > 0 && 'name' in result[0]) {
      return result[0] as MenuItem;
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
    if (result.length > 0 && 'name' in result[0]) {
      return result as MenuItem[];
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
    if (result.length > 0 && 'name' in result[0]) {
      return result as MenuItem[];
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
    const result = await query(
      'INSERT INTO menu_items (name, description, price, image, category, featured, in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, imageUrl, category, featured, true]
    );
    
    // Check if the result is a valid menu item
    if (result.length > 0 && 'name' in result[0]) {
      return result[0] as MenuItem;
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
    
    const { name, description, price, image, category, featured, inStock } = item;
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    
    if (price !== undefined) {
      updates.push(`price = $${paramCount}`);
      values.push(price);
      paramCount++;
    }
    
    if (image !== undefined) {
      updates.push(`image = $${paramCount}`);
      values.push(image);
      paramCount++;
    }
    
    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    
    if (featured !== undefined) {
      updates.push(`featured = $${paramCount}`);
      values.push(featured);
      paramCount++;
    }
    
    if (inStock !== undefined) {
      updates.push(`in_stock = $${paramCount}`);
      values.push(inStock);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return null;
    }
    
    values.push(id);
    
    const result = await query(
      `UPDATE menu_items SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    // Check if the result is a valid menu item
    if (result.length > 0 && 'name' in result[0]) {
      return result[0] as MenuItem;
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
    const result = await query('DELETE FROM menu_items WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    return false;
  }
};

// Create table if it doesn't exist
export const initializeMenuItemsTable = async (): Promise<void> => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image TEXT,
        category VARCHAR(100) NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        in_stock BOOLEAN DEFAULT TRUE
      )
    `);
    console.log('Menu items table initialized');
  } catch (error) {
    console.error('Error initializing menu_items table:', error);
    throw error;
  }
};
