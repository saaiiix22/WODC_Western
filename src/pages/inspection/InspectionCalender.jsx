import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { encryptPayload } from "../../crypto.js/encryption";
import { getInspectionByDateService, getInspectionCalendarDataService } from "../../services/inspectionService";
import { FiCalendar, FiCheckCircle, FiEye, FiMapPin, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const InspectionCalendar = () => {
    const [formData, setFormData] = useState(
        {
            month: '',
            finYear: '',
            projectId: '',
            milestoneId: '',
            agencyId: '',
        }
    )

    const [events, setEvents] = useState([]);

    const [cards, setCards] = useState([])

    const loadCalendarData = async () => {
        try {
            const payload = encryptPayload({
                month: null,
                finYear: null,
                projectId: null,
                milestoneId: null,
                agencyId: null,
            });

            const res = await getInspectionCalendarDataService(payload);
            const formattedEvents = res?.data?.data.map(item => {
                const [day, month, year] = item.date.split('/');

                return {
                    title: `${item.inspectionCount} Inspection${item.inspectionCount > 1 ? 's' : ''}`,
                    date: `${year}-${month}-${day}`,
                    allDay: true,
                };
            });
            setEvents(formattedEvents);
        } catch (err) {
            console.error(err);
        }
    };
    const [inspDate, setInspDate] = useState('')
    const getInspectionByDate = async () => {
        try {
            const payload = encryptPayload({
                date: inspDate.split('-').reverse().join('/')
            })
            const res = await getInspectionByDateService(payload)

            if (res?.status === 200 && res?.data.outcome) {
                setCards(res?.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        loadCalendarData();
    }, []);
    useEffect(() => {
        if (inspDate) {
            getInspectionByDate()
        }
    }, [inspDate])


    const navigate = useNavigate();
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


    return (
        <div className="grid grid-cols-12 gap-2">

            <div className="col-span-12">
                <div className="flex-1 bg-white border border-slate-200 p-6">
                    <form action="" className="grid grid-cols-12 gap-6">

                    </form>
                </div>
            </div>

            <div className={`${cards.length === 0 ? "col-span-12" : "col-span-9"}`}>
                <div className="flex-1 bg-white shadow-lg p-6">
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
                        // initialDate="2002-04-01"
                        // visibleRange={{
                        //     start: "2002-04-01",
                        //     end: "2003-04-01",
                        // }}
                        dateClick={(info) => setInspDate(info.dateStr)}
                    />
                </div>
            </div>
            {
                cards.length > 0 && (
                    <div className="col-span-3 p-5 bg-white rounded-sm shadow-lg">
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
                                {cards.length} inspection(s) scheduled
                            </p>
                        </div>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {cards.map((inspection, idx) => (
                                <div
                                    key={idx + 1}
                                    className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-semibold text-gray-800">
                                            {
                                                inspection?.projectName
                                            }
                                        </h5>
                                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded uppercase text-center">
                                            {
                                                inspection?.isComplete ? 'Completed' : "Scheduled"
                                            }
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FiCheckCircle className="text-green-500" />
                                            <p>Milestone: <span className="lowercase">{
                                                inspection?.milestoneName
                                            }</span></p>
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
                                            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2"
                                        >
                                            <FiEye size={14} />
                                            View Details
                                        </button>

                                        <button
                                            onClick={() => handleEditInspection(inspection)}
                                            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg"
                                        >
                                            Edit
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )
            }

        </div>
    );
};

export default InspectionCalendar;
