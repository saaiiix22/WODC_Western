import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/common/Breadcrumb";
import { useLoader } from "../context/LoaderContext";
import Loader from "../components/common/Loader";

const MainLayout = () => {

  const { loading } = useLoader();

  const [collapse, setCollapse] = useState(false);
  const sidebarWidth = collapse ? 80 : 250;

  const location = useLocation();
  const pageRef = useRef(null);

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

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/30">
          <Loader />
        </div>

      )}
      <div className="flex min-h-screen bg-[#f5f6fa]">

        {/* SIDEBAR */}
        <aside
          className="fixed top-0 left-0 h-screen transition-all duration-300 z-50"
          style={{
            width: `${sidebarWidth}px`,
          }}
        >
          <Sidebar collapse={collapse} setCollapse={setCollapse} />
        </aside>

        {/* RIGHT SECTION */}
        <div
          className="flex flex-col w-full transition-all duration-300"
          style={{
            marginLeft: `${sidebarWidth}px`,
          }}
        >
          {/* NAVBAR */}
          <div
            className="fixed top-0 right-0 h-16 backdrop-blur bg-white/70 shadow-md transition-all duration-300 z-40"
            style={{
              left: `${sidebarWidth}px`,
            }}
          >
            <Navbar collapse={collapse} setCollapse={setCollapse} />
          </div>

          {/* CONTENT */}
          <main
            className="overflow-y-auto p-5 mt-16"
            style={{
              height: "calc(100vh - 80px)",
            }}
          >
            <Breadcrumb />

            <div ref={pageRef}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
