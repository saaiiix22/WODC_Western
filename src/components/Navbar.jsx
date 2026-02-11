import React, { useState, useRef, useEffect } from "react";
import { encryptPayload } from "../crypto.js/encryption";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authThunks";
import { useDispatch, useSelector } from "react-redux";
import { FiBell } from "react-icons/fi";
import { FiUser, FiLogOut, FiKey, FiChevronDown } from "react-icons/fi";
import { images } from "../assets/images";
import i18n from "../i18n/i18n";
import { useTranslation } from "react-i18next";
import ReusableDialog from "./common/ReusableDialog";
import { notificationsService } from "../services/dashboardService";
import { addAllowedPath } from "../redux/slices/menuSlice";

const Navbar = () => {
  const [openNotif, setOpenNotif] = useState(false);
  const notifRef = useRef(null);
  const { t } = useTranslation("common")

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectState = useSelector((state) => state?.menu.userDetails);

  const [open, setOpen] = useState(false);

  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  const dropdownRef = useRef(null);

  const logout = async () => {
    try {
      const payload = encryptPayload(token);
      await dispatch(logoutUser(payload)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "en"
  );

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "od" : "en";
    i18n.changeLanguage(newLang);
    setLang(newLang)
    localStorage.setItem("lang", newLang);
  };

  const notificationsMenu = async () => {
    try {
      const res = await notificationsService()
      // console.log(res);

      if (res?.status === 200) {
        setNotifications(res?.data)
      }
    } catch (error) {
      console.log(error);
    }
  }
  // console.log(notifications);
  const totalNotifCount = notifications?.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );


  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {

    const closeNotif = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener("mousedown", closeNotif);
    return () => document.removeEventListener("mousedown", closeNotif);
  }, []);

  useEffect(() => {
    notificationsMenu()
  }, [])




  return (
    <>
      <header
        className="
          w-full h-20 flex items-center justify-between
          px-5 shadow-lg border-b border-orange-400
           backdrop-blur-md
          text-white transition-all duration-300
        "
        style={{ background: "whitesmoke" }}
      >
        <div className="flex items-center gap-3">
          <img
            src={images.emblem}
            alt="Odisha"
            // style={{ filter: "invert(1)" }}
            className="w-12 opacity-90"
          />
          <div className="p-[0.5px] h-10 bg-[#ccc]" />
          <img
            src={images.wodc}
            alt="WODC"
            className="w-12 opacity-90"
          />

          <div className="leading-tight ml-1 hidden sm:block">
            <h1 className="text-[20px] font-semibold text-light-dark">
              {t("projectName")} (WODC)
            </h1>
            <p className="text-[14px] text-light-dark mt-1">
              {t("dept")}
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-4">

          {/* ===== LANGUAGE TOGGLE SWITCH ===== */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setOpenNotif(!openNotif)}
              className="
                relative p-2 bg-[#ccc] rounded-full
                transition-all
              "
            >
              <FiBell size={20} className="text-slate-800" />
              {totalNotifCount > 0 && (
                <span
                  className="
        absolute -top-1 -right-1
        min-w-[20px] h-5 px-1
        flex items-center justify-center
        text-[10px] font-bold
        text-white
        bg-orange-500
        rounded-full
        shadow-md
      "
                >
                  {totalNotifCount}
                </span>
              )}

            </button>

            {openNotif && (
              <div
                className="
        absolute right-0 mt-2 w-72 z-50
        rounded-xl border border-white/10
        bg-[#f5f5f5] shadow-2xl
        animate-slideFade overflow-hidden
      "
              >
                {/* HEADER */}
                <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                  <p className="text-sm font-semibold text-slate-600">Notifications</p>
                  <button className="text-xs text-orange-400 hover:underline">
                    Mark all as read
                  </button>
                </div>

                {/* LIST */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <p className="text-sm text-center py-6 opacity-70">
                      No notifications
                    </p>
                  ) : (
                    notifications?.map((item, idx) => (

                      <div
                        key={idx}
                        className={`
                          px-4 py-3 cursor-pointer
                          border-b border-white/5
                          hover:bg-white/5
                          flex justify-between items-center
                        `}
                      >

                        <div className="flex justify-between items-start gap-2">
                          <p className="text-[12px] font-medium text-slate-600">
                            {item.title}
                          </p>
                        </div>

                        <p className="text-[11px] px-3 py-1 bg-orange-300/25 rounded-sm mt-1 text-orange-600 font-bold">
                          {item.count}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* FOOTER */}
                <div className="px-4 py-2 text-center border-t border-white/10">
                  <Link
                    to="/dashboard"
                    className="text-sm text-orange-400 hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleLang}
            className="
              relative w-24 h-9 flex items-center cursor-pointer
              bg-[#ccc] border border-white/10
              rounded-sm transition-all
            "
          >
            {/* SLIDER */}
            <span
              className={`
                absolute top-1 left-1 w-10 h-7 rounded-sm
                bg-orange-400 shadow-md
                transition-transform duration-300
                ${lang === "od" ? "translate-x-[44px]" : "translate-x-0"}
              `}
            />

            {/* LABELS */}
            <span
              className={`
                relative z-10 w-1/2 text-xs text-center
                ${lang === "en" ? "text-light-dark font-semibold" : "text-slate-800"}
              `}
            >
              EN
            </span>

            <span
              className={`
                relative z-10 w-1/2 text-xs text-center
                ${lang === "od" ? "text-light-dark font-semibold" : "text-slate-800"}
              `}
            >
              ଓଡ଼ିଆ
            </span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="
                flex items-center gap-2 px-3 py-2
                bg-[#2a2e34] hover:bg-[#34383f]
                border border-white/10 rounded-lg
                transition-all relative
              "
            >
              <span className="p-1 bg-green-400 rounded-full absolute bottom-2.5 left-10" />
              <img
                src={images.profileImage}
                className="w-9 h-9 rounded-full border border-white/20"
                alt="Profile"
              />
              <span className="text-sm">{selectState?.description}</span>
              <FiChevronDown
                size={16}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div
                className="
                  absolute right-0 mt-2 w-60 z-50
                  rounded-xl border border-white/10
                  bg-[#2b2f36] shadow-2xl animate-slideFade
                  overflow-hidden
                "
              >
                <div className="px-4 py-3 bg-light-dark">
                  <p className="text-sm font-semibold">
                    {selectState?.description}
                  </p>
                  <p className="text-xs opacity-80">
                    {selectState?.roleCode}
                  </p>
                </div>

                <ul className="py-1">
                  <li>
                    <p
                      onClick={() => {
                        dispatch(addAllowedPath("/userProfile"))
                        navigate("/userProfile")
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm"
                    >
                      <FiUser size={18} className="text-[#feca57]" />
                      View Profile
                    </p>
                  </li>

                  <li>
                    <p
                      onClick={() => {
                        dispatch(addAllowedPath("/changePassword"))
                        navigate("/changePassword")
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm"
                    >
                      <FiKey size={18} className="text-[#4ecdc4]" />
                      Change Password
                    </p>
                  </li>

                  <div className="border-t border-white/10 my-1" />

                  <li>
                    <button
                      onClick={() => setOpenLogoutModal(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm text-red-400 font-medium"
                    >
                      <FiLogOut size={18} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <ReusableDialog
        open={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        onConfirm={logout}
        description={"Do you want to logout ?"}
      />

      {/* ================= ANIMATION ================= */}
      <style>
        {`
          .animate-slideFade {
            animation: slideFade 0.18s ease-out;
          }
          @keyframes slideFade {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
