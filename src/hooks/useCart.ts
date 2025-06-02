
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  
  // Generate a unique cart ID for the current browser session
  const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cartId', cartId);
    }
    return cartId;
  };
  
  // Get the cart storage key - either user-specific or session-specific
  const getCartStorageKey = () => {
    return user ? `cart_${user.id}` : `cart_${getCartId()}`;
  };
  
  useEffect(() => {
    // Load cart from localStorage on mount
    try {
      const cartKey = getCartStorageKey();
      const savedCart = localStorage.getItem(cartKey);
      console.log('Loading cart from localStorage:', cartKey, savedCart);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
          console.log('Cart loaded:', parsedCart);
        } else {
          console.log('Invalid cart data, resetting cart');
          setCart([]);
        }
      } else {
        console.log('No saved cart found, starting with empty cart');
        setCart([]);
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      setCart([]);
      localStorage.removeItem(getCartStorageKey());
    }
    
    setIsLoading(false);
  }, [user]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const cartKey = getCartStorageKey();
      console.log('Saving cart to localStorage:', cartKey, cart);
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, isLoading, user]);
  
  // Add item to cart
  const addToCart = (item: any, quantity = 1) => {
    if (!item || !item.id) {
      console.error('Invalid item passed to addToCart:', item);
      toast({
        title: "Error",
        description: "Invalid item. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Adding item to cart:', item, 'quantity:', quantity);
    
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image || '',
      quantity: quantity,
      description: item.description,
      category: item.category
    };
    
    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
      
      let updatedCart;
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
        console.log('Updated existing item:', updatedCart[existingItemIndex]);
      } else {
        // Item doesn't exist, add new item
        updatedCart = [...currentCart, cartItem];
        console.log('Added new item to cart:', cartItem);
      }
      
      console.log('Updated cart state:', updatedCart);
      return updatedCart;
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    console.log('Removing item from cart:', id);
    setCart(currentCart => {
      const updatedCart = currentCart.filter(item => item.id !== id);
      console.log('Cart after removal:', updatedCart);
      return updatedCart;
    });
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
      duration: 2000,
    });
  };
  
  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    console.log('Updating quantity for item:', id, 'to:', quantity);
    
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(currentCart => {
      const updatedCart = currentCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      console.log('Cart after quantity update:', updatedCart);
      return updatedCart;
    });
  };
  
  // Clear entire cart
  const clearCart = () => {
    console.log('Clearing entire cart');
    setCart([]);
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      duration: 2000,
    });
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  
  // Calculate total number of items
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  console.log('Current cart state:', { cart, cartTotal, itemCount });
  
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
