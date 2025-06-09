
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, customerName, orderTotal, orderItems }: OrderConfirmationRequest = await req.json();

    console.log("Processing order confirmation for:", { orderId, customerEmail });

    // Generate order items HTML
    const orderItemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - DistinctGyrro</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your order</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hi ${customerName}!</h2>
            <p>We've received your order and are preparing your delicious Mediterranean cuisine. Here are the details:</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #2c3e50;">Order #${orderId}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #e9ecef;">
                    <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                    <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                    <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                    <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                  <tr style="background: #f8f9fa; font-weight: bold;">
                    <td colspan="3" style="padding: 12px 8px; text-align: right; border-top: 2px solid #dee2e6;">Total:</td>
                    <td style="padding: 12px 8px; text-align: right; border-top: 2px solid #dee2e6;">$${orderTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #2e7d32; margin: 0 0 10px 0;">⏱️ Estimated Preparation Time</h4>
              <p style="margin: 0; color: #2e7d32;">Your order will be ready in approximately 15-25 minutes.</p>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">📍 Pickup Information</h4>
              <p style="margin: 0; color: #856404;">
                <strong>DistinctGyrro</strong><br>
                123 Main Street<br>
                City, Country<br>
                Phone: +1 (123) 456-7890
              </p>
            </div>
            
            <p style="margin: 30px 0 0 0; text-align: center; color: #6c757d;">
              Questions about your order? Reply to this email or call us at +1 (123) 456-7890
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                Thank you for choosing DistinctGyrro!<br>
                <em>Authentic Mediterranean cuisine crafted with passion</em>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "DistinctGyrro <noreply@distinctgyrro.com>",
      to: [customerEmail],
      subject: `Order Confirmation #${orderId} - DistinctGyrro`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
