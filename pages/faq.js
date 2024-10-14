"use client";
import '../app/globals.css'
import FAQs from '@/components/faqs';
import Footer from '../components/footer.js';
import Header from '@/components/header.js';
import CTA from '@/components/cta';


export default function FAQ() {
  return (
    <div>

        <Header />
      {/* Hero Section */}
      
      <FAQs/>

      <CTA/>
      

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
