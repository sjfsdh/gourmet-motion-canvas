
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  email: string;
  subject: string;
  content: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, subject, content }: TestEmailRequest = await req.json();

    console.log("Sending test email to:", email);

    const emailResponse = await resend.emails.send({
      from: "DistinctGyrro <noreply@distinctgyrro.com>",
      to: [email],
      subject: subject || "Test Email from DistinctGyrro",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${subject || "Test Email"}</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">📧 Test Email</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">From DistinctGyrro System</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Test Email Content</h2>
              <div style="background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 20px; margin: 20px 0;">
                ${content || "This is a test email from the DistinctGyrro system. If you received this, email functionality is working correctly!"}
              </div>
              
              <p style="margin: 30px 0; font-size: 14px; color: #6c757d;">
                Email sent at: ${new Date().toLocaleString()}<br>
                System: DistinctGyrro Email Service
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Test email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-test-email function:", error);
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
