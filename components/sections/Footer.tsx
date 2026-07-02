'use client';

import Link from 'next/link';
import { Facebook, Instagram, MapPin, Mail, Phone, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const socialLinks = [
    { href: 'https://facebook.com', icon: <Facebook className="w-5 h-5" />, name: 'Facebook', color: 'group-hover:text-blue-500' },
    { href: 'https://instagram.com', icon: <Instagram className="w-5 h-5" />, name: 'Instagram', color: 'group-hover:text-pink-500' },
    { href: 'https://wa.me/9779822790665', icon: <MessageCircle className="w-5 h-5" />, name: 'WhatsApp', color: 'group-hover:text-green-500' },
  ];

  const quickLinks = [
    { href: '/properties', label: 'Properties' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes animated-glow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .premium-glow-line {
          background-size: 200% 200%;
          background-image: linear-gradient(90deg, #3fa8e4, #06b6d4, #3b82f6, #3fa8e4);
          animation: animated-glow 8s ease infinite;
        }
      `}</style>
      
      <footer className="relative bg-white text-gray-600 pt-20 pb-10 mt-20 border-t border-gray-100 overflow-hidden">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#3fa8e4]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-[#3fa8e4]/3 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Premium Top Multi-color Border Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] premium-glow-line" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Slogan & Logo Section */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center group">
                <div className="relative w-44 h-12 transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src="/logo.png" 
                    alt="E-Bazar Securities Logo" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              </Link>
              <div className="border-l-2 border-[#3fa8e4]/50 pl-4 py-1 text-gray-500 leading-relaxed font-light text-sm italic">
                <p>Buy, sell, rent — easy with us,</p>
                <p className="text-gray-800 font-semibold not-italic">घर-जग्गा मा छ पूर्ण trust. 🏠</p>
                <p>From start to end, smooth नै हुन्छ,</p>
                <p>हाम्रो service कहिल्यै नरोकिन्छ। 🙏</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider relative inline-block">
                Quick Navigation
                <span className="absolute left-0 bottom-[-8px] w-8 h-[2px] bg-[#3fa8e4]" />
              </h4>
              <ul className="space-y-3.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-gray-500 hover:text-[#3fa8e4] flex items-center transition-all duration-300 group text-sm"
                    >
                      <span className="h-[1px] w-0 bg-[#3fa8e4] mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider relative inline-block">
                Contact Details
                <span className="absolute left-0 bottom-[-8px] w-8 h-[2px] bg-[#3fa8e4]" />
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start group">
                  <span className="mt-0.5 p-1.5 rounded-lg bg-[#3fa8e4]/10 text-[#3fa8e4] group-hover:bg-[#3fa8e4] group-hover:text-white transition-all duration-300">
                    <MapPin size={15} />
                  </span>
                  <div className="ml-3">
                    <p className="text-xs text-gray-400 font-medium">Our Office</p>
                    <a 
                      href="https://maps.google.com/?q=Bhotebahal,+Kathmandu,+Nepal" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-700 hover:text-[#3fa8e4] transition-colors duration-200"
                    >
                      Bhotebahal, Kathmandu, Nepal
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start group">
                  <span className="mt-0.5 p-1.5 rounded-lg bg-[#3fa8e4]/10 text-[#3fa8e4] group-hover:bg-[#3fa8e4] group-hover:text-white transition-all duration-300">
                    <Mail size={15} />
                  </span>
                  <div className="ml-3">
                    <p className="text-xs text-gray-400 font-medium">Email Us</p>
                    <a 
                      href="mailto:ebazarsecurities@gmail.com" 
                      className="text-gray-700 hover:text-[#3fa8e4] transition-colors duration-200"
                    >
                      ebazarsecurities@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start group">
                  <span className="mt-0.5 p-1.5 rounded-lg bg-[#3fa8e4]/10 text-[#3fa8e4] group-hover:bg-[#3fa8e4] group-hover:text-white transition-all duration-300">
                    <Phone size={15} />
                  </span>
                  <div className="ml-3">
                    <p className="text-xs text-gray-400 font-medium">Call Us</p>
                    <a 
                      href="tel:+9779822790665" 
                      className="text-gray-700 hover:text-[#3fa8e4] transition-colors duration-200 font-semibold"
                    >
                      (+977) 9822790665
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter & Follow */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider relative inline-block">
                  Newsletter
                  <span className="absolute left-0 bottom-[-8px] w-8 h-[2px] bg-[#3fa8e4]" />
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Get exclusive property alerts and real estate market reports.
                </p>
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3fa8e4] focus:ring-1 focus:ring-[#3fa8e4] transition-all duration-300"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-1.5 p-1.5 bg-[#3fa8e4] hover:bg-[#3596cc] text-white rounded-md transition-colors duration-300"
                    aria-label="Subscribe"
                  >
                    <Send size={14} />
                  </button>
                </form>
                {subscribed && (
                  <p className="text-xs text-green-600 mt-2 font-medium animate-pulse">
                    Thank you! Subscribed successfully.
                  </p>
                )}
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Follow Our Socials
                </h5>
                <div className="flex space-x-3.5">
                  {socialLinks.map((item) => (
                    <a 
                      key={item.name} 
                      href={item.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={item.name} 
                      className="group flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:border-gray-300"
                    >
                      <span className={`transition-colors duration-300 ${item.color}`}>
                        {item.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Copyright Divider */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
            <p>&copy; {year} E-Bazar Securities. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link href="/terms" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
