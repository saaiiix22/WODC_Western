import React, { useEffect, useState } from 'react'
import SelectField from '../../components/common/SelectField';
import InputField from '../../components/common/InputField';
import { ResetBackBtn, SubmitBtn } from '../../components/common/CommonButtons';
import ReusableDialog from '../../components/common/ReusableDialog';
import { getCategoryListService, getSlotListService, saveAndUpdateMondatyGrievanceHearing } from '../../services/grievanceService';
import { encryptPayload } from '../../crypto.js/encryption';
import { toast } from 'react-toastify';
import { cleanContactNoUtil, cleanEmailUtil } from '../../utils/validationUtils';

const MondayVirtualGrievanceHearing = () => {
    const [formData, setFormData] = useState({
      grvHearigId: null,
      grvCtgId: "",
      grvSlotDate: null,
      grievanceSlot: null, 
      subjectLine:"",
      petitionerName:"",
      contactNo:"",
      email:"",
      identityProofPath:"",
      grievanceDocumentPath:"",
     
      address:"",
      grievanceInBrief:"",
  
    });
    const {
        grvHearigId,
        grvCtgId,
        grvSlotDate,
        grievanceSlot   ,
        subjectLine,
        petitionerName,
        contactNo,
        email,
        identityProofPath,
        grievanceDocumentPath,
        address,
        grievanceInBrief,
    
      } = formData;
      const [allSlotConfigs, setAllSlotConfigs] = useState([]);
      const [slotDateList, setSlotDateList] = useState([]);
      const [slotTimeList, setSlotTimeList] = useState([]);

      const [documents, setDocuments] = useState([{ file: null }]);
      const [categoryList, setCategoryList] = useState([]);
      const [errors, setErrors] = useState({});
      const [openSubmit, setOpenSubmit] = useState(false);
      const [expanded, setExpanded] = useState("panel2");

    
      const getGrievanceCategoryName = async () => {
        try {
          const res = await getCategoryListService();
          setCategoryList(res?.data?.data || []);
        } catch (error) {
          console.error(error);
        }
      };

      const getAllSlotConfigs = async () => {
        try {
          const res = await getSlotListService();
          setAllSlotConfigs(res?.data?.data || []);
        } catch (err) {
          console.error(err);
        }
      };
      


      const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
      
        setFormData((prev) => ({
          ...prev,
          grvCtgId: selectedCategoryId,
          grvSlotDate: "",
          // grievanceSlot   : "",
        }));
      
        setErrors((prev) => ({
          ...prev,
          grvCtgId: "",
          grvSlotDate: "",
        }));
      
        if (!selectedCategoryId || allSlotConfigs.length === 0) {
          setSlotDateList([]);
          setSlotTimeList([]);
          return;
        }
      
        // Filter only for the dropdown, do NOT overwrite allSlotConfigs
        const filteredSlots = allSlotConfigs.filter(
          (slot) => String(slot.grvCtgId) === String(selectedCategoryId)
        );
      
        const uniqueDates = [...new Set(filteredSlots.map((slot) => slot.grvConfigDate))];
      
        const uniqueDateObjects = uniqueDates.map((date) => ({
          value: date,
          label: date,
        }));
      
        setSlotDateList(uniqueDateObjects);
        setSlotTimeList([]);
      };
      
      
      // const handleCategoryChange = (e) => {
      //   debugger
      //   const selectedCategoryId = e.target.value;
      
      //   setFormData((prev) => ({
      //     ...prev,
      //     grvCtgId: selectedCategoryId,
      //     grvConfigDate: "",
      //   }));
      
      //   setErrors((prev) => ({
      //     ...prev,
      //     grvCtgId: "",
      //     grvSlotDate: "",
      //   }));
      
      //   if (!selectedCategoryId || allSlotConfigs.length === 0) {
      //     setSlotDateList([]);
      //     return;
      //   }
      
      //   const filteredSlots = allSlotConfigs.filter(
      //     (slot) =>
      //       String(slot.grvCtgId) === String(selectedCategoryId)
      //   );
        
      
      //   console.log("Filtered Slots 👉", filteredSlots);
      //   setSlotDateList(filteredSlots);
      // };
      
    

      const handleSlotDateChange = (e) => {
        const selectedDate = e.target.value;
      
        // Only filter the original full data
        const matchedSlots = allSlotConfigs.filter(
          (slot) => String(slot.grvCtgId) === String(grvCtgId) && slot.grvConfigDate === selectedDate
        );
      
        const mergedTimes = matchedSlots.flatMap((slot) => slot.slotTimes || []);
        const uniqueTimes = [...new Set(mergedTimes)];
      
        setSlotTimeList(uniqueTimes);
      
        setFormData((prev) => ({
          ...prev,
          grvSlotDate: selectedDate,
          // grievanceSlot   : "",
        }));
      };
      

      // const handleSlotDateChange = (e) => {
      //   const selectedDate = e.target.value;
      
      //   const selectedSlot = slotDateList.find(
      //     (d) => d.grvConfigDate === selectedDate
      //   );
      
      //   setSlotTimeList(selectedSlot?.slotTimes || []);
      
      //   setFormData((prev) => ({
      //     ...prev,
      //     grvSlotDate: selectedDate,
      //     grievanceSlot   : ""
      //   }));
      // };
      


      useEffect(() => {
        getGrievanceCategoryName();
        getAllSlotConfigs();
      }, []);
      


      // const handleCategoryChange = (e) => {
      //   const selectedCategoryId = e.target.value;
      
      //   setFormData((prev) => ({
      //     ...prev,
      //     grvCtgId: selectedCategoryId,
      //     grvSlotDate: ""
      //   }));
      
      //   setErrors((prev) => ({
      //     ...prev,
      //     grvCtgId: "",
      //     grvSlotDate: ""
      //   }));
      
      //   if (!selectedCategoryId || allSlotConfigs.length === 0) {
      //     setSlotDateList([]);
      //     return;
      //   }
      
      //   // ✅ CORRECT OBJECT PATH
      //   const filteredSlots = allSlotConfigs.filter((slot) =>
      //     String(
      //       slot?.grievanceSubCategory?.grievanceCategory?.grievanceCategoryId
      //     ) === String(selectedCategoryId) &&
      //     slot?.isActive === true
      //   );
      
      //   console.log("Filtered Slots 👉", filteredSlots);
      //   setSlotDateList(filteredSlots);
      // };
      
