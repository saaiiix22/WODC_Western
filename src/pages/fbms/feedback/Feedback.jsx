import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { GrSave } from "react-icons/gr";
import { IoReturnDownBackSharp } from "react-icons/io5";
import SelectField from "../../../components/common/SelectField";
import Loader from "../../../components/common/Loader";
import { SubmitBtn, ResetBackBtn } from "../../../components/common/CommonButtons"; 
import ReusableDialog from "../../../components/common/ReusableDialog";
import {
  saveFeedbackService,
  getFeedbackService,
  feedbackStatusListService
} from "../../../services/feedbackService";
import {
  feedbackQuestionsByProjectAndFeedbackTypeService
} from "../../../services/feedbackService"
import {
   fetchFeedbackTypeListService,
   fetchProjectDetailsListService
} from "../../../services/fbmsCommonService"
import { encryptPayload } from '../../../crypto.js/encryption';

const Feedback = () => {
  const [projectDetailsList, setProjectDetailsList] = useState([]);
  const [feedbackTypesList, setFeedbackTypesList] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState([]);
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questionFeedbacks, setQuestionFeedbacks] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [existingFeedbackId, setExistingFeedbackId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);

  const [formData, setFormData] = useState({
    typeId: "",
    projectId: ""
  });

  const { typeId, projectId } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const fetchFeedbackTypesList = async () => {
    try {
      const response = await fetchFeedbackTypeListService();
      if (response?.data?.outcome === true) {
        setFeedbackTypesList(response.data?.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to load feedback types");
      }
    } catch (err) {
      toast.error("Error fetching feedback types");
      console.error(err);
    }
  };

  const feedbackTypeOptions = feedbackTypesList.map((item) => ({
    value: item.dropDownId,
    label: item.dropDownName,
  }));

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

  const fetchFeedbackStatus = async () => {
    try {
      const response = await feedbackStatusListService();
      if (response?.data?.outcome === true) {
        console.log(response.data?.data );
        setFeedbackStatus(response.data?.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to load feedback status");
      }
    } catch (err) {
      toast.error("Error fetching feedback status");
      console.error(err);
    }
  };

  const feedbackStatusOptions = feedbackStatus.map((item) => ({
    value: item.valueEn,
    label: item.valueEn,
  }));

  const handleAddClick = async () => {
    const errors = {};
    if (!typeId) {
      errors.typeId = "Feedback Type is required";
    }
    if (!projectId) {
      errors.projectId = "Project is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await fetchFeedbackQuestions(projectId, typeId); 
  };

  const fetchFeedbackQuestions = async (projectId, typeId) => {
    try {
      if (!projectId || !typeId) return;
      const payload = { projectId, typeId };
      const cipherText = encryptPayload(payload);
      const response = await feedbackQuestionsByProjectAndFeedbackTypeService(cipherText);
      console.log("Questions response:", response);

      if (response?.data?.outcome === true) {
        const data = response.data.data || {};
        setFeedbackQuestions([data] || []);
        
        if (data.feedbackId) {
          setExistingFeedbackId(data.feedbackId);
          setIsEditing(true);
          toast.success("Existing feedback loaded successfully!");
          
          const previousSelectedQuestions = [];
          const previousFeedbacks = {};
          
          if (data.feedbackDetails && Array.isArray(data.feedbackDetails)) {
            data.feedbackDetails.forEach(detail => {
              if (detail.feedbackQuestionDetailsId && detail.feedbackStatus) {
                const qId = detail.feedbackQuestionDetailsId;
                previousSelectedQuestions.push(qId);
                previousFeedbacks[qId] = {
                  feedbackDetailsId: detail.feedbackDetailsId,
                  feedbackId: detail.feedbackId,
                  feedbackStatus: detail.feedbackStatus
                };
              }
            });
          }
          
          setSelectedQuestions(previousSelectedQuestions);
          setQuestionFeedbacks(previousFeedbacks);
        } else {
          setExistingFeedbackId(null);
          setIsEditing(false);
          setSelectedQuestions([]);
          setQuestionFeedbacks({});
          toast.info("No existing feedback found. You can create new feedback.");
        }
      } else {
        setFeedbackQuestions([]);
        setExistingFeedbackId(null);
        setIsEditing(false);
        setSelectedQuestions([]);
        setQuestionFeedbacks({});
        toast.error(response?.data?.message || "Failed to fetch feedback questions");
      }
    } catch (error) {
      setFeedbackQuestions([]);
      setExistingFeedbackId(null);
      setIsEditing(false);
      setSelectedQuestions([]);
      setQuestionFeedbacks({});
      toast.error("Error fetching feedback questions", error);
    }
  };

  const handleQuestionSelect = (questionId, isSelected) => {
    if (isSelected) {
      setSelectedQuestions(prev => [...prev, questionId]);
      const existingFeedback = questionFeedbacks[questionId];
      setQuestionFeedbacks(prev => ({
        ...prev,
        [questionId]: existingFeedback || { feedbackStatus: "" }
      }));
    } else {
      setSelectedQuestions(prev => prev.filter(id => id !== questionId));
      if (!questionFeedbacks[questionId]?.feedbackDetailsId) {
        setQuestionFeedbacks(prev => {
          const updated = { ...prev };
          delete updated[questionId];
          return updated;
        });
      } else {
        setQuestionFeedbacks(prev => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            feedbackStatus: ""
          }
        }));
      }
    }
  };

  const handleStatusChange = (questionId, value) => {
    setQuestionFeedbacks(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        feedbackStatus: value
      }
    }));
  };

  const validateBeforeSubmit = () => {
    const errors = {};

    if (selectedQuestions.length === 0) {
      errors.questions = "Please select at least one question";
    }

    selectedQuestions.forEach(qId => {
      if (!questionFeedbacks[qId]?.feedbackStatus?.trim()) {
        errors[`feedbackStatus_${qId}`] = "Please select feedback status";
      }
    });

    return errors;
  };

  const handleSubmitConfirm = () => {
      const validationErrors = validateBeforeSubmit();
      setFieldErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        setOpenSubmit(true);
      }
    };

    const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      setOpenSubmit(false);
      
      const feedbackDetails = selectedQuestions.map(qId => {
        const detail = {
          feedbackQuestionDetailsId: qId,
          feedbackStatus: questionFeedbacks[qId].feedbackStatus,
        };
        
        if (questionFeedbacks[qId]?.feedbackDetailsId) {
          detail.feedbackDetailsId = questionFeedbacks[qId].feedbackDetailsId;
        }
        
        return detail;
      });
      
      const dataToEncrypt = {
        feedbackQuestionId: feedbackQuestions[0]?.feedbackQuestionId || null,
        feedbackId: existingFeedbackId,
        isActive: true,
        feedbackDetails: feedbackDetails
      };
      
      const encryptedPayload = encryptPayload(JSON.stringify(dataToEncrypt));

      const response = await saveFeedbackService(encryptedPayload);
      
      if (response?.data?.outcome === true) {
        toast.success(`Feedback ${existingFeedbackId ? 'updated' : 'submitted'} successfully!`);
        handleCancel(); 
      } else {
        toast.error(response?.data?.message || `Failed to ${existingFeedbackId ? 'update' : 'save'} feedback`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error while ${existingFeedbackId ? 'updating' : 'saving'} feedback`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedQuestions([]);
    setQuestionFeedbacks({});
    setFieldErrors({});
    setFeedbackQuestions([]);
    setFormData({ typeId: "", projectId: "" });
    setExistingFeedbackId(null);
    setIsEditing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeedbackTypesList(),
        fetchProjectDetailsList(),
        fetchFeedbackStatus() 
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const FeedbackQuestionsCard = () => {
    if (!feedbackQuestions.length) return null;

    const current = feedbackQuestions[0] || {};
    const questions = current.feedbackDetails || [];

    if (questions.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-8 p-8 text-center text-gray-500">
          No questions available for this selection.
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {isEditing ? 'Edit Feedback' : 'Provide Feedback'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Project: <span className="font-medium">{current.projectName || '—'}</span> | 
                Type: <span className="font-medium">{current.typeName || '—'}</span>
                {isEditing && (
                  <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Editing Existing Feedback
                  </span>
                )}
              </p>
            </div>
            {isEditing && (
              <div className="text-sm text-gray-500">
                Feedback ID: <span className="font-medium">{existingFeedbackId}</span>
              </div>
            )}
          </div>
        </div>

        {fieldErrors.questions && (
          <div className="m-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {fieldErrors.questions}
          </div>
        )}

        <div className="p-6 space-y-4">
          {questions.map((q, idx) => {
            const qId = q.feedbackQuestionDetailsId;
            const isChecked = selectedQuestions.includes(qId);
            const hasPreviousFeedback = q.feedbackStatus !== null && q.feedbackStatus !== undefined;
            
            return (
              <div
                key={qId}
                className={`p-4 border rounded-lg ${
                  isChecked ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                } ${hasPreviousFeedback && isEditing ? 'ring-1 ring-blue-300' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* CUSTOM CHECKBOX */}
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleQuestionSelect(qId, e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Question {idx + 1}</span>
                      {hasPreviousFeedback && isEditing && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          Previously Selected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-gray-700">{q.feedbackQuestionsName}</p>

                    {isChecked && (
                      <div className="mt-4 max-w-xs">
                        {/* CUSTOM SELECTFIELD FOR STATUS */}
                        <SelectField
                          label="Feedback Status"
                          required={true}
                          value={questionFeedbacks[qId]?.feedbackStatus || q.feedbackStatus || ""}
                          onChange={(e) => handleStatusChange(qId, e.target.value)}
                          options={feedbackStatusOptions}
                          error={fieldErrors[`feedbackStatus_${qId}`]}
                          placeholder="Select status"
                        />
                        {hasPreviousFeedback && isEditing && q.feedbackStatus && (
                          <p className="text-xs text-gray-500 mt-1">
                            Previous selection: <span className="font-medium">{q.feedbackStatus}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="text-light-dark border bg-[#e3e3e3] border-light-dark text-[13px] px-3 py-1 rounded-sm transition-all active:scale-95 uppercase flex items-center gap-1"
          >
            <IoReturnDownBackSharp className="text-lg" />
            Back
          </button>
          
          <button
            type="button"
            onClick={handleSubmitConfirm}
            className="bg-[#bbef7f] text-[green] text-[13px] px-3 py-1 rounded-sm border border-[green] transition-all active:scale-95 uppercase flex items-center gap-1"
          >
            <GrSave /> {isEditing ? "update" : "submit"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3">
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Add Feedback
          </h2>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-12 gap-6">

              <div className="col-span-4">
                <SelectField
                  label="Feedback Type"
                  required={true}
                  name="typeId"
                  value={typeId}
                  onChange={handleChangeInput}
                  options={feedbackTypeOptions}
                  error={fieldErrors.typeId}
                  placeholder="Select feedback type"
                />
              </div>

              <div className="col-span-4">
                <SelectField
                  label="Project"
                  required={true}
                  name="projectId"
                  value={projectId}
                  onChange={handleChangeInput}
                  options={projectDetailsOptions}
                  error={fieldErrors.projectId}
                  placeholder="Select project"
                />
              </div>

              <div className="col-span-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all active:scale-95 uppercase"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Confirmation Dialog */}
        <ReusableDialog
          open={openSubmit}
          description={`Are you sure you want to ${isEditing ? 'update' : 'submit'} this feedback?`}
          onClose={() => setOpenSubmit(false)}
          onConfirm={handleFinalSubmit}
        />

      {/* Questions Card */}
      <FeedbackQuestionsCard />
    </div>
  );
};

export default Feedback;