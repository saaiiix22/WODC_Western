import { useEffect, useState } from "react";
import SelectField from "../../../../components/common/SelectField";
import { encryptPayload } from "../../../../crypto.js/encryption";
import { getAllDists } from "../../../../services/blockService";
import { getBlockThroughDistrictService } from "../../../../services/gpService";
import { getGpByBlockService } from "../../../../services/villageService";
import { getSubsectorService, getVillageThroughGpService, getWardByMunicipalityService } from "../../../../services/projectService";
import { getMunicipalityViaDistrictsService } from "../../../../services/wardService";
import { getFyearList } from "../../../../services/gisAlldata";
import { getAllSectorListService } from "../../../../services/sectorService";
import { FaFilter } from "react-icons/fa";

const GisFilter = ({ onFilter, isVertical = false }) => {
  const [formData, setFormData] = useState({
    finyearId: "",
    projectStatus: "",
    sectorSubsectorId: "",
    subSectorId: "",
    districtId: "",
    blockId: "",
    gpId: "",
    municipalityId: "",
    areaType: "BLOCK",
    villageId: "",
    wardId: "",
  });

  const [options, setOptions] = useState({
    financialYears: [],
    sectors: [],
    subSectors: [],
    districts: [],
    blocks: [],
    gps: [],
    villages: [],
    municipalities: [],
    wards: [],
    statuses: [
      { value: "APPROVED", label: "Approved" },
      { value: "IN PROGRESS", label: "In Progress" },
      { value: "COMPLETED", label: "Completed" },
    ],
  });

  const loadOptions = async (service, payload, key, labelKey, valueKey) => {
    try {
      const encrypted = encryptPayload(payload);
      const res = await service(encrypted);
      if (res?.data?.outcome) {
        const opts = res.data.data.map((item) => ({
          label: item[labelKey],
          value: item[valueKey],
        }));
        setOptions((prev) => ({ ...prev, [key]: opts }));
      } else {
        setOptions((prev) => ({ ...prev, [key]: [] }));
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      setOptions((prev) => ({ ...prev, [key]: [] }));
    }
  };

  useEffect(() => {
    loadOptions(getFyearList, { isActive: true }, "financialYears", "finYear", "finyearId");
    loadOptions(getAllSectorListService, { isActive: true }, "sectors", "sectorName", "sectorId");
    loadOptions(getAllDists, { isActive: true }, "districts", "districtName", "districtId");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "districtId") {
        updated.blockId = "";
        updated.gpId = "";
        updated.villageId = "";
        updated.municipalityId = "";
        updated.wardId = "";
        setOptions(prevOpt => ({ ...prevOpt, blocks: [], municipalities: [], gps: [], villages: [], wards: [] }));

        if (value) {
          loadOptions(getBlockThroughDistrictService, { isActive: true, districtId: value }, "blocks", "blockNameEN", "blockId");
          loadOptions(getMunicipalityViaDistrictsService, { isActive: true, districtId: value }, "municipalities", "municipalityName", "municipalityId");
        }
      }
      else if (name === "areaType") {
        updated.blockId = "";
        updated.gpId = "";
        updated.villageId = "";
        updated.municipalityId = "";
        updated.wardId = "";
        setOptions(prevOpt => ({ ...prevOpt, blocks: [], municipalities: [], gps: [], villages: [], wards: [] }));

        if (formData.districtId) {
          if (value === "BLOCK") {
            loadOptions(getBlockThroughDistrictService, { isActive: true, districtId: formData.districtId }, "blocks", "blockNameEN", "blockId");
          } else {
            loadOptions(getMunicipalityViaDistrictsService, { isActive: true, districtId: formData.districtId }, "municipalities", "municipalityName", "municipalityId");
          }
        }
      }
      else if (name === "blockId") {
        updated.gpId = "";
        updated.villageId = "";
        setOptions(prevOpt => ({ ...prevOpt, gps: [], villages: [] }));
        if (value) {
          loadOptions(getGpByBlockService, { isActive: true, blockId: value }, "gps", "gpNameEN", "gpId");
        }
      }
      else if (name === "gpId") {
        updated.villageId = "";
        setOptions(prevOpt => ({ ...prevOpt, villages: [] }));
        if (value) {
          loadOptions(getVillageThroughGpService, { isActive: true, gpId: value }, "villages", "villageNameEn", "villageId");
        }
      }
      else if (name === "municipalityId") {
        updated.wardId = "";
        setOptions(prevOpt => ({ ...prevOpt, wards: [] }));
        if (value) {
          loadOptions(getWardByMunicipalityService, { isActive: true, municipalityId: value }, "wards", "wardName", "wardId");
        }
      }
      else if (name === "sectorSubsectorId") {
        updated.subSectorId = "";
        setOptions(prevOpt => ({ ...prevOpt, subSectors: [] }));
        if (value) {
          loadOptions(getSubsectorService, { isActive: true, sectorId: value }, "subSectors", "subSectorName", "subSectorId");
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let objectType = null;
    let objectId = null;

    if (formData.districtId) {
      objectType = "DISTRICT";
      objectId = parseInt(formData.districtId);
    }

    if (formData.areaType === "BLOCK") {
      if (formData.blockId) {
        objectType = "BLOCK";
        objectId = parseInt(formData.blockId);
      }
      if (formData.gpId) {
        objectType = "GP";
        objectId = parseInt(formData.gpId);
      }
      if (formData.villageId) {
        objectType = "VILLAGE";
        objectId = parseInt(formData.villageId);
      }
    } else if (formData.areaType === "MUNICIPALITY") {
      if (formData.municipalityId) {
        objectType = "MUNICIPALITY";
        objectId = parseInt(formData.municipalityId);
      }
      if (formData.wardId) {
        objectType = "WARD";
        objectId = parseInt(formData.wardId);
      }
    }

    let sectorPayloadId = null;
    let sectorPayloadLevel = null;

    if (formData.subSectorId) {
      sectorPayloadId = parseInt(formData.subSectorId);
      sectorPayloadLevel = "SUBSECTOR";
    } else if (formData.sectorSubsectorId) {
      sectorPayloadId = parseInt(formData.sectorSubsectorId);
      sectorPayloadLevel = "SECTOR";
    }

    const payload = {
      finyearId: formData.finyearId ? parseInt(formData.finyearId) : null,
      projectStatus: formData.projectStatus || null,
      sectorSubsectorId: sectorPayloadId,
      sectorSubsectorLevel: sectorPayloadLevel,
      objectType: objectType,
      objectId: objectId,
    };

    if (onFilter) {
      onFilter(payload);
    }
  };

  useEffect(() => {
    const initialPayload = {
      finyearId: null,
      projectStatus: null,
      sectorSubsectorId: null,
      sectorSubsectorLevel: null,
      objectType: null,
      objectId: null,
    };
    if (onFilter) {
      onFilter(initialPayload);
    }
  }, []);

  // Grid class logic
  const gridColClass = isVertical ? "col-span-12" : "col-span-12 md:col-span-6 lg:col-span-3";

  return (
    <div className={`bg-white p-5 rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 ${isVertical ? 'h-full' : 'mb-4 mt-4'}`}>
      <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-3">
        <div className="bg-blue-50 p-2 rounded-full text-blue-600">
          <FaFilter size={14} />
        </div>
        <h3 className="text-gray-800 font-semibold text-sm uppercase tracking-wide">Filter Projects</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`grid grid-cols-12 gap-x-6 gap-y-4 items-end`}>

          <div className={gridColClass}>
            <SelectField
              label="Financial Year"
              name="finyearId"
              value={formData.finyearId}
              onChange={handleChange}
              options={options.financialYears}
              placeholder="Select Year"
            />
          </div>

          <div className={gridColClass}>
            <SelectField
              label="District"
              required={false}
              name="districtId"
              value={formData.districtId}
              onChange={handleChange}
              options={options.districts}
              placeholder="Select"
            />
          </div>

          <div className={gridColClass}>
            <SelectField
              label="Sector"
              name="sectorSubsectorId"
              value={formData.sectorSubsectorId}
              onChange={handleChange}
              options={options.sectors}
              placeholder="Select Sector"
            />
          </div>

          <div className={gridColClass}>
            <SelectField
              label="Subsector"
              name="subSectorId"
              value={formData.subSectorId}
              onChange={handleChange}
              options={options.subSectors}
              disabled={!formData.sectorSubsectorId}
              placeholder="Select Subsector"
            />
          </div>


          {formData.districtId && (
            <>
              <div className="col-span-12 border-t border-dashed border-gray-200 my-1"></div>

              <div className={gridColClass}>
                <label className="text-[13px] font-medium text-gray-700 block mb-2">
                  Select Area Type
                </label>
                <div className="flex gap-5 items-center mt-3 text-sm">
                  <div className="flex gap-2 items-center cursor-pointer">
                    <input
                      type="radio"
                      value="BLOCK"
                      name="areaType"
                      checked={formData.areaType === "BLOCK"}
                      id="radio_block"
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <label htmlFor="radio_block" className="text-gray-700 cursor-pointer select-none">
                      Block
                    </label>
                  </div>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <input
                      type="radio"
                      value="MUNICIPALITY"
                      name="areaType"
                      checked={formData.areaType === "MUNICIPALITY"}
                      id="radio_muni"
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <label htmlFor="radio_muni" className="text-gray-700 cursor-pointer select-none">
                      Municipality
                    </label>
                  </div>
                </div>
              </div>

              {formData.areaType === "BLOCK" && (
                <>
                  <div className={gridColClass}>
                    <SelectField
                      label="Block Name"
                      required={false}
                      name="blockId"
                      value={formData.blockId}
                      onChange={handleChange}
                      options={options.blocks}
                      disabled={!formData.districtId}
                      placeholder="Select"
                    />
                  </div>
                  <div className={gridColClass}>
                    <SelectField
                      label="GP Name"
                      required={false}
                      name="gpId"
                      value={formData.gpId}
                      onChange={handleChange}
                      options={options.gps}
                      disabled={!formData.blockId}
                      placeholder="Select"
                    />
                  </div>
                  <div className={gridColClass}>
                    <SelectField
                      label="Village Name"
                      required={false}
                      name="villageId"
                      value={formData.villageId}
                      onChange={handleChange}
                      options={options.villages}
                      disabled={!formData.gpId}
                      placeholder="Select"
                    />
                  </div>
                </>
              )}

              {formData.areaType === "MUNICIPALITY" && (
                <>
                  <div className={gridColClass}>
                    <SelectField
                      label="Municipality Name"
                      required={false}
                      name="municipalityId"
                      value={formData.municipalityId}
                      onChange={handleChange}
                      options={options.municipalities}
                      disabled={!formData.districtId}
                      placeholder="Select"
                    />
                  </div>
                  <div className={gridColClass}>
                    <SelectField
                      label="Ward Name"
                      required={false}
                      name="wardId"
                      value={formData.wardId}
                      onChange={handleChange}
                      options={options.wards}
                      disabled={!formData.municipalityId}
                      placeholder="Select"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="col-span-12 border-t border-dashed border-gray-200 my-1"></div>

          <div className={gridColClass}>
            <SelectField
              label="Status"
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleChange}
              options={options.statuses}
              placeholder="Select Status"
            />
          </div>

          <div className={gridColClass}>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-6 rounded shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
              style={{ height: '34px' }}
            >
              <FaFilter /> Apply Filter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GisFilter;