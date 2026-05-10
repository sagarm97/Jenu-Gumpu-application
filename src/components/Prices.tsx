import React, { useState, useEffect } from 'react';
import { Card, Badge } from './ui/Card';
import { RefreshCw, TrendingUp, TrendingDown, Info, ShoppingBag, Landmark, MapPin, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface MarketData {
  city: string;
  retail: number;
  wholesale: number;
  history: { name: string; price: number }[];
}

const DEFAULT_PRICES: Record<string, any> = {
  'Bengaluru': { retail: 750, wholesale: 350 },
  'Mysuru': { retail: 720, wholesale: 320 },
  'Pune': { retail: 780, wholesale: 380 },
  'Coorg': { retail: 850, wholesale: 420 },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Prices() {
  const [city, setCity] = useState('Bengaluru');
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const q = collection(db, 'marketPrices');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        seedInitialData();
      } else {
        const data: Record<string, MarketData> = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data() as MarketData;
        });
        setMarketData(data);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const seedInitialData = async () => {
    setLoading(true);
    for (const [cityName, prices] of Object.entries(DEFAULT_PRICES)) {
      const history = DAYS.map(day => ({
        name: day,
        price: prices.retail - Math.floor(Math.random() * 50)
      }));
      
      await setDoc(doc(db, 'marketPrices', cityName), {
        city: cityName,
        retail: prices.retail,
        wholesale: prices.wholesale,
        history,
        updatedAt: Timestamp.now()
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate real-time update with minor variations
    for (const [cityName, prices] of Object.entries(DEFAULT_PRICES)) {
      const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
      const currentData = marketData[cityName];
      
      const newRetail = prices.retail + variation;
      const newWholesale = prices.wholesale + Math.floor(variation / 2);
      
      // Update history: shift and add current
      const newHistory = [...(currentData?.history || [])];
      if (newHistory.length > 7) newHistory.shift();
      
      await setDoc(doc(db, 'marketPrices', cityName), {
        ...currentData,
        retail: newRetail,
        wholesale: newWholesale,
        updatedAt: Timestamp.now()
      }, { merge: true });
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentData = marketData[city];
  const gap = currentData ? ((currentData.retail - currentData.wholesale) / currentData.wholesale * 100).toFixed(0) : '0';

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">{t('prices.title')}</h1>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            {refreshing ? 'REFRESHING LIVE FEED...' : 'DAILY MARKET REPORT'}
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-brand-primary/10 active:scale-90 transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-6 h-6 text-amber-500", refreshing && "animate-spin")} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Object.keys(DEFAULT_PRICES).map(c => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={cn(
              "px-6 py-4 rounded-2xl font-bold min-w-[120px] transition-all",
              city === c ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-white text-zinc-400 border border-brand-primary/5"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={city}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="relative overflow-hidden p-8 border-4 border-amber-50">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                   <TrendingUp className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{t('prices.retail')}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">₹{currentData?.retail || '---'}</span>
                  <span className="text-sm font-medium opacity-60">/ per kg</span>
                </div>
              </div>

              <div className="space-y-4 text-right">
                <div className="flex items-center gap-2 text-amber-600/60 justify-end">
                   <span className="text-[10px] font-black uppercase tracking-widest">{t('prices.wholesale')}</span>
                </div>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-3xl font-bold text-amber-600/40">₹{currentData?.wholesale || '---'}</span>
                  <span className="text-xs font-medium opacity-60">/ per kg</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="px-3 py-4 bg-white rounded-xl flex flex-col items-center">
                <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-sm font-bold text-emerald-600">+{gap}%</span>
                <span className="text-[8px] font-black uppercase text-emerald-600">{t('prices.gap')}</span>
              </div>
              <p className="text-[13px] font-bold text-brand-secondary/70 leading-tight">
                {language === 'en' 
                  ? 'Extra profit potential from direct retail sales vs middleman.' 
                  : 'ಮಧ್ಯವರ್ತಿಗಳಿಗಿಂತ ನೇರ ಮಾರಾಟದಿಂದ ಹೆಚ್ಚಿನ ಲಾಭದ ಸಾಧ್ಯತೆ.'}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-amber-100/30 rounded-full blur-3xl -mr-24" />
            <TrendingUp className="absolute top-1/2 right-12 -translate-y-1/2 w-32 h-32 text-amber-100/20" />
          </Card>
        </motion.div>
      </AnimatePresence>

      <Card className="p-6 overflow-visible">
        <div className="flex items-center gap-2 mb-6">
           <h3 className="text-xl font-serif font-bold">{t('prices.trend')}</h3>
           <Info className="w-4 h-4 text-zinc-300" />
        </div>
        
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData?.history || []}>
              <Bar dataKey="price" radius={[8, 8, 8, 8]}>
                {(currentData?.history || []).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === (currentData?.history.length || 0) - 1 ? '#F59E0B' : '#FEF3C7'} 
                  />
                ))}
              </Bar>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#F59E0B' }} 
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-2xl shadow-2xl border border-amber-100">
                        <p className="text-[10px] font-black text-brand-secondary/40 uppercase mb-1">{payload[0].payload.name}</p>
                        <p className="text-xl font-bold flex items-baseline gap-1">
                          <span className="text-xs font-medium opacity-60">price :</span> ₹{payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
