'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState({
    scanComplete: true,
    weeklyReport: false,
    securityAlerts: true,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTogglePreference = async (key: keyof typeof preferences) => {
    setLoading(true);
    setMessage('');

    try {
      // In a real app, you would call your API to update the user's preferences
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessage('Preferences updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to update preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const preferenceItems = [
    {
      key: 'scanComplete' as const,
      icon: '🔔',
      title: 'Scan Completion Notifications',
      description: 'Get notified when your accessibility scans are complete.'
    },
    {
      key: 'weeklyReport' as const,
      icon: '📊',
      title: 'Weekly Report Summary',
      description: 'Receive a weekly summary of your accessibility improvements.'
    },
    {
      key: 'securityAlerts' as const,
      icon: '🔒',
      title: 'Security Alerts',
      description: 'Get notified about important security updates.'
    },
    {
      key: 'marketingEmails' as const,
      icon: '📧',
      title: 'Marketing Updates',
      description: 'Receive updates about new features and promotions.'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {preferenceItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => handleTogglePreference(item.key)}
                className={`${
                  preferences[item.key] 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-transparent' 
                    : ''
                } transition-all duration-300`}
              >
                {preferences[item.key] ? '✅ Enabled' : '❌ Disabled'}
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`p-3 rounded-lg ${message.includes('successfully') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}
          >
            {message.includes('successfully') ? '✅ ' : '❌ '}{message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}