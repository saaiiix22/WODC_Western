import React, { use, useEffect, useState } from "react";
import { FiEdit, FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { width } from "@mui/system";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { enc } from "crypto-js";
import ReusableDialog from "../../components/common/ReusableDialog";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import { GoPencil } from "react-icons/go";
import { MdCheck, MdClose, MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import SelectField from "../../components/common/SelectField";
import { editGrievanceService, getCategoryListService, saveUpdateGrievanceService } from "../../services/grievanceService";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    grievanceCategoryId: null,
    grievanceCategoryName: "",
    grvCtgCode: "",
    virtualGrv: "",
    active: "",
  });

  const {
    grievanceCategoryId,
    grievanceCategoryName,
    grvCtgCode,
    virtualGrv,
    active,
  } = formData;
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);

  
  const handleInp = (e) => {
    const { name, value } = e.target;
  
    let finalValue = value;
  
    if (name === "virtualGrv" || name === "active") {
      finalValue = value === "true" ? true : value === "false" ? false : "";
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
      ...(name === "grievanceCategoryName" && {
        grvCtgCode: generategrvCtgCode(value),
      }),
    }));
  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  

  const generategrvCtgCode = (name) => {
    if (!name) return "";

    const prefix = name
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 4)
      .toUpperCase();

    const randomLength = Math.floor(Math.random() * 3) + 3; 
    const min = Math.pow(10, randomLength - 1);
    const max = Math.pow(10, randomLength) - 1;
    const uniqueNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return `${prefix}_${uniqueNumber}`;
  };

  //

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [gactive, setGactive] = useState("");



  const handleOnConfirm = (e) => {
    e.preventDefault();
    let newErrors = {};
    console.log(newErrors);
    console.log(errors);
    if (!grievanceCategoryName.trim()) {
      setOpen(false);
      newErrors.grievanceCategoryName = "Please Enter grievanceCategoryName ";
      setErrors(newErrors);
      return;
    }
    if (!grvCtgCode.trim()) {
      newErrors.grvCtgCode = "Please Enter grvCtgCode";
      setErrors(newErrors);
      return;
    }
    if (!virtualGrv) {
      newErrors.virtualGrv = "Please Select virtualGrv";
      setErrors(newErrors);
      return;
    }
    if (!active) {
      newErrors.active = "Please Select active";
      setErrors(newErrors);
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      setOpen(true)
    }
  };

  const handleSubmit = async (e) => {

    
    const sendData = {
      grievanceCategoryId,
      grievanceCategoryName,
      grvCtgCode,
      virtualGrv,
      active,
    };
    const payload = encryptPayload(sendData);

    try {
      const res = await saveUpdateGrievanceService(payload);
       getTableData();
      setFormData({
        grievanceCategoryId: null,
        grievanceCategoryName: "",
        grvCtgCode: "",
        virtualGrv: "",
        active: "",
      });
      setOpen(false);
      if (res?.data.outcome && res?.status === 200) {
        toast.success(res?.data.message);
        setOpen(false)
      } else {
        toast.error(res?.data.message);
        setOpen(false)
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setOpen(false);
      setFormData({
        grievanceCategoryId: null,
        grievanceCategoryName: "",
        grvCtgCode: "",
        virtualGrv: "",
        active: "",
      });
    }
  };

  const GrievanceCategoryList = [
    {
      name: "Sl No.",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Category Type",
      selector: (row) => row.grievanceCategoryName || "N/A",
    },
    {
      name: "Category Code",
      selector: (row) => row.grvCtgCode || "N/A",
    },

    {
      name: "Active",
      selector: (row) => (row.active ? "Active" : "Inactive"),
    },
    

    {
      name: "Action",
      selector: (row) => (
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
            onClick={() => editGrievance(row.grievanceCategoryId)}
          >
            <FiEdit className="w-4 h-4" />
          </button>
         
        </div>
      ),
    },
  ];

  const grievanceOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const activeOptions = [
    { value: true, label: "Active" },
    { value: false, label: "inActive" },
  ];

  const getTableData = async () => {
    try {
      
         const res = await getCategoryListService();
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const editGrievance = async (id) => {
    try {
      const payload = encryptPayload({
        grvCtgId: id,  
      });
  
      const res = await editGrievanceService(payload);
  
      const data = res?.data?.data;
  
      setFormData({
        grievanceCategoryId: data?.grievanceCategoryId ?? null,
        grievanceCategoryName: data?.grievanceCategoryName ?? "",
        grvCtgCode: data?.grvCtgCode ?? "",
        virtualGrv: data?.virtualGrv ?? "",
        active: data?.active ?? "",
      });
    } catch (error) {
      console.error(error);
    }
  };
  

  

    useEffect(() => {
      getTableData();
    }, []);

  return (
    <>
      <form action="" onSubmit={handleOnConfirm}>
        <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ">
          {/* Header */}
          <div className="p-0">
            <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md  ">
              <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded " />
              Add Category
            </h3>
          </div>

          {/* Body */}
          <div className="min-h-[120px] py-5 px-4 text-[#444]">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2">
                <InputField
                  label={"Grievance Category"}
                  required={true}
                  name="grievanceCategoryName"
                  value={grievanceCategoryName}
                  onChange={handleInp}
                  maxLength={100}
                  error={errors.grievanceCategoryName}
                />
              </div>
              <div className="col-span-2">
                <InputField
                  label="Grievance Category Code"
                  required
                  name="grvCtgCode"
                  value={grvCtgCode}
                  error={errors.grvCtgCode}
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Is Virtual Grievance:"
                  required={true}
                  name="virtualGrv"
                  value={virtualGrv}
                  onChange={handleInp}
                  options={grievanceOptions}
                  placeholder="Select"
                  error={errors.virtualGrv}
                />
              </div>
              <div className="col-span-2">
                <SelectField
                  label="Is Active:"
                  required={true}
                  name="active"
                  value={active}
                  onChange={handleInp}
                  options={activeOptions}
                  placeholder="Select"
                  error={errors.active}
                />
              </div>
            </div>
          </div>

          {/* Footer (Optional) */}
          <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn type={"submit"} btnText={grievanceCategoryId} />
          </div>
        </div>
      </form>

      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ">
        {/* Header */}
        <div className="p-0">
          <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md ">
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded " />
            Category List
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <ReusableDataTable data={tableData} columns={GrievanceCategoryList} />
        </div>

        <ReusableDialog
          onClose={() => setOpen(false)}
          onConfirm={handleSubmit}
          open={open}
          title={"Confirmation"}
          description={"Do you want to continue"}
        />
      </div>
    </>
  );
};

export default AddCategory;
