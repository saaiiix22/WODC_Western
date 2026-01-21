import { FaLayerGroup, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const GisCard = ({ data }) => {
    const total = data?.totalCount || 0;
    const inProgress = data?.inProgressCount || 0;
    const completed = data?.completedCount || 0;
    const delayed = data?.delayedCount || 0;
    // const highRisk = data?.cancelledCount || 0; 

    const StatCard = ({ icon: Icon, color, bg, label, value, subLabel }) => (
        <div className="bg-white rounded-lg p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
                {subLabel && <p className="text-xs text-gray-400 mt-1">{subLabel}</p>}
            </div>
            <div className={`p-3 rounded-full ${bg} ${color}`}>
                <Icon size={20} />
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon={FaLayerGroup}
                color="text-blue-600"
                bg="bg-blue-50"
                label="Total Projects"
                value={total}
                subLabel="All Schemes"
            />
            <StatCard
                icon={FaSpinner}
                color="text-amber-500"
                bg="bg-amber-50"
                label="In Progress"
                value={inProgress}
                subLabel="Active Sites"
            />
            <StatCard
                icon={FaCheckCircle}
                color="text-green-600"
                bg="bg-green-50"
                label="Completed"
                value={completed}
                subLabel="Handed Over"
            />
            <StatCard
                icon={FaExclamationTriangle}
                color="text-red-500"
                bg="bg-red-50"
                label="Delayed / High Risk"
                value={delayed}
                subLabel="Needs Attention"
            />
        </div>
    );
};

export default GisCard;