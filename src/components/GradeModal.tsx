import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GradeResult {
  grade: 'A' | 'B' | 'C';
  reasoning: string;
  purity: number;
  marketFit: string;
}

export default function GradeModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  
  // Simulated characteristics
  const [color, setColor] = useState('Light Amber');
  const [viscosity, setViscosity] = useState('Thick');
  const [floral, setFloral] = useState('Wildflower');

  const handleGrade = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze honey purity and grade based on these characteristics:
        - Color: ${color}
        - Viscosity: ${viscosity}
        - Floral Source: ${floral}
        
        Provide a grading recommendation for a honey hunter in the Western Ghats.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              grade: { type: Type.STRING, enum: ['A', 'B', 'C'] },
              reasoning: { type: Type.STRING },
              purity: { type: Type.NUMBER },
              marketFit: { type: Type.STRING },
            },
            required: ['grade', 'reasoning', 'purity', 'marketFit']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-secondary/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center z-10">
          <X className="w-5 h-5 text-zinc-500" />
        </button>

        {!result ? (
          <>
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-serif font-bold text-brand-secondary">AI Grade Test</h2>
            </div>

            <div className="space-y-6">
              <OptionSelect 
                label="COLOR" 
                options={['Water White', 'Extra Light Amber', 'Light Amber', 'Amber']} 
                value={color} 
                onChange={setColor} 
              />
              <OptionSelect 
                label="VISCOSITY" 
                options={['Liquid', 'Thick', 'Crystallized']} 
                value={viscosity} 
                onChange={setViscosity} 
              />
              <OptionSelect 
                label="FLORAL SOURCE" 
                options={['Wildflower', 'Coffee', 'Neem', 'Eucalyptus']} 
                value={floral} 
                onChange={setFloral} 
              />

              <button
                onClick={handleGrade}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 active:scale-95 transition-all mt-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                Run AI Analysis
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="text-center">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-extrabold text-emerald-500">{result.grade}</span>
               </div>
               <h3 className="text-2xl font-serif font-bold">Grade {result.grade} Quality</h3>
               <p className="text-sm font-bold text-emerald-600 mt-1 uppercase tracking-widest">{result.purity}% PURITY ESTIMATE</p>
            </div>

            <div className="p-6 bg-zinc-50 rounded-2xl space-y-4">
               <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">REASONING</p>
                  <p className="text-sm text-brand-secondary leading-relaxed">{result.reasoning}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">MARKET FIT</p>
                  <p className="text-sm font-medium text-brand-secondary">{result.marketFit}</p>
               </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold transition-all shadow-lg"
            >
              Test Another
            </button>
          </div>
        )}

        {/* AI Branding background overlay */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </div>
  );
}

function OptionSelect({ label, options, value, onChange }: any) {
  return (
    <div>
       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">{label}</label>
       <div className="flex flex-wrap gap-2">
          {options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                value === opt ? "bg-zinc-800 text-white border-zinc-800" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200"
              )}
            >
              {opt}
            </button>
          ))}
       </div>
    </div>
  );
}
