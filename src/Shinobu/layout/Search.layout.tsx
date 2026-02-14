import { Outlet, useParams, Link, useLocation  } from "react-router";

const tabs = [
  { label: "Latest", path: "latest" },
  { label: "Advance", path: "advance" },
];

const SearchLayout = () => {
  const { shinobuid } = useParams<{ shinobuid: string }>();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation Tabs */}
      <div className="flex">
        {tabs.map((tab) => {
          const tabPath = `/shinobu/${shinobuid}/app/search/${tab.path}`;
          const isActive = location.pathname === tabPath;

          return (
            <Link
              key={tab.path}
              to={tab.path} // relative path
              className={`px-4 py-2 font-medium ${
                isActive
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Outlet untuk menampilkan Latest / Advance */}
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default SearchLayout;