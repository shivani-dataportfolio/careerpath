import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Target,
    BookOpen,
    Award,
    TrendingUp,
    Lock,
    Unlock,
    Briefcase,
    ExternalLink,
    MapPin,
    Building2,
    Sparkles,
    Info,
    Zap,
    Cpu,
    Library,
    Wrench,
    Lightbulb
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

const RoleDetails = () => {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const { 
        skillGap, 
        fetchSkillGap, 
        recommendations, 
        fetchRecommendations, 
        analysisResult, 
        selectedRole, 
        selectRole 
    } = useCareer();
    const [role, setRole] = useState(null);
    const [isLocking, setIsLocking] = useState(false);

    useEffect(() => {
        if (roleId) {
            fetchSkillGap(roleId);
            if (recommendations.length === 0) {
                fetchRecommendations();
            }
        }
    }, [roleId]);

    useEffect(() => {
        if (roleId && recommendations.length > 0) {
            const foundRole = recommendations.find(r => r.id == roleId || r.roleId == roleId);
            setRole(foundRole);
        }
    }, [roleId, recommendations]);

    if (!analysisResult) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold text-slate-800">Please analyze your resume first</h2>
                <Link to="/dashboard/upload" className="mt-8">
                    <Button size="lg" className="rounded-2xl">Go to Upload</Button>
                </Link>
            </div>
        );
    }

    // Calculate match stats (Backend now provides isMatched)
    const totalSkills = skillGap?.chartData?.length || 0;
    const matchedCount = skillGap?.chartData?.filter(s => s.isMatched).length || 0;
    const matchPercentage = totalSkills > 0 ? Math.round((matchedCount / totalSkills) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl hover:bg-slate-100"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </Button>

                <div className="ml-auto">
                    {selectedRole == roleId ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 font-bold text-sm">
                                <Lock size={16} /> Target Role Locked
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                onClick={async () => {
                                    setIsLocking(true);
                                    await selectRole(null);
                                    setIsLocking(false);
                                }}
                                disabled={isLocking}
                            >
                                {isLocking ? '...' : <Unlock size={16} />}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold flex gap-2 items-center"
                            onClick={async () => {
                                setIsLocking(true);
                                await selectRole(roleId);
                                setIsLocking(false);
                            }}
                            disabled={isLocking}
                        >
                            {isLocking ? 'Locking...' : <><Unlock size={16} /> Set as Target Role</>}
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {role?.field || 'Career Path'}
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900">{role?.title || skillGap?.role || 'Role Details'}</h1>
                    <div className="bg-primary-50/50 border border-primary-100 p-4 rounded-2xl mt-4 max-w-2xl">
                        <p className="text-slate-700 text-sm font-medium leading-relaxed italic">
                            " {skillGap?.reason || role?.reason || 'Analyzing role compatibility based on your profile...'} "
                        </p>
                    </div>
                </div>

                <Card className="border-none shadow-soft bg-white px-8 py-6 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-2">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-slate-100"
                                strokeDasharray="100, 100"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="transparent"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-primary-600"
                                strokeDasharray={`${matchPercentage}, 100`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-black text-slate-800">{matchPercentage}%</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Readiness Score</span>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 border-none shadow-premium bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-50 pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Skill Requirements</CardTitle>
                                    <p className="text-xs text-slate-400 font-medium">{matchedCount} of {totalSkills} skills matched</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {skillGap?.chartData?.map((skill, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-2xl border transition-all ${skill.isMatched
                                        ? 'bg-green-50/30 border-green-100 hover:border-green-300'
                                        : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{skill.skill}</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Award size={12} className="text-primary-400" />
                                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-tighter">
                                                    {skill.level} Required
                                                </span>
                                            </div>
                                        </div>
                                        {skill.isMatched ? (
                                            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-100">
                                                <CheckCircle2 size={18} />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                                                <XCircle size={18} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${skill.isMatched ? 'bg-green-500' : 'bg-slate-300'}`}
                                                style={{ width: skill.isMatched ? '100%' : '20%' }}
                                            ></div>
                                        </div>
                                        <span className={`text-[10px] font-bold ${skill.isMatched ? 'text-green-600' : 'text-slate-400'}`}>
                                            {skill.isMatched ? 'MATCHED' : 'GAP'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    {/* Market Insights */}
                    <Card className="border-none shadow-premium bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Market Insights</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Average Salary</p>
                                    <p className="text-2xl font-black">{skillGap?.marketInsights?.salary || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Location</p>
                                    <p className="text-lg font-bold max-w-[120px] truncate" title={skillGap?.candidateLocation || 'Remote'}>{skillGap?.candidateLocation || 'Remote'}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Market Trend</p>
                                    <p className="text-lg font-bold">{skillGap?.marketInsights?.trend || 'Stable'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Open Positions</p>
                                    <p className="text-lg font-bold">{skillGap?.marketInsights?.openings || 'High Demand'}</p>
                                </div>
                            </div>
                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={14} className="text-yellow-300" />
                                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Personalized Discovery</p>
                                    </div>
                                    
                                    {/* Real Job Items (If Backend Ready) */}
                                    {skillGap?.recommendedJobs?.length > 0 && (
                                        <div className="space-y-3 mb-6">
                                            {skillGap.recommendedJobs.map((job, idx) => (
                                                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-sm text-white">{job.title}</h4>
                                                        <span className="text-[8px] font-black bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 uppercase tracking-tighter">
                                                            {job.match}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 text-[10px] text-white/50 mb-4">
                                                        <div className="flex items-center gap-1">
                                                            <Building2 size={10} /> {job.company}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin size={10} /> {job.location}
                                                        </div>
                                                    </div>
                                                    <a href={job.link} target="_blank" rel="noreferrer">
                                                        <Button className="w-full bg-white text-indigo-700 hover:bg-white/90 text-[10px] font-black h-8 rounded-lg uppercase">
                                                            Apply Now
                                                        </Button>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Prominent Platform Buttons (Restored as requested) */}
                                    <div className="flex flex-row gap-2">
                                        <a 
                                            href={skillGap?.dynamicJobLinks?.find(l => l.platform === 'LinkedIn')?.url || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent((role?.title || skillGap?.role || ''))}&location=${encodeURIComponent(skillGap?.candidateLocation || 'Worldwide')}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full bg-[#0A66C2]/40 border-white/30 hover:bg-[#0A66C2]/60 text-white text-xs font-black py-3 h-auto flex gap-2 items-center justify-center rounded-xl shadow-lg shadow-black/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                                LinkedIn
                                            </Button>
                                        </a>
                                        <a 
                                            href={skillGap?.dynamicJobLinks?.find(l => l.platform === 'Indeed')?.url || `https://www.indeed.com/jobs?q=${encodeURIComponent((role?.title || skillGap?.role || ''))}&l=${encodeURIComponent(skillGap?.candidateLocation || '')}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full bg-[#2164f4]/40 border-white/30 hover:bg-[#2164f4]/60 text-white text-xs font-black py-3 h-auto flex gap-2 items-center justify-center rounded-xl shadow-lg shadow-black/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.167 3.518H24v17.067h-4.833V3.518zM0 13.91h4.833v6.675H0zM14.07 8.083c-1.42 0-2.61.85-3.107 2.062v-1.921H6.131v12.361h4.833v-5.597c0-1.558 1.155-2.825 2.62-2.825h.105c1.465 0 2.433 1.258 2.433 2.825v5.597h4.834v-6.355c0-3.415-2.316-6.147-5.5-6.147h-.06zM6.98 5.7c0 1.54 1.25 2.793 2.793 2.793s2.793-1.25 2.793-2.792c0-1.543-1.253-2.793-2.793-2.793S6.98 4.157 6.98 5.7z"/></svg>
                                                Indeed
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                        </div>
                    </Card>

                    {/* Learning Paths */}
                    <Card className="border-none shadow-premium bg-white p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Learning Path</h3>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                            {skillGap?.learningResources?.length > 0 ? (
                                skillGap.learningResources.map((res, i) => {
                                    let platformColor = "text-primary-600";
                                    let bgHover = "group-hover:bg-primary-50/30";
                                    let borderHover = "group-hover:border-primary-200";
                                    if (res.platform === "Coursera") { platformColor = "text-blue-600"; bgHover = "group-hover:bg-blue-50/30"; borderHover = "group-hover:border-blue-200"; }
                                    if (res.platform === "Udemy") { platformColor = "text-purple-600"; bgHover = "group-hover:bg-purple-50/30"; borderHover = "group-hover:border-purple-200"; }
                                    if (res.platform === "edX") { platformColor = "text-red-500"; bgHover = "group-hover:bg-red-50/30"; borderHover = "group-hover:border-red-200"; }

                                    return (
                                        <a key={i} href={res.link} target="_blank" rel="noreferrer" className="block group">
                                            <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all ${bgHover} ${borderHover}`}>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${platformColor}`}>{res.platform}</p>
                                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-slate-900">{res.title}</h4>
                                                <div className={`flex items-center text-xs mt-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity ${platformColor}`}>
                                                    Start Learning <ChevronRight size={14} className="ml-1" />
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-slate-400">Custom learning path being generated...</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RoleDetails;
