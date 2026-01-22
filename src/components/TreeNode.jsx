import { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

const TreeNode = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ml-2 text-gray-700">
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="transition-transform duration-300">
          {isOpen ? (
            <FaChevronDown className="text-sm" />
          ) : (
            <FaChevronRight className="text-sm" />
          )}
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 accent-blue-600"
          />
          <span className="font-medium">Parent</span>
        </label>
      </div>

    
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 mt-2" : "max-h-0"
        }`}
      >
        <ul className="ml-5 space-y-3">
          {[1, 2].map((i) => (
            <li
              key={i}
              className="flex justify-between items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="h-3 w-3 accent-blue-600" />
                Child {i}
              </label>

              <div className="text-xs text-gray-600 font-mono">
                "/get-manager-user"
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TreeNode;
