import React, { Fragment, useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useEffect } from "react";
import { GoPencil } from "react-icons/go";
import { MdLockOutline, MdOutlineAddCircle } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import {
  editMilestoneService,
  getMilesStoneListService,
  saveMilesStoneService,
  toggleMilestoneStatusService,
} from "../../services/milesStoneService";
import SelectField from "../../components/common/SelectField";
import { districtList } from "../../services/demographyService";
import { FaMinusCircle } from "react-icons/fa";
import { getBankNamesService } from "../../services/budgetService";
import {
  getAgencyDetailsService,
  saveAgencySerice,
} from "../../services/agencyService";
import {
  editVendorService,
  getVendorDataService,
  saveVendorDetailsService,
  toggleVendorStatusService,
} from "../../services/vendorService";
import {
  cleanAadhaarUtil,
  cleanContactNoUtil,
  cleanEmailUtil,
  IFSCutil,
  validateAadhaarUtil,
  validateAccountNoUtil,
  validateContactNoUtil,
  validateEmailUtil,
  validateIfscUtil,
  onlyNumberUtil,
  ifscUtil,
  accountNumberUtil,
} from "../../utils/validationUtils";
import { Tooltip } from "@mui/material";

const VendorPage = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    vendorId: null,
    vendorName: "",
    contactNo: "",
    email: "",
    aadhaarNo: "",
    address: "",
    districtId: "",
  });
  const {
    vendorId,
    vendorName,
    contactNo,
    email,
    address,
    aadhaarNo,
    districtId,
  } = formData;
  
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };
  
  const formatDateMMDDYY = (dateStr) => {
    if (!dateStr) return "";
    const [dd, mm, yyyy] = dateStr.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (name === "aadhaarNo") {
      updatedValue = cleanAadhaarUtil(updatedValue);
    }
    if (name === "contactNo") {
      updatedValue = cleanContactNoUtil(updatedValue);
    }
    if (name === "email") {
      updatedValue = cleanEmailUtil(updatedValue);
    }
    // CLEAR ERROR WHEN USER TYPES
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData({ ...formData, [name]: updatedValue });
  };

  const [distOptions, setDistOptions] = useState([]);
  const getAllDistsOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await districtList(payload);
      // console.log(res);
      setDistOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  
  const [bankNameOptions, setBankNameOptions] = useState([]);
  const getAllBankOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getBankNamesService(payload);
      // console.log(res);
      setBankNameOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  const [rows, setRows] = useState([
    {
      bankId: "",
      branchName: "",
      accountNo: "",
      ifscCode: "",
      bankName: "",
      vendorBankId: null,
    },
  ]);

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (
      !lastRow.bankId ||
      !lastRow.branchName.trim() ||
      !lastRow.accountNo.trim() ||
      !lastRow.ifscCode.trim()
    ) {
      toast.error(
        "Please fill all fields in the previous row before adding a new one"
      );
      return;
    }

    // Add new row
    setRows([
      ...rows,
      {
        bankId: "",
        branchName: "",
        accountNo: "",
        ifscCode: "",
        bankName: "",
        vendorBankId: null,
      },
    ]);
  };
  
  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };
 const handleInput = (index, name, value) => {
  const updated = [...rows];

  if (name === "accountNo") {
    value = accountNumberUtil(value); // digits only
  }

  if (name === "ifscCode") {
    value = ifscUtil(value); // uppercase + format
  }

  updated[index][name] = value;
  setRows(updated);
};
  
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);
  
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};
    
    
    
    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }

    if (!vendorName || !vendorName.trim()) {
      newErrors.vendorName = "Vendor name is required";
      setErrors(newErrors);
      return;
    }
    
    if (!aadhaarNo || !aadhaarNo.trim()) {
      newErrors.aadhaarNo = "Aadhar number is required";
      setErrors(newErrors);
      return;
    }
    
    if (!validateAadhaarUtil(aadhaarNo)) {
      newErrors.aadhaarNo =
        "Invalid Aadhaar number (must be 12 digits and cannot start with 0 or 1)";
      setErrors(newErrors);
      return;
    }
    
    const contactError = validateContactNoUtil(contactNo);
    if (contactError) {
      setErrors((prev) => ({ ...prev, contactNo: contactError }));
      return;
    }

    const emailError = validateEmailUtil(email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    // Validate bank details rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!row.bankId) {
        toast.error(` Bank Name is required in Row ${i + 1}`);
        return;
      }

      if (!row.branchName || !row.branchName.trim()) {
        toast.error(`Branch Name is required in Row ${i + 1}`);
        return;
      }

      if (!validateAccountNoUtil(row.accountNo)) {
        toast.error(
          `Invalid Account Number (must be 8–18 digits) in Row ${i + 1}`
        );
        return;
      }

      if (!validateIfscUtil(row.ifscCode)) {
        toast.error(`Invalid IFSC Code format in Row ${i + 1}`);
        return;
      }
    }
    
    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      vendorId,
      vendorName,
      contactNo,
      email,
      address,
      aadhaarNo,
      districtId,
      vendorBankDetailsDtoList: rows,
    };
    console.log(sendData);
    
    try {
      const payload = encryptPayload(sendData);
      const res = await saveVendorDetailsService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        setOpenSubmit(false);
        setExpanded("panel2");
        toast.success(res?.data.message);
        getVendorTable();
        setFormData({
          vendorId: null,
          vendorName: "",
          contactNo: "",
          email: "",
          address: "",
          aadhaarNo: "",
          districtId: "",
        });
        setRows([
          {
            bankId: "",
            branchName: "",
            accountNo: "",
            ifscCode: "",
            bankName: "",
            vendorBankId: null,
          },
        ]);
      } else {
        toast.error(res?.data.message);
        setFormData({
          vendorId: null,
          vendorName: "",
          contactNo: "",
          email: "",
          address: "",
          aadhaarNo: "",
          districtId: "",
        });
        setRows([
          {
            bankId: "",
            branchName: "",
            accountNo: "",
            ifscCode: "",
            bankName: "",
            vendorBankId: null,
          },
        ]);
      }
    } catch (error) {
      throw error;
    }
  };

  const [tableData, setTableData] = useState([]);
  const getVendorTable = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getVendorDataService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data || []);
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getVendorTable();
    getAllDistsOptions();
    getAllBankOptions();
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const editMilestone = async (id) => {
    try {
      const payload = encryptPayload({ vendorId: id });
      const res = await editVendorService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setFormData(res?.data.data);
        setRows(res?.data.data.vendorBankDetailsDtoList);
        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };

  const [openVendorId, setVendorId] = useState("");

  const toggleStatus = async () => {
    try {
      const payload = encryptPayload({ vendorId: openVendorId });
      const res = await toggleVendorStatusService(payload);
      //   console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setOpenModal(false);
        toast.success(res?.data.data);
        getVendorTable();
      }
    } catch (error) {
      throw error;
    }
  };

  const vendorColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Vendor Name / Code",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p>{row.vendorCode}</p> |{" "}
            <p className="text-slate-800">{row.vendorName}</p>
          </div>
        ) || "N/A",
      sortable: true,
    },

    {
      name: "Aadhar Number",
      selector: (row) => row.aadhaarNo || "N/A",
    },
    {
      name: "Contact Number",
      selector: (row) => row.contactNo || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "N/A",
      sortable: true,
    },
    {
      name: "Action",

      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <Tooltip title="Edit" arrow>
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
            onClick={() => {
              editMilestone(row?.vendorId);
            }}
          >
            <GoPencil className="w-4 h-4" />
          </button>
          </Tooltip>

          {/* ACTIVE / INACTIVE BUTTON */}
          <Tooltip title={row.isActive?"Active" : "Inactive"} arrow>
          <button
            className={`flex items-center justify-center h-8 w-8 rounded-full 
            ${
              row.isActive
                ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                : "bg-red-500/25 hover:bg-red-600/25 text-red-500 "
            }`}
            onClick={() => {
              setVendorId(row?.vendorId);
              setOpenModal(true);
            }}
          >
            {row.isActive ? (
              <MdLockOutline className="w-4 h-4" />
            ) : (
              <MdLockOpen className="w-4 h-4" />
            )}
          </button>
          </Tooltip>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="mt-3">
      {/* ---------- Accordion 1: Add Vendor Form ---------- */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          arrowcolor="#fff"
          sx={{
            backgroundColor: "#f4f0f2",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              color: "#2c0014",
            }}
          >
            Add Vendor
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              <div className="col-span-2">
                <SelectField
                  label="District"
                  required={true}
                  name="districtId"
                  value={districtId}
                  onChange={handleChangeInput}
                  options={distOptions?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                  error={errors.districtId}
                  placeholder="Select"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Vendor Name"
                  required={true}
                  name="vendorName"
                  placeholder="Enter vendor name"
                  value={vendorName}
                  onChange={handleChangeInput}
                  error={errors.vendorName}
                  maxLength={50}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Aadhar Number"
                  required={true}
                  name="aadhaarNo"
                  placeholder="Enter aadhaar number"
                  value={aadhaarNo}
                  maxLength={12}
                  minLength={12}
                  onChange={handleChangeInput}
                  error={errors.aadhaarNo}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Contact Number"
                  required={true}
                  name="contactNo"
                  placeholder="Enter contact number"
                  value={contactNo}
                  onChange={handleChangeInput}
                  error={errors.contactNo}
                  maxLength={10}
                  minLength={10}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Email"
                  required={true}
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleChangeInput}
                  error={errors.email}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  label="Address"
                  textarea={true}
                  name="address"
                  placeholder="Enter address"
                  value={address}
                  maxLength={255}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-12">
                <div className="bg-slate-100 border-l-4 border-slate-600  px-4 py-2">
                  <h5 className="text-sm font-semibold text-slate-700">
                    Add Bank Details
                  </h5>
                </div>
              </div>

              <div className="col-span-12">
                <table className="table-fixed w-full border border-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
                        SL No
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Bank Name
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Branch Name
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Account Number
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        IFSC Code
                      </td>
                      <td className="w-[60px] text-center text-sm px-4 py-1 border-r border-slate-200">
                        <button type="button" onClick={handleAddRow}>
                          <MdOutlineAddCircle className="inline text-green-600 text-xl" />
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((i, index) => {
                      return (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="border-r border-slate-200 text-center">
                            {index + 1}
                          </td>

                          <td className="border-r border-slate-200 px-2 py-1">
                            <SelectField
                              name="bankId"
                              value={i.bankId}
                              onChange={(e) =>
                                handleInput(
                                  index,
                                  "bankId",
                                  Number(e.target.value)
                                )
                              }
                              options={bankNameOptions?.map((opt) => ({
                                value: opt.bankId,
                                label: opt.bankName,
                              }))}
                              placeholder="Select"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="branchName"
                              value={i.branchName}
                              onChange={(e) =>
                                handleInput(index, "branchName", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="accountNo"
                              value={i.accountNo}
                              maxLength={18}
                              onChange={(e) =>
                                handleInput(index, "accountNo", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="ifscCode"
                              value={IFSCutil(i.ifscCode)}
                              maxLength={11}
                              onChange={(e) =>
                                handleInput(index, "ifscCode", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 text-center">
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="col-span-12">
                <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={vendorId} />
                </div>
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* ---------- Accordion 2: Vendor List ---------- */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: "#f4f0f2",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              color: "#2c0014",
            }}
          >
            Vendor List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={vendorColumn} />
        </AccordionDetails>
      </Accordion>
      <ReusableDialog
        open={openModal}
        // title="Change Status"
        description="Are you sure you want to change status?"
        onClose={() => setOpenModal(false)}
        onConfirm={toggleStatus}
      />
      <ReusableDialog
        open={openSubmit}
        // title="Submit"
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default VendorPage;