// Append For Grievance Related Document ----------------
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




  // useEffect(() => {
  //   getGrievanceCategoryName();
  // }, []);
  
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
   
    if (name === "contactNo") {
      updatedValue = cleanContactNoUtil(updatedValue);
    }
    if (name === "email") {
      updatedValue = cleanEmailUtil(updatedValue);
    }
    // CLEAR ERROR WHEN USER TYPES
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData({ ...formData, [name]: updatedValue });
  };

  // const handleChangeInput = (e) => {
  //   const { name, value } = e.target;
  //   setErrors((prev) => ({ ...prev, [name]: "" }));
  //   setFormData({ ...formData, [name]: value });
  // };

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
  
    if (!grvSlotDate) {
      newErrors.grvSlotDate = "Grievance Slot Date is required";
      setErrors(newErrors);
      return;
    }
  
    if (!grievanceSlot   ) {
      newErrors.grievanceSlot    = "Grievance Slot is required";
      setErrors(newErrors);
      return;
    }
  
    if (!subjectLine) {
      newErrors.subjectLine = "Subject is required";
      setErrors(newErrors);
      return;
    }
  
    if (!petitionerName) {
      newErrors.petitionerName = "Petitioner Name is required";
      setErrors(newErrors);
      return;
    }
    
    if (!contactNo) {
        newErrors.contactNo = "Contact No is required";
        setErrors(newErrors);
        return;
      }

      if (!email) {
        newErrors.email = "Email id is required";
        setErrors(newErrors);
        return;
      }

      if (!identityProofPath) {
        newErrors.identityProofPath = "identityProofPath  is required";
        setErrors(newErrors);
        return;
      }

      if (!grievanceDocumentPath) {
        newErrors.grievanceDocumentPath = "grv Rlt Doc  is required";
        setErrors(newErrors);
        return;
      }

     
    if (!address) {
      newErrors.address = " Address is required";
      setErrors(newErrors);
      return;
    }

    if (!grievanceInBrief) {
      newErrors.grievanceInBrief = " Grievance in Brief is required";
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setOpenSubmit(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setOpenSubmit(false);
      setExpanded("panel2");
  
      // 🔐 Encrypt ONLY JSON data (exclude files)
      const jsonPayload = {
        grvHearigId,
        grvCtgId,
        grvSlotDate,
        grievanceSlot   ,
        subjectLine,
        petitionerName,
        contactNo,
        email,
        address,
        grievanceInBrief,
      };
  
      const cipherText = encryptPayload(jsonPayload);
  
      // 📦 Multipart FormData
      const formDataObj = new FormData();
      formDataObj.append("cipherText", cipherText);
      formDataObj.append("identityProof", identityProofPath);
      formDataObj.append("grievanceDocument", grievanceDocumentPath);
  
      const res = await saveAndUpdateMondatyGrievanceHearing(formDataObj);
  
      if (res?.status === 200 && res?.data?.outcome) {
        toast.success(res.data.message);
        setFormData({
          grvHearigId: null,
          grvCtgId: "",
          grvSlotDate: null,
          grievanceSlot   : "",
          subjectLine: "",
          petitionerName: "",
          contactNo: "",
          email: "",
          identityProofPath: "",
          grievanceDocumentPath: "",
          address: "",
          grievanceInBrief: "",
        });
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmitConfirmModal}>
        <div className="mt-3 bg-white rounded-md border border-[#f1f1f1] shadow-md">
          {/* Header */}
          <h3 className="text-white text-[18px] px-4 py-2 bg-light-dark border-b-2 border-[#ff9800] rounded-t-md">
             Virtual Grievance Hearing
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
              {/* <SelectField
                label="Grievance Slot Date"
                required
                name="grvSlotDate"
                value={grvSlotDate || ""}
                onChange={handleSlotDateChange}
                options={slotDateList.map((d) => ({
                  value: d.grvConfigDate,
                  label: d.grvConfigDate,
                }))}
                error={errors.grvSlotDate}
                placeholder={grvCtgId ? "Select Slot Date" : "Select Category First"}
                disabled={!grvCtgId}  
              /> */}
                <SelectField
                  label="Grievance Slot Date"
                  required
                  name="grvSlotDate"
                  value={grvSlotDate || ""}
                  onChange={handleSlotDateChange}
                  options={slotDateList} // now already unique
                  error={errors.grvSlotDate}
                  placeholder={grvCtgId ? "Select Slot Date" : "Select Category First"}
                  disabled={!grvCtgId}  
                />
              </div>

{/* 
              <div className="col-span-2">
              <SelectField
                label="Grievance Slot Time"
                required
                name="grievanceSlot   "
                value={grievanceSlot    || ""}
                onChange={handleChangeInput}
                options={slotDateList.map((d) => ({
                  value: d.grievanceSlot   ,
                  label: d.grievanceSlot   ,
                }))}
                error={errors.grievanceSlot   }
                placeholder={grvSlotDate ? "Select Slot Time" : "Select Date"}
                disabled={!grvSlotDate}  
              />

              </div> */}



              <div className="col-span-2">
              <SelectField
                label="Grievance Slot Time"
                name="grievanceSlot"
                required
                value={grievanceSlot || ""}
                onChange={handleChangeInput}
                options={slotTimeList.map((slot) => ({
                  label: `${slot.fromTime} - ${slot.toTime}`,
                  value: slot.virtualGrvSlotDtlsId,
                }))}
                placeholder={grvSlotDate ? "Select Slot Time" : "Select Date First"}
                disabled={!grvSlotDate}
              />


              </div>

              <div className="col-span-2">
              <InputField
                  label="Subject Line"
                  required={true}
                  textarea={true}
                  name="subjectLine"
                  maxLength={255}
                   value={subjectLine}
                   error={errors.subjectLine}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-2">
              <InputField
                  label="Petitioner Name"
                  required={true}
                  textarea={true}
                  name="petitionerName"
                  maxLength={255}
                   value={petitionerName}
                   error={errors.petitionerName}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-2" >
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
              
                  label="Email Id "
                  required={true}
                  textarea={true}
                  name="email"
                  maxLength={255}
                   value={email}
                   error={errors.email}
                  onChange={handleChangeInput}
                />
              </div>

             <div className="col-span-3">
                <InputField
                    type="file"
                    required={true}
                    label="Identity Proof"
                    name="identityProofPath"
                    error={errors.identityProofPath}
                    onChange={(e) => {
                    setFormData({ ...formData, identityProofPath: e.target.files[0] });
                    setErrors((prev) => ({ ...prev, identityProofPath: "" }));
                    }}
                />
                </div>

                <div className="col-span-3">
                <InputField
                    type="file"
                    required={true}
                    label="Grievance Related Document"
                    name="grievanceDocumentPath"
                    error={errors.grievanceDocumentPath}
                    onChange={(e) => {
                    setFormData({ ...formData, grievanceDocumentPath: e.target.files[0] });
                    setErrors((prev) => ({ ...prev, grievanceDocumentPath: "" }));
                    }}
                />
                </div>

     

              <div className="col-span-2">
              <InputField
                  label=" Address"
                  required={true}
                  textarea={true}
                  name="address"
                  maxLength={255}
                   value={address}
                   error={errors.address}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-2">
              <InputField
                  label=" Grievance In Brief"
                  required={true}
                  textarea={true}
                  name="grievanceInBrief"
                  maxLength={255}
                   value={grievanceInBrief}
                   error={errors.grievanceInBrief}
                  onChange={handleChangeInput}
                />
              </div>


              {/* Textarea */}
              {/* <div className="col-span-4">
                <label className="block text-sm font-medium mb-1">
                  Purpose
                </label>
                { required={true}
                  textarea={true}
                  name="purpose"
                  maxLength={255}
                   value={purpose}
                   error={errors.purpose}
                  onChange={handleChangeInput} }
                <textarea
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows={3}
                  placeholder="Describe the grievance purpose..."
                />
              </div> */}

              {/* appending grievance related document  */}

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
export default MondayVirtualGrievanceHearing;
