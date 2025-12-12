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
import SelectField from "../../components/common/SelectField";
import { FaMinusCircle } from "react-icons/fa";
import { getBankNamesService } from "../../services/budgetService";
import {
  editBeneficiarySerice,
  getBeneficiaryDetailsService,
  saveBeneficiarySerice,
  toggleBeneficiaryStatus,
} from "../../services/beneficiaryService";
import {
  cleanAadhaarUtil,
  cleanContactNoUtil,
  validateAadhaarUtil,
  validateAccountNoUtil,
  validateContactNoUtil,
  validateIfscUtil,
} from "../../utils/validationUtils";
import { getBlockThroughDistrictService } from "../../services/gpService";
import { getGpByBlockService } from "../../services/villageService";
import {
  getVillageThroughGpService,
  getWardByMunicipalityService,
} from "../../services/projectService";
import { getMunicipalityViaDistrictsService } from "../../services/wardService";
import { getAllDists } from "../../services/blockService";

const Beneficiary = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    districtId: "",
    blockId: "",
    gpId: "",
    municipalityId: "",
    areaType:"BLOCK",
    objectId:"",
    beneficiaryId: null,
    beneficiaryName: "",
    contactNo: "",
    email: "",
    address: "",
    aadhaarNo: "",
    dob: "",
  });
  const {
    districtId,
    blockId,
    gpId,
    municipalityId,
    areaType,
    objectId,
    beneficiaryId,
    beneficiaryName,
    contactNo,
    email,
    address,
    aadhaarNo,
    dob,
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
      updatedValue = cleanAadhaarUtil(value);
    }
    if (name === "contactNo") {
      updatedValue = cleanContactNoUtil(updatedValue);
    }

    // CLEAR ERROR WHEN USER TYPES
    setErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData({ ...formData, [name]: updatedValue });
  };

  const [distListOpts, setDistListOpts] = useState([]);
  const [blockOpts, setBlockOpts] = useState([]);
  const [gpOpts, setGpOptions] = useState([]);
  const [villageOpts, setVillageOpts] = useState([]);
  const [municipalityOpts, setMunicipalityOpts] = useState([]);
  const [wardOpts, setWardOpts] = useState([]);

  const load = async (serviceFn, payload, setter) => {
    try {
      const res = await serviceFn(encryptPayload(payload));
      setter(res?.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllDistOpts = () =>
    load(getAllDists, { isActive: true }, setDistListOpts);

  const getAllBlockOpts = () =>
    load(
      getBlockThroughDistrictService,
      { isActive: true, districtId },
      setBlockOpts
    );

  const getAllGPoptions = () =>
    load(getGpByBlockService, { isActive: true, blockId }, setGpOptions);

  const getVillageList = () =>
    load(getVillageThroughGpService, { isActive: true, gpId }, setVillageOpts);

  const getAllMunicipalityList = () =>
    load(
      getMunicipalityViaDistrictsService,
      { isActive: true, districtId },
      setMunicipalityOpts
    );

  const getAllWardOptions = () =>
    load(
      getWardByMunicipalityService,
      { isActive: true, municipalityId },
      setWardOpts
    );

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
      beneficiaryBankId: null,
      bankId: "",
      branchName: "",
      accountNo: "",
      ifscCode: "",
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

    setRows([
      ...rows,
      {
        beneficiaryBankId: null,
        bankId: "",
        branchName: "",
        accountNo: "",
        ifscCode: "",
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
    updated[index][name] = value;
    setRows(updated);
  };

  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!beneficiaryName || !beneficiaryName.trim()) {
      newErrors.beneficiaryName = "Beneficiary name is required";
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
    if (!dob || !dob.trim()) {
      newErrors.dob = "DOB is required";
      setErrors(newErrors);
      return;
    }
    if (!contactNo || !contactNo.trim()) {
      newErrors.contactNo = "Contact No is required";
      setErrors(newErrors);
      return;
    }
    if (!validateContactNoUtil(contactNo)) {
      newErrors.contactNo = "Contact number must be exactly 10 digits";
      setErrors(newErrors);
      return;
    }
    if (!email || !email.trim()) {
      newErrors.email = "Email is required";
      setErrors(newErrors);
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!row.bankId) {
        toast.error(` Bank Name is required in Row ${i + 1}`);
        return;
      }

      if (!row.branchName || !row.branchName.trim()) {
        toast.error(`Row ${i + 1}: Branch Name is required`);
        return;
      }

      if (!validateAccountNoUtil(row.accountNo)) {
        toast.error(
          `Row ${i + 1}: Invalid Account Number (must be 8–18 digits)`
        );
        return;
      }

      if (!validateIfscUtil(row.ifscCode)) {
        toast.error(`Row ${i + 1}: Invalid IFSC Code format`);
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
      districtId,
      areaType,
      objectType: areaType === "BLOCK" ? "VILLAGE" : "WARD",
      objectId: objectId,
      beneficiaryId,
      beneficiaryName,
      contactNo,
      email,
      address,
      aadhaarNo,
      dob: formatDateToDDMMYYYY(dob),
      beneficiaryCode: null,
      bankDetails: rows,
    };
    console.log(sendData);

    try {
      const payload = encryptPayload(sendData);
      const res = await saveBeneficiarySerice(payload);
      // console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setOpenSubmit(false);

        toast.success(res?.data.message);
        setFormData({
          beneficiaryId: null,
          beneficiaryName: "",
          contactNo: "",
          email: "",
          address: "",
          aadhaarNo: "",
          dob: "",
        });
        setRows([
          {
            beneficiaryBankId: null,
            bankId: "",
            branchName: "",
            accountNo: "",
            ifscCode: "",
          },
        ]);
        setExpanded("panel2");
      }
    } catch (error) {
      throw error;
    }
  };

  const [tableData, setTableData] = useState([]);
  const getBeneficiaryTable = async () => {
    try {
      const payload = encryptPayload(false);
      const res = await getBeneficiaryDetailsService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data || []);
      } 
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getBeneficiaryTable();
    getAllBankOptions();
    getAllDistOpts();
  }, []);

  useEffect(() => {
    if (districtId) {
      getAllBlockOpts();
      getAllMunicipalityList();
    }

    if (blockId) {
      getAllGPoptions();
    }

    if (gpId) {
      getVillageList();
    }

    if (municipalityId) {
      getAllWardOptions();
    }
  }, [districtId, blockId, gpId, municipalityId]);

  const [openModal, setOpenModal] = useState(false);

  const editBeneficiary = async (id) => {
    try {
      const payload = encryptPayload({ beneficiaryId: id });
      const res = await editBeneficiarySerice(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setFormData(res?.data.data);
        setFormData((prev) => ({ ...prev, dob: formatDateMMDDYY(prev.dob) }));
        setRows(res?.data.data.bankDetails);
        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };

  const [openMilestoneId, setMilestoneId] = useState("");

  const toggleStatus = async () => {
    try {
      const payload = encryptPayload({ beneficiaryId: openMilestoneId });
      const res = await toggleBeneficiaryStatus(payload);
      //  console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setOpenModal(false);
        toast.success(res?.data.message);
        getBeneficiaryTable();
      }
    } catch (error) {
      throw error;
    }
  };

  const agencyColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Beneficiary Name / Code",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.beneficiaryName}</p> |{" "}
            <p>{row.beneficiaryCode}</p>
          </div>
        ) || "N/A",
      sortable: true,
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
      name: "Address",
      selector: (row) => row.address || "N/A",
      sortable: true,
    },
    {
      name: "Action",

      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
            onClick={() => {
              editBeneficiary(row?.beneficiaryId);
            }}
          >
            <GoPencil className="w-4 h-4" />
          </button>

          {/* ACTIVE / INACTIVE BUTTON */}
          <button
            className={`flex items-center justify-center h-8 w-8 rounded-full 
            ${
              row.isActive
                ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                : "bg-red-500/25 hover:bg-red-600/25 text-red-500 "
            }`}
            // onClick={() => toggleStatus(row?.blockId)}
            onClick={() => {
              setMilestoneId(row?.beneficiaryId);
              setOpenModal(true);
            }}
          >
            {row.isActive ? (
              <MdLockOutline className="w-4 h-4" />
            ) : (
              <MdLockOpen className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="mt-3">
      {/* ---------- Accordion 1: Get District Form ---------- */}
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
            Add Beneficiary
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              {console.log(distListOpts)}
              <div className="col-span-2">
                <SelectField
                  label="District"
                  required={true}
                  name="districtId"
                  value={districtId}
                  onChange={handleChangeInput}
                  options={distListOpts?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                  error={errors.districtId}
                  placeholder="Select"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[13px] font-medium text-gray-700">
                  Select Area Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-5 items-center">
                  <div className="flex gap-1">
                    <input
                      type="radio"
                      value={"BLOCK"}
                      name="areaType"
                      // checked={
                      //   stateSelect?.areaType === "BLOCK" ? true : false
                      // }
                      checked={formData.areaType === "BLOCK"}
                      id="radio1"
                      onChange={handleChangeInput}
                    />
                    <label htmlFor="radio1" className="text-sm text-slate-800">
                      Block
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="radio"
                      value={"MUNICIPALITY"}
                      name="areaType"
                      // checked={
                      //   stateSelect?.areaType === "MUNICIPALITY"
                      //     ? true
                      //     : false
                      // }
                      checked={formData.areaType === "MUNICIPALITY"}
                      id="radio2"
                      onChange={handleChangeInput}
                    />
                    <label htmlFor="radio2" className="text-sm text-slate-800">
                      Municipality
                    </label>
                  </div>
                </div>
              </div>
              {areaType === "BLOCK" && (
                <>
                  <div className="col-span-2">
                    <SelectField
                      label="Block Name"
                      required={true}
                      name="blockId"
                      value={blockId}
                      onChange={handleChangeInput}
                      options={blockOpts?.map((d) => ({
                        value: d.blockId,
                        label: d.blockNameEN,
                      }))}
                      disabled={districtId ? false : true}
                      //   error={errors.districtId}
                      placeholder="Select "
                    />
                  </div>
                  <div className="col-span-2">
                    <SelectField
                      label="GP Name"
                      required={true}
                      name="gpId"
                      value={gpId}
                      onChange={handleChangeInput}
                      options={gpOpts?.map((d) => ({
                        value: d.gpId,
                        label: d.gpNameEN,
                      }))}
                      disabled={blockId ? false : true}
                      //   error={errors.districtId}
                      placeholder="Select "
                    />
                  </div>
                  <div className="col-span-2">
                    <SelectField
                      label="Village Name"
                      required={true}
                      name="objectId"
                      value={objectId}
                      onChange={handleChangeInput}
                      options={villageOpts?.map((d) => ({
                        value: d.villageId,
                        label: d.villageNameEn,
                      }))}
                      disabled={gpId ? false : true}
                      error={errors.objectId}
                      placeholder="Select"
                    />
                  </div>
                </>
              )}
              {areaType === "MUNICIPALITY" && (
                <>
                  <div className="col-span-2">
                    <SelectField
                      label="Municipality Name"
                      required={true}
                      name="municipalityId"
                      value={municipalityId}
                      onChange={handleChangeInput}
                      options={municipalityOpts?.map((d) => ({
                        value: d.municipalityId,
                        label: d.municipalityName,
                      }))}
                      disabled={districtId ? false : true}
                      //   error={errors.districtId}
                      placeholder="Select"
                    />
                  </div>
                  <div className="col-span-2">
                    <SelectField
                      label="Ward Name"
                      required={true}
                      name="objectId"
                      value={objectId}
                      onChange={handleChangeInput}
                      options={wardOpts?.map((d) => ({
                        value: d.wardId,
                        label: d.wardName,
                      }))}
                      disabled={municipalityId ? false : true}
                      error={errors.objectId}
                      placeholder="Select "
                    />
                  </div>
                </>
              )}
              <div className="col-span-2">
                <InputField
                  label="Beneficiary Name"
                  required={true}
                  name="beneficiaryName"
                  placeholder="Enter Name"
                  value={beneficiaryName}
                  onChange={handleChangeInput}
                  error={errors.beneficiaryName}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Aadhar Number"
                  name="aadhaarNo"
                  placeholder="Enter aadhaar number"
                  value={aadhaarNo}
                  onChange={handleChangeInput}
                  error={errors.aadhaarNo}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Date of birth"
                  required={true}
                  type="date"
                  name="dob"
                  value={dob}
                  onChange={handleChangeInput}
                  error={errors.dob}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Contact Number"
                  required={true}
                  name="contactNo"
                  placeholder="Contact number"
                  value={contactNo}
                  onChange={handleChangeInput}
                  error={errors.contactNo}
                  maxLength={10}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Email"
                  required={true}
                  name="email"
                  placeholder="Email"
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
                  placeholder="Address"
                  value={address}
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
                              onChange={(e) =>
                                handleInput(index, "accountNo", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="ifscCode"
                              value={i.ifscCode}
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
                  <SubmitBtn type={"submit"} btnText={beneficiaryId} />
                </div>
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* ---------- Accordion 2: District List ---------- */}
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
            Beneficiary List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={agencyColumn} />
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

export default Beneficiary;
