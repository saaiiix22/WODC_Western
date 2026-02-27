import { GrSave } from "react-icons/gr";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { FiSearch, FiBookmark } from "react-icons/fi";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";

export const SubmitBtn = ({ type, btnText, disable }) => {
  return (
    <button
      type={type}
      disabled={disable ? true : false}
      className="bg-[#bbef7f] text-[green] text-[13px] px-3 py-1 rounded-sm border border-[green] transition-all active:scale-95 uppercase flex items-center gap-1"
    >
      <GrSave /> {btnText ? "update" : "submit"}
    </button>
  );
};

export const ResetBackBtn = ({ path = -1 }) => {
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

export const SearchBtn = ({ type, disabled }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className="bg-[#e6f4ff] text-[#1890ff] text-[13px] px-3 py-1 rounded-sm border border-[#1890ff] transition-all active:scale-95 uppercase flex items-center gap-1 disabled:bg-[#f5f5f5] disabled:text[#bfbfbf] disabled:border-[#d9d9d9]"
    >
      <FiSearch className="text-base" />
      Search
    </button>
  );
};

export const SaveAsDraftBtn = ({ type, disabled, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="bg-[#f0f0f0] text-[#666] text-[13px] px-3 py-1 rounded-sm border border-[#999] transition-all active:scale-95 uppercase flex items-center gap-1 hover:bg-[#e8e8e8] disabled:bg-[#f5f5f5] disabled:text[#bfbfbf] disabled:border-[#d9d9d9]"
    >
      <FaSave className="text-sm" />
      Save as Draft
    </button>
  );
};

export const UploadBtn = ({ type, disabled, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="bg-[#e1f5fe] text-[#0288d1] text-[13px] px-3 py-1 rounded-sm border border-[#0288d1] transition-all active:scale-95 uppercase flex items-center gap-1 hover:bg-[#b3e5fc] disabled:bg-[#f5f5f5] disabled:text[#bfbfbf] disabled:border-[#d9d9d9]"
    >
      <FiUpload className="text-base" />
      Upload
    </button>
  );
};

export const CreateBtn = ({ type, disabled, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="bg-[#e8f5e9] text-[#2e7d32] text-[13px] px-3 py-1 rounded-sm border border-[#2e7d32] transition-all active:scale-95 uppercase flex items-center gap-1 hover:bg-[#c8e6c9] disabled:bg-[#f5f5f5] disabled:text[#bfbfbf] disabled:border-[#d9d9d9]"
    >
      <AiOutlinePlus className="text-base" />
      Create
    </button>
  );
};

export const BookmarkBtn = ({ type, disabled, onClick, bookmarked = false }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${bookmarked ? 'bg-[#f3e5f5] text-[#7b1fa2] border-[#7b1fa2]' : 'bg-[#e1f5fe] text-[#0288d1] border-[#0288d1]'} text-[13px] px-3 py-1 rounded-sm border transition-all active:scale-95 uppercase flex items-center gap-1 hover:${bookmarked ? 'bg-[#e1bee7]' : 'bg-[#b3e5fc]'} disabled:bg-[#f5f5f5] disabled:text[#bfbfbf] disabled:border-[#d9d9d9]`}
    >
      <FiBookmark className={`text-base ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
};