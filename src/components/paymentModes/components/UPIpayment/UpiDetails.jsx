import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Link,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageComponent from '../../../shared/ImageComponent';
import PaymentFailedPopup from './PaymentFailedPopup';
import UpiPaymentProcess from './UpiPaymentProcess';
import fetchTxnStatus from '../../fetchTxnStatus';
import UpiQR from './UpiQR';

function UpiDetails({ apiData }) {
  const [selectOtherApps, setSelectOtherApps] = useState('');
  const [showUpiBarCode, setShowUpiBarCode] = useState(false);
  const [showUpiPopUp, setShowUpiPopUp] = useState(false);
  const [payId, setPayId] = useState('');
  const [QrCodeData, setQrCodeData] = useState('');
  const [responseData, setResponseData] = useState('');
  const [validVPAerror, setValidVPAerror] = useState('');
  const [showUpiIntent, setShowUpiIntent] = useState(false);
  const [showUpiCollect, setShowUpiCollect] = useState(false);
  const [showUpiQR, setShowUpiQR] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [txAmount, setTxAmount] = useState('');
  const [statusWaitTime, setWaitStatusTime] = useState('5');
  const [mode, setMode] = useState('');
  const [vpa, setVpa] = useState('');
  const isCheckingStatusRef = useRef(false);
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let var1, var2;


  useEffect(() => {
    if (apiData && apiData.data.paymentModes) {
      apiData.data.paymentModes.forEach(mode => {
        if (mode?.name === 'UPI_COLLECT' || mode?.name === 'upi_collect') {
          setShowUpiCollect(true);
        } else if (mode?.name === 'UPI_QR' || mode?.name === 'upi_qr') {
          setShowUpiQR(true);
        }
        else if ((mode?.name === 'UPI_COLLECT' || mode?.name === 'upi_collect') && (mode?.name === 'UPI_QR' || mode?.name === 'upi_qr')) {
          setShowUpiCollect(true);
          setShowUpiQR(true);
        }
      });
    }
  }, [apiData]);


  const handleVpaChange = (event) => {
    setVpa(event.target.value);
  };

  const handleVpaClick = () => {
    setValidVPAerror('');
  };

  // const vpaValidationApiUrl = '/api/validateVPA'; 

  // const validateVPA = async (vpa) => {
  //   try {
  //     const response = await fetch(`${vpaValidationApiUrl}?vpa=${vpa}`, { 
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`VPA validation failed with status ${response.status}`);
  //     }

  //     const data = await response.json();
  //     return data.isValid; 
  //   } catch (error) {
  //     console.error('VPA validation error:', error);
  //     setValidVPAerror('Error validating VPA. Please try again.');
  //     return false;
  //   }
  // };

  // const handlePayNow = async () => {
  //   if (vpa !== '') {
  //     const isValidVPA = await validateVPA(vpa);
  //     if (isValidVPA) {
  //       setMode('UPI_COLLECT');
  //       setShowUpiPopUp(true);
  //       setValidVPAerror(''); 

  //     } else {
  //       setShowUpiPopUp(false);
  //       setValidVPAerror('Invalid VPA. Please check and try again.');
  //     }
  //   }
  // };

  const handlePayNow=async()=>{
    if(vpa!=='')
    {
      setMode('UPI_COLLECT');
      //assuming valid ->tobeUpdated @aniket
      setShowUpiPopUp(true);
      // setValidVPAerror('Enter Valid VPA');
    }
  }

  // const handlePayNow = async () => {
  //   if (vpa !== '') {
  //     setShowLoader(true);
  //     const decodedVpa = decodeURIComponent(vpa);
  //     const mode = "UPI_COLLECT";
  //     setMode('UPI_COLLECT');
  //     try {
  //       const response = await fetch('', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ orderNo: order, mode: mode, json: decodedVpa, var1, var2 })
  //       });
  //       const data = await response.json();
  //       if (data.data.isVPAValid === 1) {
  //         const response1 = await fetch('/pay/securePayment/process/intermediate/paymentui', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ orderNo: order, mode: mode, vpa: decodedVpa })
  //         });
  //         const data1 = await response1.json();
  //         setQrCodeData(data1.data);
  //         const decPayId = data1.data.decPayId;
  //         var1 = data1.data.interStatusVar1;
  //         var2 = data1.data.interStatusVar2;
  //         setPayId(decPayId);
  //         setShowLoader(false);
  //         if (data1.data.decPayId) {
  //           setWaitStatusTime(data1.data.upiWaitStatusTime);
  //           setShowUpiPopUp(true);
  //           isCheckingStatusRef.current = true;
  //           setTimeout(() => checkTransactionStatus(decPayId, var1, var2), data1.data.upiWaitStatusTime * 1000);
  //         } else {
  //           setShowLoader(false);
  //           setValidVPAerror('Some error occured, Please try again!');
  //         }
  //       } else {
  //         setShowLoader(false);
  //         setValidVPAerror('Please enter a valid VPA');
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   } else {
  //     setValidVPAerror('Please enter a valid VPA');
  //   }
  // };

  const retryPayment = async () => {
    setShowRetry(false);
    if (mode === 'UPI_COLLECT') { 
      handlePayNow();
    } else if (mode === 'UPI_QR') {
      // handleQRPayNow();
    } else if (mode === 'UPI_INTENT') {
      // handleIntentPayNow();
    }
  };

  const handleCloseDialog = () => {
    isCheckingStatusRef.current = false;
    setShowUpiBarCode(false);
    setShowUpiPopUp(false);
    setShowRetry(false);
  };

  const checkTransactionStatus = async (payId, var1, var2) => {
    try {
      let txnStatus = '';
      while (isCheckingStatusRef.current) {
        const encodedPayId = encodeURIComponent(payId);
        const response = await fetchTxnStatus(encodedPayId, var1, var2);
        txnStatus = response.status;
        if (txnStatus === 'TXN_SUCCESS') {
          submitFormWithPayId(payId, var1, var2);
          break;
        } else if (txnStatus === 'TXN_FAILURE') {
          setShowUpiBarCode(false);
          setShowUpiPopUp(false);
          setShowLoader(false);
          setShowRetry(true);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
    }
  };

  const submitFormWithPayId = (payId, var1, var2) => {
    const form = document.getElementById('submitUpi');
    const payIdInput = form.querySelector('input[name="payId"]');
    const var1Input = form.querySelector('input[name="var1"]');
    const var2Input = form.querySelector('input[name="var2"]');
    payIdInput.value = payId;
    var1Input.value = var1;
    var2Input.value = var2;
    form.submit();
  };

  return (
    <>
      {/* Hidden form for submitting UPI details, if needed */}
      {/*
      <form
        className="form-field"
        action={actionUrl}
        method="post"
        id="submitUpi"
        autoComplete="off"
      >
        <input type="hidden" name="payId" id="payId" />
        <input type="hidden" name="var1" id="var1" value={var1} />
        <input type="hidden" name="var2" id="var2" value={var2} />
      </form>
      */}
      <div className='card-details bg-white px-7 py-5'>
        <div className='card-detail-form'>
          {showUpiIntent && (
            <div className='upi-payment-type'>
              <h3 className='relative sm:mt-2 sm:mb-1'>
                Pay using Apps
                <span className='absolute right-5'></span>
              </h3>
              <div className='sm:py-1 pe-3 ps-0 sm:mt-3'>
                <Button className='pay-now-btn'>
                  CHOOSE AN APP
                </Button>
              </div>
            </div>
          )}
          <div className='card-info'>
            <h5>Pay using UPI</h5>
            <div className='scan-pay-box'>
              <ul>
                {isMobile ? (
                  <>
                  {showUpiCollect &&(
                    <li>
                      <h3>Enter UPI ID</h3>
                      <form className='mt-3'>
                        <TextField
                          id="vpa-input"
                          label="mobilenumber@upi"
                          fullWidth
                          value={vpa}
                          error={!!validVPAerror}
                          helperText={validVPAerror}
                          onChange={handleVpaChange}
                          onClick={handleVpaClick}
                        />
                        <Button className="verify-pay-btn" onClick={handlePayNow}>
                          Verify &amp; Pay
                        </Button>
                      </form>
                      <div id="stepper">
                        <ul className="steps">
                          <li className={activeStep === 0 ? 'step-active' : ''}>
                            <span>Enter your registered VPA</span>
                          </li>
                          <li className={activeStep === 1 ? 'step-active' : ''}>
                            <span>Receive payment request on payment app</span>
                          </li>
                          <li className={activeStep === 2 ? 'step-active' : ''}>
                            <span>Authorize payment request</span>
                          </li>
                        </ul>
                      </div>
                    </li>
                  )}
                    {showUpiQR && (
                      <li>
                        <h3>Scan and Pay</h3>
                        <div className='barcode-icon'>
                          <ImageComponent name="barcode" />
                          <Button className='genrate-qrcode'>
                            View
                          </Button>
                        </div>
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    {showUpiQR && (
                      <li>
                        <h3>Scan and Pay</h3>
                        <div className='barcode-icon'>
                          <ImageComponent name="barcode" />
                          <Button className='genrate-qrcode'>
                            View
                          </Button>
                        </div>
                      </li>
                    )}
                    {showUpiCollect && (
                      <li>
                        <h3>Enter UPI ID</h3>
                        <form className='mt-3'>
                          <TextField
                            id="vpa-input"
                            label="mobilenumber@upi"
                            fullWidth
                            value={vpa}
                            error={!!validVPAerror}
                            helperText={validVPAerror}
                            onChange={handleVpaChange}
                            onClick={handleVpaClick}
                          />
                          <Button className="verify-pay-btn" onClick={handlePayNow}>
                            Verify &amp; Pay
                          </Button>
                        </form>
                        <div id="stepper">
                          <ul className="steps">
                            <li>
                              <span>Enter your registered VPA</span>
                            </li>
                            <li className="steps">
                              <span>Receive payment request on payment app</span>
                            </li>
                            <li className="non-active">
                              <span>Authorize payment request</span>
                            </li>
                          </ul>
                        </div>
                      </li>)}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showUpiPopUp} onClose={() => setShowUpiPopUp(false)}>
        <UpiPaymentProcess QrCodeData={QrCodeData} handleCloseDialog={handleCloseDialog} vpa={vpa}  apiData={apiData}/>
      </Dialog>

      <Dialog open={showUpiBarCode} onClose={() => setShowUpiBarCode(false)} className='upi-dialog'>
        <UpiQR QrCodeData={QrCodeData} handleCloseDialog={handleCloseDialog} txAmount={txAmount} mode={mode} />
      </Dialog>

      <Dialog open={showRetry} onClose={() => setShowRetry(false)}>
        <PaymentFailedPopup handleCloseDialog={handleCloseDialog} retryPayment={retryPayment} />
      </Dialog>

      <div className="payment-error-box">
        Transaction confirmation for UPI takes longer than other payment modes. Given the delay, we recommend you wait for some time before making another payment attempt using UPI.
      </div>
    </>
  );
}

export default UpiDetails;
