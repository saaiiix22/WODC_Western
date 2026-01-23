import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { encryptPayload } from "../../crypto.js/encryption";
import { loginUser } from "../../redux/slices/authThunks";
import { fetchUserDetails } from "../../redux/slices/menuSlice";
import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 5 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    captchaText: "",
  });

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData({ ...formData, captchaText: "" });
  };

  const handleInp = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `linear-gradient(
          to right,
          rgba(17,24,39,0.95),
          rgba(15,118,110,0.85)
        ), url(${images.loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden shadow-2xl bg-white/90 backdrop-blur-lg">

        {/* LEFT – Branding */}
        <div className="relative hidden md:flex flex-col justify-center items-center bg-[#111827] text-white px-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src={images.loginBg}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-6">
              <img src={images.emblem} alt="Emblem" className="w-16 invert" />
              <span className="h-10 w-[1px] bg-gray-400" />
              <img src={images.wodc} alt="WODC" className="w-16" />
            </div>

            <h1 className="text-3xl font-bold tracking-wide">
              WODC Odisha
            </h1>
            <p className="mt-3 text-sm text-gray-300 text-center leading-relaxed">
              Western Odisha Development Council 
              <br />
              Government of Odisha 
            </p>

            <div className="mt-12 text-xs text-gray-400 tracking-wide">
              Authorized Personnel Only
            </div>
          </div>
        </div>

        {/* RIGHT – Login Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-10 md:px-12 flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            User Authentication
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Login using your official credentials
          </p>

          {/* Username */}
          <label className="text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInp}
            placeholder="Enter username"
            className="h-11 px-3 rounded-md border border-gray-300 text-sm mb-5
            focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />

          {/* Password */}
          <label className="text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInp}
            placeholder="Enter password"
            className="h-11 px-3 rounded-md border border-gray-300 text-sm mb-5
            focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />

          {/* Captcha */}
          <label className="text-sm font-medium text-gray-700 mb-1">
            Captcha Code
          </label>
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              name="captchaText"
              value={formData.captchaText}
              onChange={handleInp}
              placeholder="Enter code"
              className="w-1/2 h-11 px-3 rounded-md border border-gray-300 text-sm
              focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />

            <div
              onClick={refreshCaptcha}
              className="w-1/2 h-11 flex items-center justify-center
              rounded-md bg-teal-50 border border-teal-600
              text-teal-700 font-bold tracking-widest cursor-pointer select-none"
              title="Refresh Captcha"
            >
              {captcha}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="h-12 rounded-md bg-light-dark/90 text-white font-semibold
            hover:bg-light-dark transition-all"
          >
            Login Securely
          </button>

          <p className="text-xs text-gray-400 text-center mt-8">
            © {new Date().getFullYear()} WODC Odisha | All Rights Reserved
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
