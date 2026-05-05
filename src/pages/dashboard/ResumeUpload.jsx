import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload, Check, FileText, BrainCircuit, GraduationCap, Briefcase, ArrowRight, AlertCircle, TrendingUp, Target, BookOpen, DollarSign } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

const ResumeUpload = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { isAnalyzing, analyzeResume, analysisResult, saveAnalysis, setAnalysisResult } = useCareer();
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];
            
            if (!allowedTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
                setError('Please upload a PDF, Word, or Text file.');
                return;
            }
            setSelectedFile(file);
            setError(null);
            setAnalysisResult(null);
            try {
                await analyzeResume(file);
            } catch (err) {
                console.error('Auto-analysis error:', err);
                const message = err.response?.data?.detail || err.message || 'Analysis failed.';
                setError(`Analysis Error: ${message}`);
            }
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const onAnalyze = async () => {
        if (!selectedFile) return;
        try {
            setError(null);
            await analyzeResume(selectedFile);
        } catch (err) {
            console.error('Analysis error:', err);
            const detail = err.response?.data?.detail;
            const step = err.response?.data?.step;
            const message = detail ? `${detail}${step ? ` (at ${step})` : ''}` : (err.message || 'Analysis failed. Please ensure the backend server is running.');
            setError(`Analysis Error: ${message}`);
        }
    };

    const onSaveAndContinue = async () => {
        try {
            setError(null);
            await saveAnalysis();
            navigate('/dashboard/career');
        } catch (err) {
            console.error('Save error:', err);
            const message = err.response?.data?.detail || err.message || 'Failed to save profile.';
            setError(`Save Error: ${message}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">Career Intelligence Engine</h1>
                <p className="text-slate-500">Real-time AI analysis of your skills, role matching, and market positioning.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-1">
                    <Card className="h-full border-2 border-dashed border-primary-100 bg-primary-50/5 p-8 text-center group transition-all hover:border-primary-400 sticky top-24">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-20 h-20 rounded-3xl bg-white shadow-premium flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                                {isAnalyzing ? (
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                                ) : (
                                    <Upload size={40} />
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 mb-2 truncate max-w-full">
                                {selectedFile ? selectedFile.name : 'Upload PDF'}
                            </h2>
                            <p className="text-[10px] text-slate-500 mb-8 px-4 font-medium uppercase tracking-wider">
                                Max size 10MB • PDF, DOC, TXT
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                <Button size="lg" className="rounded-2xl" onClick={handleBrowseClick} disabled={isAnalyzing}>
                                    {selectedFile ? 'Change File' : 'Select PDF'}
                                </Button>
                                {selectedFile && !analysisResult && (
                                    <Button
                                        variant="primary"
                                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                                        onClick={onAnalyze}
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? 'Extracting...' : 'Start AI Analysis'}
                                    </Button>
                                )}
                            </div>
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 animate-in fade-in duration-300">
                                    <AlertCircle size={14} className="shrink-0" />
                                    <p className="text-[10px] font-bold text-left leading-tight">{error}</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-3 space-y-6">
                    {!analysisResult ? (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] border border-slate-100 p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-200 mb-6 font-black text-4xl">?</div>
                            <h3 className="text-xl font-bold text-slate-400">Awaiting Intelligence</h3>
                            <p className="text-slate-400 max-w-xs mt-3 text-sm leading-relaxed">
                                Upload your resume to generate a complete career dashboard with match scores and skill gaps.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
                            {/* Dashboard Header Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="p-5 border-none shadow-soft bg-white">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Skills Found</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-amber-600">{analysisResult.dashboard?.skills_identified}</span>
                                        <BrainCircuit size={16} className="text-amber-400" />
                                    </div>
                                </Card>
                                <Card className="p-5 border-none shadow-soft bg-white">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience Info</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-emerald-600">{analysisResult.candidate?.experience} Yrs</span>
                                        <Briefcase size={16} className="text-emerald-400" />
                                    </div>
                                </Card>
                                <Card className="p-5 border-none shadow-soft bg-white">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Analysis Date</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-slate-700">{analysisResult.dashboard?.last_analysis}</span>
                                    </div>
                                </Card>
                            </div>

                            {/* Candidate Summary */}
                            <Card className="border-none shadow-premium bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 relative overflow-hidden">
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h2 className="text-3xl font-black mb-1">{analysisResult.candidate?.name}</h2>
                                        <p className="text-indigo-300 font-bold mb-4">{analysisResult.candidate?.email}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.candidate?.skills?.slice(0, 8).map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold backdrop-blur-md">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                                            <p className="font-bold text-lg text-white">{analysisResult.candidate?.experience} Years</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</p>
                                            <p className="font-bold text-sm text-indigo-100">{analysisResult.candidate?.education}</p>
                                        </div>
                                    </div>
                                </div>
                                <FileText className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5" />
                            </Card>

                            {/* Market Insights & Skill Gap */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-6 border-none shadow-soft bg-white flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800">Market Insights</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary & Demand</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6 flex-grow">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Avg. Salary Range</p>
                                            <p className="text-xl font-black text-indigo-600 font-mono tracking-tighter">{analysisResult.job_market?.salary_range}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 text-center">Market Demand</p>
                                                <div className={`py-2 rounded-xl text-center text-xs font-black uppercase ${
                                                    analysisResult.job_market?.demand === 'High' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {analysisResult.job_market?.demand}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 text-center">Top Platforms</p>
                                                <div className="flex gap-2 justify-center">
                                                    {analysisResult.job_market?.platforms?.map((p, i) => (
                                                        <span key={i} className="text-[9px] font-black bg-slate-100 p-2 rounded-lg">{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 border-none shadow-soft bg-slate-50 flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                            <Target size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800">Skill Gap Analysis</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Priority Focus Area</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 flex-grow">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Focus Skills to Gain</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.skill_gap_analysis?.missing_skills?.slice(0, 3).map((s, i) => (
                                                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold">-{typeof s === 'object' ? (s.name || s.skill) : s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">AI Strategy</p>
                                            <p className="text-xs text-slate-600 leading-relaxed font-bold">
                                                {analysisResult.skill_gap_analysis?.learning_focus}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Learning Path */}
                            <Card className="p-8 border-none shadow-premium bg-white">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">Learning Path for {analysisResult.dashboard?.top_role || 'Target Role'}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Recommended Resources</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Coursera</span>
                                        <ul className="space-y-3">
                                            {analysisResult.learning_path?.coursera?.map((course, i) => (
                                                <li key={i} className="flex gap-2 items-start group">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                                    <a 
                                                        href={course.url} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                                                    >
                                                        {course.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Udemy</span>
                                        <ul className="space-y-3">
                                            {analysisResult.learning_path?.udemy?.map((course, i) => (
                                                <li key={i} className="flex gap-2 items-start group">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                                    <a 
                                                        href={course.url} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                                                    >
                                                        {course.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">edX</span>
                                        <ul className="space-y-3">
                                            {analysisResult.learning_path?.edx?.map((course, i) => (
                                                <li key={i} className="flex gap-2 items-start group">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                                    <a 
                                                        href={course.url} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                                                    >
                                                        {course.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>

                            {/* Top Matching Roles (Grid) */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                        <Target size={24} className="text-primary-600" />
                                        Advanced Role Matching
                                    </h3>
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">Top 4 Matches</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analysisResult.roles?.slice(0, 4).sort((a, b) => b.match_score - a.match_score).map((role, idx) => (
                                        <Card key={idx} className="p-6 bg-white border-2 border-slate-50 hover:border-indigo-100 transition-all hover:shadow-xl hover:-translate-y-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-2xl font-black text-slate-800 leading-none">{role.match_score}%</span>
                                                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1">Match Score</span>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black text-slate-800 mb-2">{role.role}</h4>
                                            <p className="text-[11px] text-slate-500 min-h-[40px] mb-6 leading-relaxed font-medium">
                                                {role.reason}
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <span>Matched Skills</span>
                                                    <span className="text-indigo-600">{role.matched_count}/{role.total_skills}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 line-clamp-1">
                                                    {role.matched_skills?.slice(0, 3).map((s, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-bold uppercase">{typeof s === 'object' ? (s.name || s.skill) : s}</span>
                                                    ))}
                                                    {role.missing_skills?.length > 0 && (
                                                        <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[8px] font-bold uppercase">+{role.missing_skills.length} gaps</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                                <div className="relative z-10 text-center max-w-2xl mx-auto">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-4">Final Recommendation</p>
                                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                                        Secure your <span className="text-indigo-300">future</span> Today.
                                    </h2>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        {analysisResult.dashboard?.is_locked ? (
                                            <div className="flex items-center gap-3 px-8 py-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white font-black uppercase tracking-widest text-sm">
                                                <Lock size={20} /> Target Role Locked
                                            </div>
                                        ) : (
                                            <Button size="xl" className="bg-white text-indigo-700 hover:bg-slate-100 rounded-2xl h-16 px-12 font-black shadow-2xl shadow-indigo-900 group" onClick={onSaveAndContinue}>
                                                Save My Profile & Explore
                                                <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <BrainCircuit className="absolute -left-20 -bottom-20 w-80 h-80 opacity-10 rotate-12" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
