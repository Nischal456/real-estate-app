'use client';

import { useState } from 'react';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Award, X, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  { id: 1, name: 'Nischal Shrestha', role: 'Co-Founder', image: '/team/nischal.jpg', bio: 'With a decade of experience in real estate and a passion for technology, Nischal founded E-Bazar Securities to bring transparency and efficiency to the Nepali property market.' },
  { id: 2, name: 'Prashant Ghalan', role: 'Co-Founder', image: '/team/prashant.jpg', bio: 'Prashant is a master negotiator and has an unparalleled understanding of the Kathmandu valley market. He is dedicated to finding the perfect home for every client.' },
  { id: 3, name: 'Ujjwal Maharjan', role: 'Co-Founder', image: '/team/ujjwal.jpg', bio: 'Ujjwal’s innovative marketing strategies ensure that our properties reach the widest possible audience, connecting sellers with the right buyers quickly and effectively.' },
  { id: 4, name: 'Anjal Shrestha', role: 'Co-Founder', image: '/team/anjal.jpg', bio: 'Anjal is the heart of our client support. His commitment to exceptional service ensures a smooth and positive experience for everyone we work with.' },
];

const values = [
    { icon: <Award size={32} className="text-white" />, title: 'Excellence', description: 'We uphold the highest standards, ensuring quality in every property and interaction.' },
    { icon: <Users size={32} className="text-white" />, title: 'Integrity', description: 'Our business is built on a foundation of trust, honesty, and transparent communication.' },
    { icon: <Target size={32} className="text-white" />, title: 'Innovation', description: 'We leverage technology to create a seamless and modern real estate experience for all.' },
];

export default function AboutUsPage() {
  const [selectedMember, setSelectedMember] = useState<(typeof teamMembers)[0] | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.section className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none" style={{ objectFit: 'cover', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <source src="https://videos.pexels.com/video-files/3254009/3254009-hd.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 p-4">
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-shadow-lg">
              Our Story, Your Trust
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200 text-shadow">
              Building the future of real estate in Nepal, one property at a time.
            </motion.p>
          </div>
        </motion.section>

        <section className="py-24">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <h2 className="text-4xl font-bold text-[#3fa8e4] mb-4">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                To empower every Nepali with a transparent, efficient, and trustworthy platform to buy, sell, and rent properties. We are committed to simplifying the real estate journey through innovative technology and unparalleled customer service, ensuring every transaction is a step towards your dream.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-gray-900" style={{ backgroundImage: "url('/subtle-grid.svg')" }}>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16 text-white">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {values.map((value, index) => (
                <motion.div 
                  key={index}
                  className="p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white transform-gpu"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                  whileHover={{ scale: 1.05, boxShadow: '0px 20px 40px rgba(63, 168, 228, 0.2)' }}
                >
                  <div className="inline-block mb-5">{value.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={member.id} 
                  className="group text-center cursor-pointer"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                  onClick={() => setSelectedMember(member)}
                  layoutId={`card-container-${member.id}`}
                >
                  <motion.div 
                    className="relative h-48 w-48 mx-auto rounded-full overflow-hidden shadow-lg mb-4 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-[#3fa8e4]/50"
                    layoutId={`card-image-container-${member.id}`}
                  >
                    <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mt-6">{member.name}</h3>
                  <p className="text-[#3fa8e4] font-medium">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <AnimatePresence>
          {selectedMember && (
            <motion.div
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
                layoutId={`card-container-${selectedMember.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div 
                    className="relative h-64 w-full"
                    layoutId={`card-image-container-${selectedMember.id}`}
                >
                    <Image src={selectedMember.image} alt={selectedMember.name} layout="fill" objectFit="cover" />
                </motion.div>
                <div className="p-6">
                    <h2 className="text-3xl font-bold">{selectedMember.name}</h2>
                    <p className="text-lg text-[#3fa8e4] font-semibold mb-4">{selectedMember.role}</p>
                    <p className="text-gray-600 mb-6">{selectedMember.bio}</p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-500 hover:text-[#3fa8e4]"><Twitter /></a>
                        <a href="#" className="text-gray-500 hover:text-[#3fa8e4]"><Linkedin /></a>
                    </div>
                </div>
                <motion.button 
                  onClick={() => setSelectedMember(null)} 
                  className="absolute top-4 right-4 bg-white/50 p-2 rounded-full hover:bg-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  );
}
