import React, { useEffect, useState } from "react";
import { FiFolder, FiFile, FiMoreVertical, FiX } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import {
  CreateBtn,
  UploadBtn,
  BookmarkBtn,
} from "../../components/common/CommonButtons";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import CommonFormModal from "../../components/common/CommonFormModal";
import {
  createDMSFolder,
  DMSUploadFile,
  fetchFileAndFolderList,
  getBookmarkList,
  getDMSModuleList,
  toggleBookmark,
} from "../../services/dmsService";
import CardsImplement from "../../pages/DMS/dms-modal/CardsImplement";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";

const MyFiles = () => {
  const [formData, setFormData] = useState({
    searchFiles: "",
    allModal: "",
    dropdown: "",
    searchBookmarks: "",
  });

  const [moduleOptions, setModuleOptions] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [bookmarkPage, setBookmarkPage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareType, setShareType] = useState("apiKey");
  const [apiKey, setApiKey] = useState("API-12345-ABCDE-67890");
  const [shareTarget, setShareTarget] = useState("");
  const [shareTargetValue, setShareTargetValue] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [modalFormData, setModalFormData] = useState({
    module: "",
    folderName: "",
    privacy: "private",
    tags: "",
    description: "",

  });

  const [uploadModalFormData, setUploadModalFormData] = useState({
    file: null,
    module: "",
    privacy: "private",
    tags: "",
    description: "",
  });

  const [filesData, setFilesData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loadFilesAndFolders = async () => {
    setIsLoading(true);
    try {
      const payload = {
        folderOrFileLink: "",
        type: "SELF",
        moduleCode: uploadModalFormData.module,
        searchText: formData.searchFiles || "",
        appCode: "",
      };
      const encryptedPayload = encryptPayload(payload);
      const res = await fetchFileAndFolderList(encryptedPayload);
      console.log("Fetched data:", res);
      if (res?.data?.outcome) {
        setFilesData(res.data.data || []);
      } else {
        setFilesData([]);
      }
    } catch (error) {
      console.error("Fetch files error:", error);
      toast.error("Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFilesAndFolders();
  }, [formData.searchFiles]);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalFormData({ ...modalFormData, [name]: value });
  };

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setUploadModalFormData({ ...uploadModalFormData, [name]: files[0] });
    } else {
      setUploadModalFormData({ ...uploadModalFormData, [name]: value });
    }
  };

  const handlePrivacyChange = (value) => {
    setModalFormData({ ...modalFormData, privacy: value });
  };

  const handleUploadPrivacyChange = (value) => {
    setUploadModalFormData({ ...uploadModalFormData, privacy: value });
  };


  const handleUploadClick = async () => {
    try {
      if (!uploadModalFormData.file) {
        toast.error("Please select a file");
        return;
      }
      const formData = new FormData();
      const payload = {
        moduleCode: uploadModalFormData.module,
        privacyForUpload: uploadModalFormData.privacy,
        tags: uploadModalFormData.tags,
        description: uploadModalFormData.description,
        type: "SELF",
      };
      const encryptedData = encryptPayload(payload);
      formData.append("encryptedData", encryptedData);
      formData.append("file", uploadModalFormData.file);

      const response = await DMSUploadFile(formData);
      if (response?.data?.outcome) {
        toast.success(response?.data?.message || "File uploaded successfully");
        setIsUploadModalOpen(false);
        await loadFilesAndFolders();
        setUploadModalFormData({
          file: null,
          module: "",
          privacy: "private",
          tags: "",
          description: "",
        });
      } else {
        toast.error(response?.data?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (isCreateModalOpen || isUploadModalOpen) {
      fetchModules();
    }
  }, [isCreateModalOpen, isUploadModalOpen]);

  const fetchModules = async () => {
    try {
      const res = await getDMSModuleList();
      console.log("Full API Response:", res);
      const modules = res?.data?.data?.moduleMstList || [];
      const formattedModules = modules.map((item) => ({
        value: item.id,
        label: item.moduleCode,
      }));
      setModuleOptions(formattedModules);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const getBookMarkList = async (folderOrFileLink = "", type = "SELF") => {
    try {
      const params = { folderOrFileLink, type };
      const response = await getDMSModuleList({ params });
      // => should send /list?folderOrFileLink=&type=SELF

      if (response?.data?.outcome) {
        setBookmarkData(response.data.data.bookMarkFolders || []);
      } else {
        setBookmarkData([]);
        toast.error(response.data?.message || "Failed to fetch bookmarks");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching bookmark list");
      setBookmarkData([]);
    }
  };

  useEffect(() => {
    getBookMarkList();
  }, []);


  const handleBookmarkToggle = async (item) => {
    setFilesData((prev) =>
      prev.map((it) =>
        it.folderId === item.folderId
          ? { ...it, isBookMark: !it.isBookMark }
          : it,
      ),
    );
    try {
      const response = await toggleBookmark({
        params: {
          folderOrFileLink: item.folderOrFileLink,
        },
      });
      await getBookMarkList();
      if (!response?.data?.outcome) {
        toast.error(response?.data?.message || "Bookmark update failed");
        await loadFilesAndFolders();
      }
    } catch (error) {
      console.error("Bookmark API error:", error);
      toast.error("Server error while updating bookmark");
      await loadFilesAndFolders();
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        folderUuid: null,
        moduleCode: modalFormData.module,
        folderName: modalFormData.folderName.trim(),
        privacy: modalFormData.privacy,
        tags: modalFormData.tags,
        description: modalFormData.description,
        actionCodes: [],
        type: "SELF",
      };
      const encryptedPayload = encryptPayload(payload);
      const response = await createDMSFolder(encryptedPayload);
      if (response?.data?.outcome) {
        toast.success(response?.data?.message);
        console.log("Create Folder Response:", response.data);
        setIsCreateModalOpen(false);
        await loadFilesAndFolders();
        setModalFormData({
          module: "",
          folderName: "",
          privacy: "private",
          tags: "",
          description: "",
        });
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Create folder error:", error);
      toast.error(error.message);
    }
  };



  const handleShareTypeChange = (type) => {
    setShareType(type);
  };

  const handleRegenerateApiKey = () => {
    const newKey = `API-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setApiKey(newKey);
    toast.success("API Key regenerated successfully");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  const handleLoadSharedUsers = () => {
    if (!shareTarget || !shareTargetValue) {
      toast.error("Please select target and enter value");
      return;
    }

    const newUser = {
      id: Date.now(),
      shareTo: shareTargetValue,
      type: shareTarget,
      access: "view",
    };
    setSharedUsers([...sharedUsers, newUser]);
    setShareTargetValue("");
  };

  const handleRemoveSharedUser = (id) => {
    setSharedUsers(sharedUsers.filter((user) => user.id !== id));
  };

  const handleAccessChange = (id, access) => {
    setSharedUsers(
      sharedUsers.map((user) => (user.id === id ? { ...user, access } : user)),
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex gap-3 mb-6">
                <CreateBtn
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                />
                <UploadBtn
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                />
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-gray-700">
                    <FiFolder className="text-blue-500" />
                    All Folders & Files
                  </h3>
                  <InputField
                    name="searchFiles"
                    value={formData.searchFiles}
                    onChange={handleChange}
                    placeholder="Search files & folders..."
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Module
                  </label>
                  <SelectField
                    name="module"
                    value={modalFormData.module}
                    onChange={handleModalChange}
                    options={moduleOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col">
                {/* Header */}
                <div className="mb-4 border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                    <FiBookmark className="text-purple-600" />
                    Bookmarks
                  </h3>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                  <div className="relative">
                    <InputField
                      name="searchBookmarks"
                      value={formData.searchBookmarks}
                      onChange={handleChange}
                      placeholder="Search Bookmark..."
                      type="text"
                      className="pl-9 w-full text-sm"
                    />
                  </div>
                </div>

                {/* Bookmark List */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                  {bookmarkData.length > 0 ? (
                    bookmarkData.map((item) => (
                      <div
                        key={item.folderOrFileLink}
                        className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all cursor-pointer group"
                      >
                        {/* 1. Left Icon: Folder/File */}
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-full group-hover:bg-blue-100 transition-colors">
                          <FiFolder size={16} />
                        </div>

                        {/* 2. Middle: Text Content (Aligned with search bar) */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-700 leading-tight">
                            {item.folderFileName}
                          </p>
                        </div>

                        {/* 3. Right Icon: Bookmark Indicator (Aligned properly in its own column) */}
                        <div className="flex-shrink-0 flex items-center">
                          <FiBookmark
                            className="text-purple-500"
                            fill="currentColor" // Filled icon to show it is bookmarked
                            size={14}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <FiBookmark size={32} className="mb-2 text-gray-300" />
                      <p className="text-sm">No bookmarks found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              My Files & Folders
            </h2>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <CardsImplement
                data={filesData}
                onToggleBookmark={handleBookmarkToggle}
                refreshList={loadFilesAndFolders}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      <CommonFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Folder"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-light-dark border bg-[#e3e3e3] border-light-dark text-[13px] px-3 py-1 rounded-sm transition-all active:scale-95 uppercase"
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
            >
              Create
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Module
            </label>
            <SelectField
              name="module"
              value={modalFormData.module}
              onChange={handleModalChange}
              options={moduleOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Folder Name
            </label>
            <InputField
              name="folderName"
              value={modalFormData.folderName}
              onChange={handleModalChange}
              placeholder="Enter folder name..."
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy*
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={modalFormData.privacy === "private"}
                  onChange={() => handlePrivacyChange("private")}
                  className="mr-2"
                />
                Private
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={modalFormData.privacy === "public"}
                  onChange={() => handlePrivacyChange("public")}
                  className="mr-2"
                />
                Public
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <InputField
              name="tags"
              value={modalFormData.tags}
              onChange={handleModalChange}
              placeholder="Enter tags..."
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={modalFormData.description}
              onChange={handleModalChange}
              placeholder="Enter description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </CommonFormModal>

      {/* Upload File Modal */}
      <CommonFormModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload File"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="text-light-dark border bg-[#e3e3e3] border-light-dark text-[13px] px-3 py-1 rounded-sm transition-all active:scale-95 uppercase"
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleUploadClick}
            >
              Upload
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose File
            </label>
            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <span className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="font-medium text-gray-600">
                  {uploadModalFormData.file
                    ? uploadModalFormData.file.name
                    : "Click to upload or drag and drop"}
                </span>
              </span>
              <input
                type="file"
                name="file"
                className="hidden"
                onChange={handleUploadChange}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Module
            </label>
            <SelectField
              name="module"
              value={uploadModalFormData.module}
              onChange={handleUploadChange}
              options={moduleOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy*
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={uploadModalFormData.privacy === "private"}
                  onChange={() => handleUploadPrivacyChange("private")}
                  className="mr-2"
                />
                Private
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={uploadModalFormData.privacy === "public"}
                  onChange={() => handleUploadPrivacyChange("public")}
                  className="mr-2"
                />
                Public
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <InputField
              name="tags"
              value={uploadModalFormData.tags}
              onChange={handleUploadChange}
              placeholder="Enter tags..."
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={uploadModalFormData.description}
              onChange={handleUploadChange}
              placeholder="Enter description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </CommonFormModal>
    </div>
  );
};

export default MyFiles;
