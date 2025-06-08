
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterWelcomeRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name = 'Food Lover' }: NewsletterWelcomeRequest = await req.json();

    // Add contact to Resend audience (optional - requires audience setup)
    const audienceId = Deno.env.get("RESEND_AUDIENCE_ID");
    if (audienceId) {
      try {
        await resend.contacts.create({
          email: email,
          firstName: name.split(' ')[0] || 'Food',
          lastName: name.split(' ').slice(1).join(' ') || 'Lover',
          unsubscribed: false,
          audienceId: audienceId,
        });
        console.log("Contact added to Resend audience:", email);
      } catch (contactError) {
        console.error("Error adding contact to audience:", contactError);
        // Don't fail the email send if contact creation fails
      }
    }

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "DistinctGyrro Newsletter <newsletter@distinctgyrro.com>",
      to: [email],
      subject: "Welcome to DistinctGyrro Newsletter! 🍽️",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to DistinctGyrro Newsletter</title>
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
              padding: 40px 30px; 
              text-align: center; 
            }
            .content { 
              padding: 40px 30px; 
            }
            .welcome-section {
              text-align: center;
              margin-bottom: 30px;
            }
            .benefits {
              background: #f8f9fa;
              padding: 25px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .benefit-item {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              padding: 10px;
              background: white;
              border-radius: 6px;
            }
            .benefit-icon {
              background: #22c55e;
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              font-size: 16px;
            }
            .cta-button {
              display: inline-block;
              background: #22c55e;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer { 
              background: #f9fafb; 
              padding: 25px; 
              text-align: center; 
              font-size: 14px; 
              color: #6b7280; 
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: #22c55e;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to DistinctGyrro!</h1>
              <p>Thank you for joining our food-loving community, ${name}!</p>
            </div>
            
            <div class="content">
              <div class="welcome-section">
                <h2>Get Ready for a Delicious Journey! 🍽️</h2>
                <p>We're thrilled to have you on board! You've just subscribed to the best culinary updates in town.</p>
              </div>
              
              <div class="benefits">
                <h3 style="text-align: center; margin-bottom: 20px;">What You'll Get:</h3>
                
                <div class="benefit-item">
                  <div class="benefit-icon">🍕</div>
                  <div>
                    <strong>New Menu Items</strong><br>
                    Be the first to know about our latest culinary creations
                  </div>
                </div>
                
                <div class="benefit-item">
                  <div class="benefit-icon">💰</div>
                  <div>
                    <strong>Exclusive Offers</strong><br>
                    Special discounts and deals just for newsletter subscribers
                  </div>
                </div>
                
                <div class="benefit-item">
                  <div class="benefit-icon">📅</div>
                  <div>
                    <strong>Event Updates</strong><br>
                    Invitations to special events and cooking classes
                  </div>
                </div>
                
                <div class="benefit-item">
                  <div class="benefit-icon">👨‍🍳</div>
                  <div>
                    <strong>Chef's Secrets</strong><br>
                    Tips, recipes, and behind-the-scenes content
                  </div>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('SITE_URL') || 'https://distinctgyrro.com'}/menu" class="cta-button">
                  🍽️ Explore Our Menu
                </a>
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin-top: 0;">🎁 Welcome Gift!</h4>
                <p>As a welcome gift, use code <strong>WELCOME10</strong> for 10% off your next order!</p>
                <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                  *Valid for first-time online orders. Expires in 30 days.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#">📘 Facebook</a>
                <a href="#">📷 Instagram</a>
                <a href="#">🐦 Twitter</a>
              </div>
              
              <p><strong>DistinctGyrro Restaurant</strong></p>
              <p>Crafting extraordinary dining experiences since day one</p>
              <p>
                <a href="#" style="color: #22c55e;">Update Preferences</a> | 
                <a href="#" style="color: #666;">Unsubscribe</a>
              </p>
              
              <p style="margin-top: 20px; font-size: 12px;">
                You received this email because you subscribed to our newsletter at DistinctGyrro.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Newsletter welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-newsletter-welcome function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to send newsletter welcome email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
