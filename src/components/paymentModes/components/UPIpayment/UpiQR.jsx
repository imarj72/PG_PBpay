import React, { useState, useEffect } from 'react';
import ImageComponent from '../../../shared/ImageComponent';
import {QRCodeCanvas} from 'qrcode.react';
import { Link } from '@mui/material';


function UpiQR({ QrCodeData, handleCloseDialog , txAmount, mode }) {
  const canvasStyles = {
      height: '180px',
    width: '180px',
    margin: '10px auto',
    position: 'relative',
    top: '10px'
  };
 
 const isPaytmGateway = QrCodeData.gateway === 'paytm' || QrCodeData.gateway === 'razorpay';
 const QRcodeUrl = QrCodeData.qrCodeUrl;
 const decodedURL = decodeURIComponent(QRcodeUrl);
 const qrCodeData = QrCodeData.qrCodeUrl;
 
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
    <div className='qr-dialog-box'>
      
      <div className='qr-data-head'>
        <ul>
          <li>
            <h4>Pay using QR Code </h4>
          </li>
          <li>
         <button onClick={()=> handleCloseDialog ? handleCloseDialog() : null}>
         <ImageComponent name="closeBtn" />
         </button>
          </li>
        </ul>
      </div>
        <div className='merchant-data-table'>
          <ul>
            <li>
              <span>Merchant Name</span>
              <strong>PBPay</strong>
            </li>
            <li>
              <span>Payment Amount</span>
              <strong>₹{txAmount}</strong>
            </li>
          </ul>
        </div>
        <h6>Scan the QR Code mentioned below with supported UPI apps</h6>
          <div className='payment-links'>
            <ul>
              <li>
                <ImageComponent className='gpay' name="Gpay" />
              </li>
              <li>
                <ImageComponent name="PhonePay" />
              </li>
              <li>
                <ImageComponent name="BharatPay" />
              </li>
              <li>
                <ImageComponent className='paytm' name="PayTm" />
              </li>
              {mode =='UPI-QR' && ( <li>
                  <ImageComponent className="amazonPay" name="amazonPayLogo" />
              </li>)}
             
            </ul>
          </div>
          <div className='bar-code-main'>
            <div className='bar-code-container'>
              {isPaytmGateway ? (
        
        <QRCodeCanvas value={qrCodeData} style={canvasStyles} />
      ) : (
       
        <img 
          id="hdfcQrCode" 
          src={`data:image/png;base64,${qrCodeData}`} 
          alt="QR Code" 
          style={canvasStyles}
        />
      )}
            </div>
          </div>
          <div className='link-expired'>
          <p>
              Complete your payment in
          </p>
          <SessionTimer endTime={QrCodeData.session_time} />
        </div>
        
    </div>
  )
}

export default UpiQR
