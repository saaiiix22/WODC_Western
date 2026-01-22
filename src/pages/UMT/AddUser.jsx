import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import InputField from "../../components/common/InputField";
import { MdOutlineAddCircle } from "react-icons/md";
import SelectField from "../../components/common/SelectField";
import { FaMinusCircle } from "react-icons/fa";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { encryptPayload } from "../../crypto.js/encryption";
import {
  getRoleListService,
  saveAddUserService,
  saveUserService,
} from "../../services/umtServices";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import ReusableDialog from "../../components/common/ReusableDialog";
import { validateContactNoUtil } from "../../utils/validationUtils";
import { useTranslation } from "react-i18next";

const AddUser = () => {

  const { t } = useTranslation("addUser")

  const [formData, setFormData] = useState({
    userId: null,
    userName: "",
    firstname: "",
    lastname: "",
    designation: "",
    mobile: "",
    email: "",
  });

  const { userId, userName, firstname, lastname, mobile, email, designation } =
    formData;

  const userLoc = useLocation()
  const { state } = userLoc


  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "mobile") {
      const errorMsg = validateContactNoUtil(value);
      setErrors((prev) => ({
        ...prev,
        mobile: errorMsg,
      }));
    }
    else if (name === "userName") {
      if (value.length < 4) {
        setErrors((prev) => ({
          ...prev,
          userName: 'Enter valid username',
        }));
      }
      else {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
    else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const confirmHandleSubmit = (e) => {
    e.preventDefault()
    let newErrors = {}
    if (!formData.userName || !formData.userName.trim()) {
      newErrors.userName = "Username is required";
      setErrors(newErrors);
      return;
    }
    if (!formData.firstname || !formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
      setErrors(newErrors);
      return;
    }
    if (!formData.lastname || !formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
      setErrors(newErrors);
      return;
    }
    if (!formData.mobile || !formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      setErrors(newErrors);
      return;
    }
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
      setErrors(newErrors);
      return;
    }
    if (!formData.designation || !formData.designation.trim()) {
      newErrors.designation = "Designation is required";
      setErrors(newErrors);
      return;
    }
    if (rows.length === 0) {
      toast.error("Please add at least one role");
      return;
    }

    const incompleteRowIndex = rows.findIndex((row) => !isRowComplete(row));
    if (incompleteRowIndex !== -1) {
      toast.error(`Please complete role row ${incompleteRowIndex + 1}`);
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOpen(true);
    }
    else {
      setOpen(false)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData);
    const sendData = {
      userId,
      userName: userName.trim(),
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      designation: designation.trim(),
      userRoleMaps: rows,
    };
    try {
      const payload = encryptPayload(sendData)
      const res = await saveAddUserService(payload)
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setOpen(false)
        toast.success(res?.data.message)
        setFormData({
          userId: null,
          userName: "",
          firstname: "",
          lastname: "",
          designation: "",
          mobile: "",
          email: "",
        })
        setRows([
          {
            isPrimary: '',
            roleCodes: '',
            activeStatus: ''
          }
        ])
      }
      else {
        setOpen(false)
        toast.error(res?.data.message)
        setFormData({
          userId: null,
          userName: "",
          firstname: "",
          lastname: "",
          designation: "",
          mobile: "",
          email: "",
        })
      }
    } catch (error) {
      throw error
    }
  };

  const [getRoleOpts, setRoleOpts] = useState([]);
  const [getPrimaryRoleOpts, setPrimaryRoleOpts] = useState([]);

  const getAllRoleOpts = async () => {
    try {
      const payload = encryptPayload(true);
      const res = await getRoleListService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setRoleOpts(res?.data.data);
        setPrimaryRoleOpts(res?.data.data);
      } else {
        toast.error("INTERNAL SERVER ERROR");
      }
    } catch (error) {
      throw error;
    }
  };


  useEffect(() => {
    getAllRoleOpts();
  }, []);

  const [rows, setRows] = useState([
    {
      roleCodes: "",
      isPrimary: "",
      activeStatus: "",
    },
  ]);
  const isRowComplete = (row) => {
    return (
      row.roleCodes !== "" &&
      row.isPrimary !== "" &&
      row.activeStatus !== ""
    );
  };

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (!isRowComplete(lastRow)) {
      toast.error("Please complete the current row before adding a new one");
      return;
    }

    setRows([
      ...rows,
      {
        roleCodes: "",
        isPrimary: "",
        activeStatus: "",
      },
    ]);
  };


  const handleInput = (index, name, value) => {
    const updated = rows.map((row, i) => {

      if (name === "isPrimary" && value === "true") {
        return {
          ...row,
          isPrimary: i === index ? "true" : "false",
        };
      }

      if (i === index) {
        return {
          ...row,
          [name]: value,
        };
      }

      return row;
    });

    setRows(updated);
  };

  const [lock, setLock] = useState(true)

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  useEffect(() => {
    if (state) {
      setFormData({
        userId: state?.userId,
        userName: state?.userName,
        firstname: state?.firstname,
        lastname: state?.lastname,
        designation: state?.designation,
        mobile: state?.mobile,
        email: state?.email,
      })
      setRows(state?.userRoleMaps)
      setLock(state?.isActive)
    }
  }, [state])

  return (
    <form onSubmit={confirmHandleSubmit}>
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
            Add User
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          {/* Content Here */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <InputField
                // label="Username"
                label={t("username")}
                required={true}
                name="userName"
                value={userName}
                disabled={lock === false ? true : false}
                onChange={handleChangeInput}
                error={errors.userName}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label={t("firstName")}
                required={true}
                name="firstname"
                value={firstname}
                disabled={lock === false ? true : false}
                onChange={handleChangeInput}
                error={errors.firstname}
              />
            </div>
            <div className="col-span-2">
              <InputField
                // label="Last Name"
                label={t("lastName")}
                required={true}
                name="lastname"
                value={lastname}
                disabled={lock === false ? true : false}
                onChange={handleChangeInput}
                error={errors.lastname}
              />
            </div>
            <div className="col-span-2">
              <InputField
                // label="Mobile"
                label={t("mob")}
                required={true}
                name="mobile"
                value={mobile}
                disabled={lock === false ? true : false}
                onChange={handleChangeInput}
                maxLength={10}
                error={errors.mobile}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label={t("email")}
                required={true}
                name="email"
                value={email}
                disabled={lock === false ? true : false}
                onChange={handleChangeInput}
                error={errors.email}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label={t("designation")}
                required={true}
                name="designation"
                value={designation}
                disabled={lock === false ? true : false}
                onChange={handleChangeInput}
                error={errors.designation}
              />
            </div>
          </div>

          <div className="col-span-12">
            <table className="table-fixed w-full border border-slate-300 mt-5">
              <thead className="bg-slate-100">
                <tr>
                  <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
                    SL No
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Primary Role
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Role
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Status
                  </td>

                  <td className="w-[60px] text-center text-sm px-4 py-1 border-r border-slate-200">
                    <button type="button" onClick={handleAddRow}>
                      <MdOutlineAddCircle className="inline text-green-600 text-xl" />
                    </button>
                  </td>
                </tr>
              </thead>
              <tbody>
                {rows?.length > 0 &&
                  rows.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="border-r border-b text-[13px] text-center border-slate-200 px-2 py-1">
                        {index + 1}
                      </td>
                      <td className="border-r border-b border-slate-200 px-2 py-1">
                        <SelectField
                          name="isPrimary"
                          value={row.isPrimary}
                          options={[
                            { value: true, label: "True" },
                            { value: false, label: "False" },
                          ]?.map((i) => ({
                            value: i.value,
                            label: i.label,
                          }))}
                          disabled={lock === false ? true : false}

                          onChange={(e) =>
                            handleInput(
                              index,
                              "isPrimary",
                              e.target.value
                            )
                          }

                          placeholder="--Select--"
                        />
                      </td>
                      <td className="border-r border-b border-slate-200 px-2 py-1">

                        <SelectField
                          name="roleCodes"
                          value={row.roleCodes}
                          onChange={(e) =>
                            handleInput(
                              index,
                              "roleCodes",
                              e.target.value
                            )
                          }
                          disabled={lock === false ? true : false}

                          options={getRoleOpts?.map((i) => ({
                            value: i.roleCode,
                            label: i.displayName,
                          }))}
                          placeholder="--Select--"
                        />
                      </td>
                      <td className="border-r border-b border-slate-200 px-2 py-1">
                        <SelectField
                          name="activeStatus"
                          value={row.activeStatus}
                          onChange={(e) =>
                            handleInput(
                              index,
                              "activeStatus",
                              e.target.value
                            )
                          }
                          disabled={lock === false ? true : false}

                          options={[
                            { value: true, label: "Active" },
                            { value: false, label: "Inactive" },
                          ]?.map((i) => ({
                            value: i.value,
                            label: i.label,
                          }))}
                          placeholder="--Select--"
                        />
                      </td>
                      <td className="border-r border-b border-slate-200 px-2 py-1 text-center">
                        {rows.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <FaMinusCircle />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

          </div>

          {/* Footer (Optional) */}
          <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md mt-5">
            <ResetBackBtn />
            {lock === false ? "" : (
              <SubmitBtn type={"submit"} btnText={state?.userId} />
            )}

          </div>
        </div>
      </div>
      <ReusableDialog
        open={open}
        // title="Submit"
        description="Are you sure you want to submit?"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
      />
    </form>
  );
};

export default AddUser;
