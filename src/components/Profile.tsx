import React, { useRef, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { Card, Badge } from './ui/Card';
import { User, Mail, MapPin, Shield, LogOut, ChevronRight as ChevronRightIcon, Languages, Bell, HelpCircle, Camera, Trash2, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';

export default function Profile({ profile, setProfile, onLogout }: { profile: UserProfile | null, setProfile: (p: UserProfile) => void, onLogout: () => void }) {
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage();
  
  const toggleRole = async () => {
    if (!profile) return;
    const newRole: UserRole = profile.role === 'hunter' ? 'manager' : 'hunter';
    try {
      await updateDoc(doc(db, 'users', profile.uid), { role: newRole });
      setProfile({ ...profile, role: newRole });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Check size (Firestore limit is 1MB total for doc, let's keep photo < 100kb)
    if (file.size > 102400) {
      alert("Please select an image smaller than 100KB.");
      return;
    }

    setUpdatingPhoto(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        await updateDoc(doc(db, 'users', profile.uid), { photoURL: base64 });
        setProfile({ ...profile, photoURL: base64 });
      } catch (error) {
        console.error(error);
      } finally {
        setUpdatingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = async () => {
    if (!profile) return;
    setUpdatingPhoto(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), { photoURL: null });
      const updatedProfile = { ...profile };
      delete updatedProfile.photoURL;
      setProfile(updatedProfile);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingPhoto(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      <h1 className="text-3xl font-serif font-bold">{t('profile.title')}</h1>
      
      <div className="flex flex-col items-center gap-6 mb-10">
         <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-amber-100 p-1 relative overflow-hidden">
               {updatingPhoto && (
                 <div className="absolute inset-0 z-20 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                 </div>
               )}
               <img 
                 src={profile?.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.uid}`} 
                 alt="Avatar" 
                 className="w-full h-full rounded-full bg-white object-cover"
               />
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-brand-secondary hover:scale-110 transition-transform"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  {profile?.photoURL && (
                    <button 
                      onClick={deletePhoto}
                      className="p-2 bg-rose-500 rounded-full text-white hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
               </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />

            <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-bg-warm flex items-center justify-center z-10 shadow-lg">
               <Shield className="w-4 h-4 text-white" />
            </div>
         </div>

         <div className="text-center">
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">
               {profile?.role === 'hunter' ? 'VERIFIED HUNTER' : 'COOPERATIVE MANAGER'}
            </p>
         </div>
      </div>

      <Card className="p-8 space-y-8">
         <InfoRow icon={<Mail className="text-amber-500 w-5 h-5" />} label="EMAIL" value={profile?.email || 'N/A'} />
         <InfoRow icon={<MapPin className="text-amber-500 w-5 h-5" />} label="LOCATION" value={profile?.location || 'Western Ghats, India'} />
         <InfoRow icon={<Shield className="text-amber-500 w-5 h-5" />} label="ROLE" value={profile?.role?.toUpperCase() || 'HUNTER'} />
      </Card>

      <div className="space-y-3">
         <Card className="p-8 bg-brand-secondary text-white">
            <h3 className="text-xl font-serif font-bold mb-2">{t('profile.switch_role')}</h3>
            <p className="text-xs opacity-70 mb-8 leading-relaxed">
               Switch roles to see different dashboard views. Manager view allows tracking collective stock data.
            </p>
            <button 
              onClick={toggleRole}
              className="w-full bg-white text-brand-secondary py-5 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition-all"
            >
               Switch to {profile?.role === 'hunter' ? t('profile.role_manager') : t('profile.role_hunter')}
            </button>
         </Card>

         <Card className="p-0 overflow-hidden">
            <MenuButton 
              icon={<Languages className="text-zinc-400" />} 
              label={t('profile.language')} 
              value={language === 'en' ? 'ENG' : 'ಕನ್ನಡ'} 
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            />
            <div className="h-px bg-zinc-50 mx-6" />
            <MenuButton icon={<Bell className="text-zinc-400" />} label="Notifications" />
            <div className="h-px bg-zinc-50 mx-6" />
            <MenuButton icon={<HelpCircle className="text-zinc-400" />} label="Support" />
            <div className="h-px bg-zinc-50 mx-6" />
            <button 
              onClick={onLogout}
              className="w-full p-6 flex items-center justify-between text-rose-500 hover:bg-rose-50 transition-all"
            >
               <div className="flex items-center gap-4 font-bold">
                  <LogOut className="w-5 h-5" />
                  {t('profile.sign_out')}
               </div>
            </button>
         </Card>
      </div>

      <p className="text-center text-[10px] font-bold text-zinc-300 py-10 tracking-[0.2em] uppercase">
         Jenu-Gumpu v1.0.2
      </p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex gap-4">
       {icon}
       <div>
          <p className="text-[10px] font-black text-amber-600/40 uppercase tracking-widest leading-none mb-2">{label}</p>
          <p className="text-sm font-bold text-brand-secondary">{value}</p>
       </div>
    </div>
  );
}

function MenuButton({ icon, label, value, onClick }: { icon: React.ReactNode, label: string, value?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 transition-all group"
    >
       <div className="flex items-center gap-4">
          {icon}
          <span className="font-bold text-brand-secondary">{label}</span>
       </div>
       <div className="flex items-center gap-2">
          {value && <span className="text-xs font-bold text-amber-600">{value}</span>}
          <ChevronRightIcon className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
       </div>
    </button>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
