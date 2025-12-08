import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../components/common/CommonButtons";

const Dashboard = () => {

 
  
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
          Dashboard
        </h3>
      </div>

      {/* Body */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        {/* Content Here */}
        
      </div>

      {/* Footer (Optional) */}
      <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
        {/* <ResetBackBtn />
        <SubmitBtn /> */}
      </div>
    </div>
  );
};

export default Dashboard;
