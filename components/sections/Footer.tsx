'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: 'https://www.facebook.com/profile.php?id=100084136977173', icon: <Facebook size={20} />, name: 'Facebook' },
    { href: 'https://www.instagram.com/ebazarsecurities?igsh=MTRmemhnNGQ5ZmE0eQ==', icon: <Instagram size={20} />, name: 'Instagram' },
  ];

  const quickLinks = [
    { href: '/properties', label: 'Properties' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  const contactInfo = [
    { icon: <MapPin size={16} />, text: 'Bhotebahal, Kathmandu - 44600' },
    { icon: <Mail size={16} />, text: 'ebazarsecurities@gmail.com' },
    { icon: <Phone size={16} />, text: '+977 9822790665' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <>
      <style jsx global>{`
        @keyframes animated-mesh-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-mesh-bg {
          background-size: 200% 200%;
          background-image: linear-gradient(
            -45deg, 
            #0a192f, 
            #172a46, 
            #3fa8e4, 
            #172a46,
            #0a192f
          );
          animation: animated-mesh-gradient 20s ease infinite;
        }
      `}</style>

      <motion.footer 
        className="animated-mesh-bg text-white pt-24 pb-10 mt-20 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <div className="mb-4">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.png" alt="E-Bazar Securities" width={180} height={100} />
                </Link>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                Buy, sell, rent — easy with us,<br />
                <span className="text-[#3fa8e4] font-medium">घर-जग्गा मा छ पूर्ण trust.</span><br />
                From start to end, smooth नै हुन्छ,<br />
                हाम्रो service कहिल्यै नरोकिन्छ। 🙏
              </p>
            </motion.div>

            {/* Links Section */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold mb-5 tracking-wider text-white-200">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white-400 hover:text-[#3fa8e4] hover:pl-2 transition-all duration-300 flex items-center">
                      <span className="w-2 h-0.5 bg-[#3fa8e4] mr-2"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Section */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold mb-5 tracking-wider text-white-200">Contact Us</h4>
              <ul className="space-y-4 text-white-400">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mt-1 text-white flex-shrink-0">{item.icon}</span>
                    <span className="ml-3 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social Icons Section */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold mb-5 tracking-wider text-gray-200">Follow Us</h4>
              <div className="flex space-x-3 mt-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className="group flex items-center justify-center h-11 w-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-[#3fa8e4] hover:scale-110 hover:shadow-lg hover:shadow-[#3fa8e4]/30"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Line */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/10 text-center text-white-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            &copy; {year} E-Bazar Securities. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}
