
import { supabase } from '../integrations/supabase/client';

// Define interfaces for common query result types
export interface CountResult {
  count: string;
}

// Check if a result is a CountResult
function isCountResult(obj: any): obj is CountResult {
  return obj && typeof obj.count === 'string';
}

// Function to execute database queries via Supabase
export const query = async (text: string, params?: any[]) => {
  try {
    console.log('Executing database query:', text, params || []);
    
    // Handle common query patterns
    if (text.includes('SELECT * FROM menu_items')) {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;
      return data || [];
    } 
    else if (text.includes('SELECT * FROM menu_items WHERE id =')) {
      const id = params ? params[0] : null;
      const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).single();
      if (error) throw error;
      return [data];
    }
    else if (text.includes('SELECT * FROM menu_items WHERE featured = true')) {
      const { data, error } = await supabase.from('menu_items').select('*').eq('featured', true);
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('SELECT * FROM menu_items WHERE category =')) {
      const category = params ? params[0] : null;
      const { data, error } = await supabase.from('menu_items').select('*').eq('category', category);
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('INSERT INTO menu_items')) {
      const { data, error } = await supabase.from('menu_items').insert(params?.[0] || {}).select();
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('UPDATE menu_items SET') && text.includes('WHERE id =')) {
      const id = params?.[params.length - 1];
      const updateData = params?.[0] || {};
      const { data, error } = await supabase.from('menu_items').update(updateData).eq('id', id).select();
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('DELETE FROM menu_items WHERE id =')) {
      const id = params ? params[0] : null;
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      return [{ success: true }];
    }
    else if (text.includes('SELECT COUNT(*) FROM')) {
      const tableName = text.split('FROM ')[1].trim().split(' ')[0];
      const { count, error } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
      if (error) throw error;
      return [{ count: count?.toString() }];
    }
    else if (text.includes('SELECT * FROM gallery')) {
      const { data, error } = await supabase.from('gallery').select('*');
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('INSERT INTO gallery')) {
      const { data, error } = await supabase.from('gallery').insert(params?.[0] || {}).select();
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('UPDATE gallery SET') && text.includes('WHERE id =')) {
      const id = params?.[params.length - 1];
      const updateData = params?.[0] || {};
      const { data, error } = await supabase.from('gallery').update(updateData).eq('id', id).select();
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('DELETE FROM gallery WHERE id =')) {
      const id = params ? params[0] : null;
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      return [{ success: true }];
    }
    else if (text.includes('SELECT * FROM settings')) {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      return data || [];
    }
    else if (text.includes('UPDATE settings SET')) {
      const id = params?.[params.length - 1];
      const updateData = params?.[0] || {};
      const { data, error } = await supabase.from('settings').update(updateData).eq('id', id).select();
      if (error) throw error;
      return data || [];
    }

    // For any unhandled queries, log and throw an error
    console.error('Unhandled query type:', text);
    throw new Error(`Query not implemented: ${text}`);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Function to test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('settings').select('restaurant_name').limit(1);
    if (error) throw error;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};
