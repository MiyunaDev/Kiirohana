import { FaHome, FaBook, FaComments, FaCog, FaGlobe } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router';
import ChangelogModal from "../components/ChangelogModal";

import { version } from "./../../package.json";
import { useEffect, useState } from 'react';

// Menyesuaikan item navigasi dengan kebutuhan Medsos, Tracker, dan Messenger
const navItems = [
    { to: "/app/library", icon: <FaBook size={18} />, label: "Media" },
    { to: "/app/messages", icon: <FaComments size={18} />, label: "Chat" }, 
    { to: "/app/home", icon: <FaHome size={18} />, label: "Home" }, 
    { to: "/app/browse", icon: <FaGlobe size={18} />, label: "Browse" },
    { to: "/app/settings", icon: <FaCog size={18} />, label: "Settings" },
];

const NavigativeLayout = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);

    const [showChangelog, setShowChangelog] = useState(false);
    const [changelogContent, setChangelogContent] = useState("");

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem("last_seen_version");

        console.log("Memulai proses...")

        if (!lastSeenVersion || lastSeenVersion !== version) {
            console.log("Versi terdeteksi berbeda...")
            fetch("https://raw.githubusercontent.com/MiyunaDev/Kiirohana/refs/heads/main/public/CHANGELOGS.md")
                .then(res => res.text())
                .then(md => {
                    console.log("Berhasil memanggil changelog")
                    setChangelogContent(md);
                    setShowChangelog(true);
                    localStorage.setItem("last_seen_version", version);
                }).catch(async err => {
                    if (err) console.error(err)
                })
        }
    }, [])

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            {showChangelog && (
                <ChangelogModal content={changelogContent} onClose={() => setShowChangelog(false)} />
            )}

            <div className="h-[50px] bg-[#404040] rounded-b-4xl sticky top-0 z-90 flex items-center justify-center">
                Kiirohana
            </div>

            <main className="flex-1 overflow-auto p-4">
                <Outlet />
            </main>

            {/* Mengubah grid-cols-4 menjadi grid-cols-5 untuk menampung seluruh navigasi baru */}
            <div className="h-[60px] bg-[#404040] rounded-t-4xl  sticky bottom-0 z-90 grid grid-cols-5">
                {navItems.map(({ to, icon, label }) => {
                    const active = isActive(to);

                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`transition-all duration-300 flex flex-col items-center justify-center gap-1 
        ${active ? "border-b-4 border-b-[#C667F7] text-[#C667F7]" : ""}`}
                        >
                            <div className={`transition-all duration-300 ` + (active ? "text-xl text-[#C667F7]" : "text-xl ")}>
                                {icon}
                            </div>

                            {active ? <span className="text-[10px] font-semibold truncate max-w-full px-1">
                                {label}
                            </span> : null}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default NavigativeLayout;