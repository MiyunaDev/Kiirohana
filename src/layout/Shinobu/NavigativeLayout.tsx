import {
  FaBook,
  FaHistory,
  FaSearch,
  FaComments,
  FaBell
} from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router";

const navItems = [
  { to: "/shinobu/app/library", icon: <FaBook size={18} />, label: "Library" },
  { to: "/shinobu/app/history", icon: <FaHistory size={18} />, label: "History" },
  { to: "/shinobu/app/browse", icon: <FaSearch size={18} />, label: "Browse" },
];

const NavigativeLayout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex flex-col min-h-screen bg-[#2E2E2E] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 h-[56px] bg-[#404040] rounded-b-3xl px-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-wide">
            Kiirohana
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* CHAT */}
          <Link
            to="/app/chat"
            className="relative p-2 rounded-xl hover:bg-white/10 transition"
          >
            <FaComments size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 rounded-full">
              3
            </span>
          </Link>

          {/* NOTIFICATION */}
          <button className="p-2 rounded-xl hover:bg-white/10 transition">
            <FaBell size={16} />
          </button>

          {/* AVATAR */}
          <Link
            to="/app/profile"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#C667F7]"
          >
            <img
              src="https://i.pravatar.cc/100"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>

      <nav className="sticky bottom-0 z-50 h-[64px] bg-[#404040] rounded-t-3xl grid grid-cols-3">
        {navItems.map(({ to, icon, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-1 transition-all
                ${active
                  ? "text-[#C667F7] border-t-4 border-[#C667F7]"
                  : "text-white/80"
                }`}
            >
              <div className={`text-lg ${active && "scale-110"}`}>
                {icon}
              </div>
              {active && (
                <span className="text-[11px] font-semibold">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <Link
        to="/app/chat"
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-[#C667F7] flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        <FaComments size={22} className="text-white" />
      </Link>
    </div>
  );
};

export default NavigativeLayout;