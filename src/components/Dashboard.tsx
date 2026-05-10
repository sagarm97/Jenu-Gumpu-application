import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Card, Badge } from './ui/Card';
import { ArrowRight, PlusCircle, Droplets, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import GradeModal from './GradeModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard({ profile, onTabChange }: { profile: UserProfile | null, onTabChange: (tab: any) => void }) {
  const [showGradeModal, setShowGradeModal] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Hero Welcome */}
      <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-amber-400 to-amber-600 p-8 text-white shadow-2xl shadow-amber-500/30">
        <div className="relative z-10">
          <p className="text-[12px] font-bold uppercase tracking-widest opacity-80 mb-2">{profile?.role === 'manager' ? t('profile.role_manager') : t('profile.role_hunter')}</p>
          <h1 className="text-4xl font-serif font-bold mb-6">{t('dash.welcome')}, {profile?.name?.split(' ')[0]}</h1>
          
          <Card variant="glass" className="flex items-center gap-4 py-4 px-6 border-white/30">
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                <img src={profile?.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.uid}`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{t('dash.total_stock')}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{profile?.totalHarvested?.toFixed(1) || '0.0'}</span>
                  <span className="text-sm font-medium opacity-80">kg</span>
                </div>
             </div>
          </Card>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 -mr-12 -mt-12 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200/20 -ml-8 -mb-8 rounded-full blur-2xl" />
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-xl font-serif font-bold mb-4">{t('dash.quick_actions')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <ActionCard 
            icon={<PlusCircle className="text-amber-500" />} 
            title={t('dash.log_harvest')} 
            subtitle={t('dash.log_harvest_sub')} 
            bgColor="bg-amber-50"
            onClick={() => onTabChange('logs')}
          />
          <ActionCard 
            icon={<Droplets className="text-blue-500" />} 
            title={t('dash.grade_honey')} 
            subtitle={t('dash.grade_honey_sub')} 
            bgColor="bg-blue-50"
            onClick={() => setShowGradeModal(true)}
          />
          <ActionCard 
            icon={<TrendingUp className="text-emerald-500" />} 
            title={t('dash.prices')} 
            subtitle={t('dash.prices_sub')} 
            bgColor="bg-emerald-50"
            onClick={() => onTabChange('prices')}
          />
          <ActionCard 
            icon={<Users className="text-purple-500" />} 
            title={t('dash.group')} 
            subtitle={t('dash.group_sub')} 
            bgColor="bg-purple-50"
            onClick={() => onTabChange('collective')}
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold">{t('dash.recent')}</h3>
          <button 
            onClick={() => onTabChange('logs')}
            className="text-[12px] font-bold text-amber-600 flex items-center gap-1 hover:gap-2 transition-all"
          >
            {t('dash.view_all')} <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="space-y-3">
          {/* Mock Recent Logs */}
          <ActivityItem 
            id="JG-2007-CF-007" 
            label="Coffee Blossom" 
            weight="12kg" 
            grade="A" 
            time="TODAY, 10:45 AM"
            icon={<Droplets className="w-5 h-5 text-emerald-500" />}
            iconBg="bg-emerald-50"
          />
          <ActivityItem 
            id="JG-2006-WF-006" 
            label="Wildflower" 
            weight="8.5kg" 
            grade="U" 
            time="YESTERDAY, 4:20 PM"
            icon={<Droplets className="w-5 h-5 text-amber-500" />}
            iconBg="bg-amber-50"
          />
        </div>
      </section>

      <AnimatePresence>
        {showGradeModal && <GradeModal onClose={() => setShowGradeModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ActionCard({ icon, title, subtitle, bgColor, onClick }: { icon: React.ReactNode, title: string, subtitle: string, bgColor: string, onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn("flex flex-col items-start p-5 rounded-[32px] text-left transition-shadow hover:shadow-md", bgColor)}
    >
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' })}
      </div>
      <h4 className="font-bold text-brand-secondary leading-tight">{title}</h4>
      <p className="text-[10px] font-black tracking-tighter opacity-60 uppercase mt-1">{subtitle}</p>
    </motion.button>
  );
}

function ActivityItem({ id, label, weight, grade, time, icon, iconBg }: any) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", iconBg)}>
        {icon}
      </div>
      <div className="flex-1">
        <h5 className="font-bold text-sm leading-none mb-1">{id}</h5>
        <p className="text-[12px] text-brand-secondary/60">
          {label} - <span className="font-medium text-brand-secondary">{weight}</span> - Grade {grade}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-amber-600 whitespace-nowrap">{time}</p>
      </div>
    </Card>
  );
}

