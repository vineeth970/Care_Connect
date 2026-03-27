import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Heart, Activity, ArrowRight } from 'lucide-react';
import AIScanAnalyzer from '../components/AIScanAnalyzer';

const Home = () => {
  return (
    <div className="space-y-32 pb-32 gradient-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-brand-50 text-brand-700 px-6 py-2.5 rounded-full text-sm font-bold mb-10 shadow-sm border border-brand-100/50">
            <Sparkles className="h-4 w-4" />
            <span>Redefining Healthcare Management</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tight">
            Your Health, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Elevated.</span>
          </h1>
          <p className="mt-10 text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
            Experience a seamless connection between patients and providers through our state-of-the-art medical ecosystem.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/register"
              className="px-10 py-5 bg-brand-600 text-white rounded-2xl font-black text-lg hover:bg-brand-700 transition-all shadow-2xl shadow-brand-200 flex items-center group active:scale-95"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:ml-4 transition-all" />
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 glass text-slate-700 rounded-2xl font-black text-lg hover:bg-white transition-all active:scale-95 border border-slate-200/50"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 -left-20 h-96 w-96 bg-brand-100/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 h-96 w-96 bg-indigo-100/40 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            icon: Heart,
            title: "Expert Care",
            desc: "Connect with board-certified specialists who prioritize your wellbeing.",
            color: "text-rose-500",
            bg: "bg-rose-50"
          },
          {
            icon: Activity,
            title: "Instant Insights",
            desc: "Track your prescriptions and appointments with real-time digital sync.",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
          },
          {
            icon: Shield,
            title: "Private & Secure",
            desc: "Enterprise-grade encryption for all your sensitive medical data.",
            color: "text-brand-500",
            bg: "bg-brand-50"
          }
        ].map((feature, idx) => (
          <div key={idx} className="p-10 glass rounded-[2.5rem] hover:translate-y-[-8px] transition-all group cursor-default">
            <div className={`h-16 w-16 ${feature.bg} flex items-center justify-center rounded-2xl mb-8 group-hover:rotate-[15deg] transition-transform shadow-sm`}>
              <feature.icon className={`h-8 w-8 ${feature.color}`} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* AI Scan Analyzer Integration */}
      <section className="px-4">
        <AIScanAnalyzer />
      </section>

      {/* Hero Mockup Area */}
      <section className="max-w-6xl mx-auto px-4 mt-16 text-center">
        <div className="relative p-4 bg-white shadow-premium rounded-[3.5rem] border border-slate-100/50">
          <div className="glass rounded-[2.8rem] overflow-hidden aspect-video flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-50/50 to-white/50">
             <div className="relative">
                <div className="absolute inset-0 bg-brand-400 blur-[80px] opacity-20 animate-pulse"></div>
                <Shield className="h-32 w-32 text-brand-600 relative z-10 opacity-30" />
             </div>
             <h4 className="mt-10 text-4xl font-black text-slate-200 tracking-tighter uppercase italic">Secure Dashboard</h4>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
