import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, Loader2, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Lock, UserPlus, Key } from 'lucide-react';
import HoneyBee from './HoneyBee';
import { 
  auth, 
  signInWithGoogle, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLoginStart?: () => void;
}

type LoginType = 'select' | 'phone' | 'password_signin' | 'signup';

export default function Login({ onLoginStart }: LoginProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<LoginType>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Phone State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  // Email State
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Password State
  const [password, setPassword] = useState('');

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    try {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
      
      if (recaptchaContainerRef.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        });
      }
    } catch (err: any) {
      console.error('reCAPTCHA Setup Error:', err);
    }
  };

  useEffect(() => {
    if (view === 'phone') {
      setupRecaptcha();
    }
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    };
  }, [view]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    try {
      setLoading(true);
      setError(null);
      
      if (!recaptchaVerifier.current) {
        setupRecaptcha();
      }
      
      if (!recaptchaVerifier.current) {
        throw new Error('reCAPTCHA not initialized');
      }

      // Ensure phone number starts with + and is in international format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`; 
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
      setConfirmationResult(result);
      setShowOtpInput(true);
    } catch (err: any) {
      console.error('Phone Login Error:', err);
      let message = err.message || 'Failed to send SMS';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'Phone authentication is not enabled in Firebase Console. Please enable it in the Authentication tab.';
      }
      setError(message);
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || !confirmationResult) return;

    try {
      setLoading(true);
      setError(null);
      await confirmationResult.confirm(verificationCode);
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      setLoading(true);
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const renderError = () => (
    <AnimatePresence>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 p-3 mb-4 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 scale-150 blur-3xl bg-brand-primary/20 rounded-full" />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 bg-brand-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-primary/40 text-white"
        >
          <HoneyBee size={48} className="fill-current" />
        </motion.div>
      </div>
      
      <h2 className="text-brand-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">Welcome</h2>
      <h1 className="text-4xl font-serif font-bold mb-2">Jenu-Gumpu</h1>
      <p className="text-brand-secondary/60 mb-8 max-w-xs text-sm">
        Empowering honey hunters with market insights and collective intelligence.
      </p>

      <div className="w-full max-w-xs transition-all duration-300">
        {view === 'select' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-zinc-100 text-zinc-700 font-bold py-4 rounded-2xl shadow-sm hover:border-brand-primary/20 transition-all flex items-center justify-center gap-3"
            >
              {t('auth.continue_google')}
            </button>

            <button
              onClick={() => setView('password_signin')}
              disabled={loading}
              className="w-full bg-zinc-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-zinc-700 transition-all flex items-center justify-center gap-3"
            >
              <Lock className="w-5 h-5" />
              {t('auth.sign_in_password')}
            </button>

            <button
              onClick={() => setView('phone')}
              disabled={loading}
              className="w-full bg-brand-primary/10 text-brand-primary font-bold py-4 rounded-2xl border-2 border-brand-primary/10 hover:bg-brand-primary/20 transition-all flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              {t('auth.phone_otp')}
            </button>
          </motion.div>
        )}

        {view === 'password_signin' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left"
          >
            <button 
              onClick={() => { setView('select'); setError(null); }}
              className="mb-6 flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            <h2 className="text-xl font-bold mb-4 font-serif">{t('auth.sign_in_title')}</h2>
            
            {renderError()}

            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1 ml-1">{t('auth.email_label')}</label>
                <input 
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 focus:border-brand-primary/30 focus:outline-none transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1 ml-1">{t('auth.password_label')}</label>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 focus:border-brand-primary/30 focus:outline-none transition-all font-bold"
                    required
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.login_button')}
              </button>
            </form>

            <button 
              onClick={() => { setView('signup'); setError(null); }}
              className="w-full text-[10px] font-bold text-zinc-400 mt-6 uppercase tracking-widest hover:text-brand-primary transition-colors text-center"
            >
              {t('auth.no_account')} <span className="text-brand-primary">{t('auth.sign_up_title')}</span>
            </button>
          </motion.div>
        )}

        {view === 'signup' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left"
          >
            <button 
              onClick={() => { setView('password_signin'); setError(null); }}
              className="mb-6 flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')}
            </button>

            <h2 className="text-xl font-bold mb-4 font-serif">{t('auth.sign_up_title')}</h2>
            
            {renderError()}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1 ml-1">{t('auth.email_label')}</label>
                <input 
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 focus:border-brand-primary/30 focus:outline-none transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1 ml-1">{t('auth.password_label')}</label>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 focus:border-brand-primary/30 focus:outline-none transition-all font-bold"
                    required
                  />
                  <UserPlus className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.signup_button')}
              </button>
            </form>

            <button 
              onClick={() => { setView('password_signin'); setError(null); }}
              className="w-full text-[10px] font-bold text-zinc-400 mt-6 uppercase tracking-widest hover:text-brand-primary transition-colors text-center"
            >
              {t('auth.have_account')} <span className="text-brand-primary">{t('auth.sign_in_title')}</span>
            </button>
          </motion.div>
        )}

        {view === 'phone' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left"
          >
            <button 
              onClick={() => { setView('select'); setError(null); setShowOtpInput(false); }}
              className="mb-6 flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            <h2 className="text-xl font-bold mb-4 font-serif">Phone Authentication</h2>
            
            {renderError()}

            {!showOtpInput ? (
              <form onSubmit={handlePhoneSubmit}>
                <div className="mb-4">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1 ml-1">Phone Number</label>
                  <input 
                    type="tel"
                    placeholder="+91 99999 99999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 focus:border-brand-primary/30 focus:outline-none transition-all font-bold"
                    required
                  />
                </div>
                <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-4">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1 ml-1">SMS Verification Code</label>
                  <input 
                    type="number"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 focus:border-brand-primary/30 focus:outline-none transition-all font-bold tracking-[0.5em] text-center"
                    required
                  />
                  <p className="text-center text-[10px] text-zinc-400 mt-2 font-medium">Enter the 6-digit code sent to your phone</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="w-full text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-widest hover:text-zinc-600"
                >
                  Change Phone Number
                </button>
              </form>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
