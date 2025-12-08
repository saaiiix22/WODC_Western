import React from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import InputField from "../../components/common/InputField";

const ManageRole = () => {
  return (
    <>
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
            Add Role
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <form className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <InputField
                label="Role Code"
                required={true}
                name="blockNameEN"
                // placeholder="Enter block name"
                // onChange={handleChangeInput}
                // error={errors.blockNameEN}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Display Name"
                required={true}
                name="blockNameEN"
                // placeholder="Enter block name"
                // onChange={handleChangeInput}
                // error={errors.blockNameEN}
              />
            </div>
            <div className="col-span-4">
              <InputField
                label="Description"
                required={true}
                name="blockNameEN"
                textarea={true}
                // placeholder="Enter block name"
                // onChange={handleChangeInput}
                // error={errors.blockNameEN}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Maximum Assignments"
                required={true}
                type="number"
                name="blockNameEN"
                // placeholder="Enter block name"
                // onChange={handleChangeInput}
                // error={errors.blockNameEN}
              />
            </div>
            <div className="col-span-2 flex justify-start gap-2 text-[13px] px-4 py-3 mt-4">
              <ResetBackBtn />
              <SubmitBtn />
            </div>
          </form>
        </div>
      </div>

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
            Role List
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          {/* Content Here */}
          Table Here
        </div>
      </div>
    </>
  );
};

export default ManageRole;
