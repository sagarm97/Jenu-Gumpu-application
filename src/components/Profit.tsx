import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Calculator, Package, Info, TrendingUp, Truck, Users, Scissors, Sparkles, DollarSign, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Profit() {
  const { t } = useLanguage();
  
  // Input States
  const [quantity, setQuantity] = useState(10);
  const [harvestCost, setHarvestCost] = useState(200);   // Total
  const [processCost, setProcessCost] = useState(500);   // Total
  const [packageCost, setPackageCost] = useState(30);    // Per KG
  const [shippingCost, setShippingCost] = useState(50);   // Per KG
  const [laborCost, setLaborCost] = useState(1000);      // Total
  const [commission, setCommission] = useState(10);      // Percentage
  const [sellingPrice, setSellingPrice] = useState(800); // Per KG
  const [targetMargin, setTargetMargin] = useState(30); // Percentage

  // Advanced View
  const [view, setView] = useState<'calc' | 'results'>('calc');

  // Calculations
  const totalVariableCostsPerKg = packageCost + shippingCost;
  const totalVariableCosts = totalVariableCostsPerKg * quantity;
  const totalFixedCosts = harvestCost + processCost + laborCost;
  
  const totalProductionCost = totalVariableCosts + totalFixedCosts;
  const costPerKg = totalProductionCost / quantity;
  
  const revenue = quantity * sellingPrice;
  const commissionAmount = revenue * (commission / 100);
  const totalProfit = revenue - totalProductionCost - commissionAmount;
  const profitPerKg = totalProfit / quantity;
  
  // Recommended Selling Price Formula:
  // Price = costPerKg / (1 - (targetMargin/100) - (commission/100))
  const marginFrac = targetMargin / 100;
  const commFrac = commission / 100;
  const recommendedPrice = (costPerKg) / (1 - marginFrac - commFrac);

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold">{t('profit.title')}</h1>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t('profit.simulator')}</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('calc')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'calc' ? 'bg-white shadow-sm text-brand-secondary' : 'text-zinc-400'}`}
          >
            INPUTS
          </button>
          <button 
            onClick={() => setView('results')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'results' ? 'bg-white shadow-sm text-brand-secondary' : 'text-zinc-400'}`}
          >
            RESULTS
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'calc' ? (
          <motion.div 
            key="calc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Quantity Slider */}
            <Card className="p-6 border-2 border-amber-100">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black uppercase text-amber-600 tracking-widest">
                  {t('logs.quantity')}
                </label>
                <span className="text-2xl font-bold font-serif text-brand-secondary">{quantity}kg</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="500" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-2 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExpenseInput 
                icon={<Scissors className="w-4 h-4" />} 
                label={t('profit.harvesting_cost')} 
                value={harvestCost} 
                onChange={setHarvestCost} 
                subLabel="Total Fixed"
              />
              <ExpenseInput 
                icon={<Sparkles className="w-4 h-4" />} 
                label={t('profit.processing_cost')} 
                value={processCost} 
                onChange={setProcessCost} 
                subLabel="Total Fixed"
              />
              <ExpenseInput 
                icon={<Package className="w-4 h-4" />} 
                label={t('profit.packaging_cost')} 
                value={packageCost} 
                onChange={setPackageCost} 
                subLabel="Per KG"
              />
              <ExpenseInput 
                icon={<Truck className="w-4 h-4" />} 
                label={t('profit.shipping_cost')} 
                value={shippingCost} 
                onChange={setShippingCost} 
                subLabel="Per KG"
              />
              <ExpenseInput 
                icon={<Users className="w-4 h-4" />} 
                label={t('profit.labor_cost')} 
                value={laborCost} 
                onChange={setLaborCost} 
                subLabel="Total Fixed"
              />
              <ExpenseInput 
                icon={<Percent className="w-4 h-4" />} 
                label={t('profit.commission')} 
                value={commission} 
                onChange={setCommission} 
                subLabel="Market Fee"
              />
            </div>

            <Card className="p-6 bg-brand-secondary text-white">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block mb-2">{t('profit.selling_price')}</label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 font-bold">₹</span>
                    <input 
                      type="number"
                      value={sellingPrice === 0 ? '' : sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value === '' ? 0 : parseInt(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      className="w-full bg-transparent border-b border-white/20 text-2xl font-bold py-2 pl-4 focus:outline-none focus:border-amber-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block mb-2">{t('profit.target_margin')}</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={targetMargin === 0 ? '' : targetMargin}
                      onChange={(e) => setTargetMargin(e.target.value === '' ? 0 : parseInt(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      className="w-full bg-transparent border-b border-white/20 text-2xl font-bold py-2 pr-6 focus:outline-none focus:border-amber-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
                  </div>
                </div>
              </div>
            </Card>

            <button 
              onClick={() => setView('results')}
              className="w-full bg-amber-500 text-white font-bold py-5 rounded-3xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              VIEW PROFIT ANALYSIS
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Quick Profit Card */}
            <Card className={`p-8 relative overflow-hidden transition-colors ${totalProfit > 0 ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
              <div className="relative z-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">{t('profit.total_profit')}</p>
                <h2 className="text-6xl font-bold mb-2">₹{Math.round(totalProfit).toLocaleString()}</h2>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <p className="text-[8px] font-bold opacity-60">PER KG</p>
                    <p className="text-lg font-bold">₹{Math.round(profitPerKg)}</p>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <p className="text-[8px] font-bold opacity-60">MARGIN</p>
                    <p className="text-lg font-bold">{Math.round((totalProfit/revenue)*100)}%</p>
                  </div>
                </div>
              </div>
              <TrendingUp className="absolute bottom-0 right-0 w-64 h-64 text-white/10 -mr-16 -mb-16" />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard 
                label={t('profit.total_cost')} 
                value={`₹${Math.round(totalProductionCost).toLocaleString()}`} 
                icon={<DollarSign className="w-5 h-5 text-amber-500" />} 
              />
              <ResultCard 
                label={t('profit.cost_per_kg')} 
                value={`₹${Math.round(costPerKg).toLocaleString()}`} 
                icon={<Calculator className="w-5 h-5 text-blue-500" />} 
              />
            </div>

            {/* Recommended Price Card */}
            <Card className="p-8 border-4 border-dashed border-amber-200 bg-amber-50/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{t('profit.rec_price')}</p>
                  <h3 className="text-3xl font-serif font-bold text-brand-secondary">₹{Math.round(recommendedPrice).toLocaleString()}/KG</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    Based on your <span className="font-bold text-brand-secondary">{targetMargin}%</span> target margin 
                    and <span className="font-bold text-brand-secondary">{commission}%</span> platform fee.
                  </p>
                </div>
              </div>
            </Card>

            <div className="p-6 bg-zinc-50 rounded-[40px] flex gap-4 items-start">
              <Info className="w-6 h-6 text-zinc-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-zinc-700">Cost Breakdown Reminder</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Your "Fixed Costs" (Labor, Harvesting, Processing) contribute <strong>₹{Math.round(totalFixedCosts/quantity)}/kg</strong> to your overall production cost for this batch.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setView('calc')}
              className="w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Adjust Inputs
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpenseInput({ icon, label, value, onChange, subLabel }: any) {
  return (
    <Card className="p-4 border-zinc-100 hover:border-amber-200 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
            {icon}
          </div>
          <div>
            <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">{label}</label>
            <span className="text-[8px] font-bold text-amber-600/50 uppercase">{subLabel}</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">₹</span>
        <input 
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const val = e.target.value === '' ? 0 : parseInt(e.target.value);
            onChange(val);
          }}
          onFocus={(e) => e.target.select()}
          className="w-full bg-transparent text-xl font-bold outline-none pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </Card>
  );
}

function ResultCard({ label, value, icon }: any) {
  return (
    <Card className="p-6 flex items-center gap-4">
      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-bold text-brand-secondary">{value}</p>
      </div>
    </Card>
  );
}
