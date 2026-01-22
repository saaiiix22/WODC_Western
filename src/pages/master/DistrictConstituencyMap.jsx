import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { districtListByConstituencyTypeService, getConstituencyNameService, saveDistConsMapService } from '../../services/judictionMapConfigService';
import { constituencyTypeListService } from '../../services/constituencyService';
import SelectField from '../../components/common/SelectField';
import MultiSelectDropdown from '../../components/common/MultiSelectDropdown';
import { encryptPayload } from '../../crypto.js/encryption';
import { getAllDists } from '../../services/blockService';
import { ResetBackBtn, SubmitBtn } from '../../components/common/CommonButtons';
import { toast } from 'react-toastify';

const DistrictConstituencyMap = () => {

    const [formData, setFormData] = useState({
        constituencyTypeCode: "",
        constituencyName: "",
        districtIds: [],
    });
    const { constituencyTypeCode, constituencyName, districtIds } = formData;

    const handleInpChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = encryptPayload({
                consId: constituencyName,
                districtIds: districtIds
            })
            const res = await saveDistConsMapService(payload)
            console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                toast.success(res?.data.message)
                setFormData({
                    constituencyTypeCode: "",
                    constituencyName: "",
                    districtIds: [],
                })
            }

        } catch (error) {
            console.log(error);

        }
    }

    const [constituencyTypeOptions, setConstituencyTypeOptions] = useState([]);
    const getconstituencyOptions = async () => {
        try {
            const res = await constituencyTypeListService();
            setConstituencyTypeOptions(res?.data.data);
        } catch (error) {
            throw error;
        }
    };

    const [consName, setConsName] = useState([])
    const getconstituencyNameOptions = async () => {
        try {
            const payload = encryptPayload({
                isActive: true,
                constituencyTypeCode: constituencyTypeCode
            })
            const res = await getConstituencyNameService(payload)
            if (res?.status === 200 && res?.data.outcome) {
                setConsName(res?.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }


    const [districtListByType, setDistrictListByType] = useState([]);
    const getDistrictListByType = async () => {
        try {
            const payload = encryptPayload({
                isActive: true
            });
            const res = await getAllDists(payload);
            // console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                setDistrictListByType(res?.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getSelectedList = async () => {
        try {
            const payload = encryptPayload({
                consId: constituencyName
            })
            const res = await districtListByConstituencyTypeService(payload)
            console.log(res);
            const d = res?.data.data
            if (res?.status === 200 && res?.data.outcome) {
                // setDistrictListByType(res?.data.data);
                const arr = []
                d.map((i) => {
                    arr.push(i.districtId)
                })
                setFormData({ ...formData, districtIds: arr })
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getconstituencyOptions()
        getDistrictListByType()
    }, [])
    useEffect(() => {
        if (constituencyTypeCode) {
            getconstituencyNameOptions()
        }
    }, [constituencyTypeCode])
    useEffect(() => {
        if (constituencyName) {
            getSelectedList()
        }
    }, [constituencyName])




    return (

        <form
            onSubmit={handleSubmit}
            className="
            mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
            shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          "
        >
            {/* Header */}
            <div className="p-0">
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
                    District Constituency Map
                </h3>
            </div>

            {/* Body */}
            <div className="min-h-[120px] py-5 px-4 text-[#444]">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-2">
                        <SelectField
                            label="Constitution Type"
                            required={true}
                            name="constituencyTypeCode"
                            value={constituencyTypeCode}
                            onChange={handleInpChange}
                            // disabled={!constituencyTypeCode}
                            placeholder="Select"
                            options={constituencyTypeOptions?.map((d) => ({
                                value: d.constituencyTypeCode,
                                label: d.lookupValueEn,
                            }))}
                        />
                    </div>

                    <div className="col-span-2">
                        <SelectField
                            label="Constitution Name"
                            required={true}
                            name="constituencyName"
                            value={constituencyName}
                            disabled={!constituencyTypeCode}
                            onChange={handleInpChange}
                            placeholder="Select"
                            options={consName?.map((d) => ({
                                value: d.consId,
                                label: d.consName,
                            }))}
                        />
                    </div>

                    {/* District Dropdown */}
                    <div className="col-span-2">
                        <MultiSelectDropdown
                            label="District"
                            required={true}
                            value={districtIds}
                            name="districtIds"
                            onChange={handleInpChange}
                            placeholder="Select district"
                            options={districtListByType?.map((d) => ({
                                value: d.districtId,
                                label: d.districtName,
                            }))}
                        />
                    </div>
                    <div className="col-span-3 flex justify-start gap-2 mt-6 ">
                        <ResetBackBtn />
                        <SubmitBtn type={'submit'} />
                    </div>
                </div>

            </div>

            {/* Footer (Optional) */}

        </form>
    )
}

export default DistrictConstituencyMap
