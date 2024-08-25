"use client";
import '../app/globals.css'
import Head from 'next/head';

import Hero from '../components/hero.js';
import Features from '../components/features.js';
import UniqueValue from '../components/uniquevalue.js';
import Offerings from '../components/offerings.js';
import CTA from '../components/cta.js';
import Footer from '../components/footer.js';
import Header from '@/components/header.js';
import RecentEventsCarousel from '@/components/recentevents';
import ContactForm from '@/components/contactform';

export default function Home() {
  return (
    <div>

        <Header />
      {/* Hero Section */}
      <Hero />

      <ContactForm/>

      {/* Features Section */}
      <Features />

      {/* What Makes OraVew Different Section */}
      <UniqueValue />

      {/* Offerings Section */}
      <Offerings />

      <RecentEventsCarousel/>

      {/* Call-to-Action (CTA) Section */}
      <CTA />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
