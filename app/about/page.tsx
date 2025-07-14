'use client';

import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { motion } from 'framer-motion';
import { Users, Target, Award } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  { name: 'Nischal Shrestha', role: 'Co-Founder', image: '/team/nischal.jpg' },
  { name: 'Prashant Ghalan', role: 'Co-Founder', image: '/team/prashant.jpg' },
  { name: 'Ujjwal Maharjan', role: 'Co-Founder', image: '/team/ujjwal.jpg' },
  { name: 'Anjal Shrestha', role: 'Co-Founder', image: '/team/tatu.jpg' },
];

const values = [
    { icon: <Award size={32} className="text-[#3fa8e4]" />, title: 'Excellence', description: 'We strive for the highest quality in every property we list and every service we provide.' },
    { icon: <Users size={32} className="text-[#3fa8e4]" />, title: 'Integrity', description: 'Trust and transparency are the cornerstones of our relationship with clients.' },
    { icon: <Target size={32} className="text-[#3fa8e4]" />, title: 'Innovation', description: 'Leveraging technology to create a seamless and efficient real estate experience.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  // --- THE FIX: Changed the 'ease' value to a valid string ---
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function AboutUsPage() {
  return (
    <div className="bg-white text-gray-800">
      <Header />
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Hero Section */}
        <motion.section 
          className="relative h-[55vh] flex items-center justify-center text-center text-white"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            >
              <Image 
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1992&auto=format&fit=crop" 
                  alt="Modern architecture" 
                  layout="fill" 
                  objectFit="cover"
              />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 p-4">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-shadow-lg"
            >
              About E-Bazar Securities
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200 text-shadow"
            >
              Redefining real estate in Nepal through trust, technology, and transparency.
            </motion.p>
          </div>
        </motion.section>

        {/* Our Story Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h2 className="text-4xl font-bold text-[#3fa8e4] mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2024, E-Bazar Securities was born from a simple yet powerful idea: to make real estate accessible and trustworthy for everyone in Nepal. We saw the challenges buyers and sellers faced—a lack of clear information, inefficient processes, and a need for reliable guidance.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We set out to build a platform that changes this narrative. By combining cutting-edge technology with a deep-rooted commitment to client satisfaction, we are creating a modern, transparent, and efficient marketplace for properties. Our journey is just beginning, and we are excited to help you find your perfect place.
              </p>
            </motion.div>
            <motion.div
              className="relative h-96 rounded-lg overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Image src="https://images.unsplash.com/photo-1549492423-400259a5e5a4?q=80&w=2070&auto=format&fit=crop" alt="Team working" layout="fill" objectFit="cover" />
            </motion.div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {values.map((value, index) => (
                <motion.div 
                  key={index}
                  className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:-translate-y-2"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                >
                  <div className="inline-block p-4 bg-blue-100 rounded-full mb-5">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        {/* Meet the Team Section */}
<section className="py-28 bg-gradient-to-b from-gray-50 to-white">
  <div className="container mx-auto px-6 text-center">
    <motion.h2 
      className="text-5xl font-bold mb-4 tracking-tight text-gray-800"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      Meet Our Team
    </motion.h2>
    <motion.p 
      className="text-lg text-gray-500 mb-16 max-w-2xl mx-auto"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      A passionate group of professionals committed to transforming real estate in Nepal.
    </motion.p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {teamMembers.map((member, index) => (
        <motion.div 
          key={index} 
          className="group relative bg-white border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transform transition duration-500 hover:-translate-y-2"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
        >
          <div className="relative w-28 h-28 mx-auto -mt-20 rounded-full overflow-hidden ring-4 ring-white shadow-md transition-all duration-300 group-hover:scale-110">
            <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p className="text-[#3fa8e4] mt-1 font-medium">{member.role}</p>
            <div className="mt-4 text-sm text-gray-500 px-2">
              {/* Add custom quote or brief line if needed */}
              <p>"Driven by passion. Defined by results."</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-[#3fa8e4] text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
            Teams
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      </motion.div>
      <Footer />
    </div>
  );
}