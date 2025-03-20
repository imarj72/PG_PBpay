import React from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Box, Typography, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassBottom from '@mui/icons-material/HourglassEmpty';
import CloseIcon from '@mui/icons-material/Close';
import PaymentIcon from '@mui/icons-material/Payment';

function PaymentStatus({ handleCloseDialog }) {
  const location = useLocation();
//   const responseData = location.state || {};
  const responseData={
    "paymentStatus": "success",
    "orderNo": "ORD123",
    "transactionId": "TXN-456",
    "amount": "50",
    "currency": "USD",
    "paymentMode": "UPI"
  }

  const {
    paymentStatus,
    orderNo,
    transactionId,
    amount,
    statusMsg,
    timeStamp,
    paymentMode,
    currency,
  } = responseData;

  const isSuccess = paymentStatus === 'success';
  const isPending = paymentStatus === 'pending';
  const isFailure = !isSuccess && !isPending;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const statusConfig = {
    success: {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#15803d' }} />, 
      title: 'Payment Successful',
      message: 'Your payment has been processed successfully.',
    },
    pending: {
      icon: <HourglassBottom sx={{ fontSize: 64, color: '#f59e0b' }} />,
      title: 'Payment Pending',
      message: 'Your payment is being processed. Please wait a moment.',
    },
    failure: {
      icon: <ErrorOutlineIcon sx={{ fontSize: 64, color: '#ef4444' }} />,
      title: 'Payment Failed',
      message: statusMsg || 'An error occurred while processing your payment.',
    },
  };

  const currentStatus = isSuccess ? 'success' : isPending ? 'pending' : 'failure';

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <Grid container justifyContent='center' alignItems='center' sx={{minHeight:'100vh'}}>
        <Grid item xs={11} sm={8} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              bgcolor: '#ffffff',
              maxWidth: 480,
              mx: 'auto',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
            }}
          >
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
              <Box display='flex' alignItems='center' gap={1}>
                <PaymentIcon sx={{ color: '#64748b' }} /> 
                <Typography
                  variant='h6'
                  sx={{
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  Transaction Status
                </Typography>
              </Box>
              <IconButton onClick={() => handleCloseDialog && handleCloseDialog()} sx={{ p: 0 }}>
                <CloseIcon sx={{ color: '#64748b' }} /> 
              </IconButton>
            </Box>

            <Box textAlign='center' sx={{ mt: 2, mb: 4 }}>
              {statusConfig[currentStatus].icon}
              <Typography
                variant='h4'
                sx={{
                  color: '#1a1a1a',
                  fontWeight: 700,
                  mt: 2,
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                {statusConfig[currentStatus].title}
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: '#6b7280',
                  maxWidth: 360,
                  mx: 'auto',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                {statusConfig[currentStatus].message}
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor:'#f5f5f5',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e8e2c9', 
                textAlign: 'left',
              }}
            >
              <Typography variant='body2' sx={{ color: '#4b4b4b', mb: 1 }}>
                <strong>Order No:</strong> {orderNo || 'N/A'}
              </Typography>
              <Typography variant='body2' sx={{ color: '#4b4b4b', mb: 1 }}>
                <strong>Transaction ID:</strong> {transactionId || 'N/A'}
              </Typography>
              <Typography variant='body2' sx={{ color: '#4b4b4b', mb: 1 }}>
                <strong>Amount:</strong>{' '}
                {currency ? `${currency} ${amount || 'N/A'}` : amount || 'N/A'}
              </Typography>
              <Typography variant='body2' sx={{ color: '#4b4b4b' }}>
                <strong>Payment Mode:</strong> {paymentMode || 'N/A'}
              </Typography>
              {isFailure && (
                <Typography variant='body2' sx={{ color: '#4b4b4b', mt: 1 }}>
                  <strong>Message:</strong> {statusMsg || 'N/A'}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default PaymentStatus;