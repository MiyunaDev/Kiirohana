import { useNavigate } from "react-router";

interface SettingMenuProps {
  isActive?: boolean;
  icon: React.ReactNode;
  name: string;
  path?: string
}

const SettingMenu = ({ icon, name, path }: SettingMenuProps) => {
  const navigate = useNavigate()
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

export default SettingMenu