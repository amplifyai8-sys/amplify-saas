"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
  delay: number;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      quote:
        "This tool showed us gaps we didn't even know existed. Within 2 weeks we fixed our AI visibility issues.",
      name: "Sarah Chen",
      title: "Head of Growth",
      company: "TechCo",
      avatar: "SC",
      rating: 5,
      delay: 0.1,
    },
    {
      quote:
        "Finally, a brand audit that doesn't take 3 weeks and cost $10K. Got actionable insights in minutes.",
      name: "Marcus Williams",
      title: "Founder",
      company: "StartupXYZ",
      avatar: "MW",
      rating: 5,
      delay: 0.2,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <Star
              size={20}
              className={`$${
                i < rating
                  ? "fill-[#facc15] text-[#facc15]"
                  : "fill-transparent text-white/20"
              }`}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section className="relative px-4 py-20" id="testimonials">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center text-4xl font-bold text-white md:text-5xl"
        >
          What People Are Saying
        </motion.h2>

        {/* Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: testimonial.delay, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-[#3b82f6]/10"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/0 to-[#8b5cf6]/0 opacity-0 transition-opacity group-hover:from-[#3b82f6]/5 group-hover:to-[#8b5cf6]/5 group-hover:opacity-100" />

              {/* Quote Icon */}
              <motion.div
                className="absolute right-8 top-8 opacity-10"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Quote size={48} className="text-white" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                {/* Star Rating */}
                <div className="mb-4">{renderStars(testimonial.rating)}</div>

                {/* Quote */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: testimonial.delay + 0.2 }}
                  className="mb-6 text-lg leading-relaxed text-white/80"
                >
                  "{testimonial.quote}"
                </motion.p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-lg font-bold text-white shadow-lg"
                  >
                    {testimonial.avatar}
                  </motion.div>

                  {/* Name and Title */}
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/60">
                      {testimonial.title} @ {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
        >
          <div className="text-center">
            <p className="mb-1 text-3xl font-bold text-[#3b82f6]">500+</p>
            <p className="text-sm text-white/60">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-3xl font-bold text-[#8b5cf6]">4.9/5</p>
            <p className="text-sm text-white/60">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-3xl font-bold text-[#4ade80]">10sec</p>
            <p className="text-sm text-white/60">Analysis Time</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
