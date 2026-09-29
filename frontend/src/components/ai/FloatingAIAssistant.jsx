import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Camera } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Bonjour! I am Veyora AI, your personal luxury fashion concierge. Looking for outfit styling, size advice, or occasion recommendations?'
    }
  ]);
  const [input, setInput] = useState('');
  const { addToast } = useToast();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiReply = "I recommend pairing our Structured Taupe Blazer with High-Rise Wide-Leg Trousers and Suede Loafers for an effortless quiet luxury aesthetic.";
      
      if (userText.toLowerCase().includes('size')) {
        aiReply = "Our silk column dresses run true to size. If you prefer a relaxed drape, we suggest ordering one size up!";
      } else if (userText.toLowerCase().includes('return')) {
        aiReply = "Veyora provides complimentary 7-day doorstep pickup returns and instant exchange for any size issues!";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#1C1917] text-[#FAF7F2] rounded-full shadow-elevated border border-[#C5A059] hover:bg-[#8C6D46] transition-all group"
        >
          <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Ask AI Concierge</span>
        </button>
      ) : (
        <div className="bg-[#FAF7F2] w-80 sm:w-96 rounded-2xl shadow-elevated border border-[#E8E1D5] overflow-hidden flex flex-col h-[450px] animate-slide-up">
          
          {/* Header */}
          <div className="p-4 bg-[#1C1917] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <div>
                <h4 className="font-serif font-bold text-sm">Veyora AI Concierge</h4>
                <span className="text-[10px] text-[#A8A095]">Active · Ready to assist</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick AI Trigger Buttons */}
          <div className="p-2 bg-[#F9ECE6] border-b border-[#E8E1D5] flex gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent('open-ai-stylist'));
              }}
              className="flex-1 py-1.5 px-2 bg-white rounded text-[11px] font-bold text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors border border-[#E8E1D5] flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#8C6D46]" /> AI Stylist
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent('open-find-look'));
              }}
              className="flex-1 py-1.5 px-2 bg-white rounded text-[11px] font-bold text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors border border-[#E8E1D5] flex items-center justify-center gap-1"
            >
              <Camera className="w-3 h-3 text-[#8C6D46]" /> Find Look
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1C1917] text-white rounded-br-none'
                      : 'bg-white border border-[#E8E1D5] text-[#1C1917] shadow-soft rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E8E1D5] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about styling, sizes, fabrics..."
              className="w-full text-xs text-[#1C1917] focus:outline-none bg-transparent px-2"
            />
            <button type="submit" className="p-2 bg-[#1C1917] text-white rounded-lg hover:bg-[#8C6D46] transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
