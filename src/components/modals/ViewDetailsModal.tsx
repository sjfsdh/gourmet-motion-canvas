
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { Order } from '@/services/orderService';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
  type: 'order' | 'menu' | 'product';
  data?: any;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  type,
  data
}) => {
  if (!isOpen) return null;

  const renderOrderDetails = () => {
    if (!order) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-2">Order #{order.id.slice(-8)}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {new Date(order.created_at).toLocaleDateString()} at{' '}
                {new Date(order.created_at).toLocaleTimeString()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-restaurant-green">${order.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold mb-4">Customer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Name</p>
              <p className="text-gray-600">{order.user_name}</p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-600 flex items-center">
                <Mail size={14} className="mr-1" />
                {order.user_email}
              </p>
            </div>
            {order.phone && (
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600 flex items-center">
                  <Phone size={14} className="mr-1" />
                  {order.phone}
                </p>
              </div>
            )}
            {order.delivery_address && (
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {order.delivery_address}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold mb-4">Order Items</h4>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <h5 className="font-medium">{item.name}</h5>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.notes && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold mb-2">Special Instructions</h4>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
          </div>
        )}
      </div>
    );
  };

  const renderProductDetails = () => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        <div className="aspect-video rounded-lg overflow-hidden">
          <img 
            src={data.image} 
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-2">{data.name}</h3>
          <p className="text-3xl font-bold text-restaurant-green mb-4">
            ${data.price?.toFixed(2)}
          </p>
          <p className="text-gray-600 leading-relaxed">{data.description}</p>
        </div>

        {data.category && (
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {data.category}
            </span>
          </div>
        )}

        {data.ingredients && (
          <div>
            <h4 className="font-semibold mb-2">Ingredients</h4>
            <p className="text-gray-600">{data.ingredients}</p>
          </div>
        )}

        {data.allergens && (
          <div>
            <h4 className="font-semibold mb-2">Allergen Information</h4>
            <p className="text-sm text-red-600">{data.allergens}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">
              {type === 'order' && 'Order Details'}
              {type === 'product' && 'Product Details'}
              {type === 'menu' && 'Menu Item Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {type === 'order' && renderOrderDetails()}
            {(type === 'product' || type === 'menu') && renderProductDetails()}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
            <CustomButton variant="outline" onClick={onClose}>
              Close
            </CustomButton>
            {type === 'order' && order && (
              <CustomButton onClick={() => {
                // Handle print or additional actions
                window.print();
              }}>
                Print Order
              </CustomButton>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewDetailsModal;
