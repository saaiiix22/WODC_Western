import React, { useEffect, useState } from "react";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import {
  getCategoryListService,
  getSubCategoryListService,
  saveGrievanceService,
} from "../../services/grievanceService";
import ReusableDialog from "../../components/common/ReusableDialog";
import { toast } from "react-toastify";
import { encryptPayload } from "../../crypto.js/encryption";
import { cleanContactNoUtil, cleanEmailUtil } from "../../utils/validationUtils";
import { useLocation } from "react-router-dom";
import { forwardListByMenuService } from "../../services/workflowService";
import { GrSave } from "react-icons/gr";

/* ================= INITIAL STATE ================= */
const initialFormState = {
  addGrievanceId: null,
  grvCtgId: "",
  grvSubCtgId: "",
  contactNo: "",
  email: "",
  idProofPath: "",
  purpose: "",
  petitionerName:"",
  grvRelatedDocPath: "",
};

const AddGrievance = () => {
  const location = useLocation()
  console.log("VIEW STATE FULL DATA:", location?.state);
  console.log("ID BASE64:", location?.state?.idProofDocPathStr);
  console.log("GRV BASE64:", location?.state?.grvRelatedDocPathStr);
    const [formData, setFormData] = useState(initialFormState);
  const {
    addGrievanceId,
    grvCtgId,
    grvSubCtgId,
    contactNo,
    email,
    idProofPath,
    petitionerName,
    purpose,
    grvRelatedDocPath,
  } = formData;
const [idProofPreview, setIdProofPreview] = useState(null);
const [grvDocPreview, setGrvDocPreview] = useState(null);

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);
  const [fileKey, setFileKey] = useState(Date.now()); // 👈 FILE RESET KEY
//for  dynamic buttons-----

const [forwardedId, setForwardedId] = useState(null)
const [button, setButtons] = useState([])
const [stageForwardedRuleStatus, setStageForwardedRuleStatus] = useState('')


const getWorkFlow = async () => {
  try {
    const payload = encryptPayload({
      appModuleUrl: location.pathname,
      forwardedId: (forwardedId ? Number(forwardedId) : null)
    })
    const res = await forwardListByMenuService(payload)

    if (res?.status === 200 && res?.data.outcome) {
      const filteredButtons = res?.data.data.filter(button =>
        button.actionType.actionCode !== stageForwardedRuleStatus
      )

      setButtons(filteredButtons)
    } else {
      setButtons([])
    }
  } catch (error) {
    console.log(error)
    setButtons([])
  }
}

