import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { encryptPayload } from '../../crypto.js/encryption'
import { useLocation } from 'react-router-dom'
import { getWorkflowTabService } from '../../services/workflowService'
import PillTabs from '../../components/common/Styletab'
import { Box } from '@mui/material'

const ProjectAgencyMilestoneList = () => {

    const [value, setValue] = useState("");
    const [tabs, setTabs] = useState([])
    const [tabCode, setTabCode] = useState("");
    const location = useLocation()

    const getTabs = async () => {
        try {
            const payload = encryptPayload({
                appModuleUrl: location.pathname,
            });
            const res = await getWorkflowTabService(payload)
            console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                setTabs(res?.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const pillTabData = [...tabs]
        .sort((a, b) => a.tabId - b.tabId)
        .map((tab) => ({
            value: String(tab.tabId),   
            label: tab.tabName,
            tabCode: tab.tabCode,
            tabId: tab.tabId,
            disabled: false,
        }));

    const handleTabChange = (event, newValue) => {
        const selectedTab = tabs?.find(
            (tab) => String(tab.tabId) === String(newValue)
        );
        setValue(newValue);
        setTabCode(selectedTab?.tabCode || "");
    };

    useEffect(() => {
        getTabs()
    }, [])

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
                   flex items-center gap-2 text-white font-normal text-[16px]
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
                    Project Agency Milestone List
                </h3>
            </div>
            <div className="min-h-[120px] py-5 px-4 text-[#444]">
                <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                    <PillTabs
                        value={value}
                        onChange={handleTabChange}
                        tabs={pillTabData}
                        aria-label="Project Agency Milestone Tabs"
                    />
                </Box>
            </div>
        </div>
    )
}

export default ProjectAgencyMilestoneList
