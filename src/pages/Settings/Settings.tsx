import { version } from "./../../../package.json"
import { FaPalette, FaBook, FaBookOpen, FaTv, FaNetworkWired, FaPuzzlePiece, FaShieldHeart, FaCircleInfo, FaAnchor } from "react-icons/fa6"
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
      <div className="flex flex-col gap-3 justify-center">
        <SettingMenu icon={<FaPalette />} name="Appearence" />
        <SettingMenu icon={<FaTv />} name="Watch" />
        <SettingMenu icon={<FaBook />} name="Novel" />
        <SettingMenu icon={<FaBookOpen />} name="Comic" />
        <SettingMenu icon={<FaNetworkWired />} name="Network" />
        <SettingMenu icon={<FaShieldHeart />} name="Privacy And Security" />
        <SettingMenu icon={<FaPuzzlePiece />} name="Service" path="/app/settings/services" />
        <SettingMenu icon={<FaCircleInfo />} name="About" />
        <SettingMenu icon={<FaAnchor />} name="Shinobu" path="/shinobu/app" />
      </div>
    </div>
  );
};

export default Settings;  