useEffect(() => {
  getWorkFlow()
}, [forwardedId])

  /* ================= API CALLS ================= */
  useEffect(() => {
    getCategoryListService().then((res) =>
      setCategoryList(res?.data?.data || [])
    );
    getSubCategoryListService().then((res) =>
      setAllSubCategories(res?.data?.data || [])
    );
  }, []);
  const [zoomImage, setZoomImage] = useState(null);

  const handleChangeInput = (e) => {
    if (isViewMode) return; 
    const { name, value } = e.target;
    let updatedValue = value;
    
   
    if (name === "contactNo") {
      updatedValue = cleanContactNoUtil(updatedValue);
    }
    if (name === "email") {
      updatedValue = cleanEmailUtil(updatedValue);
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData({ ...formData, [name]: updatedValue });
  };
  const handleCategoryChange = (e) => {
    if (isViewMode) return; 
    const selectedCategoryId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      grvCtgId: selectedCategoryId,
      grvSubCtgId: "",
    }));

    setErrors((prev) => ({ ...prev, grvCtgId: "", grvSubCtgId: "" }));

    const filteredSubs = allSubCategories.filter(
      (sub) => String(sub.grvCtgId) === String(selectedCategoryId)
    );
    setSubCategoryList(filteredSubs);
  };

  /* ================= RESET (KEY PART) ================= */
  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setSubCategoryList([]);
    setFileKey(Date.now()); // 👈 clears file inputs
  };

  /* ================= VALIDATION ================= */
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
  
    if (!grvCtgId) {
      setErrors({ grvCtgId: "Grievance Category is required" });
      return;
    }
  
    if (!grvSubCtgId) {
      setErrors({ grvSubCtgId: "Grievance Sub Category is required" });
      return;
    }
    if (!petitionerName) {
      setErrors({ petitionerName: "Name is required" });
      return;
    }
  
    if (!contactNo) {
      setErrors({ contactNo: "Contact No is required" });
      return;
    }
  
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
  
    if (!idProofPath) {
      setErrors({ idProofPath: "Identity Proof is required" });
      return;
    }
    if (!grvRelatedDocPath) {
      setErrors({ grvRelatedDocPath: "Grv Rlt Doc is required" });
      return;
    }
  
    if (!purpose) {
      setErrors({ purpose: "Purpose is required" });
      return;
    }
  
    setErrors({});
    setOpenSubmit(true);
  };
  
  const isViewMode = !!addGrievanceId;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setOpenSubmit(false);

      const payload = {
        addGrievanceId,
        grievanceCategory: grvCtgId,
        grievanceSubCategory: grvSubCtgId,
        contactNo,
        petitionerName,
        email: email,
        purpose,
      };

      const formDataObj = new FormData();
      formDataObj.append("cipherText", encryptPayload(payload));
      formDataObj.append("idProofDoc", idProofPath);
      formDataObj.append("grvRelatedDoc", grvRelatedDocPath);

      const res = await saveGrievanceService(formDataObj);

      if (res?.status === 200 && res?.data?.outcome) {
        toast.success(res.data.message);
        resetForm(); 
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    }
  };

  //------for View Purpose
  useEffect(() => {
    if (location.state) {
      setFormData({
        addGrievanceId: location.state.addGrievanceId,
        grvCtgId: location.state.grievanceCategory,     
        grvSubCtgId: location.state.grievanceSubCategory, 
        contactNo: location.state.contactNo,
        email: location.state.email,
        purpose: location.state.purpose || "",
        petitionerName: location.state.petitionerName,
        idProofPath: "",
        grvRelatedDocPath: "",
      });

      setIdProofPreview(location.state.idProofDocPathStr);
    setGrvDocPreview(location.state.grvRelatedDocPathStr);
    }
  }, [location.state]);
  useEffect(() => {
    if (grvCtgId && allSubCategories.length > 0) {
      const filteredSubs = allSubCategories.filter(
        (sub) => String(sub.grvCtgId) === String(grvCtgId)
      );
      setSubCategoryList(filteredSubs);
    }
  }, [grvCtgId, allSubCategories]);
    
  
  /* ================= JSX ================= */
  return (
    <div>
      <form onSubmit={handleSubmitConfirmModal}>
        <div className="mt-3 bg-white rounded-md border shadow-md">
          <h3 className="text-white px-4 py-2 bg-light-dark rounded-t-md">
          {isViewMode ? "View Grievance " : "Add  Grievance "}    
                </h3>          

          <div className="py-6 px-5 grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <SelectField
                label="Grievance Category"
                required
                value={grvCtgId}
              
                onChange={handleCategoryChange}
                options={categoryList.map((d) => ({
                  value: d.grievanceCategoryId,
                  label: d.grievanceCategoryName,
                }))}
                error={errors.grvCtgId}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Grievance Sub Category"
                required
                name="grvSubCtgId"               
                value={grvSubCtgId}
                onChange={handleChangeInput}
                options={subCategoryList.map((d) => ({
                  value: d.grvSubCtgId,
                  label: d.grvSubCtgName,
                }))}
                disabled={!grvCtgId}
                error={errors.grvSubCtgId}
              />
            </div>


                            
            <div className="col-span-2">
              <InputField
                  label="Petitioner Name"
                  required={true}
                  name="petitionerName"
                  maxLength={255}
                   value={petitionerName}
                   error={errors.petitionerName}
                  onChange={handleChangeInput}
                />
              </div>

            <div className="col-span-2">
              <InputField
                label="Contact No"
                required
                name="contactNo"
                value={contactNo}
                onChange={handleChangeInput}
                error={errors.contactNo}
               
              />
            </div>

            <div className="col-span-4">
              <InputField
                label="Email"
                type='email'
                required
                name="email"
                value={email}
                onChange={handleChangeInput}
                error={errors.email}
               
              />
            </div>

            {!isViewMode && (
            <div className="col-span-3">
              <InputField
                key={fileKey}
                type="file"
                required={true}
                label="Identity Proof"
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    idProofPath: e.target.files[0],
                  }))
                }
                error={errors.idProofPath}
              />
            </div>)}

            {!isViewMode && (
            <div className="col-span-3">
              <InputField
                key={fileKey + 1}
                required={true}
                type="file"
                label="Grievance Related Document"
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    grvRelatedDocPath: e.target.files[0],
                  }))
                }
                error={errors.grvRelatedDocPath}

              />
            </div>)}

            {isViewMode && idProofPreview && (
  <div className="col-span-3">
    <label className="block text-sm mb-1">Identity Proof</label>
    <img
      src={`data:image/*;base64,${idProofPreview}`}
      alt="ID Proof"
      onClick={() => setZoomImage(`data:image/*;base64,${idProofPreview}`)}
      className="h-20 w-20 object-cover rounded-lg border shadow"
    />
  </div>
)}

{isViewMode && grvDocPreview && (
  <div className="col-span-3">
    <label className="block text-sm mb-1">Grievance Related Document</label>
    <img
      src={`data:image/*;base64,${grvDocPreview}`}
      alt="Grievance Doc"
      onClick={() => setZoomImage(`data:image/*;base64,${grvDocPreview}`)}
      className="h-20 w-45 object-cover rounded-lg border shadow"
    />
    {zoomImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setZoomImage(null)}
  >
    <img
      src={zoomImage}
      alt="Zoomed"
      className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
    />
  </div>
)}

  </div>
)}


            <div className="col-span-4">
                <label className="block text-sm font-small mb-1">
                  Grievance In Brief<span className="text-red-500">*</span>
                </label>

                <textarea
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows={3}
                  name="purpose"
                  value={purpose}
                  onChange={handleChangeInput}
                  placeholder="Describe the grievance purpose..."
                />

                {errors?.purpose && (
                  <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
                )}
              </div>

          
          </div>

          <div className="flex justify-center gap-3 border-t px-4 py-3">
            <ResetBackBtn onClick={resetForm} />
            {
                  button?.map((i, index) => {
                    return (
                      <button
                        type={'button'}
                        key={index}
                        className={i?.actionType.color}
                        onClick={() => {
                          if (
                            i?.actionType.actionCode === "REVERTED" ||
                            i?.actionType.actionCode === "REJECTED"
                          ) {
                            setPendingAction(i);
                            setRejectionModal(true);
                          } else {
                            setForwardedId(i.forwardedId);
                            setOpenSubmit(true);
                          }
                        }}
                      >

                        <GrSave /> {i?.actionType.actionNameEn}
                      </button>
                    )
                  })
                }
            {!isViewMode && <SubmitBtn type="submit" />}
          </div>
        </div>
      </form>
 
      <ReusableDialog
        open={openSubmit}
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default AddGrievance;
