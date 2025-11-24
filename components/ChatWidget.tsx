import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { ChatMessage, Law } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatWidgetProps {
    currentContextLaw?: Law | null;
    forceOpen?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ currentContextLaw, forceOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'ai', text: 'Hola, soy tu asesor legal con IA. ¿En qué puedo ayudarte hoy?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Context Notification when law changes
  useEffect(() => {
    if (currentContextLaw && isOpen) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'ai',
            text: `Veo que estás revisando: "${currentContextLaw.title}". ¿Tienes dudas específicas sobre esta normativa?`,
            timestamp: new Date()
        }]);
    }
  }, [currentContextLaw, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Pass context string if a law is selected
    const contextString = currentContextLaw 
        ? `Norma: ${currentContextLaw.title}. Resumen: ${currentContextLaw.description}. Impacto: ${currentContextLaw.impactLevel}.` 
        : undefined;

    const responseText = await sendChatMessage(history, userMsg.text, contextString);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[90vw] md:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in font-sans">
          
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                <Bot size={20} className="text-indigo-100" />
              </div>
              <div>
                <h3 className="font-bold text-sm">LegiBot AI</h3>
                {currentContextLaw ? (
                    <p className="text-[10px] text-indigo-200 flex items-center gap-1 max-w-[200px] truncate">
                        <BookOpen size={10} />
                        {currentContextLaw.title}
                    </p>
                ) : (
                    <p className="text-xs text-indigo-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        En línea
                    </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'ai' ? 'bg-white text-indigo-600 border border-slate-100' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.role === 'ai' ? <Sparkles size={14} /> : <User size={14} />}
                </div>
                <div className={`
                  max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-white border border-slate-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-200"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-14 w-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group ring-4 ring-indigo-50"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

export default ChatWidget;
