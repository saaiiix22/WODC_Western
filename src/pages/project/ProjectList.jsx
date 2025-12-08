import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { encryptPayload } from "../../crypto.js/encryption";
import {
  getAllProjectService,
  getProjectDetailsByProjectIdService,
  takeActionProjectService,
} from "../../services/projectService";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { FaStop } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedProject } from "../../redux/slices/projectSlice";

const ProjectList = () => {
  const [tableData, setTableData] = useState([]);
  const getTableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getAllProjectService(payload);
      // console.log(res?.data.data);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };
  const [projectIDInd, setProjectIDInd] = useState("");
  const dispatch = useDispatch();

  const getEntireProjectDetails = async (id) => {
    try {
      const payload = encryptPayload({projectId:id});
      const res = await getProjectDetailsByProjectIdService(payload);
      console.log(res);
      dispatch(setSelectedProject(res?.data.data))
      navigate('/project')
    } catch (error) {
      throw error;
    }
  };

 

  const changeStatus = async (stat, proId) => {
    try {
      const payload = encryptPayload({ status: stat, projectId: proId });
      const res = await takeActionProjectService(payload);
      // console.log(res);
      getTableData();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  const navigate = useNavigate();

  const projectColumsn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Project Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.projectName}</p> |{" "}
            <p>{row.projectCode}</p>
          </div>
        ) || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.projectStatus,
    },
    {
      name: "Estimated Budget",
      selector: (row) => row.estimatedBudget || "N/A",
    },
    {
      name: "Approved Amount",
      selector: (row) => row.approvedAmount || "N/A",
      sortable: true,
    },

    {
      name: "Start Date",
      selector: (row) => row.startDate || "N/A",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.endDate || "N/A",
      sortable: true,
    },
    {
      name: "Action",

      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* HOLD || UNHOLD BTN */}

          <button
            type="button"
            className="flex items-center justify-center h-6 w-6 bg-yellow-500/35 text-yellow-500 rounded-md"
            style={{
              display:
                row.projectStatus === "Cancel" || row.projectStatus === "Hold"
                  ? "none"
                  : "flex",
            }}
            title="Hold"
            onClick={() => {
              changeStatus("Hold", row.projectId);
            }}
          >
            <FaStop className="w-3 h-3" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center h-6 w-6 bg-green-500/35 text-green-500 rounded-md"
            style={{
              display:
                row.projectStatus === "Cancel" || row.projectStatus != "Hold"
                  ? "none"
                  : "flex",
            }}
            title="Unhold"
            onClick={() => {
              changeStatus("unHold", row.projectId);
            }}
          >
            <FaPlay className="w-3 h-3" />
          </button>

          {/* EDIT BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-6 w-6 bg-blue-500/25 text-blue-500 rounded-md"
            title="Edit"
            onClick={() => {
              // handleEditClick(row?.blockId);
              // navigate("/project", { state: row.projectId });
              getEntireProjectDetails(row?.projectId)

            }}
          >
            <GoPencil className="w-3 h-3" />
          </button>

          {/* REJECT BUTTON */}
          <button
            className="flex items-center justify-center h-6 w-6 rounded-md bg-red-500/25 hover:bg-red-600/25 text-red-500 "
            title=""
            onClick={() => {
              changeStatus("Cancel", row.projectId);
            }}
          >
            <RxCross2 className="w-3 h-3" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
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
          Project List
        </h3>
      </div>

      {/* Body */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <ReusableDataTable data={tableData} columns={projectColumsn} />
      </div>
    </div>
  );
};

export default ProjectList;
