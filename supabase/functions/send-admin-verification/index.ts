
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminInviteRequest {
  email: string;
  inviteLink: string;
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, inviteLink, inviterName = "DistinctGyrro Team" }: AdminInviteRequest = await req.json();

    console.log("Processing admin invite for:", { email });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Admin Account Invitation - DistinctGyrro</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🛡️ Admin Access Invitation</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You've been invited to join the admin panel</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Welcome to DistinctGyrro Admin!</h2>
            <p>You have been invited by <strong>${inviterName}</strong> to become an administrator for DistinctGyrro restaurant management system.</p>
            
            <div style="background: #e8f4fd; border: 1px solid #3498db; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #2980b9; margin: 0 0 15px 0;">🔐 Admin Privileges Include:</h4>
              <ul style="margin: 0; color: #2980b9; padding-left: 20px;">
                <li>Menu management and pricing</li>
                <li>Order tracking and management</li>
                <li>Customer communication</li>
                <li>Restaurant settings and configuration</li>
                <li>Sales analytics and reporting</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);">
                🚀 Activate Admin Account
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ Important Security Notice</h4>
              <p style="margin: 0; color: #856404; font-size: 14px;">
                This invitation link will expire in 24 hours. If you didn't expect this invitation or believe it was sent in error, please ignore this email and contact our support team immediately.
              </p>
            </div>
            
            <p style="margin: 30px 0; font-size: 14px; color: #6c757d;">
              If the button above doesn't work, copy and paste this link into your browser:<br>
              <a href="${inviteLink}" style="color: #3498db; word-break: break-all;">${inviteLink}</a>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                Questions? Contact us at admin@distinctgyrro.com<br>
                <strong>DistinctGyrro Management Team</strong>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "DistinctGyrro Admin <admin@distinctgyrro.com>",
      to: [email],
      subject: "🛡️ Admin Access Invitation - DistinctGyrro",
      html: emailHtml,
    });

    console.log("Admin verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-verification function:", error);
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
