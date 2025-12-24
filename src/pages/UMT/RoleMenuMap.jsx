import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import Box from "@mui/material/Box";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import { getAllMenuService, getAllRolesService, saveRoleMenuMapService } from "../../services/umtServices";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";

const RoleMenuMap = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    roleId: ''
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectionChange = (event, itemIds) => {
    setSelectedItems(itemIds);
  };
  // console.log(selectedItems);


  const [roleOpts, setRoleOpts] = useState([])
  const allRoles = async () => {
    try {
      const payload = encryptPayload({ isActive: true })
      const res = await getAllRolesService(payload)
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setRoleOpts(res?.data.data)
      }
    } catch (error) {
      throw error
    }
  }
  const [menuList, setMenuList] = useState([])
  const getAllMenu = async () => {
    try {
      const payload = encryptPayload(null)
      const res = await getAllMenuService(payload)
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setMenuList(res?.data.data)
      }
    } catch (error) {
      throw error
    }
  }

  const getRoleWiseMenu = async () => {
    try {
      const payload = encryptPayload("ROLE_MENU_MAP")
      const res = await getAllMenuService(payload)
      console.log(res);

    } catch (error) {
      throw error
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const sendData = {
        roleCode: formData.roleId,
        menuIds: selectedItems
      }
      const payload = encryptPayload(sendData)
      const res = await saveRoleMenuMapService(payload)
      console.log(res);

    } catch (error) {
      throw error
    }
  }



  useEffect(() => {
    allRoles()
    getAllMenu()
  }, [])
  useEffect(() => {
    if (formData.roleId) {
      getRoleWiseMenu()
    }
  }, [formData.roleId])

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
            Role Menu Mapping
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <SelectField
                label="Role"
                required={true}
                name="roleId"
                value={formData.roleId}
                placeholder="Select"
                onChange={handleInputChange}
                options={roleOpts?.map((i) => ({
                  value: i.roleCode,
                  label: i.displayName
                }))}
              />
            </div>

            <div className="col-span-12">
              <Box>
                <SimpleTreeView
                  checkboxSelection
                  multiSelect
                  selectedItems={selectedItems}
                  onSelectedItemsChange={handleSelectionChange}
                  sx={{
                    "& .MuiTreeItem-root": {
                      p: "4px 8px",
                      mb: "6px",
                    },
                    "& .MuiTreeItem-content": {
                      py: "6px",
                      px: "8px",
                    },
                    "& .MuiTreeItem-content:hover": {
                      bgcolor: "#f9fafb",
                    },
                    "& .MuiTreeItem-label": {
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "#374151",
                    },
                  }}
                >
                  {/* Parent 1 */}
                  {menuList?.map((menu) => (
                    <TreeItem
                      key={menu.menuId}
                      itemId={menu.menuId}
                      label={
                        <div className="flex items-center gap-3">
                          <span className="p-1 rounded-full bg-orange-500/10 text-[#ff8b00]">
                            <FolderIcon fontSize="small" />
                          </span>
                          <span className="text-[15px] font-semibold">
                            {menu?.title}
                          </span>
                        </div>
                      }
                    >
                      {menu.subMenu?.map((submenu) => (
                        <TreeItem
                          key={submenu.menuId}
                          itemId={submenu.menuId}
                          sx={{
                            mt: 1,
                            ml: 2,
                            "& .MuiTreeItem-content": {
                              bgcolor: "#f3f4f6",
                            },
                            "& .MuiTreeItem-content:hover": {
                              bgcolor: "#e5e7eb",
                            },
                          }}
                          label={
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <InsertDriveFileIcon
                                  className="text-gray-500"
                                  fontSize="small"
                                />
                                <p className="text-sm font-medium">
                                  {submenu.title}
                                </p>
                              </div>
                              <p className="text-sm px-2 py-1 bg-gray-200 rounded-md font-semibold">
                                {submenu.link}
                              </p>
                            </div>
                          }
                        />
                      ))}
                    </TreeItem>
                  ))}

                </SimpleTreeView>
              </Box>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
        <SubmitBtn type={"submit"} />
        </div>
      </div>
    </form>
  );
};

export default RoleMenuMap;
