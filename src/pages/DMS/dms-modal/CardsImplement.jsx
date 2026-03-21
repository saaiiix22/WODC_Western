import React, { useState, useEffect, useRef } from "react";
import {
  FiFolder,
  FiFile,
  FiImage,
  FiVideo,
  FiFileText,
  FiMoreVertical,
  FiBookmark,
  FiEye,
  FiDownload,
  FiTrash2,
  FiX,
  FiExternalLink,
  FiShare,
  FiLink,
  FiRefreshCw,
  FiCopy,
  FiLock,
} from "react-icons/fi";
import { DMSDeleteFolderOrFile, DMSDownloadFile, generateAPIKeys, loadTableData, shareTheTableData } from "../../../services/dmsService";
import { toast } from "react-toastify";
import ReusableDataTable from "../../../components/common/ReusableDataTable";

const CardsImplement = ({ data, onToggleBookmark, refreshList }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToShare, setItemToShare] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [shareOption, setShareOption] = useState("apiKey");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAccessDropdown, setOpenAccessDropdown] = useState(null);

  const [profileTableData, setProfileTableData] = useState([]);
  const [profileColumns, setProfileColumns] = useState([]);

  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId) {
        const dropdownElement = dropdownRefs.current[openDropdownId];
        if (
          dropdownElement &&
          !dropdownElement.contains(event.target) &&
          !event.target.closest("button")
        ) {
          setOpenDropdownId(null);
        }
      }
      if (openAccessDropdown) {
        const accessDropdownElement =
          dropdownRefs.current[`access-${openAccessDropdown}`];
        if (
          accessDropdownElement &&
          !accessDropdownElement.contains(event.target) &&
          !event.target.closest("button")
        ) {
          setOpenAccessDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId, openAccessDropdown]);


  const generateRandomApiKey = async (item) => {
    try {
      const response = await generateAPIKeys(
        item.folderOrFileLink,
        1
      );

      if (response?.data?.outcome) {
        setApiKey(response?.data?.data?.apiKey);
        toast.success(response.data.message || "API Key generated successfully");
      } else {
        toast.error(response?.data?.message || "Failed to generate API key");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to generate API key"
      );
    }
  };


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

  const getDocumentIcon = (type, documentTypeCode) => {
    if (type === "FOLDER") {
      return <FiFolder className="text-blue-500 text-4xl" />;
    } else if (documentTypeCode === "PDF") {
      return <span className="text-red-500 text-4xl font-bold">PDF</span>;
    } else if (documentTypeCode === "IMAGE") {
      return <FiImage className="text-green-500 text-4xl" />;
    } else {
      return <FiFile className="text-gray-500 text-4xl" />;
    }
  };

  const getActionIcon = (actionCode) => {
    switch (actionCode) {
      case "VIEW":
        return <FiEye className="h-4 w-4" />;
      case "DOWNLOAD":
        return <FiDownload className="h-4 w-4" />;
      case "DELETE":
        return <FiTrash2 className="h-4 w-4" />;
      default:
        return <FiEye className="h-4 w-4" />;
    }
  };

  const handleCardAction = (item, action) => {
    if (action.actionCode === "DELETE") {
      openDeleteModal(item);
    } else {
      console.log(`Action: ${action.actionName} on item: ${item.folderFileName}`);
    }
  };

  const openDeleteModal = (item) => {
    console.log("Opening delete modal for:", item.folderFileName);
    setItemToDelete(item);
    setOpenDropdownId(null);
    setTimeout(() => {
      setDeleteModalOpen(true);
    }, 10);
  };

  const openShareModal = (item) => {
    setItemToShare(item);
    setOpenDropdownId(null);
    setShareModalOpen(true);
  };

  const handleDropdownAction = (item, action) => {
    console.log(`Dropdown action: ${action} on item: ${item.folderFileName}`);

    if (action === "delete") {
      openDeleteModal(item);
      return;
    }

    if (action === "share") {
      openShareModal(item);
      return;
    }
    setOpenDropdownId(null);
    switch (action) {
      case "open":
        console.log(`Opening ${item.folderFileName}`);
        break;
      case "download":
        handleDownload(item);
        break;
      case "copyLink":
        const link = `https://yourapp.com/files/${item.folderId}`;
        navigator.clipboard
          .writeText(link)
          .then(() => {
            toast.success("Link copied to clipboard");
          })
          .catch((err) => {
            console.error("Failed to copy link: ", err);
            toast.error("Failed to copy link");
          });
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.folderOrFileLink) return;
    try {
      const response = await DMSDeleteFolderOrFile(itemToDelete.folderOrFileLink);
      if (response?.data?.outcome) {
        toast.success(response.data.data?.message || "Deleted successfully");
        setDeleteModalOpen(false);
        setItemToDelete(null);
        await refreshList();
      } else {
        toast.error(response?.data?.message || "Failed to delete item");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleModalClose = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
    setItemToShare(null);
    setApiKey(""); // reset key
    setSharedUsers([]);
    setUserInput("");
    setSelectedRows([]);
  };
  const handleRegenerateApiKey = async () => {
    if (!itemToShare) return;
    await generateRandomApiKey(itemToShare);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        toast.success("API key copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy API key: ", err);
        toast.error("Failed to copy API key");
      });
  };

  const handleShareWithUsers = async () => {
    if (!itemToShare) {
      toast.error("No file/folder selected");
      return;
    }
    if (!profileTableData || profileTableData.length === 0) {
      toast.error("No profiles loaded");
      return;
    }
    try {
      // Collect selected profiles & actions
      const profiles = profileTableData
        .map((row) => {
          const selectedActions = Object.keys(row)
            .filter(
              (key) =>
                ![
                  "sl",
                  "profileId",
                  "profileName",
                  "profileCode",
                  "isAllReadyShared",
                ].includes(key) && row[key] === true
            )
            .map(() => "1");
          return {
            profileId: row.profileId,
            profileCode: row.profileCode,
            actions: selectedActions,
          };
        })
        .filter((profile) => profile.actions.length > 0);
      if (profiles.length === 0) {
        toast.error("Please select at least one action");
        return;
      }
      const shareObject = {
        fileFolderLink: itemToShare.folderOrFileLink,
        profiles: profiles,
        shareEntityCode: userInput.toUpperCase(),
      };
      const encodedData = btoa(JSON.stringify(shareObject));
      const formData = new URLSearchParams();
      formData.append("shareEntityData", encodedData);
      formData.append("folderOrFileLink", itemToShare.folderOrFileLink);
      const response = await shareTheTableData(formData);
      if (response?.data?.outcome) {
        toast.success(response.data.message || "Shared successfully");
        handleShareModalClose();
        refreshList();
      } else {
        toast.error(response?.data?.message || "Failed to share");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleActionToggle = (profileId, action) => {
    setProfileTableData((prev) =>
      prev.map((row) => {
        if (row.profileId !== profileId) return row;

        return {
          ...row,
          [action.actionName]: !row[action.actionName],
        };
      })
    );
  };

  const prepareProfileTable = (response) => {
    const { profiles, allActions } = response.data;

    // Transform rows
    const formattedData = profiles.map((profile, index) => {
      const actionMap = {};

      allActions.forEach((action) => {
        actionMap[action.actionName] =
          profile.actions?.some(
            (a) => a.actionId === action.actionId
          ) || false;
      });

      return {
        sl: index + 1,
        profileId: profile.profileId,
        profileName: profile.profileName,
        profileCode: profile.profileCode,
        isAllReadyShared: profile.isAllReadyShared,
        ...actionMap,
      };
    });

    setProfileTableData(formattedData);
    const dynamicColumns = [
      {
        name: "Sl",
        selector: (row) => row.sl,
        sortable: true,
        center: true,
        exportValue: (row) => row.sl,
      },
      {
        name: "Share-to",
        selector: (row) => row.profileName,
        sortable: true,
        exportValue: (row) => row.profileName,
      },
      {
        name: "Profile Code",
        selector: (row) => row.profileCode,
        sortable: true,
        exportValue: (row) => row.profileCode,
      },

      // 🔥 Dynamic Action Columns
      ...allActions.map((action) => ({
        name: action.actionName,
        center: true,
        cell: (row) => (
          <input
            type="checkbox"
            checked={row[action.actionName]}
            disabled={row.isAllReadyShared}
            onChange={() =>
              handleActionToggle(row.profileId, action)
            }
          />
        ),
        exportValue: (row) =>
          row[action.actionName] ? "Yes" : "No",
      })),
    ];

    setProfileColumns(dynamicColumns);
  };


  const handleLoadSharedUsers = async () => {
    if (!userInput) {
      toast.error("Please select Role or User");
      return;
    }

    try {
      const response = await loadTableData(
        userInput.toUpperCase(),
        itemToShare.folderOrFileLink,
        true
      );

      if (response?.data?.outcome) {
        prepareProfileTable(response.data);
        toast.success("Users loaded successfully");
      } else {
        toast.error(response?.data?.message || "Failed to load users");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemoveSharedUser = (id) => {
    setSharedUsers(sharedUsers.filter((user) => user.id !== id));
    setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  };

  const handleAccessChange = (id) => {
    setSharedUsers(
      sharedUsers.map((user) =>
        user.id === id
          ? {
            ...user,
            access: {
              ...user.access,
              view: !user.access.view,
            },
          }
          : user
      )
    );
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === sharedUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sharedUsers.map((user) => user.id));
    }
  };

  const toggleAccessDropdown = (id) => {
    setOpenAccessDropdown(openAccessDropdown === id ? null : id);
  };

  const handleShare = () => {
    console.log("Sharing with users:", sharedUsers.filter(u => selectedRows.includes(u.id)));
    toast.success("Shared successfully");
    handleShareModalClose();
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No files or folders found
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((item) => (
          <div
            key={item.folderId}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {getDocumentIcon(item.folderOrFile, item.documentTypeCode)}
                </div>
                <div className="relative">
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    onClick={() => toggleDropdown(item.folderId)}
                  >
                    <FiMoreVertical className="h-5 w-5" />
                  </button>

                  {openDropdownId === item.folderId && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      ref={(el) => (dropdownRefs.current[item.folderId] = el)}
                    >
                      <div className="py-1">
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownAction(item, "open");
                          }}
                        >
                          <FiExternalLink className="mr-3 h-4 w-4" />
                          Open
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownAction(item, "delete");
                          }}
                        >
                          <FiTrash2 className="mr-3 h-4 w-4" />
                          Delete
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownAction(item, "share");
                          }}
                        >
                          <FiShare className="mr-3 h-4 w-4" />
                          Share
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownAction(item, "download");
                          }}
                        >
                          <FiDownload className="mr-3 h-4 w-4" />
                          Download
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownAction(item, "copyLink");
                          }}
                        >
                          <FiLink className="mr-3 h-4 w-4" />
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <h3
                className="font-medium text-gray-800 mb-1 truncate"
                title={item.folderFileName}
              >
                {item.folderFileName}
              </h3>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{item.sizeStr}</span>
                {item.isPublic && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs">
                    Public
                  </span>
                )}
              </div>

              <div className="flex items-center text-xs text-gray-500 mb-3">
                <span>Owner: {item.owner}</span>
              </div>

              <div className="flex items-center text-xs text-gray-500 mb-3">
                <span>Modified: {item.updatedTimeWithAmPm}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex space-x-1">
                  {item.actionList && item.actionList.map((action) => (
                    <button
                      key={action.id}
                      className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      title={action.actionName}
                      onClick={() => handleCardAction(item, action)}
                    >
                      {getActionIcon(action.actionCode)}
                    </button>
                  ))}
                </div>

                <button
                  className={`p-1.5 rounded transition-colors ${item.isBookMark
                    ? "text-yellow-500 hover:bg-yellow-50"
                    : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                    }`}
                  title={item.isBookMark ? "Remove bookmark" : "Add bookmark"}
                  onClick={() => onToggleBookmark(item)}
                >
                  <FiBookmark
                    className={`h-4 w-4 ${item.isBookMark ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100">
            <div className="relative">
              <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-t-2xl"></div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiTrash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Delete Item
                  </h3>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  onClick={handleModalClose}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    Are you sure you want to delete this item? This action
                    cannot be undone.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">
                      Item to be deleted:
                    </p>
                    <p className="font-semibold text-gray-900 text-lg mb-1">
                      {itemToDelete?.folderFileName || ""}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {itemToDelete?.folderOrFile || ""}</span>
                      <span>•</span>
                      <span>ID: {itemToDelete?.folderId || ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={handleDeleteConfirm}
                >
                  <span className="flex items-center space-x-2">
                    <FiTrash2 className="h-4 w-4" />
                    <span>Delete Permanently</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100">
            <div className="relative">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-xl"></div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiShare className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Share {itemToShare?.folderOrFile || "Folder/File"}
                  </h3>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  onClick={handleShareModalClose}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                <p className="text-xs text-gray-500 mb-1">Sharing:</p>
                <p className="font-medium text-gray-900 text-sm mb-1">
                  {itemToShare?.folderFileName || ""}
                </p>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>Type: {itemToShare?.folderOrFile || ""}</span>
                  <span>•</span>
                  <span>ID: {itemToShare?.folderId || ""}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <label
                  className={`flex items-center cursor-pointer p-2 rounded-lg border transition-all ${shareOption === "apiKey"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="shareOption"
                    value="apiKey"
                    checked={shareOption === "apiKey"}
                    onChange={() => setShareOption("apiKey")}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-blue-700 font-semibold text-sm">
                    Share through API Key
                  </span>
                </label>
                <label
                  className={`flex items-center cursor-pointer p-2 rounded-lg border transition-all ${shareOption === "individual"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="shareOption"
                    value="individual"
                    checked={shareOption === "individual"}
                    onChange={() => setShareOption("individual")}
                    className="w-3.5 h-3.5 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-green-700 font-semibold text-sm">
                    Individual
                  </span>
                </label>
              </div>

              {shareOption === "apiKey" && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex space-x-2 mb-3">
                    <button
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
                      onClick={handleRegenerateApiKey}
                    >
                      <FiRefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </button>
                    <button
                      className="flex-1 px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
                      onClick={handleCopyApiKey}
                    >
                      <FiCopy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        <FiLock className="inline h-3 w-3 mr-1" />
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={apiKey}
                          readOnly
                          className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs"
                        />
                        <FiLock className="absolute right-2 top-2 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        View Access
                      </label>
                      <select className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs">
                        <option value="view">View</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {shareOption === "individual" && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Share to
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-xs bg-white appearance-none cursor-pointer"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                        >
                          <option value="">--select--</option>
                          <option value="Role">Role</option>
                          <option value="User">User</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-3.5 h-3.5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        onClick={handleLoadSharedUsers}
                      >
                        Load
                      </button>
                    </div>
                  </div>

                  {profileTableData.length > 0 && (
                    <ReusableDataTable
                      data={profileTableData}
                      columns={profileColumns}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium"
                  onClick={handleShareWithUsers}
                >
                  Share
                </button>
                <button
                  type="button"
                  className="px-4 py-1.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                  onClick={handleShareModalClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsImplement;