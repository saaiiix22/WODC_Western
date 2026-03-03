import React, { useState, useRef, useEffect } from "react";
import {
  FiFolder,
  FiMoreVertical,
  FiEye,
  FiBookmark,
  FiTrash2,
  FiFile,
  FiImage,
  FiFileText,
  FiShare,
  FiLink,
  FiDownload,
  FiExternalLink,
  FiX,
} from "react-icons/fi";

const CardsImplement = ({ data }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [itemToShare, setItemToShare] = useState(null);
  const [shareOption, setShareOption] = useState("apiKey"); 
  const [apiKey, setApiKey] = useState("sk-1234567890abcdef"); 
  const [itemToDelete, setItemToDelete] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      const isOutsideAllDropdowns = Object.values(dropdownRefs.current).every(
        (ref) => !ref || !ref.contains(event.target),
      );

      if (isOutsideAllDropdowns) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sample data for 3 additional cards
  const sampleCards = [
    {
      folderId: "sample1",
      folderFileName: "Project Documents",
      folderOrFile: "FOLDER",
      documentTypeCode: "FOLDER",
      sizeStr: "3.5 MB",
      owner: "Sample User",
      updatedTimeWithAmPm: "2 days ago",
      isPublic: true,
      isBookMark: false,
      actionList: [
        { id: "a1", actionCode: "VIEW", actionName: "View" },
        { id: "a2", actionCode: "DOWNLOAD", actionName: "Download" },
        { id: "a3", actionCode: "DELETE", actionName: "Delete" },
      ],
    },
   
  ];

  const getDocumentIcon = (type, documentTypeCode) => {
    if (type === "FOLDER") {
      return <FiFolder className="text-blue-500 text-4xl" />;
    } else if (documentTypeCode === "PDF") {
      return <FiFileText className="text-red-500 text-4xl" />;
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
      console.log(
        `Action: ${action.actionName} on item: ${item.folderFileName}`,
      );
    }
  };

  const handleBookmarkToggle = (item) => {
    console.log(`Toggle bookmark for: ${item.folderFileName}`);
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
    console.log("Opening share modal for:", item.folderFileName);
    setItemToShare(item);
    setOpenDropdownId(null); 
 
    setTimeout(() => {
      setShareModalOpen(true);
    }, 10);
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
        console.log(`Downloading ${item.folderFileName}`);
        break;
      case "copyLink":
        const link = `https://yourapp.com/files/${item.folderId}`;
        navigator.clipboard
          .writeText(link)
          .then(() => {
            console.log(`Link copied to clipboard: ${link}`);
          })
          .catch((err) => {
            console.error("Failed to copy link: ", err);
          });
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    console.log(`Deleting ${itemToDelete?.folderFileName}`);
  
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleModalClose = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
    setItemToShare(null);
  };

  const handleRegenerateApiKey = () => {
 
    const newApiKey = "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newApiKey);
    console.log("Generated new API key");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        console.log("API key copied to clipboard");
     
      })
      .catch((err) => {
        console.error("Failed to copy API key: ", err);
      });
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {data?.map((item) => (
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
                      className="absolute right-0 mt-2 w-48 bg-white  rounded-md shadow-lg z-10 border border-gray-200"
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
                  {item.actionList.map((action) => (
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
                  className={`p-1.5 rounded transition-colors ${
                    item.isBookMark
                      ? "text-yellow-500 hover:bg-yellow-50"
                      : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                  }`}
                  title={item.isBookMark ? "Remove bookmark" : "Add bookmark"}
                  onClick={() => handleBookmarkToggle(item)}
                >
                  <FiBookmark
                    className={`h-4 w-4 ${item.isBookMark ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}

  
        {sampleCards.map((item) => (
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
                  {item.actionList.map((action) => (
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
                  className={`p-1.5 rounded transition-colors ${
                    item.isBookMark
                      ? "text-yellow-500 hover:bg-yellow-50"
                      : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                  }`}
                  title={item.isBookMark ? "Remove bookmark" : "Add bookmark"}
                  onClick={() => handleBookmarkToggle(item)}
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
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100">
           
            <div className="relative">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl"></div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiShare className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Share {itemToShare?.folderOrFile || "Folder/File"}
                  </h3>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  onClick={handleShareModalClose}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

  
            <div className="px-6 py-6">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Sharing:</p>
                  <p className="font-semibold text-gray-900 text-lg mb-1">
                    {itemToShare?.folderFileName || ""}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Type: {itemToShare?.folderOrFile || ""}</span>
                    <span>•</span>
                    <span>ID: {itemToShare?.folderId || ""}</span>
                  </div>
                </div>

              
                <div className="space-y-3 mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="shareOption"
                      value="apiKey"
                      checked={shareOption === "apiKey"}
                      onChange={() => setShareOption("apiKey")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Share through API Key</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="shareOption"
                      value="individual"
                      checked={shareOption === "individual"}
                      onChange={() => setShareOption("individual")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Individual</span>
                  </label>
                </div>

         
                {shareOption === "apiKey" && (
                  <div className="flex space-x-3 mb-6">
                    <button
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      onClick={handleRegenerateApiKey}
                    >
                      Regenerate API Key
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      onClick={handleCopyApiKey}
                    >
                      Copy API Key
                    </button>
                  </div>
                )}

             
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={shareOption === "apiKey" ? apiKey : ""}
                      placeholder="Enter API key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly={shareOption === "apiKey"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      View
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="restricted">Restricted</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
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