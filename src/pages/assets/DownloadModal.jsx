import React, { useState } from 'react'
import SelectField from '../../components/common/SelectField';

const DownloadModal = ({onClose}) => {

    const [filters, setFilters] = useState({
        sector:"",
        subSector:"",
        assetType:"",
        assetCategory:""
    })

    const handleDownload = () => {
        console.log("download");
        onclose();
        
    }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-[600px]">

        <div className="flex justify-between items-center px-4 py-2 bg-light-dark text-white rounded-t-md">
          <h3 className="text-sm font-medium">
            Download Asset Excel Template
          </h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className="px-5 py-4 grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <SelectField label="Sector" required />
          </div>
          <div className="col-span-6">
            <SelectField label="Sub Sector" required />
          </div>
          <div className="col-span-6">
            <SelectField label="Asset Type" required />
          </div>
          <div className="col-span-6">
            <SelectField label="Asset Category" />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-4 py-3 border-t bg-[#fafafa]">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Cancel
          </button>
          <button className="px-4 py-1 bg-[#4caf50] text-white rounded">
            Download
          </button>
        </div>

      </div>
    </div>
  )
}

export default DownloadModal