import { version } from "./../../../package.json"
import {
  FaPalette,
  FaBook,
  FaBookOpen,
  FaTv,
  FaNetworkWired,
  FaPuzzlePiece,
  FaShieldHeart,
  FaCircleInfo,
  FaAnchor,
  FaUserGear,
  FaUserGroup,
  FaBell,
  FaKey,
} from "react-icons/fa6";
import SettingMenu from "../../components/Settings/SettingMenu";

const Settings = () => {

  return (
    <div className="min-h-full flex flex-col md:grid md:flex-none md:grid-cols-2">
      <div className="py-4 md:min-h-full flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <img src="/icon.png" className="w-1/6 py-4 rounded-full"></img>
          <a>Kiirohana</a>
          <a>v{version}</a>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-white/40 uppercase">
            Account
          </span>

          <SettingMenu icon={<FaUserGear />} name="Account" path="/app/settings/account/" />
          <SettingMenu icon={<FaUserGroup />} name="Profiles" path="/app/settings/profiles/" />
          <SettingMenu icon={<FaBell />} name="Notification" path="/app/settings/notification/" />
          <SettingMenu icon={<FaKey />} name="Login And Session" />
        </div>

        {/* PERSONALIZATION */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-white/40 uppercase">
            Personalization
          </span>

          <SettingMenu icon={<FaPalette />} name="Appearance" />
        </div>

        {/* MEDIA */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-white/40 uppercase">
            Media
          </span>

          <SettingMenu icon={<FaTv />} name="Watch" />
          <SettingMenu icon={<FaBook />} name="Novel" />
          <SettingMenu icon={<FaBookOpen />} name="Comic" />
        </div>

        {/* NETWORK */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-white/40 uppercase">
            Network & Services
          </span>

          <SettingMenu icon={<FaNetworkWired />} name="Network" />
          <SettingMenu icon={<FaPuzzlePiece />} name="Service" path="/app/settings/services" />
        </div>

        {/* SECURITY */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-white/40 uppercase">
            Privacy & Security
          </span>

          <SettingMenu icon={<FaShieldHeart />} name="Privacy And Security" />
        </div>

        {/* ADVANCED */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-white/40 uppercase">
            Advanced
          </span>

          <SettingMenu icon={<FaAnchor />} name="Shinobu" path="/shinobu/" />
        </div>

        {/* INFORMATION */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-white/40 uppercase">
            Information
          </span>

          <SettingMenu icon={<FaCircleInfo />} name="About" />
        </div>

      </div>
    </div>
  );
};

export default Settings;  