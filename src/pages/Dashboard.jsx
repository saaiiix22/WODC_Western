import React, { useEffect, useState } from "react";
import { FiFileText, FiTrendingUp, FiDollarSign, FiActivity, FiMessageSquare, FiCheckCircle, FiPieChart, FiCreditCard, FiInbox, FiImage, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../components/common/CommonButtons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getFinancialYearService } from "../services/budgetService";
import SelectField from "../components/common/SelectField";
import { encryptPayload } from "../crypto.js/encryption";

const Dashboard = () => {
  // Mobile detection hook
  const [isMobile, setIsMobile] = useState(false);
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  // New state for input fields
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [finyearId, setFinyearId] = useState("");


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);


const [finyearOption, setFinyearOptions] = useState([]);
  const getFinYear = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
      // console.log(res);
      setFinyearOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getFinYear();
  }, []);
  // Calculate percentages
  const projectPercentage = Math.round((16888 / 23969) * 100);
  const fundPercentage = Math.round((1322.73 / 1363.39) * 100);
  const expenditurePercentage = Math.round((893.51 / 1322.73) * 100);
  const complainsPercentage = Math.round((385 / 2599) * 100);

  // State for image slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesPerView = isMobile ? 1 : (window.innerWidth < 1024 ? 2 : 4); // Responsive images per view

  // Project status data for the chart
  const projectStatusData = [
    { name: 'Not Started', value: 4293, fill: '#532f3c' },
    { name: 'In Progress', value: 1743, fill: '#3b3954' },
    { name: 'Diverted', value: 247, fill: '#574827' },
    { name: 'Completed', value: 16005, fill: '#234341' },
    { name: 'Cancelled', value: 6, fill: '#ff7900' }
  ];

  // Work type data for the new chart
  const workTypeData = [
    { category: 'Road & Communication', subcategory: 'Subbase', count: 43, fill: '#511409' },
    { category: 'Road & Communication', subcategory: 'Metal Concrete', count: 37, fill: '#511409' },
    { category: 'Road & Communication', subcategory: 'Chips Concrete', count: 39, fill: '#511409' },
    { category: 'Roads & Communication(Black Toping)', subcategory: 'SUB BASE', count: 4, fill: '#7a1f13' },
    { category: 'Roads & Communication(Black Toping)', subcategory: 'METALLING GRADE 1', count: 1, fill: '#7a1f13' },
    { category: 'Irrigation/Water Body', subcategory: 'Excavation', count: 67, fill: '#234341' },
    { category: 'Irrigation/Water Body', subcategory: 'EMBANKMENT', count: 7, fill: '#234341' },
    { category: 'Irrigation/Water Body', subcategory: 'STRUCTURE IF ANY', count: 26, fill: '#234341' },
    { category: 'Irrigation/Water Body', subcategory: 'IN-LET/OUT-LET', count: 1, fill: '#234341' },
    { category: 'Building', subcategory: 'Foundation', count: 1, fill: '#574827' },
    { category: 'Building', subcategory: 'Plinth', count: 1, fill: '#574827' },
    { category: 'Building', subcategory: 'Roof', count: 6, fill: '#574827' },
    { category: 'Building', subcategory: 'Complete', count: 3, fill: '#574827' }
  ];

  // District-wise work status data
  const districtWorkStatusData = [
    { district: 'Angul', notStarted: 120, inProgress: 85, completed: 320, cancelled: 5, diverged: 3 },
    { district: 'Balangir', notStarted: 150, inProgress: 95, completed: 280, cancelled: 8, diverged: 4 },
    { district: 'Bargarh', notStarted: 110, inProgress: 75, completed: 350, cancelled: 3, diverged: 2 },
    { district: 'Boudh', notStarted: 80, inProgress: 60, completed: 180, cancelled: 2, diverged: 1 },
    { district: 'Cuttack', notStarted: 200, inProgress: 150, completed: 520, cancelled: 10, diverged: 8 },
    { district: 'Deogarh', notStarted: 386, inProgress: 49, completed: 590, cancelled: 26, diverged: 6 },
    { district: 'Dhenkanal', notStarted: 130, inProgress: 90, completed: 380, cancelled: 4, diverged: 3 },
    { district: 'Gajapati', notStarted: 70, inProgress: 50, completed: 160, cancelled: 2, diverged: 1 },
    { district: 'Ganjam', notStarted: 180, inProgress: 120, completed: 450, cancelled: 7, diverged: 5 },
    { district: 'Jagatsinghpur', notStarted: 90, inProgress: 70, completed: 290, cancelled: 3, diverged: 2 },
    { district: 'Jajpur', notStarted: 140, inProgress: 100, completed: 400, cancelled: 6, diverged: 4 },
    { district: 'Kalahandi', notStarted: 160, inProgress: 110, completed: 2617, cancelled: 12, diverged: 9 },
    { district: 'Kandhamal', notStarted: 100, inProgress: 80, completed: 220, cancelled: 4, diverged: 3 },
    { district: 'Kendrapara', notStarted: 120, inProgress: 85, completed: 310, cancelled: 5, diverged: 3 },
    { district: 'Keonjhar', notStarted: 170, inProgress: 120, completed: 420, cancelled: 8, diverged: 6 },
    { district: 'Khordha', notStarted: 190, inProgress: 140, completed: 480, cancelled: 9, diverged: 7 },
    { district: 'Koraput', notStarted: 150, inProgress: 105, completed: 380, cancelled: 7, diverged: 5 },
    { district: 'Malkangiri', notStarted: 85, inProgress: 65, completed: 200, cancelled: 3, diverged: 2 },
    { district: 'Mayurbhanj', notStarted: 180, inProgress: 130, completed: 460, cancelled: 8, diverged: 6 },
    { district: 'Nabarangpur', notStarted: 95, inProgress: 70, completed: 240, cancelled: 4, diverged: 3 },
    { district: 'Nuapada', notStarted: 75, inProgress: 55, completed: 190, cancelled: 2, diverged: 1 },
    { district: 'Puri', notStarted: 130, inProgress: 95, completed: 340, cancelled: 6, diverged: 4 },
    { district: 'Rayagada', notStarted: 110, inProgress: 80, completed: 300, cancelled: 5, diverged: 3 },
    { district: 'Sambalpur', notStarted: 160, inProgress: 115, completed: 410, cancelled: 7, diverged: 5 },
    { district: 'Sonepur', notStarted: 85, inProgress: 60, completed: 210, cancelled: 3, diverged: 2 },
    { district: 'Sundargarh', notStarted: 190, inProgress: 140, completed: 490, cancelled: 9, diverged: 7 }
  ];

  // Delayed projects data - using your theme colors
  const delayedProjectsData = [
    { delayPeriod: 'More than 12 mo.', count: 4131, fill: '#ff7900' },
    { delayPeriod: '9 - 12 months', count: 778, fill: '#ff9900' },
    { delayPeriod: '6 - 9 months', count: 0, fill: '#ffcc00' },
    { delayPeriod: '3 - 6 months', count: 0, fill: '#ffdd66' },
    { delayPeriod: 'Less than 3 months', count: 0, fill: '#ffeecc' }
  ];

  // District-wise summary of projects data - using your theme colors
  const districtProjectSummaryData = [
    { district: 'Angul', kalyanMandaps: 120, communityCenters: 85, mmsg: 65, openMandaps: 40 },
    { district: 'Balangir', kalyanMandaps: 95, communityCenters: 70, mmsg: 55, openMandaps: 35 },
    { district: 'Bargarh', kalyanMandaps: 110, communityCenters: 80, mmsg: 70, openMandaps: 45 },
    { district: 'Boudh', kalyanMandaps: 65, communityCenters: 50, mmsg: 40, openMandaps: 25 },
    { district: 'Cuttack', kalyanMandaps: 150, communityCenters: 120, mmsg: 95, openMandaps: 75 },
    { district: 'Deogarh', kalyanMandaps: 78, communityCenters: 60, mmsg: 45, openMandaps: 30 },
    { district: 'Dhenkanal', kalyanMandaps: 90, communityCenters: 70, mmsg: 55, openMandaps: 40 },
    { district: 'Gajapati', kalyanMandaps: 60, communityCenters: 45, mmsg: 35, openMandaps: 20 },
    { district: 'Ganjam', kalyanMandaps: 140, communityCenters: 110, mmsg: 85, openMandaps: 65 },
    { district: 'Jagatsinghpur', kalyanMandaps: 75, communityCenters: 60, mmsg: 45, openMandaps: 30 },
    { district: 'Jajpur', kalyanMandaps: 100, communityCenters: 80, mmsg: 65, openMandaps: 50 },
    { district: 'Kalahandi', kalyanMandaps: 120, communityCenters: 95, mmsg: 75, openMandaps: 60 },
    { district: 'Kandhamal', kalyanMandaps: 85, communityCenters: 65, mmsg: 50, openMandaps: 35 },
    { district: 'Kendrapara', kalyanMandaps: 95, communityCenters: 75, mmsg: 60, openMandaps: 45 },
    { district: 'Keonjhar', kalyanMandaps: 115, communityCenters: 90, mmsg: 70, openMandaps: 55 },
    { district: 'Khordha', kalyanMandaps: 130, communityCenters: 105, mmsg: 80, openMandaps: 65 },
    { district: 'Koraput', kalyanMandaps: 100, communityCenters: 80, mmsg: 65, openMandaps: 50 },
    { district: 'Malkangiri', kalyanMandaps: 70, communityCenters: 55, mmsg: 40, openMandaps: 25 },
    { district: 'Mayurbhanj', kalyanMandaps: 125, communityCenters: 100, mmsg: 80, openMandaps: 65 },
    { district: 'Nabarangpur', kalyanMandaps: 80, communityCenters: 65, mmsg: 50, openMandaps: 35 },
    { district: 'Nuapada', kalyanMandaps: 65, communityCenters: 50, mmsg: 40, openMandaps: 25 },
    { district: 'Puri', kalyanMandaps: 105, communityCenters: 85, mmsg: 65, openMandaps: 50 },
    { district: 'Rayagada', kalyanMandaps: 90, communityCenters: 70, mmsg: 55, openMandaps: 40 },
    { district: 'Sambalpur', kalyanMandaps: 110, communityCenters: 85, mmsg: 70, openMandaps: 55 },
    { district: 'Sonepur', kalyanMandaps: 70, communityCenters: 55, mmsg: 40, openMandaps: 25 },
    { district: 'Sundargarh', kalyanMandaps: 120, communityCenters: 95, mmsg: 75, openMandaps: 60 }
  ];

  // Colors for different categories
  const categoryColors = {
    'Road & Communication': '#511409',
    'Roads & Communication(Black Toping)': '#7a1f13',
    'Irrigation/Water Body': '#234341',
    'Building': '#574827'
  };

  // Colors for work status
  const workStatusColors = {
    'Not Started': '#ff7900',
    'In Progress': '#3b3954',
    'Completed': '#234341',
    'Cancelled': '#532f3c',
    'Diverged': '#574827'
  };

  // Colors for project types - using your theme colors
  const projectTypeColors = {
    'Kalyan Mandaps': '#511409',
    'Community Centers': '#7a1f13',
    'MMSG': '#234341',
    'Open Mandaps': '#574827'
  };

  // Updated district-wise fund distribution data with additional columns
  const districtData = [
    { district: 'DEOGARH', projects: 1057, approved: 56.43, releasedWODC: 45.20, releasedDist: 11.23, expenditure: 38.45 },
    { district: 'MAYURBHANJ', projects: 2341, approved: 123.45, releasedWODC: 98.50, releasedDist: 24.95, expenditure: 87.20 },
    { district: 'BALASORE', projects: 1876, approved: 98.76, releasedWODC: 78.90, releasedDist: 19.86, expenditure: 65.30 },
    { district: 'KENDRAPARA', projects: 1543, approved: 87.65, releasedWODC: 70.12, releasedDist: 17.53, expenditure: 58.90 },
    { district: 'CUTTACK', projects: 2109, approved: 145.32, releasedWODC: 116.26, releasedDist: 29.06, expenditure: 98.50 },
    { district: 'JAGATSINGHPUR', projects: 1234, approved: 76.54, releasedWODC: 61.23, releasedDist: 15.31, expenditure: 52.10 },
    { district: 'PURI', projects: 1876, approved: 109.87, releasedWODC: 87.90, releasedDist: 21.97, expenditure: 78.40 },
    { district: 'KHORDHA', projects: 1987, approved: 134.56, releasedWODC: 107.65, releasedDist: 26.91, expenditure: 95.30 },
    { district: 'GANJAM', projects: 2109, approved: 156.78, releasedWODC: 125.42, releasedDist: 31.36, expenditure: 110.80 },
    { district: 'GAJAPATI', projects: 987, approved: 65.43, releasedWODC: 52.34, releasedDist: 13.09, expenditure: 45.20 },
    { district: 'KANDHAMAL', projects: 1234, approved: 87.65, releasedWODC: 70.12, releasedDist: 17.53, expenditure: 58.90 },
    { district: 'BOUDH', projects: 876, approved: 54.32, releasedWODC: 43.46, releasedDist: 10.86, expenditure: 36.50 },
    { district: 'SONEPUR', projects: 765, approved: 43.21, releasedWODC: 34.57, releasedDist: 8.64, expenditure: 29.10 },
    { district: 'BALANGIR', projects: 1543, approved: 98.76, releasedWODC: 79.01, releasedDist: 19.75, expenditure: 67.30 },
    { district: 'NUAPADA', projects: 654, approved: 32.10, releasedWODC: 25.68, releasedDist: 6.42, expenditure: 21.80 },
    { district: 'KALAHANDI', projects: 1432, approved: 87.65, releasedWODC: 70.12, releasedDist: 17.53, expenditure: 58.90 },
    { district: 'RAYAGADA', projects: 1098, approved: 65.43, releasedWODC: 52.34, releasedDist: 13.09, expenditure: 45.20 },
    { district: 'KORAPUT', projects: 1321, approved: 76.54, releasedWODC: 61.23, releasedDist: 15.31, expenditure: 52.10 },
    { district: 'NABARANGPUR', projects: 987, approved: 54.32, releasedWODC: 43.46, releasedDist: 10.86, expenditure: 36.50 },
    { district: 'MALKANGIRI', projects: 765, approved: 43.21, releasedWODC: 34.57, releasedDist: 8.64, expenditure: 29.10 },
    { district: 'Total', projects: 22933, approved: 1363.39, releasedWODC: 1090.71, releasedDist: 272.68, expenditure: 893.51 }
  ];

  // Gallery data - replace with your actual image paths
  const galleryData = [
    { 
      id: 1, 
      src: '/src/assets/dashboardimg/wodcdashboardimg1.jpg', 
      title: 'Inauguration',
      description: 'New community center inauguration ceremony'
    },
    { 
      id: 2, 
      src: '/src/assets/dashboardimg/wodcdashboardimg2.jpeg', 
      title: 'Meeting',
      description: 'District officials quarterly review meeting'
    },
    { 
      id: 3, 
      src: '/src/assets/dashboardimg/wodcdashboard3.jpg', 
      title: 'Distribution',
      description: 'Women empowerment program distribution'
    },
    { 
      id: 4, 
      src: '/src/assets/dashboardimg/wodcdashboard4.jpg', 
      title: 'Foundation',
      description: 'Rural development project foundation ceremony'
    },
    { 
      id: 5, 
      src: '/src/assets/dashboardimg/wodcdashboardimg1.jpg', 
      title: 'Inauguration 2',
      description: 'New school building inauguration'
    },
    { 
      id: 6, 
      src: '/src/assets/dashboardimg/wodcdashboardimg2.jpeg', 
      title: 'Meeting 2',
      description: 'Annual review meeting with stakeholders'
    },
    { 
      id: 7, 
      src: '/src/assets/dashboardimg/wodcdashboard3.jpg', 
      title: 'Distribution 2',
      description: 'Agricultural equipment distribution'
    },
    { 
      id: 8, 
      src: '/src/assets/dashboardimg/wodcdashboard4.jpg', 
      title: 'Foundation 2',
      description: 'Hospital foundation stone laying ceremony'
    }
  ];

  // Calculate visible images based on current index
  const getVisibleImages = () => {
    const visibleImages = [];
    for (let i = 0; i < imagesPerView; i++) {
      const index = (currentImageIndex + i) % galleryData.length;
      visibleImages.push(galleryData[index]);
    }
    return visibleImages;
  };

  // Functions to handle slider navigation - ONE image at a time
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryData.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryData.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Custom tooltip for the work type chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800">{`${payload[0].payload.subcategory}`}</p>
          <p className="text-sm text-gray-600">{`Category: ${payload[0].payload.category}`}</p>
          <p className="text-sm font-semibold text-[#ff7900]">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the district work status chart
  const DistrictWorkStatusTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800 mb-2">{`District: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the delayed projects chart
  const DelayedProjectsTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800">{`Delay Period: ${payload[0].payload.delayPeriod}`}</p>
          <p className="text-sm font-semibold text-[#ff7900]">{`Projects: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the district project summary chart
  const DistrictProjectSummaryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800 mb-2">{`District: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Extract district names for the dropdown
  const districtNames = districtData.slice(0, -1).map(district => district.district);

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

      <div className="p-4">
       
     <div className="flex justify-end mb-6">
  <div className={`flex items-end ${isMobile ? "flex-col gap-3" : "gap-4"}`}>
    
    {/* Financial Year */}
    <div className="flex flex-col min-w-[180px]">
      <SelectField
        label="Financial Year"
        required={true}
        name="finyearId"
        placeholder="Select"
        value={finyearId}
        options={finyearOption?.map((d) => ({
          value: d.finyearId,
          label: d.finYear,
        }))}
        onChange={(e) => setFinyearId(Number(e.target.value))}
      />
    </div>

    {/* District */}
    <div className="flex flex-col min-w-[180px]">
      <label className="text-xs font-medium text-gray-700 mb-1">
        District
      </label>
     
    </div>

  </div>
</div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#234341] to-[#234341dd] rounded-lg p-4 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-medium opacity-90">Total Projects</h4>
              <FiCheckCircle className="text-[#ff7900] text-3xl" />
            </div>
            <div className="mb-3 flex justify-between items-center">
              <div className="text-2xl font-bold">16,888</div>
              <div className="text-2xl font-bold">{projectPercentage}%</div>
            </div>
            <div className="text-xs opacity-75 mb-3">Completed out of 23,969</div>
            <div className="w-full bg-black bg-opacity-20 rounded-full h-2 mb-3">
              <div 
                className="bg-[#ff7900] h-2 rounded-full transition-all duration-500"
                style={{ width: `${projectPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#574827] to-[#574827dd] rounded-lg p-4 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-medium opacity-90">Fund Released</h4>
              <FiCreditCard className="text-[#ff7900] text-3xl" />
            </div>
            <div className="mb-3 flex justify-between items-center">
              <div className="text-2xl font-bold">₹1,322.73</div>
              <div className="text-2xl font-bold">{fundPercentage}%</div>
            </div>
            <div className="text-xs opacity-75 mb-3">Released out of ₹1,363.39 (In Crores)</div>
            <div className="w-full bg-black bg-opacity-20 rounded-full h-2 mb-3">
              <div 
                className="bg-[#ff7900] h-2 rounded-full transition-all duration-500"
                style={{ width: `${fundPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#3b3954] to-[#3b3954dd] rounded-lg p-4 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-medium opacity-90">Expenditure Made</h4>
              <FiPieChart className="text-[#ff7900] text-3xl" />
            </div>
            <div className="mb-3 flex justify-between items-center">
              <div className="text-2xl font-bold">₹893.51</div>
              <div className="text-2xl font-bold">{expenditurePercentage}%</div>
            </div>
            <div className="text-xs opacity-75 mb-3">Spent out of ₹1,322.73 (In Crores)</div>
            <div className="w-full bg-black bg-opacity-20 rounded-full h-2 mb-3">
              <div 
                className="bg-[#ff7900] h-2 rounded-full transition-all duration-500"
                style={{ width: `${expenditurePercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#532f3c] to-[#532f3cdd] rounded-lg p-4 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-medium opacity-90">Raised Complains</h4>
              <FiInbox className="text-[#ff7900] text-3xl" />
            </div>
            <div className="mb-3 flex justify-between items-center">
              <div className="text-2xl font-bold">385</div>
              <div className="text-2xl font-bold">{complainsPercentage}%</div>
            </div>
            <div className="text-xs opacity-75 mb-3">Replied out of 2,599</div>
            <div className="w-full bg-black bg-opacity-20 rounded-full h-2 mb-3">
              <div 
                className="bg-[#ff7900] h-2 rounded-full transition-all duration-500"
                style={{ width: `${complainsPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-800">
              <FiTrendingUp className="text-[#ff7900]" />
              Projects Status
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h4 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-800">
              <FiCreditCard className="text-[#ff7900]" />
              District - Wise Fund Distribution (In Crores)
            </h4>
            
            {isMobile ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {districtData.map((district, index) => (
                  <div key={index} className={`bg-white p-3 rounded-lg shadow border ${index === districtData.length - 1 ? 'font-semibold bg-gray-50' : ''}`}>
                    <h3 className="font-bold text-base mb-2 text-gray-800">{district.district}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projects:</span>
                        <span className="font-medium">{district.projects.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved:</span>
                        <span className="font-medium">{district.approved.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">WODC:</span>
                        <span className="font-medium">{district.releasedWODC.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dist.:</span>
                        <span className="font-medium">{district.releasedDist.toLocaleString()}</span>
                      </div>
                      <div className="col-span-2 flex justify-between">
                        <span className="text-gray-600">Expenditure:</span>
                        <span className="font-medium">{district.expenditure.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <div className="overflow-auto max-h-[420px] rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 z-10 bg-[linear-gradient(90deg,#f3d6cf,#f7e1db)] text-[#511409]">
                      <tr>
                        <th className="px-3 py-3 text-left font-semibold tracking-wide">District</th>
                        <th className="px-3 py-3 text-center font-semibold">Projects</th>
                        <th className="px-3 py-3 text-center font-semibold">Approved</th>
                        <th className="px-3 py-3 text-center font-semibold">WODC</th>
                        <th className="px-3 py-3 text-center font-semibold">Dist.</th>
                        <th className="px-3 py-3 text-center font-semibold">Expenditure</th>
                      </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody className="divide-y divide-gray-200">
                      {districtData.map((district, index) => (
                        <tr
                          key={index}
                          className={`
                            bg-white
                            hover:bg-orange-50
                            transition-colors duration-150
                            ${index === districtData.length - 1 ? 'font-semibold bg-gray-50' : ''}
                          `}
                        >
                          <td className="px-3 py-2.5 font-medium text-gray-800">
                            {district.district}
                          </td>

                          <td className="px-3 py-2.5 text-center text-gray-700">
                            {district.projects.toLocaleString()}
                          </td>

                          <td className="px-3 py-2.5 text-center  text-gray-700">
                            {district.approved.toLocaleString()}
                          </td>

                          <td className="px-3 py-2.5 text-center text-gray-700">
                            {district.releasedWODC.toLocaleString()}
                          </td>

                          <td className="px-3 py-2.5 text-center text-gray-700">
                            {district.releasedDist.toLocaleString()}
                          </td>

                          <td className="px-3 py-2.5 text-center text-gray-700">
                            {district.expenditure.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery Section - Responsive */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mt-6">
          <h4 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-800">
            <FiImage className="text-[#ff7900]" />
            Event Gallery
          </h4>
          
          <div className="flex items-center">
            {/* Left Arrow Button */}
            <button
              onClick={handlePrevImage}
              className="mr-2 sm:mr-4 bg-[#ff7900] text-white rounded-full p-2 shadow-md hover:bg-[#e56a00] transition-colors duration-300"
            >
              <FiChevronLeft className="text-white" />
            </button>
            
            {/* Image Container - Responsive grid */}
            <div className="flex-1 overflow-hidden">
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
                {getVisibleImages().map((item, index) => (
                  <div key={`${item.id}-${currentImageIndex}-${index}`} className="col-span-1">
                    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                      <img 
                        src={item.src} 
                        alt={item.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="p-3 bg-white">
                        <h5 className="font-semibold text-sm text-gray-800 mb-1">{item.title}</h5>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Arrow Button */}
            <button
              onClick={handleNextImage}
              className="ml-2 sm:ml-4 bg-[#ff7900] text-white rounded-full p-2 shadow-md hover:bg-[#e56a00] transition-colors duration-300"
            >
              <FiChevronRight className="text-white" />
            </button>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center items-center mt-6">
            <div className="flex space-x-2">
              {galleryData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-[#ff7900] scale-125' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <span className="ml-4 text-sm text-gray-600">
              {currentImageIndex + 1} / {galleryData.length}
            </span>
          </div>
        </div>

        {/* NEW SECTION: Types of work wise in Progress status project count - Responsive charts */}
        <div className="bg-white rounded-lg  border border-gray-200 shadow-sm mt-6">
          <h4 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-800">
            <FiActivity className="text-[#ff7900]" />
            Types of work wise in Progress status project count
          </h4>
          
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {/* Road & Communication */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <h5 className="text-base font-medium mb-2 text-gray-800">Road & Communication</h5>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 180}>
                <BarChart data={workTypeData.filter(item => item.category === 'Road & Communication')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subcategory" stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} angle={-45} textAnchor="end" height={isMobile ? 80 : 60} />
                  <YAxis stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#511409">
                    {workTypeData.filter(item => item.category === 'Road & Communication').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#511409" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Roads & Communication(Black Toping) */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <h5 className="text-base font-medium mb-2 text-gray-800">Roads & Communication(Black Toping)</h5>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 180}>
                <BarChart data={workTypeData.filter(item => item.category === 'Roads & Communication(Black Toping)')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subcategory" stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} angle={-45} textAnchor="end" height={isMobile ? 80 : 60} />
                  <YAxis stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#7a1f13">
                    {workTypeData.filter(item => item.category === 'Roads & Communication(Black Toping)').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#7a1f13" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Irrigation/Water Body */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <h5 className="text-base font-medium mb-2 text-gray-800">Irrigation/Water Body</h5>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 180}>
                <BarChart data={workTypeData.filter(item => item.category === 'Irrigation/Water Body')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subcategory" stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} angle={-45} textAnchor="end" height={isMobile ? 80 : 60} />
                  <YAxis stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#234341">
                    {workTypeData.filter(item => item.category === 'Irrigation/Water Body').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#234341" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Building */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <h5 className="text-base font-medium mb-2 text-gray-800">Building</h5>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 180}>
                <BarChart data={workTypeData.filter(item => item.category === 'Building')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subcategory" stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} angle={-45} textAnchor="end" height={isMobile ? 80 : 60} />
                  <YAxis stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#574827">
                    {workTypeData.filter(item => item.category === 'Building').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#574827" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs text-gray-700">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* District-Wise Work Status - Responsive */}
        <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
          <h4 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-800">
            <FiTrendingUp className="text-[#ff7900]" />
            District-Wise Work Status
          </h4>
          
          <div className="overflow-auto">
            <ResponsiveContainer width="100%" height={isMobile ? 350 : 400}>
              <BarChart 
                data={showAllDistricts ? districtWorkStatusData : districtWorkStatusData.slice(0, isMobile ? 8 : 15)} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="district" 
                  stroke="#666" 
                  tick={{ fontSize: isMobile ? 8 : 10 }} 
                  angle={isMobile ? -90 : -45} 
                  textAnchor="end" 
                  height={isMobile ? 120 : 80}
                />
                <YAxis stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} />
                <Tooltip content={<DistrictWorkStatusTooltip />} />
                <Legend 
                  iconType="rect"
                  wrapperStyle={{ fontSize: isMobile ? '8px' : '10px' }}
                />
                <Bar dataKey="notStarted" stackId="a" fill={workStatusColors['Not Started']} name="Not Started" />
                <Bar dataKey="inProgress" stackId="a" fill={workStatusColors['In Progress']} name="In Progress" />
                <Bar dataKey="completed" stackId="a" fill={workStatusColors['Completed']} name="Completed" />
                <Bar dataKey="cancelled" stackId="a" fill={workStatusColors['Cancelled']} name="Cancelled" />
                <Bar dataKey="diverged" stackId="a" fill={workStatusColors['Diverged']} name="Diverged" />
              </BarChart>
            </ResponsiveContainer>
            {isMobile && (
              <div className="text-center mt-2">
                <button 
                  onClick={() => setShowAllDistricts(!showAllDistricts)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {showAllDistricts ? 'Show Less Districts' : 'Show All Districts'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mt-6">
          <h4 className="text-xl font-medium mb-4 flex items-center gap-2 text-gray-800">
            <FiActivity className="text-[#ff7900]" />
            Project Analysis
          </h4>
          
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
            {/* Delayed Projects Chart */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <h5 className="text-base font-medium mb-2 text-gray-800">Status of Delayed Projects</h5>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                <BarChart data={delayedProjectsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="delayPeriod" 
                    stroke="#666" 
                    tick={{ fontSize: isMobile ? 8 : 10 }} 
                    angle={isMobile ? -90 : -45} 
                    textAnchor="end" 
                    height={isMobile ? 100 : 80}
                  />
                  <YAxis stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} />
                  <Tooltip content={<DelayedProjectsTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {delayedProjectsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* District Project Summary Chart */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <h5 className="text-base font-medium mb-2 text-gray-800">District-Wise Summary of Projects</h5>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                <BarChart 
                  data={showAllDistricts ? districtProjectSummaryData : districtProjectSummaryData.slice(0, isMobile ? 8 : 15)} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="district" 
                    stroke="#666" 
                    tick={{ fontSize: isMobile ? 8 : 10 }} 
                    angle={isMobile ? -90 : -45} 
                    textAnchor="end" 
                    height={isMobile ? 100 : 80}
                  />
                  <YAxis stroke="#666" tick={{ fontSize: isMobile ? 8 : 10 }} />
                  <Tooltip content={<DistrictProjectSummaryTooltip />} />
                  <Legend 
                    iconType="rect"
                    wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }}
                  />
                  <Bar dataKey="kalyanMandaps" fill={projectTypeColors['Kalyan Mandaps']} name="Kalyan Mandaps" />
                  <Bar dataKey="communityCenters" fill={projectTypeColors['Community Centers']} name="Community Centers" />
                  <Bar dataKey="mmsg" fill={projectTypeColors['MMSG']} name="MMSG" />
                  <Bar dataKey="openMandaps" fill={projectTypeColors['Open Mandaps']} name="Open Mandaps" />
                </BarChart>
              </ResponsiveContainer>
              {isMobile && (
                <div className="text-center mt-2">
                  <button 
                    onClick={() => setShowAllDistricts(!showAllDistricts)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {showAllDistricts ? 'Show Less Districts' : 'Show All Districts'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;