'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

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

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setSuccessMessage("A new verification email has been sent. Please check your inbox.");
      } else {
        setError("Could not find user to send verification email. Please try logging in again to trigger the prompt.");
      }
    } catch (err: any) {
      setError("Failed to resend verification email. Please try again later.");
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // --- VERIFICATION CHECK ---
        if (!userCredential.user.emailVerified) {
          setError("Your email is not verified. Please check your inbox for the verification link.");
          // Optionally, sign the user out so they can't proceed
          await auth.signOut();
          // We don't redirect, so they can see the error and the resend button
          setIsLoading(false);
          return; 
        }
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

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: fullName,
          email: user.email,
          photoURL: user.photoURL,
          phoneNumber: phoneNumber,
          role: 'User'
        });

        await sendEmailVerification(user);
        
        setSuccessMessage("Account created! A verification link has been sent to your email. Please verify before logging in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex justify-center items-center py-20 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800">{isLogin ? 'Login' : 'Sign Up'}</h1>
          
          {successMessage && (
              <div className="flex items-center text-sm text-green-700 bg-green-100 p-3 rounded-md">
                <CheckCircle className="mr-2 h-4 w-4" /> {successMessage}
              </div>
          )}
          {error && (
              <div className="flex flex-col text-sm text-red-600 bg-red-100 p-3 rounded-md">
                <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" /> {error}
                </div>
                {error.includes("not verified") && (
                    <button onClick={handleResendVerification} disabled={isLoading} className="mt-2 text-sm font-semibold text-blue-600 hover:underline self-start">
                        {isLoading ? 'Sending...' : 'Resend verification email'}
                    </button>
                )}
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
              </>
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
            
            <Button type="submit" disabled={isLoading} className="w-full bg-[#3fa8e4] hover:bg-[#3fa8e4]/90">
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (isLogin ? 'Login' : 'Create Account')}
            </Button>
          </form>
          <div className="text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMessage(null); }} className="text-sm text-[#3fa8e4] hover:underline">
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
