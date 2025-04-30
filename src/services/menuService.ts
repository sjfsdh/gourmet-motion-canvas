
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
  created_at?: string; // Making created_at optional since it's added by the database
}

// Type guard to check if an object is a MenuItem
function isMenuItem(obj: any): obj is MenuItem {
  return obj && 
    typeof obj.id === 'number' && 
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.category === 'string' &&
    'description' in obj &&
    'image' in obj &&
    'featured' in obj &&
    'in_stock' in obj;
}

// Type guard to check if an object is CountResult
function isCountResult(obj: any): obj is CountResult {
  return obj && typeof obj.count === 'string';
}

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const data = await query('SELECT * FROM menu_items');
    // Ensure we only return objects that match the MenuItem interface
    return data.filter(isMenuItem) as MenuItem[];
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
      return data[0] as MenuItem;
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
    // Ensure we only return objects that match the MenuItem interface
    return data.filter(isMenuItem) as MenuItem[];
  } catch (error) {
    console.error('Error fetching featured menu items:', error);
    return [];
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    const data = await query('SELECT * FROM menu_items WHERE category = $1', [category]);
    // Ensure we only return objects that match the MenuItem interface
    return data.filter(isMenuItem) as MenuItem[];
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    return [];
  }
};

// Create a new menu item
export const createMenuItem = async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem | null> => {
  try {
    const { name, description, price, image, category, featured, in_stock } = menuItem;
    const data = await query(
      'INSERT INTO menu_items (name, description, price, image, category, featured, in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
      [name, description, price, image, category, featured, in_stock]
    );
    
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0] as MenuItem;
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
    // Build the SET clause and params dynamically
    const keys = Object.keys(menuItem).filter(key => key !== 'id');
    if (keys.length === 0) return null;
    
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = keys.map(key => menuItem[key as keyof Partial<MenuItem>]);
    
    const query_text = `UPDATE menu_items SET ${setClause} WHERE id = $1 RETURNING *`;
    const data = await query(query_text, [id, ...values]);
    
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0] as MenuItem;
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
    const data = await query('DELETE FROM menu_items WHERE id = $1 RETURNING id', [id]);
    return data.length > 0;
  } catch (error) {
    console.error(`Error deleting menu item #${id}:`, error);
    return false;
  }
};

// Toggle featured status
export const toggleFeaturedStatus = async (id: number, featured: boolean): Promise<MenuItem | null> => {
  try {
    const data = await query('UPDATE menu_items SET featured = $1 WHERE id = $2 RETURNING *', [featured, id]);
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0] as MenuItem;
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
    const data = await query('UPDATE menu_items SET in_stock = $1 WHERE id = $2 RETURNING *', [in_stock, id]);
    if (data.length > 0 && isMenuItem(data[0])) {
      return data[0] as MenuItem;
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
