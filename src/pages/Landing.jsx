import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { BrainCircuit, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';

const Landing = () => {
    const howItWorksRef = useRef(null);

    const scrollToHowItWorks = () => {
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-200">
                        <BrainCircuit size={24} />
                    </div>
                    <span className="text-xl font-bold text-slate-900">PathAI</span>
                </div>
                <div className="flex items-center gap-8">
                    <button onClick={scrollToHowItWorks} className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">How it works</button>
                    <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">Login</Link>
                    <Link to="/register">
                        <Button size="sm" className="rounded-xl px-6">Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-50/50 rounded-full blur-[120px] -z-10 opacity-50"></div>

                <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary-50 text-primary-700 rounded-full text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 border border-primary-100/50 shadow-sm">
                    <Zap size={14} /> <span>New: Transformer-based skill mapping is live!</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.1] max-w-4xl mx-auto tracking-tight">
                    Scale your career with <span className="gradient-text">AI-Powered</span> precision.
                </h1>

                <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                    Upload your resume and let our advanced NLP models identify your skill gaps and map out your perfect career path based on 5M+ industry data points.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/login">
                        <Button size="lg" className="rounded-2xl px-12 h-16 text-lg shadow-2xl shadow-primary-200 group">
                            Get Started <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="rounded-2xl px-12 h-16 text-lg border-slate-200" onClick={scrollToHowItWorks}>
                        Watch Features
                    </Button>
                </div>
            </section>

            {/* How it Works Section */}
            <section ref={howItWorksRef} className="px-8 py-32 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">How it Works</h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">Three simple steps to bridge your skill gap and find your dream role.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { step: '01', title: 'Upload Resume', desc: 'Securely upload your PDF. Our AI parses skills, education, and career experience instantly.', icon: CheckCircle2 },
                        { step: '02', title: 'Get Analysis', desc: 'Visualize your expertise across 50+ dimensions with radar charts and AI assessments.', icon: Shield },
                        { step: '03', title: 'Path Mapping', desc: 'Receive custom career paths and step-by-step learning guides to reach your goals.', icon: Zap }
                    ].map((item, idx) => (
                        <div key={idx} className="relative p-10 bg-slate-50 rounded-[2.5rem] group transition-all hover:bg-white hover:shadow-premium hover:-translate-y-2">
                            <span className="absolute top-8 right-10 text-6xl font-black text-slate-200/50 group-hover:text-primary-100 transition-colors leading-none">{item.step}</span>
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center text-primary-600 mb-8">
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust Section */}
            <section className="px-8 py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Built by Career Experts & AI Researchers</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">
                            Our platform combines deep learning models with career coaching frameworks to provide recommendations that are not just accurate, but actionable.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">U{i}</div>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Used by 10,000+ professionals</p>
                                <p className="text-xs text-slate-500">Scale your career with confidence.</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-md p-8 bg-white rounded-[2rem] shadow-premium border border-slate-100">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                    <CheckCircle2 size={12} />
                                </div>
                                <p className="text-sm font-bold text-slate-700">98% Accuracy in Skill Extraction</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                    <CheckCircle2 size={12} />
                                </div>
                                <p className="text-sm font-bold text-slate-700">Real-time Job Market Alignment</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                    <CheckCircle2 size={12} />
                                </div>
                                <p className="text-sm font-bold text-slate-700">Personalized Learning Paths</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-8 py-12 border-t border-slate-100 max-w-7xl mx-auto text-center mt-20">
                <p className="text-sm text-slate-400 font-bold tracking-widest uppercase">© 2026 PathAI Intelligence. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
