import React, { useState, useRef, useEffect } from "react";
import { encryptPayload } from "../crypto.js/encryption";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authThunks";
import { useDispatch, useSelector } from "react-redux";

import { FiUser, FiLogOut, FiKey, FiChevronDown } from "react-icons/fi";
import { images } from "../assets/images";
import i18n from "../i18n/i18n";
import { useTranslation } from "react-i18next";

const Navbar = () => {

  const {t} = useTranslation("common")

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectState = useSelector((state) => state?.menu.userDetails);

  const [open, setOpen] = useState(false);
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


  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);



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
          <button
            onClick={toggleLang}
            className="
              relative w-24 h-9 flex items-center cursor-pointer
              bg-[#2a2e34] border border-white/10
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
                ${lang === "en" ? "text-light-dark font-semibold" : "text-white/70"}
              `}
            >
              EN
            </span>

            <span
              className={`
                relative z-10 w-1/2 text-xs text-center
                ${lang === "od" ? "text-light-dark font-semibold" : "text-white/70"}
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
                    <Link
                      to="/userProfile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm"
                    >
                      <FiUser size={18} className="text-[#feca57]" />
                      View Profile
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/changePassword"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm"
                    >
                      <FiKey size={18} className="text-[#4ecdc4]" />
                      Change Password
                    </Link>
                  </li>

                  <div className="border-t border-white/10 my-1" />

                  <li>
                    <button
                      onClick={logout}
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
