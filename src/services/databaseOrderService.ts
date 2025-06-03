
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
    console.log('Fetching all orders from database...');
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

    console.log('Fetched orders:', data?.length || 0);

    return (data || []).map(order => ({
      ...order,
      status: order.status as DatabaseOrder['status'],
      payment_status: order.payment_status as DatabaseOrder['payment_status'],
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
    console.log('Updating order status:', orderId, status);
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

    return {
      ...data,
      status: data.status as DatabaseOrder['status'],
      payment_status: data.payment_status as DatabaseOrder['payment_status']
    };
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
    console.log('Creating new order:', orderData);
    
    // Validate required fields
    if (!orderData.customer_name || !orderData.customer_email) {
      throw new Error('Customer name and email are required');
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name.trim(),
        customer_email: orderData.customer_email.trim(),
        customer_phone: orderData.customer_phone?.trim() || null,
        total: Number(orderData.total),
        status: orderData.status || 'pending',
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method || 'card',
        address: orderData.address?.trim() || null
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Order created:', order);

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      menu_item_id: Number(item.menu_item_id),
      quantity: Number(item.quantity),
      price: Number(item.price),
      subtotal: Number(item.quantity) * Number(item.price)
    }));

    console.log('Creating order items:', orderItems);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // If order items creation fails, delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    console.log('Order items created successfully');

    return {
      ...order,
      status: order.status as DatabaseOrder['status'],
      payment_status: order.payment_status as DatabaseOrder['payment_status']
    };
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
