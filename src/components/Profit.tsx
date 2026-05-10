import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Calculator, ShoppingBag, Package, ArrowDown, ChevronRight, Info, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Profit() {
  const [quantity, setQuantity] = useState(28);
  const [filterCost, setFilterCost] = useState(20);
  const [packageCost, setPackageCost] = useState(40);
  const [prices, setPrices] = useState({ retail: 750, wholesale: 350 });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
 
  useEffect(() => {
    // Default to Bengaluru prices for the simulator
    const unsubscribe = onSnapshot(doc(db, 'marketPrices', 'Bengaluru'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPrices({ retail: data.retail, wholesale: data.wholesale });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const wholesalePrice = prices.wholesale;
  const retailPrice = prices.retail;
 
  const rawEarning = quantity * wholesalePrice;
  const totalCost = (filterCost + packageCost) * quantity;
  const processedEarning = (quantity * retailPrice) - totalCost;
  const diff = processedEarning - rawEarning;
  const percentage = (diff / rawEarning) * 100;
 
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-serif font-bold">{t('profit.title')}</h1>
        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">PROFIT SIMULATOR</p>
      </div>
 
      <Card className="p-8 border-4 border-amber-50 overflow-visible">
        <div className="space-y-10">
          <div>
            <label className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-10 block flex justify-between">
               {t('logs.quantity')}
            </label>
            <div className="relative pt-2">
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-3 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between mt-4 text-sm font-bold opacity-60">
                <span>1kg</span>
                <span className="text-4xl text-brand-secondary opacity-100 -mt-6">{quantity}kg</span>
                <span>100kg</span>
              </div>
            </div>
          </div>
 
          <div className="grid grid-cols-2 gap-4 pt-4">
            <CostInput label="FILTERING (₹/KG)" value={filterCost} onChange={setFilterCost} icon={<DropletsIcon />} />
            <CostInput label="PACKAGING (₹/KG)" value={packageCost} onChange={setPackageCost} icon={<PackageIcon />} />
          </div>
        </div>
      </Card>
 
      <div className="space-y-4">
         <Card className="flex items-center justify-between p-6 bg-white/50 border-dashed">
            <div>
               <h4 className="font-bold text-lg">{t('profit.raw')}</h4>
               <p className="text-[10px] font-medium text-brand-secondary/40">Selling raw at wholesale price</p>
            </div>
            <div className="text-right">
               <span className="text-2xl font-bold">₹{rawEarning.toLocaleString()}</span>
               <p className="text-[10px] font-bold text-brand-secondary/40 uppercase tracking-tight">TOTAL EARNING</p>
            </div>
         </Card>
 
         <div className="flex justify-center -my-2 relative z-10">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-4 border-bg-warm">
               <ArrowDown className="text-white w-6 h-6" />
            </div>
         </div>
 
         <Card className="p-8 border-4 border-amber-400 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
               <div>
                  <h4 className="text-2xl font-serif font-bold text-brand-secondary">{t('profit.processed')}</h4>
                  <p className="text-[11px] font-medium text-brand-secondary/40">Filtered, packed & sold directly</p>
               </div>
               <div className="text-right">
                  <span className="text-3xl font-extrabold text-brand-secondary">₹{processedEarning.toLocaleString()}</span>
                  <p className="text-[10px] font-bold text-brand-secondary/40 uppercase tracking-tight">TOTAL EARNING</p>
               </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full blur-2xl -mr-16 -mt-16" />
         </Card>

         <Card className="p-8 bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
            <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">EXTRA PROFIT POTENTIAL</p>
               <h2 className="text-5xl font-bold mb-2">₹{diff.toLocaleString()}</h2>
               <p className="text-lg font-bold">+{percentage.toFixed(0)}% more earnings</p>
            </div>
            <TrendingUp className="absolute bottom-0 right-0 w-48 h-48 text-white/10 -mr-12 -mb-12" />
         </Card>
      </div>

      <div className="p-6 bg-blue-50/50 rounded-[40px] flex gap-4 items-start border border-blue-100">
         <Info className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
         <p className="text-sm font-medium text-blue-800 leading-relaxed">
           Remember: Quality is key in retail. Grade A honey can fetch even higher prices than the urban average.
         </p>
      </div>
    </div>
  );
}

function CostInput({ label, value, onChange, icon }: any) {
  return (
    <div className="p-4 bg-white border border-brand-primary/10 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-3">
         {icon}
         <label className="text-[8px] font-black text-amber-600/60 tracking-widest">{label}</label>
      </div>
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full text-2xl font-bold bg-transparent outline-none"
      />
    </div>
  );
}

function DropletsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-500" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10 12 2.5 12 2.5C12 2.5 4.5 10 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-500" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20V12M12 12L7.5 9M12 12L16.5 9M21 5.5L12 2L3 5.5V18.5L12 22L21 18.5V5.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
