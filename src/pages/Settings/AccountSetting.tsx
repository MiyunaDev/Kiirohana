import { useState } from "react";
import { 
  FaEnvelope, FaLock, FaKey, FaShieldHalved, FaMobileScreenButton, 
  FaLaptop, FaTimeline, FaGlobe, FaGoogle, FaGithub, 
  FaDiscord, FaApple, FaWindows, FaSteam, FaDownload, 
  FaUpload, FaTrashCan, FaEye, FaFingerprint
} from "react-icons/fa6";

// Mengimpor semua komponen kustom yang sudah kita buat sebelumnya
import SettingButton from "../../components/Settings/SettingButton";
import SettingSwitch from "../../components/Settings/SettingSwitch";
import SettingInput from "../../components/Settings/SettingInput";

const AccountSetting = () => {
  // --- STATE MANAGEMENT ---
  // Authentication & 2FA States
  const [passwordless, setPasswordless] = useState(false);
  const [enable2FA, setEnable2FA] = useState(true);
  const [emailOTP, setEmailOTP] = useState(false);
  
  // Input States (Inline Editing)
  const [email, setEmail] = useState("user@domain.com");
  const [recoveryEmail, setRecoveryEmail] = useState("backup@domain.com");
  const [recoveryPhone, setRecoveryPhone] = useState("+62 812-3456-7890");
  const [securityPhrase, setSecurityPhrase] = useState("Kucing Lompat 123");

  // Connected Accounts States (True jika terhubung)
  const [connectedApps, setConnectedApps] = useState({
    google: true,
    github: true,
    discord: false,
    apple: false,
    microsoft: false,
    steam: false,
  });

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto px-4 py-8 text-white">
      
      {/* =========================================================================
          HEADER PUSAT AKUN 
         ========================================================================= */}
      <div className="flex flex-col gap-3 border-b border-white/5 pb-6">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Account Center
        </h1>
        <p className="text-[15px] md:text-[16px] text-white/50 max-w-2xl leading-relaxed">
          Pusat kendali identitas, pengaturan keamanan berlapis, manajemen sesi aktif, dan integrasi akun pihak ketiga Anda.
        </p>
      </div>

      {/* =========================================================================
          SECTION 1: AUTHENTICATION
         ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-white tracking-wide">Authentication</h2>
          <p className="text-[13px] text-white/40 mt-0.5">Kredensial masuk utama dan pemulihan akun.</p>
        </div>
        <div className="flex flex-col gap-3">
          <SettingInput
            icon={<FaEnvelope />}
            title="Email Address"
            description="Email utama untuk korespondensi dan login"
            value={email}
            onChange={setEmail}
          />
          <SettingButton
            icon={<FaLock />}
            title="Account Password"
            description="Terakhir diubah 2 bulan lalu"
            actionLabel="Change"
            onClick={() => alert("Modal Ganti Password")}
          />
          <SettingSwitch
            icon={<FaFingerprint />}
            title="Passwordless Login"
            description="Masuk instan tanpa mengetik sandi pada perangkat terpercaya"
            value={passwordless}
            onChange={setPasswordless}
          />
          <SettingButton
            icon={<FaKey />}
            title="Passkeys (WebAuthn)"
            description="Gunakan biometrik (FaceID/Fingerprint) atau hardware key"
            actionLabel="Manage"
          />
          <SettingInput
            icon={<FaEye />}
            title="Security Phrase"
            description="Frasa verifikasi untuk memastikan keaslian komunikasi sistem"
            value={securityPhrase}
            onChange={setSecurityPhrase}
          />
          <SettingInput
            icon={<FaEnvelope />}
            title="Recovery Email"
            description="Email cadangan jika akun terkunci"
            value={recoveryEmail}
            onChange={setRecoveryEmail}
          />
          <SettingInput
            icon={<FaMobileScreenButton />}
            title="Recovery Phone"
            description="Nomor HP untuk pemulihan via SMS"
            value={recoveryPhone}
            onChange={setRecoveryPhone}
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: TWO-FACTOR AUTHENTICATION (2FA)
         ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-white tracking-wide">Two-Factor Authentication</h2>
          <p className="text-[13px] text-white/40 mt-0.5">Lapisan keamanan tambahan untuk melindungi akun Anda.</p>
        </div>
        <div className="flex flex-col gap-3">
          <SettingSwitch
            icon={<FaShieldHalved />}
            title="Enable 2FA"
            description="Wajibkan kode verifikasi setiap kali melakukan login baru"
            value={enable2FA}
            onChange={setEnable2FA}
          />
          <SettingButton
            icon={<FaMobileScreenButton />}
            title="Authenticator App"
            description="Google Authenticator, Authy, atau Aegis"
            actionLabel="Configure"
          />
          <SettingButton
            icon={<FaKey />}
            title="Backup Codes"
            description="Kode darurat satu kali pakai jika Anda kehilangan akses 2FA"
            actionLabel="View Codes"
          />
          <SettingSwitch
            icon={<FaEnvelope />}
            title="Email OTP"
            description="Kirim kode verifikasi cadangan ke email utama"
            value={emailOTP}
            onChange={setEmailOTP}
          />
          <SettingButton
            icon={<FaLaptop />}
            title="Trusted Devices"
            description="Kelola perangkat yang dilewati dari pengecekan 2FA"
            actionLabel="Manage (5)"
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: SESSIONS & ACTIVE DEVICES
         ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-white tracking-wide">Sessions & Devices</h2>
          <p className="text-[13px] text-white/40 mt-0.5">Pantau lokasi login dan kendalikan sesi aktif Anda.</p>
        </div>
        <div className="flex flex-col gap-3">
          <SettingButton
            icon={<FaLaptop />}
            title="Current Device"
            description="Windows PC • Jakarta, Indonesia • IP: 182.1.xx.xx"
            actionLabel="Active Now"
          />
          <SettingButton
            icon={<FaMobileScreenButton />}
            title="Active Devices"
            description="Sedang login di 3 perangkat lainnya"
            actionLabel="Manage All"
          />
          <SettingButton
            icon={<FaTimeline />}
            title="Login & IP History"
            description="Log aktivitas autentikasi dan riwayat alamat IP 30 hari terakhir"
            actionLabel="View Logs"
          />
          <SettingButton
            icon={<FaTrashCan />}
            title="Force Logout All Devices"
            description="Keluar dari semua sesi di seluruh perangkat seketika"
            actionLabel="Logout All"
            danger={true}
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: CONNECTED ACCOUNTS (OAuth)
         ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-white tracking-wide">Connected Accounts</h2>
          <p className="text-[13px] text-white/40 mt-0.5">Hubungkan akun sosial untuk login lebih cepat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SettingButton
            icon={<FaGoogle />}
            title="Google"
            description={connectedApps.google ? "Connected as user@gmail.com" : "Not connected"}
            actionLabel={connectedApps.google ? "Disconnect" : "Connect"}
          />
          <SettingButton
            icon={<FaGithub />}
            title="GitHub"
            description={connectedApps.github ? "Connected as @devuser" : "Not connected"}
            actionLabel={connectedApps.github ? "Disconnect" : "Connect"}
          />
          <SettingButton
            icon={<FaDiscord />}
            title="Discord"
            description={connectedApps.discord ? "Connected" : "Not connected"}
            actionLabel={connectedApps.discord ? "Disconnect" : "Connect"}
          />
          <SettingButton
            icon={<FaApple />}
            title="Apple ID"
            description={connectedApps.apple ? "Connected" : "Not connected"}
            actionLabel={connectedApps.apple ? "Disconnect" : "Connect"}
          />
          <SettingButton
            icon={<FaWindows />}
            title="Microsoft"
            description={connectedApps.microsoft ? "Connected" : "Not connected"}
            actionLabel={connectedApps.microsoft ? "Disconnect" : "Connect"}
          />
          <SettingButton
            icon={<FaSteam />}
            title="Steam"
            description={connectedApps.steam ? "Connected" : "Not connected"}
            actionLabel={connectedApps.steam ? "Disconnect" : "Connect"}
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: DATA & BACKUP (DANGER ZONE)
         ========================================================================= */}
      <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
        <div>
          <h2 className="text-[15px] font-bold text-red-400 tracking-wide">Data & Privacy Control</h2>
          <p className="text-[13px] text-red-400/40 mt-0.5">Manajemen data sensitif dan penghapusan permanen.</p>
        </div>
        <div className="flex flex-col gap-3">
          <SettingButton
            icon={<FaDownload />}
            title="Export Account Data"
            description="Unduh semua riwayat, profil, dan data enkripsi Anda (JSON/ZIP)"
            actionLabel="Request Export"
          />
          <SettingButton
            icon={<FaUpload />}
            title="Import Backup Data"
            description="Pulihkan pengaturan atau data dari file cadangan eksternal"
            actionLabel="Upload"
          />
          <SettingButton
            icon={<FaTrashCan />}
            title="Delete Account Permanently"
            description="Tindakan ireversibel. Semua data Anda akan dihapus secara permanen"
            actionLabel="Delete Account"
            danger={true}
          />
        </div>
      </div>

    </div>
  );
};

export default AccountSetting;