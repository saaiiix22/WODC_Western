import { toast } from "react-toastify";
import { encryptPayload } from "../crypto.js/encryption";

export const load = async (serviceFn, payload, setter) => {
    try {
        const res = await serviceFn(encryptPayload(payload));
        if(res?.data.outcome && res?.status === 200){
            setter(res?.data.data || []);
        }
        else{
            toast.error('Something Went Wrong')
        }
    } catch (err) {
        console.error(err);
    }
};