
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom max-w-md">
        <AnimatedSection animation="fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {isLogin ? 'Welcome Back' : 'Join DistinctGyrro'}
            </h1>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm switchToSignup={() => setIsLogin(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignupForm switchToLogin={() => setIsLogin(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Auth;
