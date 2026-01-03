import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { editViewRoleService, getRoleInfoService, roleListService, saveRoleService, toggleRoleStatusService } from "../../services/umtServices";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { GoPencil } from "react-icons/go";
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReusableDialog from "../../components/common/ReusableDialog";

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
  const [open, setOpen] = useState(false)

  const [errors, setErrors] = useState({})

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = {
        ...formData,
        roleCode: roleCode.trim(),
        displayName: displayName.trim(),
        description: description?.trim(),
        maxAssignments: maxAssignments ? Number(maxAssignments) : null
      };

      const payload = encryptPayload(sendData);
      const res = await saveRoleService(payload);

      if (res.status === 200 && res?.data.outcome) {
        setOpen(false)
        toast.success(res?.data.message);
        resetForm();
        getTableData();
      }
      else {
        setOpen(false)
        toast.error(res?.data.message);
      }
    } catch (error) {
      setOpen(false)
      console.error("Submit Error:", error);
    }
    finally {
      setOpen(false)
    }

  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();

    let newErrors = {}
    if (!roleCode || !roleCode.trim()) {
      newErrors.roleCode = "Role code is required";
      setErrors(newErrors);
      return;
    }
    if (!displayName || !displayName.trim()) {
      newErrors.displayName = "Display name is required";
      setErrors(newErrors);
      return;
    }
    if (!maxAssignments) {
      newErrors.maxAssignments = "Max assignments is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setOpen(true)
    }
    else {
      setOpen(false)
    }
  }
  const [openModal, setOpenModal] = useState(false)
  const [addRoleID, setAddRoleID] = useState({
    id: '',
    stat: ''
  })



  const handleEditClick = async (id) => {
    try {
      const payload = encryptPayload({
        isActive: true,
        roleId: id
      })
      const res = await editViewRoleService(payload)
      console.log(res);
      if (res?.status == 200 && res?.data.outcome) {
        setFormData(res?.data.data)
        setIsEditing(true)
        setErrors({})
      }
    } catch (error) {
      throw error
    }
  };

  const handleViewClick = async (id) => {
    try {
      const payload = encryptPayload({
        isActive: true,
        roleId: id
      })
      const res = await editViewRoleService(payload)
      console.log(res);
      if (res?.status == 200 && res?.data.outcome) {
        setFormData(res?.data.data)
        setIsEditing(false)
      }
    } catch (error) {
      throw error
    }
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
      // console.log(res);

      if (res?.data.outcome && res?.status === 200) {
        setTableData(res?.data.data);
      }
    } catch (error) {
      console.error(error);
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
      name: "Max Assignments",
      selector: (row) => row.maxAssignments || "N/A",
      center: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.isActive ? "Active" : "Inactive",
      center: true,
      width: "80px",
      cell: (row) => (
        <span className={`px-2 py-1 rounded-sm text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      name: "Remarks",
      selector: (row) => row.description || "N/A",
      width: "250px",


    },
    {
      name: "Action",
      width: "200px",
      cell: (row) => (
        <div className="flex items-center flex-wrap p-3 gap-2">
          {/* VIEW BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full hover:bg-blue-500/40 transition-colors"
            onClick={() => handleViewClick(row.roleId)}
            title="View Role Details"
          >
            <FaEye className="w-4 h-4" />
          </button>

          {/* EDIT BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-green-500/25 text-green-500 rounded-full hover:bg-green-500/40 transition-colors"
            onClick={() => handleEditClick(row.roleId)}
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
            onClick={() => {
              setAddRoleID({
                id: row.roleId,
                stat: row.isActive,
              });
              setOpenModal(true)
            }

            }
          >
            {row.isActive ? (
              <MdLockOutline className="w-4 h-4" />
            ) : (
              <MdLockOpen className="w-4 h-4" />
            )}
          </button>

          {/* PERMISSIONS LINK BUTTON */}
          < button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-purple-500/25 text-purple-500 rounded-full hover:bg-purple-500/40 transition-colors"
            onClick={() => handlePermissionsClick(row.roleId)}
            title="Manage Permissions"
          >
            <FaLink className="w-4 h-4" />
          </button >
        </div >
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const toggleStatus = async () => {
    try {
      const payload = encryptPayload({
        roleId: addRoleID?.id,
        isActive: !addRoleID?.stat

      })
      const res = await toggleRoleStatusService(payload)
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setOpenModal(false)
        getTableData()
        toast.success(res?.data.message)
      }
      else {
        setOpenModal(false)
        getTableData()
        toast.error(res?.data.message)
      }
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  const navigate = useNavigate()
  const handlePermissionsClick = async (roleId) => {
    try {
      const payload = encryptPayload(roleId)
      const res = await getRoleInfoService(payload)
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        navigate('/get-role-access', { state: res?.data.data })
      }
    } catch (error) {
      throw error
    }
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
            Add Role

          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <form className="grid grid-cols-12 gap-6" onSubmit={handleConfirmSubmit}>
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
                error={errors.roleCode}
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
                error={errors.displayName}

              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Maximum Assignments"
                type="number"
                required={true}
                name="maxAssignments"
                value={maxAssignments}
                onChange={handleChangeInput}
                readOnly={!isEditing && formData.roleId}
                disabled={!isEditing && formData.roleId}
                placeholder="Enter number"
                min="0"
                error={errors.maxAssignments}

              />
            </div>
            <div className="col-span-3">
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

            <div className="col-span-2 flex justify-start gap-2 text-[13px] px-4 py-6">
              <ResetBackBtn />
              {(isEditing || !roleId) && (
                <SubmitBtn type="submit" btnText={roleId} />
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
            Role List
          </h3>
        </div>

        {/* Body */}
        <div className="py-5 px-4 text-[#444]">
          <ReusableDataTable
            data={tableData}
            columns={roleColumn}
            pagination={true}
            highlightOnHover={true}
          />
        </div>
      </div>
      <ReusableDialog
        open={openModal}
        // title="Change Status"
        description="Are you sure you want to change status?"
        onClose={() => setOpenModal(false)}
        onConfirm={toggleStatus}
      />
      <ReusableDialog
        open={open}
        // title="Submit"
        description="Are you sure you want to submit?"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
      />
    </>
  );
};

export default ManageRole;