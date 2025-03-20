import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

function ErrorPage({ onRetry, onClose }) {
  const queryParams = new URLSearchParams(window.location.search);
  const statusMsg = queryParams.get("statusMsg") || "An unknown error occurred";
  const statusCode = queryParams.get("statusCode") || "Unknown";

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh", p: 2 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            maxWidth: 900,
            width: "100%",
            bgcolor: "#fff",
            position: "relative",
          }}
        >
          {onClose && (
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#424242",
                "&:hover": { color: "#212121" },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}

          <Grid container spacing={4} alignItems="center">
            <Grid
              item
              xs={0}
              md={6}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box>
                <img
                  src="https://img.freepik.com/free-vector/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-laptop-user-cartoon-character-vector-isolated-concept-metaphor-illustration_335657-2843.jpg?t=st=1742442467~exp=1742446067~hmac=952dcf822b9c6ab5941f097264c4cbe088850ecb37845841ad36cc9aa4308313&w=900"
                  alt="Payment Error"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              textAlign={{ xs: "center", md: "left" }}
            >
              <Box sx={{ mb: 2, }}>
                <ErrorOutlineIcon sx={{ fontSize: 64, color: "#d32f2f" }} />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  color: "#424242",
                  fontWeight: "bold",
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "20px", md: "22px" },
                }}
              >
                Oops! Seomthing went wrong.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#616161",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Error Code: {statusCode}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#d32f2f",
                  fontWeight: "bold",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "18px", md: "22px" },
                }}
              >
                "{statusMsg}"
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#616161",
                  mb: 3,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Please check your network connection or try again later.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </motion.div>
  );
}

export default ErrorPage;
