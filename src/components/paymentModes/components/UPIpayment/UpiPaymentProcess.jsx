import React, { useState, useEffect } from 'react';
import { Button, Grid, Box, Typography, Paper, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ImageComponent from '../../../shared/ImageComponent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function UpiPaymentProcess({ QrCodeData, handleCloseDialog, vpa, apiData }) {
  const SessionTimer = () => {
    const endTime = apiData.data?.sessionExpiryTime
      ? apiData.data.sessionExpiryTime
      : new Date().getTime() + 100000; 

    const initialRemainingTime = calculateRemainingTime(endTime);
    const [remainingTime, setRemainingTime] = useState(initialRemainingTime);

    function calculateRemainingTime(endTime) {
      const currentTime = new Date().getTime();
      const difference = endTime - currentTime;
      return difference > 0 ? difference : 0;
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setRemainingTime(calculateRemainingTime(endTime));
      }, 1000);

      return () => clearInterval(timer);
    }, [endTime]);

    function formatTime(remainingTime) {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    const progress = (remainingTime / initialRemainingTime) * 100;
    const getTimerColor = () => {
      if (progress > 50) return '#1976d2'; 
      if (progress > 20) return '#f57c00'; 
      return '#d32f2f'; 
    };

    return (
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        sx={{ marginTop: '20px', marginBottom: '20px' }}
      >
        <Box position="absolute" display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon sx={{ color: getTimerColor() }} />
          <Typography variant="h5" sx={{ color: getTimerColor() }}>
            {formatTime(remainingTime)}
          </Typography>
        </Box>
      </Box>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'relative', bgcolor: '#f5f6f5' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} sx={{ margin: { md: 'auto' } }}>
                <ImageComponent name="UpiIcon" />
                <Typography sx={{ color: 'primary', fontWeight: 'bold', fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  Complete Your UPI Payment
                </Typography>
              </Box>
              <Button onClick={() => handleCloseDialog && handleCloseDialog()} sx={{ minWidth: 0, p: 0 }}>
                <ImageComponent name="closeBtn" style={{ width: 24, height: 24 }} />
              </Button>
            </Box>

            <Alert
              icon={<InfoOutlinedIcon sx={{ color: '#f57c00' }} />}
              severity="warning"
              sx={{ mb: 2, bgcolor: '#fff3e0', borderRadius: 1, color: '#e65100', fontSize: { xs: '12px', md: '14px' } }}
            >
              Do not close this screen or press the back button until payment is complete.
            </Alert>

            <Box textAlign="center">
              <Typography variant="subtitle1" sx={{ color: '#424242' }} gutterBottom>
                Your UPI ID
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#212121' }}>
                {vpa || 'Not Provided'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#616161', mt: 1 }}>
                This transaction will expire in
              </Typography>
              <motion.div variants={itemVariants}>
                <SessionTimer />
              </motion.div>
            </Box>

            <Box sx={{ bgcolor: '#eceff1', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography sx={{ color: '#455a64', textAlign: { xs: 'left', md: 'center' }, fontSize: { xs: '12px', md: '14px' } }}>
                If you entered someone else’s UPI ID, they must authorize the payment.
              </Typography>
            </Box>

            <motion.div variants={containerVariants}>
              <Typography fontWeight="medium" sx={{ color: '#37474f', marginBottom: '10px' }}>
                Payment Steps
              </Typography>
              <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
                {[
                  { text: 'Open the UPI app or click the payment request notification' },
                  { text: 'Complete payment by selecting the bank and entering your UPI PIN' },
                ].map((step, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.2 }}
                    style={{ marginBottom: 16 }}
                  >
                    <Box display="flex" alignItems="center" gap={3}>
                      <Typography sx={{ color: '#263238', fontSize: '14px', textAlign: 'left' }}>
                        <strong>Step {index + 1}</strong> - {step.text}
                      </Typography>
                    </Box>
                  </motion.li>
                ))}
              </Box>
            </motion.div>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default UpiPaymentProcess;