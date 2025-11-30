"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Features", id: "features" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Reviews", id: "reviews" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 z-50 w-[95%] max-w-5xl"
    >
      <div 
        className={`
          flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300
          ${isScrolled 
            ? "bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50" 
            : "bg-[#0B0F19]/50 backdrop-blur-md border border-white/5"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
            Prep<span className="text-accent-400">View</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="px-4 py-1.5 text-sm text-gray-300 hover:text-white font-medium transition-all rounded-full hover:bg-white/10"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-white font-medium transition-colors px-3 py-2"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/20 flex items-center gap-2"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full left-0 right-0 mt-2 bg-[#0B0F19]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-left text-gray-300 hover:text-white font-medium py-3 px-4 rounded-xl hover:bg-white/5 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="h-px bg-white/10 my-2"></div>
            <Link
              href="/login"
              className="text-center text-gray-300 hover:text-white font-medium py-3 rounded-xl hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-black text-center py-3 rounded-xl font-bold hover:bg-gray-200"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
