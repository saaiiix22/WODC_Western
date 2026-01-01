import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { GoPencil } from 'react-icons/go'
import { MdLockOpen, MdLockOutline } from 'react-icons/md'
import { FaEye } from 'react-icons/fa'
import { editUserService, toggleUserStatusService, userListService } from '../../services/umtServices'
import { encryptPayload } from '../../crypto.js/encryption'
import { data, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const UserList = () => {

    const [formData, setFormData] = useState({
        size: 25
    })

    const [count, setCount] = useState(1)

    const [tableData, setTableData] = useState([])

    const [pageInfo, setPageInfo] = useState({
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: false
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const getTableData = async () => {
        try {
            const res = await userListService({
                size: formData.size,
                page: count - 1 
            })
            console.log(res);
            
            if (res?.status === 200 && res?.data?.outcome) {
                const pageData = res.data.data

                setTableData(pageData.content)
                setPageInfo({
                    totalPages: pageData.totalPages,
                    totalElements: pageData.totalElements,
                    first: pageData.first,
                    last: pageData.last
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const navigate = useNavigate()
    const ViewUser = async(id)=>{
        try {
            const sendData = {
                userId:Number(id),
                isActive:false
            }
            const payload = encryptPayload(sendData)
            const res = await editUserService(payload)
            console.log(res);
            if(res?.status === 200 && res?.data.outcome){
                navigate('/addUser',{state:res?.data.data})
            }
        } catch (error) {
            throw error
        }
    }

    const editUser = async(id)=>{
        try {
            const sendData = {
                userId:Number(id),
                isActive:true
            }
            const payload = encryptPayload(sendData)
            const res = await editUserService(payload)
            console.log(res);
            if(res?.status === 200 && res?.data.outcome){
                navigate('/addUser',{state:res?.data.data})
            }
        } catch (error) {
            throw error
        }
    }

    const toggleStatus = async(id,stat)=>{
        try {
            const sendData = {
                userId:id,
                isActive:!stat
            }
            const payload = encryptPayload(sendData)
            const res = await toggleUserStatusService(payload)
            console.log(res);
            if(res?.status === 200 && res?.data.outcome){
                getTableData()
               toast.success(res?.data.message)
            }
        } catch (error) {
            throw error
        }
    }


    useEffect(() => {
        getTableData()
    }, [formData.size, count])

    useEffect(() => {
        setCount(1)
    }, [formData.size])

    

    return (
        <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">

            {/* Header */}
            <div className="p-0">
                <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
                    <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
                    User List
                </h3>
            </div>

            {/* Body */}
            <div className="min-h-[120px] py-5 px-4 text-[#444]">
                <div className="grid grid-cols-12 gap-6">

                    {/* Table */}
                    <div className="col-span-12">
                        <table className="table-fixed w-full border border-slate-300 mt-5">
                            <thead className="bg-slate-100">
                                <tr>
                                    <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200 ">SL No</td>
                                    <td className="text-center text-sm font-semibold px-4 py-3 border-r border-slate-200 ">Username</td>
                                    <td className="text-center text-sm font-semibold px-4 py-3 border-r border-slate-200 ">User Id</td>
                                    <td className="text-center text-sm font-semibold px-4 py-3 border-r border-slate-200 ">Mobile No.</td>
                                    <td className="text-center text-sm font-semibold px-4 py-3 border-r border-slate-200 ">Email Id</td>
                                    <td className="text-center text-sm font-semibold px-4 py-3 border-r border-slate-200 ">Created On</td>
                                    <td className="text-center text-sm font-semibold px-4 py-3 border-r border-slate-200 ">Action</td>
                                </tr>
                            </thead>

                            <tbody>
                                {tableData.map((i, index) => (
                                    <tr className={`border-b border-slate-200 ${(index+1)%2===0?"bg-slate-50":""}`} key={index}>
                                        <td className="border-r border-slate-200  text-center py-1 px-3 text-sm">
                                            {(count - 1) * formData.size + index + 1}
                                        </td>
                                        <td className="border-r border-slate-200 py-1 px-3 text-sm">{i.userName}</td>
                                        <td className="border-r border-slate-200 py-1 px-3 text-sm">{i.userId}</td>
                                        <td className="border-r border-slate-200 py-1 px-3 text-sm">{i.mobile}</td>
                                        <td className="border-r border-slate-200 py-1 px-3 text-sm">{i.email}</td>
                                        <td className="border-r border-slate-200 py-1 px-3 text-sm"></td>

                                        <td className="border-r border-slate-200 py-1 px-3 text-sm flex items-center gap-3">
                                            <button className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center" onClick={()=>ViewUser(i.userId)}>
                                                <FaEye />
                                            </button>

                                            <button className="h-8 w-8 bg-yellow-500/25 text-yellow-500 rounded-sm flex justify-center items-center" onClick={()=>editUser(i.userId)}>
                                                <GoPencil />
                                            </button>

                                            <button
                                                className={`h-8 w-8 rounded-sm flex justify-center items-center
                                                    ${i.isActive
                                                        ? "bg-green-600/25 text-green-600"
                                                        : "bg-red-500/25 text-red-500"
                                                    }`}
                                                    onClick={()=>toggleStatus(i.userId,i.isActive)}
                                            >
                                                {i.isActive ? <MdLockOutline /> : <MdLockOpen />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="col-span-12 grid grid-cols-12 items-center mt-3">

                        <div className="col-span-6 flex items-center gap-1">
                            <label className="text-sm">Show</label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="px-2 border border-slate-400"
                            >
                                <option value={25}>25</option>
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

export default UserList
