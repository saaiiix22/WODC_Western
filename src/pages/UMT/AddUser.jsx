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
  // saveAddUserService,
  saveUserService,
} from "../../services/umtServices";
import { toast } from "react-toastify";

const AddUser = () => {
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

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    const sendData = {
      userId,
      userName,
      firstname,
      lastname,
      mobile,
      email,
      designation,
      userRoleMaps: rows,
    };
    try {
      const payload = encryptPayload(sendData)
      // const res = await saveAddUserService(payload)
      // console.log(res);
      
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

  const getAllPrimaryRoleOpts = async () => {
    try {
      const payload = encryptPayload(true);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllRoleOpts();
  }, []);

  const [rows, setRows] = useState([
    {
      isPrimary: "",
      roleCodes: "",
      activeStatus: "",
    },
  ]);

  const handleAddRow = () => [
    setRows([
      ...rows,
      {
        isPrimary: "",
        roleCodes: "",
        activeStatus: "",
      },
    ]),
  ];

  const handleInput = (index, name, value) => {
    const updated = [...rows];
    updated[index][name] = value;
    setRows(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  return (
    <form onSubmit={handleSubmit}>
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
                label="User Id"
                required={true}
                name="userName"
                value={userName}
                onChange={handleChangeInput}
                //   error={errors.agencyName}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="First Name"
                required={true}
                name="firstname"
                value={firstname}
                onChange={handleChangeInput}
                //   error={errors.agencyName}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Last Name"
                required={true}
                name="lastname"
                value={lastname}
                onChange={handleChangeInput}
                //   error={errors.agencyName}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Mobile"
                required={true}
                name="mobile"
                value={mobile}
                onChange={handleChangeInput}
                maxLength={10}
                //   error={errors.agencyName}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Email"
                required={true}
                name="email"
                value={email}
                onChange={handleChangeInput}
                //   error={errors.agencyName}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Designation"
                required={true}
                name="designation"
                value={designation}
                onChange={handleChangeInput}
                //   error={errors.agencyName}
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
                              Number(e.target.value)
                            )
                          }
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
            <SubmitBtn type={"submit"} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddUser;
