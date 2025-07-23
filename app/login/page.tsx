'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Loader2, Mail, Lock, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// A reusable input field component for a cleaner form structure 
const InputField = ({ icon: Icon, type, value, onChange, placeholder, required = true }: {
  icon: React.ElementType;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-10 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3fa8e4] transition-all"
    />
  </div>
);

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address to reset the password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset link sent! Please check your inbox.");
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      } else {
        if (!fullName || !phoneNumber) {
          setError("Full Name and Phone Number are required for signup.");
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: fullName });
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: fullName,
          email: user.email,
          photoURL: user.photoURL,
          phoneNumber: phoneNumber,
          role: 'User'
        });
        await sendEmailVerification(user);
        setSuccessMessage("Account created! You can now log in.");
        setIsLogin(true);
      }
    } catch (err) { // Step 1: Remove ": any"
      // Step 2: Add a type check to safely access 'err.code'
      let friendlyMessage = "An unexpected error occurred. Please try again.";
      if (typeof err === 'object' && err !== null && 'code' in err) {
        const firebaseError = err as { code: string }; // Type assertion after check
        switch (firebaseError.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-credential': // More modern Firebase code
          case 'auth/wrong-password': // Older Firebase code
            friendlyMessage = "Invalid email or password.";
            break;
          case 'auth/email-already-in-use':
            friendlyMessage = "An account with this email already exists.";
            break;
        }
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4" style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"
      }}>
        <div className="container mx-auto max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="hidden md:flex flex-col justify-center p-12 text-white relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/loginmap.png')" }}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="text-5xl font-extrabold leading-tight font-poppins  text-shadow-lg">
                Welcome Back!
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }} className="mt-4 text-lg font-light text-shadow">
                Your next property is just a few clicks away. Access your account to continue your journey.
              </motion.p>
            </motion.div>
          </div>
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.1 } }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                  <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{isLogin ? 'Login' : 'Create Account'}</h1>
                  <p className="text-center text-gray-500 mb-6">{isLogin ? 'Sign in to your account' : 'Join us and find your dream home'}</p>
                </motion.div>
                <AnimatePresence mode="wait">
                  {successMessage && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="flex items-center text-sm text-green-800 bg-green-100 p-3 rounded-lg mb-4"
                    >
                      <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" /> {successMessage}
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col text-sm text-red-800 bg-red-100 p-3 rounded-lg mb-4"
                    >
                      <div className="flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" /> {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.form onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}>
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut', when: 'beforeChildren', staggerChildren: 0.1 }}
                      >
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                          <InputField icon={User} type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
                        </motion.div>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                          <InputField icon={Phone} type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                    <InputField icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="relative">
                    <InputField icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    {isLogin && (
                      <button type="button" onClick={handlePasswordReset} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#3fa8e4]">
                        Forgot?
                      </button>
                    )}
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" disabled={isLoading} className="w-full bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 text-lg py-3 transition-all duration-300 transform">
                      {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (isLogin ? 'Login' : 'Create Account')}
                    </Button>
                  </motion.div>
                </motion.form>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="text-center mt-6">
                  <button onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMessage(null); }} className="text-sm text-[#3fa8e4] hover:underline font-semibold">
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
