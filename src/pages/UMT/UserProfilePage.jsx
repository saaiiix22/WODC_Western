import React, { useEffect, useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FiFileText } from "react-icons/fi";
import InputField from "../../components/common/InputField";
import { getProfileInfoService, saveProfileService } from "../../services/umtServices"
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";

const UserProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File size should not exceed 2 MB");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    userName: '',
    designation: ''
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = encryptPayload(formData)
      const fmData = new FormData()
      fmData.append("cipherText", payload)
      fmData.append("profilePicture", imageFile)
      const res = await saveProfileService(fmData)
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message)
        const userData = res.data.data;

        setFormData({
          userId: userData.userId || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          mobile: userData.mobile || "",
          email: userData.email || "",
          userName: userData.userName || "",
          designation: userData.designation || ""
        });
        if (userData.profileBase64) {
          setSelectedImage(`data:image/jpeg;base64,${userData.profileBase64}`);
        }
      }

    } catch (error) {
      throw error
    }
  }
  const getUserDetails = async () => {
    try {
      const res = await getProfileInfoService();

      if (res?.status === 200 && res?.data.outcome) {
        const userData = res.data.data;

        setFormData({
          userId: userData.userId || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          mobile: userData.mobile || "",
          email: userData.email || "",
          userName: userData.userName || "",
          designation: userData.designation || ""
        });
        if (userData.profileBase64) {
          setSelectedImage(`data:image/jpeg;base64,${userData.profileBase64}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <form action="" onSubmit={handleSubmit}>
      <div
        className="
          mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
          shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        "
      >
        {/* Header */}
        <div className="p-0">
          <h3
            className="
              flex items-center gap-2 text-white font-normal text-[18px]
              border-b-2 border-[#ff9800] px-3 py-2
              bg-light-dark rounded-t-md
            "
          >
            <FiFileText
              className="
                text-[#fff2e7] text-[24px] p-1
                bg-[#ff7900] rounded
              "
            />
            User Profile
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12">
            <div className="col-span-9">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4">
                  <InputField label="First Name" required={true} name="firstName" onChange={handleChange} value={formData.firstName} />
                </div>
                <div className="col-span-4">
                  <InputField label="Last Name" required={true} name="lastName" onChange={handleChange} value={formData.lastName} />
                </div>
                <div className="col-span-4">
                  <InputField label="Mobile" required={true} name="mobile" onChange={handleChange} value={formData.mobile} />
                </div>
                <div className="col-span-4">
                  <InputField label="Email ID" required={true} name="email" onChange={handleChange} value={formData.email} />
                </div>
                <div className="col-span-4">
                  <InputField label="User name" required={true} name="userName" onChange={handleChange} value={formData.userName} />
                </div>
                <div className="col-span-4">
                  <InputField label="Designation" required={true} name="designation" onChange={handleChange} value={formData.designation} />
                </div>
              </div>
            </div>

            {/* Image Upload + Preview */}
            <div className="col-span-3 flex flex-col items-center gap-3">

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*,.jpg,.jpeg,.png"
                onChange={handleImageChange}
                className="hidden"
                id="profileUploader"
              />

              {/* Upload box */}
              <label
                htmlFor="profileUploader"
                className="
                    w-36 h-36 
                    bg-slate-500 
                    rounded-md 
                    flex items-center justify-center 
                    cursor-pointer 
                    border border-gray-300
                    overflow-hidden
                    hover:bg-slate-600 
                    transition-all
                    shadow-sm
                  "
              >
                {/* Before upload → show icon + text */}
                {!selectedImage && (
                  <div className="flex flex-col items-center text-white">

                    <span className="text-sm">Upload</span>
                  </div>
                )}

                {/* After upload → show image */}
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </label>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn type={"submit"} btnText={formData.userId} />
        </div>
      </div>
    </form>
  );
};

export default UserProfilePage;
