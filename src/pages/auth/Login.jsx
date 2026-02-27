import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { encryptPayload } from "../../crypto.js/encryption";
import { loginUser } from "../../redux/slices/authThunks";
import { fetchUserDetails } from "../../redux/slices/menuSlice";
import { useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import CryptoJS from "crypto-js";
import { getCaptchaService, resetPasswordService, verifyUserAndCaptcha } from "../../services/authService";
import { toast } from "react-toastify";
import CommonFormModal from "../../components/common/CommonFormModal";
import InputField from "../../components/common/InputField";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    captchaText: "",
  });

  const [formDataModal, setFormDataModal] = useState({
    forgotModalUsername: "",
    forgotModalCaptcha: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [openForgotPassword, setOpenForgotPassword] = useState(false)

  const [originalCreds, setOriginalCreds] = useState({
    userName: "",
    password: "",
  });
  const [forgetCaptchaItem, setForgetCaptchaItem] = useState({})
  const getForgotCaptcha = async () => {
    try {
      const res = await getCaptchaService(6);
      setForgetCaptchaItem(res?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [captchaItem, setCaptchaItem] = useState({})
  const getCaptcha = async () => {
    try {
      const res = await getCaptchaService(6)
      console.log(res);
      setCaptchaItem(res?.data)

    } catch (error) {
      // console.log(error);
      throw error
    }
  }

  const handleInp = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInpModal = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));

    setFormDataModal((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const getOtpValue = () => otp.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setOriginalCreds({
      userName: formData.userName,
      password: formData.password,
    });

    const hashedUsername = CryptoJS.SHA256(formData.userName).toString();
    const hashedPassword = CryptoJS.SHA256(formData.password).toString();

    setFormData((prev) => ({
      ...prev,
      userName: hashedUsername,
      password: hashedPassword,
    }));

    try {
      const payload = encryptPayload({
        userName: originalCreds.userName || formData.userName,
        password: originalCreds.password || formData.password,
        captcha: formData.captchaText,
        captchaToken: captchaItem?.captchaToken
      });

      const res = await dispatch(loginUser(payload)).unwrap();

      if (res?.outcome) {
        localStorage.setItem("token", res.data);
        await dispatch(fetchUserDetails());
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormData((prev) => ({
        ...prev,
        userName: originalCreds.userName,
        password: originalCreds.password,
      }));
      setLoading(false);
    }
  };
  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(true);

  const handleForgotModalSubmit = async () => {
    try {
      let newErrors = {};

      // -------------------------
      // STEP 1: Username + Captcha Validation
      // -------------------------
      if (flag) {
        if (!formDataModal.forgotModalUsername?.trim()) {
          newErrors.forgotModalUsername = "Username is required";
          setErrors(newErrors);
          return
        }

        if (!formDataModal.forgotModalCaptcha?.trim()) {
          newErrors.forgotModalCaptcha = "Captcha is required";
          setErrors(newErrors);
          return
        }

        if (!forgetCaptchaItem?.captchaToken) {
          newErrors.captcha = "Captcha expired. Please refresh.";
          setErrors(newErrors);
          return
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }

        setErrors({});

        const payload1 = encryptPayload({
          userName: formDataModal.forgotModalUsername,
          captcha: formDataModal.forgotModalCaptcha,
          captchaToken: forgetCaptchaItem?.captchaToken,
        });

        const res = await verifyUserAndCaptcha(payload1);

        if (res?.status === 200 && res?.data?.outcome) {
          setFlag(false);
        } else {
          toast.error(res?.data?.data?.message || "Verification failed");
        }
      }

      // -------------------------
      // STEP 2: OTP + New Password Validation
      // -------------------------
      else {
        const otpValue = getOtpValue();

        if (!otpValue || otpValue.length !== 6) {
          newErrors.otp = "Enter valid 6-digit OTP";
          toast.error(newErrors.otp)
        }

        if (!formDataModal.newPassword?.trim()) {
          newErrors.newPassword = "New password is required";
          setErrors(newErrors);
          return
        }

        if (!formDataModal.confirmNewPassword?.trim()) {
          newErrors.confirmNewPassword = "Confirm new password is required";
          setErrors(newErrors);
          return

        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }

        setErrors({});

        const payload2 = encryptPayload({
          userName: formDataModal.forgotModalUsername,
          otp: otpValue,
          newPassword: formDataModal.confirmNewPassword,
        });

        const res = await resetPasswordService(payload2);

        if (res?.status === 200 && res?.data?.outcome) {
          toast.success(res?.data?.data?.message);
          setOpenForgotPassword(false);
          resetForgotPasswordState();
        } else {
          toast.error(res?.data?.data?.message || "Password reset failed");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  const resetForgotPasswordState = () => {
    setFlag(true);
    setErrors({});
    setOtp(["", "", "", "", "", ""]);
    setFormDataModal({
      forgotModalUsername: "",
      forgotModalCaptcha: "",
      newPassword: "",
      confirmNewPassword: ""
    });
    setForgetCaptchaItem({});
  };
  useEffect(() => {
    getCaptcha()
  }, [])
  // console.log(formDataModal);



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
            disabled={loading}
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
            disabled={loading}
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
              onClick={getCaptcha}
              className="w-1/2 h-11 flex items-center justify-center
              rounded-md bg-teal-50 border border-teal-600
              text-teal-700 font-bold tracking-widest cursor-pointer select-none px-4 py-1"
              title="Refresh Captcha"
            >
              {/* {captcha} */}
              <img src={captchaItem?.captchaImage} className="h-full w-full" alt="" />
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
          <p className="text-end text-[12px] mt-2 text-slate-700 cursor-pointer"
            onClick={() => {
              resetForgotPasswordState();
              setOpenForgotPassword(true);
              getForgotCaptcha();
            }}
          >Forgot Password ?</p>

          <p className="text-xs text-gray-400 text-center mt-5">
            © {new Date().getFullYear()} WODC Odisha | All Rights Reserved
          </p>
        </form>
      </div>

      <CommonFormModal
        onClose={() => {
          setOpenForgotPassword(false);
          resetForgotPasswordState();
        }}
        title={"Forget Password"}
        open={openForgotPassword}
        subtitle="Enter your registered details to reset your password."
        width={400}
        footer={
          <>
            {
              flag && (
                <button
                  type="button"
                  className="bg-green-500 text-white text-[13px] px-3 py-1 rounded-sm border border-green-600 transition-all active:scale-95 uppercase flex items-center gap-1"
                  onClick={handleForgotModalSubmit}
                >
                  Send OTP
                </button>
              )
            }
            {
              !flag && (
                <button
                  type="button"
                  className="bg-green-500 text-white text-[13px] px-3 py-1 rounded-sm border border-green-600 transition-all active:scale-95 uppercase flex items-center gap-1"
                  onClick={handleForgotModalSubmit}
                >
                  Reset Password
                </button>
              )
            }
          </>
        }
        children={
          <>
            <div className="grid grid-cols-1 gap-6">

              {/* Username */}
              <div className="grid grid-cols-1">
                <InputField
                  label="Username"
                  required
                  name={"forgotModalUsername"}
                  value={formDataModal.forgotModalUsername}
                  onChange={handleInpModal}
                  error={errors.forgotModalUsername}
                />
              </div>

              {/* CAPTCHA Section */}
              {
                flag && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                    {/* CAPTCHA Input */}
                    <div className="md:col-span-5">
                      <InputField
                        label="Enter CAPTCHA"
                        required
                        name={"forgotModalCaptcha"}
                        value={formDataModal.forgotModalCaptcha}
                        onChange={handleInpModal}
                        error={errors.forgotModalCaptcha}
                      />
                    </div>

                    {/* CAPTCHA Image + Refresh */}
                    <div className="md:col-span-7 grid grid-cols-5 gap-3 items-center mt-5">

                      {/* CAPTCHA Box */}
                      <div
                        className="col-span-4 flex items-center justify-center
                   h-[36px]
                   bg-white
                   border-2 border-dashed border-orange-400
                   rounded-lg
                   shadow-inner
                   overflow-hidden"
                      >
                        <img
                          src={forgetCaptchaItem?.captchaImage}
                          alt="captcha"
                          className="h-full w-full object-contain px-2"
                        />
                      </div>

                      {/* Refresh Button */}
                      <button
                        type="button"
                        onClick={getForgotCaptcha}
                        className="col-span-1 h-[36px]
                   flex items-center justify-center
                   bg-orange-500 text-white
                   rounded-lg
                   shadow-md
                   hover:bg-orange-600
                   active:scale-95
                   transition duration-200"
                      >
                        ↻
                      </button>

                    </div>

                  </div>
                )
              }

              {/* OTP Section */}
              {
                !flag && (
                  <>
                    <div className="grid grid-cols-1">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Enter OTP
                      </label>

                      <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            onKeyDown={(e) => handleOtpBackspace(e, index)}
                            className="w-12 h-12 text-center text-lg font-semibold
                   border border-gray-300 rounded-md
                   focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <InputField
                        label="New Password"
                        type="password"
                        required
                        name={"newPassword"}
                        value={formDataModal.newPassword}
                        onChange={handleInpModal}
                        error={errors.newPassword}
                      />
                      <InputField
                        label="Confirm Password"
                        type="password"
                        required
                        name={"confirmNewPassword"}
                        value={formDataModal.confirmNewPassword}
                        onChange={handleInpModal}
                        error={errors.confirmNewPassword}
                      />
                    </div>
                  </>

                )
              }


            </div>
          </>
        }

      />
    </div>
  );
};

export default Login;
