import { version } from "./../../../package.json"
import { FaPalette, FaBook, FaBookOpen, FaTv, FaNetworkWired, FaPuzzlePiece, FaShieldHeart, FaCircleInfo } from "react-icons/fa6"

interface SettingMenuProps {
  isActive?: boolean;
  icon: React.ReactNode;
  name: string;
}

const SettingMenu = ({ icon, name }: SettingMenuProps) => {
  return (
    <button
      className={`relative bg-[#404040] group overflow-hidden flex flex-row gap-4 p-4 items-center z-20
        before:absolute before:z-10 before:left-0 before:top-0
        before:min-h-full before:rounded-r-full before:transition-all before:duration-500
        active:shadow active:shadow-[#C667F7]
        before:w-0 active:before:w-screen before:bg-[#C667F7]`}
    >
      <span className="z-20 transition-all duration-350 group-active:font-semibold group-active:text-[#101010]">
        {icon}
      </span>
      <span className="z-20 transition-all duration-350 group-active:font-medium group-active:text-[#101010]">
        {name}
      </span>
    </button>
  );
};

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
        <SettingMenu icon={<FaPuzzlePiece />} name="Service" />
        <SettingMenu icon={<FaCircleInfo />} name="About" />
      </div>
    </div>
  );
};

export default Settings;  