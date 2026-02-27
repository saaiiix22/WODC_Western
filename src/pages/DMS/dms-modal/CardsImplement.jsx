import React, { useState, useEffect, useRef } from 'react';
import { FiFolder, FiMoreVertical, FiEye, FiBookmark, FiTrash2, FiFile, FiImage, FiFileText, FiShare, FiLink, FiDownload, FiExternalLink, FiX } from 'react-icons/fi';

const CardsImplement = () => {
  // State for dropdown visibility
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // State for delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState({});
  
  // Ref to track if modal was opened
  const modalOpenRef = useRef(false);
  
  // Sample wireframe data
  const cardsData = [
    { id: 1, name: 'lll', type: 'folder', size: '2.4 MB', owner: 'John Doe', modified: '2 days ago', isPublic: true, isBookmarked: false, moduleCode: 'CD_EV' },
    { id: 2, name: 'Report.pdf', type: 'pdf', size: '1.2 MB', owner: 'Jane Smith', modified: '1 week ago', isPublic: false, isBookmarked: true, moduleCode: 'DOC' },
    { id: 3, name: 'Design Mockups', type: 'folder', size: '5.6 MB', owner: 'Mike Johnson', modified: '3 days ago', isPublic: false, isBookmarked: false, moduleCode: 'UI' },
    { id: 4, name: 'Dashboard.png', type: 'image', size: '856 KB', owner: 'Sarah Williams', modified: '5 days ago', isPublic: true, isBookmarked: false, moduleCode: 'IMG' },
    { id: 5, name: 'Presentation.pptx', type: 'file', size: '3.2 MB', owner: 'David Brown', modified: '1 day ago', isPublic: false, isBookmarked: true, moduleCode: 'PPT' },
    { id: 6, name: 'Analytics', type: 'folder', size: '4.8 MB', owner: 'Emily Davis', modified: '4 days ago', isPublic: false, isBookmarked: false, moduleCode: 'DATA' },
    { id: 7, name: 'Budget.xlsx', type: 'file', size: '1.8 MB', owner: 'Robert Wilson', modified: '2 weeks ago', isPublic: false, isBookmarked: false, moduleCode: 'XLS' },
    { id: 8, name: 'Logo.svg', type: 'image', size: '24 KB', owner: 'Lisa Anderson', modified: '6 days ago', isPublic: true, isBookmarked: true, moduleCode: 'SVG' },
  ];
  
  // Toggle dropdown for a specific card
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  
  // Handle delete action
  const handleDelete = (item) => {
    console.log('handleDelete called with:', item);
    setDebugInfo({
      action: 'handleDelete',
      item: item.name,
      timestamp: new Date().toLocaleTimeString()
    });
    
    setItemToDelete(item);
    setOpenDropdownId(null); // Close dropdown first
    
    // Force state update with a slight delay
    setTimeout(() => {
      setDeleteModalOpen(true);
      modalOpenRef.current = true;
      setDebugInfo(prev => ({
        ...prev,
        modalOpenSet: true,
        timestamp: new Date().toLocaleTimeString()
      }));
      console.log('deleteModalOpen set to true');
    }, 10);
  };
  
  // Handle actual delete confirmation
  const handleDeleteConfirm = () => {
    console.log(`Deleting ${itemToDelete?.name}`);
    // Here you would make an API call to delete the item
    setDeleteModalOpen(false);
    modalOpenRef.current = false;
    setItemToDelete(null);
    setDebugInfo({
      action: 'handleDeleteConfirm',
      item: itemToDelete?.name,
      timestamp: new Date().toLocaleTimeString()
    });
  };
  
  // Handle modal close
  const handleModalClose = () => {
    setDeleteModalOpen(false);
    modalOpenRef.current = false;
    setItemToDelete(null);
    setDebugInfo({
      action: 'handleModalClose',
      timestamp: new Date().toLocaleTimeString()
    });
  };
  
  // Get icon based on type
  const getIcon = (type) => {
    switch (type) {
      case 'folder':
        return <FiFolder className="text-blue-500 text-4xl" />;
      case 'pdf':
        return <FiFileText className="text-red-500 text-4xl" />;
      case 'image':
        return <FiImage className="text-green-500 text-4xl" />;
      default:
        return <FiFile className="text-gray-500 text-4xl" />;
    }
  };
  
  // Debug effect to track modal state
  useEffect(() => {
    console.log('deleteModalOpen changed:', deleteModalOpen);
    setDebugInfo(prev => ({
      ...prev,
      modalState: deleteModalOpen,
      timestamp: new Date().toLocaleTimeString()
    }));
  }, [deleteModalOpen]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId && !event.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div className="bg-gray-50">
    
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cardsData.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-4">
              {/* Header with icon and menu */}
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {getIcon(card.type)}
                </div>
                <div className="relative dropdown-container">
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(card.id);
                    }}
                  >
                    <FiMoreVertical className="h-5 w-5" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openDropdownId === card.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <FiExternalLink className="mr-3 h-4 w-4" />
                          Open
                        </button>
                        <button 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(card);
                          }}
                        >
                          <FiTrash2 className="mr-3 h-4 w-4" />
                          Delete
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <FiShare className="mr-3 h-4 w-4" />
                          Share
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <FiDownload className="mr-3 h-4 w-4" />
                          Download
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <FiLink className="mr-3 h-4 w-4" />
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Card Title */}
              <h3 className="font-medium text-gray-800 mb-1 truncate">
                {card.name}
              </h3>
              
              {/* Card Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{card.size}</span>
                {card.isPublic && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs">
                    Public
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <span>Owner: {card.owner}</span>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <span>Modified: {card.modified}</span>
              </div>
              
              {/* Card Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex space-x-1">
                  <button className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" title="View">
                    <FiEye className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Download">
                    <FiDownload className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" 
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(card);
                    }}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  className={`p-1.5 rounded transition-colors ${
                    card.isBookmarked 
                      ? "text-yellow-500 hover:bg-yellow-50" 
                      : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                  }`}
                  title={card.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <FiBookmark className={`h-4 w-4 ${card.isBookmarked ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    
      {/* Delete Confirmation Modal */}
     {deleteModalOpen && (
  <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100">
      {/* Modal Header with gradient accent */}
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
      
      {/* Modal Body */}
      <div className="px-6 py-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-gray-700 mb-3 leading-relaxed">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Item to be deleted:</p>
              <p className="font-semibold text-gray-900 text-lg mb-1">
                {itemToDelete?.name || ''}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Code: {itemToDelete?.moduleCode || ''}</span>
                <span>•</span>
                <span>ID: {itemToDelete?.id || ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Footer */}
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
    </div>
  );
};

export default CardsImplement;