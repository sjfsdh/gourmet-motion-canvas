
import { query } from '../config/database';

// Types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
}

// Get all menu items
export const getAllMenuItems = async () => {
  try {
    // This is a placeholder. Once the database is properly set up,
    // you would replace this with a real database query
    const menuItems = await query('SELECT * FROM menu_items');
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Return dummy data for now
    return [];
  }
};

// Get menu item by id
export const getMenuItemById = async (id: number) => {
  try {
    const result = await query('SELECT * FROM menu_items WHERE id = $1', [id]);
    return result[0];
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    return null;
  }
};

// Create a new menu item
export const createMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  try {
    const { name, description, price, image, category, featured } = item;
    const result = await query(
      'INSERT INTO menu_items (name, description, price, image, category, featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, image, category, featured]
    );
    return result[0];
  } catch (error) {
    console.error('Error creating menu item:', error);
    return null;
  }
};

// Update a menu item
export const updateMenuItem = async (id: number, item: Partial<MenuItem>) => {
  try {
    const { name, description, price, image, category, featured } = item;
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
    
    if (updates.length === 0) {
      return null;
    }
    
    values.push(id);
    
    const result = await query(
      `UPDATE menu_items SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    return result[0];
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    return null;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: number) => {
  try {
    await query('DELETE FROM menu_items WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    return false;
  }
};
