import React, { useState, useEffect,useRef } from 'react';
import { Button, Link, Grid, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tooltip, TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import ImageComponent from '../../../shared/ImageComponent';
import PaymentFailedPopup from './PaymentFailedPopup';
import UpiPaymentProcess from './UpiPaymentProcess';
import fetchTxnStatus from '../../fetchTxnStatus';
import UpiQR from './UpiQR';
// import Loader from '../../Components/loader';
// import getDomain from '../../Components/getDomain';


function UpiDetails({payModesToPass}) {
   console.log('upi'+payModesToPass);
  const [selectOtherApps, setSelectOtherApps] = React.useState('');
  const [showUpiBarCode, setShowUpiBarCode] = useState(false);
  const [showUpiPopUp, setshowUpiPopUp] = useState(false);
  const [payId, setPayId] = useState('');
  const [QrCodeData , setQrCodeData] = useState('');
  const [responseData, setResponseData] = useState('');
  const [validVPAerror, setvalidVPAerror] = useState('');
  const [showUpiIntent, setshowUpiIntent] = useState(false);
  const [showUpiQR, setshowUpiQR] = useState(true);
  const [showLoader, setshowLoader] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [showCheck, setShowCheck] = useState(false); 
  const [txAmount , settxAmount ]= useState('');
  const [statusWaitTime , setWaitStatusTime] = useState('5');
  const [mode, setMode] = useState('');
  const isCheckingStatusRef = useRef(false);
  const [isDisplayModeFive, setIsDisplayModeFive] = useState(false);
  // const [isMotorProduct, setIsMotorProduct] = useState(false);
 
   let var1;
   let var2;
  const divStyle = {
  alignSelf: 'flex-end',
  paddingBottom: '3%',
  textAlign: 'justify',
  boxSizing: 'border-box',
  fontFamily: 'Roboto, "Segoe UI", -apple-system, "Helvetica Neue", BlinkMacSystemFont, Oxygen-Sans, Ubuntu, Cantarell, sans-serif',
  fontSize: '0.8em' 
};


 
   
  useEffect(() => {
    if (payModesToPass) {
       setshowUpiIntent(payModesToPass.isEligibleForUpiIntent);
      setshowUpiQR(payModesToPass.showQrCodePayMode);
      settxAmount(payModesToPass.txAmount);
      setShowCheck(payModesToPass.check);
      // setIsMotorProduct(payModesToPass.isMotorProduct);
       if (payModesToPass.displayMode === 5) {
        setIsDisplayModeFive(true);
        settxAmount(payModesToPass.multipliedAmount);
      	} 
    }
  }, [payModesToPass]);

  const handleChange = (event) => {
    setSelectOtherApps(event.target.value);
  };

  const [vpa, setVpa] = useState('');

  const handleVpaChange = (event) => {
    setVpa(event.target.value);
  };

  const handleVpaClick = (event) => {
    setvalidVPAerror('');
  };
	
  // const domain = getDomain();
  // const actionUrl = domain+`/pay/payment/upi/thankyou`;	
	
  const handleIntentPayNow = async () => {
    setshowLoader(true);
    const queryParameters = new URLSearchParams(window.location.search);
    const order = queryParameters.get("orderNo");
    var1 = queryParameters.get("var1");
    var2 = queryParameters.get("var2");
    const mode = "UPI_INTENT";
    try {
      const response = await fetch('/pay/securePayment/process/intermediate/paymentui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNo: order,
          mode: mode,
        })
      });
      const data1 = await response.json();
      console.log(data1.data);
      if(data1 && data1.data.decPayId){
       
      	
        setshowLoader(false);
       
        const decPayId = data1.data.decPayId;
        var1 = data1.data.interStatusVar1;
        var2 = data1.data.interStatusVar2;
        setPayId(decPayId);
        isCheckingStatusRef.current = true;
	window.location.href = data1.data.intentLink;
	setTimeout(() => checkTransactionStatus(decPayId, var1, var2), data1.data.upiWaitStatusTime * 1000);
        	
      } else {
        setshowLoader(false);
        // handle error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const retryPayment = async () => {
   setShowRetry(false);
   if(mode ==='UPI'){
   handlePayNow();
   }else if(mode === 'UPI-QR'){
   handleQRPayNow();
   }else if(mode === 'UPI_INTENT'){
   handleIntentPayNow();
   }
  };
  
  
    const handleCloseDialog = () => {
    isCheckingStatusRef.current = false;
    setShowUpiBarCode(false);
    setshowUpiPopUp(false);
    setShowRetry(false);
  };

  const handleQRPayNow = async () => {
    setshowLoader(true);
    const queryParameters = new URLSearchParams(window.location.search);
    const order = queryParameters.get("orderNo");
    var1 = queryParameters.get("var1");
    var2 = queryParameters.get("var2");
    const mode = "UPI-QR";
    setMode('UPI-QR');
    try {
      const response = await fetch('/pay/securePayment/process/intermediate/paymentui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNo: order,
          mode: mode,
        })
      });
      const data = await response.json();
      console.log(data);
      if(data && data.decQrPayId){
       
      	setQrCodeData(data);
        setshowLoader(false);
        setShowUpiBarCode(true);
    
        setWaitStatusTime(data.qrCodeWaitStatusTime);
        const decPayId = data.decQrPayId;
        var1 = data.interStatusVar1;
        var2 = data.interStatusVar2;
        setPayId(decPayId);
     	isCheckingStatusRef.current = true; 
        setTimeout(() => checkTransactionStatus(decPayId, var1, var2), data.qrCodeWaitStatusTime * 1000);
        	
      } else {
        setshowLoader(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };




  const handlePayNow = async () => {
    if(vpa!=''){
    setshowLoader(true);
    const queryParameters = new URLSearchParams(window.location.search);
    const order = queryParameters.get("orderNo");
    var1 = queryParameters.get("var1");
    var2 = queryParameters.get("var2");
    const decodedVpa = decodeURIComponent(vpa);
    const mode = "UPI";
    setMode('UPI');
    try {
      const response = await fetch('/pay/validate/vpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNo: order,
          mode: mode,
          json: decodedVpa,
          var1: var1,
          var2: var2
        })
      });
      const data = await response.json();
      console.log(data);
      console.log('isVPAValid value:', data.data.isVPAValid);

      if (data.data.isVPAValid === 1) {
        const response1 = await fetch('/pay/securePayment/process/intermediate/paymentui', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderNo: order,
            mode: mode,
            vpa: decodedVpa
          })
        });
        const data1 = await response1.json();
        setQrCodeData(data1.data);
        console.log(data1);
        const decPayId = data1.data.decPayId;
        var1 = data1.data.interStatusVar1;
        var2 = data1.data.interStatusVar2;

        setPayId(decPayId);
        setshowLoader(false);
        if (data1.data.decPayId) {
          setWaitStatusTime(data1.upiWaitStatusTime);
          setshowUpiPopUp(true);
          isCheckingStatusRef.current = true;
          setTimeout(() => checkTransactionStatus(decPayId, var1, var2), data1.data.upiWaitStatusTime * 1000);
        } else {
          setshowLoader(false);
          setvalidVPAerror('Some error occured, Please try again!');
        }
      } else {
        setshowLoader(false);
        setvalidVPAerror('Please enter a valid VPA');
      }
    } catch (error) {
      console.error('Error:', error);
    }}
    else{
    setvalidVPAerror('Please enter a valid VPA');
    }
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
            }
            else if(txnStatus === 'TXN_FAILURE'){
            	setShowUpiBarCode(false);
            	setshowUpiPopUp(false);
            	setshowLoader(false);
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
       {/* {showLoader && <Loader show={true} textToShow="Please wait while your transaction is being processed"/>} */}
      <form
        className="form-field"
        // action={actionUrl}
        method="post"
        id="submitUpi"
        autoComplete="off"
      >
        <input type="hidden" name="payId" id="payId" />
        <input type="hidden" name="var1" id="var1" value={var1} />
        <input type="hidden" name="var2" id="var2" value={var2} />
      </form>

      <div className='card-details bg-white px-7 py-5'>
        <div className='card-detail-form'>
          {showUpiIntent && (
            <>
              <div className='upi-payment-type'>
                <h3 className='relative sm:mt-2 sm:mb-1'>Pay using Apps<span className='  absolute right-5'>
                     </span>
                </h3>
                <div className='sm:py-1 pe-3 ps-0 sm:mt-3'>
                  <Button className='pay-now-btn' onClick={() => handleIntentPayNow()}>CHOOSE AN APP</Button>
                </div>
              </div>
            </>
          )}
          <div className="hidden md:block">
          <div className='card-info'>
            <h5>
              Pay using UPI
            </h5>
            <div className='scan-pay-box'>
              <ul>
                {showUpiQR && (
                  <>
                    <li>
                      <h3>Scan and Pay</h3>
                      <div className='barcode-icon'>
                        <ImageComponent name={"barcode"} />
                        <Button className='genrate-qrcode' onClick={() => handleQRPayNow()} >View</Button>
                      </div>
                    </li>
                  </>
                )}
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
                    <Button className="verify-pay-btn" onClick={() => handlePayNow()}>
                      Verify & Pay
                    </Button>
                  </form>
                  <div id="stepper">
                    <ul className="steps">
                      <li className="">
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
                </li>
              </ul>
            </div>
          </div>
      </div>
     <div className="block md:hidden">
      <div className='card-info'>
            <h5>
              Pay using UPI
            </h5>
            <div className='scan-pay-box'>
              <ul>
               
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
                    <Button className="verify-pay-btn" onClick={() => handlePayNow()}>
                      Verify & Pay
                    </Button>
                  </form>
                  <div id="stepper">
                    <ul className="steps">
                      <li className="">
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
                </li>
                 {showUpiQR && (
                  <>
                    <li>
                      <h3>Scan and Pay</h3>
                      <div className='barcode-icon'>
                        <ImageComponent name={"barcode"} />
                        <Button className='genrate-qrcode' onClick={() => handleQRPayNow()} >View</Button>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div></div>
        </div>
      </div>
      
      <Dialog  open={showUpiPopUp} onClose={() => setshowUpiPopUp(false)} >
        <UpiPaymentProcess QrCodeData = {QrCodeData} handleCloseDialog={handleCloseDialog}  vpa={vpa} />
      </Dialog>
      
      <Dialog open={showUpiBarCode} onClose={() => setShowUpiBarCode(false)}  className='upi-dialog'>
        <UpiQR  QrCodeData={QrCodeData} handleCloseDialog={handleCloseDialog} txAmount = {txAmount} mode = {mode}/>
      </Dialog>
      
      <Dialog open={showRetry} onClose={() => setShowRetry(false)}>
        <PaymentFailedPopup  handleCloseDialog={handleCloseDialog} retryPayment={retryPayment}  />
       </Dialog>
      
      
 {/* {showCheck && isMotorProduct && <div className="payment-error-box"  style={{
    margin: '-38px 0 0',
    fontSize: 'small',
  }}>
  Transaction confirmation status is pending. If the amount has already been deducted from your account, we recommend you wait for 15-20 minutes before making another payment attempt. 
</div>} */}

{!showCheck && <div className="payment-error-box">
  Transaction confirmation for UPI takes longer than other payment modes. Given the delay, we recommend you wait for some time before making another payment attempt using UPI.
</div>}
    </>
  )
}

export default UpiDetails;

