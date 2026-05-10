import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { Harvest, UserProfile } from '../types';
import { Card, Badge } from './ui/Card';
import { Plus, Search, Filter, Droplets, MapPin, Scale, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Logs({ profile }: { profile: UserProfile | null }) {
  const [logs, setLogs] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'harvests'),
      where('hunterId', '==', profile.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Harvest));
      setLogs(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pt-4">
        <h1 className="text-3xl font-serif font-bold">{t('logs.title')}</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/40"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-[40px] border border-dashed border-brand-primary/20">
          <Droplets className="w-12 h-12 mx-auto text-brand-primary/20 mb-4" />
          <p className="text-brand-secondary/40 font-medium">No logs yet. Start your first harvest!</p>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {logs.map((log) => (
            <div key={log.id}>
              <Card className="p-5 flex items-center gap-5 group">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95">
                  <Droplets className="w-7 h-7 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-lg leading-none">JG-{log.timestamp?.toDate().getFullYear() || '2026'}-WI-{log.id.slice(0, 3).toUpperCase()}</h4>
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Scale className="w-3 h-3" />
                      <span className="text-sm">{log.quantity}kg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <p className="text-[12px] font-bold text-brand-secondary/40 uppercase tracking-tighter">{log.floralSource}</p>
                     <Badge variant={log.grade === 'A' ? 'emerald' : log.grade === 'B' ? 'amber' : 'zinc'}>
                      Grade {log.grade}
                     </Badge>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAddModal && <AddHarvestModal profile={profile} onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AddHarvestModal({ profile, onClose }: { profile: UserProfile | null, onClose: () => void }) {
  const [weight, setWeight] = useState('');
  const [source, setSource] = useState('Wildflower');
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const sources = ['Coffee Blossom', 'Wildflower', 'Neem', 'Eucalyptus'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !weight) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'harvests'), {
        hunterId: profile.uid,
        hunterName: profile.name,
        quantity: parseFloat(weight),
        floralSource: source,
        location: profile.location || 'Western Ghats',
        grade: 'U', // Uncharted by default
        timestamp: serverTimestamp(),
      });

      // Update total stock
      await updateDoc(doc(db, 'users', profile.uid), {
        totalHarvested: increment(parseFloat(weight))
      });

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 bg-brand-secondary/40 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl overflow-hidden relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
          <X className="w-5 h-5 text-zinc-500" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Plus className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-serif font-bold text-brand-secondary">{t('logs.add_harvest')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-4 block">{t('logs.quantity')}</label>
            <input 
              type="number" 
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.0" 
              className="w-full text-5xl font-bold bg-transparent border-b-2 border-amber-100 focus:border-amber-500 outline-none pb-4"
              required
              autoFocus
            />
          </div>

          <div>
             <label className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-4 block">{t('logs.floral')}</label>
             <div className="flex flex-wrap gap-2">
                {sources.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className={cn(
                      "px-5 py-3 rounded-2xl text-sm font-bold transition-all",
                      source === s ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-zinc-50 text-zinc-400"
                    )}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-500" />
             </div>
             <div>
                <p className="text-[8px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">LOCATION (GPS)</p>
                <p className="text-sm font-bold text-brand-secondary">{profile?.location || 'Manual required'}</p>
             </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-200 text-amber-800 hover:bg-amber-300 disabled:opacity-50 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-colors"
          >
            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <SaveIcon className="w-6 h-6" />}
            {t('logs.save')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
