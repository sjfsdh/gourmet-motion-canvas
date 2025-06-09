
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CustomButton } from './ui/custom-button';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
}

const HeroBanner: React.FC<HeroBannerProps> = ({ 
  title, 
  subtitle, 
  backgroundImage,
  primaryCta,
  secondaryCta
}) => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Hero background - Restaurant interior"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Hero image failed to load, using fallback');
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        
        {/* Abstract Shape */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 blob opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400 blob-2 opacity-20"></div>
      </div>

      <div className="container-custom relative z-10 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
        >
          {title}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex justify-center"
        >
          <div className="h-1 w-24 bg-blue-500 my-4"></div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          {primaryCta && (
            <Link to={primaryCta.link}>
              <CustomButton size="lg" className="shadow-lg flex items-center gap-2">
                {primaryCta.text} <ArrowRight size={18} />
              </CustomButton>
            </Link>
          )}
          
          {secondaryCta && (
            <Link to={secondaryCta.link}>
              <CustomButton variant="outline" size="lg" className="flex items-center gap-2 bg-white/10 text-white border-white hover:bg-white hover:text-gray-900">
                {secondaryCta.text} <ArrowRight size={18} />
              </CustomButton>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
