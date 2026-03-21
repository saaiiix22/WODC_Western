import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { encryptPayload } from '../../crypto.js/encryption'
import { useLocation, useNavigate } from 'react-router-dom'
import { getWorkflowTabService } from '../../services/workflowService'
import PillTabs from '../../components/common/Styletab'
import { Box } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'
import SelectField from '../../components/common/SelectField'
import { load } from '../../hooks/load'
import { getFinancialYearService } from '../../services/budgetService'
import { getFundReleaseInfoByTabCodeService, getProjectByFinYearService } from '../../services/projectService'
import ReusableDataTable from '../../components/common/ReusableDataTable'
import { FaEye } from "react-icons/fa";
import { useDispatch } from 'react-redux'
import { setFundObj } from '../../redux/slices/fundSlice'

const FundReleaseInfoList = () => {
    const [formData, setFormData] = useState({
        projectId: '',
        finYear: ''
    })
    const handleChangeInput = (e) => {
        const { name, value } = e.target;

        if (name === "finYear") {
            setFormData({
                finYear: value,
                projectId: ""
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const [finOpts, setFinOpts] = useState([]);
    const [projectOpts, setProjectOpts] = useState([]);
    const [value, setValue] = useState("");
    const [tabs, setTabs] = useState([])
    const [tableData, setTableData] = useState([])
    const [tabCode, setTabCode] = useState("");
    const fundReleaseTabs = tabs?.map((i) => ({
        label: i.tabName,
        value: i.tabId.toString(),
        tabCode: i.tabCode
    }))
    const navigate = useNavigate()
    const handleTabChange = (event, newValue) => {
        setValue(newValue);

        const selectedTab = fundReleaseTabs?.find(
            (tab) => tab.value === newValue
        );
        if (selectedTab) {
            setTabCode(selectedTab.tabCode);
        }
    };
    const getAllFinOpts = () => load(getFinancialYearService, { isActive: true }, setFinOpts)
    const getProjectOptsByFinYear = () => load(getProjectByFinYearService, { isActive: true, finyearId: parseInt(formData.finYear) }, setProjectOpts)

    const getTabs = async () => {
        try {
            const payload = encryptPayload({ appModuleUrl: "/fundReleaseInfo" })
            const res = await getWorkflowTabService(payload)
            // console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                const tabData = res?.data.data || [];
                setTabs(tabData);
                if (tabData.length > 0) {
                    setValue(tabData[0].tabId.toString());
                    setTabCode(tabData[0].tabCode);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getTableData = async () => {

        try {
            const payload = encryptPayload({
                finyearId: formData.finYear ? formData.finYear : null,
                projectId: formData.projectId ? formData.projectId : null,
                TABCODE: tabCode
            })
            const res = await getFundReleaseInfoByTabCodeService(payload)
            // console.log(res);
            if (res?.data.outcome && res?.status === 200) {
                setTableData(res?.data.data || [])
            }
            else {
                setTableData([])
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    useEffect(() => {
        getTabs()
        getAllFinOpts()

    }, [])

    useEffect(() => {
        if (formData.finYear) {
            getProjectOptsByFinYear()
        }
    }, [formData.finYear])

    useEffect(() => {
        if (tabCode) {
            getTableData();
        }
    }, [tabCode, formData.finYear, formData.projectId]);
    const dispatch = useDispatch()
    // console.log(tableData);


    return (
        <div
            className="
                mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
                shadow-[0_4px_12px_rgba(0,0,0,0.08)]
              "
        >
            <div className="p-0">
                <h3
                    className="
                    flex items-center gap-2 text-white font-normal text-[17px]
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
                    Fund Release Information List
                </h3>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-12 p-4 gap-6">
                <div className="col-span-2">
                    <SelectField
                        label={"Financial Year"}
                        required={true}
                        name="finYear"
                        value={formData.finYear}
                        options={finOpts?.map((i) => ({
                            value: i.finyearId,
                            label: i.finYear,
                        }))}
                        placeholder="Select"
                        onChange={handleChangeInput}
                    // error={errors.finYear}
                    />
                </div>
                <div className="col-span-2">
                    <SelectField
                        label={"Project Name"}
                        required={true}
                        name="projectId"
                        value={formData.projectId}
                        placeholder="Select"
                        disabled={formData.finYear ? false : true}
                        onChange={handleChangeInput}
                        options={projectOpts.map((i) => ({
                            value: i.projectId,
                            label: i.projectName,
                        }))}
                    // error={errors.projectId}
                    />
                </div>
                <div className="col-span-12">
                    <TabContext value={value}>
                        <Box sx={{ width: '100%', typography: 'body1', padding: '0', margin: "0" }}>
                            <PillTabs
                                value={value}
                                onChange={handleTabChange}
                                tabs={fundReleaseTabs}
                            />
                        </Box>
                        {/* {console.log(tableData)} */}
                        {

                            fundReleaseTabs?.map((tab) => (
                                <TabPanel key={tab.value} value={tab.value} sx={{ p: 0, mt: 1 }}>
                                    <table className="w-full border border-gray-300">
                                        <thead>
                                            <tr className="bg-[#f4f0f2]">
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Project Name</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Sanction Order No</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Sanction Date</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Release Letter No</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Release Date</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Penalty %</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Penalty Amount</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Fund Release Amount</th>
                                                <th className="border border-[#ebbea6] text-sm font-normal text-start p-2">Action</th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {tableData.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-4 text-gray-500"
                                                    >
                                                        No Data Available
                                                    </td>
                                                </tr>
                                            ) : (
                                                tableData.map((project) => {
                                                    const funds = project?.fundReleaseList?.length
                                                        ? project.fundReleaseList
                                                        : [{}];

                                                    console.log(project);



                                                    return funds.map((fund, index) => (
                                                        <tr key={fund?.fundReleaseId || index}>
                                                            {index === 0 && (
                                                                <td
                                                                    rowSpan={funds.length}
                                                                    className="border border-[#ebbea6] text-sm font-normal text-start p-2"
                                                                >
                                                                    {project.projectName}
                                                                </td>
                                                            )}

                                                            <td className="border border-[#ebbea6] text-sm p-2">{fund?.sanctionOrderNo || "-"}</td>
                                                            <td className="border border-[#ebbea6] text-sm p-2">{fund?.sanctionOrderDate || "-"}</td>
                                                            <td className="border border-[#ebbea6] text-sm p-2">{fund?.releaseLetterNo || "-"}</td>
                                                            <td className="border border-[#ebbea6] text-sm p-2">{fund?.releaseLetterDate || "-"}</td>
                                                            <td className="border border-[#ebbea6] text-sm p-2">{fund?.penaltyPercentage ?? "-"}</td>
                                                            <td className="border border-[#ebbea6] text-sm p-2">{fund?.penaltyAmount ?? "-"}</td>
                                                            <td className="border border-[#ebbea6] text-sm p-2">{fund?.fundReleaseAmount ?? "-"}</td>
                                                            <td className="border border-[#ebbea6] text-sm p-2 text-center">
                                                                <button
                                                                    className="flex items-center gap-2 bg-blue-500/25 text-blue-500 p-1 rounded"
                                                                    onClick={() => {
                                                                        dispatch(setFundObj({
                                                                            finYear:project?.finYearId,
                                                                            milestoneId:fund?.milestoneId,
                                                                            projectId:project?.projectId
                                                                        }));
                                                                        navigate("/fundReleaseInfo");
                                                                    }}
                                                                >
                                                                    <FaEye size={14} />
                                                                </button>
                                                                {/* {console.log(fund)} */}
                                                            </td>
                                                        </tr>
                                                    ));
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </TabPanel>
                            ))
                        }
                    </TabContext>
                </div>
            </form >
        </div >
    )
}

export default FundReleaseInfoList
