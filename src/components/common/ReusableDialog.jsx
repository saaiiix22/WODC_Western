import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ReusableDialog = ({ open, title, description, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          width: 480,
          maxWidth: "90vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(255,255,255,0.8)",
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.375rem",
          color: "#404040",
          background: "rgba(25, 118, 210, 0.02)",
          borderBottom: "1px solid rgba(25, 118, 210, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 1,
          paddingRight: 2,
        }}
      >
        <Box sx={{ fontSize: "1.25rem", textAlign: "start" }}>
          <Box
            sx={{
              fontSize: "1.25rem",
              display: "flex",
              justifyContent: "start",
            }}
          />
          {title}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#666",
            padding: "8px",
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#dc1919ff",
              backgroundColor: "rgba(218, 43, 81, 0.08)",
              transform: "scale(1.1)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "1.25rem" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <DialogContentText
          sx={{
            fontSize: "18px",
            color: "#424242",
            lineHeight: 1,
            mt: 2,
            textAlign: "start",
            px: 1,
          }}
        >
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          // color="error"
          variant="outlined"
          sx={{
            color: "#404040",
            borderColor: "#404040",
            background: "#e3e3e3",
          }}
          size="small"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="outlined"
          // color="success"
          sx={{
            background: "#bbef7f",
            color: "green",
            borderColor: "green",
          }}
          size="small"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableDialog;
