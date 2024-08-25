import { useEffect } from 'react';
import Image from 'next/image';

export default function ContactForm() {
  useEffect(() => {
    // HoneyBook script integration
    (function(h,b,s,n,i,p,e,t) {
      h._HB_ = h._HB_ || {}; h._HB_.pid = i;
      t = b.createElement(s); t.type = "text/javascript"; t.async = !0; t.src = n;
      e = b.getElementsByTagName(s)[0]; e.parentNode.insertBefore(t, e);
    })(window, document, "script", "https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js", "66bd088282b2a300070e3d70");
  }, []);

  return (
    <section id="contactForm" className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Check Availability Now</h2>
          <p className="mt-4 text-lg text-gray-600">Do you want to check if we&apos;re available or visit us?</p>
        </div>
        <div className="mt-10">
          {/* HoneyBook contact form */}
          <div className="hb-p-66bd088282b2a300070e3d70-6"></div>
          <Image 
            src="https://www.honeybook.com/p.png?pid=66bd088282b2a300070e3d70" 
            alt="HoneyBook Tracking Pixel" 
            width={1} 
            height={1} 
            style={{ display: 'none' }} 
          />
        </div>
      </div>
    </section>
  );
}
