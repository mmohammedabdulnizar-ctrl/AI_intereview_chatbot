import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Award, ChevronRight, Mail, LogOut } from 'lucide-react';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [track, setTrack] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll for chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = (e) => {
    e.preventDefault();
    if (name && email && track) {
      setIsStarted(true);
      
      // Personalized intro based on the new tracks
      let introContent = `Welcome ${name}! I am your AI Interviewer for the ${track} track. `;
      if (track === "Manual Testing") introContent += "We'll focus on test cases, bug life cycles, and SDLC today.";
      else if (track === "QA Automation") introContent += "I'll be asking about Selenium, framework architecture, and scripting.";
      else if (track === "GenAI Engineer") introContent += "Let's dive into LLMs, prompt engineering, and RAG architectures.";
      else introContent += "Let's begin the technical assessment.";

      setMessages([{
        role: 'assistant',
        content: introContent + " To start, can you describe your experience with this role?"
      }]);
    }
  };

  const handleLogout = () => {
    setIsStarted(false);
    setName('');
    setEmail('');
    setTrack('');
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Simulated AI Response logic
    setTimeout(() => {
      setMessages([...newMessages, {
        role: 'assistant',
        content: "That's a solid explanation. Can you give me a specific scenario where you had to solve a high-priority challenge in this field?"
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Award className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Interview Pro</span>
          </div>
          
          {isStarted && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1"><User className="w-4 h-4"/> {name}</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{track}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        
        {!isStarted ? (
          /* --- LOGIN VIEW --- */
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Assessment Portal</h1>
                <p className="text-slate-500 font-medium">Select your track to begin</p>
              </div>

              <form onSubmit={handleStart} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800 placeholder-slate-400"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800 placeholder-slate-400"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Interview Track</label>
                  <select 
                    required value={track} onChange={(e) => setTrack(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800 appearance-none font-medium"
                  >
                    <option value="">Select your track</option>
                    <option value="Manual Testing">Manual Testing</option>
                    <option value="QA Automation">QA Automation</option>
                    <option value="GenAI Engineer">GenAI Engineer</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Interview
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* --- PROFESSIONAL FOOTER --- */}
            <footer className="mt-16 pb-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-slate-200 w-full"></div>
                <span className="text-blue-600 font-serif italic text-lg whitespace-nowrap px-2">
                  Practice Makes Perfect
                </span>
                <div className="h-px bg-slate-200 w-full"></div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                This AI Interview Portal is designed to simulate real-world technical assessments 
                powered by Google Gemini.
              </p>

              <div className="pt-6 border-t border-slate-200/60">
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-3">
                  Support & Feature Enquiries
                </p>
                <a 
                  href="mailto:mmohammedabdulnizar@gmail.com" 
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-semibold transition-colors decoration-blue-200 underline-offset-4"
                >
                  <Mail className="w-4 h-4" />
                  mmohammedabdulnizar@gmail.com
                </a>
              </div>
            </footer>
          </div>
        ) : (
          /* --- INTERVIEW CHAT VIEW --- */
          <div className="w-full max-w-4xl h-[75vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-white">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}>
                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                className="flex-grow px-6 py-4 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none shadow-inner bg-white"
              />
              <button type="submit" className="bg-blue-600 p-4 rounded-xl text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;