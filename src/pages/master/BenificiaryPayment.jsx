import React, { useEffect, useState } from 'react'
import SelectField from '../../components/common/SelectField';
import InputField from '../../components/common/InputField';
import { FiEdit, FiFileText } from 'react-icons/fi';
import { ResetBackBtn, SubmitBtn } from '../../components/common/CommonButtons';
// import { editBeneficiaryPaymentSerice, empSkillService, empTypeService, listBenPaymentService, saveBeneficiaryPaymentSerice } from '../../services/beneficiaryService';
import { encryptPayload } from '../../crypto.js/encryption';
import { getMilestoneService } from '../../services/projectService';
import { getMilesStoneListService } from '../../services/milesStoneService';
import ReusableDialog from '../../components/common/ReusableDialog';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

const BenificiaryPayment = () => {

    const [formData, setFormData] = useState({
        payConfigId: null,
        benType: "",
        employeeSkill: "",
        milestoneId: "",
        amount:""
      });
      const {
        payConfigId,
        benType,
        employeeSkill,
        milestoneId,
        amount,
      } = formData;

      const [errors, setErrors] = useState({});
      const [tableData, setTableData] = useState([]);
      const [empTypeOpts, setEmpTypeOpts] = useState([]);
      const [skillOpts, setSkillOpts] = useState([]);
      const [milestoneOpts, setMilestoneOpts] = useState([]);
      
      const [open, setOpen] = useState(false);
      const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
      });
      
      const handleOnConfirm = (e) => {
        e.preventDefault();
        let newErrors = {};


        if (!benType) {
            newErrors.benType = "Please Select Benificiary Type";
            setErrors(newErrors);
            return;
          }

          if (!employeeSkill) {
            newErrors.employeeSkill = "Please select Benificiary Skill.";
            setErrors(newErrors);
            return;
          }
          if (!milestoneId) {
            newErrors.milestoneId = "Please Select Milestone. ";
            setErrors(newErrors);
            return;
          }
        if (!amount) {
          newErrors.amount = "Please Enter Amount.";
          setErrors(newErrors);
          return;
        }
 
        if (Object.keys(newErrors).length === 0) {
          setOpen(true)
        }
      };
      //------------------------------------------------------------------------------
      const handleSubmit = async (e) => {

    
        const sendData = {
            payConfigId,
            benType,
            employeeSkill,
            milestoneId,
            amount,
        };
        const payload = encryptPayload(sendData);
    
        try {
          const res = await saveBeneficiaryPaymentSerice(payload);
           getTableData();
          setFormData({
            payConfigId: null,
            benType: "",
            employeeSkill: "",
            milestoneId: "",
            amount:"",
          });
          setOpen(false);
          if (res?.data.outcome && res?.status === 200) {
            toast.success(res?.data.message);
            setOpen(false)
          } else {
            toast.error(res?.data.message);
            setOpen(false)
          }
        } catch (error) {
          console.error("Upload Error:", error);
          toast.error("Something went wrong!");
        } finally {
          setOpen(false);
          setFormData({
            payConfigId: null,
            benType: "",
            employeeSkill: "",
            milestoneId: "",
            amount: "",
        
           
          });
        }
      };
    //---------------------------------------------------------------------------------------
    

    const editPaymentConfig = async (id) => {
      try {
        const payload = encryptPayload({
          payConfigId: id,  
        });
    
        const res = await editBeneficiaryPaymentSerice(payload);
    
        const data = res?.data?.data;
    
        setFormData({
          payConfigId: data?.payConfigId ?? null,
          benType: data?.benType ?? "",
          employeeSkill: data?.employeeSkill ?? "",
          milestoneId: data?.milestoneId ?? "",
          amount: data?.amount ?? "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    const getTableData = async () => {
        try {
          const res = await listBenPaymentService();
          const raw = res?.data?.data || [];
      
          const mapped = raw.map((row) => ({
            ...row,
            id: row.payConfigId, // Important for DataGrid
    
          }));
      
          setTableData(mapped);
      
        } catch (error) {
          console.error(error);
        }
      };
        
      const handleChangeInput = (e) => {
        const { name, value } = e.target;
      
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      
       
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      };
    const getMilestoneListName = async () => {
        try {
          const payload = {
            isActive: true,   
          };
      
          const encrypted = encryptPayload(payload);
      
          const res = await getMilesStoneListService(encrypted);
      
          setMilestoneOpts(res?.data?.data || []);
        } catch (error) {
          console.error(error);
        }
      };
    useEffect(() => {
      empTypeService(encryptPayload(null)).then((res) =>
          setEmpTypeOpts(res?.data?.data || [])
        );
        empSkillService(encryptPayload(null)).then((res) =>
            setSkillOpts(res?.data?.data || [])
          );
          getMilestoneListName();

          getTableData();
      }, []);
    
      const columns = [
        {
          field: "slNo",
          headerName: "Sl No",
          width: 80,
          sortable: false,
          renderCell: (params) =>
            paginationModel.page * paginationModel.pageSize +
            params.api.getRowIndexRelativeToVisibleRows(params.id) +
            1,
        },
        {
          field: "employeeType",
          headerName: "Employee Type",
          flex: 1,
        },
        {
          field: "employeeSkillid",
          headerName: "Skill",
          flex: 1,
        },
        {
          field: "mileStone",
          headerName: "Milestone",
          flex: 1,
        },
        {
          field: "amount",
          headerName: "Amount",
          flex: 1,
        },

        {
          field: "actions",
          headerName: "Action",
          width: 120,
          sortable: false,
          disableExport: true,
          renderCell: (params) => (
            <button
              className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center"
              onClick={() =>
                editPaymentConfig(params.row.payConfigId)
              }
            >
              <FiEdit />
            </button>
          ),
        },
      ];

    
  return (
    <>
     <form action="" onSubmit={handleOnConfirm}>
     <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ">
              <div className="p-0">
            <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md  ">
              <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded " />
             Benificiary Payment
            </h3>
          </div>

          <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2">
              <SelectField
                label="Benificiary Type"
                name="benType"
                value={benType}
                options={empTypeOpts.map((e) => ({
                  label: e.lookupValueEn,
                  value: e.lookupValueId,
                }))}
                error={errors.benType}
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-span-2">
                <SelectField
                  label="Skill Type"
                  required={true}
                  name="employeeSkill"
                  value={employeeSkill}
                  onChange={handleChangeInput}
                  options={skillOpts?.map(s => ({
                    label: s.lookupValueEn,
                    value: s.lookupValueId
                  }))}
                  error={errors.employeeSkill}
                  placeholder="Select skill type"
                />
              </div>
              <div className="col-span-2">
              <SelectField
                required={true}
                label="Milestone"
                name="milestoneId"
                value={milestoneId}
                options={milestoneOpts.map((m) => ({
                  label: m.milestoneName,
                  value: m.milestoneId,
                }))}
                error={errors.milestoneId}
                onChange={handleChangeInput}
              />
            </div>
            
            <div className="col-span-2">
                <InputField
                  label="Amount"
                  type='number'
                  required={true}
                  name="amount"
                  placeholder="Enter Amount..."
                  value={amount}
                  onChange={handleChangeInput}
                  error={errors.amount}
                />
              </div>
              </div>
              </div>
              <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn type={"submit"} btnText={payConfigId} />
          </div>
              </div>
              </form>
              <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
  <div className="p-0">
    <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
      <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
      Beneficiary Payment List
    </h3>
  </div>

  <div className="min-h-[120px] py-5 px-4 text-[#444]">
    <div className="flex gap-3 mb-3">
      <button
        onClick={() =>
          exportToExcel(
            tableData,
            columns,
            "Beneficiary_Payment_List"
          )
        }
        className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-300 transition"
      >
        Export Excel
      </button>

      <button
        onClick={() =>
          exportToPDF(
            tableData,
            columns,
            "Beneficiary_Payment_List"
          )
        }
        className="px-4 py-2 bg-rose-100 text-rose-700 border border-rose-300 rounded hover:bg-rose-300 transition"
      >
        Export PDF
      </button>
    </div>

    <div style={{ height: 420, width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        getRowId={(row) => row.payConfigId}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </div>
  </div>
</div>
              <ReusableDialog
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleSubmit}
                title="Confirmation"
                description="Do you want to continue?"
                />
    </>
  )
}

export default BenificiaryPayment
