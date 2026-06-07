import React, { useState } from "react";
import { 
  FaBell, FaShieldHalved, FaUserPlus, FaTv, FaCalendarDays, 
  FaClock, FaBookOpen, FaBook, FaRobot, 
  FaBrain, FaGear, FaVolumeHigh, FaMusic, FaMoon, FaChevronDown 
} from "react-icons/fa6";

// =========================================================================
// REUSABLE COMPONENTS (LAMA & BARU) - SILAKAN DIPINDAH NANTI
// =========================================================================

// 1. SettingButton
interface SettingButtonProps {
  icon: React.ReactNode; title: string; description?: string; actionLabel?: string; onClick?: () => void;
}
const SettingButton = ({ icon, title, description, actionLabel = "Change", onClick }: SettingButtonProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <div className="flex flex-col truncate">
        <span className="font-medium text-[15px] text-white truncate">{title}</span>
        {description && <span className="text-[13px] text-white/50 truncate mt-0.5">{description}</span>}
      </div>
    </div>
    <button onClick={onClick} className="flex-shrink-0 px-4 py-2 rounded-xl text-[14px] font-medium text-[#C667F7] transition-all active:scale-95 hover:bg-white/10">{actionLabel}</button>
  </div>
);

// 2. SettingSwitch
interface SettingSwitchProps {
  icon: React.ReactNode; title: string; description?: string; value: boolean; onChange: (val: boolean) => void;
}
const SettingSwitch = ({ icon, title, description, value, onChange }: SettingSwitchProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <div className="flex flex-col truncate">
        <span className="font-medium text-[15px] text-white truncate">{title}</span>
        {description && <span className="text-[13px] text-white/50 truncate mt-0.5">{description}</span>}
      </div>
    </div>
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${value ? "bg-[#C667F7]" : "bg-[#2D2D2D]"}`}>
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? "left-6" : "left-1"}`} />
    </button>
  </div>
);

