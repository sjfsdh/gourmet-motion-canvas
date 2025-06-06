
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  estimatedTime?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerEmail, 
      customerName, 
      orderId, 
      orderItems, 
      total, 
      estimatedTime = "30-45 minutes" 
    }: OrderConfirmationRequest = await req.json();

    const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: "DistinctGyrro <orders@distinctgyrro.com>",
      to: [customerEmail],
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Order Confirmation</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #f9f9f9;
            }
            .container {
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #22c55e, #16a34a); 
              color: white; 
              padding: 30px; 
              text-align: center; 
            }
            .content { 
              padding: 30px; 
            }
            .order-details {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .items-table th {
              background: #22c55e;
              color: white;
              padding: 12px 8px;
              text-align: left;
            }
            .total-row {
              font-weight: bold;
              background: #f0f0f0;
            }
            .footer { 
              background: #f9fafb; 
              padding: 20px; 
              text-align: center; 
              font-size: 14px; 
              color: #6b7280; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order, ${customerName}!</p>
            </div>
            
            <div class="content">
              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> #${orderId}</p>
                <p><strong>Estimated Delivery:</strong> ${estimatedTime}</p>
                <p><strong>Status:</strong> Confirmed & Being Prepared</p>
              </div>
              
              <h3>Your Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 12px 8px; text-align: right;">Total:</td>
                    <td style="padding: 12px 8px; text-align: right;">$${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p><strong>📱 Order Updates:</strong> We'll send you updates as your order progresses!</p>
                <p><strong>🚀 Questions?</strong> Reply to this email or call us at +1 (123) 456-7890</p>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing DistinctGyrro!</p>
              <p>This email was sent regarding your order #${orderId}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Order confirmation email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to send order confirmation email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
