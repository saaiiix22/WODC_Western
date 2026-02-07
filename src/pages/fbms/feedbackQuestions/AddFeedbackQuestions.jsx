import { useState, useEffect } from "react";
import { encryptPayload } from '../../../crypto.js/encryption';
import { toast } from "react-toastify";
import InputField from "../../../components/common/InputField";
import SelectField from "../../../components/common/SelectField";
import Loader from "../../../components/common/Loader";
import ReusableDialog from "../../../components/common/ReusableDialog";
import ReusableDataTable from "../../../components/common/ReusableDataTable";
import { SubmitBtn, ResetBackBtn } from "../../../components/common/CommonButtons";
import { 
  saveFeedbackQuestionsService, 
  editFeedbackQuestionsService, 
  feedbackQuestionsListService,
  fetchFeedbackQuestionByTypeAndProjectService
} from "../../../services/feedbackQuestionsService";
import {
  fetchFeedbackTypeListService,
  fetchProjectDetailsListService
} from "../../../services/fbmsCommonService";
import { useRef } from "react";

const Feedback = () => {
  
  const [loading, setLoading] = useState(false);
  const [feedbackQuestions, setfeedbackQuestion] = useState([]);
  const [feedbackTypesList, setFeedbackTypesList] = useState([]);
  const [projectDetailsList, setProjectDetailsList] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const skipAutoFetchRef = useRef(false);
  
  const [formData, setFormData] = useState({
    feedbackQuestionId: null,
    projectId: "",
    typeId: "",
    isActive: true,
    feedbackQuestionDetails: [
      {
        feedbackQuestionDetailsId: null,
        feedbackQuestionsName: "",
        isActive: true
      }
    ]
  });

  const { feedbackQuestionId, projectId, typeId, isActive, feedbackQuestionDetails } = formData;
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "typeId" || name === "projectId") {
      skipAutoFetchRef.current = false;
    }
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    setErrors(prev => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: checked 
    }));
  };

  const validateMainForm = () => {
    let newErrors = {};
    
    if (!typeId) {
      newErrors.typeId = "Feedback type is required";
    }
    
    if (!projectId) {
      newErrors.projectId = "Project is required";
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const addFeedbackDetail = () => {

    const lastIndex = feedbackQuestionDetails.length - 1;
    const lastItem = feedbackQuestionDetails[lastIndex];
    let rowErrors = {};

    if (!lastItem.feedbackQuestionsName.trim()) {
      rowErrors[`question_${lastIndex}`] = "Question is required before adding another";
    }

    if (Object.keys(rowErrors).length > 0) {
      toast.error("Please fill the current question before adding new one");
      return;
    }

    setFormData(prev => ({
      ...prev,
      feedbackQuestionDetails: [
        ...prev.feedbackQuestionDetails,
        {
          feedbackQuestionDetailsId: null,
          feedbackQuestionsName: "",
          isActive: true
        }
      ]
    }));
  };

  const removeFeedbackDetail = (index) => {
    if (feedbackQuestionDetails.length === 1) {
      toast.error("At least one question is required");
      return;
    }

    setFormData(prev => ({
      ...prev,
      feedbackQuestionDetails: prev.feedbackQuestionDetails.filter((_, i) => i !== index)
    }));

    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`question_${index}`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const updateDetailField = (index, field, value) => {
    setFormData(prev => {
      const newDetails = [...prev.feedbackQuestionDetails];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return { ...prev, feedbackQuestionDetails: newDetails };
    });

    if (field === "feedbackQuestionsName") {
      setErrors(prev => ({
        ...prev,
        [`question_${index}`]: ""
      }));
    }
  };

  const validateQuestionRow = (index) => {
    const question = feedbackQuestionDetails[index];
    if (!question.feedbackQuestionsName.trim()) {
      setErrors(prev => ({
        ...prev,
        [`question_${index}`]: "Question is required"
      }));
      return false;
    }
    return true;
  };

  const validateAllQuestions = () => {
    let hasErrors = false;
    feedbackQuestionDetails.forEach((_, index) => {
      if (!validateQuestionRow(index)) {
        hasErrors = true;
      }
    });
    return !hasErrors;
  };

  useEffect(() => {
    const loadDropdowns = async () => {
      setLoading(true);
      try {

        fetchFeedbackTypesList();
        fetchProjectDetailsList();
        fetchFeedbackList();
        
      } catch (error) {
        toast.error("Failed to load dropdown data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDropdowns();
  }, []);

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

const fetchFeedbackList = async () => {
  setLoading(true);
  try {
    const response = await feedbackQuestionsListService();
    if (response?.data?.outcome === true) {
      setfeedbackQuestion(response.data?.data || []);
    } else {
      toast.error(response?.data?.message || "Failed to load feedback list");
    }
  } catch (err) {
    toast.error("Something went wrong while fetching feedback");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const handleSubmitConfirmModal = (e) => {
  e.preventDefault();
  
  if (!validateMainForm()) {
    toast.error("Please fill required fields");
    return;
  }
  
  if (!validateAllQuestions()) {
    toast.error("Please fill all questions");
    return;
  }
  
  if (feedbackQuestionDetails.length === 0) {
    toast.error("At least one question is required");
    return;
  }
  
  setOpenSubmit(true);
};

const handleSubmit = async () => {
  try {
    setLoading(true);
    setOpenSubmit(false);
    
    const dataToEncrypt = {
      feedbackQuestionId: feedbackQuestionId || null,
      projectId: projectId,
      typeId: typeId,
      isActive: isActive,
      feedbackQuestionDetails: feedbackQuestionDetails.map(detail => ({
        feedbackQuestionDetailsId: detail.feedbackQuestionDetailsId || null,
        feedbackQuestionsName: detail.feedbackQuestionsName.trim(),
        isActive: detail.isActive
      }))
    };
    
    console.log("Data to encrypt:", dataToEncrypt);
    
    const cipherText = encryptPayload(dataToEncrypt);
    
    const res = await saveFeedbackQuestionsService(cipherText);
    
    console.log("API Response:", res);
    
    if (res?.status === 200 && res?.data?.outcome) {
      toast.success(res?.data.message || "Success!");
      
      resetForm();
      
      await fetchFeedbackList();
      
    } else {
      toast.error(res?.data?.message || "Submission failed");
    }
  } catch (error) {
    console.error("Submit error:", error);
    if (error.response) {
      toast.error(error.response.data?.message || "Server error occurred");
    } else if (error.request) {
      toast.error("No response from server");
    } else {
      toast.error(error.message || "Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};

const resetForm = () => {
  setFormData({
    feedbackQuestionId: null,
    projectId: "",
    typeId: "",
    isActive: true,
    feedbackQuestionDetails: [
      {
        feedbackQuestionDetailsId: null,
        feedbackQuestionsName: "",
        isActive: true
      }
    ]
  });
  setErrors({});
};

const editFeedback = async (row) => {
  skipAutoFetchRef.current = true; 
  setLoading(true);
  try {
    const cipherText = encryptPayload({ feedbackQuestionId: row.feedbackQuestionId });
    const response = await editFeedbackQuestionsService(cipherText);
    
    if (response?.data.outcome === true) {
      const data = response.data.data;
      
      setFormData({
        feedbackQuestionId: data.feedbackQuestionId,
        projectId: data.projectId || "",
        typeId: data.typeId || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
        feedbackQuestionDetails: data.feedbackQuestionDetails?.map(detail => ({
          feedbackQuestionDetailsId: detail.feedbackQuestionDetailsId || null,
          feedbackQuestionsName: detail.feedbackQuestionsName || "",
          isActive: detail.isActive !== undefined ? detail.isActive : true
        })) || [
          {
            feedbackQuestionDetailsId: null,
            feedbackQuestionsName: "",
            isActive: true
          }
        ]
      });
      
      setErrors({});
      toast.success("Data loaded for editing");
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error(response?.data?.message || "Failed to load data");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while loading feedback");
  } finally {
    setLoading(false);
  }
};

const fetchFeedbackQuestionsByTypeAndProject = async (typeId, projectId) => {
  setLoading(true);
  try {

    const cipherText = encryptPayload({ typeId, projectId });

    const response = await fetchFeedbackQuestionByTypeAndProjectService(cipherText);

    const data = response?.data?.data;

    if (data) {

      setFormData({
        feedbackQuestionId: data.feedbackQuestionId ?? null,
        projectId: data.projectId != null ? String(data.projectId) : "",
        typeId: data.typeId != null ? String(data.typeId) : "",
        isActive: data.isActive ?? true,
        feedbackQuestionDetails: data.feedbackQuestionDetails?.map(d => ({
          feedbackQuestionDetailsId: d.feedbackQuestionDetailsId ?? null,
          feedbackQuestionsName: d.feedbackQuestionsName ?? "",
          isActive: d.isActive ?? true
        })) || [{
          feedbackQuestionDetailsId: null,
          feedbackQuestionsName: "",
          isActive: true
        }]
      });

      setErrors({});
      toast.success("Existing data loaded successfully.");

      window.scrollTo({ top: 0, behavior: "smooth" });

    } else {

      setFormData(prev => ({
        ...prev,
        feedbackQuestionId: null,
        isActive: true,
        feedbackQuestionDetails: [
          {
            feedbackQuestionDetailsId: null,
            feedbackQuestionsName: "",
            isActive: true
          }
        ]
      }));

    }

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while loading feedback");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {

  if (skipAutoFetchRef.current) return;

  if (!typeId || !projectId) return;

  fetchFeedbackQuestionsByTypeAndProject(typeId, projectId);

}, [typeId, projectId]);

  return (
    <>
    <div className="mt-3">
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      
      {/* ---------- Add Feedback Questions Form ---------- */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            {feedbackQuestionId ? "Edit Feedback Questions" : "Add Feedback Questions"}
          </h2>
        </div>
        
        <div className="p-6">
          <form
            className="grid grid-cols-12 gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (validateMainForm()) {
                setOpenSubmit(true);
              }
            }}
            noValidate
          >
            {/* Feedback Type Dropdown */}
            <div className="col-span-4">
              <SelectField
                label="Feedback Type"
                required={true}
                name="typeId"
                value={typeId}
                onChange={handleChangeInput}
                options={feedbackTypeOptions}
                error={errors.typeId}
                placeholder="Select feedback type"
              />
            </div>

            {/* Project Dropdown */}
            <div className="col-span-4">
              <SelectField
                label="Project"
                required={true}
                name="projectId"
                value={projectId}
                onChange={handleChangeInput}
                options={projectDetailsOptions}
                error={errors.projectId}
                placeholder="Select project"
              />
            </div>

            {/* Status Checkbox */}
            <div className="col-span-4 flex items-center mt-7">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={isActive}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            {/* Questions Table Section */}
            <div className="col-span-12 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-800">
                  Feedback Questions
                </h3>
                <button
                  type="button"
                  onClick={addFeedbackDetail}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all active:scale-95"
                >
                  + Add Question
                </button>
              </div>

              {/* Questions Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Sl No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Question
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feedbackQuestionDetails.map((detail, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-center">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={detail.feedbackQuestionsName}
                              onChange={(e) => updateDetailField(index, "feedbackQuestionsName", e.target.value)}
                              placeholder="Enter question..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              maxLength={255}
                            />
                            {errors[`question_${index}`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`question_${index}`]}</p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={detail.isActive}
                              onChange={(e) => updateDetailField(index, "isActive", e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {detail.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => removeFeedbackDetail(index)}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={feedbackQuestionDetails.length === 1}
                            title={feedbackQuestionDetails.length === 1 ? "Cannot delete the only question" : "Delete question"}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-12">
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <ResetBackBtn />
                <SubmitBtn type={"submit"} btnText={feedbackQuestionId ? "Update" : null} />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ReusableDialog
        open={openSubmit}
        description={`Are you sure you want to ${feedbackQuestionId ? "update" : "submit"} these feedback questions?`}
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
    {/* ===================== Feedback Type ===================== */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Feedback List
            </h2>
          </div>

          <div className="p-6">
            <ReusableDataTable
              data={feedbackQuestions}
              columns={[
                {
                  name: "ID",
                  selector: (row) => row.feedbackQuestionId,
                  width: "80px",
                },
                {
                  name: "Project Name",
                  selector: (row) => row.projectName,
                },
                {
                  name: "Feedback Type",
                  selector: (row) => row.typeName,
                },
                {
                  name: "Feedback Questions",
                  selector: (row) => row.feedbackQuestionId,
                  cell: (row) => {
                    const questions = row.feedbackQuestionDetails
                      ?.map((d) => d.feedbackQuestionsName?.trim())
                      .filter(Boolean) ?? [];

                    const isExpanded = expandedRow === row.feedbackQuestionId;

                    if (!questions.length) return <span className="text-gray-400">—</span>;

                    return (
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setExpandedRow(isExpanded ? null : row.feedbackQuestionId)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-left flex items-center gap-1.5"
                        >
                          {questions.length} question{questions.length !== 1 ? "s" : ""}
                          <span className="text-xs text-gray-500">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-800 max-w-lg">
                            <ul className="list-disc pl-5 space-y-1.5">
                              {questions.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  },
                  ignoreRowClick: true,
                  allowOverflow: true,
                  button: true,
                },
                {
                  name: "Status",
                  selector: (row) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  ),
                  sortable: true,
                },
                {
                  name: "Action",
                  width: "120px",
                  cell: (row) => (
                    <div className="flex gap-2">
                      <button
                        onClick={() => editFeedback(row)}
                        className="p-1 bg-blue-500/20 text-blue-500 rounded"
                      >Edit</button>
                    </div>
                  ),
                  ignoreRowClick: true,
                  button: true,
                },
              ]}
              progressPending={loading}
              noDataComponent="No feedback types found"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;