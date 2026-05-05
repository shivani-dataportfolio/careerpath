import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TrendingUp, Award, Clock, ArrowRight, BrainCircuit, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';

const Home = () => {
    const { user } = useAuth();
    const { recommendations, analysisResult } = useCareer();

    // Resolve meaningful values from analysisResult
    const skillCount = analysisResult?.candidate?.skills?.length
        || analysisResult?.skills?.length
        || analysisResult?.dashboard?.skills_identified
        || 0;

    const topRole = analysisResult?.dashboard?.top_role
        || recommendations?.[0]?.title
        || '--';

    const isLocked = analysisResult?.dashboard?.is_locked || false;
    const lastAnalysis = analysisResult?.dashboard?.last_analysis || analysisResult?.last_analysis;
    const topRoles = analysisResult?.dashboard?.top_roles || [];
    const hasData = !!analysisResult;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name || 'Explorer'}! 👋</h1>
                    <p className="text-slate-500">Here's your real-time AI career mapping overview.</p>
                </div>
                <Link to="/dashboard/upload">
                    <Button className="rounded-2xl shadow-xl shadow-primary-100 h-14 px-8">
                        {hasData ? 'Update Resume' : 'Analyze Resume'} <ArrowRight size={18} className="ml-2" />
                    </Button>
                </Link>
            </div>

            {/* Career Market Insights */}
            <Card className="border-none shadow-premium bg-white overflow-hidden p-0">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Career Market Pulse</CardTitle>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Live Demand Intelligence · Q2 2025</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black tracking-widest">
                            <TrendingUp size={12} /> UP 12.4%
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Avg Tech Salary', value: '$115k', sub: '+8% YoY', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Open Tech Roles', value: '2.4M+', sub: 'Globally', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'AI/ML Demand', value: '↑ 41%', sub: 'YoY growth', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Remote Jobs', value: '58%', sub: 'Of listings', color: 'text-orange-600', bg: 'bg-orange-50' },
                        ].map((item, i) => (
                            <div key={i} className={`p-4 rounded-2xl ${item.bg}`}>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-50 pt-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hottest Roles Right Now</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { role: 'AI/ML Engineer', growth: '+41%' },
                                { role: 'Full Stack Dev', growth: '+28%' },
                                { role: 'Data Scientist', growth: '+35%' },
                                { role: 'DevOps/Cloud', growth: '+22%' },
                                { role: 'Cybersecurity', growth: '+31%' },
                                { role: 'Product Manager', growth: '+18%' },
                            ].map((r, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-700">{r.role}</span>
                                    <span className="text-[10px] font-black text-emerald-500">{r.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:translate-y-[-4px] transition-transform duration-300 border-none shadow-soft bg-white">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 font-bold ${isLocked ? 'bg-indigo-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        {isLocked ? <Lock size={24} /> : <BrainCircuit size={24} />}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {isLocked ? 'Target Locked' : 'Top Alignment'}
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 truncate" title={topRole}>
                        {topRole}
                    </h3>
                </Card>

                <Card className="hover:translate-y-[-4px] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-bold">
                        <Award size={24} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skills Identified</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        {skillCount > 0 ? `${skillCount} Skills` : hasData ? '0 Skills' : '--'}
                    </h3>
                </Card>

                <Card className="hover:translate-y-[-4px] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 font-bold">
                        <Clock size={24} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Analysis</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        {lastAnalysis || (hasData ? 'Today' : '--')}
                    </h3>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Roles Panel */}
                <Card className="h-full border-none shadow-premium bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Top Recommended Roles</CardTitle>
                        {hasData && (
                            <Link to="/dashboard/career" className="text-xs font-bold text-primary-600 hover:underline">View All</Link>
                        )}
                    </CardHeader>
                    <CardContent>
                        {hasData ? (
                            <div className="space-y-4">
                                {(topRoles.length > 0 ? topRoles : recommendations.slice(0, 3)).map((job, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                                                <BrainCircuit size={16} />
                                            </div>
                                            <p className="font-bold text-slate-800">{job.role || job.title}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-primary-600 border border-slate-100">
                                            {job.match_score}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-center">
                                <Zap size={32} className="text-slate-200 mb-3" />
                                <p className="text-slate-400 text-sm font-medium">Upload your resume to get started</p>
                                <Link to="/dashboard/upload">
                                    <Button className="mt-4 rounded-xl h-10 px-6 text-sm">Analyze Now</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Career Assessment Panel */}
                <Card className="h-full border-none shadow-premium bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Career Progress Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-50 rounded-[2rem] text-center p-8">
                        {hasData ? (
                            <div className="space-y-4 w-full">
                                <div className="text-primary-600 mx-auto w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                                    <Award size={24} />
                                </div>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed line-clamp-4 italic">
                                    "{analysisResult?.assessment || `Strong profile identified for ${topRole}. ${skillCount} skills matched.`}"
                                </p>
                                {analysisResult?.job_market?.salary_range && (
                                    <div className="mt-2 px-4 py-2 bg-green-50 rounded-xl">
                                        <p className="text-xs font-bold text-green-600">Est. Salary Range</p>
                                        <p className="text-sm font-bold text-slate-800">{analysisResult.job_market.salary_range}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-slate-300 font-bold mb-2 uppercase tracking-widest text-xs">Waiting for Analysis</p>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">Unlock detailed skill analytics by uploading your resume.</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Home;

