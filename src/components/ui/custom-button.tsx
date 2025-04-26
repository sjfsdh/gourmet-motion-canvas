
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  icon?: React.ReactNode;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "primary", size = "default", children, icon, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
      >
        <ShadcnButton
          className={cn(
            "font-medium transition-all duration-300 flex items-center gap-2",
            variant === "primary" && "bg-blue-500 hover:bg-blue-600 text-white",
            variant === "secondary" && "bg-restaurant-terracotta hover:bg-restaurant-terracotta/90 text-white",
            variant === "outline" && "border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50",
            variant === "ghost" && "bg-transparent hover:bg-gray-100 text-gray-700",
            size === "sm" && "px-4 py-2 text-sm",
            size === "default" && "px-6 py-3",
            size === "lg" && "px-8 py-4 text-lg",
            "rounded-lg shadow-sm hover:shadow-md",
            className
          )}
          ref={ref}
          {...props}
        >
          {icon && <span>{icon}</span>}
          {children}
        </ShadcnButton>
      </motion.div>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton };
