import React from "react";
import { FiFileText } from "react-icons/fi";
import Box from "@mui/material/Box";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TreeNode from "../../components/TreeNode";

const RoleMenuMap = () => {
  return (
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
        {/* <TreeNode/> */}
        <Box>
          <SimpleTreeView
            checkboxSelection
            sx={{
              "& .MuiTreeItem-root": {
                borderRadius: "10px",
                p: "4px 8px",
                mb: "6px",
              },
              "& .MuiTreeItem-content": {
                borderRadius: "10px",
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
            {/* Parent Node */}
            <TreeItem
              itemId="grid"
              label={
                <div className="flex items-center gap-3">
                  <span className="p-1 rounded-full bg-orange-500/10 text-[#ff8b00]">
                    <FolderIcon fontSize="small" />
                  </span>
                  <span className="text-[15px] font-semibold">Data Grid</span>
                </div>
              }
            >
              {/* Child Node */}
              <TreeItem
                itemId="grid-community"
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
                      <p className="text-sm font-medium">@mui/x-data-grid</p>
                    </div>

                    <p className="text-sm px-2 py-1 bg-gray-200 rounded-md font-semibold">
                      /get-manage-user
                    </p>
                  </div>
                }
              />
            </TreeItem>
            <TreeItem
              itemId="comm"
              label={
                <div className="flex items-center gap-3">
                  <span className="p-1 rounded-full bg-orange-500/10 text-[#ff8b00]">
                    <FolderIcon fontSize="small" />
                  </span>
                  <span className="text-[15px] font-semibold">Data Grid</span>
                </div>
              }
            >
              {/* Child Node */}
              <TreeItem
                itemId="comm-child"
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
                      <p className="text-sm font-medium">@mui/x-data-grid</p>
                    </div>

                    <p className="text-sm px-2 py-1 bg-gray-200 rounded-md font-semibold">
                      /get-manage-user
                    </p>
                  </div>
                }
              />
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </div>

      {/* Footer (Optional) */}
      {/* <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
        <ResetBackBtn />
        <SubmitBtn />
      </div> */}
    </div>
  );
};

export default RoleMenuMap;
