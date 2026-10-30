import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sliders, 
  Info,
  Compass
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AIChatMessage, YogaClass } from '../types';

interface AIYogaAssistantProps {
  navigate: (route: string) => void;
}

export const AIYogaAssistant: React.FC<AIYogaAssistantProps> = ({ navigate }) => {
  const { openBookingModal, sessions, classes } = useStudio();
  const { user } = useAuth();

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Namaste${user ? ` ${user.displayName.split(' ')[0]}` : ''}. I am your ASANA Wellness Guide for ASANA-Yoga.\n\nTell me how your mind and body are feeling today—are you looking to de-stress, build gentle flexibility, break a sweat, or find a beginner-friendly class?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);

  // User preferences
  const [prefLevel, setPrefLevel] = useState<string>('All Levels');
  const [prefGoal, setPrefGoal] = useState<string>('Stress Reduction');
  const [prefDuration, setPrefDuration] = useState<number>(60);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    "I'm brand new to yoga, what beginner class should I start with?",
    "I have stiff shoulders and lower back fatigue from desk work.",
    "Show me sound bath or restorative sessions available tonight.",
    "Which instructor teaches high-energy Vinyasa flow?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await api.sendAiChat(
        [...messages, userMessage]
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { experienceLevel: prefLevel, goal: prefGoal, duration: prefDuration }
      );

      const assistantMessage: AIChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: response.recommendedClasses && response.recommendedClasses.length > 0 ? {
          type: 'class_card',
          data: response.recommendedClasses
        } : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI chat failed:', err);
      const errorMessage: AIChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, my connection to the studio knowledge base was momentarily disrupted. Please feel free to browse our full schedule or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Conversation refreshed. How can I support your practice today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-medium text-neutral-900">
                ASANA Wellness Guide
              </h1>
              <p className="text-xs text-neutral-500">
                Personalized class discovery &amp; mindful movement guidance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreferenceModal(true)}
            className="px-3.5 py-1.5 rounded-full border border-black/10 text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences ({prefLevel})</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-full border border-black/10 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3 bg-neutral-100/70 border border-black/5 rounded-2xl flex items-start gap-2.5 text-[11px] text-neutral-600">
        <ShieldAlert className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
        <span>
          <strong>Wellness Notice:</strong> The ASANA Wellness Guide offers studio scheduling and movement discovery recommendations. It does not provide medical diagnoses or physical therapy. Consult a physician for acute injuries.
        </span>
      </div>

      {/* Main Conversation Container */}
      <div className="glass-panel rounded-3xl border border-black/8 overflow-hidden flex flex-col h-[560px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-1">
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-200" />
                  </div>
                )}

                <div className={`space-y-3 max-w-xl ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-neutral-900 text-white rounded-tr-xs'
                        : 'bg-white border border-black/8 text-neutral-900 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Render Structured Recommended Class Cards if returned */}
                  {msg.structuredData?.data && Array.isArray(msg.structuredData.data) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {msg.structuredData.data.map((c: YogaClass) => {
                        // find upcoming session for this class
                        const session = sessions.find(s => s.classId === c.id && s.status === 'SCHEDULED');

                        return (
                          <div
                            key={c.id}
                            className="bg-white rounded-2xl p-3.5 border border-black/10 shadow-xs flex flex-col justify-between space-y-3"
                          >
                            <div>
                              <div className="flex justify-between items-center text-[10px] text-neutral-500">
                                <span>{c.style}</span>
                                <span className="font-semibold text-neutral-900">
                                  ${(c.price / 100).toFixed(2)}
                                </span>
                              </div>
                              <h4 className="font-serif font-semibold text-xs text-neutral-900 mt-1">
                                {c.title}
                              </h4>
                              <p className="text-[11px] text-neutral-600 line-clamp-2 mt-1">
                                {c.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-black/5">
                              <button
                                onClick={() => navigate(`/classes/${c.id}`)}
                                className="text-[11px] text-neutral-700 hover:underline"
                              >
                                View Details
                              </button>
                              {session && (
                                <button
                                  onClick={() => openBookingModal(session)}
                                  className="px-3 py-1 rounded-full bg-neutral-950 text-white text-[11px] font-medium hover:bg-neutral-800"
                                >
                                  Book Mat
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span className="text-[10px] text-neutral-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-neutral-500">
              <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5 text-neutral-300 animate-pulse" />
              </div>
              <div className="glass-panel px-4 py-2.5 rounded-2xl border border-black/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-neutral-500 ml-1">Consulting studio schedule...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick starter chips */}
        <div className="p-3 bg-neutral-50/80 border-t border-black/5 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-neutral-400 shrink-0 font-medium">Quick ideas:</span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 rounded-full bg-white border border-black/8 hover:border-black/20 text-neutral-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <div className="p-4 bg-white border-t border-black/8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask about classes, instructors, stress relief, or schedule..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-full bg-neutral-100 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 border border-black/10 focus:outline-none focus:border-neutral-900"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-3 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Preferences Modal */}
      {showPreferenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-black/10 shadow-2xl space-y-5 text-neutral-900">
            <div>
              <h3 className="text-lg font-serif font-medium">Practice Preferences</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Adjust these settings to tailor AI recommendations.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'All Levels', 'Intermediate'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPrefLevel(lvl)}
                      className={`py-2 rounded-xl border text-center ${
                        prefLevel === lvl ? 'bg-neutral-900 text-white border-neutral-900 font-medium' : 'border-black/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Primary Intention</label>
                <select
                  value={prefGoal}
                  onChange={(e) => setPrefGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/10 bg-white"
                >
                  <option value="Stress Reduction">Stress Reduction &amp; Nervous System Reset</option>
                  <option value="Flexibility">Spinal Flexibility &amp; Joint Opening</option>
                  <option value="Strength">Dynamic Strength &amp; Core Stamina</option>
                  <option value="Breathwork">Pranayama Breathwork &amp; Energy</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPreferenceModal(false)}
                className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
