
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: number;
  name: string;
  display_name: string;
  order_index: number;
  created_at: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    throw error;
  }
};

export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        display_name: categoryData.display_name,
        order_index: categoryData.order_index
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
};

export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: categoryData.name,
        display_name: categoryData.display_name,
        order_index: categoryData.order_index
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw error;
  }
};
