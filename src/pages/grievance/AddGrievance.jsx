import React, { useEffect, useState } from "react";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { getCategoryListService, getSubCategoryListService } from "../../services/grievanceService";
import ReusableDialog from "../../components/common/ReusableDialog";

const AddGrievance = () => {
  const [formData, setFormData] = useState({
    virtualGrvSlotId: null,
    grvCtgId: null,
    grvSubCtgId: null,
    grvMode:"",
    forwardTo:"",
    complainantName:"",
    compAdd:"",
    contactNo:"",
    emailId:"",
    idenProf:"",
    purpose:"",
    grvRltDoc:"",

  });
  const {
    virtualGrvSlotId,
    grvCtgId,
    grvSubCtgId,
    grvMode,
    forwardTo,
    complainantName,
    compAdd,
    contactNo,
    emailId,
    idenProf,
    purpose,
    grvRltDoc,

  } = formData;

  const [documents, setDocuments] = useState([{ file: null }]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);


  const getGrievanceCategoryName = async () => {
    try {
      const res = await getCategoryListService();
      setCategoryList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getGrievanceSubCategoryName = async () => {
    try {
      const res = await getSubCategoryListService();
      setAllSubCategories(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
-    setFormData((prev) => ({
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
  



  const addDocument = () => {
    setDocuments((prev) =>
      Array.isArray(prev) ? [...prev, { file: null }] : [{ file: null }]
    );
  };

  const removeDocument = (index) => {
    setDocuments((prev) =>
      Array.isArray(prev)
        ? prev.filter((_, i) => i !== index)
        : [{ file: null }]
    );
  };


  useEffect(() => {
    getGrievanceCategoryName();
    getGrievanceSubCategoryName();
  }, []);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (index, file) => {
    setDocuments((prev) => {
      if (!Array.isArray(prev)) return [{ file }];
      const updated = [...prev];
      updated[index] = { file };
      return updated;
    });
  };


  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};
  
    if (!grvCtgId) {
      newErrors.grvCtgId = "Grievance Category is required";
      setErrors(newErrors);
      return; 
    }
  
    if (!grvSubCtgId) {
      newErrors.grvSubCtgId = "Grievance Sub Category is required";
      setErrors(newErrors);
      return;
    }
  

  
    if (!contactNo) {
      newErrors.contactNo = "Contact No is required";
      setErrors(newErrors);
      return;
    }
  
    if (!emailId) {
      newErrors.emailId = "Email id is required";
      setErrors(newErrors);
      return;
    }
      
    if (!idenProf) {
      newErrors.idenProf = "Identityis required";
      setErrors(newErrors);
      return;
    }
   
   
   if (!purpose) {
      newErrors.purpose = "purpose is required";
      setErrors(newErrors);
      return;
    }


    
    
    setErrors({});
    setOpenSubmit(true);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      virtualGrvSlotId: null,
      grvCtgId: null,
      grvSubCtgId: null,
      grvMode:"",
      forwardTo:"",
      complainantName:"",
      compAdd:"",
      contactNo:"",
      emailId:"",
      idenProf:"",
      purpose:"",
      grvRltDoc:"",
 
    };
    try {
      setOpenSubmit(false);
      setExpanded("panel2");
      const payload = encryptPayload(sendData);
      const res = await saveMilesStoneService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setFormData({
          virtualGrvSlotId: null,
          grvCtgId: null,
          grvSubCtgId: null,
          grvMode:"",
          forwardTo:"",
          complainantName:"",
          compAdd:"",
          contactNo:"",
          emailId:"",
          idenProf:"",
          purpose:"",
          grvRltDoc:"",
        });
        setExpanded("panel2");
        getMilesStoneTable();
      } else {
        toast.error(res?.data.message);
        setFormData({
          virtualGrvSlotId: null,
          grvCtgId: null,
          grvSubCtgId: null,
          grvMode:"",
          forwardTo:"",
          complainantName:"",
          compAdd:"",
          contactNo:"",
          emailId:"",
          idenProf:"",
          purpose:"",
          grvRltDoc:"",
        });
      }
    } catch (error) {
      throw error;
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmitConfirmModal}>
        <div className="mt-3 bg-white rounded-md border border-[#f1f1f1] shadow-md">
          {/* Header */}
          <h3 className="text-white text-[18px] px-4 py-2 bg-light-dark border-b-2 border-[#ff9800] rounded-t-md">
            Add Grievance
          </h3>

          {/* Body */}
          <div className="py-6 px-5 text-[#444]">
            <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
                <SelectField
                  label="Grievance Category"
                  required
                  name="grvCtgId"
                  value={grvCtgId}
                  onChange={handleCategoryChange}
                  options={categoryList.map((d) => ({
                    value: d.grievanceCategoryId,
                    label: d.grievanceCategoryName,
                  }))}
                    error={errors.grvCtgId}
                  placeholder="Select"
                />
              </div>
              <div className="col-span-2">
              <SelectField
                label="Grievance Sub Category"
                required
                name="grvSubCtgId"
                value={grvSubCtgId || ""}
                onChange={handleChangeInput}
                options={subCategoryList.map((d) => ({
                  value: d.grvSubCtgId,
                  label: d.grvSubCtgName,
                }))}
                 error={errors.grvSubCtgId}
                placeholder={grvCtgId ? "Select Sub Category" : "Select"}
                disabled={!grvCtgId}  
              />
              </div>
              {/* <div className="col-span-3">
                <InputField
                  label="Grievance Category Code"
                  required
                  name="categoryCode"
                  placeholder="TEST_CODE"
                  maxLength={100}
                />
              </div> */}

              {/* <div className="col-span-2">
                <SelectField
                  label="Grievance Mode"
                  required
                
                  name="grvMode"
                  placeholder="Select"
                  error={errors.grvMode}
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Forward To"
                  required
                  name="forwardTo"
                  placeholder="Select"
                  error={errors.forwardTo}
                />
              </div>

              <div className="col-span-4">
              <InputField
                  label="Complainant Name"
                  required={true}
                  textarea={true}
                  name="complainantName"
                  maxLength={255}
                   value={complainantName}
                   error={errors.complainantName}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-3">
              <InputField
                  label="Complainant Address"
                  required={true}
                  textarea={true}
                  name="compAdd"
                  maxLength={255}
                   value={compAdd}
                   error={errors.compAdd}
                  onChange={handleChangeInput}
                />
              </div> */}

              <div className="col-span-2">
              <InputField
                  label="Contact No"
                  required={true}
                  textarea={true}
                  name="contactNo"
                  maxLength={255}
                   value={contactNo}
                   error={errors.contactNo}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-2">
              <InputField
                  label="Email "
                  required={true}
                  textarea={true}
                  name="emailId"
                  maxLength={255}
                   value={emailId}
                   error={errors.emailId}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  type="file"
                  label="Identity Proof"
                  required
                  error={errors.idenProf}
                />
              </div>


              {/* Textarea */}
              <div className="col-span-4">
                <label className="block text-sm font-medium mb-1">
               Remarks
                </label>
                {/* required={true}
                  textarea={true}
                  name="purpose"
                  maxLength={255}
                   value={purpose}
                   error={errors.purpose}
                  onChange={handleChangeInput} */}
                <textarea
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows={3}
                  placeholder="Describe the grievance purpose..."
                />

              </div>

              {/* appending grievance related document  */}

              <div className="col-span-3">
                <label className="block text-sm font-medium mb-2">
                  Grievance Related Document:
                </label>

                <div className="flex flex-col gap-2">
                  {Array.isArray(documents) &&
                    documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <InputField
                          type="file"
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                        />

                        {/* {index === 0 ? (
                          <button
                            type="button"
                            onClick={addDocument}
                            className="h-8 w-8 bg-green-600 text-white rounded"
                          >
                            +
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="h-8 w-8 bg-red-600 text-white rounded"
                          > 
                            -
                          </button>
                        )} */}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-3 bg-[#42001d0f] border-t px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn type="submit" />
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
