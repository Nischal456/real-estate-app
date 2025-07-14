'use client';

import Link from 'next/link';
import { Facebook, Instagram, MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = [
    { href: '#', icon: <Facebook className="w-5 h-5" />, name: 'Facebook' },
    { href: '#', icon: <Instagram className="w-5 h-5" />, name: 'Instagram' },
  ];
  const quickLinks = [
    { href: '/properties', label: 'Properties' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms of Service' },
  ];
  const contactInfo = [
    { icon: <MapPin size={16} />, text: '123 Real Estate Ave, Property City' },
    { icon: <Mail size={16} />, text: 'contact@ebazarsecurities.com' },
    { icon: <Phone size={16} />, text: '(123) 456-7890' },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes animated-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-bg {
          background-size: 200% 200%;
          background-image: linear-gradient(-45deg, #111827, #1f2937, #374151, #111827);
          animation: animated-gradient 15s ease infinite;
        }
      `}</style>
      <footer className="animated-gradient-bg text-white pt-20 pb-10 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-extrabold mb-4 text-white flex items-center">
                <Image src="/logo.png" alt="E-Bazar Securities" width={40} height={40} className="mr-2 filter brightness-0 invert" />
                E-Bazar Securities
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Buy, sell, rent — easy with us,<br />
                <span className="text-[#3fa8e4] font-medium">घर-जग्गा मा छ पूर्ण trust.</span><br />
                From start to end, smooth नै हुन्छ,<br />
                हाम्रो service कहिल्यै नरोकिन्छ। 🙏
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 tracking-wide">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white relative group transition-colors duration-300">
                      <span>{link.label}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3fa8e4] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 tracking-wide">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mt-1 text-[#3fa8e4]">{item.icon}</span>
                    <span className="ml-3">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 tracking-wide">Follow Us</h4>
              <div className="flex space-x-4 mt-2">
                {socialLinks.map((item) => (
                  <a key={item.name} href={item.href} aria-label={item.name} className="group relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-300 hover:scale-110">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#3fa8e4] to-cyan-400 opacity-75 blur transition duration-500 group-hover:opacity-100 group-hover:duration-200"></div>
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gray-900">{item.icon}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            &copy; {year} E-Bazar Securities. All rights reserved. Designed with ❤️.
          </div>
        </div>
      </footer>
    </>
  );
}
