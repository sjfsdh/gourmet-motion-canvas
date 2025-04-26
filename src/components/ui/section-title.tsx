
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  animation?: "fadeIn" | "slideUp" | "slideInLeft" | "slideInRight";
  delay?: number;
}

const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } }
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
  }
};

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  center = true,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  animation = "fadeIn",
  delay = 0
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay }}
      variants={animations[animation]}
      className={cn(
        "mb-12",
        center && "text-center",
        className
      )}
    >
      <h2 className={cn(
        "text-3xl md:text-4xl font-bold mb-2",
        titleClassName
      )}>
        {title}
      </h2>
      
      {subtitle && (
        <>
          <div className={cn(
            "h-1 w-24 bg-blue-500 my-4",
            center && "mx-auto"
          )}></div>
          <p className={cn(
            "text-gray-600 mt-3",
            center ? "max-w-2xl mx-auto" : "",
            subtitleClassName
          )}>
            {subtitle}
          </p>
        </>
      )}
    </motion.div>
  );
};

export default SectionTitle;
