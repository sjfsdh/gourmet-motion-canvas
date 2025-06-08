
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // For now, just simulate a successful subscription
      // TODO: Implement actual newsletter subscription logic with database
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubscribed(true);
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter!",
      });

    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "Could not subscribe to newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Welcome to our Newsletter!
        </h3>
        <p className="text-green-700">
          You'll receive updates about our latest dishes, special offers, and restaurant news.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="text-center mb-6">
        <Mail className="mx-auto mb-4 text-restaurant-green" size={48} />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Stay Updated!
        </h3>
        <p className="text-gray-600">
          Subscribe to our newsletter for exclusive offers, new menu items, and restaurant updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all"
            disabled={isLoading}
            required
          />
          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <CustomButton
          type="submit"
          disabled={isLoading || !email}
          className="w-full justify-center"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </CustomButton>

        <p className="text-xs text-gray-500 text-center">
          By subscribing, you agree to receive marketing emails from DistinctGyrro. 
          You can unsubscribe at any time.
        </p>
      </form>
    </motion.div>
  );
};

export default NewsletterSignup;
