import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Harvest, UserProfile } from '../types';
import { Card, Badge } from './ui/Card';
import { Users, Package, Award, Share2, ClipboardList, TrendingUp, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Collective({ profile }: { profile: UserProfile | null }) {
  const [allHarvests, setAllHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'harvests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Harvest));
      setAllHarvests(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalStock = allHarvests.reduce((sum, h) => sum + h.quantity, 0);
  const hunterCount = new Set(allHarvests.map(h => h.hunterId)).size;
  const gradeA = allHarvests.filter(h => h.grade === 'A').reduce((sum, h) => sum + h.quantity, 0);
  const gradeB = allHarvests.filter(h => h.grade === 'B').reduce((sum, h) => sum + h.quantity, 0);

  const pieData = [
    { name: 'Grade A', value: gradeA, color: '#10B981' },
    { name: 'Grade B', value: gradeB, color: '#F59E0B' },
    { name: 'Ungraded', value: totalStock - gradeA - gradeB, color: '#D1D5DB' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">{t('nav.collective')}</h1>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">COLLECTIVE STOCK SUMMARY</p>
        </div>
        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-brand-primary/10">
          <Share2 className="w-6 h-6 text-amber-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Package className="text-amber-500" />} 
          label={t('dash.total_stock')} 
          value={`${totalStock.toFixed(1)} kg`} 
          bgColor="bg-amber-50"
        />
        <StatCard 
          icon={<Users className="text-blue-500" />} 
          label="ACTIVE HUNTERS" 
          value={hunterCount.toString()} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          icon={<Award className="text-emerald-500" />} 
          label="GRADE A" 
          value={`${gradeA.toFixed(1)} kg`} 
          bgColor="bg-emerald-50"
        />
        <StatCard 
          icon={<ClipboardList className="text-zinc-500" />} 
          label="GRADE B" 
          value={`${gradeB.toFixed(1)} kg`} 
          bgColor="bg-zinc-50"
        />
      </div>

      <Card className="p-8">
        <h3 className="text-xl font-serif font-bold mb-6">Quality Distribution</h3>
        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest -mt-4 mb-8">STOCK BY GRADE</p>
        
        <div className="h-48 w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="text-center text-zinc-300 text-sm italic">Add data to see distribution</div>
          )}
        </div>
      </Card>

      <section className="space-y-4 pb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold">Recent Contributions</h3>
          <button className="text-[12px] font-bold text-amber-600 flex items-center gap-1">
            VIEW FULL LIST <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {allHarvests.slice(0, 5).map(h => (
            <div key={h.id}>
              <Card className="p-4 flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-bold text-amber-600">{h.hunterName?.[0]}</span>
                 </div>
                 <div className="flex-1">
                    <h5 className="font-bold text-sm leading-none mb-1">{h.hunterName}</h5>
                    <p className="text-[10px] font-bold text-brand-secondary/40 uppercase tracking-tighter">
                       {h.floralSource} • JG-{h.id.slice(0,5).toUpperCase()}
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold">{h.quantity}kg</p>
                    <Badge variant={h.grade === 'A' ? 'emerald' : 'zinc'} className="px-1 py-0 scale-75 origin-right">
                       Grade {h.grade}
                    </Badge>
                 </div>
              </Card>
            </div>
          ))}
        </div>

        {totalStock > 100 && (
          <Card className="p-8 bg-brand-secondary text-white relative overflow-hidden">
             <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-serif font-bold">Bulk Bargaining Power</h3>
                <p className="text-amber-100 opacity-80 leading-relaxed">
                   Your group stock exceeds 100kg. You can now negotiate for 20% higher prices with retail partners.
                </p>
                <button className="w-full bg-white text-brand-secondary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors">
                   <ClipboardList className="w-5 h-5" />
                   Generate Group Report
                </button>
             </div>
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24" />
             <TrendingUp className="absolute bottom-4 right-4 w-24 h-24 text-white/5" />
          </Card>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }: any) {
  return (
    <Card className={cn("p-5 border-none", bgColor)}>
       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
          {icon}
       </div>
       <p className="text-[10px] font-black opacity-40 uppercase tracking-widest leading-none mb-2">{label}</p>
       <p className="text-2xl font-bold text-brand-secondary leading-none">{value}</p>
    </Card>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
