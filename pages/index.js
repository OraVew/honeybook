"use client";
import '../app/globals.css'
import Head from 'next/head';

import ReviewList from '../components/reviewlist.js';
import Hero from '../components/hero.js';
import Features from '../components/features.js';
import UniqueValue from '../components/uniquevalue.js';
import Offerings from '../components/offerings.js';
import CTA from '../components/cta.js';
import Footer from '../components/footer.js';
import Header from '@/components/header.js';
import ContactForm from '@/components/contactform';
import Gallery from '@/components/gallery.js';

export default function Home() {
  return (
    <div>

        <Header />
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* What Makes OraVew Different Section */}
      <UniqueValue />

      {/* Lead Entry Point */}
      <ContactForm />

      {/* Reviews */}
      <ReviewList/>

      {/* Offerings Section */}
      <Offerings />

      {/* Photos Section */}
      <Gallery/>

      {/* Call-to-Action (CTA) Section */}
      <CTA />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
