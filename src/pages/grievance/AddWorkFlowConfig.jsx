import React, { useState } from 'react'
import { ResetBackBtn, SubmitBtn } from '../../components/common/CommonButtons';
import { Accordion, AccordionDetails, AccordionSummary } from '../../components/common/CommonAccordion';
import { Typography } from '@mui/material';
import SelectField from '../../components/common/SelectField';
import InputField from '../../components/common/InputField';

const AddWorkFlowConfig = () => {
    const [expanded, setExpanded] = useState("panel1");

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };



    return (
        <>
            <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
            >
                <AccordionSummary
                    arrowcolor="#fff"
                    sx={{
                        backgroundColor: "#f4f0f2",
                    }}
                >
                    <Typography
                        component="span"
                        sx={{
                            fontSize: "14px",
                            color: "#2c0014",
                        }}
                    >
                        Add Workflow
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <div className="p-3">
                        <form
                            className="grid grid-cols-12 gap-6"
                        >
                            <div className="col-span-2">
                                <SelectField
                                    label="Grievance Category"
                                    required={true}
                                    name="roleId"

                                    placeholder="Select"
                                // options={roleOpts?.map((i) => ({
                                //     value: i.roleCode,
                                //     label: i.displayName,
                                // }))}
                                // error={errors.roleId}
                                />
                            </div>

                            <div className="col-span-4">
                                <SelectField
                                    label="Sub-Grievance Type"
                                    required={true}
                                    name="roleId"

                                    placeholder="Select"
                                // options={roleOpts?.map((i) => ({
                                //     value: i.roleCode,
                                //     label: i.displayName,
                                // }))}
                                // error={errors.roleId}
                                />
                            </div>

                            <div className="col-span-2">
                                <InputField
                                    label="Rout Type"
                                    required={true}
                                    name="roleId"

                                // options={roleOpts?.map((i) => ({
                                //     value: i.roleCode,
                                //     label: i.displayName,
                                // }))}
                                // error={errors.roleId}
                                />
                            </div>

                            <div className="col-span-2">
                                <SelectField
                                    label="From Stage"
                                    required={true}
                                    name="roleId"

                                    placeholder="Select"
                                // options={roleOpts?.map((i) => ({
                                //     value: i.roleCode,
                                //     label: i.displayName,
                                // }))}
                                // error={errors.roleId}
                                />
                            </div>

                            <div className="col-span-2">
                                <SelectField
                                    label="To Stage"
                                    required={true}
                                    name="roleId"

                                    placeholder="Select"
                                // options={roleOpts?.map((i) => ({
                                //     value: i.roleCode,
                                //     label: i.displayName,
                                // }))}
                                // error={errors.roleId}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-[13px] font-medium text-gray-700">
                                    Show in page ? <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-5 items-center">
                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            value={"Yes"}
                                            name="areaType"
                                            // checked={
                                            //   stateSelect?.areaType === "BLOCK" ? true : false
                                            // }
                                            id="radio1"
                                        />
                                        <label
                                            htmlFor="radio1"
                                            className="text-sm text-slate-800"
                                        >
                                            Yes
                                        </label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            value={"No"}
                                            name="areaType"
                                            // checked={
                                            //   stateSelect?.areaType === "MUNICIPALITY"
                                            //     ? true
                                            //     : false
                                            // }
                                            id="radio2"
                                        />
                                        <label
                                            htmlFor="radio2"
                                            className="text-sm text-slate-800"
                                        >
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="text-[13px] font-medium text-gray-700">
                                   In First Stage ? <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-5 items-center">
                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            value={"Yes"}
                                            name="areaType"
                                            // checked={
                                            //   stateSelect?.areaType === "BLOCK" ? true : false
                                            // }
                                            id="radio1"
                                        />
                                        <label
                                            htmlFor="radio1"
                                            className="text-sm text-slate-800"
                                        >
                                            Yes
                                        </label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            value={"No"}
                                            name="areaType"
                                            // checked={
                                            //   stateSelect?.areaType === "MUNICIPALITY"
                                            //     ? true
                                            //     : false
                                            // }
                                            id="radio2"
                                        />
                                        <label
                                            htmlFor="radio2"
                                            className="text-sm text-slate-800"
                                        >
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="text-[13px] font-medium text-gray-700">
                                   In Last Stage ? <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-5 items-center">
                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            value={"Yes"}
                                            name="areaType"
                                            // checked={
                                            //   stateSelect?.areaType === "BLOCK" ? true : false
                                            // }
                                            id="radio1"
                                        />
                                        <label
                                            htmlFor="radio1"
                                            className="text-sm text-slate-800"
                                        >
                                            Yes
                                        </label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            value={"No"}
                                            name="areaType"
                                            // checked={
                                            //   stateSelect?.areaType === "MUNICIPALITY"
                                            //     ? true
                                            //     : false
                                            // }
                                            id="radio2"
                                        />
                                        <label
                                            htmlFor="radio2"
                                            className="text-sm text-slate-800"
                                        >
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <SelectField
                                    label="Action"
                                    required={true}
                                    name="roleId"

                                    placeholder="Select"
                                // options={roleOpts?.map((i) => ({
                                //     value: i.roleCode,
                                //     label: i.displayName,
                                // }))}
                                // error={errors.roleId}
                                />
                            </div>


                            <div className="col-span-3">
                                <div className="flex justify-start gap-2 mt-7 ">
                                    <ResetBackBtn />
                                    <SubmitBtn type={"submit"} />
                                </div>
                            </div>
                        </form>
                    </div>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default AddWorkFlowConfig
