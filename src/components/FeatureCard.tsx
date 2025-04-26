
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
  imageUrl?: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  delay = 0,
  className,
  imageUrl,
  badge
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className={cn(
        "bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {imageUrl && (
        <div className="relative overflow-hidden rounded-t-xl h-48">
          <motion.img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover" 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {badge && (
            <div className="absolute top-3 right-3 bg-restaurant-terracotta text-white px-3 py-1 rounded-full text-xs font-medium">
              {badge}
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {!imageUrl && (
            <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg text-blue-600 flex-shrink-0">
              {icon}
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
