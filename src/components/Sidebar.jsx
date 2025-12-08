import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RiMenu2Fill, RiSettings3Fill } from "react-icons/ri";
import { MdDashboard, MdApartment } from "react-icons/md";
import { FaChevronDown, FaMapMarkedAlt } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { RiAdminFill } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { encryptPayload } from "../crypto.js/encryption";
import { MenuList } from "../services/authService";

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
  // const { collapse, setCollapse } = props;

  // const getAllMenus=async()=>{
  //   try {
  //     const payload = encryptPayload("roleCode")
  //     const res = await MenuList(payload)
  //     console.log(res);
  //   } catch (error) {
  //     throw error
  //   }

  // }
  // useEffect(()=>{
  //   getAllMenus()
  // },[])

  const staticMenu = [
    {
      title: "Dashboard",
      icon: <MdDashboard className="text-lg" />,
      link: "/dashboard",
    },
    {
      title: "Master",
      icon: <RiAdminFill  className="text-lg" />,
      subMenu: [
        { title: "Milestone Details", link: "/get-milestone" },
        { title: "Agency Details", link: "/get-agency" },
        { title: "Sector Details", link: "/get-sector" },
        { title: "Vendor Details", link: "/get-vendor" },
        { title: "Sector Milestone Mapping", link: "/get-sector-milestone" },
        { title: "Beneficiary Details", link: "/get-beneficiary" },
        { title: "Constituency Details", link: "/get-constituency" },
        { title: "Proposal Details", link: "/get-proposal" },
        { title: "GIA Details", link: "/get-gia" },
      ],
    },
    {
      title: "User Management",
      icon: <MdManageAccounts   className="text-lg" />,
      subMenu: [
        { title: "Add User", link: "/addUser" },
        { title: "Access Role", link: "/get-role-access" },
        { title: "Manage Role", link: "/get-manage-user" },
        { title: "Role Menu Map", link: "/roleMenuMapping" },
        { title: "User Profile", link: "/userProfile" },
      ],
    },
    {
      title: "Demography Master",
      icon: <FaMapMarkedAlt className="text-lg" />,
      subMenu: [
        { title: "District Details", link: "/get-district" },
        { title: "Block Details", link: "/get-block" },
        { title: "Gram Panchayat", link: "/get-gp" },
        { title: "Municipality Details", link: "/get-municipality" },
        { title: "Ward Details", link: "/get-ward" },
        { title: "Village Details", link: "/get-village" },
       
      ],
    },
    {
      title: "Budget",
      icon: <MdApartment className="text-lg" />,
      subMenu: [
        { title: "Budget Management", link: "/budget" },
        // { title: "Edit Budget", link: "/editbudget" },
      ],
    },
    {
      title: "Project Management",
      icon: <TbReportAnalytics className="text-lg" />,
      subMenu: [
        { title: "Create Project ", link: "/project" },
        { title: "Project List", link: "/project-list" },
        { title: "Project Agency Milestone Map", link: "/projectAgencyMilestoneMapping" },
      ],
    },
  ];

  const [activeMenu, setActiveMenu] = React.useState(null);
  const toggleMenu = (title) => {
    setActiveMenu((prev) => (prev === title ? null : title));
  };

  
  return (
    <div
      // bg-[#22262b]
      className={`
        h-full flex flex-col transition-all duration-300 shadow-xl
        bg-[#141414]
        ${collapse ? "w-20 min-w-20 p-2" : "w-64 min-w-64 p-3"}
      `}
    >
      {/* HEADER */}
      <div className={`flex items-center  mb-6 w-full mt-3 ${collapse ? "justify-center" : "justify-between"}`}>
        {!collapse && (
          <div className="flex flex-col ">
            <span className="text-white text-lg font-semibold tracking-wide">
               IPMS Portal
            </span>
            <span className="text-white text-[11px] opacity-70 tracking-wider">
              Administration
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapse(!collapse)}
          // className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition"
          className="p-1.5 bg-[#fe8b00]  rounded-sm transition"
        >
          {collapse?<RiMenu2Fill className="text-white text-lg" />:<RxCross2 className="text-white text-lg" />}
        </button>
      </div>

      {/* SECTION LABEL */}
      {!collapse && (
        <p className="text-white/60 text-[9px]  uppercase tracking-widest mb-2">
          Navigation
        </p>
      )}

      {/* MAIN MENU */}
      <ul className="flex flex-col gap-1 w-full">
        {staticMenu.map((item, index) => {
          const hasSubMenu = item.subMenu?.length;
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
                  {item.icon}
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
                // DROPDOWN ITEM (NO REDIRECT)
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
                      onClick={()=>{}}
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
    </div>
  );
};

export default Sidebar;
