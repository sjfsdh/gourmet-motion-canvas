
import { query, CountResult } from '../config/database';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  in_stock: boolean;
}

// Type guard to check if an object is a MenuItem
function isMenuItem(obj: any): obj is MenuItem {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

// Type guard to check if an object is CountResult
function isCountResult(obj: any): obj is CountResult {
  return obj && typeof obj.count === 'string';
}

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const data = await query('SELECT * FROM menu_items');
    // Filter out any non-MenuItem objects
    return data.filter(isMenuItem);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// Get menu item by ID
export const getMenuItemById = async (id: number): Promise<MenuItem | null> => {
  try {
    const data = await query('SELECT * FROM menu_items WHERE id = $1', [id]);
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching menu item #${id}:`, error);
    return null;
  }
};

// Get featured menu items
export const getFeaturedMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const data = await query('SELECT * FROM menu_items WHERE featured = true');
    return data.filter(isMenuItem);
  } catch (error) {
    console.error('Error fetching featured menu items:', error);
    return [];
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    const data = await query('SELECT * FROM menu_items WHERE category = $1', [category]);
    return data.filter(isMenuItem);
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    return [];
  }
};

// Create a new menu item
export const createMenuItem = async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem | null> => {
  try {
    const data = await query('INSERT INTO menu_items', [menuItem]);
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error('Error creating menu item:', error);
    return null;
  }
};

// Update an existing menu item
export const updateMenuItem = async (id: number, menuItem: Partial<MenuItem>): Promise<MenuItem | null> => {
  try {
    const data = await query('UPDATE menu_items SET $1 WHERE id = $2', [menuItem, id]);
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error(`Error updating menu item #${id}:`, error);
    return null;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: number): Promise<boolean> => {
  try {
    const data = await query('DELETE FROM menu_items WHERE id = $1', [id]);
    return !!data;
  } catch (error) {
    console.error(`Error deleting menu item #${id}:`, error);
    return false;
  }
};

// Toggle featured status
export const toggleFeaturedStatus = async (id: number, featured: boolean): Promise<MenuItem | null> => {
  try {
    const data = await query('UPDATE menu_items SET $1 WHERE id = $2', [{ featured }, id]);
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error(`Error toggling featured status for menu item #${id}:`, error);
    return null;
  }
};

// Toggle in-stock status
export const toggleInStockStatus = async (id: number, in_stock: boolean): Promise<MenuItem | null> => {
  try {
    const data = await query('UPDATE menu_items SET $1 WHERE id = $2', [{ in_stock }, id]);
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error(`Error toggling in-stock status for menu item #${id}:`, error);
    return null;
  }
};

// Get menu item categories
export const getMenuItemCategories = async (): Promise<string[]> => {
  try {
    const items = await getAllMenuItems();
    const categories = [...new Set(items.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching menu item categories:', error);
    return [];
  }
};

// Get count of menu items
export const getMenuItemCount = async (): Promise<number> => {
  try {
    const data = await query('SELECT COUNT(*) FROM menu_items');
    if (data.length > 0 && isCountResult(data[0])) {
      return parseInt(data[0].count, 10);
    }
    return 0;
  } catch (error) {
    console.error('Error counting menu items:', error);
    return 0;
  }
};
