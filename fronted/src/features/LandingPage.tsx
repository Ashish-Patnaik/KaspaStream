import React, { useState, useEffect } from 'react';
import { 
  Zap, ArrowRight, Wallet, ShieldCheck, Globe, Coins, 
  TrendingUp, CheckCircle2, Sparkles, Rocket, 
  Star, Menu, X, Cpu, Clock 
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Changed background to a Warm Cream (#fff5f0)
    <div className="min-h-screen bg-[#fff5f0] text-black font-sans selection:bg-[#bef264] selection:text-black overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#fff5f0]/90 backdrop-blur-md border-b-4 border-black py-2 shadow-md' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <img 
                src="/logo.png" 
                alt="KaspaStream" 
                className="w-12 h-12 object-contain filter drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:scale-110 group-hover:drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all duration-200" 
              />
              <span className="font-black text-2xl tracking-tight">
                Kaspa<span className="text-[#a78bfa]">Stream</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['How it works', 'Features', 'Stats'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '')}`} className="font-bold text-lg hover:underline decoration-4 underline-offset-4 decoration-[#f472b6] transition-all">
                  {item}
                </a>
              ))}
              <button
                onClick={onEnterApp}
                className="bg-[#22d3ee] border-3 border-black px-6 py-2 rounded-xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Start Earning
              </button>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#fff5f0] border-b-4 border-black p-4 flex flex-col gap-4 shadow-xl">
            {['How it works', 'Features', 'Stats'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '')}`} className="font-black text-xl">{item}</a>
            ))}
            <button onClick={onEnterApp} className="w-full bg-[#bef264] border-3 border-black p-3 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Login
            </button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#f472b6] rounded-full border-4 border-black opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-[5%] w-72 h-72 bg-[#22d3ee] rounded-full border-4 border-black opacity-10 blur-3xl animate-pulse delay-700"></div>
        
        {/* --- FLOATING COINS (Enhanced) --- */}
        
        {/* 1. Large Top Left */}
        <div className="absolute top-32 left-[5%] rotate-[-12deg] animate-float duration-[6000ms] hidden md:block">
           <img src="/coin.png" alt="Coin" className="w-24 h-24 filter drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]" />
        </div>

        {/* 2. Medium Top Right */}
        <div className="absolute top-40 right-[10%] rotate-[12deg] animate-float-delayed duration-[5000ms] hidden md:block">
           <img src="/coin.png" alt="Coin" className="w-20 h-20 filter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]" />
        </div>

        {/* 3. Huge Bottom Right */}
        <div className="absolute bottom-10 right-[5%] rotate-[-6deg] animate-bounce duration-[4000ms] hidden lg:block">
           <img src="/coin.png" alt="Coin" className="w-32 h-32 filter drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]" />
        </div>

        {/* 4. Small Bottom Left */}
        <div className="absolute bottom-32 left-[15%] rotate-[45deg] animate-spin-slow duration-[10000ms] hidden lg:block">
           <img src="/coin.png" alt="Coin" className="w-12 h-12 filter drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]" />
        </div>

        {/* 5. Tiny Top Center */}
        <div className="absolute top-24 left-[45%] animate-float duration-[7000ms] hidden md:block opacity-80">
           <img src="/logo.png" alt="Coin" className="w-8 h-8 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
        </div>


        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border-3 border-black px-6 py-2 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-black text-sm tracking-wide">LIVE ON KASPA MAINNET</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-8 text-black">
            WORK ON THE <br />
            <span className="relative inline-block px-4">
              <span className="absolute inset-0 bg-[#bef264] border-4 border-black transform -rotate-2 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></span>
              <span className="relative text-black">FASTEST</span>
            </span>
            <br /> BLOCKCHAIN
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-slate-700 max-w-3xl mx-auto mb-12 leading-relaxed">
            Complete micro-tasks, get verified by AI, and receive 
            <span className="mx-2 bg-[#22d3ee] px-2 border-2 border-black rounded-md text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">instant</span> 
            KAS payments. No middlemen. No waiting.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onEnterApp}
              className="group relative px-8 py-5 bg-black text-white text-xl font-black rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#bef264] hover:shadow-[12px_12px_0px_0px_#bef264] hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              Start Earning Now
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={onEnterApp}
              className="px-8 py-5 bg-white text-black text-xl font-black rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              Create a Task
            </button>
          </div>

          {/* Social Proof Stack */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="flex -space-x-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-3 border-black flex items-center justify-center font-bold text-sm bg-white shadow-sm z-${10-i}`}>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*555}`} 
                    alt="avatar" 
                    className="w-full h-full rounded-full"
                  />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-[#fde68a] text-black" />)}
              </div>
              <p className="font-bold text-sm">Trusted by 1,200+ earners</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE SECTION --- */}
      <div className="border-y-4 border-black bg-[#f472b6] overflow-hidden py-4 rotate-[-1deg] scale-105 z-20 relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="text-3xl font-black text-white stroke-black" style={{WebkitTextStroke: "2px black"}}>INSTANT PAYOUTS</span>
              <img src="/logo.png" alt="coin" className="w-8 h-8 ml-8 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
              <span className="text-3xl font-black text-white stroke-black" style={{WebkitTextStroke: "2px black"}}>ZERO GAS FEES</span>
              <img src="/logo.png" alt="coin" className="w-8 h-8 ml-8 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            </div>
          ))}
        </div>
      </div>

      {/* --- HOW IT WORKS SECTION (New) --- */}
      <section id="howitworks" className="py-24 px-4 bg-[#fff5f0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-4">
              HOW IT <span className="bg-[#22d3ee] px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">WORKS</span>
            </h2>
            <p className="text-2xl font-bold text-gray-600">Start earning crypto in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Connect Wallet', 
                desc: 'Link your Kaspa wallet instantly. No registration, no passwords.',
                color: 'bg-[#fde68a]',
                icon: Wallet
              },
              { 
                step: '02', 
                title: 'Complete Task', 
                desc: 'Pick a task you like. AI verification checks your work in real-time.',
                color: 'bg-[#f472b6]',
                icon: Sparkles
              },
              { 
                step: '03', 
                title: 'Get Paid', 
                desc: 'Funds are sent directly to your wallet via Kaspa network.',
                color: 'bg-[#bef264]',
                icon: CheckCircle2
              }
            ].map((card, i) => (
               <div key={i} className={`relative ${card.color} border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all`}>
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black border-4 border-white shadow-lg">
                    {card.step}
                  </div>
                  <div className="mt-6 mb-4">
                     <card.icon className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-3xl font-black mb-2">{card.title}</h3>
                  <p className="text-lg font-bold opacity-80 leading-relaxed">{card.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-24 px-4 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-16">
            WHY <span className="bg-[#bef264] px-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2">KASPASTREAM?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Speed */}
            <div className="md:col-span-2 bg-[#fde68a] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-[#bef264]" fill="#bef264" />
                </div>
                <h3 className="text-4xl font-black mb-4">Blazing Fast Payouts</h3>
                <p className="text-xl font-bold opacity-80 max-w-lg">
                  Leveraging Kaspa's DAG technology, payments settle in under 1 second. 
                </p>
              </div>
            </div>

            {/* Card 2: Fees */}
            <div className="bg-[#a78bfa] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center mb-6">
                <Coins className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-3xl font-black mb-4">Zero Gas Fees</h3>
              <p className="text-lg font-bold opacity-80">
                Keep 100% of your earnings. 
              </p>
            </div>

            {/* Card 3: AI */}
            <div className="bg-[#22d3ee] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-[#22d3ee]" />
              </div>
              <h3 className="text-3xl font-black mb-4">AI Verification</h3>
              <p className="text-lg font-bold opacity-80">
                Automated quality control means you get approved instantly.
              </p>
            </div>

            {/* Card 4: Global */}
            <div className="md:col-span-2 bg-[#f472b6] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-4xl font-black mb-4">Work From Anywhere</h3>
                <p className="text-xl font-bold opacity-80">
                  Borderless payments. Access the global economy without restrictions.
                </p>
              </div>
              <div className="w-48 h-48 bg-black rounded-full border-4 border-white flex items-center justify-center animate-spin-slow">
                <Globe className="h-24 w-24 text-[#f472b6]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (Updated) --- */}
      <section id="stats" className="py-24 border-t-4 border-black bg-[#a78bfa] relative overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px'}}></div>
         
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-16 text-white text-shadow-black">
             PLATFORM STATS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'TPS', value: '300+', icon: Zap },
              { label: 'Pay Time', value: '<1s', icon: Clock },
              { label: 'Fees', value: '$0', icon: Coins },
              { label: 'Uptime', value: '100%', icon: Cpu }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform">
                <div className="flex justify-center mb-4">
                   <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl md:text-6xl font-black mb-2">{stat.value}</div>
                <div className="text-lg font-black uppercase tracking-widest text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-16 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
               <img 
                src="/logo.png" 
                alt="KaspaStream" 
                className="w-10 h-10 object-contain filter drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]" 
              />
              <span className="font-black text-3xl">KaspaStream</span>
            </div>
            
            <div className="flex gap-8">
              {[
                { name: 'Twitter', url: 'https://x.com/ashdebugs' },
                { name: 'Discord', url: 'https://discord.gg/lucky_2806' },
                { name: 'GitHub', url: 'https://github.com/Ashish-Patnaik/KaspaStream' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-[#bef264] hover:underline decoration-4 underline-offset-4 transition-all"
                >
                  {social.name}
                </a>
              ))}
            </div>
            
            <p className="font-bold text-gray-400">© 2026 Built on Kaspa.</p>
          </div>
        </div>
      </footer>

      {/* --- CSS FOR ANIMATIONS --- */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-20px) rotate(-12deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-15px) rotate(12deg); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        .text-shadow-black {
          text-shadow: 4px 4px 0px #000;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;