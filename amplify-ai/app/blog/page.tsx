"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["All", "Ghost Check", "AI Strategy", "Case Studies"];

  const posts: BlogPost[] = [
    {
      title: "Why 68% of Brands Fail the Ghost Check",
      excerpt:
        "The shocking truth about why most companies are completely invisible to AI search engines like ChatGPT and Claude.",
      image: "/images/blog-1.jpg",
      date: "Jan 20, 2026",
      readTime: "8 min read",
      category: "Ghost Check",
      featured: true,
    },
    {
      title: "Google vs ChatGPT 2026: The Search Wars",
      excerpt:
        "How AI-powered search is fundamentally changing the way people discover brands online.",
      image: "/images/blog-2.jpg",
      date: "Jan 18, 2026",
      readTime: "6 min read",
      category: "AI Strategy",
    },
    {
      title: "Optimizing for Claude: The Ultimate Guide",
      excerpt:
        "Learn how to make your brand visible to Anthropic's Claude AI and dominate conversational search.",
      image: "/images/blog-3.jpg",
      date: "Jan 15, 2026",
      readTime: "12 min read",
      category: "AI Strategy",
    },
    {
      title: "Case Study: How SaaS Co Went from 0 to Hero",
      excerpt:
        "A deep dive into how we helped a B2B SaaS company achieve 400% increase in AI visibility.",
      image: "/images/blog-4.jpg",
      date: "Jan 12, 2026",
      readTime: "10 min read",
      category: "Case Studies",
    },
  ];

  return (
    <main className="relative min-h-screen bg-transparent px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 font-sans text-5xl font-extrabold text-white md:text-6xl">
            The{" "}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              AI Search
            </span>{" "}
            Playbook
          </h1>
          <p className="mb-8 font-sans text-xl text-gray-400">
            Strategies, insights, and case studies on dominating AI-powered search
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto max-w-2xl"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-purple-500 bg-slate-900/60 py-4 pl-12 pr-4 font-sans text-white placeholder-gray-500 shadow-lg shadow-purple-500/20 outline-none backdrop-blur-md transition-all focus:border-purple-400 focus:shadow-purple-500/40"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12 flex flex-wrap justify-center gap-4"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-6 py-2 font-sans text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-lg shadow-purple-500/30"
                  : "border border-white/10 bg-slate-900/50 text-gray-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Featured Post (Full Width) */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="group mb-12 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10"
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-slate-800 md:h-auto">
              <div className="flex h-full items-center justify-center">
                <p className="font-sans text-gray-600">[Featured Image Placeholder]</p>
              </div>
              <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-4 py-1 font-sans text-xs font-bold text-white">
                FEATURED
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-4 flex items-center gap-4 font-sans text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {posts[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {posts[0].readTime}
                </span>
              </div>

              <h2 className="mb-4 font-sans text-3xl font-bold text-white group-hover:text-purple-400 md:text-4xl">
                {posts[0].title}
              </h2>

              <p className="mb-6 font-sans text-gray-400">{posts[0].excerpt}</p>

              <motion.a
                href="#"
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 font-sans text-purple-400 hover:text-purple-300"
              >
                Read More
                <ArrowRight size={16} />
              </motion.a>
            </div>
          </div>
        </motion.article>

        {/* Recent Posts Grid */}
        <div>
          <h2 className="mb-6 font-sans text-2xl font-bold text-white">Recent Posts</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.slice(1).map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <div className="flex h-full items-center justify-center">
                    <p className="font-sans text-sm text-gray-600">[Image Placeholder]</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3 font-sans text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="mb-3 font-sans text-xl font-bold text-white group-hover:text-purple-400">
                    {post.title}
                  </h3>

                  <p className="mb-4 font-sans text-sm text-gray-400">{post.excerpt}</p>

                  <motion.a
                    href="#"
                    whileHover={{ x: 4 }}
                    className="inline-flex items-center gap-2 font-sans text-sm text-purple-400 hover:text-purple-300"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </motion.a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
