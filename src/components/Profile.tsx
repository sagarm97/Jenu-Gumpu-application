import React, { useRef, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { Card, Badge } from './ui/Card';
import { User, Mail, MapPin, Shield, LogOut, ChevronRight as ChevronRightIcon, Languages, Loader2, Phone } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';

export default function Profile({ profile, setProfile, onLogout }: { profile: UserProfile | null, setProfile: (p: UserProfile) => void, onLogout: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [editedPhone, setEditedPhone] = useState(profile?.phoneNumber || '');
  const [editedLocation, setEditedLocation] = useState(profile?.location || '');
  const [editedEmail, setEditedEmail] = useState(profile?.email || '');
  const [saving, setSaving] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        name: editedName,
        phoneNumber: editedPhone,
        location: editedLocation,
        email: editedEmail
      });
      setProfile({
        ...profile,
        name: editedName,
        phoneNumber: editedPhone,
        location: editedLocation,
        email: editedEmail
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold tracking-tight">{t('profile.title')}</h1>
        <button 
          onClick={() => {
            if (isEditing) {
               handleSave();
            } else {
               setIsEditing(true);
            }
          }}
          className="text-xs font-black text-amber-600 uppercase tracking-widest px-4 py-2 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-2"
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isEditing ? 'SAVE' : 'EDIT'}
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-6 mb-10">
         <div className="text-center w-full max-w-[300px] pt-8">
            {isEditing ? (
              <input 
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-3xl font-bold bg-transparent border-b-2 border-amber-300 text-center w-full focus:outline-none focus:border-amber-500 transition-colors py-2"
                placeholder="Full Name"
              />
            ) : (
              <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">{profile?.name}</h2>
            )}
            <div className="flex items-center justify-center gap-2 mt-2">
               <Shield className="w-4 h-4 text-emerald-500 fill-emerald-50" />
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
                  VERIFIED HUNTER
               </p>
            </div>
         </div>
      </div>

      <Card className="p-8 space-y-8">
         <div className="flex gap-4">
           <Mail className="text-amber-500 w-5 h-5" />
           <div className="flex-1">
             <p className="text-[10px] font-black text-amber-600/40 uppercase tracking-widest leading-none mb-2">EMAIL</p>
             {isEditing ? (
               <input 
                 type="email"
                 value={editedEmail}
                 onChange={(e) => setEditedEmail(e.target.value)}
                 className="text-sm font-bold text-brand-secondary bg-transparent border-b border-amber-200 w-full focus:outline-none focus:border-amber-500 transition-colors"
                 placeholder="name@example.com"
               />
             ) : (
               <p className="text-sm font-bold text-brand-secondary">{profile?.email || 'N/A'}</p>
             )}
           </div>
         </div>
         <div className="flex gap-4">
           <Phone className="text-amber-500 w-5 h-5" />
           <div className="flex-1">
             <p className="text-[10px] font-black text-amber-600/40 uppercase tracking-widest leading-none mb-2">PHONE NUMBER</p>
             {isEditing ? (
               <input 
                 type="tel"
                 value={editedPhone}
                 onChange={(e) => setEditedPhone(e.target.value)}
                 className="text-sm font-bold text-brand-secondary bg-transparent border-b border-amber-200 w-full focus:outline-none focus:border-amber-500 transition-colors"
                 placeholder="+91 00000 00000"
               />
             ) : (
               <p className="text-sm font-bold text-brand-secondary">{profile?.phoneNumber || 'Add Phone Number'}</p>
             )}
           </div>
         </div>
         <div className="flex gap-4">
           <MapPin className="text-amber-500 w-5 h-5" />
           <div className="flex-1">
             <p className="text-[10px] font-black text-amber-600/40 uppercase tracking-widest leading-none mb-2">LOCATION</p>
             {isEditing ? (
               <input 
                 type="text"
                 value={editedLocation}
                 onChange={(e) => setEditedLocation(e.target.value)}
                 className="text-sm font-bold text-brand-secondary bg-transparent border-b border-amber-200 w-full focus:outline-none focus:border-amber-500 transition-colors"
                 placeholder="Region, Country"
               />
             ) : (
               <p className="text-sm font-bold text-brand-secondary">{profile?.location || 'Add Location'}</p>
             )}
           </div>
         </div>
      </Card>

      <div className="space-y-3">
        <Card className="p-0 overflow-hidden">
          <MenuButton 
            icon={<Languages className="text-zinc-400" />} 
            label={t('profile.language')} 
            value={language === 'en' ? 'ENG' : 'ಕನ್ನಡ'} 
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
          />
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
