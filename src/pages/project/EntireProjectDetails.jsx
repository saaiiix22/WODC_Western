import React, { Fragment, useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary } from '../../components/common/CommonAccordion'
import { Typography } from '@mui/material';
import SelectField from '../../components/common/SelectField';
import { getFinancialYearService } from '../../services/budgetService';
import { load } from '../../hooks/load';
import { getEntireProjectDetailsService, getProjectByFinYearService } from '../../services/projectService';
import { openDocument } from '../../utils/openDocument';
import Magnifier from '../../components/common/Magnifier';
import { FiFileText } from 'react-icons/fi';

const EntireProjectDetails = () => {

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // ------------------------------------------------------------

  const [formData, setFormData] = useState({
    finYear: '',
    projectId: ''
  })
  const { finYear, projectId } = formData

  const [finYearOpts, setFinYearOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [entireDetails, setEntireDetails] = useState([]);
  const [milestoneDetails, setMilestoneDetails] = useState([]);



  const getFinancialYearOptions = () =>
    load(getFinancialYearService, { isActive: true }, setFinYearOpts);

  const getAllProjectOpts = async () =>
    load(getProjectByFinYearService, { isActive: true, finyearId: parseInt(formData.finYear) }, setProjectOpts)


  const getEntireDetails = () =>
    load(getEntireProjectDetailsService, { projectId: formData.projectId }, setEntireDetails);

  // console.log(entireDetails);

  const getDateDiff = (date1, date2) => {
    if (!date1 || !date2) return "N/A";

    const d1 = new Date(date1.split("/").reverse().join("-"));
    const d2 = new Date(date2.split("/").reverse().join("-"));

    return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
  };



  const handleInp = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    getFinancialYearOptions()
  }, [])

  useEffect(() => {
    if (formData.finYear) {
      getAllProjectOpts()
    }
  }, [formData.finYear])

  console.log(formData.projectId);

  useEffect(() => {
    if (formData.projectId) {
      getEntireDetails()
    }
  }, [formData.projectId])

  useEffect(() => {
    if (entireDetails?.milestoneDetailsList) {
      setMilestoneDetails(entireDetails.milestoneDetailsList);
    }
  }, [entireDetails]);


  return (
    <>
      <div
        className="
            my-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
            shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          "
      >
        {/* Body */}
        <div className=" py-1 px-4 text-[#444]">
          {/* Content Here */}
          <div className="grid grid-cols-12 gap-6 mb-3">
            <div className="col-span-2">
              <SelectField
                label={'Financial Year'}
                required={true}
                placeholder='Select'
                name={'finYear'}
                onChange={handleInp}
                value={finYear}
                options={finYearOpts?.map((d) => ({
                  value: d.finyearId,
                  label: d.finYear,
                }))}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label={'Project Name'}
                required={true}
                placeholder='Select'
                name={'projectId'}
                onChange={handleInp}
                disabled={!finYear}
                value={projectId}
                options={projectOpts?.map((i) => ({
                  label: i.projectName,
                  value: i.projectId,
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {
        milestoneDetails?.map((i, index) => {

          const { agency, vendor, projectAgencyMilestoneMap, workOrder, geoTags } = i

          return (
            <Fragment key={index + 1}>
              <Accordion

                expanded={expanded === `panel${index + 1}`}
                onChange={handleChange(`panel${index + 1}`)}
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
                    Milestone {index + 1} - {i.milestoneName}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <div className="grid grid-cols-12 gap-4 pt-3">
                    <div className="col-span-12">
                      <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                        {/* Floating Title */}
                        <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                          Milestone Details
                        </span>

                        {/* GRID */}
                        <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">


                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Start Date
                            </span>
                            :
                            <span className="text-slate-900 font-semibold">
                              {projectAgencyMilestoneMap?.startDate || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              End Date
                            </span>
                            :
                            <span className="text-slate-900 font-semibold">
                              {projectAgencyMilestoneMap?.endDate || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Actual Start Date
                            </span>
                            :
                            <span className="text-slate-900 font-semibold">
                              {projectAgencyMilestoneMap?.actualStartDate || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Actual End Date
                            </span>
                            :
                            <span className="text-slate-900 font-semibold">
                              {projectAgencyMilestoneMap?.actualEndDate || "N/A"}
                            </span>
                          </div>

                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Actual End Date
                            </span>
                            :
                            <span className="text-slate-900 font-semibold">
                              {projectAgencyMilestoneMap?.actualEndDate || "N/A"}
                            </span>
                          </div>

                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">Delay</span>
                            :
                            <span className="text-slate-900 font-semibold">
                              {getDateDiff(
                                projectAgencyMilestoneMap?.actualEndDate,
                                projectAgencyMilestoneMap?.endDate
                              ) || "0"}{" "}
                              days
                            </span>
                          </div>

                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Milestone Amount
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              ₹{" "}
                              {Number(projectAgencyMilestoneMap?.amount).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              ) || 0}
                            </span>
                          </div>

                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Penalty Amount
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              ₹{" "}
                              {Number(projectAgencyMilestoneMap?.penaltyAmount).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              ) || 0}
                            </span>
                          </div>

                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Milestone Status
                            </span>
                            :
                            <span className="text-[12px] text-center flex items-center rounded-sm text-orange-600 px-2 bg-orange-200">
                              {projectAgencyMilestoneMap?.milestoneStatus || "N/A"}
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                        {/* Floating Title */}
                        <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                          Agency Details
                        </span>

                        <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Name
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {agency.agencyName || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Email
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {agency.email || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Contact No
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {agency.contactNo || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">

                        <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                          Vendor Details
                        </span>

                        <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Name
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {vendor.vendorName || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Email
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {vendor.email || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Contact No
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {vendor.contactNo || "N/A"}
                            </span>
                          </div>
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Address
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {vendor.address || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                        {/* Floating Title */}
                        <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                          Work Order Genaration Details
                        </span>
                        <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                          {/* ---------- VENDOR DETAILS ---------- */}
                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Work Order No
                            </span>
                            :
                            <span className="text-slate-900 font-semibold uppercase">
                              {workOrder?.workOrderNo || "N/A"}
                            </span>
                          </div>

                          <div className="col-span-3 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Work Order Date
                            </span>
                            :
                            <span className="text-slate-900 font-semibold">
                              {workOrder?.workOrderDate || "N/A"}
                            </span>
                          </div>

                          <div className="col-span-4 flex gap-1">
                            <span className="font-normal text-gray-700">
                              Work Order Document
                            </span>
                            :
                            <span
                              className="text-slate-900 font-semibold cursor-pointer"
                              onClick={() =>
                                openDocument(
                                  workOrder?.docPathBase64,
                                  "application/pdf"
                                )
                              }
                            >
                              {workOrder?.fileName || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                        {/* Floating Title */}
                        <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                          Geotag Details
                        </span>
                        <div className="grid grid-cols-12 gap-6 text-sm">
                          {geoTags?.map((i, index) => {
                            return (
                              <div className="col-span-3 flex gap-1" key={index}>
                                <Magnifier
                                  src={`data:image/png;base64,${i.documentBase64}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </Fragment>
          )
        })
      }

    </>
  )
}

export default EntireProjectDetails
