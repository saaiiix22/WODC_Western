import React, { useEffect, useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FiFileText } from "react-icons/fi";
import { getProjectByFinYearService } from "../../services/projectService";
import { getFinancialYearService } from "../../services/budgetService";
import { getCompleteMilestoneService } from "../../services/workOrderGenerationService";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import { getUCdetailsService } from "../../services/ucSubmissionService";

const UCsubmission = () => {
  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",
  });
  const { finYear, projectId, milestoneId } = formData;

  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);


  const [workOrderDTO,setWorkOrderDTO] = useState({})

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getAllFinOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setFinOpts(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };
  const getProjectOptsByFinYear = async () => {
    try {
      if (finYear) {
        const payload = encryptPayload({
          isActive: true,
          finyearId: parseInt(finYear),
        });
        const res = await getProjectByFinYearService(payload);
        // console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          setProjectOpts(res?.data.data);
        } else {
          toast.error(res?.data.message);
          setProjectOpts([]);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const getAllMistoneOpts = async () => {
    try {
      if (projectId) {
        const payload = encryptPayload({
          projectId: projectId,
        });
        const res = await getCompleteMilestoneService(payload);
        // console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          setMilestoneOpts(res?.data.data);
        } else {
          toast.error(res?.data.message);
          setMilestoneOpts([]);
        }
      }
    } catch (error) {
      throw error;
    }
  };
  const getAllUCdetails = async () => {
      try {
        if (milestoneId && projectId) {
          const payload = encryptPayload({
            projectId: projectId,
            milestoneId: milestoneId,
          });
          const res = await getUCdetailsService(payload);
          if (res?.status === 200 && res?.data.outcome) {
              console.log(res);
              setWorkOrderDTO(res?.data.data.workOrderDto)
          }
        }
      } catch (error) {
        throw error;
      }
    };

  useEffect(() => {
    getAllFinOpts();
  }, []);
  useEffect(() => {
    if (finYear) {
      getProjectOptsByFinYear();
    }
  }, [finYear]);
  useEffect(() => {
    if (projectId) {
      getAllMistoneOpts();
    }
  }, [projectId]);
  
  useEffect(() => {
      if (projectId && milestoneId) {
        getAllUCdetails();
      }
    }, [projectId, milestoneId]);

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
          UC Submission
        </h3>
      </div>

      {/* Body */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2">
            <SelectField
              label={"Financial Year"}
              required={true}
              name="finYear"
              value={finYear}
              options={finOpts?.map((i) => ({
                value: i.finyearId,
                label: i.finYear,
              }))}
              placeholder="Select"
              onChange={handleChangeInput}
            />
          </div>
          <div className="col-span-2">
            <SelectField
              label={"Project Name"}
              required={true}
              name="projectId"
              value={projectId}
              placeholder="Select"
              disabled={finYear ? false : true}
              onChange={handleChangeInput}
              options={projectOpts.map((i) => ({
                value: i.projectId,
                label: i.projectName,
              }))}
            />
          </div>
          <div className="col-span-2">
            <SelectField
              label={"Milestone Name"}
              required={true}
              name="milestoneId"
              placeholder="Select"
              disabled={projectId ? false : true}
              options={milestoneOpts?.map((i) => ({
                value: i.milestoneId,
                label: i.milestoneName,
              }))}
              onChange={handleChangeInput}
            />
          </div>
        </div>
      </div>

      {/* Footer (Optional) */}
      <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
        <ResetBackBtn />
        <SubmitBtn />
      </div>
    </div>
  );
};

export default UCsubmission;
