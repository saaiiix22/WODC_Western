// components/CommonFormModal.jsx
import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CommonFormModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 520,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          maxHeight: "85vh",
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #2a2e34, #2a2e34)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            p: 3,
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        {footer && (
          <>
            <Divider />
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                bgcolor: "#f9fafb",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              {footer}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CommonFormModal;
