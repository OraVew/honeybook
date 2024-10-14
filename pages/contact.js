"use client";
import ContactForm from '@/components/contactform';
import '../app/globals.css'
import Footer from '../components/footer.js';
import Header from '@/components/header.js';


export default function Contact() {
  return (
    <div>

        <Header />
      {/* Hero Section */}
      
      <ContactForm/>
      

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
