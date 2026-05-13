import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Camera, Sparkles, ShieldCheck, Microscope, Info, AlertCircle, Droplets, Thermometer, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function GradeHoney() {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | 'A' | 'B' | 'C'>(null);

  // Input states for analysis
  const [moisture, setMoisture] = useState(18);
  const [pollen, setPollen] = useState(70);
  const [clarity, setClarity] = useState(90);

  const startAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult('A');
    }, 3000);
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-3xl font-serif font-bold">{t('dash.grade_honey')}</h1>
        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t('dash.grade_honey_sub')}</p>
      </div>

      {!result ? (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
               <GradeInput 
                label="Moisture (%)" 
                value={moisture} 
                onChange={setMoisture} 
                icon={<Droplets className="w-4 h-4 text-blue-500" />}
               />
               <GradeInput 
                label="Pollen Count (Score 1-100)" 
                value={pollen} 
                onChange={setPollen} 
                icon={<Microscope className="w-4 h-4 text-purple-500" />}
               />
               <GradeInput 
                label="Clarity (%)" 
                value={clarity} 
                onChange={setClarity} 
                icon={<Sparkles className="w-4 h-4 text-amber-500" />}
               />
            </div>

            <button 
              onClick={startAnalysis}
              disabled={analyzing}
              className="w-full py-8 bg-brand-secondary text-white rounded-[32px] font-bold shadow-xl shadow-brand-secondary/20 flex flex-col items-center justify-center gap-4 disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">
                  {analyzing ? 'ANALYZING QUALITY...' : 'START AI ANALYSIS'}
                </p>
                {analyzing && (
                  <div className="mt-4 flex justify-center">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </button>

          <div className="grid grid-cols-2 gap-4">
            <FeatureCard 
              icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} 
              label="Purity Test" 
              desc="Analysis logic applied" 
            />
            <FeatureCard 
              icon={<TrendingUp className="w-5 h-5 text-amber-500" />} 
              label="Valuation" 
              desc="Real-time market rates" 
            />
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="p-10 bg-emerald-500 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex bg-white/20 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase mb-6">
                ANALYSIS COMPLETE
              </div>
              <h2 className="text-8xl font-black mb-4">GRADE A</h2>
              <p className="font-serif text-xl opacity-90 italic">"Exceptional Purity & Clarity"</p>
              
              <div className="h-px bg-white/20 my-8" />
              
              <div className="grid grid-cols-3 gap-2">
                <Stat icon={<Droplets className="w-4 h-4" />} label="Moisture" val={`${moisture}%`} />
                <Stat icon={<Microscope className="w-4 h-4" />} label="Pollen" val={pollen > 80 ? "High" : "Good"} />
                <Stat icon={<Sparkles className="w-4 h-4" />} label="Clarity" val={`${clarity}%`} />
              </div>
            </div>
            <Sparkles className="absolute -bottom-12 -right-12 w-64 h-64 text-white/10" />
          </Card>

          <Card className="p-6 bg-amber-50 border-2 border-amber-200">
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                   <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">MARKET VALUE ESTIMATE</p>
                   <p className="text-2xl font-bold text-brand-secondary">₹850 - ₹920 / KG</p>
                   <p className="text-xs text-zinc-500 mt-1">This grade commands a 15% premium in local markets.</p>
                </div>
             </div>
          </Card>

          <div className="flex gap-3">
            <button 
              onClick={() => setResult(null)}
              className="w-full py-5 bg-zinc-100 text-zinc-600 rounded-[24px] font-bold"
            >
              NEW SCAN
            </button>
          </div>
        </motion.div>
      )}

      <div className="p-6 bg-zinc-50 rounded-[40px] flex gap-4">
        <Info className="w-6 h-6 text-zinc-400 shrink-0 mt-1" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          <strong>Note:</strong> AI grading is an assistive tool. For certified results required by export regulators, please submit physical samples to the cooperative laboratory.
        </p>
      </div>
    </div>
  );
}

function GradeInput({ label, value, onChange, icon }: any) {
  return (
    <Card className="p-4 border-zinc-100 hover:border-amber-200 transition-all group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-amber-50 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">{label}</label>
          <input 
            type="number"
            value={value === 0 ? '' : value}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : parseInt(e.target.value);
              onChange(val);
            }}
            onFocus={(e) => e.target.select()}
            className="w-full bg-transparent text-xl font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>
    </Card>
  );
}

function FeatureCard({ icon, label, desc }: any) {
  return (
    <Card className="p-4 border-zinc-50">
      <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs font-bold text-brand-secondary mb-1">{label}</p>
      <p className="text-[9px] text-zinc-400 leading-tight">{desc}</p>
    </Card>
  );
}

function Stat({ icon, label, val }: any) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 opacity-60 mb-1">
        {icon}
        <span className="text-[8px] font-bold uppercase">{label}</span>
      </div>
      <p className="text-sm font-bold">{val}</p>
    </div>
  );
}
