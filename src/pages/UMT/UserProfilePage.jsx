import React, { useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FiFileText } from "react-icons/fi";
import InputField from "../../components/common/InputField";

const UserProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <form action="">
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
                  <InputField label="First Name" required={true} name="userId" />
                </div>
                <div className="col-span-4">
                  <InputField label="Last Name" required={true} name="userId" />
                </div>
                <div className="col-span-4">
                  <InputField label="Mobile" required={true} name="userId" />
                </div>
                <div className="col-span-4">
                  <InputField label="Email ID" required={true} name="userId" />
                </div>
                <div className="col-span-4">
                  <InputField label="User name" required={true} name="userId" />
                </div>
                <div className="col-span-4">
                  <InputField label="Designation" required={true} name="userId" />
                </div>
              </div>
            </div>

            {/* Image Upload + Preview */}
            <div className="col-span-3 flex flex-col items-center gap-3">

  {/* Hidden file input */}
  <input
    type="file"
    accept="image/*"
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
          <SubmitBtn type={"submit"} />
        </div>
      </div>
    </form>
  );
};

export default UserProfilePage;
