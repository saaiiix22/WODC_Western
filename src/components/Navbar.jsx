import React, { useState, useRef, useEffect } from "react";
import { encryptPayload } from "../crypto.js/encryption";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authThunks";
import { useDispatch, useSelector } from "react-redux";

import { FiUser, FiLogOut, FiKey, FiChevronDown } from "react-icons/fi";
import { images } from "../assets/images";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectState = useSelector(state=>state?.menu.userDetails)
  console.log(selectState);
  

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

  // Close dropdown when clicking outside
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
    {/* bg-[#C75D2C] */}
      <header
        className="
          w-full h-20 flex items-center justify-between
          px-5 shadow-lg border-b border-orange-400
          bg-light-dark backdrop-blur-md 
          text-white transition-all duration-300
          p-5
        "
      >
        {/* LEFT LOGO SECTION */}
        <div className="flex items-center gap-3">
          <img src={images.emblem} alt="Odisha" style={{filter:"invert(1)"}} className="w-12 opacity-90" />
          <div className="p-[0.5px] h-10 bg-[#5c5c5c]"></div>
          <img src={images.wodc} alt="WODC" className="w-12 opacity-90" />

          <div className="leading-tight ml-1 hidden sm:block">
            <h1 className="text-[20px] font-semibold tracking-wide">
              Western Odisha Development Council (WODC)
            </h1>
            <p className="text-[14px] text-white/60 mt-1">Government of Odisha</p>
          </div>
        </div>

        {/* RIGHT SIDE DROPDOWN */}
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
            <span className="p-1 bg-green-400 rounded-full absolute bottom-2.5 left-10"></span>
            <img
              src={images.profileImage}
              className="w-9 h-9 rounded-full border border-white/20"
            />
            <span className="text-sm">{selectState?.description}</span>
            <FiChevronDown
              className={`transition-transform ${open ? "rotate-180" : ""}`}
              size={16}
            />
          </button>

          {/* DROPDOWN PANEL */}
          {open && (
            <div
              className="
                absolute right-0 mt-2 w-60 z-50
                rounded-xl border border-white/10
                bg-[#2b2f36] shadow-2xl animate-slideFade
                overflow-hidden
              "
            >
              {/* HEADER GRADIENT LIKE SIDEBAR SUBMENU */}
              <div className="px-4 py-3 bg-light-dark text-white">
                <p className="text-sm font-semibold">{selectState?.description}</p>
                <p className="text-xs opacity-80">{selectState?.roleCode}</p>
              </div>

              <ul className="py-1">
                <li>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm transition">
                    <FiUser size={18} className="text-[#feca57]" />
                    <span>View Profile</span>
                  </button>
                </li>

                <li>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm transition">
                    <FiKey size={18} className="text-[#4ecdc4]" />
                    <span>Change Password</span>
                  </button>
                </li>

                <div className="border-t border-white/10 my-1"></div>

                <li>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm text-red-400 font-medium transition"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* SMALL PATTERN BAR — MATCHED TO DARK THEME */}
      {/* <div
        className="w-full h-3"
        style={{
          backgroundImage:
            "url('https://wodc.odisha.gov.in/themes/wodc/assets/images/pattern.jpg')",
          backgroundRepeat: "repeat-x",
        }}
      ></div> */}

      {/* ANIMATIONS */}
      <style>
        {`
        .animate-slideFade {
          animation: slideFade 0.18s ease-out;
        }

        @keyframes slideFade {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0px); }
        }
      `}
      </style>
    </>
  );
};

export default Navbar;
