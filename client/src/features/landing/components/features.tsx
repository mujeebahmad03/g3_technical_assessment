"use client";

import { type Variants, motion } from "framer-motion";
import { Users, Calendar, BarChart3, Zap, Shield, Globe } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Real-time collaboration with your team members, instant updates, and seamless communication across all projects.",
    },
    {
      icon: Calendar,
      title: "Task Assignment",
      description:
        "Smart task assignment with deadline tracking, priority levels, and automated notifications to keep everyone on track.",
    },
    {
      icon: BarChart3,
      title: "Project Tracking",
      description:
        "Comprehensive project analytics with progress visualization, performance metrics, and detailed reporting.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Instant synchronization across all devices with live updates, ensuring your team stays connected and informed.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with data encryption, regular backups, and 99.9% uptime guarantee for peace of mind.",
    },
    {
      icon: Globe,
      title: "Responsive Design",
      description:
        "Optimized for all devices - desktop, tablet, and mobile. Work seamlessly from anywhere, anytime.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to
            <span className="text-gradient block mt-1">Manage Your Team</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to enhance productivity and streamline
            collaboration across your entire organization.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full gradient-card border-border/50 hover:border-primary/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
