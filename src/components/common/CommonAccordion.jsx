import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, { accordionSummaryClasses, } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";


export const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    marginBottom: "10px",
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
        borderBottom: 0,
    },
    "&::before": {
        display: "none",
    },
}));

export const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderLeft: "5px solid #ff8c00",
    flexDirection: "row",
    display: "flex",
    alignItems: "center",

    "&.MuiAccordionSummary-root": {
        minHeight: "30px",
        height:"40px",
        paddingTop: 0,
        paddingBottom: 0,
    },

    "&.MuiAccordionSummary-root.Mui-expanded": {
        minHeight: "30px",
        height:"40px",
    },

    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        minHeight: "30px",
    },

    [`& .${accordionSummaryClasses.content}.Mui-expanded`]: {
        minHeight: "30px",
        height:"40px",
    },

    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: "rotate(90deg)",
    },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
}));