
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminVerificationRequest {
  email: string;
  confirmUrl: string;
  siteName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmUrl, siteName = "DistinctGyrro" }: AdminVerificationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: `${siteName} Admin <admin@distinctgyrro.com>`,
      to: [email],
      subject: `Verify your ${siteName} Admin Account`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Admin Account Verification</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: linear-gradient(135deg, #22c55e, #16a34a); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              border-radius: 8px 8px 0 0; 
            }
            .content { 
              background: #fff; 
              padding: 30px; 
              border: 1px solid #e5e7eb; 
            }
            .button { 
              display: inline-block; 
              background: #22c55e; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: bold; 
              margin: 20px 0; 
            }
            .footer { 
              background: #f9fafb; 
              padding: 20px; 
              text-align: center; 
              font-size: 14px; 
              color: #6b7280; 
              border-radius: 0 0 8px 8px; 
            }
            .security-note {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🛡️ Admin Account Verification</h1>
            <p>Welcome to ${siteName} Admin Panel</p>
          </div>
          
          <div class="content">
            <h2>Verify Your Admin Account</h2>
            <p>Hello!</p>
            <p>You've requested to create an admin account for <strong>${siteName}</strong>. To complete your registration and gain access to the admin panel, please verify your email address.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" class="button">✅ Verify Admin Account</a>
            </div>
            
            <div class="security-note">
              <strong>🔒 Security Notice:</strong> This link will grant you administrative access to ${siteName}. Only click this link if you requested admin access.
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${confirmUrl}
            </p>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Click the verification link above</li>
              <li>You'll be redirected to the admin login page</li>
              <li>Use your email and password to access the admin panel</li>
              <li>Manage menu items, orders, and restaurant settings</li>
            </ul>
            
            <p>If you didn't request admin access, please ignore this email or contact support.</p>
          </div>
          
          <div class="footer">
            <p>This email was sent by ${siteName} Admin System</p>
            <p>If you need help, please contact our support team.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-verification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to send admin verification email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
