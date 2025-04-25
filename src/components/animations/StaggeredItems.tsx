
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface StaggeredItemsProps {
  children: React.ReactNode[];
  containerClassName?: string;
  staggerDelay?: number;
  initialDelay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight';
}

const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  }
};

export const StaggeredItems = ({ 
  children,
  containerClassName = '',
  staggerDelay = 0.1,
  initialDelay = 0,
  animation = 'fadeIn'
}: StaggeredItemsProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const childrenArray = React.Children.toArray(children);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay
      }
    }
  };

  return (
    <motion.div
      className={containerClassName}
      ref={ref}
      variants={container}
      initial="hidden"
      animate={controls}
    >
      {childrenArray.map((child, index) => (
        <motion.div key={index} variants={animations[animation]}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredItems;
