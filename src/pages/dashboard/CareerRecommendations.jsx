import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Briefcase, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCareer } from '../../context/CareerContext';

const CareerRecommendations = () => {
    const { recommendations, fetchRecommendations, analysisResult } = useCareer();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (!analysisResult) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                    <Briefcase size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">No profile data found</h2>
                <p className="text-slate-500 max-w-sm mt-2">Please upload and analyze your resume first to get personalized AI career recommendations.</p>
                <Link to="/dashboard/upload" className="mt-8">
                    <Button size="lg" className="rounded-2xl px-8">Upload Resume</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Career Recommendations</h1>
                <p className="text-slate-500">Based on your extracted skills and experience, we've mapped these high-growth career paths.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.length > 0 ? (
                    recommendations.map((job) => (
                        <Card key={job.id} className="group hover:shadow-premium transition-all duration-300 border-none bg-white">
                            <CardHeader className="pb-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                        <Briefcase size={24} />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                                        <TrendingUp size={12} /> {job.match_score}% Match
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-800">{job.title}</CardTitle>
                                <p className="text-sm text-slate-400 font-medium mt-1">{job.field}</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Key Required Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(job.requiredSkills || job.required_skills || []).map((skill, sIdx) => (
                                            <span key={sIdx} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100 transition-colors hover:bg-primary-50 hover:text-primary-700 hover:border-primary-100">
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Link to={`/dashboard/role/${job.id}`} state={{ targetRole: job }}>
                                    <Button variant="outline" className="w-full rounded-xl group/btn hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all font-bold">
                                        Skill Gap Analysis <ChevronRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-slate-500 font-medium">Fetching AI recommendations...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerRecommendations;
