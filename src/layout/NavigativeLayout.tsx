import { FaBook, FaHistory, FaSearch, FaCog } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router';

const navItems = [
    { to: "/app/library", icon: <FaBook size={18} />, label: "Library" },
    { to: "/app/history", icon: <FaHistory size={18} />, label: "History" },
    { to: "/app/browse", icon: <FaSearch size={18} />, label: "Browse" },
    { to: "/app/settings", icon: <FaCog size={18} />, label: "Settings" },
];

const NavigativeLayout = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="flex flex-col h-screen">

            <div className="h-[50px] bg-[#505050] text-white sticky top-0 z-10 flex items-center justify-center">
                Kiirohana
            </div>

            <main className="flex-1 overflow-auto p-4">
                <Outlet />
            </main>

            <div className="h-[60px] bg-[#505050] text-white sticky bottom-0 z-10 grid grid-cols-4">
                {navItems.map(({ to, icon, label }) => {
                    const active = isActive(to);

                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex flex-col items-center justify-center gap-2 
        ${active ? "border-b-4 border-b-[#C667F7] text-[#C667F7]" : "text-white"}`}
                        >
                            <div className={active ? "text-xl text-[#C667F7]" : "text-xl text-white"}>
                                {icon}
                            </div>
                            <span className={active ? "text-xs font-semibold" : "text-xs"}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default NavigativeLayout