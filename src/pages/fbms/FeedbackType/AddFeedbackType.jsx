import { useState, useEffect } from "react";
import { encryptPayload } from '../../../crypto.js/encryption';
import { toast } from "react-toastify";
import InputField from "../../../components/common/InputField";
import ReusableDataTable from "../../../components/common/ReusableDataTable";
import { ResetBackBtn, SubmitBtn } from "../../../components/common/CommonButtons";
import Loader from "../../../components/common/Loader";
import ReusableDialog from "../../../components/common/ReusableDialog";
import { validateFeedbackTypeName, saveFeedbackTypeService, editFeedbackTypeService, feedbackTypeListService }
  from "../../../services/feedbackTypeService";

const FeedbackType = () => {
  const [loading, setLoading] = useState(false);
  const [feedbackTypes, setFeedbackTypes] = useState([]);

  const [formData, setFormData] = useState({
    typeId: null,
    typeName: "",
    typeDescription: "",
    typeDocumentPath: null,
    typeDocumentName: ""
  });

  const { typeId, typeName, typeDescription, typeDocumentPath, typeDocumentName } = formData;
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);

  useEffect(() => {
    fetchFeedbackTypes();
  }, []);

  // Fetch feedback types list
  const fetchFeedbackTypes = async () => {
    setLoading(true);
    try {
      const response = await feedbackTypeListService();
      console.log("RAW API RESPONSE:", response);

      if (response?.data?.outcome === true) {
        setFeedbackTypes(response.data?.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to load feedback types");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching feedback types");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: String(value || "")
    }));
    setErrors(prev => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          typeDocumentPath: "Only PDF, JPG, JPEG, PNG files are allowed"
        }));
        e.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          typeDocumentPath: "File size must be less than 5MB"
        }));
        e.target.value = "";
        return;
      }

      setFormData(prev => ({
        ...prev,
        typeDocumentPath: file,
        typeDocumentName: file.name
      }));

      setErrors(prev => ({ ...prev, typeDocumentPath: "" }));
    } else {
      setFormData(prev => ({
        ...prev,
        typeDocumentPath: null,
        typeDocumentName: ""
      }));
    }
  };

  const validateForm = async () => {
    let newErrors = {};

    if (!typeName.trim()) {
      newErrors.typeName = "Feedback type name is required";
    } else if (typeName.trim().length < 2) {
      newErrors.typeName = "Type name must be at least 2 characters";
    }

    if (!typeDescription.trim()) {
      newErrors.typeDescription = "Description is required";
    } else if (typeDescription.trim().length < 10) {
      newErrors.typeDescription = "Description must be at least 10 characters";
    }

    if (!typeId && !typeDocumentPath) {
      newErrors.typeDocumentPath = "Document is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

   const res = await validateDuplicateFeedbackTypeName();

    if (res && res.data?.data === true) {
      newErrors.typeName = "Feedback type name already exists";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

 const validateDuplicateFeedbackTypeName = async () => {
    try {
      const encryptData = {
        validationId: typeId || null,
        validationName: typeName?.trim() || null
      };

      const cipherText = encryptPayload(encryptData);
      const res = await validateFeedbackTypeName(cipherText);
      return res;
    } catch (error) {
      console.error("validate name error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error(error.message || "Something went wrong");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitConfirmModal = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      setOpenSubmit(true);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setOpenSubmit(false);

      const dataToEncrypt = {
        typeId: typeId || null,
        typeName: typeName.trim(),
        typeDescription: typeDescription.trim(),
      };

      const cipherText = encryptPayload(dataToEncrypt);

      const formDataToSend = new FormData();
      formDataToSend.append('cipherText', cipherText);

      if (typeDocumentPath instanceof File) {
        formDataToSend.append('typeDocumentPath', typeDocumentPath);
      }

      const res = await saveFeedbackTypeService(formDataToSend);

      if (res?.status === 200 && res?.data?.outcome) {
        toast.success(res?.data.message || "Success!");
        resetForm();
        await fetchFeedbackTypes();
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
      typeId: null,
      typeName: "",
      typeDescription: "",
      typeDocumentPath: null,
      typeDocumentName: ""
    });
    setErrors({});
    const fileInput = document.getElementById('typeDocumentPath');
    if (fileInput) fileInput.value = "";
  };

  const editFeedbackType = async (row) => {
    setLoading(true);
    try {
      const cipherText = encryptPayload({ typeId: row.typeId });
      const response = await editFeedbackTypeService(cipherText);
      if (response?.data.outcome === true) {
        const data = response.data.data;
        setFormData({
          typeId: data.typeId,
          typeName: data.typeName || "",
          typeDescription: data.typeDescription || "",
          typeDocumentPath: null,
          typeDocumentName: data.typeDocumentName || "" 
        });
        toast.success("Data loaded for editing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while editing feedback type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-3">
        {loading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}

        {/* ---------- Add Feedback Type Form ---------- */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              {typeId ? "Edit Feedback Type" : "Add Feedback Type"}
            </h2>
          </div>

          <div className="p-6">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
              noValidate
            >
              {/* Type Name Field */}
              <div className="col-span-4">
                <InputField
                  label="Feedback Type Name"
                  required={true}
                  name="typeName"
                  placeholder="Enter feedback type name"
                  value={typeName}
                  onChange={handleChangeInput}
                  maxLength={50}
                  error={errors.typeName}
                />
              </div>

              {/* Description Field */}
              <div className="col-span-4">
                <InputField
                  label="Description"
                  required={true}
                  textarea={true}
                  name="typeDescription"
                  placeholder="Enter description..."
                  value={typeDescription}
                  onChange={handleChangeInput}
                  error={errors.typeDescription}
                  minLength={10}
                  maxLength={255}
                />
              </div>

              {/* Document Upload Field */}
              <div className="col-span-4">
                <InputField
                    label={'Document'}
                    required={true}
                    type="file"
                    id="typeDocumentPath"
                    name="typeDocumentPath"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  {typeDocumentName && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: <span className="font-medium">{typeDocumentName}</span>
                    </p>
                  )}
                  {errors.typeDocumentPath && (
                    <p className="mt-1 text-sm text-red-600">{errors.typeDocumentPath}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: PDF, JPG, JPEG, PNG (Max 5MB)
                  </p>
              </div>

              {/* Action Buttons */}
              <div className="col-span-12">
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={typeId ? "Update" : null} />
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <ReusableDialog
          open={openSubmit}
          description={`Are you sure you want to ${typeId ? "update" : "submit"} this feedback type?`}
          onClose={() => setOpenSubmit(false)}
          onConfirm={handleSubmit}
        />
      </div>

      {/* ===================== Feedback Type List ===================== */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Feedback Type List
            </h2>
          </div>

          <div className="p-6">
            <ReusableDataTable
              data={feedbackTypes}
              columns={[
                {
                  name: "ID",
                  selector: (row) => row.typeId,
                  width: "80px",
                },
                {
                  name: "Code",
                  selector: (row) => row.typeCode,
                },
                {
                  name: "Name",
                  selector: (row) => row.typeName,
                },
                {
                  name: "Description",
                  selector: (row) => row.typeDescription,
                },
                {
                  name: "Document",
                  selector: (row) => row.typeDocumentName || "-",
                  sortable: false,
                },
                {
                  name: "Status",
                  selector: (row) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive
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
                        onClick={() => editFeedbackType(row)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded hover:bg-blue-500/30 transition-all"
                      >
                        Edit
                      </button>
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

export default FeedbackType;