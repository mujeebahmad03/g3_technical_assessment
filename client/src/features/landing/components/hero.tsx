"use client";

import { type Variants, motion } from "framer-motion";
import { ArrowRight, Play, Users, CheckCircle, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-muted px-4 py-2 rounded-full text-sm font-medium text-muted-foreground mb-8"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span>Built with Next.js 15 & Real-time Collaboration</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6"
          >
            Streamline Your Team's
            <span className="text-gradient block mt-2">
              Workflow & Productivity
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Modern, responsive task management platform that brings teams
            together with real-time collaboration, smart task assignment, and
            comprehensive project tracking.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group bg-transparent"
            >
              <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <span>10,000+ teams worldwide</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>99.9% uptime guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Real-time collaboration</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Image/Dashboard Preview */}
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 gradient-primary rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-card border border-border rounded-2xl p-2 shadow-2xl">
              <div className="bg-muted rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    TeamFlow Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Interactive demo coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
