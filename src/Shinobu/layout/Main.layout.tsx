// MainLayout.jsx
import { FaBook, FaHistory, FaSearch, FaCog, FaHome } from 'react-icons/fa';
import { Outlet, useLocation } from 'react-router';
import { useShiNavigate } from '../utils/shiNavigate';
import { useShinobu } from '../../hooks/useShinobu';

const navItems = [
    { to: "/app/search/latest", icon: <FaSearch size={18} />, label: "Browse" },
    { to: "/app/library", icon: <FaBook size={18} />, label: "Library" },
    { to: "/app/home", icon: <FaHome size={18} />, label: "Home" },
    { to: "/app/history", icon: <FaHistory size={18} />, label: "History" },
    { to: "/app/settings", icon: <FaCog size={18} />, label: "Settings" },
];
export default function MainLayout() {
    const location = useLocation();
    const { service } = useShinobu()
    const isActive = (path: string) => location.pathname.startsWith(`/shinobu/${service?.id}/${[path.slice(1)]}`);
    const navigate = useShiNavigate(service?.id)
    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4">
                <Outlet />
            </main>

            <div className="h-[60px] bg-[#404040] rounded-t-4xl text-white sticky bottom-0 z-90 grid grid-cols-5">
                {navItems.map(({ to, icon, label }) => {
                    const active = isActive(to);

                    return (
                        <div
                            key={to}
                            onClick={() => navigate(to)}
                            className={`transition-all duration-300 flex flex-col items-center justify-center gap-2 
        ${active ? "border-b-4 border-b-[#C667F7] text-[#C667F7]" : "text-white"}`}
                        >
                            <div className={`transition-all duration-300 ` + (active ? "text-xl text-[#C667F7]" : "text-xl text-white")}>
                                {icon}
                            </div>

                            {active ? <span className="text-xs font-semibold">
                                {label}
                            </span> : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}