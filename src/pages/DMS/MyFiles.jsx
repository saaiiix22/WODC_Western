import React, { useEffect, useState } from 'react';
import { FiFolder, FiFile } from 'react-icons/fi';
import { FiBookmark } from "react-icons/fi";
import { CreateBtn, UploadBtn, BookmarkBtn } from '../../components/common/CommonButtons';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import CommonFormModal from '../../components/common/CommonFormModal';
// import { getDMSModuleList } from '../../services/dmsService';
// Import the CardsImplement component
import CardsImplement from '../../pages/DMS/dms-modal/CardsImplement'; // Adjust the path as needed

const MyFiles = () => {
  const [formData, setFormData] = useState({
    searchFiles: '',
    allModal: '',
    dropdown: '',
    searchBookmarks: ''
  });

  const [moduleOptions, setModuleOptions] = useState([]);
  // State for controlling the "Create Folder" modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for controlling the "Upload File" modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // State for the form data inside the "Create Folder" modal
  const [modalFormData, setModalFormData] = useState({
    module: '',
    folderName: '',
    privacy: 'private',
    tags: '',
    description: ''
  });

  // State for the form data inside the "Upload File" modal
  const [uploadModalFormData, setUploadModalFormData] = useState({
    file: null,
    module: '',
    privacy: 'private',
    tags: '',
    description: ''
  });

  // State for storing the files/folders data
  const [filesData, setFilesData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle changes in the "Create Folder" modal form
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalFormData({ ...modalFormData, [name]: value });
  };

  // Handle changes in the "Upload File" modal form
  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setUploadModalFormData({ ...uploadModalFormData, [name]: files[0] });
    } else {
      setUploadModalFormData({ ...uploadModalFormData, [name]: value });
    }
  };

  // Handle radio button change for "Create Folder"
  const handlePrivacyChange = (value) => {
    setModalFormData({ ...modalFormData, privacy: value });
  };

  // Handle radio button change for "Upload File"
  const handleUploadPrivacyChange = (value) => {
    setUploadModalFormData({ ...uploadModalFormData, privacy: value });
  };

  // Handle create button click
  const handleCreateClick = () => {
    console.log('Create Folder form data:', modalFormData);
    setIsCreateModalOpen(false);
    // After creating a folder, you might want to refresh the files data
    // For now, we'll just log it
  };

  // Handle upload button click
  const handleUploadClick = () => {
    console.log('Upload File form data:', uploadModalFormData);
    setIsUploadModalOpen(false);
    // After uploading a file, you might want to refresh the files data
    // For now, we'll just log it
  };

  useEffect(() => {
    if (isCreateModalOpen) {
      fetchModules();
    }
  }, [isCreateModalOpen]);

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


  return (
    <div className="bg-gray-50">
      <div className="container">
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

                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-gray-700">
                    <FiFile className="text-green-500" />
                    All Modal
                  </h3>
                  <InputField
                    name="allModal"
                    value={formData.allModal}
                    onChange={handleChange}
                    placeholder="Enter modal details..."
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-700">
                  <FiBookmark className="text-purple-500" />
                  Bookmarks
                </h3>
                <BookmarkBtn
                  type="button"
                  onClick={() => console.log('Bookmark clicked')}
                  bookmarked={false}
                />
              </div>

              <div className="mb-4">
                <InputField
                  name="searchBookmarks"
                  value={formData.searchBookmarks}
                  onChange={handleChange}
                  placeholder="Search Bookmark..."
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section - Add this after the grid */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">My Files & Folders</h2>
            {/* Pass the filesData to CardsImplement. 
                If filesData is null, it will use the sample data from CardsImplement */}
            <CardsImplement data={filesData} />
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
              onClick={handleCreateClick}
            >
              Create
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Module</label>
            <SelectField
              name="module"
              value={modalFormData.module}
              onChange={handleModalChange}
              options={moduleOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
            <InputField name="folderName" value={modalFormData.folderName} onChange={handleModalChange} placeholder="Enter folder name..." type="text" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privacy*</label>
            <div className="flex space-x-4">
              <label className="flex items-center"><input type="radio" name="privacy" value="private" checked={modalFormData.privacy === 'private'} onChange={() => handlePrivacyChange('private')} className="mr-2" />Private</label>
              <label className="flex items-center"><input type="radio" name="privacy" value="public" checked={modalFormData.privacy === 'public'} onChange={() => handlePrivacyChange('public')} className="mr-2" />Public</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <InputField name="tags" value={modalFormData.tags} onChange={handleModalChange} placeholder="Enter tags..." type="text" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={modalFormData.description} onChange={handleModalChange} placeholder="Enter description..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          {/* Choose File Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose File
            </label>
            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <span className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="font-medium text-gray-600">
                  {uploadModalFormData.file ? uploadModalFormData.file.name : 'Click to upload or drag and drop'}
                </span>
              </span>
              <input type="file" name="file" className="hidden" onChange={handleUploadChange} />
            </label>
          </div>

          {/* Select Module Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Module</label>
            <SelectField name="module" value={uploadModalFormData.module} onChange={handleUploadChange} options={moduleOptions} />
          </div>

          {/* Privacy Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privacy*</label>
            <div className="flex space-x-4">
              <label className="flex items-center"><input type="radio" name="privacy" value="private" checked={uploadModalFormData.privacy === 'private'} onChange={() => handleUploadPrivacyChange('private')} className="mr-2" />Private</label>
              <label className="flex items-center"><input type="radio" name="privacy" value="public" checked={uploadModalFormData.privacy === 'public'} onChange={() => handleUploadPrivacyChange('public')} className="mr-2" />Public</label>
            </div>
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <InputField name="tags" value={uploadModalFormData.tags} onChange={handleUploadChange} placeholder="Enter tags..." type="text" />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={uploadModalFormData.description} onChange={handleUploadChange} placeholder="Enter description..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </CommonFormModal>
    </div>
  );
};

export default MyFiles;