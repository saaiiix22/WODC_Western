import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { GrSave } from "react-icons/gr";
import SelectField from "../../../components/common/SelectField";
import Loader from "../../../components/common/Loader";
import ReusableDialog from "../../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "../../../components/common/CommonAccordion";
import {
  feedbackListMapByProjectService,
  saveFeedbackStatusService
} from "../../../services/feedbackService";
import { encryptPayload } from "../../../crypto.js/encryption";
import {
  fetchProjectDetailsListService
} from "../../../services/fbmsCommonService"

const FeedbackList = () => {

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [projectDetailsList, setProjectDetailsList] = useState([]);
  const [feedbackListMap, setFeedbackListMap] = useState({});
  const [statusUpdateMap, setStatusUpdateMap] = useState({});
  const [statusErrors, setStatusErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [activeTab, setActiveTab] = useState("PENDING");

  const [formData, setFormData] = useState({
    projectId: ""
  });

  const { projectId } = formData;

  const handleChangeInput = (e) => {
    const name = e?.target?.name ?? e?.name;

    const rawValue =
      e?.target?.value ?? 
      e?.value ??
      e; 

    if (!name) return;

    const value =
      name === "projectId"
        ? Number(rawValue)
        : rawValue;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setFieldErrors(prev => ({
      ...prev,
      [name]: ""
    }));

    // If project is selected, automatically fetch data
    if (name === "projectId" && value) {
      fetchFeedbackListByStatus(value);
    } else if (name === "projectId" && !value) {
      // If project is cleared, reset the feedback list
      setFeedbackListMap({});
      setStatusUpdateMap({});
      setStatusErrors({});
    }
  };

  const handleStatusLevelChange = (feedbackId, value) => {
    setStatusUpdateMap(prev => ({
      ...prev,
      [feedbackId]: value
    }));

    // Clear error for this dropdown when user selects an option
    setStatusErrors(prev => ({
      ...prev,
      [feedbackId]: ""
    }));
  };

  const fetchProjectDetailsList = async () => {
    try {
      const response = await fetchProjectDetailsListService();
      if (response?.data?.outcome === true) {
        setProjectDetailsList(response.data?.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to load projects");
      }
    } catch (err) {
      toast.error("Error fetching project list");
      console.error(err);
    }
  };

  const projectDetailsOptions = projectDetailsList.map((item) => ({
    value: item.dropDownId,
    label: item.dropDownName,
  }));

  // Define feedback status options
  const feedbackStatusLevelOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "SUBMIT", label: "Submit" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" }
  ];

  const fetchFeedbackListByStatus = async (projectId) => {
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }

    try {
      setLoading(true);

      const payload = { projectId };
      const cipherText = encryptPayload(payload);
      const response = await feedbackListMapByProjectService(cipherText);

      if (response?.data?.outcome === true && response?.data?.data) {
        setFeedbackListMap(response.data.data);
        toast.success("Feedback list fetched successfully");
      } else {
        setFeedbackListMap({});
        toast.error(response?.data?.message || "Failed to fetch feedback list");
      }
    } catch (err) {
      console.error(err);
      setFeedbackListMap({});
      toast.error("Error fetching feedback list");
    } finally {
      setLoading(false);
    }
  };

  const resetPageState = () => {
    setFeedbackListMap({});
    setStatusUpdateMap({});
    setStatusErrors({});
    setSelectedFeedbackId(null);
    setOpenSubmit(false);
    setActiveTab("PENDING");
  };

  const handleFinalSubmit = async () => {
    if (!selectedFeedbackId || !statusUpdateMap[selectedFeedbackId]) {
      toast.error("Please select status");
      return;
    }

    setLoading(true);

    try {
      const dataToEncrypt = {
        feedbackId: selectedFeedbackId,
        status: statusUpdateMap[selectedFeedbackId]
      };

      const encryptedPayload = encryptPayload(JSON.stringify(dataToEncrypt));
      const response = await saveFeedbackStatusService(encryptedPayload);

      if (response?.data?.outcome === true) {
        toast.success(response?.data?.message || "Status updated successfully");
        
        // Refresh data after successful update
        if (projectId) {
          await fetchFeedbackListByStatus(projectId);
        }
        
        // Switch to ACCEPTED tab if status is ACCEPTED
        if (statusUpdateMap[selectedFeedbackId] === "ACCEPTED") {
          setActiveTab("ACCEPTED");
        }
        
        // Clear the status error for this feedback
        setStatusErrors(prev => ({
          ...prev,
          [selectedFeedbackId]: ""
        }));
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }

      setOpenSubmit(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getConfirmMessage = () => {
    const nextStatus = statusUpdateMap[selectedFeedbackId];

    if (nextStatus === "SUBMIT") {
      return "Once submitted, this feedback cannot be changed again. Are you sure you want to submit?";
    }
    
    if (nextStatus === "ACCEPTED") {
      return "Are you sure you want to accept this feedback?";
    }

    return "Do you want to save this feedback as draft?";
  };

  const handleSubmitConfirm = (feedbackId) => {
    // Validate if status is selected
    if (!statusUpdateMap[feedbackId]) {
      setStatusErrors(prev => ({
        ...prev,
        [feedbackId]: "Please select a status"
      }));
      toast.error("Please select status level");
      return;
    }

    // Clear any existing error
    setStatusErrors(prev => ({
      ...prev,
      [feedbackId]: ""
    }));

    setSelectedFeedbackId(feedbackId);
    setOpenSubmit(true);
  };

  // Filter feedbacks based on active tab
  const filteredFeedbacks = Object.values(feedbackListMap || {}).filter(feedback => {
    const status = feedback.status?.toUpperCase();
    
    if (activeTab === "PENDING") {
      // Show all non-accepted statuses in PENDING tab
      return status !== "ACCEPTED" && status !== "REJECTED";
    } else if (activeTab === "ACCEPTED") {
      // Show only ACCEPTED status in ACCEPTED tab
      return status === "ACCEPTED";
    }
    
    return true;
  });

  useEffect(() => {
    fetchProjectDetailsList();
  }, []);

  return (
    <div className="mt-3">

      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Feedback List
          </h2>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <SelectField
                  label="Project Details"
                  required={true}
                  name="projectId"
                  value={projectId}
                  onChange={handleChangeInput}
                  options={projectDetailsOptions}
                  error={fieldErrors.projectId}
                  placeholder="Select project details"
                />
              </div>

              {/* Removed Filter Button - Automatic fetching now */}
            </div>
          </form>
        </div>
      </div>

      {/* Tabs Section - Only show when project is selected */}
      {projectId && Object.keys(feedbackListMap || {}).length > 0 && (
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {/* Pending Tab */}
              <button
                onClick={() => setActiveTab("PENDING")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "PENDING"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending
                <span className="ml-2 bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {
                    Object.values(feedbackListMap || {}).filter(f => 
                      f.status?.toUpperCase() !== "ACCEPTED" && f.status?.toUpperCase() !== "REJECTED"
                    ).length
                  }
                </span>
              </button>

              {/* Accepted Tab */}
              <button
                onClick={() => setActiveTab("ACCEPTED")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "ACCEPTED"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Accepted
                <span className="ml-2 bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {
                    Object.values(feedbackListMap || {}).filter(f => 
                      f.status?.toUpperCase() === "ACCEPTED"
                    ).length
                  }
                </span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Message when project is not selected */}
      {!projectId && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            Please select a project to view feedbacks
          </p>
        </div>
      )}

      {/* Message when project is selected but no feedbacks */}
      {projectId && Object.keys(feedbackListMap || {}).length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            No feedbacks found for this project
          </p>
        </div>
      )}

      {/* Feedback List Accordion */}
      {projectId && filteredFeedbacks.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          {filteredFeedbacks.map((row, index) => (
            <Accordion key={row.feedbackId || index}>
              <AccordionSummary>
                <div className="w-full flex justify-between items-center pr-2">
                  <div className="flex gap-4 items-center text-[12px]">
                    <span className="font-semibold">
                      {index + 1}.
                    </span>
                    <span>
                      <b>Project :</b> {row.projectName}
                    </span>
                    <span>
                      <b>Type :</b> {row.typeName}
                    </span>
                  </div>
                  <div className="text-[12px] text-gray-600">
                    <b>Feedback Id :</b> {row.feedbackId}
                  </div>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <div className="space-y-3 text-[12px]">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Submitted By */}
                    <div className="col-span-4 flex items-center gap-2 text-[12px]">
                      <b className="whitespace-nowrap">Submitted By :</b>
                      <span className="truncate">
                        {row.submittedByUserName || "-"}
                      </span>
                    </div>

                    {/* Submitted On */}
                    <div className="col-span-4 flex items-center gap-2 text-[12px]">
                      <b className="whitespace-nowrap">Submitted On :</b>
                      <span className="whitespace-nowrap">
                        {row.feedbackSubmitedOn
                          ? new Date(row.feedbackSubmitedOn).toLocaleString()
                          : "-"
                        }
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-4 flex items-center gap-2 text-[12px]">
                      <b className="whitespace-nowrap">Status :</b>

                      {/* Show editable dropdown only in PENDING tab */}
                      {activeTab === "PENDING" ? (
                        <div className="w-[140px] flex flex-col">
                          <SelectField
                            label=""
                            required={false}
                            value={statusUpdateMap[row.feedbackId] || ""}
                            onChange={(e) =>
                              handleStatusLevelChange(row.feedbackId, e.target.value)
                            }
                            options={
                              feedbackStatusLevelOptions.filter(
                                option => option.value === "ACCEPTED"
                              )
                            }
                            placeholder="Select status"
                          />
                          {/* Error message for dropdown */}
                          {statusErrors[row.feedbackId] && (
                            <span className="text-red-500 text-xs mt-1">
                              {statusErrors[row.feedbackId]}
                            </span>
                          )}
                        </div>
                      ) : (
                        // In ACCEPTED tab, just show the status text
                        <span className="whitespace-nowrap">
                          {row.status || "-"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question wise feedback */}
                  {Array.isArray(row.feedbackDetails) && row.feedbackDetails.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-2">
                        Question wise feedback
                      </div>
                      <div className="space-y-2">
                        {row.feedbackDetails.map((q, qIndex) => (
                          <div
                            key={q.feedbackDetailsId || qIndex}
                            className="border rounded px-3 py-2 bg-gray-50"
                          >
                            <div className="font-medium">
                              {qIndex + 1}. {q.feedbackQuestionsName}
                            </div>
                            <div className="mt-1 text-gray-700">
                              <b>Status :</b> {q.feedbackStatus || "-"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Show Submit button only in PENDING tab */}
                {activeTab === "PENDING" && (
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => handleSubmitConfirm(row.feedbackId)}
                      className="bg-[#bbef7f] text-[green] text-[13px] px-3 py-1 rounded-sm border border-[green] transition-all active:scale-95 uppercase flex items-center gap-1 hover:bg-green-100"
                    >
                      <GrSave /> Update Status
                    </button>
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}

      {/* Show message when no feedbacks found for active tab */}
      {projectId && Object.keys(feedbackListMap || {}).length > 0 && filteredFeedbacks.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            No {activeTab.toLowerCase()} feedbacks found for this project.
          </p>
        </div>
      )}

      <ReusableDialog
        open={openSubmit}
        description={getConfirmMessage()}
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleFinalSubmit}
      />
    </div>
  );
};

export default FeedbackList;