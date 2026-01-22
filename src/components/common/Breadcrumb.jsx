import { Link, useLocation } from "react-router-dom";
import { FiHome, FiChevronRight } from "react-icons/fi";
import {routes} from '../../router/routeConfig'

const Breadcrumb = () => {
  const location = useLocation();

  const paths = location.pathname.split("/").filter((x) => x !== "");

  const getLabelFromPath = (path) => {
    const routeEntry = Object.values(routes).find((r) => r.path === path);
    return routeEntry ? routeEntry.label : null;
  };

  return (
    <div className="w-full my-2">
      <div className="flex items-center justify-end bg-white px-4 py-2 rounded-sm shadow-sm border border-gray-200 text-sm">
        
        {/* HOME */}
        <Link
          to="/dashboard"
          className="flex items-center gap-1 text-[#1d1e23] transition font-medium"
        >
          <FiHome size={16} />
          <span className="hidden sm:block">Home</span>
        </Link>

        {paths.map((segment, index) => {
          const fullPath = "/" + paths.slice(0, index + 1).join("/");

          // Get route label from routes config
          const routeLabel = getLabelFromPath(fullPath);

          // Fallback: formatted segment if route label not found
          const label =
            routeLabel ||
            segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

          return (
            <div key={index} className="flex items-center">
              <FiChevronRight className="mx-2 text-gray-400" size={16} />

              {index === paths.length - 1 ? (
                <span className="text-[#ff8c00] font-semibold">{label}</span>
              ) : (
                <Link
                  to={fullPath}
                  className="text-gray-600 hover:text-[#C70039] transition font-medium"
                >
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumb;