
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveCartToSupabase, loadCartFromSupabase, saveCartToStorage, loadCartFromStorage } from '@/services/cartService';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  category?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    loadCart();
  }, [user]);
  
  const loadCart = async () => {
    setIsLoading(true);
    try {
      let loadedCart: CartItem[] = [];
      
      if (user) {
        // Load from Supabase for authenticated users
        loadedCart = await loadCartFromSupabase(user.id);
      } else {
        // Load from localStorage for guests
        loadedCart = loadCartFromStorage();
      }
      
      setCart(loadedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveCart = async (newCart: CartItem[]) => {
    try {
      if (user) {
        await saveCartToSupabase(user.id, newCart);
      } else {
        saveCartToStorage(newCart);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };
  
  const addToCart = async (item: any, quantity = 1) => {
    if (!item || !item.id) {
      toast({
        title: "Error",
        description: "Invalid item. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    const cartItem: CartItem = {
      id: Number(item.id),
      name: String(item.name),
      price: Number(item.price),
      image: item.image || '',
      quantity: Number(quantity),
      description: item.description,
      category: item.category
    };
    
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(i => i.id === cartItem.id);
    
    if (existingIndex !== -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push(cartItem);
    }
    
    setCart(newCart);
    await saveCart(newCart);
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };
  
  const removeFromCart = async (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    await saveCart(newCart);
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
      duration: 2000,
    });
  };
  
  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }
    
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    
    setCart(newCart);
    await saveCart(newCart);
  };
  
  const clearCart = async () => {
    setCart([]);
    await saveCart([]);
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      duration: 2000,
    });
  };
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    isLoading,
  };
};
