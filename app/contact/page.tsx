'use client';

import { useState, FormEvent } from 'react';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setTimeout(() => {
      setLoading(false);
      setStatus({ type: 'success', message: 'Your message has been sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div className="bg-white">
      <Header />

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
            <motion.h1 
                className="text-5xl md:text-6xl font-extrabold text-gray-800"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                Get In Touch
            </motion.h1>
            <motion.p 
                className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
                We&apos;re here to help. Whether you have a question about a property, our services, or anything else, our team is ready to answer all your questions.
            </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 bg-white p-8 rounded-2xl shadow-2xl border">
          
          <motion.div 
            className="lg:col-span-1 space-y-8"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-start">
              <div className="p-3 bg-blue-100 rounded-full text-[#3fa8e4]"><MapPin /></div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Our Office</h3>
                <p className="text-gray-600">Bhotebahal, Kathmandu, Nepal</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-3 bg-blue-100 rounded-full text-[#3fa8e4]"><Mail /></div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="text-gray-600">ebazarsecurities@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-3 bg-blue-100 rounded-full text-[#3fa8e4]"><Phone /></div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Call Us</h3>
                <p className="text-gray-600">(+977) 9822790665</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="md:col-span-1 lg:col-span-2"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#3fa8e4]" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#3fa8e4]" />
              </div>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#3fa8e4]" />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows={5} required className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#3fa8e4]"></textarea>
              
              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                  {status.message}
                </motion.div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 text-lg py-3">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : <><Send className="mr-2" /> Send Message</>}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      
      <div className="h-[400px] w-full grayscale hover:grayscale-0 transition-all duration-500">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.64289895697!2d85.25539344319409!3d27.70894272444534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0x42509a25a25e1a6!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2sus!4v1678886561234!5m2!1sen!2sus"
          width="100%" height="100%" style={{ border: 0 }}
          allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <Footer />
    </div>
  );
}