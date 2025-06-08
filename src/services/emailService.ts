
import { supabase } from '@/integrations/supabase/client';

export const sendOrderConfirmationEmail = async (orderData: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
      body: orderData
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
};

export const sendAdminVerificationEmail = async (email: string, confirmUrl: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-admin-verification', {
      body: {
        email,
        confirmUrl,
        siteName: 'DistinctGyrro'
      }
    });

    if (error) {
      console.error('Error sending admin verification email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send admin verification email:', error);
    throw error;
  }
};

export const sendNewsletterWelcomeEmail = async (email: string, name?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-newsletter-welcome', {
      body: {
        email,
        name
      }
    });

    if (error) {
      console.error('Error sending newsletter welcome email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error);
    throw error;
  }
};
