'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProfileForm from './ProfileForm';
import EmailPreferences from './EmailPreferences';
import { SimpleSubscriptionManager } from './SimpleSubscriptionManager';
import { APIKeyManager } from './APIKeyManager';

const tabContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 mb-6">
          <span className="text-xs font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">
            Settings
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Account Settings
          </span>
        </h1>
      </motion.div>
      
      <Tabs 
        defaultValue="profile" 
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <TabsList className="grid grid-cols-4 gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-lg">
            <TabsTrigger
              value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-lg py-3 font-medium text-gray-700"
            >
              👤 Profile
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-lg py-3 font-medium text-gray-700"
            >
              ✉️ Email
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-lg py-3 font-medium text-gray-700"
            >
              🔑 API
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-lg py-3 font-medium text-gray-700"
            >
              💎 Subscription
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <TabsContent key="profile" value="profile" className="mt-6">
            {activeTab === 'profile' && (
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg text-gray-900"
              >
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile Information</h2>
                <ProfileForm />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent key="preferences" value="preferences" className="mt-6">
            {activeTab === 'preferences' && (
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg text-gray-900"
              >
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Email Preferences</h2>
                <EmailPreferences />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent key="api" value="api" className="mt-6">
            {activeTab === 'api' && (
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <APIKeyManager />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent key="subscription" value="subscription" className="mt-6">
            {activeTab === 'subscription' && (
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Subscription</h2>
                <SimpleSubscriptionManager />
              </motion.div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}