import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from './types';
import { Home, ClipboardList, TrendingUp, Users, Calculator, User as UserIcon, LogOut, Loader2, Sparkles, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { LanguageProvider, useLanguage, languages } from './contexts/LanguageContext';

// Page Components
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import Prices from './components/Prices';
import Collective from './components/Collective';
import Profit from './components/Profit';
import Profile from './components/Profile';
import LanguageSelector from './components/LanguageSelector';

type Tab = 'home' | 'logs' | 'prices' | 'collective' | 'profit' | 'profile';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          // Create default profile
          const newProfile: UserProfile = {
            uid: u.uid,
            name: u.displayName || 'Friend',
            email: u.email || '',
            role: 'hunter',
            totalHarvested: 0,
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', u.uid), newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <p className="text-sm font-medium animate-pulse">Loading Jenu-Gumpu...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 scale-150 blur-3xl bg-brand-primary/20 rounded-full" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-24 h-24 bg-brand-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-primary/40"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl font-serif font-bold mb-2">Jenu-Gumpu</h1>
        <p className="text-brand-secondary/60 mb-8 max-w-xs">
          Empowering honey hunters with market insights and AI grading.
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full max-w-xs bg-brand-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-6 h-6 bg-white rounded-full p-1" alt="Google" />
          Sign in with Google
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard profile={profile} onTabChange={setActiveTab} />;
      case 'logs': return <Logs profile={profile} />;
      case 'prices': return <Prices />;
      case 'collective': return <Collective profile={profile} />;
      case 'profit': return <Profit />;
      case 'profile': return <Profile profile={profile} setProfile={setProfile} onLogout={logout} />;
      default: return <Dashboard profile={profile} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="pb-24 pt-4 max-w-md mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold leading-none">{t('app.name')}</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-primary mt-1">{t('app.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsLangOpen(true)}
             className="px-3 py-1 rounded-full bg-brand-primary/10 text-[10px] font-black text-brand-primary border border-brand-primary/20 flex items-center gap-2"
           >
             <Languages className="w-3 h-3" />
             {languages.find(l => l.code === language)?.nativeName || 'ENG'}
           </button>
           <button 
             onClick={() => setActiveTab('profile')}
             className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 overflow-hidden"
           >
             {profile?.photoURL ? (
               <img src={profile.photoURL} alt="User" className="w-full h-full object-cover" />
             ) : (
               <UserIcon className="w-5 h-5 text-brand-primary" />
             )}
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="px-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[calc(448px-48px)] bg-white/80 backdrop-blur-xl border border-brand-primary/10 rounded-3xl p-2 flex items-center justify-between shadow-2xl z-50">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label={t('nav.home')} />
        <NavButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<ClipboardList />} label={t('nav.logs')} />
        <NavButton active={activeTab === 'prices'} onClick={() => setActiveTab('prices')} icon={<TrendingUp />} label={t('nav.prices')} />
        <NavButton active={activeTab === 'collective'} onClick={() => setActiveTab('collective')} icon={<Users />} label={t('nav.collective')} />
        <NavButton active={activeTab === 'profit'} onClick={() => setActiveTab('profit')} icon={<Calculator />} label={t('nav.profit')} />
      </nav>

      <LanguageSelector isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all gap-1",
        active ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "text-brand-primary/40 hover:text-brand-primary/60"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      <span className="text-[8px] font-bold tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="w-1 h-1 bg-white rounded-full absolute bottom-2" 
        />
      )}
    </button>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
