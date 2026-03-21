import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/common/Breadcrumb";
import { useLoader } from "../context/LoaderContext";
import Loader from "../components/common/Loader";
import SessionExpiredModal from "../components/common/SessionExpiredModal";
import { useDispatch, useSelector } from "react-redux";
import CommonFormModal from "../components/common/CommonFormModal";
import InputField from "../components/common/InputField";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineSecurity } from "react-icons/md";
import { encryptPayload } from "../crypto.js/encryption";
import { changePasswordService } from "../services/umtServices";
import { fetchUserDetails, setUserDetails } from "../redux/slices/menuSlice";
import { logoutUser } from "../redux/slices/authThunks";

const IDLE_TIMEOUT = 15 * 60 * 1000;

const MainLayout = () => {

  const resetPassword = useSelector(state => state.menu.userDetails.userDetails)
  
  const doubleCheck = useSelector(state=>state.menu.isNewUser)
  // console.log(doubleCheck);

  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = encryptPayload({
        userName: resetPassword.userName,
        txtPass: formData.newPassword,
        txtRePass: formData.confirmPassword
      })
      const res = await changePasswordService(payload)
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        dispatch(
          setUserDetails({
            ...resetPassword,
            isPasswordReset: true
          })
        );
        await dispatch(logoutUser(payload)).unwrap();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const { loading } = useLoader();
  const navigate = useNavigate();


  const [collapse, setCollapse] = useState(false);
  const sidebarWidth = collapse ? 80 : 250;

  const [sessionExpired, setSessionExpired] = useState(false);
  const idleTimerRef = useRef(null);

  const location = useLocation();
  const pageRef = useRef(null);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      setSessionExpired(true);
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) =>
      window.addEventListener(event, resetIdleTimer)
    );

    resetIdleTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const node = pageRef.current;
    if (!node) return;

    node.classList.add("page-enter");
    requestAnimationFrame(() => {
      node.classList.add("page-enter-active");
    });

    return () => {
      node.classList.remove("page-enter", "page-enter-active");
    };
  }, [location.pathname]);

  const handleContinue = () => {
    setSessionExpired(false);
    resetIdleTimer();
  };

  

  return (
    <div className="layout">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/30">
          <Loader />
        </div>
      )}

      <SessionExpiredModal
        open={sessionExpired}
        onContinue={handleContinue}
      />

      {
        !doubleCheck && !resetPassword?.isPasswordReset && (
          <>
            <CommonFormModal
              title={"Reset Your Password"}
              subtitle={"For security reasons, please set a new password."}
              open={!resetPassword?.isPasswordReset}
              onClose={resetPassword?.isPasswordReset}
              footer={
                <button
                  type="button"
                  className="bg-green-500 text-white text-[13px] px-3 py-1 rounded-sm border border-green-600 transition-all active:scale-95 uppercase flex items-center gap-1"
                  onClick={handleSubmit}
                >
                  Change Password
                </button>
              }
              children={
                <div className="w-full">
                  <InputField
                    label={"Username"}
                    required
                    value={resetPassword?.userName}
                    readOnly
                  />
                  <div className="mt-3 flex gap-2">

                    <InputField
                      label={"New Password"}
                      type="password"
                      name={"newPassword"}
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />

                    <InputField
                      label={"Confirm New Password"}
                      type="password"
                      name={"confirmPassword"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 
                border border-blue-100 
                p-4 rounded-xl mt-5 shadow-sm">

                    <div className="flex items-center gap-2 mb-3">
                      <MdOutlineSecurity className="text-blue-600 text-lg" />
                      <h4 className="text-sm font-semibold text-gray-700">
                        Password Requirements
                      </h4>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">

                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-gray-400" />
                        <span>Minimum 8 characters</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-gray-400" />
                        <span>At least 1 uppercase letter</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-gray-400" />
                        <span>At least 1 number</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-gray-400" />
                        <span>At least 1 special character</span>
                      </div>

                    </div>
                  </div>
                </div>
              }
            />
          </>
        )
      }

      <div className="flex min-h-screen bg-[#f5f6fa] ">
        {/* SIDEBAR */}
        <aside
          className="fixed top-0 left-0 h-screen transition-all duration-300 z-50"
          style={{ width: sidebarWidth }}
        >
          <Sidebar collapse={collapse} setCollapse={setCollapse} />
        </aside>

        {/* RIGHT SECTION */}
        <div
          className="flex flex-col w-full transition-all duration-300"
          style={{ marginLeft: sidebarWidth }}
        >
          {/* NAVBAR */}
          <div
            className="fixed top-0 right-0 h-16 backdrop-blur bg-white/70 shadow-md transition-all duration-300 z-40"
            style={{ left: sidebarWidth }}
          >
            <Navbar collapse={collapse} setCollapse={setCollapse} />
          </div>

          {/* CONTENT */}
          <main
            className="overflow-y-auto p-5 mt-16"
            style={{ height: "calc(100vh - 80px)" }}
          >
            <Breadcrumb />
            <div ref={pageRef}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
