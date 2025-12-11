import React, { useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";

const WorkOrderGeneration = () => {
  const [formData, setFormData] = useState({
    projectId:'',
    milestoneId:'',
    vendorId:'',
    workOrderNumber:'',
    workOrderDate:''
  });
  const {projectId,milestoneId,vendorId,workOrderNumber,workOrderDate} = formData
  const handleChangeInput=async(e)=>{
    const {name,value} = e.target
    setFormData({...formData,[name]:value})
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    console.log(formData);
    
  }
  return (
    <form action="" onSubmit={handleSubmit}>
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
            Work Order Generation
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <SelectField
                label={"Project Name"}
                required={true}
                name="projectId"
                placeholder="Select"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label={"Milestone Name"}
                required={true}
                name="milestoneId"
                placeholder="Select"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label={"Vendor Name"}
                required={true}
                name="vendorId"
                placeholder="Select"
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
    </form>
  );
};

export default WorkOrderGeneration;
