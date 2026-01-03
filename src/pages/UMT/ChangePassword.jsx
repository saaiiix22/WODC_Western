import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { ResetBackBtn, SubmitBtn } from '../../components/common/CommonButtons'
import InputField from '../../components/common/InputField'
import { changePasswordService, checkOldPasswordService, getProfileInfoService } from '../../services/umtServices'
import { encryptPayload } from '../../crypto.js/encryption'
import { toast } from 'react-toastify'
import ReusableDialog from '../../components/common/ReusableDialog'

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        userName: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({});
    const validateNewPassword = (password) => {
        if (!password) {
            return 'New password is required';
        }

        if (password.length < 8 || password.length > 15) {
            return 'Password must be between 8 and 15 characters';
        }

        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }

        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }

        if (!/\d/.test(password)) {
            return 'Password must contain at least one number';
        }

        if (!/[@/*#]/.test(password)) {
            return 'Password must contain at least one special character (@ / * #)';
        }

        return '';
    };
    const validateConfirmPassword = (confirmPassword, newPassword) => {
        if (!confirmPassword) {
            return 'Confirm password is required';
        }

        if (confirmPassword !== newPassword) {
            return 'Confirm password does not match new password';
        }

        return '';
    };


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (name === 'newPassword') {
            setErrors((prev) => ({
                ...prev,
                newPassword: validateNewPassword(value)
            }));
        }
        if (name === 'confirmPassword') {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirmPassword(
                    value,
                    formData.newPassword
                )
            }));
        }
    }

    const getUserDetails = async () => {
        try {
            const res = await getProfileInfoService();

            if (res?.status === 200 && res?.data.outcome) {
                const userData = res.data.data;
                setFormData({
                    ...formData,
                    userName: userData.userName
                })
                // console.log(userData);

            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleOldPasswordBlur = () => {
        if (formData.oldPassword && formData.userName) {
            checkOldPassword();
        }
    };

    const [isOldPasswordValid, setIsOldPasswordValid] = useState(false)
    const checkOldPassword = async () => {
        try {
            const payload = encryptPayload({
                userName: formData.userName,
                oldPassword: formData.oldPassword
            });

            const res = await checkOldPasswordService(payload);

            if (res?.status === 200 && res?.data.outcome === true) {
                setIsOldPasswordValid(true);
                toast.success(res?.data.message)
            } else {
                setIsOldPasswordValid(false);
                toast.error("Old password is incorrect");
            }
        } catch (error) {
            console.error(error);
            setIsOldPasswordValid(false);
        }
    };
    const [open, setOpen] = useState(false)
    const confirmHandleSubmit = (e) => {
        e.preventDefault()
        let newErrors = {}
        if (!formData.userName || !formData.userName.trim()) {
            newErrors.userName = "User name is required";
            setErrors(newErrors);
            return;
        }
        if (!formData.oldPassword || !formData.oldPassword.trim()) {
            newErrors.oldPassword = "Old password is required";
            setErrors(newErrors);
            return;
        }
        if (!formData.newPassword || !formData.newPassword.trim()) {
            newErrors.newPassword = "New password is required";
            setErrors(newErrors);
            return;
        }
        if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm new password";
            setErrors(newErrors);
            return;
        }
        if (Object.keys(newErrors).length === 0) {
            setOpen(true)
        }
        else {
            setOpen(false)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const sendData = {
                userName: formData.userName,
                txtPass: formData.newPassword,
                txtRePass: formData.confirmPassword
            }
            const payload = encryptPayload(sendData)
            const res = await changePasswordService(payload)
            console.log(res);
            if (res?.status === 200 && res?.data.outcome === true) {
                setOpen(false)
                toast.success(res?.data.message)
                setFormData({
                    ...formData,
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }
            else {
                setOpen(false)
                toast.error(res?.data.message)
                setFormData({
                    ...formData,
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }

        } catch (error) {
            throw error
        }
    }



    useEffect(() => {
        getUserDetails()
    }, [])


    return (
        <form action="" onSubmit={confirmHandleSubmit}>
            <div
                className="
            mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
            shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          "
            >
                {/* Header */}
                <div className="p-0">
                    <h3
                        className="
                flex items-center gap-2 text-white font-normal text-[18px]
                border-b-2 border-[#ff9800] px-3 py-2
                bg-light-dark rounded-t-md
              "
                    >
                        <FiFileText
                            className="
                  text-[#fff2e7] text-[24px] p-1
                  bg-[#ff7900] rounded
                "
                        />
                        Change Password
                    </h3>
                </div>

                {/* Body */}
                <div className="min-h-[120px] py-5 px-4 text-[#444]">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-2">
                            <InputField label="User Id" required={true} name={'userName'} onChange={handleChange} value={formData.userName} disabled={true} />
                        </div>
                        <div className="col-span-2">
                            <InputField label="Old Password" type='password' required={true} name={'oldPassword'} onChange={handleChange} value={formData.oldPassword} onBlur={handleOldPasswordBlur} />
                        </div>
                        <div className="col-span-2">
                            <InputField label="New Password" type='password' required={true} name={'newPassword'} onChange={handleChange} value={formData.newPassword} error={errors.newPassword} disabled={!isOldPasswordValid} />
                        </div>
                        <div className="col-span-2">
                            <InputField label="Confirm Password" type='password' required={true} name={'confirmPassword'} onChange={handleChange} value={formData.confirmPassword} error={errors.confirmPassword} disabled={!isOldPasswordValid} />
                        </div>
                        <div className="col-span-3">
                            <div className="flex justify-start gap-2 text-[13px] px-4 py-6 rounded-b-md">
                                <ResetBackBtn />
                                <SubmitBtn />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 mt-4 rounded-md border border-[#e6e6e6] bg-[#f9fafb] text-[13px] text-[#444]">
                        <p className="font-semibold text-[#222] mb-2">
                            Password Requirements
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Password length must be <span className="font-medium">8–15 characters</span></li>
                            <li>At least <span className="font-medium">one lowercase letter (a–z)</span></li>
                            <li>At least <span className="font-medium">one uppercase letter (A–Z)</span></li>
                            <li>At least <span className="font-medium">one number (0–9)</span></li>
                            <li>At least <span className="font-medium">one special character (@ / * #)</span></li>
                        </ul>
                    </div>


                </div>
            </div>
            <ReusableDialog
                open={open}
                // title="Submit"
                description="Are you sure you want to submit?"
                onClose={() => setOpen(false)}
                onConfirm={handleSubmit}
            />
        </form>
    )
}

export default ChangePassword
