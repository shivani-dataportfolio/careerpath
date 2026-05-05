import React, { createContext, useContext, useState, useEffect } from 'react';
import { careerService } from '../services/api';
import { useAuth } from './AuthContext';

const CareerContext = createContext();

export const CareerProvider = ({ children }) => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [skillGap, setSkillGap] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const { user } = useAuth();

    // Ensure clean state on fresh load, reload, or logout
    useEffect(() => {
        if (!user) {
            // Clear React state on logout
            setAnalysisResult(null);
            setRecommendations([]);
            setSkillGap(null);
            setSelectedRole(null);
            
            // Clear any local/session storage if it was ever stored
            localStorage.removeItem('resumeData');
            sessionStorage.removeItem('resumeData');
        } else {
            // On fresh login/reload, do NOT auto-load old data.
            // Explicitly ensure a clean slate until the user uploads or fetches.
            setAnalysisResult(null);
            setRecommendations([]);
            setSkillGap(null);
            setSelectedRole(null);
        }
    }, [user]);

    const loadSavedAnalysis = async () => {
        try {
            const { data } = await careerService.getProfile();
            // The profile includes candidate, dashboard, roles, etc.
            // Reconstruct as analysisResult if these keys exist
            if (data?.candidate || data?.dashboard) {
                setAnalysisResult({
                    candidate: data.candidate || {},
                    dashboard: data.dashboard || {},
                    roles: data.roles || [],
                    skills: data.candidate?.skills || [],
                    assessment: data.candidate?.name ? `Strong candidate profile for ${data.dashboard?.top_role || 'multiple roles'}. Last analyzed: ${data.last_analysis || 'Today'}.` : null,
                    skill_gap_analysis: data.skill_gap_analysis || {},
                    job_market: data.job_market || {},
                    learning_path: data.learning_path || {}
                });
            }
        } catch (err) {
            // Silently fail — user simply hasn't uploaded a resume yet
            console.log('No saved analysis found yet.');
        }
    };

    const analyzeResume = async (file) => {
        setAnalysisResult(null);
        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const { data } = await careerService.analyzeResume(formData);
            setAnalysisResult(data);
            // After analysis, refresh recommendations
            fetchRecommendations();
            return data;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const saveAnalysis = async () => {
        if (!analysisResult) return;
        await careerService.saveResumeData(analysisResult);
    };

    const fetchRecommendations = async () => {
        try {
            const { data } = await careerService.getRecommendations();
            setRecommendations(data);
        } catch (err) {
            console.log('Could not fetch recommendations:', err.message);
        }
    };

    const fetchSkillGap = async (roleId) => {
        setSkillGap(null); // Clear stale data immediately
        try {
            const { data } = await careerService.getSkillGap(roleId);
            setSkillGap(data);
        } catch (err) {
            console.error('Failed to fetch skill gap:', err);
            // Optionally set an error state here, but clearing it prevents showing wrong data
        }
    };

    const selectRole = async (roleId) => {
        const { data } = await careerService.selectUserRole(roleId);
        setSelectedRole(data.selected_role_id);
    };

    return (
        <CareerContext.Provider value={{
            analysisResult,
            setAnalysisResult,
            recommendations,
            skillGap,
            isAnalyzing,
            analyzeResume,
            saveAnalysis,
            fetchRecommendations,
            loadSavedAnalysis,
            fetchSkillGap,
            selectedRole,
            selectRole
        }}>
            {children}
        </CareerContext.Provider>
    );
};

export const useCareer = () => useContext(CareerContext);
