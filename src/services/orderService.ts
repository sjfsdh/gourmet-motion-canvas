
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  delivery_address?: string;
  phone?: string;
  notes?: string;
}

const ORDERS_KEY = 'restaurant_orders';
const USER_ORDERS_KEY = 'user_orders';

export const getUserOrders = (userId: string): Order[] => {
  try {
    const userOrdersKey = `${USER_ORDERS_KEY}_${userId}`;
    const orders = localStorage.getItem(userOrdersKey);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error loading user orders:', error);
    return [];
  }
};

export const getAllOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error loading all orders:', error);
    return [];
  }
};

export const createOrder = (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Order => {
  try {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to all orders
    const allOrders = getAllOrders();
    allOrders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    // Save to user's orders
    const userOrdersKey = `${USER_ORDERS_KEY}_${orderData.user_id}`;
    const userOrders = getUserOrders(orderData.user_id);
    userOrders.push(newOrder);
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));

    // Trigger order created event
    window.dispatchEvent(new CustomEvent('orderCreated', { detail: newOrder }));

    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = (orderId: string, status: Order['status']): Order | null => {
  try {
    // Update in all orders
    const allOrders = getAllOrders();
    const orderIndex = allOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    allOrders[orderIndex].status = status;
    allOrders[orderIndex].updated_at = new Date().toISOString();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    const updatedOrder = allOrders[orderIndex];

    // Update in user's orders
    const userOrdersKey = `${USER_ORDERS_KEY}_${updatedOrder.user_id}`;
    const userOrders = getUserOrders(updatedOrder.user_id);
    const userOrderIndex = userOrders.findIndex(order => order.id === orderId);
    
    if (userOrderIndex !== -1) {
      userOrders[userOrderIndex] = updatedOrder;
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
    }

    // Trigger order updated event
    window.dispatchEvent(new CustomEvent('orderUpdated', { detail: updatedOrder }));

    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
};

export const getOrderById = (orderId: string): Order | null => {
  try {
    const allOrders = getAllOrders();
    return allOrders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
};

export const getOrderStats = () => {
  try {
    const orders = getAllOrders();
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      preparingOrders: orders.filter(order => order.status === 'preparing').length,
      readyOrders: orders.filter(order => order.status === 'ready').length,
      deliveredOrders: orders.filter(order => order.status === 'delivered').length,
      todayOrders: orders.filter(order => {
        const orderDate = new Date(order.created_at);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      }).length,
      todayRevenue: orders.filter(order => {
        const orderDate = new Date(order.created_at);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      }).reduce((sum, order) => sum + order.total, 0)
    };

    return stats;
  } catch (error) {
    console.error('Error calculating order stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      preparingOrders: 0,
      readyOrders: 0,
      deliveredOrders: 0,
      todayOrders: 0,
      todayRevenue: 0
    };
  }
};
