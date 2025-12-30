import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import MultiSelectDropdown from "../../components/common/MultiSelectDropdown";
import { useEffect, useState } from "react";
import { encryptPayload } from "../../crypto.js/encryption";
import { getMilesStoneListService } from "../../services/milesStoneService";
import {
  getAllSectorListService,
  getMilestoneBySectorService,
  saveSectorMilestoneMapService,
} from "../../services/sectorService";
import { toast } from "react-toastify";

const SectorMilestoneMapping = () => {
  const [formData, setFormData] = useState({
    sectorId: "",
    milestoneIds: [],
  });

  const [milestoneList, getMilestoneList] = useState([]);
  const getAllMilestoneOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getMilesStoneListService(payload);
      //   console.log(res?.data.data);
      getMilestoneList(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  const [sectorOpts, setSectorOpts] = useState([]);
  const getAllSectors = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAllSectorListService(payload);
      // console.log(res?.data.data);
      setSectorOpts(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllMilestoneOpts();
    getAllSectors();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "sectorId") {
      try {
        if (value) {
          const payload = encryptPayload({ sectorId: value });
          const res = await getMilestoneBySectorService(payload);

          setFormData((prev) => ({
            ...prev,
            sectorId: value,
            milestoneIds: res?.data.data || [],
          }));
        }
        else{
          setFormData({...formData, milestoneIds: []});
          // toast.error("Please select a valid sector");
        }
      } catch (error) {
        throw error;
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.sectorId || !formData.sectorId.trim()) {
      newErrors.sectorId = "Sector name is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = encryptPayload(formData);
        const res = await saveSectorMilestoneMapService(payload);
        console.log(res);

        if (res?.data.outcome && res?.status === 200) {
          toast.success(res?.data.message);
          setFormData({
            sectorId: "",
            milestoneIds: [],
          });
        }
      } catch (error) {
        throw error;
      }
    }
  };
  return (
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
          Sector Milestone Mapping
        </h3>
      </div>

      {/* Body */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <form
          action=""
          className="grid grid-cols-12 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="col-span-2">
            <SelectField
              label="Select Sector"
              required={true}
              name="sectorId"
              value={formData.sectorId}
              onChange={handleChange}
              options={sectorOpts?.map((d) => ({
                value: d.sectorId,
                label: d.sectorName,
              }))}
              error={errors.sectorId}
              placeholder="Select"
            />
          </div>
          <div className="col-span-2">
            <MultiSelectDropdown
              label="Milestones"
              name="milestoneIds"
              required
              value={formData.milestoneIds}
              onChange={handleChange}
              options={milestoneList?.map((i) => ({
                value: i.milestoneId,
                label: i.milestoneName,
              }))}
            />
          </div>
          <div className="col-span-12 flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn type={SubmitBtn} />
          </div>
        </form>
      </div>

      {/* Footer (Optional) */}
    </div>
  );
};

export default SectorMilestoneMapping;
