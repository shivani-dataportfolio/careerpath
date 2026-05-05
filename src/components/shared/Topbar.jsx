import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Upload, X, CheckCircle, BrainCircuit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Topbar = () => {
    const { user, logout } = useAuth();
    const { analysisResult, recommendations } = useCareer();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const searchRef = useRef(null);
    const notifRef = useRef(null);
    const userRef = useRef(null);

    const userName = user?.name || 'User';
    const userInitials = userName.split(' ').map(n => n?.[0] || '').join('').toUpperCase().slice(0, 2);

    // Dynamic search across roles and skills
    const allItems = [
        { label: 'Upload Resume', path: '/dashboard/upload', type: 'Page' },
        { label: 'Career Paths', path: '/dashboard/career', type: 'Page' },
        { label: 'My Profile', path: '/dashboard/profile', type: 'Page' },
        { label: 'Select Job Role', path: '/dashboard/select-role', type: 'Page' },
        ...(recommendations || []).map(r => ({ label: r.title, path: '/dashboard/career', type: 'Role', score: r.match_score })),
        ...(analysisResult?.candidate?.skills || []).map(s => ({ label: s, path: '/dashboard/career', type: 'Skill' })),
    ];

    useEffect(() => {
        if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
        const q = searchQuery.toLowerCase();
        setSearchResults(allItems.filter(i => i.label.toLowerCase().includes(q)).slice(0, 6));
    }, [searchQuery, recommendations, analysisResult]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
            if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Notifications - dynamic based on analysis state
    const notifications = [
        analysisResult ? { icon: CheckCircle, color: 'text-green-500', title: 'Resume Analyzed', desc: `${analysisResult?.candidate?.skills?.length || 0} skills detected · Top: ${analysisResult?.dashboard?.top_role}`, time: 'Today' } : null,
        { icon: BrainCircuit, color: 'text-indigo-500', title: 'AI Career Insight', desc: 'Software Engineering demand is up 28% this quarter.', time: '2h ago' },
        { icon: Upload, color: 'text-blue-500', title: 'Tip: Update your resume', desc: 'Keep your analysis fresh for better recommendations.', time: 'Daily' },
    ].filter(Boolean);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search */}
            <div className="flex-1 max-w-xl" ref={searchRef}>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search skills, roles, pages..."
                        className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border-transparent border focus:border-primary-200 focus:bg-white rounded-xl outline-none transition-all text-sm"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
                        onFocus={() => setShowSearch(true)}
                    />
                    {searchQuery && (
                        <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                            <X size={14} />
                        </button>
                    )}
                    {showSearch && searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                            {searchResults.map((r, i) => (
                                <button key={i} onClick={() => { navigate(r.path); setShowSearch(false); setSearchQuery(''); }}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{r.label}</p>
                                        {r.score && <p className="text-xs text-primary-500 font-bold">{r.score}% match</p>}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full">{r.type}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 relative transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    {showNotif && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-slate-50">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Notifications</p>
                            </div>
                            {notifications.map((n, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                                    <n.icon size={18} className={`mt-0.5 shrink-0 ${n.color}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">{n.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{n.desc}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-300 font-bold shrink-0">{n.time}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-slate-100"></div>

                {/* User Dropdown */}
                <div className="relative" ref={userRef}>
                    <button onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
                        className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                            {userInitials}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{userName}</p>
                            <p className="text-xs text-slate-500 font-medium">{user?.role || 'Professional Account'}</p>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${showUser ? 'rotate-180' : ''}`} />
                    </button>
                    {showUser && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                            <div className="p-3 border-b border-slate-50">
                                <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
                                <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{user?.role}</p>
                            </div>
                            <Link to="/dashboard/profile" onClick={() => setShowUser(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                <User size={16} className="text-slate-400" /> My Profile
                            </Link>
                            <Link to="/dashboard/upload" onClick={() => setShowUser(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                <Upload size={16} className="text-slate-400" /> Upload Resume
                            </Link>
                            <div className="border-t border-slate-50"></div>
                            <button onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
