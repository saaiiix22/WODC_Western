import React, { useEffect, useState } from 'react'
import SelectField from '../../components/common/SelectField';
import InputField from '../../components/common/InputField';
import { ResetBackBtn, SubmitBtn } from '../../components/common/CommonButtons';
import ReusableDialog from '../../components/common/ReusableDialog';
import { getCategoryListService, getCategoryListVirtualService, getSlotListService, saveAndUpdateMondatyGrievanceHearing } from '../../services/grievanceService';
import { encryptPayload } from '../../crypto.js/encryption';
import { toast } from 'react-toastify';
import { cleanContactNoUtil, cleanEmailUtil } from '../../utils/validationUtils';
import { useLocation } from 'react-router-dom';

const MondayVirtualGrievanceHearing = () => {
  const location = useLocation()
  console.log(location?.state);
    const [formData, setFormData] = useState({
      grvHearigId: null,
      grvCtgId: "",
      grvSlotDateId: null,
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
        grvSlotDateId,
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

      const [zoomLevel, setZoomLevel] = useState(1); // current zoom
      const [position, setPosition] = useState({ x: 0, y: 0 }); // for drag
      const [dragging, setDragging] = useState(false);
      const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
      


      const [allSlotConfigs, setAllSlotConfigs] = useState([]);
      const [slotDateList, setSlotDateList] = useState([]);
      const [slotTimeList, setSlotTimeList] = useState([]);

      const [documents, setDocuments] = useState([{ file: null }]);
      const [categoryList, setCategoryList] = useState([]);
      const [errors, setErrors] = useState({});
      const [openSubmit, setOpenSubmit] = useState(false);
      const [expanded, setExpanded] = useState("panel2");

      const [zoomImage, setZoomImage] = useState(null);

      const getGrievanceCategoryName = async () => {
        try {
          const res = await getCategoryListVirtualService();
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
      
      const isViewMode = !!grvHearigId;

       const handleCategoryChange = (e) => {
        if (isViewMode) return; 
        const selectedCategoryId = e.target.value;
      
        setFormData((prev) => ({
          ...prev,
          grvCtgId: selectedCategoryId,
          grvSlotDateId: null,
          grievanceSlot: null,
        }));
      
        setSlotDateList([]);
        setSlotTimeList([]);
      
        if (!selectedCategoryId || allSlotConfigs.length === 0) return;
      
        const filteredSlots = allSlotConfigs.filter(
          (slot) => String(slot.grvCtgId) === String(selectedCategoryId)
        );
      
        const uniqueDateMap = new Map();     
        filteredSlots.forEach((slot) => {
          if (!uniqueDateMap.has(slot.grvConfigDate)) {
            uniqueDateMap.set(slot.grvConfigDate, {
              value: slot.virtualGrvSlotId, // representative ID
              label: slot.grvConfigDate,
            });
          }
        });
      
        setSlotDateList(Array.from(uniqueDateMap.values()));
      };
      

      const handleSlotDateChange = (e) => {
        debugger
        const selectedSlotDateId = e.target.value;

        const matchedSlots = allSlotConfigs.filter(
          (slot) =>
            String(slot.grvCtgId) === String(grvCtgId) &&
            String(slot.virtualGrvSlotId) === String(selectedSlotDateId)
        );
        
        setSlotTimeList(
          matchedSlots.flatMap(slot => slot.slotTimes || [])
        );
        
        setFormData(prev => ({
          ...prev,
          grvSlotDateId: selectedSlotDateId, 
          grievanceSlot: null
        }));
        
      };
      
      useEffect(() => {
        getGrievanceCategoryName();
        getAllSlotConfigs();
      }, []);
      
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
  
    if (!grvSlotDateId) {
      newErrors.grvSlotDateId = "Grievance Slot Date is required";
      setErrors(newErrors);
      return;
    }
  
    if (!grievanceSlot) {
      newErrors.grievanceSlot = "Grievance Slot is required";
      setErrors(newErrors);
      return;
    }
    if (!petitionerName) {
      newErrors.petitionerName = "Petitioner Name is required";
      setErrors(newErrors);
      return;
    }
    if (!subjectLine) {
      newErrors.subjectLine = "Subject is required";
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
  
      const jsonPayload = {
        grvHearigId,
        grvCtgId,
        grvSlotDateId,
        grievanceSlot   ,
        subjectLine,
        petitionerName,
        contactNo,
        email,
        address,
        grievanceInBrief,
      };
  
      const cipherText = encryptPayload(jsonPayload);
  
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
          grvSlotDateId: null,
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



  const [identityPreview, setIdentityPreview] = useState(null);
const [grievancePreview, setGrievancePreview] = useState(null);

// During view Cases------------------
  useEffect(() => {
    if (location.state) {
      setFormData({
        ...location.state,
        grvCtgId:location?.state.grvCategoryId,
        grvSlotDateId: location?.state.grvSlotDateId,
        grievanceSlot: location?.state.grievanceSlot,
      });
      
    setIdentityPreview(location.state.identityProofPathStr);
    setGrievancePreview(location.state.grievanceDocumentPathStr);
    }
  }, [location.state]);
  
useEffect(() => {
  if (!grvCtgId || allSlotConfigs.length === 0) return;

  const filteredSlots = allSlotConfigs.filter(
    (slot) => String(slot.grvCtgId) === String(grvCtgId)
  );

  const uniqueDateMap = new Map();

  filteredSlots.forEach((slot) => {
    if (!uniqueDateMap.has(slot.grvConfigDate)) {
      uniqueDateMap.set(slot.grvConfigDate, {
        value: slot.virtualGrvSlotId,
        label: slot.grvConfigDate,
      });
    }
  });

  setSlotDateList(Array.from(uniqueDateMap.values()));
}, [grvCtgId, allSlotConfigs]);
useEffect(() => {
  if (!grvCtgId || !grvSlotDateId || allSlotConfigs.length === 0) return;

  const matchedSlots = allSlotConfigs.filter(
    (slot) =>
      String(slot.grvCtgId) === String(grvCtgId) &&
      String(slot.virtualGrvSlotId) === String(grvSlotDateId)
  );

  setSlotTimeList(
    matchedSlots.flatMap((slot) => slot.slotTimes || [])
  );
}, [grvCtgId, grvSlotDateId, allSlotConfigs]);
//--------------
  
  return (
    <div>
      <form onSubmit={handleSubmitConfirmModal}>
        <div className="mt-3 bg-white rounded-md border border-[#f1f1f1] shadow-md">
          {/* Header */}
          <h3 className="text-white text-[18px] px-4 py-2 bg-light-dark border-b-2 border-[#ff9800] rounded-t-md">
          {isViewMode ? "View Monday Grievance Hearing List" : "Add  Virtual Grievance Hearing"}    
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
                    label="Grievance Slot Date"
                    required
                    name="grvSlotDateId"
                    value={grvSlotDateId || ""}
                    onChange={handleSlotDateChange}
                    options={slotDateList}
                    error={errors.grvSlotDateId}
                    placeholder={grvCtgId ? "Select Slot Date" : "Select Category First"}
                    disabled={isViewMode || !grvCtgId}
                  />
                </div>
                             
             <div className="col-span-2">
               <SelectField
                  label="Grievance Slot Time"
                  name="grievanceSlot"
                  required
                  error={errors.grievanceSlot}
                  value={grievanceSlot || ""}
                  onChange={handleChangeInput}
                  options={slotTimeList.map((slot) => ({
                  label: `${slot.fromTime} - ${slot.toTime}`,
                  value: slot.virtualGrvSlotDtlsId,

                }))}
                placeholder={grvSlotDateId ? "Select Slot Time" : "Select Date First"}
                 disabled={isViewMode ||!grvSlotDateId}
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
                  label="Subject Line"
                  required={true}
                  name="subjectLine"
                  maxLength={255}
                   value={subjectLine}
                   error={errors.subjectLine}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-2" >
              <InputField 
                  label="Contact No"
                  required={true}
                  name="contactNo"
                  maxLength={255}
                   value={contactNo}
                   error={errors.contactNo}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-3">
              <InputField
                  label="Email Id "
                  required={true}
                  type='email'
                  name="email"
                  maxLength={255}
                   value={email}
                   error={errors.email}
                  onChange={handleChangeInput}
                />
              </div>

             {!isViewMode && (
              <div className="col-span-3">
                <InputField
                  type="file"
                  required
                  label="Identity Proof"
                  name="identityProofPath"
                  error={errors.identityProofPath}
                  onChange={(e) => {
                    setFormData({ ...formData, identityProofPath: e.target.files[0] });
                    setErrors((prev) => ({ ...prev, identityProofPath: "" }));
                  }}
                />
              </div>
            )}

            {!isViewMode && (
              <div className="col-span-3">
                <InputField
                  type="file"
                  required
                  label="Grievance Related Document"
                  name="grievanceDocumentPath"
                  error={errors.grievanceDocumentPath}
                  onChange={(e) => {
                    setFormData({ ...formData, grievanceDocumentPath: e.target.files[0] });
                    setErrors((prev) => ({ ...prev, grievanceDocumentPath: "" }));
                  }}
                />
              </div>
            )}
            
            {isViewMode && identityPreview && (
  <div className="col-span-3">
    <label className="block text-sm mb-1">Identity Proof</label>
    <img
      src={`data:image/*;base64,${identityPreview}`}
      alt="Identity"
      onClick={() =>
        setZoomImage(`data:image/*;base64,${identityPreview}`)
      }
      className="h-28 w-68 object-cover rounded border"
    />
  </div>
)}

{isViewMode && grievancePreview && (
  <div className="col-span-3">
    <label className="block text-sm mb-1">Grievance Document</label>
    <img
      src={`data:image/*;base64,${grievancePreview}`}
      alt="Grievance"
      onClick={() =>
        setZoomImage(`data:image/*;base64,${grievancePreview}`)
      }
      className="h-28 w-68 object-cover rounded border"
    />
{zoomImage && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
    onClick={() => {
      setZoomImage(null);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }}
  >
    <img
      src={zoomImage}
      alt="Zoomed"
      style={{
        transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
        transition: dragging ? "none" : "transform 0.2s ease",
        cursor: zoomLevel > 1 ? "grab" : "zoom-in",
        maxHeight: "90vh",
        maxWidth: "90vw",
      }}
      onClick={(e) => {
        e.stopPropagation(); // prevent closing overlay
        setZoomLevel((prev) => Math.min(prev + 0.5, 5)); // zoom in per click
      }}
      onMouseDown={(e) => {
        if (zoomLevel <= 1) return;
        e.preventDefault();
        setDragging(true);
        setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
      }}
      onMouseMove={(e) => {
        if (!dragging) return;
        setPosition({ x: e.clientX - startDrag.x, y: e.clientY - startDrag.y });
      }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onWheel={(e) => {
        e.preventDefault();
        setZoomLevel((prev) => Math.min(Math.max(prev - e.deltaY * 0.001, 1), 5));
      }}
    />
    {/* Zoom Out Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setZoomLevel((prev) => Math.max(prev - 0.5, 1));
      }}
      className="absolute top-5 right-5 bg-white px-3 py-1 rounded shadow"
    >
      -
    </button>
  </div>
)}

  </div>
)}

              <div className="col-span-3">
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

             <div className="col-span-4">
                   <label className="block text-sm font-small mb-1">
                        Grievance In Brief <span className="text-red-500">*</span>
                   </label>
                <textarea
                     className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                     rows={3}
                     name="grievanceInBrief"
                     value={grievanceInBrief}
                     onChange={handleChangeInput}
                     placeholder="Describe the grievance in Brief..."
                />
                {errors?.grievanceInBrief && (
                  <p className="text-red-500 text-xs mt-1">{errors.grievanceInBrief}</p>
                )}
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-3 bg-[#42001d0f] border-t px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            {!isViewMode && <SubmitBtn type="submit" />}
          </div>
        </div>
      </form>
      
      {!isViewMode && (
  <ReusableDialog
    open={openSubmit}
    description="Are you sure you want submit?"
    onClose={() => setOpenSubmit(false)}
    onConfirm={handleSubmit}
  />
)}

    </div>
  );
};
export default MondayVirtualGrievanceHearing;
