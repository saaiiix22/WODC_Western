import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { encryptPayload } from "../../crypto.js/encryption";
import { loginService } from "../../services/authService";
import { loginUser } from "../../redux/slices/authThunks";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../../redux/slices/menuSlice";
import { toast } from "react-toastify";

const Login = () => {
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }
    return text;
  };
  const dispatch = useDispatch();

  const [captcha, setCaptcha] = useState(generateCaptcha());

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData({ ...formData, captchaText: "" });
  };

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    captchaText: "",
  });

  const handleInp = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = encryptPayload(formData);

      const res = await dispatch(loginUser(payload)).unwrap();
      
      if (res?.outcome) {
        localStorage.setItem("token", res.data);
        await dispatch(fetchUserDetails()); 
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative"
      style={{
        backgroundImage:
          "url(https://apps.odishatourism.gov.in/Application/uploadDocuments/UserContribution/Thumb20230508_103106.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-[420px] backdrop-blur-lg p-8 rounded-xl border border-blue-300
        "
      >
        <div className="w-full px-4 py-2 mb-2 rounded-lg flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#003b7b]">WODC - Odisha</h1>
          <p className="text-sm text-gray-600 mt-1">
            Government of Odisha – Login Portal
          </p>
        </div>

        {/* Username */}
        <label className="text-[#003b7b] text-[15px] font-medium">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          name="userName"
          value={formData.userName}
          onChange={handleInp}
          className="
            w-full h-[46px] mt-1 px-3 rounded-md border
            border-gray-300 text-gray-700 text-sm
            focus:border-[#003b7b] focus:outline-none
          "
        />

        {/* Password */}
        <label className="text-[#003b7b] text-[15px] font-medium mt-5 block">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={handleInp}
          className="
            w-full h-[46px] mt-1 px-3 rounded-md border
            border-gray-300 text-gray-700 text-sm
            focus:border-[#003b7b] focus:outline-none
          "
        />

        {/* Captcha */}
        <label className="text-[#003b7b] text-[15px] font-medium mt-5 block">
          Captcha Code
        </label>
        <div className="flex items-center gap-3 mt-1">
          <input
            type="text"
            name="captchaText"
            value={formData.captchaText}
            onChange={handleInp}
            placeholder="Enter code"
            className="
              w-1/2 h-[46px] px-3 rounded-md border border-gray-300
              text-gray-700 text-sm focus:border-[#003b7b]
              focus:outline-none
            "
          />
          <div
            className="
              w-1/2 h-[46px] flex items-center justify-center
              bg-[#eaf1ff] text-[#003b7b] font-bold tracking-widest
              rounded-md border border-[#003b7b] cursor-pointer select-none
            "
            onClick={refreshCaptcha}
            title="Click to refresh"
          >
            {captcha}
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="
            w-full mt-8 bg-[#003b7b] text-white
            py-3 rounded-md font-semibold text-lg
            hover:bg-[#024a9b] transition-all
          "
        >
          Log In
        </button>
      </form>

      {/* Footer */}
      <p className="text-xs text-white mt-5">
        © {new Date().getFullYear()} WODC Odisha | All Rights Reserved
      </p>
    </div>
  );
};

export default Login;
