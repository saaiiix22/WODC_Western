import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

const DetailsPanel = ({ project, onClose }) => {
  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-100 h-full p-6 flex flex-col items-center justify-center text-center text-gray-400">
        <div className="bg-gray-50 p-4 rounded-full mb-3">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm">Select a project on the map to view details</p>
      </div>
    );
  }

  const { projectName, physical = 0, financial = 0, projectStatus = "Unknown", district, totalBudget = 0 } = project;

  return (
    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 h-full overflow-hidden flex flex-col">
      <div className="bg-blue-50/50 p-4 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{projectName}</h3>
          <p className="text-xs text-gray-500">{district}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        )}
      </div>

      <div className="p-5 space-y-5 flex-1">

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Physical Progress</span>
            <span className="font-bold text-gray-800">{physical}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${physical}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-sm mt-4">
            <span className="text-gray-600">Financial Progress</span>
            <span className="font-bold text-gray-800">{financial}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${financial}%` }}></div>
          </div>
        </div>

        <div className="border-t border-gray-100 my-4"></div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Status</p>
            <div className={`inline-block px-2 py-1 rounded text-xs font-semibold
                    ${projectStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                projectStatus === 'DELAYED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {projectStatus}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Last Inspection</p>
            <p className="font-medium text-gray-800">05-Apr-2024</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Estimated Cost</p>
            <p className="font-medium text-gray-800">₹ {totalBudget}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-xs mb-2">Risk Level</p>
          <div className="h-3 w-full rounded lg:rounded-md bg-gradient-to-r from-blue-400 via-green-400 to-red-500 opacity-80"></div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md shadow-sm flex items-center justify-center gap-2 transition-colors">
          View Full Report <FaExternalLinkAlt size={12} />
        </button>
      </div>
    </div>
  );
};

export default DetailsPanel;