import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiMenu2Fill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { images } from "../assets/images";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getAllMenuForSideBarService } from "../services/umtServices";



const iconColors = [
  "#ff6b6b",
  "#4ecdc4",
  "#feca57",
  "#a29bfe",
  "#55efc4",
  "#81ecec",
  "#fab1a0",
  "#fd79a8",
];

const Sidebar = ({ collapse, setCollapse }) => {

 
  

  const getAllMenu = async () => {
    try {
      const res = await getAllMenuForSideBarService();
      // console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setMenuList(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(()=>{
    getAllMenu()
  },[])

  const [menuList,setMenuList] = useState([])


  const [activeMenu, setActiveMenu] = React.useState(null);
  const toggleMenu = (title) => {
    setActiveMenu((prev) => (prev === title ? null : title));
  };


  return (
    <div
      className={`
        h-full flex flex-col transition-all duration-300 shadow-xl relative 
        bg-[#2a2e34] 
        overflow-auto
        ${collapse ? "w-20 min-w-20 p-2" : "w-64 min-w-64 p-3"}
        
      `}
      id="sidebar"
    >
      {/* HEADER */}
      <div className={`flex items-center  mb-6 w-full mt-3 ${collapse ? "justify-center" : "justify-between"}`}>
        {!collapse && (
          <div className="flex flex-col ">
            <span className="text-white text-lg font-semibold tracking-wide">
              IPFMS Portal
            </span>
            <span className="text-white text-[11px] opacity-70 tracking-wider">
              Administration
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapse(!collapse)}
          className="p-1.5 bg-[#fe8b00]  rounded-sm transition"
        >
          {collapse ? <RiMenu2Fill className="text-white text-lg" /> : <RxCross2 className="text-white text-lg" />}
        </button>
      </div>

      {!collapse && (
        <p className="text-white/60 text-[9px]  uppercase tracking-widest mb-2">
          Navigation
        </p>
      )}

      {/* MAIN MENU */}
      <ul className="flex flex-col gap-1 w-full z-50">
        {menuList.map((item, index) => {
          const hasSubMenu = item.subMenu?.length > 0;
          const isOpen = activeMenu === item.title;
          const color = iconColors[index % iconColors.length];

          const content = (
            <>
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-md grid place-items-center"
                  style={{
                    color,
                    background: `linear-gradient(135deg, ${color}30, ${color}55)`,
                  }}
                >
                  {/* {item.icon} */}
                  <i className={`${item.icon} text-sm`} />

                </div>

                {!collapse && (
                  <span className="text-white font-medium text-[11px]">
                    {item.title}
                  </span>
                )}
              </div>

              {!collapse && hasSubMenu && (
                <FaChevronDown
                  className={`text-white text-xs transition-transform ${isOpen ? "rotate-180" : ""
                    }`}
                />
              )}
            </>
          );

          return (
            <li key={index} className="w-full">
              {hasSubMenu ? (
                <div
                  onClick={() => !collapse && toggleMenu(item.title)}
                  className={`
            flex items-center px-2 py-2 rounded-lg cursor-pointer w-full
            hover:bg-white/10 transition-all duration-200
            ${collapse ? "justify-center" : "justify-between"}
          `}
                >
                  {content}
                </div>
              ) : (
                // DIRECT LINK ITEM
                <Link
                  to={item.link}
                  className={`
            flex items-center px-2 py-2 rounded-lg cursor-pointer w-full
            hover:bg-white/10 transition-all duration-200
            ${collapse ? "justify-center" : "justify-between"}
          `}
                >
                  {content}
                </Link>
              )}

              {/* SUBMENU */}
              {!collapse && hasSubMenu && (
                <div
                  className={`
            ml-8 mt-1 bg-white/5 border border-white/10 rounded-lg
            overflow-hidden w-[calc(100%-2rem)]
            transition-all duration-500 ease-in-out
            ${isOpen ? "max-h-[500px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"}
          `}
                >
                  {item.subMenu.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.link}
                      className="block px-3 py-1.5 text-white/90 text-[11px] hover:bg-white/10 transition"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}

      </ul>
      {
        !collapse && <img src={images.project} className="absolute bottom-0 opacity-20 left-0 w-full" alt="" />
      }
    </div>
  );
};

export default Sidebar;
