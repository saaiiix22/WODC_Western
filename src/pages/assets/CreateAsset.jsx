import React, { useEffect, useMemo, useState } from "react";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import {
  getAssetsCategoryListService,
  getAssetsLookupValuesService,
  getAssetsTypeListService,
} from "../../services/assetsService";
import {
  getProjectAgencyMilestoneMapDetailsService,
  getProjectListService,
  getProjectMapByProjectIdService,
  getSectorService,
} from "../../services/projectService";
import { encryptPayload } from "../../crypto.js/encryption";

const tabs = ["Basic Asset Details", "Asset Condition & Utilization"];

const CreateAsset = () => {
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

  const [formData, setFormData] = useState({
    assetsId: null,
    assetsName: "",
    assetsCtgId: null,
    assetsTypeId: null,
    sectorId: null,
    subSectorId: null,
    agencyId: null,
    projectId: null,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Asset submitted");
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
    const payload = encryptPayload({ isActive: true });
    const res = await getAssetsCategoryListService(payload);

    const result = res?.data?.data || [];

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

  const loadProjects = async () => {
    const payload = encryptPayload({ isActive: true });
    const res = await getProjectListService(payload);

    const result = res?.data?.data || [];

    const options = result.map((p) => ({
      value: p.projectId,
      label: p.projectName,
    }));

    setProjectList(options);
  };
  const handleProjectChange = async (projectIdValue) => {
    if (!projectIdValue) return; // 🛑 IMPORTANT

    const projectId = Number(projectIdValue);

    setFormData((prev) => ({
      ...prev,
      projectId,
      agencyId: null,
    }));

    const payload = encryptPayload({
      projectId,
      isActive: true,
    });

    const res = await getProjectAgencyMilestoneMapDetailsService(payload);
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
  };

  const loadAssetLookups = async () => {
    try {
      const [lifeCycleRes, conditionRes, utilizationRes] = await Promise.all([
        getAssetsLookupValuesService("ASSET_LIFE_CYCLE"),
        getAssetsLookupValuesService("ASSET_CONDITION"),
        getAssetsLookupValuesService("UTILIZATION_STATUS"),
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
            label="Project Name"
            name="projectId"
            value={formData.projectId || ""}
            options={projectList}
            placeholder="Select Project"
            onChange={(e) => handleProjectChange(e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <SelectField
            label="Implementing Agency"
            name="agencyId"
            value={formData.agencyId || ""}
            options={agencyList}
            placeholder="Select Agency"
            disabled={!formData.projectId}
            onChange={(e) => handleSelectChange("agencyId", e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <InputField
            type="date"
            label="Project Completion Date"
            name="projectCompletionDate"
            value={!formData.projectId}
            onChange={handleInputChange}
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
    loadProjects();
    loadAssetLookups();
  }, []);

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
          {activeTab === 0 && BasicDetails }
          {activeTab === 1 && ConditionUtilization }
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
