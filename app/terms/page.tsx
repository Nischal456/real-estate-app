'use client';

import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { motion } from 'framer-motion';

const TermSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <motion.div className="mb-10" initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-[#3fa8e4] pl-4">{title}</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed prose max-w-none">
            {children}
        </div>
    </motion.div>
);

export default function TermsPage() {
  return (
    <div className="bg-gray-50">
      <Header />
      <main className="container mx-auto px-6 py-24 max-w-4xl">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 className="text-5xl font-extrabold text-center mb-4">Terms and Conditions</h1>
            <p className="text-sm text-gray-500 text-center mb-16">Last updated: July 14, 2025</p>
        </motion.div>
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg border">
            <TermSection title="1. Introduction">
                <p>Welcome to E-Bazar Securities. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms. If you do not agree with any part of the terms, you may not use our services.</p>
            </TermSection>
            <TermSection title="2. User Accounts">
                <p>To list a property or access certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
            </TermSection>
            <TermSection title="3. Property Listings">
                <p>As a user, you may list properties for sale or rent. You are solely responsible for the accuracy, content, and legality of your listings. E-Bazar Securities reserves the right, but not the obligation, to remove any listing that violates our policies or is deemed inappropriate.</p>
                <p>You grant E-Bazar Securities a non-exclusive, worldwide, royalty-free license to use, reproduce, and display the content of your listings (including images and text) for the purpose of promoting the property and our platform.</p>
            </TermSection>
            <TermSection title="4. Prohibited Activities">
                <p>You agree not to engage in any of the following prohibited activities: (a) copying, distributing, or disclosing any part of the service in any medium; (b) using any automated system, including &quot;robots&quot; or &quot;spiders,&quot; to access the service; (c) transmitting spam or other unsolicited email; (d) attempting to interfere with the server&apos;s integrity or security.</p>
            </TermSection>
            <TermSection title="5. Limitation of Liability">
                <p>To the maximum extent permitted by applicable law, in no event shall E-Bazar Securities be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
            </TermSection>
            <TermSection title="6. Governing Law">
                <p>These Terms shall be governed and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
            </TermSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
