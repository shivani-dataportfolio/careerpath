import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Topbar from '../components/shared/Topbar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#F9FBFC]">
            <Sidebar />
            <div className="pl-72 flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
