import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { getBankNamesService } from "../../services/budgetService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  editBankDetailsService,
  getBankListService,
  saveBankAccountConfigService,
  toggleBankStatusService,
} from "../../services/bankAccountConfigService";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { Tooltip, Typography } from "@mui/material";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { GoPencil } from "react-icons/go";
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { accountNumberUtil, ifscUtil } from "../../utils/validationUtils";

const BankAccountConfig = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [formData, setFormData] = useState({
    bankAccConfigId: null,
    bankName: "",
    branch: "",
    accNo: "",
    ifsc: "",
  });
  const { bankName, branch, accNo, ifsc, bankAccConfigId } = formData;
  const [errors, setErrors] = useState({});

  const handleInp = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = {
        bankAccConfigId: bankAccConfigId,
        bankName: {
          bankId: bankName,
        },
        branch: branch,
        accNo: accNo,
        ifsc: ifsc,
      };
      const payload = encryptPayload(sendData);
      const res = await saveBankAccountConfigService(payload);
      console.log(res);

      if (res?.data.outcome && res?.status === 200) {
        getAllTableData();
        setOpen(false);
        toast.success(res?.data.message);
        setFormData({
          bankAccConfigId: null,
          bankName: "",
          branch: "",
          accNo: "",
          ifsc: "",
        });
        setExpanded("panel2");
      } else {
        toast.error(res?.data.message);
        setFormData({
          bankAccConfigId: null,
          bankName: "",
          branch: "",
          accNo: "",
          ifsc: "",
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setOpen(false);
    }
  };

  const [open, setOpen] = useState(false);
  const confirmHandleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!bankName) {
      newErrors.bankName = "Bank name is required";
      setErrors(newErrors);
      return;
    }

    if (!branch || !branch.trim()) {
      newErrors.branch = "Branch name is required";
      setErrors(newErrors);
      return;
    }

    if (!accNo || !accNo.trim()) {
      newErrors.accNo = "Account Number is required";
      setErrors(newErrors);
      return;
    }

    if (!ifsc || !ifsc.trim()) {
      newErrors.ifsc = "IFSC is required";
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const [bankListOpts, setBankListOpts] = useState([]);
  const getAllBankList = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getBankNamesService(payload);
      //   console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setBankListOpts(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const [tableData, setTableData] = useState([]);
  const getAllTableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getBankListService(payload);
      //   console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setTableData(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const bankColumns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Bank Name",
      selector: (row) => row.bankName.bankName || "N/A",
      sortable: true,
    },
    {
      name: "Account Number",
      selector: (row) => row.accNo || "N/A",
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch || "N/A",
      sortable: true,
    },
    {
      name: "IFSC",
      selector: (row) => row.ifsc || "N/A",
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
                editBankDetails(row?.bankAccConfigId);
              }}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* ACTIVE / INACTIVE BUTTON */}
          <Tooltip title={row.isActive ? "Active" : "Inactive"} arrow>
            <button
              className={`flex items-center justify-center h-8 w-8 rounded-full 
                ${
                  row.isActive
                    ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                    : "bg-red-500/25 hover:bg-red-600/25 text-red-500 "
                }`}
              // onClick={() => toggleStatus(row?.blockId)}
              onClick={() => {
                setBankEditId(row?.bankAccConfigId);
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

  const editBankDetails = async (id) => {
    try {
      const payload = encryptPayload({ bankAccConfigId: id });
      const res = await editBankDetailsService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setExpanded("panel1");
        setFormData({
          bankAccConfigId: res?.data.data.bankAccConfigId,
          bankName: res?.data.data.bankName.bankId,
          branch: res?.data.data.branch,
          accNo: res?.data.data.accNo,
          ifsc: res?.data.data.ifsc,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const [bankeditId, setBankEditId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const toggleBankStatus = async () => {
    try {
      const payload = encryptPayload({ bankAccConfigId: bankeditId });
      const res = await toggleBankStatusService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setOpenModal(false);
        toast.success(res?.data.message);
        getAllTableData()
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllBankList();
    getAllTableData();
  }, []);

  return (
    <form action="" onSubmit={confirmHandleSubmit}>
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
            Add Bank
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="grid grid-cols-12 gap-6 p-3">
            <div className="col-span-2">
              <SelectField
                label="Bank Name"
                onChange={handleInp}
                required={true}
                name="bankName"
                value={bankName}
                placeholder="Select "
                options={bankListOpts?.map((i) => ({
                  value: i.bankId,
                  label: i.bankName,
                }))}
                error={errors.bankName}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Branch Name"
                onChange={handleInp}
                required={true}
                name="branch"
                value={branch}
                placeholder="Enter branch name"
                error={errors.branch}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Account Number"
                onChange={handleInp}
                required={true}
                name="accNo"
                value={accountNumberUtil(accNo)}
                placeholder="Enter account number"
                error={errors.accNo}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="IFSC Code"
                onChange={handleInp}
                required={true}
                name="ifsc"
                value={ifscUtil(ifsc)}
                placeholder="Enter IFSC code"
                error={errors.ifsc}
              />
            </div>

            <div className="col-span-4">
              <div className="flex justify-start mt-6 gap-2 text-[13px]">
                <ResetBackBtn />
                <SubmitBtn type={"submit"} btnText={formData.bankAccConfigId} />
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
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
            Bank List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={bankColumns} />
        </AccordionDetails>
      </Accordion>
      <ReusableDialog
        open={open}
        // title="Submit"
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
      <ReusableDialog
        open={openModal}
        // title="Submit"
        description="Are you sure you want change status ?"
        onClose={() => setOpenModal(false)}
        onConfirm={toggleBankStatus}
      />
    </form>
  );
};

export default BankAccountConfig;
