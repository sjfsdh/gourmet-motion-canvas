
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/hooks/useCart';

// Get cart storage key based on user or session
const getCartKey = (userId?: string) => {
  if (userId) return `cart_${userId}`;
  
  // Generate session ID for guests
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guest_session_id', sessionId);
  }
  return `cart_${sessionId}`;
};

export const saveCartToSupabase = async (userId: string, cart: CartItem[]) => {
  try {
    console.log('Saving cart to Supabase for user:', userId, cart);
    
    // First try to update existing cart
    const { data: existingCart } = await supabase
      .from('user_carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingCart) {
      // Update existing cart
      const { error } = await supabase
        .from('user_carts')
        .update({
          cart_data: cart as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error updating cart:', error);
        throw error;
      }
      console.log('Cart updated successfully');
    } else {
      // Insert new cart
      const { error } = await supabase
        .from('user_carts')
        .insert({
          user_id: userId,
          cart_data: cart as any,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error inserting cart:', error);
        throw error;
      }
      console.log('Cart inserted successfully');
    }
  } catch (error) {
    console.error('Error saving cart to Supabase:', error);
    // Fallback to localStorage if Supabase fails
    saveCartToStorage(cart, userId);
  }
};

export const loadCartFromSupabase = async (userId: string): Promise<CartItem[]> => {
  try {
    console.log('Loading cart from Supabase for user:', userId);
    
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart_data')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error loading cart from Supabase:', error);
      return loadCartFromStorage(userId);
    }
    
    if (!data || !data.cart_data) {
      console.log('No cart data found in Supabase');
      return loadCartFromStorage(userId);
    }
    
    const cartData = (data.cart_data as unknown as CartItem[]) || [];
    console.log('Cart loaded from Supabase:', cartData);
    return cartData;
  } catch (error) {
    console.error('Error loading cart from Supabase:', error);
    return loadCartFromStorage(userId);
  }
};

export const saveCartToStorage = (cart: CartItem[], userId?: string) => {
  try {
    const key = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
    console.log('Cart saved to localStorage:', key, cart);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const loadCartFromStorage = (userId?: string): CartItem[] => {
  try {
    const key = getCartKey(userId);
    const saved = localStorage.getItem(key);
    const cart = saved ? JSON.parse(saved) : [];
    console.log('Cart loaded from localStorage:', key, cart);
    return cart;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

export const clearCart = async (userId?: string) => {
  try {
    const key = getCartKey(userId);
    localStorage.removeItem(key);
    
    if (userId) {
      const { error } = await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error clearing cart from Supabase:', error);
      }
    }
    console.log('Cart cleared for user:', userId);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};
