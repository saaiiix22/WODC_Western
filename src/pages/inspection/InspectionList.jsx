import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { data, useLocation, useNavigate } from 'react-router-dom'
import { encryptPayload } from '../../crypto.js/encryption'
import { getInspectionByIdService, saveInspectionSerice } from '../../services/inspectionService'
import { GrSave } from 'react-icons/gr'
import { ResetBackBtn } from '../../components/common/CommonButtons'
import { toast } from 'react-toastify'
import InputField from '../../components/common/InputField'
import CommonFormModal from '../../components/common/CommonFormModal'

const InspectionList = () => {
    const id = useLocation()
    const [forwardedId, setForwardedId] = useState(null);
    const [inspectionDetails, setInspectionDetails] = useState({})
    const [button, setButton] = useState([])
    const [pendingAction, setPendingAction] = useState(null);
    const [showRejectionModal, setRejectionModal] = useState(false)

    const getInspectionById = async () => {
        try {
            const payload = encryptPayload({ inspectionId: id.state.inspectionId, isViewMode: false });
            const res = await getInspectionByIdService(payload);
            console.log(res);
            if (res?.data.outcome) {
                setInspectionDetails(res?.data.data)
                setButton(res?.data?.data?.stageForwardedRuleDtos)
            }
        } catch (err) {
            console.log(err);
        }
    };
    const navigate = useNavigate()
    const handleSubmit = async (forwardId) => {
        try {
            const payload = encryptPayload({
                inspectionId: inspectionDetails?.inspectionId,
                projectId: inspectionDetails?.projectId,
                agencyId: inspectionDetails?.agencyId,
                milestoneId: inspectionDetails?.milestoneId,
                startDate: inspectionDetails?.startDate,
                endDate: inspectionDetails?.endDate,
                phaseCode: inspectionDetails?.phaseCode,
                forwardedId: forwardId,
                remarks:formData.remarks
            })
            const res = await saveInspectionSerice(payload)
            console.log(res);
            if (res?.data.outcome) {
                toast.success(res?.data.message)
                navigate('/inspection')
            }
        } catch (error) {
            console.log(error);
        }
    }
    const [formData, setFormData] = useState({
        remarks: ""
    })
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({...formData,[name]:value})
    }
    const handleRemarksSubmit = () => {
        if ((!formData.remarks || !formData.remarks.trim()) && pendingAction.actionType.actionCode != "APPROVED") {
            toast.error("Remarks are mandatory");
            return;
        }
        setForwardedId(pendingAction?.forwardedId);
        const id = pendingAction?.forwardedId;

        setRejectionModal(false);
        setPendingAction(null);

        handleSubmit(id);
    };

    useEffect(() => {
        getInspectionById()
    }, [])

    console.log(button);
    

    return (
        <div className="mt-3 p-2 bg-white shadow rounded">
            <h3
                className="
                  flex items-center gap-2 text-white font-normal text-[16px]
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
                Inspection List
            </h3>
            <div className="grid grid-cols-12 gap-6 p-4">
                <div class="col-span-12 mt-3">
                    <div class="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                        <span class="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">Inspection Details</span>
                        <div class="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                            <div className="col-span-3 flex gap-1">
                                <span className="font-normal text-gray-700">Agency Name</span>:
                                <span className="text-slate-900 font-semibold uppercase">
                                    {inspectionDetails?.agencyName}
                                </span>
                            </div>

                            <div className="col-span-3 flex gap-1">
                                <span className="font-normal text-gray-700">Project Name</span>:
                                <span className="text-slate-900 font-semibold uppercase">
                                    {inspectionDetails?.projectName}
                                </span>
                            </div>

                            <div className="col-span-3 flex gap-1">
                                <span className="font-normal text-gray-700">Milestone</span>:
                                <span className="text-slate-900 font-semibold uppercase">
                                    {inspectionDetails?.milestoneName}
                                </span>
                            </div>

                            <div className="col-span-3 flex gap-1">
                                <span className="font-normal text-gray-700">Phase</span>:
                                <span className="text-slate-900 font-semibold uppercase">
                                    {inspectionDetails?.phaseName}
                                </span>
                            </div>

                            <div className="col-span-3 flex gap-1">
                                <span className="font-normal text-gray-700">Start Date</span>:
                                <span className="text-slate-900 font-semibold">
                                    {inspectionDetails?.startDate}
                                </span>
                            </div>

                            <div className="col-span-3 flex gap-1">
                                <span className="font-normal text-gray-700">End Date</span>:
                                <span className="text-slate-900 font-semibold">
                                    {inspectionDetails?.endDate}
                                </span>
                            </div>

                            <div className="col-span-3 flex gap-1">
                                <span className="font-normal text-gray-700">Status</span>:
                                <span className="text-green-700 font-semibold uppercase">
                                    {inspectionDetails?.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                <ResetBackBtn />

                {button?.map((i, index) => {
                    return (
                        <button
                            key={index}
                            type="button"
                            className={i?.actionType.color}
                            onClick={(e) => {
                                if (
                                    i?.actionType.actionCode === "REVERTED" ||
                                    i?.actionType.actionCode === "REJECTED" ||
                                    i?.actionType.actionCode === "APPROVED"
                                ) {
                                    setPendingAction(i);
                                    setRejectionModal(true);
                                    e.preventDefault();
                                } else {
                                    setForwardedId(i.forwardedId);
                                    handleSubmit(forwardedId)
                                }
                            }}

                        >
                            <GrSave /> {i?.actionType.actionNameEn}
                        </button>
                    )
                })}
            </div>

            <CommonFormModal
                open={showRejectionModal}
                onClose={() => setRejectionModal(false)}
                title="Add Remarks"
                subtitle="Remarks are mandatory for this action"
                footer={
                    <>
                        <button
                            type="button"
                            className="bg-green-500 text-white text-[13px] px-3 py-1 rounded-sm border border-green-600 transition-all active:scale-95 uppercase flex items-center gap-1"
                            onClick={handleRemarksSubmit}
                        >
                            Submit
                        </button>
                    </>
                }
            >
                <InputField
                    label="Remarks"
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    textarea={true}
                    required={pendingAction?.status.statusCode != "APPROVED"}
                    onChange={handleChangeInput}
                />
            </CommonFormModal>

        </div>
    )
}

export default InspectionList