// 3. SettingSelect
interface Option { value: string; label: string; }
interface SettingSelectProps {
  icon: React.ReactNode; title: string; description?: string; value: string; options: Option[]; onChange: (val: string) => void;
}
const SettingSelect = ({ icon, title, description, value, options, onChange }: SettingSelectProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <div className="flex flex-col truncate">
        <span className="font-medium text-[15px] text-white truncate">{title}</span>
        {description && <span className="text-[13px] text-white/50 truncate mt-0.5">{description}</span>}
      </div>
    </div>
    <div className="relative flex-shrink-0 grid items-center">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none bg-[#2D2D2D] text-[#C667F7] text-[14px] font-medium pl-4 pr-10 py-2 rounded-xl border border-white/5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 col-start-1 row-start-1">
        {options.map((opt) => (<option key={opt.value} value={opt.value} className="bg-[#2D2D2D] text-white">{opt.label}</option>))}
      </select>
      <span className="text-[#C667F7] text-xs pointer-events-none col-start-1 row-start-1 justify-self-end mr-3.5"><FaChevronDown /></span>
    </div>
  </div>
);

// 4. SettingSlider (BARU: Khusus untuk Volume suara)
interface SettingSliderProps {
  icon: React.ReactNode; title: string; value: number; onChange: (val: number) => void;
}
const SettingSlider = ({ icon, title, value, onChange }: SettingSliderProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center flex-1">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <span className="font-medium text-[15px] text-white whitespace-nowrap">{title}</span>
    </div>
    <div className="flex items-center gap-4 w-full sm:w-64 flex-shrink-0">
      <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-1.5 bg-[#2D2D2D] rounded-lg appearance-none cursor-pointer accent-[#C667F7]" />
      <span className="text-[14px] font-mono font-medium text-[#C667F7] min-w-[36px] text-right">{value}%</span>
    </div>
  </div>
);


// =========================================================================
// MAIN NOTIFICATIONS PAGE
// =========================================================================
const NotificationSetting = () => {
  // --- STATES MANAGER ---
  // System
  const [sysUpdates, setSysUpdates] = useState(true);
  const [sysSecurity, setSysSecurity] = useState(true);
  const [sysFriends, setSysFriends] = useState(false);

  // Watch
  const [watchEpisodes, setWatchEpisodes] = useState(true);
  const [watchSchedule, setWatchSchedule] = useState(true);
  const [watchReminder, setWatchReminder] = useState(false);

  // Novel
  const [novelVolume, setNovelVolume] = useState(true);
  const [novelReminder, setNovelReminder] = useState(true);

  // Comic
  const [comicChapter, setComicChapter] = useState(true);

  // Shinobu (AI / Agent)
  const [shinobuTask, setShinobuTask] = useState(true);
  const [shinobuMemory, setShinobuMemory] = useState(false);
  const [shinobuJobs, setShinobuJobs] = useState(true);

  // Sound
  const [soundTheme, setSoundTheme] = useState("anime");
  const [volume, setVolume] = useState(70);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto px-4 py-8 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col gap-3 border-b border-white/5 pb-6">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight">Notification Center</h1>
        <p className="text-[15px] md:text-[16px] text-white/50 max-w-2xl leading-relaxed">
          Atur bagaimana dan kapan Anda menerima pemberitahuan sistem, rilis konten terbaru, serta laporan tugas dari Shinobu.
        </p>
      </div>

      {/* 1. SYSTEM SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">System Alerts</h2>
        <div className="flex flex-col gap-3">
          <SettingSwitch icon={<FaBell />} title="System Updates" description="Dapatkan info rilis fitur baru dan maintenance platform" value={sysUpdates} onChange={setSysUpdates} />
          <SettingSwitch icon={<FaShieldHalved />} title="Security Alerts" description="Notifikasi instan jika terdeteksi login atau aktivitas mencurigakan" value={sysSecurity} onChange={setSysSecurity} />
          <SettingSwitch icon={<FaUserPlus />} title="Friend Requests" description="Beritahu saya ketika seseorang mengirim permintaan pertemanan" value={sysFriends} onChange={setSysFriends} />
        </div>
      </div>

      {/* 2. WATCH SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Watch Tracker</h2>
        <div className="flex flex-col gap-3">
          <SettingSwitch icon={<FaTv />} title="New Episodes" description="Notifikasi saat episode terbaru anime di daftar tontonan Anda rilis" value={watchEpisodes} onChange={setWatchEpisodes} />
          <SettingSwitch icon={<FaCalendarDays />} title="Airing Schedule Reminder" description="Pengingat beberapa jam sebelum anime favorit Anda mulai tayang" value={watchSchedule} onChange={setWatchSchedule} />
          <SettingSwitch icon={<FaClock />} title="Continue Watching Reminder" description="Peringatan berkala untuk melanjutkan maraton seri yang tertunda" value={watchReminder} onChange={setWatchReminder} />
        </div>
      </div>

      {/* 3. NOVEL SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Novel Releases</h2>
        <div className="flex flex-col gap-3">
          <SettingSwitch icon={<FaBookOpen />} title="New Volume Alerts" description="Pemberitahuan saat volume baru dari Light Novel kesukaan diterbitkan" value={novelVolume} onChange={setNovelVolume} />
          <SettingSwitch icon={<FaClock />} title="Reading Reminder" description="Pengingat jadwal baca harian agar progres tidak tertinggal" value={novelReminder} onChange={setNovelReminder} />
        </div>
      </div>

      {/* 4. COMIC SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Comic & Manga</h2>
        <div>
          <SettingSwitch icon={<FaBook />} title="New Chapter Releases" description="Notifikasi instan ketika chapter baru Manga/Manhwa/Manhua di-update" value={comicChapter} onChange={setComicChapter} />
        </div>
      </div>

      {/* 5. SHINOBU SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Shinobu Core</h2>
        <div className="flex flex-col gap-3">
          <SettingSwitch icon={<FaRobot />} title="Agent Finished Task" description="Laporan berkala ketika agen AI selesai mengeksekusi perintah otomatis" value={shinobuTask} onChange={setShinobuTask} />
          <SettingSwitch icon={<FaBrain />} title="Memory System Alert" description="Pemberitahuan optimalisasi basis data memori jangka panjang Shinobu" value={shinobuMemory} onChange={setShinobuMemory} />
          <SettingSwitch icon={<FaGear />} title="Background Jobs Log" description="Notifikasi jika terjadi kendala atau penyelesaian proses di latar belakang" value={shinobuJobs} onChange={setShinobuJobs} />
        </div>
      </div>

      {/* 6. SOUND SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Audio & Alerts FX</h2>
        <div className="flex flex-col gap-3">
          <SettingSelect 
            icon={<FaMusic />} 
            title="Sound Effects Theme" 
            description="Pilih set karakter suara notifikasi di platform" 
            value={soundTheme} 
            options={[
              { value: "default", label: "Default Clean" },
              { value: "retro", label: "8-Bit Retro" },
              { value: "anime", label: "Shinobu Voice Pack" },
              { value: "minimal", label: "Soft Minimal" }
            ]} 
            onChange={setSoundTheme} 
          />
          <SettingSlider icon={<FaVolumeHigh />} title="Alerts Master Volume" value={volume} onChange={setVolume} />
          <SettingButton icon={<FaMoon />} title="Silent Hours Duration" description="Senyapkan semua suara otomatis antara pukul 22:00 - 06:00" actionLabel="Configure" />
        </div>
      </div>

    </div>
  );
};

export default NotificationSetting;