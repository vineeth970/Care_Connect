import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Bot, User } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Doctor. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize Speech Recognition using browser's built-in APIs
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' : '') + transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Speech recognition failed. Please ensure microphone access is granted.");
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Failed to start speech recognition:", e);
        }
      } else {
        toast.error("Voice input is not supported in your browser.");
      }
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech so they don't overlap
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to set a friendly English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      // Typical doctor-like tempo (calm)
      utterance.rate = 1.0; 
      utterance.pitch = 1.0; 
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // System prompt to constrain the AI's personality
      const systemPrompt = {
        role: "system",
        content: "You are a professional, empathetic, and knowledgeable AI doctor assistant for the CareConnect platform. You give brief, helpful medical information, and remind users to seek professional help for emergencies. Limit your responses to 3-5 short sentences for conversational clarity."
      };
      
      // Formatting messages for Groq integration
      const apiMessages = [systemPrompt, ...messages.map(m => ({ role: m.role, content: m.content })), userMessage];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Updated to current available model
          messages: apiMessages,
          temperature: 0.6,
        })
      });

      if (!response.ok) {
        throw new Error(`API response error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponseContent = data.choices[0]?.message?.content || "I'm having trouble understanding right now.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseContent }]);
      
      // Read aloud the response automatically
      speak(aiResponseContent);

    } catch (error) {
      console.error("Error communicating with AI:", error);
      toast.error("Failed to get a response from the AI Doctor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col border border-gray-100 transition-all duration-300 ease-in-out" style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1.5 rounded-full text-blue-600 shadow-sm">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Doctor Assistant</h3>
                <p className="text-xs text-blue-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-1"></span>
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1 rounded-md"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm flex gap-2.5 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'
                }`}>
                  {msg.role === 'assistant' && (
                    <Bot size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                  )}
                  <span className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</span>
                  {msg.role === 'user' && (
                    <User size={16} className="mt-0.5 flex-shrink-0 text-blue-200" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm rounded-bl-none flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListen}
                className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
                  isListening 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isListening ? "Stop listening" : "Start speaking"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message AI Doctor..."
                className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all"
              />
              
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl shadow-blue-500/40 transition-all hover:scale-110 flex items-center justify-center group relative animate-bounce"
        >
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
          <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}
