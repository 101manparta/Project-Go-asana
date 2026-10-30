import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useStudio();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    error: <AlertCircle className="w-4 h-4 text-red-600" />,
    info: <Info className="w-4 h-4 text-blue-600" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel rounded-2xl p-4 shadow-xl border border-black/10 flex items-center gap-3 max-w-md bg-white/95">
        <div className="shrink-0">{icons[toastMessage.type]}</div>
        <p className="text-xs text-neutral-800 font-medium leading-snug">
          {toastMessage.text}
        </p>
      </div>
    </div>
  );
};
