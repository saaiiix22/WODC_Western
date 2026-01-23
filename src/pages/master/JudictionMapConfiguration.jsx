import React, { useEffect, useState } from 'react'
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { GoPencil } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import SelectField from "../../components/common/SelectField";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { Tooltip } from "@mui/material";
import { districtListByConstituencyTypeService, getConstituencyNameService, getJurisdictionConfigByConsIdService, judictionMapConfigService, saveJurisdictionConfig } from '../../services/judictionMapConfigService';
import { constituencyTypeListService } from '../../services/constituencyService';
import { encryptPayload } from '../../crypto.js/encryption';
import MultiSelectDropdown from '../../components/common/MultiSelectDropdown';
import { getBlockThroughDistrictService } from '../../services/gpService';
import { toast } from 'react-toastify';


const JudictionMapConfiguration = () => {

  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  const [formData, setFormData] = useState({
    judictionConfigId: null,
    judictionType: "",
    constituencyTypeCode: "",
    constituencyName: "",
    districtIds: [],
    blockIds: []
  });

  const handleInpChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }


  const { judictionType, constituencyTypeCode, constituencyName, districtIds, blockIds, judictionConfigId } = formData;

  const [JudictionMapConfigurations, setJudictionMapConfigurations] = useState([]);
  const getJudictionMapConfigurations = async () => {
    try {
      const res = await judictionMapConfigService();
      setJudictionMapConfigurations(res?.data.data);
    } catch (error) {
      throw error;
    }
  };


  const [constituencyTypeOptions, setConstituencyTypeOptions] = useState([]);
  const getconstituencyOptions = async () => {
    try {
      const res = await constituencyTypeListService();
      setConstituencyTypeOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };


  const [districtListByType, setDistrictListByType] = useState([]);
  const getDistrictListByType = async () => {
    try {
      const payload = encryptPayload({ consId: constituencyName });
      const res = await districtListByConstituencyTypeService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setDistrictListByType(res?.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [consName, setConsName] = useState([])
  const getconstituencyNameOptions = async () => {
    try {
      const payload = encryptPayload({
        isActive: true,
        constituencyTypeCode: constituencyTypeCode
      })
      const res = await getConstituencyNameService(payload)
      if (res?.status === 200 && res?.data.outcome) {
        setConsName(res?.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [blockOptions, setBlockOptions] = useState([]);
  const getBlocksByDistricts = async () => {
    try {
      let fetchedBlocks = [];

      const validDistrictIds = districtIds.filter(
        (id) => id !== null && id !== undefined
      );

      for (const districtId of validDistrictIds) {
        const payload = encryptPayload({
          isActive: true,
          districtId: Number(districtId),
        });

        const res = await getBlockThroughDistrictService(payload);

        if (res?.data?.outcome) {
          fetchedBlocks.push(...res.data.data);
        }
      }

      setBlockOptions((prev) => {
        const merged = [...prev, ...fetchedBlocks];
        return Array.from(
          new Map(merged.map((b) => [b.blockId, b])).values()
        );
      });

    } catch (err) {
      console.log(err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const districtBlockMap = {};

      districtIds.forEach((districtId) => {
        const blocksForDistrict = blockOptions
          .filter(
            (block) =>
              block.district?.districtId === Number(districtId) &&
              blockIds.includes(block.blockId)
          )
          .map((block) => Number(block.blockId));

        if (blocksForDistrict.length > 0) {
          districtBlockMap[districtId] = blocksForDistrict;
        }
      });

      const payload = {
        judictionConfigId: judictionConfigId,
        judictionRoleCode: judictionType,
        constituencyTypeCode: constituencyTypeCode,
        isActive: true,
        districtBlockMap,
      };
      const res = await saveJurisdictionConfig(encryptPayload(payload))
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message)
        setFormData({
          judictionType: "",
          constituencyTypeCode: "",
          constituencyName: "",
          districtIds: [],
          blockIds: []
        })
        setExpanded("panel2")
      }

    } catch (error) {
      console.log(error);
    }
  };

  const getSelectedData = async () => {
    try {
      const payload = encryptPayload({
        consId: constituencyName
      })
      const res = await getJurisdictionConfigByConsIdService(payload)

      const data = res?.data.data

      if (res?.status === 200 && res?.data.outcome) {
        setFormData((prev) => ({
          ...prev,
          judictionConfigId: data.judictionConfigId,
          districtIds: Object.keys(data.districtBlockMap).map(Number),
          blockIds: Object.values(data.districtBlockMap).flat(),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(formData);




  useEffect(() => {
    getconstituencyOptions();
    getJudictionMapConfigurations();
  }, []);

  useEffect(() => {
    if (judictionType === "MP") {
      setFormData({ ...formData, constituencyTypeCode: "Parliamentary Constituency" })
    }

    if (judictionType === "MLA") {
      setFormData({ ...formData, constituencyTypeCode: "Assembly Constituencies" })
    }
  }, [judictionType])

  useEffect(() => {
    if (constituencyTypeCode) {
      getconstituencyNameOptions()
    }
  }, [constituencyTypeCode])
  useEffect(() => {
    if (!constituencyName) return;

    getDistrictListByType();
    setBlockOptions([]);
    getSelectedData();

  }, [constituencyName]);


  // console.log(formData);


  useEffect(() => {
    if (!districtIds || districtIds.length === 0) {
      setBlockOptions([]);
      setFormData((prev) => ({ ...prev, blockIds: [] }));
      return;
    }


    setBlockOptions((prev) =>
      prev.filter((block) =>
        districtIds.includes(block.district?.districtId)
      )
    );

    // setFormData((prev) => ({
    //   ...prev,
    //   blockIds: prev.blockIds.filter((blockId) =>
    //     blockOptions.some(
    //       (block) =>
    //         block.blockId === blockId &&
    //         districtIds.includes(block.district?.districtId)
    //     )
    //   ),
    // }));

    // getSelectedData()
    getBlocksByDistricts();

  }, [districtIds]);


  useEffect(() => {
    if (!blockOptions.length || !blockIds.length) return;

    setFormData(prev => ({
      ...prev,
      blockIds: prev.blockIds.filter(blockId =>
        blockOptions.some(b => b.blockId === blockId)
      ),
    }));
  }, [blockOptions]);




  return (
    <div className="mt-3">
      {/* ---------- Accordion 1: Add Judiction Map ---------- */}
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
              color: "#3c001b",
            }}
          >
            Add Judiction Map
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form className="grid grid-cols-12 gap-6" onSubmit={handleSubmit}>
              {/* Judiction Type Dropdown */}
              <div className="col-span-2">
                <SelectField
                  label="Judiction Type"
                  required={true}
                  name="judictionType"
                  value={judictionType}
                  onChange={handleInpChange}
                  placeholder="Select"
                  options={JudictionMapConfigurations?.map((d) => ({
                    value: d.lookupValueCode,
                    label: d.lookupValueEn,
                  }))}
                />
              </div>

              {/* Constitution Type Dropdown */}
              <div className="col-span-2">
                <SelectField
                  label="Constitution Type"
                  required={true}
                  disabled={true}
                  name="constituencyTypeCode"
                  value={constituencyTypeCode}
                  onChange={handleInpChange}
                  // disabled={!constituencyTypeCode}
                  placeholder="Select"
                  options={constituencyTypeOptions?.map((d) => ({
                    value: d.constituencyTypeCode,
                    label: d.lookupValueEn,
                  }))}
                />
              </div>

              {
                constituencyTypeCode && (
                  <div className="col-span-2">
                    <SelectField
                      label="Constitution Name"
                      required={true}
                      name="constituencyName"
                      value={constituencyName}
                      disabled={!constituencyTypeCode}
                      onChange={handleInpChange}
                      placeholder="Select"
                      options={consName?.map((d) => ({
                        value: d.consId,
                        label: d.consName,
                      }))}
                    />
                  </div>
                )
              }

              {/* District Dropdown */}
              <div className="col-span-2">
                <MultiSelectDropdown
                  label="District"
                  required={true}
                  value={districtIds}
                  name="districtIds"
                  onChange={handleInpChange}
                  placeholder="Select district"
                  disabled={!constituencyTypeCode}
                  options={districtListByType?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                />
              </div>

              {/* Block Dropdown */}
              <div className="col-span-2">
                <MultiSelectDropdown
                  label="Block"
                  value={blockIds}
                  required={true}
                  name="blockIds"
                  onChange={handleInpChange}
                  placeholder="Select block"
                  options={blockOptions?.map((d) => ({
                    value: d.blockId,
                    label: d.blockNameEN,
                  }))}
                />
              </div>

              {/* Buttons */}
              <div className="col-span-2">
                <div className="flex justify-center gap-2 mt-6">
                  <ResetBackBtn />
                  <SubmitBtn />
                </div>
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* ---------- Accordion 2: Judiction Map List ---------- */}
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
              color: "#3c001b",
            }}
          >
            Judiction Map List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable
            data={[]}
            columns={[
              {
                name: "Sl No",
                selector: (row, index) => index + 1,
                width: "80px",
                center: true,
              },
              {
                name: "Judiction Type",
                selector: (row) => row.judictionType,
              },
              {
                name: "Constitution Type",
                selector: (row) => row.constitutionType,
              },
              {
                name: "District",
                selector: (row) => row.district,
              },
              {
                name: "Block",
                selector: (row) => row.block,
              },
              {
                name: "Remarks",
                selector: (row) => row.remarks,
              },
              {
                name: "Status",
                width: "100px",
                selector: (row) => row.isActive ? "Active" : "Inactive",
              },
              {
                name: "Action",
                width: "120px",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <Tooltip title="Edit" arrow>
                      <button
                        type="button"
                        className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
                      >
                        <GoPencil className="w-4 h-4" />
                      </button>
                    </Tooltip>

                    <Tooltip title="Status" arrow>
                      <button
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600/25 text-green-600"
                      >
                        <MdLockOutline className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
              },
            ]}
          />
        </AccordionDetails>
      </Accordion>

      {/* Status Change Confirmation Dialog */}
      <ReusableDialog
        open={false}
        description="Are you sure you want to change status?"
        onClose={() => { }}
        onConfirm={() => { }}
      />

      {/* Submit Confirmation Dialog */}
      <ReusableDialog
        open={false}
        description="Are you sure you want to submit?"
        onClose={() => { }}
        onConfirm={() => { }}
      />
    </div>
  )
}

export default JudictionMapConfiguration;