import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { ChatMessage, Law } from '@/types';
import { sendChatMessage } from '@/services/geminiService';

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
        <div className="pointer-events-auto mb-4 w-[90vw] md:w-[400px] h-[550px] bg-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-fade-in font-sans">
          
          <div className="bg-legitech-primary p-4 flex justify-between items-center text-white shrink-0 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                <Bot size={20} className="text-legitech-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm">LegiBot AI</h3>
                {currentContextLaw ? (
                    <p className="text-[10px] text-slate-300 flex items-center gap-1 max-w-[200px] truncate">
                        <BookOpen size={10} />
                        {currentContextLaw.title}
                    </p>
                ) : (
                    <p className="text-xs text-slate-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-legitech-accent rounded-full"></span>
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

          <div className="flex-1 bg-slate-950 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'ai' ? 'bg-slate-800 text-legitech-accent border border-white/10' : 'bg-legitech-primary text-white'
                }`}>
                  {msg.role === 'ai' ? <Sparkles size={14} /> : <User size={14} />}
                </div>
                <div className={`
                  max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-legitech-primary text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 text-legitech-accent flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-slate-800 border border-white/5 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-legitech-accent rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-legitech-accent rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-legitech-accent rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-legitech-accent/50 focus:outline-none transition text-white placeholder:text-slate-600"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-legitech-accent text-slate-900 rounded-xl hover:bg-legitech-accentHover disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-legitech-accent/20"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-14 w-14 bg-legitech-accent text-slate-900 rounded-full shadow-2xl shadow-legitech-accent/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group ring-4 ring-legitech-accent/20"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

export default ChatWidget;
