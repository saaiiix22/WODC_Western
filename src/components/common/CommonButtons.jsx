import { FaSave } from "react-icons/fa";
import { PiKeyReturnBold } from "react-icons/pi";

export const SubmitBtn = ({type,btnText}) => {
    return (
        <button type={type}  className="bg-green-600 text-white text-[13px] px-3 py-1 rounded-sm hover:bg-green-700 transition-all active:scale-95 uppercase flex items-center gap-1">
           <FaSave/> {btnText?'update':'submit'}
        </button>
    )
}
export const ResetBackBtn =()=>{
    return(
        <button type="button" className="bg-red-500 text-white text-[13px] px-3 py-1 rounded-sm hover:bg-red-600 transition-all active:scale-95 uppercase flex items-center gap-1"><PiKeyReturnBold  className="text-lg"/>Back</button>
    )
}