import React, { useState } from 'react';
import { Send, Brain, Bot, Lightbulb, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const AdminAiCopilot: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: 'Provide an executive summary of studio health and low-enrollment classes today.',
      a: '**Executive Operational Telemetry:**\n\n• **Occupancy Rate:** The studio is currently maintaining a **72% aggregate mat occupancy** across weekly sessions.\n• **Low Enrollment Alert:** 2 session(s) scheduled this weekend currently sit under 35% capacity. Suggested Action: Trigger an in-app spotlight or feature the slots on the public homepage.\n• **Peak Modalities:** *Yin & Sacred Sound Sanctuary* and *ASANA Solar Flow* are approaching 90% seat reservation capacity. Consider opening a Tuesday evening second slot.\n• **Cancellation Metric:** Current cancellation rate remains steady at ~6%, well below the industry 10% threshold.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const starterQueries = [
    'Analyze weekend schedule for low enrollment spots and suggest remedies',
    'Draft a 60-word serene description for a new Candlelight Yoga Nidra class',
    'How is our cancellation rate trending this month compared to bookings?',
    'Suggest schedule adjustments to optimize instructor utilization'
  ];

  const handleAsk = async (textToSend?: string) => {
    const text = textToSend || prompt;
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setPrompt('');

    try {
      const res = await api.askAdminCopilot(text);
      setCopilotHistory(prev => [
        ...prev,
        {
          q: text,
          a: res.result,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error('Copilot error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/10">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-medium text-white">
                ASANA-Yoga Operations Copilot
              </h1>
              <p className="text-xs text-neutral-400">
                Authorized strategic advisor grounded in live studio attendance, occupancy, and booking metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Strategy Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {starterQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => handleAsk(q)}
            className="p-3 rounded-xl bg-neutral-800/60 border border-white/10 hover:border-white/20 text-left text-xs text-neutral-300 hover:text-white transition-colors flex items-start gap-2.5 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>&ldquo;{q}&rdquo;</span>
          </button>
        ))}
      </div>

      {/* Copilot Q&A Stream */}
      <div className="bg-neutral-800/40 border border-white/10 rounded-2xl p-6 space-y-6 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-6 overflow-y-auto max-h-[500px]">
          {copilotHistory.map((item, idx) => (
            <div key={idx} className="space-y-3 text-xs">
              {/* Question */}
              <div className="flex justify-end">
                <div className="bg-neutral-700 text-white rounded-2xl rounded-tr-xs p-3.5 max-w-xl">
                  {item.q}
                </div>
              </div>

              {/* Answer */}
              <div className="flex items-start gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-neutral-900 border border-white/10 text-neutral-200 rounded-2xl rounded-tl-xs p-4 max-w-2xl leading-relaxed whitespace-pre-line shadow-xs">
                  {item.a}
                  <span className="text-[10px] text-neutral-500 block mt-2 font-mono">
                    Grounded in database &bull; {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <Bot className="w-4 h-4 text-neutral-200 animate-pulse" />
              <span>Analyzing studio data and formulating strategic recommendations...</span>
            </div>
          )}
        </div>

        {/* Ask Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="pt-4 border-t border-white/10 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask Copilot about occupancy rates, low enrollment, marketing descriptions..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 disabled:bg-neutral-700 disabled:text-neutral-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate Analysis</span>
          </button>
        </form>
      </div>

    </div>
  );
};
