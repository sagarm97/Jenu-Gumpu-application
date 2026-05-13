import React, { useState, useEffect } from 'react';
import { UserProfile, Harvest } from '../types';
import { Card, Badge } from './ui/Card';
import { ArrowRight, PlusCircle, Droplets, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Dashboard({ profile, onTabChange }: { profile: UserProfile | null, onTabChange: (tab: any) => void }) {
  const { t } = useLanguage();
  const [totalStock, setTotalStock] = useState(0);

  const [recentHarvests, setRecentHarvests] = useState<Harvest[]>([]);

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'harvests'),
      where('hunterId', '==', profile.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const harvests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Harvest[];
      
      const total = harvests.reduce((acc, h) => acc + h.quantity, 0);
      setTotalStock(total);
      
      // Sort by timestamp descending and take top 5
      const sorted = [...harvests].sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      }).slice(0, 5);
      
      setRecentHarvests(sorted);
    });

    return () => unsubscribe();
  }, [profile]);

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `TODAY, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Hero Welcome */}
      <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-amber-400 to-amber-600 p-8 text-white shadow-2xl shadow-amber-500/30">
        <div className="relative z-10">
          <p className="text-[12px] font-bold uppercase tracking-widest opacity-80 mb-2">{t('profile.role_hunter')}</p>
          <h1 className="text-4xl font-serif font-bold mb-6">{t('dash.welcome')}, {profile?.name?.split(' ')[0]}</h1>
          
          <Card variant="glass" className="py-4 px-6 border-white/30">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{t('dash.total_stock')}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{totalStock.toFixed(1)}</span>
                  <span className="text-sm font-medium opacity-80">kg</span>
                </div>
             </div>
          </Card>
        </div>
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
            onClick={() => onTabChange('grade')}
          />
          <ActionCard 
            icon={<TrendingUp className="text-emerald-500" />} 
            title={t('dash.prices')} 
            subtitle={t('dash.prices_sub')} 
            bgColor="bg-emerald-50"
            onClick={() => onTabChange('prices')}
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
          {recentHarvests.length > 0 ? (
            recentHarvests.map((harvest) => (
              <ActivityItem 
                key={harvest.id}
                id={`ID: ${harvest.id.slice(-6).toUpperCase()}`} 
                label={harvest.floralSource} 
                weight={`${harvest.quantity}kg`} 
                grade={harvest.grade} 
                time={formatTime(harvest.timestamp)}
                iconBg={harvest.grade === 'A' ? "bg-emerald-500" : "bg-amber-500"}
              />
            ))
          ) : (
            <Card className="p-10 flex flex-col items-center justify-center text-center opacity-40">
              <PlusCircle className="w-8 h-8 mb-2" />
              <p className="text-sm font-bold">{t('dash.no_activity') || 'NO RECENT ACTIVITY'}</p>
            </Card>
          )}
        </div>
      </section>
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

function ActivityItem({ id, label, weight, grade, time, iconBg }: any) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className={cn("w-2 h-10 rounded-full", iconBg)} />
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

