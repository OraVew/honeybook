"use client";
import '../app/globals.css'
import Footer from '../components/footer.js';
import Header from '@/components/header.js';
import DynamicOfferForm from '@/components/dynamicofferform';


export default function DynamicOffer() {
  return (
    <div>

        <Header />
      {/* Hero Section */}
      
      <DynamicOfferForm/>
      

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
