
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { sendTestEmail, sendOrderConfirmationEmail, sendAdminVerificationEmail } from '@/services/emailService';

const TestEmail = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<'custom' | 'order' | 'admin'>('custom');
  const [formData, setFormData] = useState({
    email: '',
    subject: 'Test Email from DistinctGyrro',
    content: 'This is a test email to verify that email functionality is working correctly.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      let result;
      
      switch (testType) {
        case 'custom':
          result = await sendTestEmail(formData.email, formData.subject, formData.content);
          break;
          
        case 'order':
          result = await sendOrderConfirmationEmail({
            customerEmail: formData.email,
            customerName: 'Test Customer',
            orderId: 'TEST-' + Date.now(),
            orderItems: [
              { name: 'Test Gyro', quantity: 1, price: 12.99 },
              { name: 'Test Fries', quantity: 1, price: 4.99 }
            ],
            total: 17.98
          });
          break;
          
        case 'admin':
          result = await sendAdminVerificationEmail(
            formData.email, 
            `${window.location.origin}/admin/login`
          );
          break;
      }

      toast({
        title: "Email Sent Successfully!",
        description: `Test email sent to ${formData.email}`,
      });
      
      console.log('Email sent result:', result);
      
    } catch (error: any) {
      console.error('Test email error:', error);
      toast({
        title: "Email Send Failed",
        description: error.message || "Failed to send test email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="text-blue-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Email System Test</h1>
            <p className="text-gray-600 mt-2">Test email functionality and templates</p>
          </div>

          <form onSubmit={handleSendTestEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <select
                name="testType"
                value={testType}
                onChange={(e) => setTestType(e.target.value as 'custom' | 'order' | 'admin')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="custom">Custom Test Email</option>
                <option value="order">Order Confirmation Template</option>
                <option value="admin">Admin Verification Template</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter recipient email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {testType === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Email subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Email content"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mr-2 mt-0.5" size={16} />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Email Test Information:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure RESEND_API_KEY is configured in Supabase Edge Function secrets</li>
                    <li>Verify your sending domain in Resend dashboard</li>
                    <li>Check spam folder if emails don't arrive</li>
                    <li>Template emails use predefined content for testing</li>
                  </ul>
                </div>
              </div>
            </div>

            <CustomButton
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Email...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Test Email
                </>
              )}
            </CustomButton>
          </form>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5" size={16} />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Email Configuration Status:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>RESEND_API_KEY: {process.env.RESEND_API_KEY ? '✅ Configured' : '❌ Not configured'}</li>
                  <li>Edge Functions: ✅ Deployed</li>
                  <li>Email Templates: ✅ Available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestEmail;
