import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import ImageComponent from '../../../shared/ImageComponent';


function UpiPaymentProcess({QrCodeData , handleCloseDialog , vpa}) {


 const SessionTimer = ({ endTime }) => {
    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

    function calculateRemainingTime() {
      const currentTime = new Date().getTime();
      const difference = endTime - currentTime;
      return difference > 0 ? difference : 0;
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setRemainingTime(calculateRemainingTime());
      }, 1000);

      return () => clearInterval(timer);
    }, [endTime]);

    function formatTime(remainingTime) {
    const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return formatTime(remainingTime);
  };

  return (
    <div className='upi-payment-box'>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <div className='card-view px-8 py-6'>
                  <h4><button onClick={()=> handleCloseDialog ? handleCloseDialog() : null}>
         <ImageComponent name="closeBtn" />
         </button> Complete your UPI payment</h4>
                    <div className="info-box">
                      <ImageComponent name={"InfoIcon"}/> Do not close this screen or press the back button
                    </div>
                    <div className='upi-id-info text-center'>
                      <h5>Your UPI ID - <strong>{vpa}</strong></h5>
                      <p>This transaction will expire in</p>
                      <div className='timer'> <SessionTimer endTime={QrCodeData.session_time} /></div>
                    </div>
                    <div className='upi-info-bottom'>
                        <p>
                          If you have entered someone else’s UPI ID, they need to authorise the payment
                        </p>
                    </div>
                   
                    <div className='upi-steps'>
                      <ul>
                        <li>
                          Step 1 - Open the <strong>UPI</strong> app or click on the payment request notification
                        </li>
                        <li>
                          Step 2 - Complete your payment by selecting the bank and entering UPI PIN
                        </li>
                      </ul>
                    </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    </div>
    
  )
}

export default UpiPaymentProcess
