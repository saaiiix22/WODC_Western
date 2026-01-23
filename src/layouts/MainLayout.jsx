import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/common/Breadcrumb";
import { useLoader } from "../context/LoaderContext";
import Loader from "../components/common/Loader";
import SessionExpiredModal from "../components/common/SessionExpiredModal";

const IDLE_TIMEOUT = 15 * 60 * 1000; 

const MainLayout = () => {
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

    resetIdleTimer(); // start timer initially

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
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/30">
          <Loader />
        </div>
      )}

      <SessionExpiredModal
        open={sessionExpired}
        onContinue={handleContinue}
      />

      <div className="flex min-h-screen bg-[#f5f6fa]">
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
    </>
  );
};

export default MainLayout;
