'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProfileForm from './ProfileForm';
import EmailPreferences from './EmailPreferences';
import SubscriptionManager from './SubscriptionManager';
import { typography } from '../../lib/design-system';

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
      <motion.h1 
        className={`${typography.h1} ${typography.gradient} mb-8`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Account Settings
      </motion.h1>
      
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
          <TabsList className="grid grid-cols-3 gap-4 bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 transition-all duration-300"
            >
              👤 Profile
            </TabsTrigger>
            <TabsTrigger 
              value="preferences"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 transition-all duration-300"
            >
              ✉️ Email
            </TabsTrigger>
            <TabsTrigger 
              value="subscription"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 transition-all duration-300"
            >
              💎 Subscription
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <TabsContent value="profile" className="mt-6">
            {activeTab === 'profile' && (
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
                <ProfileForm />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            {activeTab === 'preferences' && (
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">Email Preferences</h2>
                <EmailPreferences />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            {activeTab === 'subscription' && (
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">Manage Subscription</h2>
                <SubscriptionManager />
              </motion.div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}