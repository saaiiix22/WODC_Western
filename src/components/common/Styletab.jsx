import * as React from "react";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

/* ---------- Styled Components ---------- */

const StyledTabList = styled(TabList)(({ theme }) => ({
  backgroundColor: "#f3f4f6",
  padding: "4px",
  borderRadius: "20px",
  minHeight: "auto",

  "& .MuiTabs-indicator": {
    display: "none",
  },

  "& .MuiTab-root": {
    minHeight: "32px",
    height: "32px",
    padding: "0 16px",
    margin: "0 2px",
    borderRadius: "20px",
    textTransform: "none",
    fontSize: "12px",
    fontWeight: 500,
    color: "#6b7280",
  },

  "& .MuiTab-root.Mui-selected": {
    backgroundColor: "#4CAF50",
    color: "#ffffff",
  },
}));

const StyledTab = styled(Tab)(() => ({}));

/* ---------- Reusable Component ---------- */

const PillTabs = ({ value, onChange, tabs, align = "flex-start" }) => {
  return (
    <TabContext value={value}>
      <Box sx={{ display: "flex", justifyContent: align }}>
        <StyledTabList onChange={onChange}>
          {tabs.map((tab) => (
            <StyledTab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              disabled={tab.disabled}
            />
          ))}
        </StyledTabList>
      </Box>
    </TabContext>
  );
};

export default PillTabs;
