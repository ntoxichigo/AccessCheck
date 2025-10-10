"use client";
import PageLayout from "../../components/PageLayout";
import { motion } from "framer-motion";
import { typography } from "../../lib/design-system";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number]
    }
  })
};

export default function AboutPage() {
  const features = [
    { 
      title: "Speed", 
      description: "We obsess over speed so you can ship accessible UI.",
      icon: "⚡"
    },
    { 
      title: "Accuracy", 
      description: "We obsess over accuracy so you can ship accessible UI.",
      icon: "🎯"
    },
    { 
      title: "Clarity", 
      description: "We obsess over clarity so you can ship accessible UI.",
      icon: "✨"
    }
  ];

  return (
    <PageLayout theme="dark" containerSize="default">
      <div className="text-center mb-16">
        <motion.h1 
          className={`${typography.h2} ${typography.gradient} mb-6`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About AccessCheck
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          We build fast, developer-friendly accessibility tooling so teams can meet WCAG standards without slowing down.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="glass p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
          We believe accessibility should be easy to implement and monitor. That&apos;s why we created AccessCheck - 
          a tool that empowers developers and teams to build inclusive web experiences without the complexity.
        </p>
      </motion.div>
    </PageLayout>
  );
}

