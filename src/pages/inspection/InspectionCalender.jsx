import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { encryptPayload } from "../../crypto.js/encryption";
import { getInspectionByDateService, getInspectionCalendarDataService } from "../../services/inspectionService";
import { FiCalendar, FiCheckCircle, FiEye, FiMapPin, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SelectField from "../../components/common/SelectField";
import { getFinancialYearService } from "../../services/budgetService";
import { getProjectByFinYearService } from "../../services/projectService";
import { getMilestoneByProjectIdService } from "../../services/projectService";
import { getAgencyDetailsService } from "../../services/agencyService";

const InspectionCalendar = () => {
    const [formData, setFormData] = useState({
        month: '',
        finYear: '',
        projectId: '',
        milestoneId: '',
        agencyId: '',
    });

    const [finOpts, setFinOpts] = useState([]);
    const [projectOpts, setProjectOpts] = useState([]);
    const [milestoneOpts, setMilestoneOpts] = useState([]);
    const [agencyOpts, setAgencyOpts] = useState([]);
    const [events, setEvents] = useState([]);
    const [cards, setCards] = useState([]);
    const [inspDate, setInspDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch all dropdown data
    const getAllFinOpts = async () => {
        try {
            const res = await getFinancialYearService(
                encryptPayload({ isActive: true })
            );
            if (res?.status === 200 && res?.data?.outcome) {
                setFinOpts(res.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch financial years:", error);
            toast.error("Failed to load financial years");
        }
    };

    const getAllAgencyList = async () => {
        try {
            const res = await getAgencyDetailsService(
                encryptPayload({ isActive: true })
            );
            if (res?.status === 200) {
                setAgencyOpts(res?.data?.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch agencies:", error);
            toast.error("Failed to load agencies");
        }
    };

    const getProjectOptsByFinYear = async () => {
        if (!formData.finYear) {
            setProjectOpts([]);
            setFormData(prev => ({ ...prev, projectId: '', milestoneId: '' }));
            return;
        }
        try {
            const res = await getProjectByFinYearService(
                encryptPayload({
                    isActive: true,
                    finyearId: parseInt(formData.finYear),
                })
            );

            if (res?.status === 200 && res?.data?.outcome) {
                setProjectOpts(res.data.data || []);
            } else {
                setProjectOpts([]);
                setFormData(prev => ({ ...prev, projectId: '', milestoneId: '' }));
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            toast.error("Failed to load projects");
            setProjectOpts([]);
        }
    };

    const getAllMilestoneOpts = async () => {
        if (!formData.projectId) {
            setMilestoneOpts([]);
            setFormData(prev => ({ ...prev, milestoneId: '' }));
            return;
        }

        try {
            const res = await getMilestoneByProjectIdService(
                encryptPayload({
                    isActive: true,
                    projectId: formData.projectId,
                })
            );

            if (res?.status === 200 && res?.data?.outcome) {
                setMilestoneOpts(res.data.data || []);
            } else {
                setMilestoneOpts([]);
                setFormData(prev => ({ ...prev, milestoneId: '' }));
            }
        } catch (error) {
            console.error("Failed to fetch milestones:", error);
            toast.error("Failed to load milestones");
            setMilestoneOpts([]);
        }
    };

    const loadCalendarData = useCallback(async () => {
        try {
            setCalendarLoading(true);

            // Build filter payload
            const payload = encryptPayload({
                month: formData.month || null,
                finYear: formData.finYear || null,
                projectId: formData.projectId || null,
                milestoneId: formData.milestoneId || null,
                agencyId: formData.agencyId || null,
            });

            const res = await getInspectionCalendarDataService(payload);

            if (res?.status === 200 && res?.data?.data) {
                const formattedEvents = res.data.data.map(item => {
                    const [day, month, year] = item.date.split('/');
                    return {
                        title: `(${item.inspectionCount}) Inspection${item.inspectionCount > 1 ? 's' : ''}`,
                        date: `${year}-${month}-${day}`,
                        allDay: true,
                    };
                });
                setEvents(formattedEvents);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error("Failed to load calendar data:", err);
            toast.error("Failed to load calendar data");
            setEvents([]);
        } finally {
            setCalendarLoading(false);
        }
    }, [formData]);

    const getInspectionByDate = async () => {
        try {
            setLoading(true);
            const payload = encryptPayload({
                date: inspDate.split('-').reverse().join('/'),
                ...(formData.finYear && { finYear: formData.finYear }),
                ...(formData.projectId && { projectId: formData.projectId }),
                ...(formData.milestoneId && { milestoneId: formData.milestoneId }),
                ...(formData.agencyId && { agencyId: formData.agencyId }),
            });

            const res = await getInspectionByDateService(payload);

            if (res?.status === 200 && res?.data.outcome) {
                setCards(res?.data.data || []);
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error("Failed to fetch inspections by date:", error);
            toast.error("Failed to load inspection details");
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            // Reset dependent fields when parent field changes
            if (name === 'finYear') {
                return { ...prev, [name]: value, projectId: '', milestoneId: '' };
            }
            if (name === 'projectId') {
                return { ...prev, [name]: value, milestoneId: '' };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleEditInspection = (inspection) => {
        navigate("/inspection", {
            state: {
                inspectionId: inspection.inspectionId,
                isViewMode: false,
            },
        });
    };

    const handleViewInspection = (inspection) => {
        navigate("/inspection", {
            state: {
                inspectionId: inspection.inspectionId,
                isViewMode: true,
            },
        });
    };

    const handleResetFilters = () => {
        setFormData({
            month: '',
            finYear: '',
            projectId: '',
            milestoneId: '',
            agencyId: '',
        });
    };

    // Initialize data
    useEffect(() => {
        getAllFinOpts();
        getAllAgencyList();
        loadCalendarData();
    }, []);

    // Fetch projects when financial year changes
    useEffect(() => {
        getProjectOptsByFinYear();
    }, [formData.finYear]);

    // Fetch milestones when project changes
    useEffect(() => {
        getAllMilestoneOpts();
    }, [formData.projectId]);

    // Reload calendar data when any filter changes (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            loadCalendarData();
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [formData, loadCalendarData]);

    // Fetch inspections when date is clicked
    useEffect(() => {
        if (inspDate) {
            getInspectionByDate();
        }
    }, [inspDate, formData]); // Also refetch when filters change and date is selected

    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
                <div className="flex-1 bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-2">
                            <SelectField
                                label="Financial Year"
                                name="finYear"
                                value={formData.finYear}
                                options={finOpts.map((i) => ({
                                    value: i.finyearId,
                                    label: i.finYear,
                                }))}
                                placeholder="Select"
                                onChange={handleChangeInput}
                            />
                        </div>

                        <div className="col-span-2">
                            <SelectField
                                label="Project Name"
                                name="projectId"
                                value={formData.projectId}
                                disabled={!formData.finYear}
                                options={projectOpts.map((i) => ({
                                    value: i.projectId,
                                    label: i.projectName,
                                }))}
                                placeholder="Select"
                                onChange={handleChangeInput}
                            />
                        </div>

                        <div className="col-span-2">
                            <SelectField
                                label="Milestone Name"
                                name="milestoneId"
                                value={formData.milestoneId}
                                disabled={!formData.projectId}
                                options={milestoneOpts.map((i) => ({
                                    value: i.milestoneId,
                                    label: i.milestoneName,
                                }))}
                                placeholder="Select"
                                onChange={handleChangeInput}
                            />
                        </div>

                        <div className="col-span-2">
                            <SelectField
                                label="Agency Name"
                                name="agencyId"
                                value={formData.agencyId}
                                options={agencyOpts.map((i) => ({
                                    value: i.agencyId,
                                    label: i.agencyName,
                                }))}
                                placeholder="Select"
                                onChange={handleChangeInput}
                            />
                        </div>

                        <div className="col-span-2 flex items-end">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${cards.length === 0 ? "col-span-12" : "col-span-9"}`}>
                <div className="flex-1 bg-white shadow-lg p-6 rounded-lg">
                    {calendarLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading calendar data...</span>
                        </div>
                    ) : (
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            height="auto"
                            events={events}
                            eventDisplay="block"
                            dayMaxEvents={3}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "",
                            }}
                            dateClick={(info) => setInspDate(info.dateStr)}
                            eventContent={(eventInfo) => (
                                <div className="fc-event-content">
                                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {eventInfo.event.title}
                                    </div>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>

            {cards.length > 0 && (
                <div className="col-span-3 p-5 bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">
                            Inspection Details
                        </h3>
                        <button
                            onClick={() => setCards([])}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                        >
                            <FiX size={20} className="text-gray-600" />
                        </button>
                    </div>
                    <div className="mb-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-2">
                            {inspDate &&
                                new Date(inspDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {cards.length} inspection(s) found
                        </p>
                    </div>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {cards.map((inspection, idx) => (
                            <div
                                key={idx}
                                className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h5 className="font-semibold text-gray-800">
                                        {inspection?.projectName}
                                    </h5>
                                    <span className={`px-2 py-1 text-xs rounded uppercase text-center ${inspection?.isComplete
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {inspection?.isComplete ? 'Completed' : "Scheduled"}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiCheckCircle className="text-green-500" />
                                        <p>Milestone: <span className="lowercase">{inspection?.milestoneName}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiMapPin className="text-blue-500" />
                                        <span>Agency: {inspection?.agencyName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiCalendar className="text-purple-500" />
                                        <span>
                                            {inspection?.startDate} - {inspection?.endDate}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => handleViewInspection(inspection)}
                                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition-colors"
                                    >
                                        <FiEye size={14} />
                                        View Details
                                    </button>

                                    {!inspection?.isComplete && (
                                        <button
                                            onClick={() => handleEditInspection(inspection)}
                                            className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectionCalendar;