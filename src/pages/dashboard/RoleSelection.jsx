import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Briefcase, ChevronRight, LayoutGrid, Database, Cloud, Code, LineChart } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

const RoleSelection = () => {
    const navigate = useNavigate();
    const { recommendations, fetchRecommendations, analysisResult } = useCareer();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const getIcon = (field) => {
        const f = field.toLowerCase();
        if (f.includes('web') || f.includes('systems')) return <Code size={24} />;
        if (f.includes('data') || f.includes('analytics')) return <Database size={24} />;
        if (f.includes('infrastructure') || f.includes('cloud')) return <Cloud size={24} />;
        if (f.includes('ai') || f.includes('ml')) return <LayoutGrid size={24} />;
        return <Briefcase size={24} />;
    };

    if (!analysisResult) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                    <Briefcase size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Please analyze your resume first</h2>
                <p className="text-slate-500 max-w-sm mt-2">Upload your resume to see how well you match with these roles.</p>
                <Button size="lg" className="rounded-2xl px-8 mt-8" onClick={() => navigate('/dashboard/upload')}>
                    Upload Resume
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Select Your Target Role</h1>
                <p className="text-slate-500 italic font-medium">Browse our core job roles and see where you fit best.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((role) => (
                    <Card key={role.id} className="group hover:shadow-premium transition-all duration-300 border-none bg-white cursor-pointer" onClick={() => navigate(`/dashboard/role/${role.id}`)}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                    {getIcon(role.field)}
                                </div>
                                <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                    {role.field}
                                </div>
                            </div>
                            <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{role.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-slate-400 group-hover:text-primary-500 transition-colors">
                                <span className="text-sm font-semibold">View Requirements</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RoleSelection;
