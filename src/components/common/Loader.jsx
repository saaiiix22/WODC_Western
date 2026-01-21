import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
      <HashLoader
        size={50}
        color="#475569"   // slate-600
        speedMultiplier={1.2}
      />
    </div>
  );
};

export default Loader;
