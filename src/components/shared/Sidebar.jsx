import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    User,
    FileUp,
    ChevronRight,
    LayoutGrid,
    Sparkles
} from 'lucide-react';
import { cn } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const menuItems = [

    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileUp, label: 'Upload Resume', path: '/dashboard/upload' },
    { icon: Briefcase, label: 'Career Paths', path: '/dashboard/career' },
    { icon: LayoutGrid, label: 'Select Job Role', path: '/dashboard/select-role' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

const Sidebar = () => {
    const { user } = useAuth();
    
    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 z-50 overflow-y-auto">
            <div className="p-8">
                {/* Custom PathAI Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)'}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17L9 11L13 15L21 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 7H21V11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="9" cy="11" r="1.5" fill="white"/>
                            <circle cx="13" cy="15" r="1.5" fill="white"/>
                        </svg>
                    </div>
                    <div>
                        <span className="text-lg font-black tracking-tight text-slate-800">Path<span style={{background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>AI</span></span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">Career Intelligence</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? 'nav-link-active' : 'nav-link'
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>
            </div>

            {user?.role !== 'Professional Account' && (
                <div className="absolute bottom-8 left-8 right-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pro Plan</p>
                        <p className="text-sm text-slate-600 mb-3">Upgrade for 10+ more AI recommendations.</p>
                        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">Explore Upgrade</button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
