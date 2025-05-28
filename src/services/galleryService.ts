
import { supabase } from '@/integrations/supabase/client';

// Types
export interface GalleryImage {
  id: number;
  title: string;
  url: string;
  featured: boolean;
  created_at?: string;
}

// Get all gallery images
export const getAllGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
};

// Get featured gallery images
export const getFeaturedGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('featured', true)
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured gallery images:', error);
    return [];
  }
};

// Add a new gallery image
export const addGalleryImage = async (image: Omit<GalleryImage, 'id'>): Promise<GalleryImage | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert({
        title: image.title,
        url: image.url,
        featured: image.featured || false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return null;
  }
};

// Update a gallery image
export const updateGalleryImage = async (id: number, image: Partial<GalleryImage>): Promise<GalleryImage | null> => {
  try {
    const updateData: any = {};
    
    if (image.title !== undefined) updateData.title = image.title;
    if (image.url !== undefined) updateData.url = image.url;
    if (image.featured !== undefined) updateData.featured = image.featured;

    const { data, error } = await supabase
      .from('gallery')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating gallery image ${id}:`, error);
    return null;
  }
};

// Delete a gallery image
export const deleteGalleryImage = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting gallery image ${id}:`, error);
    return false;
  }
};

// Toggle featured status
export const toggleGalleryImageFeatured = async (id: number, featured: boolean): Promise<GalleryImage | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .update({ featured })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error toggling featured status for gallery image ${id}:`, error);
    return null;
  }
};
