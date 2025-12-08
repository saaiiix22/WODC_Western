import React from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";

const AccessRole = () => {
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
          Role Access To Levels
        </h3>
      </div>

      {/* Body */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <form action="">
          <h2 className="mb-2 text-sm text-gray-600">
            Role: <span className="font-semibold text-gray-800">Admin</span>
          </h2>

          <table className="table-fixed w-full border border-slate-300">
            <thead className="bg-slate-100">
              <tr>
                <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
                  SL No
                </td>
                <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                  Level Code
                </td>
                <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                  Source Entity
                </td>
                <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                  Display Entity
                </td>
                <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                  Description
                </td>
                <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                  Max Allocation
                </td>
                <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                  Select/Unselect
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-[60px] border-r text-sm border-slate-200 px-2 py-1 text-center">
                  1
                </td>
                <td className="border-r text-sm border-slate-200 px-2 py-1">
                  State
                </td>
                <td className="border-r text-sm border-slate-200 px-2 py-1">
                  State Entity
                </td>
                <td className="border-r text-sm border-slate-200 px-2 py-1">
                  Display Entity
                </td>
                <td className="border-r text-sm border-slate-200 px-2 py-1">
                  Description
                </td>
                <td className="border-r text-sm border-slate-200 px-2 py-1">
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                  />
                </td>
                <td className="border-r text-sm border-slate-200 px-2 py-1 flex justify-center mt-3">
                  <input type="checkbox" name="" id="" />
                </td>
              </tr>
            </tbody>
          </table>
          
        </form>
      </div>
      <div className="col-span-12 flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn />
          </div>
    </div>
  );
};

export default AccessRole;
