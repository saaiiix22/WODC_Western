import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { encryptPayload } from "../../crypto.js/encryption";
import {
  getProjectByTabCodeService,
  getProjectDetailsByProjectIdService,
  takeActionProjectService,
} from "../../services/projectService";
import { GoPencil } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedProject } from "../../redux/slices/projectSlice";
import { getWorkflowTabService } from "../../services/workflowService";
import PillTabs from "../../components/common/Styletab";

import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { DataGrid } from "@mui/x-data-grid";

const ProjectList = () => {
  const [tableData, setTableData] = useState([]);
  const [button, setButtons] = useState([]);
  const [value, setValue] = useState("0");
  const [tabCodePro, setTabCodePro] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ------------------ WORKFLOW TABS ------------------ */

  const getWorkFlow = async () => {
    try {
      const payload = encryptPayload({ appModuleUrl: location.pathname });
      const res = await getWorkflowTabService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        setButtons(res?.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ------------------ TABLE DATA ------------------ */

  const getTableData = async () => {
    try {
      const payload = encryptPayload({ TABCODE: tabCodePro });
      const res = await getProjectByTabCodeService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data || []);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ------------------ EDIT PROJECT ------------------ */

  const getEntireProjectDetails = async (id) => {
    try {
      const payload = encryptPayload({ projectId: id });
      const res = await getProjectDetailsByProjectIdService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        dispatch(setSelectedProject(res?.data.data));
        navigate("/project");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ------------------ TAB CHANGE ------------------ */

  const projectTabs = button?.map((tab) => ({
    label: tab.tabName,
    value: String(tab.tabId),
    tabCode: tab.tabCode,
  }));

  const handleChange = (event, newValue) => {
    const selectedTab = projectTabs?.find(
      (tab) => tab.value === newValue
    );
    setValue(newValue);
    setTabCodePro(selectedTab?.tabCode);
  };

  /* ------------------ DATAGRID COLUMNS ------------------ */

  const projectColumns = [
    {
      field: "slno",
      headerName: "Sl No",
      width: 80,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "projectName",
      headerName: "Project Name",
      width: 260,
      sortable: true,
      renderCell: (params) => (
        <div className="flex gap-1">
          <p className="text-slate-800">{params.row.projectName}</p> |{" "}
          <p>{params.row.projectCode}</p>
        </div>
      ),
    },
    {
      field: "projectStatus",
      headerName: "Status",
      width: 130,
    },
    {
      field: "estimatedBudget",
      headerName: "Estimated Budget",
      width: 170,
      renderCell: (params) =>
        Number(params.value || 0).toLocaleString("en-IN"),
    },
    {
      field: "approvedAmount",
      headerName: "Approved Amount",
      width: 170,
      renderCell: (params) =>
        Number(params.value || 0).toLocaleString("en-IN"),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 140,
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 140,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,

      sortable: false,
      renderCell: (params) => (
        <div className="w-full h-full flex justify-center items-center">
          <button
            className="flex items-center justify-center h-6 w-6 bg-blue-500/25 text-blue-500 rounded-md"
            title="Edit"
            onClick={() =>
              getEntireProjectDetails(params.row.projectId)
            }
          >
            <GoPencil className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  /* ------------------ ROWS ------------------ */

  const rows = tableData.map((row, index) => ({
    id: row.projectId || index + 1,
    ...row,
  }));

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    getWorkFlow();
  }, []);

  useEffect(() => {
    if (projectTabs?.length > 0) {
      setValue(projectTabs[0].value);
      setTabCodePro(projectTabs[0].tabCode);
    }
  }, [button]);

  useEffect(() => {
    if (tabCodePro) {
      getTableData();
    }
  }, [tabCodePro]);

  /* ------------------ UI ------------------ */

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="p-0">
        <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
          <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
          Project List
        </h3>
      </div>

      {/* Body */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <Box sx={{ width: "100%" }}>
          <TabContext value={value}>
            <PillTabs
              value={value}
              onChange={handleChange}
              tabs={projectTabs}
            />

            {projectTabs?.map((i) => (
              <TabPanel key={i.value} value={i.value} sx={{ p: 0, mt: 1 }}>
                <Box sx={{ width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={projectColumns}
                    pageSizeOptions={[10, 20, 30]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          page: 0,
                          pageSize: 10,
                        },
                      },
                    }}
                    disableRowSelectionOnClick
                  />
                </Box>
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default ProjectList;
