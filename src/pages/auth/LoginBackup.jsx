import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { encryptPayload } from "../../crypto.js/encryption";
import { loginService } from "../../services/authService";
import { loginUser } from "../../redux/slices/authThunks";
import { useNavigate } from "react-router-dom";

const LoginBack = () => {
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }
    return text;
  };

  const selectUser = useSelector(state => state);
  const dispatch = useDispatch()
  // console.log(selectUser);

  const [captcha, setCaptcha] = useState(generateCaptcha());

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    seTFormData({ ...formData, captchaText: "" });
  };

  const [formData, seTFormData] = useState({
    userName: "",
    password: "",
    captchaText: "",
  });

  const handleInp = (e) => {
    const { name, value } = e.target;
    seTFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate()
  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const payload = encryptPayload(formData)
      const res = await dispatch(loginUser(payload))
      console.log(res);
      if(res?.payload.outcome){
        navigate('/dashboard')
      }
    } catch (error) {
      throw error
    }
  };

  return (
    <div className="min-h-screen bg-[#080710] flex items-center justify-center relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute w-[430px] h-[520px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <div className="absolute h-[200px] w-[200px] rounded-full bg-gradient-to-b from-[#1845ad] to-[#23a2f6] -top-20 -left-20" />
        <div className="absolute h-[200px] w-[200px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] -bottom-20 -right-8" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
          w-[400px] h-[600px] px-9 py-12 rounded-xl
          bg-white/10 backdrop-blur-xl
          border border-white/20 shadow-[0_0_40px_rgba(8,7,16,0.6)]
          relative z-10
        "
      >
        <h3 className="text-3xl font-medium text-center text-white mb-6">
          Login Here
        </h3>

        {/* Username */}
        <label className="text-white text-[16px] mt-6 block font-medium">
          Username
        </label>
        <input
          type="text"
          placeholder="Email or Phone"
          name="userName"
          value={formData.userName}
          onChange={handleInp}
          className="
            w-full h-[50px] mt-2 px-3 rounded-md
            bg-white/20 text-white text-sm font-light
            placeholder:text-gray-200 outline-none
          "
        />

        {/* Password */}
        <label className="text-white text-[16px] mt-6 block font-medium">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInp}
          className="
            w-full h-[50px] mt-2 px-3 rounded-md
            bg-white/20 text-white text-sm font-light
            placeholder:text-gray-200 outline-none
          "
        />

        {/* Captcha */}
        <label className="text-white text-[16px] mt-6 block font-medium">
          Enter Captcha
        </label>

        <div className="flex items-center gap-3 mt-2">
          {/* Left → Input */}
          <input
            type="text"
            name="captchaText"
            value={formData.captchaText}
            onChange={handleInp}
            placeholder="Enter code"
            className="
              w-1/2 h-[50px] px-3 rounded-md
              bg-white/20 text-white text-sm font-light
              placeholder:text-gray-200 outline-none
            "
          />

          {/* Right → Captcha Box */}
          <div
            className="
              w-1/2 h-[50px] flex items-center justify-center
              bg-white/30 text-black font-bold tracking-widest
              rounded-md text-lg cursor-pointer select-none
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
            w-full mt-10 bg-white text-[#080710]
            py-3 rounded-md font-semibold text-lg cursor-pointer
          "
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginBack;
