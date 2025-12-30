import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { ResetBackBtn, SubmitBtn } from '../../components/common/CommonButtons'
import SearchableInput from '../../components/common/SearchableInput'
import SelectField from '../../components/common/SelectField'
import { encryptPayload } from '../../crypto.js/encryption'
import { getAccessLevelConfigService, getConfigListService, roleConfigListService, saveConfigAccessService, userSearchService } from '../../services/umtServices'
import { toast } from 'react-toastify'

const ConfigureAccess = () => {

    const [formData, setFormData] = useState({
        userId: '',
        roleId: '',
        accessLevel: ''
    })
    const [isUserSelected, setIsUserSelected] = useState(false);

    const [count, setCount] = useState(1); // current page (1-based)
    const [pageSize, setPageSize] = useState(10);

    const [pageInfo, setPageInfo] = useState({
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: false
    });


    const [userOpts, setUserOpts] = useState([])
    const [roleOpts, setRoleOpts] = useState([])
    const [accessLevelOpts, setAccessLevelOpts] = useState([])
    const getUserOpts = async () => {
        try {
            const payload = encryptPayload(formData.userId)
            const res = await userSearchService(payload)
            // console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                setUserOpts(res?.data.data)
            }
        } catch (error) {
            throw error
        }
    }
    const getRoleOpts = async () => {
        try {
            const payload = encryptPayload(formData.userId)
            const res = await roleConfigListService(payload)
            console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                setRoleOpts(res?.data.data)
            }
        } catch (error) {
            throw error
        }
    }
    const getAccessLevelOpts = async () => {
        try {
            const payload = encryptPayload(formData.roleId)
            const res = await getAccessLevelConfigService(payload)
            console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                setAccessLevelOpts(res?.data.data)
            }
        } catch (error) {
            throw error
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const [columnNames, setColumnNames] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [primaryKey, setPrimaryKey] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const sendData = {
                userId: Number(formData.userId),
                roleId: Number(formData.roleId),
                roleLevelMasterId: Number(formData.accessLevel),
                size: pageSize,
                page: count - 1
            };
            const res = await getConfigListService(sendData);
            console.log(res);
            if (res?.status === 200 && res?.data.outcome) {
                setColumnNames(res?.data.columnMetaData);
                setTableData(res?.data.data);
                setPrimaryKey(res?.data.primaryKey);
                setCheckedBoxes(res?.data.allotedRowIds.map(Number))
                const pageData = res.data.data;
                setPageInfo({
                    totalPages: pageData.totalPages,
                    totalElements: pageData.totalElements,
                    first: pageData.first,
                    last: pageData.last
                });
            }
        } catch (error) {
            console.error(error);
        }
    };




    useEffect(() => {
        if (formData.userId) {
            getUserOpts()
        }
    }, [formData.userId])
    useEffect(() => {
        if (isUserSelected && formData.userId) {
            getRoleOpts();
        }
    }, [isUserSelected, formData.userId]);
    useEffect(() => {
        if (formData.roleId) {
            getAccessLevelOpts()
        }
    }, [formData.roleId])

    const [checkedBoxes, setCheckedBoxes] = useState([])

    const allowedColumns = [
        "block_code",
        "district_code",
        "block_name_en",
        "block_name_hi",
        "district_name",
        "district_name",
        "district_id",
        "is_active"
    ];
    const filteredColumns = Object.values(columnNames).filter(col =>
        allowedColumns.includes(col)
    );
    const handleCheckboxChange = async (e, row) => {
        const objectId = Number(row?.[primaryKey]);
        if (!objectId) return;

        if (e.target.checked) {
            try {
                const sendData = {
                    userId: Number(formData.userId),
                    roleId: Number(formData.roleId),
                    roleLevelMasterId: Number(formData.accessLevel),
                    objectId
                };

                const res = await saveConfigAccessService(sendData);

                if (res?.status === 200 && res?.data.outcome) {
                    setCheckedBoxes(prev => [...prev, objectId]);
                    toast.success(res?.data.message);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCheckedBoxes(prev => prev.filter(id => id !== objectId));
        }
    };

    useEffect(() => {
        if (formData.userId && formData.roleId && formData.accessLevel) {
            handleSubmit(new Event("submit"));
        }
    }, [count, pageSize]);

    useEffect(() => {
        setCount(1);
    }, [pageSize]);



    return (
        <form action="" onSubmit={handleSubmit}>
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
                        Configure Access
                    </h3>
                </div>

                {/* Body */}
                <div className="min-h-[120px] py-5 px-4 text-[#444]">
                    {/* Content Here */}
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-2">
                            <SearchableInput
                                label="User Id"
                                required
                                placeholder=''
                                name="userId"
                                value={formData.userId}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setIsUserSelected(false);
                                }}

                                onSelect={(option) => {
                                    setIsUserSelected(true);
                                }}
                                options={userOpts?.map((i) => ({
                                    label: `${i.userName} (${i.firstName} ${i.lastName ? i.lastName : ""})`,
                                    value: i.userId,
                                }))}

                            // error={errors.userId}
                            />
                        </div>
                        <div className="col-span-2">
                            <SelectField
                                label="Role"
                                required={true}
                                name="roleId"
                                placeholder="Select"
                                value={formData.roleId}
                                disabled={!isUserSelected}
                                options={roleOpts?.map((i) => ({
                                    label: i.displayName,
                                    value: i.roleId
                                }))}
                                onChange={handleInputChange}
                            // error={errors.roleId}
                            />
                        </div>
                        <div className="col-span-2">
                            <SelectField
                                label="Access Level"
                                required={true}
                                name="accessLevel"
                                placeholder="Select"
                                value={formData.accessLevel}
                                disabled={formData.roleId ? false : true}
                                options={accessLevelOpts?.map((i) => ({
                                    label: i.displayName,
                                    value: i.roleRightLevelId
                                }))}
                                onChange={handleInputChange}
                            // error={errors.finyearId}
                            />
                        </div>
                        <div className="col-span-2">
                            <div className="flex justify-center gap-2 text-[13px] px-4 py-6.5 ">
                                <ResetBackBtn />
                                <SubmitBtn type={"submit"} />
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {
                Object.keys(columnNames).length > 0 && tableData.length > 0 && (
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
                                Configure Access List
                            </h3>
                        </div>

                        {/* Body */}
                        <div className="min-h-[120px] py-5 px-4 text-[#444]">
                            <table className="w-full border border-slate-300 border-collapse">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="w-16 text-center text-sm font-semibold px-2 py-2 border border-slate-200">
                                            Select
                                        </th>
                                        {filteredColumns.map((col, index) => (
                                            <th
                                                key={index}
                                                className="text-center text-sm font-semibold px-2 py-2 border border-slate-200 capitalize"
                                            >
                                                {(col).split("_").join(" ")}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {tableData.map((row, rowIndex) => (
                                        <tr key={rowIndex} className=''>
                                            <td className="text-center px-2 py-1 border border-slate-200">
                                                <input type="checkbox" onChange={(e) => handleCheckboxChange(e, row)} checked={checkedBoxes.includes(Number(row?.[primaryKey]))} />
                                            </td>

                                            {filteredColumns.map((colKey, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="text-sm px-2 py-2 border border-slate-200 uppercase"
                                                >
                                                    {row[colKey] ?? "-"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>

                            </table>


                            <div className="col-span-12 grid grid-cols-12 items-center mt-3">

                                <div className="col-span-6 flex items-center gap-1">
                                    <label className="text-sm">Show</label>
                                    <select
                                        name="size"
                                        value={pageSize}
                                        onChange={(e) => setPageSize(Number(e.target.value))}
                                        className="px-2 border border-slate-400"
                                    >
                                        <option value={10}>10</option>
                                        <option value={50}>50</option>
                                        <option value={75}>75</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <span className="text-sm">Pages</span>
                                </div>

                                <div className="col-span-6 flex flex-col items-end gap-2 justify-end w-full">
                                    <label className="text-sm">
                                        Showing page {count} of {pageInfo.totalPages} pages
                                    </label>

                                    <div className="flex gap-2 justify-end mt-1">
                                        <div className="flex gap-2 justify-end mt-1">
                                            <button
                                                className="px-2 py-0.5 bg-slate-200 text-[11px]"
                                                disabled={pageInfo.first}
                                                onClick={() => setCount(1)}
                                            >
                                                First
                                            </button>

                                            <button
                                                className="px-2 py-0.5 bg-slate-200 text-[11px]"
                                                disabled={pageInfo.first}
                                                onClick={() => setCount(prev => Math.max(prev - 1, 1))}
                                            >
                                                Previous
                                            </button>

                                            <button
                                                className="px-2 py-0.5 bg-slate-200 text-[11px]"
                                                disabled={pageInfo.last}
                                                onClick={() => setCount(prev => prev + 1)}
                                            >
                                                Next
                                            </button>

                                            <button
                                                className="px-2 py-0.5 bg-slate-200 text-[11px]"
                                                disabled={pageInfo.last}
                                                onClick={() => setCount(pageInfo.totalPages)}
                                            >
                                                Last
                                            </button>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                )
            }



        </form>
    )
}

export default ConfigureAccess
