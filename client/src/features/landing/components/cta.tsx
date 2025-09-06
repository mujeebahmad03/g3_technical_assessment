"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authRoutes } from "@/config";

export function CTA() {
  const benefits = [
    "Free 14-day trial",
    "No credit card required",
    "Cancel anytime",
    "Full feature access",
  ];

  const { push } = useRouter();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to Transform Your
            <span className="text-gradient block mt-1">
              Team's Productivity?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams who have already streamlined their workflow
            with TeamFlow. Start your free trial today.
          </p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity group text-lg px-8 py-6"
              onClick={() => push(authRoutes.register)}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent"
            >
              Schedule Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
