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
      <header className="sticky top-0 z-40 w-full h-20 bg-white backdrop-blur-md border-b border-orange-400 px-4 md:px-8 flex items-center justify-between">

        {/* ================= LEFT BRAND: Refined Spacing ================= */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <img src={images.emblem} alt="Odisha" className="w-11 drop-shadow-sm transition-transform group-hover:scale-105" />
            <div className="h-6 w-[1.5px] bg-slate-200 rounded-full" />
            <img src={images.wodc} alt="WODC" className="w-11 transition-transform group-hover:scale-105" />
          </div>

          <div className="hidden lg:block ml-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {t("projectName")} <span className="text-[#fe8b00] font-bold">(WODC)</span>
            </h1>
            <p className="text-[11px] mt-1 font-medium uppercase tracking-wider text-slate-400">
              {t("dept")}
            </p>
          </div>
        </div>

        {/* ================= RIGHT ACTIONS: Modern UI Elements ================= */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* ---------- NOTIFICATION: Sleek Badge ---------- */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setOpenNotif(!openNotif)}
              className="group relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-50 transition-all duration-200"
            >
              <FiBell size={20} className="text-slate-600 group-hover:text-orange-600 transition-colors" />
              {totalNotifCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border-2 border-white"></span>
                </span>
              )}
            </button>

            {openNotif && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-800">Notifications</p>
                  <button className="text-[11px] font-bold text-orange-600 uppercase tracking-wide hover:opacity-70">Mark all read</button>
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <FiBell className="mx-auto text-slate-200 mb-2" size={32} />
                      <p className="text-sm text-slate-400">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map((item, i) => (
                      <div key={i} className="px-5 py-3.5 flex justify-between items-start hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer">
                        <div>
                          <p className="text-[13px] font-medium text-slate-700 leading-snug">{item.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">2 mins ago</p>
                        </div>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 ring-1 ring-inset ring-orange-200/50 px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <Link to="/dashboard" className="block text-center text-[13px] font-semibold py-3 text-slate-600 hover:text-orange-600 bg-slate-50/30 border-t border-slate-100 transition-colors">
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* ---------- LANGUAGE: Capsule Style ---------- */}
          <button
            onClick={toggleLang}
            className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-orange-200 hover:text-orange-600 transition-all active:scale-95"
          >
            {lang === "en" ? "EN • ଓଡ଼ିଆ" : "ଓଡ଼ିଆ • EN"}
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* ---------- USER: Elevated Profile ---------- */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="group flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all"
            >
              <div className="relative">
                <img src={images.profileImage} alt="profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-bold text-slate-800 leading-none">{selectState?.description}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 capitalize">{selectState?.roleCode?.toLowerCase()}</p>
              </div>
              <FiChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-[13px] font-bold text-slate-900 line-clamp-1">{selectState?.description}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{selectState?.roleCode}</p>
                </div>

                <ul className="p-2 space-y-0.5">
                  <li
                    onClick={() => { dispatch(addAllowedPath("/userProfile")); navigate("/userProfile"); }}
                    className="px-3 py-2.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center gap-3 text-[13px] font-medium text-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <FiUser className="text-orange-600" size={16} />
                    </div>
                    My Profile
                  </li>
                  <li
                    onClick={() => { dispatch(addAllowedPath("/changePassword")); navigate("/changePassword"); }}
                    className="px-3 py-2.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center gap-3 text-[13px] font-medium text-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                      <FiKey className="text-teal-600" size={16} />
                    </div>
                    Security
                  </li>
                  <div className="my-1.5 border-t border-slate-100" />
                  <li
                    onClick={() => setOpenLogoutModal(true)}
                    className="px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-3 text-[13px] font-bold transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <FiLogOut size={16} />
                    </div>
                    Sign Out
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
        description="Are you sure you want to sign out ?"
      />
    </>
  );
};

export default Navbar;
