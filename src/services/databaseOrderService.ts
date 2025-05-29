
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseOrder {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderWithItems extends DatabaseOrder {
  items: (DatabaseOrderItem & {
    menu_item: {
      name: string;
      image: string;
    };
  })[];
}

export const getAllDatabaseOrders = async (): Promise<OrderWithItems[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            name,
            image
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return (data || []).map(order => ({
      ...order,
      items: order.order_items.map((item: any) => ({
        ...item,
        menu_item: item.menu_items
      }))
    }));
  } catch (error) {
    console.error('Error in getAllDatabaseOrders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, status: DatabaseOrder['status']): Promise<DatabaseOrder> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
};

export const createDatabaseOrder = async (orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total: number;
  status?: DatabaseOrder['status'];
  payment_status?: DatabaseOrder['payment_status'];
  payment_method?: string;
  address?: string;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    price: number;
  }>;
}): Promise<DatabaseOrder> => {
  try {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        total: orderData.total,
        status: orderData.status || 'pending',
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method,
        address: orderData.address
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    return order;
  } catch (error) {
    console.error('Error in createDatabaseOrder:', error);
    throw error;
  }
};

export const getDatabaseOrderStats = async () => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }

    const today = new Date().toDateString();
    
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + Number(order.total), 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      preparingOrders: orders.filter(order => order.status === 'preparing').length,
      readyOrders: orders.filter(order => order.status === 'ready').length,
      deliveredOrders: orders.filter(order => order.status === 'delivered').length,
      todayOrders: orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === today;
      }).length,
      todayRevenue: orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === today;
      }).reduce((sum, order) => sum + Number(order.total), 0)
    };
  } catch (error) {
    console.error('Error in getDatabaseOrderStats:', error);
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
