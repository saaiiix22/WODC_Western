import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { useLocation } from "react-router-dom";
import { encryptPayload } from "../../crypto.js/encryption";
import { saveRoleLevelMapService } from "../../services/umtServices";
import { toast } from "react-toastify";

const AccessRole = () => {
  const location = useLocation();
  const state = location.state || {};

  const { role, roleRightLvlMstrList = [], roleLvlMapList } = state;

  const [formData, setFormData] = useState(
    roleRightLvlMstrList?.map(item => ({
      roleLevelId: item.roleRightLevelId,
      maxAllocations: item.maxAllocations ?? -1,
      status: false
    }))
  );
  const handleAllocationChange = (index, value) => {
    const updated = [...formData];
    updated[index].maxAllocations = Number(value);
    setFormData(updated);
  };
  const handleCheckboxChange = (index) => {
    const updated = [...formData];
    updated[index].status = !updated[index].status;
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // const payload = encryptPayload()
      const sendData = {
        roleId: role?.roleId,
        maxAllocations: formData.map(item => item.maxAllocations),
        roleLevelId: formData.map(item => item.roleLevelId),
        status: formData.map(item => item.status),
      };
      // console.log(sendData);
      const res = await saveRoleLevelMapService(sendData)
      console.log(res);
      if(res?.status === 200 && res?.data.outcome){
        toast.success(res?.data.message)
      }


    } catch (error) {
      throw error
    }
  };


  useEffect(() => {
    if (!roleRightLvlMstrList?.length || !roleLvlMapList?.length) return;

    setFormData(prev =>
      prev.map(item => {
        const matched = roleLvlMapList.find(
          lvl => lvl.levelId === item.roleLevelId
        );

        if (!matched) return item;

        return {
          ...item,
          status: true,
          maxAllocations: matched.maxAllocations ?? item.maxAllocations
        };
      })
    );
    
  }, [roleRightLvlMstrList, roleLvlMapList]);




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
            Role Access To Levels
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <form action="">
            <h2 className="mb-4 text-sm text-gray-600">
              Role: <span className="font-semibold text-gray-800">{" "} {role?.displayName}</span>
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
                {
                  roleRightLvlMstrList?.map((i, index) => {
                    return (
                      <tr className="border-b border-slate-200">
                        <td className="w-[60px] border-r text-sm border-slate-200 px-2 py-1 text-center">
                          {
                            index + 1
                          }
                        </td>
                        <td className="border-r text-sm border-slate-200 px-2 py-1">
                          {
                            i?.levelCode
                          }
                        </td>
                        <td className="border-r text-sm border-slate-200 px-2 py-1 capitalize">
                          {i?.levelEntityName}
                        </td>
                        <td className="border-r text-sm border-slate-200 px-2 py-1 capitalize">
                          {
                            i?.displayViewName
                          }
                        </td>
                        <td className="border-r text-sm border-slate-200 px-2 py-1">
                          {
                            i.displayName
                          }
                        </td>
                        <td className="border-r text-sm border-slate-200 px-2 py-1">
                          <input
                            type="number"
                            min={-1}
                            value={formData[index]?.maxAllocations}
                            onChange={(e) =>
                              handleAllocationChange(index, e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                          />
                        </td>
                        <td className="border-r text-sm border-slate-200 px-2 py-1 flex justify-center mt-3">
                          <input type="checkbox" name="" id="" checked={formData[index]?.status}
                            onChange={() => handleCheckboxChange(index)} />
                        </td>
                      </tr>
                    )
                  })
                }

              </tbody>
            </table>

          </form>
        </div>
        <div className="col-span-12 flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn path="/get-manage-user"/>
          <SubmitBtn type={'submit'} />
        </div>
      </div>
    </form>
  );
};

export default AccessRole;
