
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
    const { error } = await supabase
      .from('user_carts')
      .upsert({
        user_id: userId,
        cart_data: cart as any,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving cart to Supabase:', error);
  }
};

export const loadCartFromSupabase = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart_data')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error || !data) return [];
    return (data.cart_data as CartItem[]) || [];
  } catch (error) {
    console.error('Error loading cart from Supabase:', error);
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[], userId?: string) => {
  const key = getCartKey(userId);
  localStorage.setItem(key, JSON.stringify(cart));
};

export const loadCartFromStorage = (userId?: string): CartItem[] => {
  try {
    const key = getCartKey(userId);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const clearCart = async (userId?: string) => {
  const key = getCartKey(userId);
  localStorage.removeItem(key);
  
  if (userId) {
    await supabase.from('user_carts').delete().eq('user_id', userId);
  }
};
