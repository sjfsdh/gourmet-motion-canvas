
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Image, MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    restaurantName: 'DistinctGyrro',
    tagline: 'Authentic Mediterranean Cuisine',
    logo: 'https://example.com/logo.png',
    favicon: 'https://example.com/favicon.ico'
  });

  const [contactSettings, setContactSettings] = useState({
    address: '123 Culinary Blvd, Foodtown, CA 94123',
    phone: '(555) 123-4567',
    email: 'info@distinctgyrro.com',
    openingHours: 'Mon-Fri: 11am-10pm, Sat-Sun: 12pm-11pm',
    googleMapsUrl: 'https://goo.gl/maps/1234abcd'
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: 'https://facebook.com/distinctgyrro',
    instagram: 'https://instagram.com/distinctgyrro',
    twitter: 'https://twitter.com/distinctgyrro',
    yelp: 'https://yelp.com/biz/distinctgyrro'
  });
  
  const { toast } = useToast();

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully",
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Contact information has been updated successfully",
    });
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Social media links have been updated successfully",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Restaurant Settings</h1>
        <p className="text-gray-500">Manage your restaurant information and settings</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleGeneralSubmit}>
            <h2 className="text-lg font-medium mb-6 pb-2 border-b border-gray-200">General Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  value={generalSettings.restaurantName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, restaurantName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  id="tagline"
                  value={generalSettings.tagline}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <div className="flex">
                  <div className="flex-grow">
                    <input
                      type="text"
                      id="logo"
                      value={generalSettings.logo}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                    />
                  </div>
                  <div className="bg-gray-200 px-3 rounded-r-md flex items-center">
                    <Image size={20} className="text-gray-500" />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="favicon" className="block text-sm font-medium text-gray-700 mb-1">
                  Favicon URL
                </label>
                <div className="flex">
                  <div className="flex-grow">
                    <input
                      type="text"
                      id="favicon"
                      value={generalSettings.favicon}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, favicon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                    />
                  </div>
                  <div className="bg-gray-200 px-3 rounded-r-md flex items-center">
                    <Image size={20} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-restaurant-green text-white px-4 py-2 rounded-md flex items-center"
              >
                <Save size={18} className="mr-2" /> Save Changes
              </motion.button>
            </div>
          </form>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleContactSubmit}>
            <h2 className="text-lg font-medium mb-6 pb-2 border-b border-gray-200">Contact Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="flex">
                  <div className="flex-grow">
                    <input
                      type="text"
                      id="address"
                      value={contactSettings.address}
                      onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                    />
                  </div>
                  <div className="bg-gray-200 px-3 rounded-r-md flex items-center">
                    <MapPin size={20} className="text-gray-500" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="flex-grow">
                      <input
                        type="tel"
                        id="phone"
                        value={contactSettings.phone}
                        onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                      />
                    </div>
                    <div className="bg-gray-200 px-3 rounded-r-md flex items-center">
                      <Phone size={20} className="text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex">
                    <div className="flex-grow">
                      <input
                        type="email"
                        id="email"
                        value={contactSettings.email}
                        onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                      />
                    </div>
                    <div className="bg-gray-200 px-3 rounded-r-md flex items-center">
                      <Mail size={20} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
                    Opening Hours
                  </label>
                  <div className="flex">
                    <div className="flex-grow">
                      <input
                        type="text"
                        id="openingHours"
                        value={contactSettings.openingHours}
                        onChange={(e) => setContactSettings({ ...contactSettings, openingHours: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                      />
                    </div>
                    <div className="bg-gray-200 px-3 rounded-r-md flex items-center">
                      <Clock size={20} className="text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps URL
                  </label>
                  <div className="flex">
                    <div className="flex-grow">
                      <input
                        type="text"
                        id="googleMapsUrl"
                        value={contactSettings.googleMapsUrl}
                        onChange={(e) => setContactSettings({ ...contactSettings, googleMapsUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                      />
                    </div>
                    <div className="bg-gray-200 px-3 rounded-r-md flex items-center">
                      <Globe size={20} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-restaurant-green text-white px-4 py-2 rounded-md flex items-center"
              >
                <Save size={18} className="mr-2" /> Save Changes
              </motion.button>
            </div>
          </form>
        </div>

        {/* Social Media Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSocialSubmit}>
            <h2 className="text-lg font-medium mb-6 pb-2 border-b border-gray-200">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  value={socialSettings.facebook}
                  onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  value={socialSettings.instagram}
                  onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  value={socialSettings.twitter}
                  onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="yelp" className="block text-sm font-medium text-gray-700 mb-1">
                  Yelp
                </label>
                <input
                  type="url"
                  id="yelp"
                  value={socialSettings.yelp}
                  onChange={(e) => setSocialSettings({ ...socialSettings, yelp: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green focus:border-restaurant-green"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="bg-restaurant-green text-white px-4 py-2 rounded-md flex items-center"
              >
                <Save size={18} className="mr-2" /> Save Changes
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
