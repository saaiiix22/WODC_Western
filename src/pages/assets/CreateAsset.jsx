import React, { useEffect, useMemo, useState } from "react";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import {
  getAssetsCategoryListService,
  getAssetsLookupValuesService,
  getAssetsTypeListService,
  saveUpdateAssetsService,
} from "../../services/assetsService";
import {
  getProjectAgencyMilestoneMapDetailsService,
  getProjectListByAgencyService,
  getProjectListService,
  getProjectMapByProjectIdService,
  getSectorService,
} from "../../services/projectService";
import { districtList } from "../../services/demographyService";
import { getBlockThroughDistrictService } from "../../services/gpService";
import { load } from "../../hooks/load";
import { encryptPayload } from "../../crypto.js/encryption";
import { getAgencyDetailsService } from "../../services/agencyService";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const tabs = ["Basic Asset Details", "Asset Condition & Utilization"];

const CreateAsset = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [assetsCategoryList, setAssetsCategoryList] = useState([]);
  const [assetsTypeList, setAssetsTypeList] = useState([]);
  const [sectorMasterList, setSectorMasterList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [subSectorList, setSubSectorList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const [agencyProjectMap, setAgencyProjectMap] = useState([]);
  const [lifeCycleOptions, setLifeCycleOptions] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [utilizationOptions, setUtilizationOptions] = useState([]);
  const [districtMasterList, setDistrictMasterList] = useState([]);
  const [districtListOptions, setDistrictListOptions] = useState([]);
  const [blockList, setBlockList] = useState([]);

  const [formData, setFormData] = useState({
    assetsId: null,
    assetsName: "",
    assetsCtgId: null,
    assetsTypeId: null,
    districtId: null,
    blockId: null,
    sectorId: null,
    subSectorId: null,
    agencyId: null,
    projectId: null,
    actualStartDate: "",
    assetCreationDate: "",
    assetAmount: null,
    assetLifeCycleStageCode: "",
    assetConditionCode: "",
    assetUtilizationStatusCode: "",
    lastInspectionDate: "",
    remarks: "",
  });

  // ----------------------------------------------------------------------//
  //------------------------ handler Functions ----------------------------//
  // ----------------------------------------------------------------------//

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.assetsName.trim()) {
      toast.error("Asset Name is required.");
      return;
    }
    if (!formData.assetsCtgId) {
      toast.error("Asset Category is required.");
      return;
    }

    if (!formData.sectorId) {
      toast.error("Sector is required.");
      return;
    }
    if (!formData.agencyId) {
      toast.error("Agency is required.");
      return;
    }
    if (!formData.projectId) {
      toast.error("Project is required.");
      return;
    }

    try {
  
      const encryptedData = encryptPayload(formData);
      const response = await saveUpdateAssetsService(encryptedData);

      if (response?.data?.outcome) {
        toast.error("Asset created successfully!");
        // Reset form or navigate as needed
        setFormData({
          assetsId: null,
          assetsName: "",
          assetsCtgId: null,
          assetsTypeId: null,
          districtId:null,
          blockId:null,
          sectorId: null,
          subSectorId: null,
          agencyId: null,
          projectId: null,
          actualStartDate: "",
          assetCreationDate: "",
          assetAmount: null,
          assetLifeCycleStageCode: "",
          assetConditionCode: "",
          assetUtilizationStatusCode: "",
          lastInspectionDate: "",
          remarks: "",
        });
        setActiveTab(0); // Go back to first tab
      } else {
        toast.error("Failed to create asset. Please try again.");
      }
    } catch (error) {
      console.error("Error creating asset:", error);
      toast.error("An error occurred while creating the asset.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? Number(value) : null,
    }));
  };

  const mapLookupOptions = (data = []) =>
    data.map((item) => ({
      label: item.lookupValueEn, // display text
      value: item.lookupValueCode, // backend code
    }));

  // ----------------------------------------------------------------------//
  //-------------------------- Dropdown Section ---------------------------//
  // ----------------------------------------------------------------------//

  const loadAssetsCategories = async () => {
    // const payload = encryptPayload({ isActive: true });
    const res = await getAssetsCategoryListService();

    const result = res?.data?.data || [];
    console.log("Assets Categories:", result);
    const mappedOptions = result.map((item) => ({
      value: item.assetsCtgId, // key
      label: item.assetsCtgName, // display name
    }));
    setAssetsCategoryList(mappedOptions);
  };

  const loadAssetsTypes = async () => {
    const payload = encryptPayload({ isActive: true });
    const res = await getAssetsTypeListService(payload);

    const result = res?.data?.data || [];

    const mappedOptions = result.map((item) => ({
      value: item.assetsTypeId,
      label: item.assetsTypeName,
    }));
    setAssetsTypeList(mappedOptions);
  };

  const loadSector = async () => {
    const payload = encryptPayload({ isActive: true });
    const res = await getSectorService(payload);

    const result = res?.data?.data || [];

    // 🔹 Store full response for sub-sector mapping
    setSectorMasterList(result);

    // 🔹 Sector dropdown options
    const sectorOptions = result.map((s) => ({
      value: s.sectorId,
      label: s.sectorName,
    }));

    setSectorList(sectorOptions);
  };

  const handleSectorChange = (sectorIdValue) => {
    const sectorId = Number(sectorIdValue);

    // update form + reset sub sector
    setFormData((prev) => ({
      ...prev,
      sectorId,
      subSectorId: null,
    }));

    // find selected sector
    const selectedSector = sectorMasterList.find(
      (s) => s.sectorId === sectorId,
    );

    const subSectorOptions =
      selectedSector?.subSectorDtoList
        ?.filter((ss) => ss.subSectorName?.trim()) // remove empty names
        .map((ss) => ({
          value: ss.subSectorId,
          label: ss.subSectorName,
        })) || [];

    setSubSectorList(subSectorOptions);
  };


  // ---------------- Districts & Blocks ----------------
  const loadDistricts = async () => {
    await load(districtList, { isActive: true }, (result) => {
      const data = result || [];
      setDistrictMasterList(data);
      const opts = data.map((d) => ({
        value: d.districtId,
        label: d.districtName || d.districtNameEN || `District ${d.districtId}`,
      }));
      setDistrictListOptions(opts);
    });
  };

  const handleDistrictChange = async (districtIdValue) => {
    if (!districtIdValue) {
      setFormData((prev) => ({ ...prev, districtId: null, blockId: null }));
      setBlockList([]);
      return;
    }

    const districtId = Number(districtIdValue);
    setFormData((prev) => ({ ...prev, districtId, blockId: null }));

    try {
      await load(
        getBlockThroughDistrictService,
        { isActive: true, districtId },
        (blocks) => {
          const data = blocks || [];
          const blockOpts = data.map((b) => ({
            value: b.blockId,
            label: b.blockNameEN || b.blockName || `Block ${b.blockId}`,
          }));
          setBlockList(blockOpts);
        }
      );
    } catch (err) {
      console.error("Error loading blocks:", err);
      setBlockList([]);
    }
  };

  
  const loadAgencies = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAgencyDetailsService(payload);

      const result = res?.data?.data || [];

      const agencyOptions = [
        ...new Map(
          result.map((item) => [
            item.agencyId,
            {
              value: item.agencyId,
              label: item.agencyName,
            },
          ]),
        ).values(),
      ];
      setAgencyList(agencyOptions);
    } catch (err) {
      console.error("Error fetching agencies:", err);
      setAgencyList([]);
    }
  };

  const handleAgencyChange = async (agencyIdValue) => {
    if (!agencyIdValue) return;

    const agencyId = Number(agencyIdValue);

    setFormData((prev) => ({
      ...prev,
      agencyId,
      projectId: null, // reset project
    }));

    const payload = encryptPayload({
      agencyId,
      isActive: true,
    });
    try {
      const res = await getProjectListByAgencyService(payload);
      const result = res?.data?.data || [];
      setAgencyProjectMap(result);
      const projectOptions = [
        ...new Map(
          result.map((item) => [
            item.projectId,
            {
              value: item.projectId,
              label: item.projectName,
            },
          ]),
        ).values(),
      ];

      setProjectList(projectOptions);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjectList([]);
    }
  };

  const handleProjectChange = (projectIdValue) => {
    const projectId = Number(projectIdValue);
    const selectedProject = agencyProjectMap.find(
      (p) => p.projectId === projectId,
    );
    // convert DD/MM/YYYY → YYYY-MM-DD for input[type="date"]
    let formattedDate = "";
    if (selectedProject?.endDate) {
      const [day, month, year] = selectedProject.endDate.split("/");
      formattedDate = `${year}-${month}-${day}`;
    }
    setFormData((prev) => ({
      ...prev,
      projectId,
      actualStartDate: formattedDate,
    }));
  };

  const loadAssetLookups = async () => {
    try {
      const [lifeCycleRes, conditionRes, utilizationRes] = await Promise.all([
        getAssetsLookupValuesService("ASSET_LIFECYCLE_STAGE"),
        getAssetsLookupValuesService("ASSET_CONDITION"),
        getAssetsLookupValuesService("ASSET_UTILIZATION"),
      ]);

      if (lifeCycleRes?.data?.outcome) {
        setLifeCycleOptions(mapLookupOptions(lifeCycleRes.data.data));
      }

      if (conditionRes?.data?.outcome) {
        setConditionOptions(mapLookupOptions(conditionRes.data.data));
      }

      if (utilizationRes?.data?.outcome) {
        setUtilizationOptions(mapLookupOptions(utilizationRes.data.data));
      }
    } catch (err) {
      console.error("Lookup load failed", err);
    }
  };

  // ----------------------------------------------------------------------//
  //---------------------------- Tabs Section -----------------------------//
  // ----------------------------------------------------------------------//

  //    1. Basic Detils
  const BasicDetails = useMemo(
    () => (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <InputField
            label="Asset Name"
            name="assetsName"
            value={formData.assetsName}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Asset Category"
            name="assetsCtgId"
            type="text"
            value={formData.assetsCtgId || ""}
            options={assetsCategoryList}
            placeholder="select category"
            onChange={(e) => handleSelectChange("assetsCtgId", e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="District"
            name="districtId"
            value={formData.districtId || ""}
            options={districtListOptions}
            placeholder="Select District"
            onChange={(e) => handleDistrictChange(e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Block"
            name="blockId"
            value={formData.blockId || ""}
            options={blockList}
            placeholder="Select Block"
            disabled={!formData.districtId}
            onChange={(e) => handleSelectChange("blockId", e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Sector"
            name="sectorId"
            value={formData.sectorId || ""}
            placeholder="Select Sector"
            options={sectorList}
            onChange={(e) => handleSectorChange(e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Sub Sector"
            name="subSectorId"
            value={formData.subSectorId || ""}
            options={subSectorList}
            placeholder="Select Sub Sector"
            disabled={!formData.sectorId}
            onChange={(e) => handleSelectChange("subSectorId", e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Implementing Agency"
            name="agencyId"
            value={formData.agencyId || ""}
            options={agencyList}
            placeholder="Select Agency"
            // disabled={!formData.projectId}
            onChange={(e) => handleAgencyChange(e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Project Name"
            name="projectId"
            value={formData.projectId || ""}
            options={projectList}
            placeholder="Select Project"
            disabled={!formData.agencyId}
            onChange={(e) => handleProjectChange(e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <InputField
            type="date"
            label="Project Completion Date"
            name="projectCompletionDate"
            value={formData.actualStartDate || ""}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <div className="col-span-3">
          <InputField
            type="date"
            label="Asset Creation Date"
            name="assetCreationDate"
            value={formData.assetCreationDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-span-3">
          <InputField
            type="number"
            label="Asset Cost"
            name="assetAmount"
            value={formData.assetAmount}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Asset Life Cycle"
            options={lifeCycleOptions}
            value={formData.assetLifeCycleStageCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                assetLifeCycleStageCode: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="col-span-6">
          <label className="block text-sm font-medium mb-1">
            Purpose / Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Describe asset purpose and usage..."
          />
        </div>
      </div>
    ),
    [
      formData,
      assetsCategoryList,
      sectorList,
      subSectorList,
      projectList,
      agencyList,
      lifeCycleOptions,
    ],
  );

  // useMemo(() => first, [second])

  //  2. Asset Condition& Utilization
  const ConditionUtilization = useMemo(
    () => (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <SelectField
            label="Asset Condition"
            options={conditionOptions}
            value={formData.assetConditionCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                assetConditionCode: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Utilization Status"
            options={utilizationOptions}
            value={formData.assetUtilizationStatusCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                assetUtilizationStatusCode: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="col-span-3">
          <InputField
            type="date"
            label="Last Inspection Date"
            name="lastInspectionDate"
            value={formData.lastInspectionDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-span-6">
          <label className="block text-sm font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2 focus:ring-orange-400"
          />
        </div>
      </div>
    ),
    [formData, conditionOptions, utilizationOptions],
  );

  // ----------------------------------------------------------------------//
  //----------------------------- APIs Section ------------------------------//
  // ----------------------------------------------------------------------//
  useEffect(() => {
    loadAssetsCategories();
    loadAssetsTypes();
    loadSector();
    loadAgencies();
    loadAssetLookups();
    loadDistricts();
  }, []);

  useEffect(() => {
    if (location.state?.asset && assetsCategoryList.length > 0 && assetsTypeList.length > 0 && sectorMasterList.length > 0 && agencyList.length > 0 && projectList.length > 0) {
      // Populate form with asset data for editing
      const asset = location.state.asset;
      setFormData({
        assetsId: asset.assetsId || null,
        assetsName: asset.assetsName || "",
        assetsCtgId: asset.assetsCtgId || null,
        assetsTypeId: asset.assetsTypeId || null,
        districtId: asset.districtId || null,
        blockId: asset.blockId || null,
        sectorId: asset.sectorId || null,
        subSectorId: asset.subSectorId || null,
        agencyId: asset.agencyId || null,
        projectId: asset.projectId || null,
        actualStartDate: asset.actualStartDate || "",
        assetCreationDate: asset.assetCreationDate || "",
        assetAmount: asset.assetAmount || null,
        assetLifeCycleStageCode: asset.assetLifeCycleStageCode || "",
        assetConditionCode: asset.assetConditionCode || "",
        assetUtilizationStatusCode: asset.assetUtilizationStatusCode || "",
        lastInspectionDate: asset.lastInspectionDate || "",
        remarks: asset.remarks || "",
      });
    }
  }, [location.state, assetsCategoryList, assetsTypeList, sectorMasterList, agencyList, projectList]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <h3 className="flex items-center gap-2 text-white text-[18px] px-3 py-2 bg-light-dark rounded-t-md">
          Asset Creation/Edit
        </h3>

        {/* tabs */}
        <div className="flex gap-2 px-4 py-3 border-b bg-[#fafafa]">
          {tabs.map((tab, index) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-1 rounded text-sm border
                ${
                  activeTab === index
                    ? "bg-[#ff9800] text-white border-[#ff9800]"
                    : "bg-white text-[#444] border-[#ddd] hover:bg-[#fff3e0]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* body  */}
        <div className="py-6 px-5 text-[#444]">
          {activeTab === 0 && BasicDetails}
          {activeTab === 1 && ConditionUtilization}
        </div>

        {/* footer  */}

        {/* Footer */}
        <div className="flex justify-center gap-3 bg-[#42001d0f] border-t px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn type="submit" />
        </div>
      </div>
    </form>
  );
};

export default CreateAsset;
