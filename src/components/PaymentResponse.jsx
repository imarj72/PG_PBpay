import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
function PaymentResponse() {
  const [progress, setProgress] = useState(0);
  const queryParams = new URLSearchParams(window.location.search);
  const encryptedPayload = queryParams.get("encryptedPayload");
  const merchantId = queryParams.get("merchantId");
  const keyId = queryParams.get("keyId");
  const callbackURL = queryParams.get("callbackURL");

  useEffect(() => {
    if (!encryptedPayload || !merchantId || !keyId || !callbackURL) {
      window.location.href = `http://localhost:3001/error?statusMsg=${encodeURIComponent(
        "Missing required parameters."
      )}&statusCode=400`;
      return;
    }
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    const submitFormToCallback = () => {
      const decodedCallBackURL = decodeURIComponent(callbackURL);
      const form = document.createElement("form");
      form.method = "POST";
      form.action = decodedCallBackURL;
      const fields = {
        encryptedPayload,
        merchantId,
        keyId,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    };

    const timer = setTimeout(() => {
      submitFormToCallback();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [encryptedPayload, merchantId, keyId, callbackURL]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f4f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderRadius: 4,
            p: 4,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={6}
              sx={{
                color: "#3b82f6",
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                  stroke: "url(#progressGradient)",
                },
              }}
            />
            <svg style={{ height: 0, width: 0 }}>
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "#1e293b",
              fontWeight: 700,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              mb: 1,
            }}
          >
            Processing Payment
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Please wait while we process your transaction...
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}

export default PaymentResponse;
