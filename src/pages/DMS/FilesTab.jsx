import React, { useEffect, useState } from "react";
import {
  HiOutlineShare,
  HiOutlineFolder,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineFolderOpen,
  HiOutlineRefresh,
  HiOutlineDownload,
} from "react-icons/hi";

import {
  DMSDownloadFile,
  getPublicFolderTabList,
  getShareWithMeTabList,
  getTrashFolderTabList,
  recoverTrashFolderOrFiles,
} from "../../services/dmsService";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";

const FilesTab = () => {
  const [activeTab, setActiveTab] = useState("shared");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [folderOrFileLink, setFolderOrFileLink] = useState("");

  /* ---------------------- Tabs ---------------------- */

  const tabs = [
    { id: "shared", label: "Shared With Me", icon: HiOutlineShare },
    { id: "public", label: "Public Folders", icon: HiOutlineFolder },
    { id: "trash", label: "Trash Folders", icon: HiOutlineTrash },
  ];

  /* ---------------------- Columns ---------------------- */

  const columns = [
    {
      name: "Sl No",
      width: "80px",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "File/Folder Name",
      selector: (row) => row.folderFileName,
      sortable: true,
      exportValue: (row) => row.name,
    },
    {
      name: "Size",
      selector: (row) => row.sizeStr,
      sortable: true,
      exportValue: (row) => row.sizeStr,
    },
    {
      name: "Modified Date",
      selector: (row) => row.updatedTimeWithAmPm,
      exportValue: (row) => row.updatedTimeWithAmPm,
    },
    {
      name: "Owner",
      selector: (row) => row.owner,
      exportValue: (row) => row.owner,
    },
    {
      name: "Action",
      width: "100px",
      center: true,
      cell: (row) => (
        <div className="flex justify-center gap-3">

          {/* Download Icon for Shared & Public */}
          {(activeTab === "shared" || activeTab === "public") && (
            <HiOutlineDownload
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(row);
              }}
              className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800 transition"
              title="Download"
            />
          )}

          {/* Recover Icon for Trash */}
          {activeTab === "trash" && (
            <HiOutlineRefresh
              onClick={(e) => {
                e.stopPropagation();
                handleRecover(row);
              }}
              className="w-5 h-5 text-green-600 cursor-pointer hover:text-green-800 transition"
              title="Recover"
            />
          )}
        </div>
      ),
    }
  ];

  /* ---------------------- Fetch Logic ---------------------- */


  const handleDownload = async (item) => {
    try {
      const payload = {
        fileLink: item.folderOrFileLink,
      };
      const response = await DMSDownloadFile(payload);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.folderFileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    }
  };

  const handleRecover = async (row) => {
    try {
      if (!row?.folderOrFileLink) return;
      const confirmRecover = window.confirm(
        `Are you sure you want to recover "${row.folderFileName}"?`
      );
      if (!confirmRecover) return;
      const payload = {
        folderOrFileLink: row.folderOrFileLink,
      };
      const encrypted = encryptPayload(payload);
      const response = await recoverTrashFolderOrFiles(encrypted);
      if (response?.data?.status === "SUCCESS" || response?.status === 200) {
        toast.success("Recovered successfully");
        fetchData(); // Refresh trash list
      } else {
        toast.error("Recover failed");
      }
    } catch (err) {
      console.error("Recover failed:", err);
      toast.error("Something went wrong");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let res;

      if (activeTab === "shared") {
        res = await getShareWithMeTabList({
          folderOrFileLink: folderOrFileLink || "",
        });
        setTableData(res?.data?.data || []);
      }
      if (activeTab === "public") {
        res = await getPublicFolderTabList({
          folderOrFileLink: folderOrFileLink || "",
        });
        setTableData(res?.data?.data || []);
      }
      if (activeTab === "trash") {
        res = await getTrashFolderTabList();
        setTableData(res?.data?.data?.folderAndFiles || []);
      }
    } catch (error) {
      console.error("Tab Fetch Error:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeTab, folderOrFileLink]);

  /* ---------------------- Row Click ---------------------- */

  const handleRowClick = (row) => {
    if (row?.folderOrFileLink) {
      setFolderOrFileLink(row.folderOrFileLink);
    }
  };

  /* ---------------------- UI ---------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Card */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Tabs */}
          <div className="border-b px-6">
            <div className="flex gap-2 py-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFolderOrFileLink(""); // reset on tab change
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                      ${isActive
                        ? "bg-blue-50 text-blue-700 border"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : tableData.length > 0 ? (
              <ReusableDataTable
                data={tableData}
                columns={columns}
                loading={loading}
                onRowClicked={handleRowClick}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "shared" && (
                    <HiOutlineShare className="w-10 h-10 text-gray-400" />
                  )}
                  {activeTab === "public" && (
                    <HiOutlineFolder className="w-10 h-10 text-gray-400" />
                  )}
                  {activeTab === "trash" && (
                    <HiOutlineTrash className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === "shared" && "No shared files"}
                  {activeTab === "public" && "No public folders"}
                  {activeTab === "trash" && "Trash is empty"}
                </h3>

                <p className="text-gray-500">
                  {activeTab === "shared" &&
                    "Files shared with you will appear here"}
                  {activeTab === "public" &&
                    "Create a public folder to get started"}
                  {activeTab === "trash" &&
                    "Deleted files will appear here"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesTab;