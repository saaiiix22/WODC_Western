import { GrSave } from "react-icons/gr";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const SubmitBtn = ({ type, btnText }) => {
  return (
    <button
      type={type}
      className="bg-[#bbef7f] text-[green] text-[13px] px-3 py-1 rounded-sm border border-[green] transition-all active:scale-95 uppercase flex items-center gap-1"
    >
      <GrSave /> {btnText ? "update" : "submit"}
    </button>
  );
};
export const ResetBackBtn = ({ path = "/dashboard" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="text-light-dark border bg-[#e3e3e3] border-light-dark text-[13px] px-3 py-1 rounded-sm transition-all active:scale-95 uppercase flex items-center gap-1"
    >
      <IoReturnDownBackSharp className="text-lg" />
      Back
    </button>
  );
};

