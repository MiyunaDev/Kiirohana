import React, { useState } from "react";
import { 
  FaUser, FaPen, FaQuoteLeft, FaIdCard, FaGlobe, FaLink, 
  FaEye, FaEarthAsia, FaClock, FaBookOpen, FaFolderPlus, 
  FaUsers, FaPalette, FaImage, FaSliders, FaArrowRotateLeft
} from "react-icons/fa6";

// =========================================================================
// REUSABLE COMPONENTS (LAMA & BARU) - BISA KAMU PINDAH/SPLIT NANTI
// =========================================================================

// 1. SettingButton (Eksisting)
interface SettingButtonProps {
  icon: React.ReactNode; title: string; description?: string; actionLabel?: string; onClick?: () => void; danger?: boolean;
}
const SettingButton = ({ icon, title, description, actionLabel = "Change", onClick, danger }: SettingButtonProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <div className="flex flex-col truncate">
        <span className={`font-medium text-[15px] ${danger ? "text-red-400" : "text-white"} truncate`}>{title}</span>
        {description && <span className="text-[13px] text-white/50 truncate mt-0.5">{description}</span>}
      </div>
    </div>
    <button onClick={onClick} className={`flex-shrink-0 px-4 py-2 rounded-xl text-[14px] font-medium transition-all active:scale-95 hover:bg-white/10 ${danger ? "text-red-400" : "text-[#C667F7]"}`}>{actionLabel}</button>
  </div>
);

// 2. SettingSwitch (Eksisting)
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

// 3. SettingInput (Eksisting dengan kustomisasi prefix opsional)
interface SettingInputProps {
  icon: React.ReactNode; title: string; description?: string; value: string; placeholder?: string; prefixText?: string; onChange: (val: string) => void;
}
const SettingInput = ({ icon, title, description, value, placeholder, prefixText, onChange }: SettingInputProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center overflow-hidden flex-1">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <div className="flex flex-col truncate">
        <span className="font-medium text-[15px] text-white truncate">{title}</span>
        {description && <span className="text-[13px] text-white/50 truncate mt-0.5">{description}</span>}
      </div>
    </div>
    <div className="flex-shrink-0 w-full sm:w-64 flex bg-[#2D2D2D] rounded-xl border border-white/5 overflow-hidden focus-within:ring-2 focus-within:ring-[#C667F7]/50">
      {prefixText && <span className="bg-white/5 px-3 py-2 text-[14px] text-white/40 flex items-center select-none border-r border-white/5">{prefixText}</span>}
      <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-white placeholder-white/30 text-[14px] px-4 py-2 focus:outline-none" />
    </div>
  </div>
);

// 4. SettingImageUpload (BARU: Untuk Avatar & Banner)
interface SettingImageUploadProps {
  icon: React.ReactNode; title: string; description: string; type: "avatar" | "banner"; previewUrl?: string;
}
const SettingImageUpload = ({ icon, title, description, type, previewUrl }: SettingImageUploadProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <div className="flex flex-col truncate">
        <span className="font-medium text-[15px] text-white truncate">{title}</span>
        <span className="text-[13px] text-white/50 truncate mt-0.5">{description}</span>
      </div>
    </div>
    <div className="flex items-center gap-4 self-end sm:self-auto">
      {previewUrl ? (
        <div className={`bg-[#2D2D2D] overflow-hidden border border-white/10 ${type === "avatar" ? "w-12 h-12 rounded-full" : "w-24 h-12 rounded-xl"}`}>
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`bg-[#2D2D2D] flex items-center justify-center border border-dashed border-white/20 ${type === "avatar" ? "w-12 h-12 rounded-full" : "w-24 h-12 rounded-xl"}`}><FaImage className="text-white/20" /></div>
      )}
      <button className="px-4 py-2 bg-[#2D2D2D] border border-white/5 rounded-xl text-[14px] font-medium text-[#C667F7] hover:bg-white/5 transition-all active:scale-95">Upload</button>
    </div>
  </div>
);

