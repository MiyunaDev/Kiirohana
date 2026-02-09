// MainLayout.jsx
import { FaBook, FaHistory, FaSearch, FaCog } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router';

import { useState } from 'react';

const navItems = [
    { to: "/app/library", icon: <FaBook size={18} />, label: "Library" },
    { to: "/app/history", icon: <FaHistory size={18} />, label: "History" },
    { to: "/app/browse", icon: <FaSearch size={18} />, label: "Browse" },
    { to: "/app/settings", icon: <FaCog size={18} />, label: "Settings" },
];
export default function MainLayout() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4">
                <Outlet />
            </main>

            <div className="h-[60px] bg-[#404040] rounded-t-4xl text-white sticky bottom-0 z-90 grid grid-cols-4">
                {navItems.map(({ to, icon, label }) => {
                    const active = isActive(to);

                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`transition-all duration-300 flex flex-col items-center justify-center gap-2 
        ${active ? "border-b-4 border-b-[#C667F7] text-[#C667F7]" : "text-white"}`}
                        >
                            <div className={`transition-all duration-300 ` + (active ? "text-xl text-[#C667F7]" : "text-xl text-white")}>
                                {icon}
                            </div>

                            {active ? <span className="text-xs font-semibold">
                                {label}
                            </span> : null}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}