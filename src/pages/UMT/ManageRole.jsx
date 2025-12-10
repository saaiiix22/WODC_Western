import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { roleListService, saveRoleService } from "../../services/umtServices";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { GoPencil } from "react-icons/go";
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaLink } from "react-icons/fa";

const ManageRole = () => {
  const [formData, setFormData] = useState({
    roleId: null,
    roleCode: '',
    displayName: '',
    description: '',
    maxAssignments: ''
  });

  const { roleId, roleCode, displayName, description, maxAssignments } = formData;
  const [isEditing, setIsEditing] = useState(false);
  const [tableData, setTableData] = useState([]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const sendData = {
        ...formData,
        maxAssignments: maxAssignments ? Number(maxAssignments) : null
      };
      
      console.log("Submitting data:", sendData);
      
      const payload = encryptPayload(sendData);
      const res = await saveRoleService(payload);
      
      if (res.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message || (isEditing ? "Role updated successfully!" : "Role created successfully!"));
        resetForm();
        getTableData(); // Refresh table
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong while saving role");
    }
  };

  const handleEditClick = (row) => {
    // Directly set form data from row object
    setFormData({
      roleId: row.roleId || null,
      roleCode: row.roleCode || '',
      displayName: row.displayName || '',
      description: row.description || '',
      maxAssignments: row.maxAssignments?.toString() || ''
    });
    
    setIsEditing(true);
    toast.success("Role loaded for editing");
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewClick = (row) => {
    // Directly set form data from row object for view mode
    setFormData({
      roleId: row.roleId,
      roleCode: row.roleCode || '',
      displayName: row.displayName || '',
      description: row.description || '',
      maxAssignments: row.maxAssignments?.toString() || ''
    });
    
    setIsEditing(false); // Set to view mode
    toast.info("Role details loaded (view mode)");
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      roleId: null,
      roleCode: '',
      displayName: '',
      description: '',
      maxAssignments: ''
    });
    setIsEditing(false);
  };

  const getTableData = async () => {
    try {
      const payload = encryptPayload(true);
      const res = await roleListService(payload);
      
      if (res?.data.outcome && res?.status === 200) {
        setTableData(res?.data.data);
      }
    } catch (error) {
      console.error("Table Data Error:", error);
      toast.error("Failed to load role list");
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  const roleColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Role Code",
      selector: (row) => row.roleCode || "N/A",
      sortable: true,
    },
    {
      name: "Display Name",
      selector: (row) => row.displayName || "N/A",
    },
    {
      name: "Remarks",
      selector: (row) => row.description || "N/A",
    },
    {
      name: "Max Assignments",
      selector: (row) => row.maxAssignments || "N/A",
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row.isActive ? "Active" : "Inactive",
      center: true,
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      name: "Action",
      width: "140px",
      cell: (row) => (
        <div className="flex items-center flex-wrap p-3 gap-2">
          {/* VIEW BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full hover:bg-blue-500/40 transition-colors"
            onClick={() => handleViewClick(row)}
            title="View Role Details"
          >
            <FaEye className="w-4 h-4" />
          </button>
          
          {/* EDIT BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-green-500/25 text-green-500 rounded-full hover:bg-green-500/40 transition-colors"
            onClick={() => handleEditClick(row)}
            title="Edit Role"
          >
            <GoPencil className="w-4 h-4" />
          </button>

          {/* ACTIVE / INACTIVE BUTTON */}
          <button
            className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors
              ${row.isActive
                ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                : "bg-red-500/25 hover:bg-red-600/25 text-red-500"
              }`}
            title={row.isActive ? "Active - Click to Deactivate" : "Inactive - Click to Activate"}
            onClick={() => toggleStatus(row.roleId, row.isActive)}
          >
            {row.isActive ? (
              <MdLockOutline className="w-4 h-4" />
            ) : (
              <MdLockOpen className="w-4 h-4" />
            )}
          </button>
          
          {/* PERMISSIONS LINK BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-purple-500/25 text-purple-500 rounded-full hover:bg-purple-500/40 transition-colors"
            onClick={() => handlePermissionsClick(row.roleId)}
            title="Manage Permissions"
          >
            <FaLink className="w-4 h-4" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const toggleStatus = async (roleId, currentStatus) => {
    try {
      // You can implement status toggle logic here
      toast.info(`Toggle status for role ID: ${roleId} from ${currentStatus ? 'Active' : 'Inactive'} to ${!currentStatus ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error("Failed to update status");
    }
  };

  const handlePermissionsClick = (roleId) => {
    // Implement permission management logic
    toast.info(`Manage permissions for role ID: ${roleId}`);
  };

  return (
    <>
      <div
        className="
          mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
          shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        "
      >
        {/* Header */}
        <div className="p-0">
          <h3
            className="
              flex items-center gap-2 text-white font-normal text-[18px]
              border-b-2 border-[#ff9800] px-3 py-2
              bg-light-dark rounded-t-md
            "
          >
            <FiFileText
              className="
                text-[#fff2e7] text-[24px] p-1
                bg-[#ff7900] rounded
              "
            />
            {isEditing ? 'Edit Role' : formData.roleId ? 'View Role' : 'Add Role'}
            {isEditing && (
              <span className="text-sm ml-2 bg-yellow-500 text-white px-2 py-1 rounded">
                Editing Mode - ID: {formData.roleId}
              </span>
            )}
            {formData.roleId && !isEditing && (
              <span className="text-sm ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                View Mode - ID: {formData.roleId}
              </span>
            )}
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <form className="grid grid-cols-12 gap-6" onSubmit={handleSubmit}>
            <div className="col-span-2">
              <InputField
                label="Role Code"
                required={true}
                name="roleCode"
                value={roleCode}
                onChange={handleChangeInput}
                readOnly={!isEditing && formData.roleId}
                disabled={!isEditing && formData.roleId}
                placeholder="Enter role code"
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Display Name"
                required={true}
                name="displayName"
                value={displayName}
                onChange={handleChangeInput}
                readOnly={!isEditing && formData.roleId}
                disabled={!isEditing && formData.roleId}
                placeholder="Enter display name"
              />
            </div>
            <div className="col-span-4">
              <InputField
                label="Description"
                name="description"
                value={description}
                textarea={true}
                onChange={handleChangeInput}
                readOnly={!isEditing && formData.roleId}
                disabled={!isEditing && formData.roleId}
                placeholder="Enter description"
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Maximum Assignments"
                type="number"
                name="maxAssignments"
                value={maxAssignments}
                onChange={handleChangeInput}
                readOnly={!isEditing && formData.roleId}
                disabled={!isEditing && formData.roleId}
                placeholder="Enter number"
                min="0"
              />
            </div>
            <div className="col-span-2 flex justify-start gap-2 text-[13px] px-4 py-3 mt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                {formData.roleId ? 'Cancel' : 'Reset'}
              </button>
              
              {/* Show Update button only when editing */}
              {isEditing ? (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Update Role
                </button>
              ) : !formData.roleId ? (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create Role
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  Switch to Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div
        className="
          mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
          shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        "
      >
        {/* Header */}
        <div className="p-0">
          <h3
            className="
              flex items-center gap-2 text-white font-normal text-[18px]
              border-b-2 border-[#ff9800] px-3 py-2
              bg-light-dark rounded-t-md
            "
          >
            <FiFileText
              className="
                text-[#fff2e7] text-[24px] p-1
                bg-[#ff7900] rounded
              "
            />
            Role List ({tableData.length} roles)
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <ReusableDataTable 
            data={tableData} 
            columns={roleColumn} 
            pagination={true}
            highlightOnHover={true}
          />
        </div>
      </div>
    </>
  );
};

export default ManageRole;