import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Mail, Shield, LogOut, Settings, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { useCareer } from '../../context/CareerContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const { analysisResult, loadSavedAnalysis, isAnalyzing: isFetchingData } = useCareer();
    const [githubUser, setGithubUser] = React.useState('');
    const [githubData, setGithubData] = React.useState(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [error, setError] = React.useState(null);

    if (!user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
                    <p className="text-slate-500">Manage your persona and professional identity.</p>
                </div>
                <Button variant="outline" className="rounded-xl border-red-100 text-red-600 hover:bg-red-50" onClick={logout}>
                    <LogOut size={18} className="mr-2" /> Sign Out
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 p-8 text-center bg-white shadow-premium border-none">
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 rounded-3xl bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold shadow-soft">
                            {(user?.name || 'U').charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center text-white">
                            <Shield size={14} />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{user?.name || 'User'}</h2>
                    <p className="text-sm text-slate-400 font-medium mb-6 uppercase tracking-widest">{user?.role || 'Professional'}</p>
                    <Button variant="outline" size="sm" className="w-full rounded-xl">Edit Details</Button>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-soft border-none">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
                                    <p className="text-slate-700 font-semibold">{user?.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Award size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Member Since</p>
                                    <p className="text-slate-700 font-semibold">{user.joined_date || 'January 2026'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
                        <CardHeader className="border-b border-white/10">
                            <CardTitle className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={16} className="text-primary-400" /> GitHub Repository Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8 pb-10">
                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <input 
                                    type="text" 
                                    placeholder="Enter GitHub Username" 
                                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                                    value={githubUser}
                                    onChange={(e) => setGithubUser(e.target.value)}
                                />
                                <Button 
                                    className="rounded-2xl h-14 px-8 bg-primary-600 hover:bg-primary-500 border-none"
                                    disabled={isAnalyzing || !githubUser}
                                    onClick={async () => {
                                        if (!githubUser) return;
                                        setIsAnalyzing(true);
                                        setError(null);
                                        try {
                                            const res = await fetch(`http://localhost:8001/api/github/${githubUser}`);
                                            const data = await res.json();
                                            if (!res.ok) throw new Error(data.error || 'Failed to analyze');
                                            setGithubData(data);
                                        } catch (err) {
                                            console.error(err);
                                            setError(err.message);
                                        } finally {
                                            setIsAnalyzing(false);
                                        }
                                    }}
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze Repos'}
                                </Button>
                            </div>
                            
                            {error && (
                                <p className="text-red-400 text-xs font-bold mb-4 animate-in fade-in">{error}</p>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Top Languages</p>
                                    <p className="text-sm font-bold text-primary-300">
                                        {githubData?.topLanguages || 'Ready to analyze'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Repo Count</p>
                                    <p className="text-sm font-bold text-primary-300">
                                        {githubData ? `${githubData.repos} Repositories` : '0 Repositories'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Code Quality</p>
                                    <p className="text-sm font-bold text-green-400">
                                        {githubData?.qualityScore || 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {githubData?.detectedSkills?.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Derived Multi-Domain Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {githubData.detectedSkills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-indigo-200 backdrop-blur-md">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-none">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resume Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                                <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-50">
                                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">AI Assessment</p>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                        {analysisResult?.assessment || analysisResult?.skill_gap_analysis?.learning_focus || 'No assessment available. Upload a resume to generate your AI profile.'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Education</p>
                                        <p className="text-sm text-slate-800 font-bold">{analysisResult?.candidate?.education || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                                        <p className="text-sm text-slate-800 font-bold">{analysisResult?.candidate?.experience ? `${analysisResult.candidate.experience} Years` : 'N/A'}</p>
                                    </div>
                                </div>

                                {!analysisResult && (
                                    <div className="mt-4 pt-4 border-t border-slate-50">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full text-[10px] font-bold uppercase tracking-widest text-primary-600 border-primary-100 hover:bg-primary-50"
                                            onClick={loadSavedAnalysis}
                                            disabled={isFetchingData}
                                        >
                                            {isFetchingData ? 'Loading...' : 'Load Previous Analysis Results'}
                                        </Button>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-none">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Saved Skill Set</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-2">
                                {analysisResult?.candidate?.skills && analysisResult.candidate.skills.length > 0 ? analysisResult.candidate.skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white text-primary-700 rounded-lg text-xs font-bold border border-primary-100 shadow-sm transition-transform hover:-translate-y-0.5">
                                        {skill}
                                    </span>
                                )) : (
                                    <p className="text-sm text-slate-400 italic">No skills saved yet. Upload your resume or load previous data.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
