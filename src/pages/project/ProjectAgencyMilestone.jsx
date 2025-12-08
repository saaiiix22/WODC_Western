import React, { useEffect, useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FiFileText } from "react-icons/fi";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import {
  getBudgetByProjectService,
  getMilestoneService,
  getProjectListService,
  saveProjectAgencyMilestoneService,
} from "../../services/projectService";
import { MdOutlineAddCircle } from "react-icons/md";
import { getAgencyDetailsService } from "../../services/agencyService";
import { FaMinusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getVendorDataService } from "../../services/vendorService";

const ProjectAgencyMilestone = () => {
  const userSelection = useSelector((state) => state?.menu.userDetails);
  // console.log(userSelection);

  const [formData, setFormData] = useState({
    projectId: "",
  });

  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [budgetAmount, setBudgetAmount] = useState("");
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "projectId") {
      try {
        const payload = encryptPayload({
          projectId: value,
          isActive: true,
        });
        const payload2 = encryptPayload({
          projectId: value,
          isActive: true,
        });
        const res = await getMilestoneService(payload);
        const res2 = await getBudgetByProjectService(payload2);
        console.log(res2);
        setMilestoneOpts(res?.data.data);
        setBudgetAmount(res2?.data.data);
      } catch (error) {
        throw error;
      }
    }
  };
  const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const [rows, setRows] = useState([
    {
      projectAgencyMilestoneMapId: null,
      agencyId: "",
      milestoneId: "",
      vendorId: "",
      order: "",
      budgetPercentage: "",
      amount: "",
      startDate: "",
      endDate: "",
      actualStartDate: "",
      actualEndDate: "",
    },
  ]);
  const handleInput = (index, name, value) => {
    const updated = [...rows];

    // Prevent percentage > 100
    if (name === "budgetPercentage") {
      let percent = parseFloat(value) || 0;
      if (percent > 100) {
        toast.error("Percentage cannot exceed 100%");
        return;
      }

      const calcAmount = ((budgetAmount * percent) / 100).toFixed(2);

      const totalExceptCurrent = rows.reduce((sum, row, idx) => {
        if (idx === index) return sum;
        return sum + (parseFloat(row.budgetPercentage) || 0);
      }, 0);

      if (totalExceptCurrent + percent > 100) {
        alert("Total budget percentage cannot exceed 100%");
        return;
      }

      updated[index][name] = percent;
      updated[index].amount = calcAmount;

      const totalAfterUpdate = totalExceptCurrent + percent;
      if (totalAfterUpdate === 100) {
        console.log("No more rows can be added. Total = 100%");
      }
    } else {
      updated[index][name] = value;
    }

    setRows(updated);
  };

  const totalActualAmount = rows.reduce(
    (sum, row) => sum + (parseFloat(row.amount) || 0),
    0
  );

  const remainingBudget = (budgetAmount - totalActualAmount).toFixed(2);

  const handleAddRow = () => {
    const totalPercent = rows.reduce(
      (sum, row) => sum + (parseFloat(row.budgetPercentage) || 0),
      0
    );

    if (totalPercent >= 100) {
      toast.error(
        "You cannot add more rows because 100% budget is already allocated."
      );
      return;
    }

    setRows([
      ...rows,
      {
        projectAgencyMilestoneMapId: null,
        agencyId: "",
        milestoneId: "",
        vendorId: "",
        order: "",
        budgetPercentage: "",
        amount: "",
        startDate: "",
        endDate: "",
        actualStartDate: "",
        actualEndDate: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedRows = rows.map((row) => ({
      ...row,
      startDate: formatToDDMMYYYY(row.startDate),
      endDate: formatToDDMMYYYY(row.endDate),
      actualStartDate: formatToDDMMYYYY(row.actualStartDate),
      actualEndDate: formatToDDMMYYYY(row.actualEndDate),
    }));

    const sendData = {
      projectId: formData.projectId,
      items: transformedRows,
    };

    try {
      const payload = encryptPayload(sendData);
      const res = await saveProjectAgencyMilestoneService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setFormData({
          projectId: "",
        });
        setRows([
          {
            projectAgencyMilestoneMapId: null,
            agencyId: "",
            milestoneId: "",
            vendorId: "",
            order: "",
            budgetPercentage: "",
            amount: "",
            startDate: "",
            endDate: "",
            actualStartDate: "",
            actualEndDate: "",
          },
        ]);
      } else {
        toast.error(res?.data.message);
        setFormData({
          projectId: "",
        });
        setRows([
          {
            projectAgencyMilestoneMapId: null,
            agencyId: "",
            milestoneId: "",
            vendorId: "",
            order: "",
            budgetPercentage: "",
            amount: "",
            startDate: "",
            endDate: "",
            actualStartDate: "",
            actualEndDate: "",
          },
        ]);
      }
    } catch (error) {
      throw error;
    }
  };
  const [projectOpts, setProjectOpts] = useState([]);
  const [agencyopts, setAgencyOpts] = useState([]);
  const [vendorOpts, setVendorOpts] = useState([]);

  const getAllProjectOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getProjectListService(payload);
      // console.log(res);
      setProjectOpts(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  const getAllAgencyList = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAgencyDetailsService(payload);
      // console.log(res);
      setAgencyOpts(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  const getAllVendorList = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getVendorDataService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setVendorOpts(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    getAllProjectOpts();
    getAllAgencyList();
    getAllVendorList();
  }, []);

  useEffect(() => {
    if (!budgetAmount) return;

    setRows((prev) =>
      prev.map((row) => {
        const percent = parseFloat(row.budgetPercentage) || 0;
        return {
          ...row,
          amount: ((budgetAmount * percent) / 100).toFixed(2),
        };
      })
    );
  }, [budgetAmount]);
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
            Project Agency Milestone
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12">
            <div className="col-span-2">
              <SelectField
                label="Select Project"
                required={true}
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                placeholder="Select"
                options={projectOpts?.map((i) => ({
                  label: i.projectName,
                  value: i.projectId,
                }))}
              />
            </div>
            {formData.projectId && (
              <>
                <div className="col-span-12">
                  <table className="table-fixed w-full border border-slate-300 mt-5">
                    <thead className="bg-slate-100">
                      <tr>
                        <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
                          Sl. No
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Agency Name
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Milestone
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Vendor Name
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Order
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Start Date
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          End Date
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Actual Start Date
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Actual End Date
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          {"Budget (%)"}
                        </td>
                        <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                          Actual Amount
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
                      {rows?.map((i, index) => {
                        return (
                          <tr key={index} className="border-b border-slate-200">
                            <td className="border-r border-slate-200 px-2 py-1">
                              {index + 1}
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
                              <SelectField
                                name="agencyId"
                                value={i.agencyId}
                                onChange={(e) =>
                                  handleInput(index, "agencyId", e.target.value)
                                }
                                options={agencyopts?.map((d) => ({
                                  value: d.agencyId,
                                  label: d.agencyName,
                                }))}
                                placeholder="Select"
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
                              <SelectField
                                name="milestoneId"
                                value={i.milestoneId}
                                onChange={(e) =>
                                  handleInput(
                                    index,
                                    "milestoneId",
                                    e.target.value
                                  )
                                }
                                options={milestoneOpts?.map((d) => ({
                                  value: d.milestoneId,
                                  label: d.milestoneName,
                                }))}
                                placeholder="Select"
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
                              <SelectField
                                name="vendorId"
                                value={i.vendorId}
                                onChange={(e) =>
                                  handleInput(index, "vendorId", e.target.value)
                                }
                                options={vendorOpts?.map((d) => ({
                                  value: d.vendorId,
                                  label: d.vendorName,
                                }))}
                                placeholder="Select"
                              />
                            </td>

                            <td className="border-r border-slate-200 px-2 py-1">
                              <input
                                name="order"
                                value={i.order}
                                onChange={(e) =>
                                  handleInput(index, "order", e.target.value)
                                }
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm text-gray-600"
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
                              <input
                                name="startDate"
                                value={i.startDate}
                                disabled={
                                  userSelection.roleCode === "ROLE_ADMIN"
                                }
                                onChange={(e) =>
                                  handleInput(
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                type="date"
                                className={`
                                  w-full rounded-md border border-gray-300 
                                  px-2.5 py-1.5 text-sm
                                  outline-none transition-all duration-200
                                  placeholder:text-gray-400
                                  ${
                                    userSelection.roleCode === "ROLE_ADMIN"
                                      ? "bg-gray-100 cursor-not-allowed"
                                      : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                                  }
                                `}
                              />
                            </td>

                            <td className="border-r border-slate-200 px-2 py-1">
                              <input
                                name="endDate"
                                value={i.endDate}
                                min={i.startDate}
                                disabled={
                                  userSelection.roleCode === "ROLE_ADMIN"
                                }
                                onChange={(e) =>
                                  handleInput(index, "endDate", e.target.value)
                                }
                                type="date"
                                className={`
                                  w-full rounded-md border border-gray-300 
                                  px-2.5 py-1.5 text-sm
                                  outline-none transition-all duration-200
                                  placeholder:text-gray-400
                                  ${
                                    userSelection.roleCode === "ROLE_ADMIN"
                                      ? "bg-gray-100 cursor-not-allowed"
                                      : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                                  }
                                `}
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
                              <input
                                name="actualStartDate"
                                value={i.actualStartDate}
                                onChange={(e) =>
                                  handleInput(
                                    index,
                                    "actualStartDate",
                                    e.target.value
                                  )
                                }
                                type="date"
                                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm text-gray-600"
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
                              <input
                                name="actualEndDate"
                                value={i.actualEndDate}
                                min={i.actualStartDate}
                                onChange={(e) =>
                                  handleInput(
                                    index,
                                    "actualEndDate",
                                    e.target.value
                                  )
                                }
                                type="date"
                                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm text-gray-600"
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1 relative">
                              <input
                                type="number"
                                name="budgetPercentage"
                                value={i.budgetPercentage}
                                onChange={(e) =>
                                  handleInput(
                                    index,
                                    "budgetPercentage",
                                    e.target.value
                                  )
                                }
                                max={100}
                                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm text-gray-600"
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
                              <input
                                type="text"
                                name="amount"
                                value={i.amount}
                                onChange={(e) =>
                                  handleInput(index, "amount", e.target.value)
                                }
                                disabled={true}
                                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm text-gray-600 bg-gray-100 cursor-not-allowed"
                              />
                            </td>
                            <td>
                              <SelectField
                                name="vendorId"
                                value={i.vendorId}
                                onChange={(e) =>
                                  handleInput(index, "vendorId", e.target.value)
                                }
                                options={vendorOpts?.map((d) => ({
                                  value: d.vendorId,
                                  label: d.vendorName,
                                }))}
                                placeholder="Select"
                              />
                            </td>
                            <td className="border-r border-slate-200 px-2 py-1">
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
                <div className="col-span-12 bg-white border border-slate-200 rounded-sm p-6 mt-6">
                  <div className="grid grid-cols-12">
                    <div className="col-span-4 flex flex-col items-center border-r border-slate-300">
                      <p className="text-gray-500 text-sm">Max Budget</p>
                      <p className="text-xl font-bold text-red-600 mt-1">
                        ₹{budgetAmount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="col-span-4 flex flex-col items-center border-r border-slate-300">
                      <p className="text-gray-500 text-sm">Allocated</p>
                      <p className="text-xl font-bold text-blue-700 mt-1">
                        ₹{totalActualAmount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="col-span-4 flex flex-col items-center">
                      <p className="text-gray-500 text-sm">Remaining</p>
                      <p className="text-xl font-bold text-green-700 mt-1">
                        ₹{remainingBudget.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer (Optional) */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn />
        </div>
      </div>
    </form>
  );
};

export default ProjectAgencyMilestone;
