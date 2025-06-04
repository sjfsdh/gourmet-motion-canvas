
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
  
  // Get the cart storage key - either user-specific or session-specific
  const getCartStorageKey = () => {
    return user ? `cart_${user.id}` : 'guest_cart';
  };
  
  useEffect(() => {
    // Load cart from localStorage on mount
    try {
      const cartKey = getCartStorageKey();
      const savedCart = localStorage.getItem(cartKey);
      console.log('useCart: Loading cart from localStorage:', cartKey, savedCart);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          // Validate cart items structure
          const validCart = parsedCart.filter(item => 
            item && typeof item === 'object' && 
            item.id && item.name && item.price && 
            typeof item.quantity === 'number' && item.quantity > 0
          );
          setCart(validCart);
          console.log('useCart: Cart loaded successfully:', validCart);
        } else {
          console.log('useCart: Invalid cart data, resetting cart');
          setCart([]);
        }
      } else {
        console.log('useCart: No saved cart found, starting with empty cart');
        setCart([]);
      }
    } catch (error) {
      console.error('useCart: Error parsing cart from localStorage:', error);
      setCart([]);
      localStorage.removeItem(getCartStorageKey());
    }
    
    setIsLoading(false);
  }, [user]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const cartKey = getCartStorageKey();
      console.log('useCart: Saving cart to localStorage:', cartKey, cart);
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, isLoading, user]);
  
  // Add item to cart
  const addToCart = (item: any, quantity = 1) => {
    if (!item || !item.id) {
      console.error('useCart: Invalid item passed to addToCart:', item);
      toast({
        title: "Error",
        description: "Invalid item. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('useCart: Adding item to cart:', item, 'quantity:', quantity);
    
    const cartItem: CartItem = {
      id: Number(item.id),
      name: String(item.name),
      price: Number(item.price),
      image: item.image || '',
      quantity: Number(quantity),
      description: item.description,
      category: item.category
    };
    
    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === Number(item.id));
      
      let updatedCart;
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += Number(quantity);
        console.log('useCart: Updated existing item:', updatedCart[existingItemIndex]);
      } else {
        // Item doesn't exist, add new item
        updatedCart = [...currentCart, cartItem];
        console.log('useCart: Added new item to cart:', cartItem);
      }
      
      console.log('useCart: Updated cart state:', updatedCart);
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
    console.log('useCart: Removing item from cart:', id);
    setCart(currentCart => {
      const updatedCart = currentCart.filter(item => item.id !== Number(id));
      console.log('useCart: Cart after removal:', updatedCart);
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
    console.log('useCart: Updating quantity for item:', id, 'to:', quantity);
    
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(currentCart => {
      const updatedCart = currentCart.map(item => 
        item.id === Number(id) ? { ...item, quantity: Number(quantity) } : item
      );
      console.log('useCart: Cart after quantity update:', updatedCart);
      return updatedCart;
    });
  };
  
  // Clear entire cart
  const clearCart = () => {
    console.log('useCart: Clearing entire cart');
    setCart([]);
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      duration: 2000,
    });
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  
  // Calculate total number of items
  const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  
  console.log('useCart: Current cart state summary:', { 
    cartLength: cart.length, 
    cartTotal: cartTotal.toFixed(2), 
    itemCount 
  });
  
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
