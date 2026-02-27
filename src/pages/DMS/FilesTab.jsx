import React, { useState } from "react";
import {
  HiOutlineShare,
  HiOutlineFolder,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineFilter,
  HiOutlineDotsVertical,
  HiOutlineFolderOpen,
  HiOutlineDocument,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineStar
} from "react-icons/hi";

const FilesTab = () => {
  const [activeTab, setActiveTab] = useState("shared");

  const tabs = [
    { id: "shared", label: "Shared With Me", icon: HiOutlineShare, color: "blue" },
    { id: "public", label: "Public Folders", icon: HiOutlineFolder, color: "green" },
    { id: "trash", label: "Trash Folders", icon: HiOutlineTrash, color: "red" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          {/* Left - Title */}
          <div className="flex items-center gap-3">
            <HiOutlineFolderOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">File Manager</h1>
          </div>

          {/* Right - Role Dropdown */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors min-w-[280px]">
              <option value="executive">Executive Director - Administration (CDHYDRO)</option>
              <option value="manager">Manager - Operations</option>
              <option value="supervisor">Supervisor - Records</option>
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div >
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs Section */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex items-center justify-between">
              {/* Tab Buttons */}
              <div className="flex gap-1 py-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const colorClasses = {
                    blue: isActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-600 hover:bg-gray-50',
                    green: isActive ? 'bg-green-50 text-green-700 border-green-200' : 'text-gray-600 hover:bg-gray-50',
                    red: isActive ? 'bg-red-50 text-red-700 border-red-200' : 'text-gray-600 hover:bg-gray-50'
                  };
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200 border
                        ${isActive ? colorClasses[tab.color] + ' border shadow-sm' : 'border-transparent ' + colorClasses[tab.color]}
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? `text-${tab.color}-600` : 'text-gray-500'}`} />
                      {tab.label}
                      {isActive && (
                        <span className={`ml-1 px-2 py-0.5 text-xs rounded-full bg-${tab.color}-100 text-${tab.color}-700`}>
                          12
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Empty State */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12">
              <div className="text-center max-w-md mx-auto">
                {/* Icon */}
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "shared" && <HiOutlineShare className="w-10 h-10 text-gray-400" />}
                  {activeTab === "public" && <HiOutlineFolder className="w-10 h-10 text-gray-400" />}
                  {activeTab === "trash" && <HiOutlineTrash className="w-10 h-10 text-gray-400" />}
                </div>

                {/* Text */}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === "shared" && "No shared files"}
                  {activeTab === "public" && "No public folders"}
                  {activeTab === "trash" && "Trash is empty"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === "shared" && "Files shared with you will appear here"}
                  {activeTab === "public" && "Create a public folder to get started"}
                  {activeTab === "trash" && "Deleted files will appear here"}
                </p>

                {/* Action Button */}
                {/* {activeTab !== "trash" && (
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                    <HiOutlinePlus className="w-4 h-4" />
                    {activeTab === "shared" ? "Browse Files" : "Create Folder"}
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FilesTab;