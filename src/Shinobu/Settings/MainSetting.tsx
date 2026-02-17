import {
//   FaPalette,
//   FaBook,
//   FaBookOpen,
//   FaTv,
//   FaPuzzlePiece,
//   FaCircleInfo,
//   FaAnchor,
//   FaKey,
//   FaUsers,
  FaShieldHeart,
  FaUser
} from "react-icons/fa6";
import { useShiNavigate } from "../../Shinobu/utils/shiNavigate";
import { useShinobu } from "../../hooks/useShinobu";

interface SettingMenuProps {
  isActive?: boolean;
  icon: React.ReactNode;
  name: string;
  path?: string
}

const SettingMenu = ({ icon, name, path }: SettingMenuProps) => {
  const { service } = useShinobu()
  const navigate = useShiNavigate(service?.id)
  return (
    <div
      className={`relative bg-[#404040] group overflow-hidden flex flex-row gap-4 p-4 items-center z-20
        before:absolute before:z-10 before:left-0 before:top-0
        before:min-h-full before:rounded-r-full before:transition-all before:duration-500
        hover:shadow active:shadow hover:shadow-[#C667F7] active:shadow-[#C667F7]
        before:w-0 hover:before:w-screen active:before:w-screen before:bg-[#C667F7]`}
      onClick={() => navigate(path ?? "")}
    >
      <span className="z-20 transition-all duration-350 group-hover:font-semibold group-active:font-semibold group-hover:text-[#101010] group-active:text-[#101010]">
        {icon}
      </span>
      <span className="z-20 transition-all duration-350 group-hover:font-semibold group-active:font-semibold group-hover:text-[#101010] group-active:text-[#101010]">
        {name}
      </span>
    </div>
  );
};

const MainSetting = () => {
  return (
    <div className="min-h-full flex flex-col md:grid md:grid-cols-2">
      {/* ================= LEFT PANEL ================= */}
      <div className="py-4 md:min-h-full flex flex-col justify-center items-center bg-[#121212]">
        <div className="flex flex-col items-center">
          <img
            src="/icon.png"
            className="w-1/6 py-4 rounded-full border border-gray-700"
          />
          <h1 className="text-white font-bold text-lg">Shinobu</h1>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex flex-col gap-3 justify-center p-4 md:p-6 bg-[#1A1A1A]">
        {/* <SettingMenu icon={<FaPalette />} name="Appearance" path="/app/settings/appearance" />
        <SettingMenu icon={<FaTv />} name="Watch" path="/app/settings/watch" />
        <SettingMenu icon={<FaBook />} name="Novel" path="/app/settings/novel" />
        <SettingMenu icon={<FaBookOpen />} name="Comic" path="/app/settings/comic" /> */}

        {/* Account Center */}
        <SettingMenu
          icon={<FaUser />}
          name="Account Center"
          path="/app/account-center"
        />

        {/* Security & Privacy */}
        <SettingMenu
          icon={<FaShieldHeart />}
          name="Privacy & Security"
          path="/app/settings/privacy-security"
        />
      </div>
    </div>
  );
};

export default MainSetting;