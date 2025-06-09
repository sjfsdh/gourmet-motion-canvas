
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

export const sendAdminVerificationEmail = async (email: string, inviteLink: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-admin-verification', {
      body: {
        email,
        inviteLink,
        inviterName: 'DistinctGyrro Team'
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

export const sendTestEmail = async (email: string, subject: string, content: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-test-email', {
      body: {
        email,
        subject,
        content
      }
    });

    if (error) {
      console.error('Error sending test email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
};