// 5. SettingSegmentedControl (BARU: Untuk multi-opsi eksklusif seperti Role/Visibility)
interface SettingSegmentedControlProps {
  icon: React.ReactNode; title: string; options: string[]; value: string; onChange: (val: string) => void;
}
const SettingSegmentedControl = ({ icon, title, options, value, onChange }: SettingSegmentedControlProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <span className="font-medium text-[15px] text-white">{title}</span>
    </div>
    <div className="flex bg-[#2D2D2D] p-1 rounded-xl gap-1 w-full md:w-auto overflow-x-auto whitespace-nowrap">
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all ${value === opt ? "bg-[#C667F7] text-white shadow" : "text-white/60 hover:text-white"}`}>{opt}</button>
      ))}
    </div>
  </div>
);

// 6. SettingColorPicker (BARU: Untuk Kustomisasi Tema Warna)
interface SettingColorPickerProps {
  icon: React.ReactNode; title: string; description: string; value: string; onChange: (val: string) => void;
}
const SettingColorPicker = ({ icon, title, description, value, onChange }: SettingColorPickerProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors hover:bg-[#454545]">
    <div className="flex gap-4 items-center overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-lg text-white">{icon}</div>
      <div className="flex flex-col truncate">
        <span className="font-medium text-[15px] text-white truncate">{title}</span>
        <span className="text-[13px] text-white/50 truncate mt-0.5">{description}</span>
      </div>
    </div>
    <div className="flex items-center gap-3 bg-[#2D2D2D] p-2 rounded-xl border border-white/5">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none outline-none" />
      <span className="text-[14px] font-mono text-white/80 pr-2 uppercase">{value}</span>
    </div>
  </div>
);

// 7. SettingStatCard (BARU: Grid Item Statistik)
interface SettingStatCardProps {
  icon: React.ReactNode; label: string; value: string;
}
const SettingStatCard = ({ icon, label, value }: SettingStatCardProps) => (
  <div className="bg-[#404040] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
    <div className="w-12 h-12 rounded-xl bg-[#2D2D2D] text-xl text-[#C667F7] flex items-center justify-center flex-shrink-0">{icon}</div>
    <div className="flex flex-col min-w-0">
      <span className="text-white/40 text-[12px] font-semibold uppercase tracking-wider truncate">{label}</span>
      <span className="text-white text-xl font-bold mt-0.5 truncate">{value}</span>
    </div>
  </div>
);


// =========================================================================
// MAIN PAGE COMPONENT
// =========================================================================
const ProfileSetting = () => {
  // --- STATES ---
  const [username, setUsername] = useState("ananda");
  const [displayName, setDisplayName] = useState("Ananda");
  const [bio, setBio] = useState("Building awesome web applications ✨");
  const [pronouns, setPronouns] = useState("he/him");
  const [website, setWebsite] = useState("https://ananda.dev");
  const [customUrl, setCustomUrl] = useState("ananda");
  
  const [visibility, setVisibility] = useState("Public"); // Public, Private, Friends Only
  const [searchable, setSearchable] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(false);

  const [role, setRole] = useState("Developer"); // User, Bot, Creator, Developer
  const [accentColor, setAccentColor] = useState("#C667F7");
  const [customTheme, setCustomTheme] = useState(false);
  const [defaultProfile, setDefaultProfile] = useState("Main Persona");

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto px-4 py-8 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col gap-3 border-b border-white/5 pb-6">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight">Profiles Persona</h1>
        <p className="text-[15px] md:text-[16px] text-white/50 max-w-2xl leading-relaxed">
          Kelola representasi identitas visual, hak akses, tema estetika, serta pantau performa dari persona aktif Anda.
        </p>
      </div>

      {/* 1. IDENTITY SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Identity</h2>
        <div className="flex flex-col gap-3">
          <SettingInput icon={<FaUser />} title="Username" value={username} onChange={setUsername} />
          <SettingInput icon={<FaPen />} title="Display Name" value={displayName} onChange={setDisplayName} />
          <SettingInput icon={<FaQuoteLeft />} title="Bio" value={bio} placeholder="Tulis bio singkat..." onChange={setBio} />
          <SettingImageUpload icon={<FaImage />} title="Avatar Image" description="Rekomendasi rasio 1:1, max 2MB" type="avatar" />
          <SettingImageUpload icon={<FaImage />} title="Profile Banner" description="Rekomendasi ukuran 16:9 atau banner lebar" type="banner" />
          <SettingInput icon={<FaIdCard />} title="Pronouns" value={pronouns} placeholder="e.g. they/them" onChange={setPronouns} />
          <SettingInput icon={<FaGlobe />} title="Website" value={website} placeholder="https://..." onChange={setWebsite} />
          <SettingButton icon={<FaLink />} title="Social Links" description="Terhubung ke Twitter/X, Instagram, dan Threads" actionLabel="Manage" />
        </div>
      </div>

      {/* 2. VISIBILITY SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Visibility</h2>
        <div className="flex flex-col gap-3">
          <SettingSegmentedControl icon={<FaEye />} title="Profile Privacy" options={["Public", "Private", "Friends Only"]} value={visibility} onChange={setVisibility} />
          <SettingSwitch icon={<FaEarthAsia />} title="Searchable Profile" description="Izinkan profil ini ditemukan melalui mesin pencari global" value={searchable} onChange={setSearchable} />
          <SettingSwitch icon={<FaUser />} title="Show Online Status" description="Tampilkan indikator hijau saat Anda sedang aktif" value={showOnline} onChange={setShowOnline} />
          <SettingSwitch icon={<FaUser />} title="Show Last Seen" description="Tampilkan informasi kapan terakhir kali Anda aktif" value={showLastSeen} onChange={setShowLastSeen} />
        </div>
      </div>

      {/* 3. CUSTOM URL SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Custom URL</h2>
        <div>
          <SettingInput icon={<FaLink />} title="Personalized Link" description="Alamat url unik instan ke halaman persona Anda" prefixText="kiirohana.com/@" value={customUrl} onChange={setCustomUrl} />
        </div>
      </div>

      {/* 4. ROLE SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">System Role</h2>
        <div>
          <SettingSegmentedControl icon={<FaIdCard />} title="Account Type Flag" options={["User", "Bot", "Creator", "Developer"]} value={role} onChange={setRole} />
        </div>
      </div>

      {/* 5. THEMES SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Themes Layout</h2>
        <div className="flex flex-col gap-3">
          <SettingColorPicker icon={<FaPalette />} title="Accent Color" description="Warna sorotan utama untuk tombol dan link di profil" value={accentColor} onChange={setAccentColor} />
          <SettingSwitch icon={<FaSliders />} title="Custom Theme Customization" description="Aktifkan CSS kustom untuk modifikasi tema tingkat lanjut" value={customTheme} onChange={setCustomTheme} />
          <SettingButton icon={<FaImage />} title="Background Styling Image" description="Ganti wallpaper latar belakang halaman profil" actionLabel="Change" />
        </div>
      </div>

      {/* 6. STATISTICS SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Persona Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SettingStatCard icon={<FaClock />} label="Watch Time" value="1,240 Jam" />
          <SettingStatCard icon={<FaBookOpen />} label="Reading Time" value="342 Jam" />
          <SettingStatCard icon={<FaFolderPlus />} label="Collections" value="89 Items" />
          <SettingStatCard icon={<FaUsers />} label="Followers" value="12.4K" />
        </div>
      </div>

      {/* 7. PROFILE SWITCHING SECTION */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-white/40 px-1">Profile Switching Control</h2>
        <div className="flex flex-col gap-3">
          <SettingInput icon={<FaUser />} title="Default Active Profile" description="Persona yang otomatis aktif saat pertama login" value={defaultProfile} onChange={setDefaultProfile} />
          <SettingSwitch icon={<FaArrowRotateLeft />} title="Auto Profile Switching" description="Ganti persona otomatis berdasarkan konteks aktivitas tautan" value={true} onChange={() => {}} />
          <SettingButton icon={<FaSliders />} title="Quick Switch Command" description="Aktifkan pintasan cepat keyboard Alt + P untuk ganti persona" actionLabel="Configure" />
        </div>
      </div>

    </div>
  );
};

export default ProfileSetting;