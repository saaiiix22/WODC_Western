// components/common/SessionExpiredModal.jsx
import React from "react";
import { encryptPayload } from "../../crypto.js/encryption";
import { logoutUser } from "../../redux/slices/authThunks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const SessionExpiredModal = ({ open, onContinue }) => {
    if (!open) return null;

    const navigate = useNavigate()
    const token = localStorage.getItem("token");
    const dispatch = useDispatch()
    const logout = async () => {
        try {
            const payload = encryptPayload(token);
            await dispatch(logoutUser(payload)).unwrap();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-[400px] p-6">
                <h2 className="text-xl font-semibold mb-3">Session Expired</h2>
                <p className="text-gray-600 mb-6">
                    You have been inactive for a while. Please continue or logout.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={logout}
                        className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                    <button
                        onClick={onContinue}
                        className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Continue Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionExpiredModal;
