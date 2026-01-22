import  { useEffect, useState } from "react";
import DetailsPanel from "../detailsPanel/DetailsPanel";
import GisCard from "../gisCard/GisCard";
import GisFilter from "../gisFilter/GisFilter";
import GisTable from "../gisTable/GisTable";
import MapSection from "../mapSection/MapSection";
import { saveGisData } from "../../../../services/gisAlldata";
import { encryptPayload } from "../../../../crypto.js/encryption";
import { toast } from "react-toastify";

const GisMain = () => {
  const [projectList, setProjectList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchGisData = async (filterPayload = {}) => {
    try {
      setLoading(true);
      const payloadToEncrypt = {
        ...filterPayload
      };

      const encrypted = encryptPayload(payloadToEncrypt);
      const res = await saveGisData(encrypted);

      if (res?.data?.outcome) {
        const data = res.data.data;
        setProjectList(data.projectDetails || []);
        setStats(data);
      } else {
        setProjectList([]);
        setStats({});
        // toast.error(res?.data?.message || "Failed to fetch GIS data");
      }
    } catch (error) {
      console.error("Error fetching GIS data:", error);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };


  const handleFilter = (payload) => {
    fetchGisData(payload);
    setSelectedProject(null); 
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-12 gap-4">

        {/* Left Sidebar: Filter */}
        <div className="col-span-12 lg:col-span-3">
          <GisFilter onFilter={handleFilter} isVertical={true} />
        </div>

        {/* Right Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-4">

          {/* Top: Stats Cards */}
          <div className="w-full">
            <GisCard data={stats} />
          </div>

          {/* Middle: Map and Details Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sticky top-0 z-30 bg-gray-50 pb-2">
            <div className="lg:col-span-2">
              <MapSection data={projectList} onSelectProject={setSelectedProject} />
            </div>
            <div className="lg:col-span-1">
              <DetailsPanel project={selectedProject} onClose={() => setSelectedProject(null)} />
            </div>
          </div>



        </div>

        {/* Bottom: Table */}
        <div className="col-span-12 lg:col-span-12 space-y-4">

          <div className="w-full">
            <GisTable data={projectList} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default GisMain;