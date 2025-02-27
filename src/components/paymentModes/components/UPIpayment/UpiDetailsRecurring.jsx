import React, { useState, useEffect, useRef } from 'react';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import ImageComponent from '../../../shared/ImageComponent';
import UpiQR from './UpiQR';
import CustomizedDialogs from '../../../shared/CustomDialogs';
import UpiPaymentProcess from './UpiPaymentProcess';
import PaymentFailedPopup from './PaymentFailedPopup';
import fetchTxnStatus from '../../fetchTxnStatus';
import fetchQRTxnStatus from '../../fetchQRTxnStatus';
// import Loader from '../../Components/loader';
// import getDomain from '../../Components/getDomain';
// import fetchMandateStatus from '../fetchMandateStatus';
import EmandatePopUp from '../../childComponent/EmandatePopUp';
const mockData = {
  payMode: {
    subPayModes: [
      { code: 'Gpay', name: 'Google Pay', upiHandles: ['@okaxis', '@okicici'] },
      { code: 'PhonePe', name: 'PhonePe', upiHandles: ['@ybl', '@ibl'] },
      {code:'BHIM UPI',name:'BHIM',upiHandles:['@rbl','@abfspay']},
      { code: 'Paytm', name: 'Paytm', upiHandles: ['@paytm', '@ptm'] },
    ]
  },
  productId: 1,
  txAmount: 1000,
  showEmanQrCode: true,
};
function UpiDetailsRecurring({payMode=mockData.payMode, productId=mockData.productId, txAmount=mockData.txAmount, showEmanQrCode=mockData.showEmanQrCode}) {
 console.log('productId'+productId);
  const [upiProviderId, setUPIProviderId] = React.useState(-1);
  const [showWhatisEmandatePopup, setShowWhatisEmandatePopup] = React.useState(false);
  const [upiHandleIndex, setUpiHandleIndex] = React.useState(0);
  const [subPayModes] = React.useState(payMode.subPayModes);
  const [isChecked, setIsChecked] = useState(true);
  const [showLoader, setshowLoader] = useState(false);
  const [vpa, setVpa] = useState('');
  const [vpaId, setVpaId] = useState('');
  const [mode,setMode] = useState('UPI_EMANDATE');
  const [validVPAerror, setvalidVPAerror] = useState('');
  const [payId, setPayId] = useState('');
  const [statusWaitTime , setWaitStatusTime] = useState('5');
  const [showUpiPopUp, setshowUpiPopUp] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [intermediateResponseData, setIntermediateResponseData] = useState(null);
  const [showUpiBarCode, setShowUpiBarCode] = useState(false);
  const [waitingForUpiStatus, setWaitingForUpiStatus] = useState(false);
  const waitingForUpiStatusRef = useRef(waitingForUpiStatus);
  const [txnurl , settxnurl ] = useState('');
  const [pgpayload , setpgpayload] = useState('');
  const [showForm, setShowForm] = useState(0);
  const [rupayMap , setRupayMap] = useState('');
  const [formHtml, setFormHtml] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 580);
  
  const [QrCodeData , setQrCodeData] = useState('');
  const [showUpiQR, setshowUpiQR] = useState(showEmanQrCode);
  

  useEffect(() => {
      waitingForUpiStatusRef.current = waitingForUpiStatus;
  }, [waitingForUpiStatus]);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 580);
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const domain = getDomain();
  // const actionUrl = domain+`/pay/payment/razorpay/thankyou/emandate`;
  // const qRUrl = domain+`/pay/payment/paytm/qr/thankyou/emandate`;
  let var1;
  let var2;
  let form;
  let eMandateNo;
  
  const handleClickonWhatisEmandate= ()=>{
    setShowWhatisEmandatePopup(true);
  }



  const handleCloseWhatisEmandate= ()=>{
    setShowWhatisEmandatePopup(false);
  }

  const handleUPIProviderChange = (upiHandlerId) => {
    setUPIProviderId(upiHandlerId);
  }

  const handleProviderDropDownChange = (event)  =>{
    handleUPIProviderChange(event.target.value);
  }

  const handleUpiHandlerIndexChange = (event) =>{
    setUpiHandleIndex(event.target.value);
  }

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked); 
    console.log("Checkbox is checked:", event.target.checked);
  };

  const handleVpaChange = (event) => {
    setVpa(event.target.value);
  };

  const callIntermediate = async (orderNo, mode, decodedVPA, gatewayName)=>{
    const response1 = await fetch('/pay/securePayment/process/intermediate/paymentui', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderNo: orderNo,
            mode: mode,
            vpa: decodedVPA,
            gateway: gatewayName
        })
    });

    const data1 = await response1.json();
    setIntermediateResponseData(data1);
    let decPayId;
    var1 = data1.interStatusVar1;
    var2 = data1.interStatusVar2;

    
    setshowLoader(false);

    if(gatewayName == 'razorpay' ||  gatewayName == 'payu'){
      setPayId(data1.decPayId);
      decPayId = data1.decPayId;
      eMandateNo = data1.encryptedEMandateNo;
    }
    
    if (data1.decPayId) {
        setWaitingForUpiStatus(true);
        setWaitStatusTime(data1.upiWaitStatusTime);
        setshowUpiPopUp(true);
        console.log('statusWaitTime' + statusWaitTime);
        setTimeout(() => checkTransactionStatus(decPayId, var1, var2, eMandateNo), data1.upiWaitStatusTime * 1000);
    } else{
        setshowLoader(false);
        setvalidVPAerror('Some error occured, Please try again!');
    }
  }

  const getGatewayNameResponse = async (decodedOrder, productId) => {
    const response = await fetch('/pay/payment/vpaValidation/gateway', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderNo: decodedOrder,
            productId: productId,
        })
    });
    return await response.json();
  }

  const getVerifyGatewayResponse = async (decodedOrder, vpaId, gatewayName, isEncrypted)=>{
    const params = new URLSearchParams({
      vpa: vpaId,
      gateway: gatewayName,
      orderNo: decodedOrder,
      isEncrypted: isEncrypted
    });
    const url = `/pay/eMandate/vpaVerify?${params.toString()}`;
    const responseGateWayValidation = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return await responseGateWayValidation.json();
  }

  const getVerifyGatewayResponsePaytm = async (decodedOrder, productId, vpaId, txAmount)=>{
    const responseValidation = await fetch('pay/payment/verifyVpa/paytm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderNo: decodedOrder,
            productId: productId,
            vpa: vpaId,
            amountToBePaid: txAmount
        })
    });
    return await responseValidation.json();
  }



  const handlePayNow = async () => {
    if (vpa != '') {
        setshowLoader(true);
        const queryParameters = new URLSearchParams(window.location.search);
        const order = queryParameters.get("orderNo");
        const decodedOrder = decodeURIComponent(order);
        var1 = queryParameters.get("var1");
        var2 = queryParameters.get("var2");
        
        const vpaId = vpa + subPayModes[upiProviderId].upiHandles[upiHandleIndex];
        setVpaId(vpaId);
        const decodedVpa = decodeURIComponent(vpaId);
        
        try {
            const gatewayData = await getGatewayNameResponse(decodedOrder, productId);
            const gatewayName = gatewayData.vpavalidationGateway;
            if(gatewayName != 'paytm'){
              // url: "/pay/eMandate/vpaVerify?vpa=" + vpa + "&gateway=" + vpaValidationGateway + "&orderNo=" + displayOrderNo,
              
              const validationData =  await getVerifyGatewayResponse(decodedOrder, vpaId, gatewayName, true);
              if(validationData.valid){
                console.log('gateway validated');
                callIntermediate(order,'UPI_EMANDATE',decodedVpa, gatewayName);
              }else{
                setshowLoader(false);
                setvalidVPAerror('Please enter a valid UPI ID');
              }
            }else{
              const validationData = await getVerifyGatewayResponsePaytm(decodedOrder, productId, vpaId, txAmount);
              if(validationData.data.isValid){
                submitDetailsPaytm(decodedOrder, mode, encodeURIComponent(vpaId), gatewayName);
              }else{
                setshowLoader(false);
                setvalidVPAerror('Please enter a valid UPI ID');
              }
            }
        } catch (error){
          setshowLoader(false);
          console.log(error);
        }
    } else {
      setvalidVPAerror('Please enter a valid UPI ID');
    }
  };

  const checkTransactionStatus = async (payId, var1, var2, eMandateNo) => {
    try {
        let txnStatus = '';
        while (waitingForUpiStatusRef.current) {
            console.log('check txn status starts!!!');
            const encodedPayId = encodeURIComponent(payId);
            const response = await fetchTxnStatus(encodedPayId, var1, var2);
            txnStatus = response.status;
            
            if (txnStatus === 'TXN_SUCCESS') {
              //  checkMandateStatus(eMandateNo, var1, payId);
               submitFormWithPayId(payId, var1, var2, eMandateNo);
               break;
            }
            else if(txnStatus === 'TXN_FAILURE'){
              setShowUpiBarCode(false);
              setshowUpiPopUp(false);
              setshowLoader(false);
              setShowRetry(true);
              setWaitingForUpiStatus(false);
              break;
             }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('Error checking transaction status:', error);
        
    }
  };

//   const checkMandateStatus= async (eMandateNo, orderId, payId)=>{
//     try {
//       let mandateStatus = '';
//       const maxRetries=24;
//       let retries=0;
//       while (waitingForUpiStatusRef.current && retries<maxRetries) {
//           console.log('check mandate status starts!!!');
//           const response = await fetchMandateStatus(eMandateNo, orderId, payId);
//           mandateStatus = response.status;
//           if (mandateStatus === 'TXN_SUCCESS' || mandateStatus === 'TXN_FAILURE') {
//             submitFormWithPayId(payId, var1, var2, eMandateNo);
//             break;
//           }     
//           retries++;
//           await new Promise(resolve => setTimeout(resolve, 5000));
//         }
//         if(retries>=maxRetries){
//           setShowUpiBarCode(false);
//           setshowUpiPopUp(false);
//           setshowLoader(false);
//           setShowRetry(true);
//           setWaitingForUpiStatus(false);
//         }
//   } catch (error) {
//       console.error('Error checking mandate status:', error);
//   }
// }
    const checkQRTransactionStatus = async (payId, var1, var2, eMandateNo) => {
    try {
        let txnStatus = '';
        while (waitingForUpiStatusRef.current) {
            console.log('check txn status starts!!!');
            const encodedPayId = encodeURIComponent(payId);
            const response = await fetchQRTxnStatus(encodedPayId, var1, var2);
            txnStatus = response.status;
            
            if (txnStatus === 'TXN_SUCCESS') {
                submitFormWithQR(payId, var1, var2,eMandateNo);
                break; 
            }
            else if(txnStatus === 'TXN_FAILURE'){
              setShowUpiBarCode(false);
              setshowUpiPopUp(false);
              setshowLoader(false);
              setShowRetry(true);
              setWaitingForUpiStatus(false);
              break;
             }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('Error checking transaction status:', error);
        
    }
  };
	
  const submitDetailsPaytm =  async (orderNo, mode, vpa, gateway) =>{
    const payload = {
        orderNo,
        mode,
        vpa,
        gateway
    };
    const response = await fetch('/pay/securePayment/process/paymentui', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    setshowLoader(false);
    if (data.as === 1) {

        if (data.pgPayload.form) {
            const formHtml = data.pgPayload.form;
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = formHtml;

            const formElement = tempContainer.querySelector('form');
            document.body.appendChild(formElement);
            formElement.submit();
        } else if (data.txnURL) {
            settxnurl(data.txnURL);
            setpgpayload(data.pgPayload);
            await delay(1500);
            form = document.getElementById('testForm');
            form.submit();

        }


    } else if (data.as === 2) {
        window.location.href = data.txnURL1;

    } else if (data.as === 3) {
        if (data.mastRupay) {
            setShowForm(2);
            setRupayMap(data.mastRupay);
        } else {
            setFormHtml(data.form);
            setShowForm(data.showForm);
            await delay(1500);
        }

    } else if (data.error === 1) {
        window.location.reload();
    }
    
  }

  const submitFormWithPayId = (payId, var1, var2, eMandateNo) => {
    const form = document.getElementById('submitUpi');
    const payIdInput = form.querySelector('input[name="payId"]');
    const var1Input = form.querySelector('input[name="var1"]');
    const var2Input = form.querySelector('input[name="var2"]');
    const eMandateNoInput = form.querySelector('input[name="eMandateNo"]');

    payIdInput.value = payId;
    var1Input.value = var1;
    var2Input.value = var2;
    eMandateNoInput.value = eMandateNo;
    
    form.submit();
  };
  
  
  const submitFormWithQR = (payId, var1, var2 , eMandateNo) => {
    const form = document.getElementById('submitQR');
    const payIdInput = form.querySelector('input[name="payId"]');
    const var1Input = form.querySelector('input[name="var1"]');
    const var2Input = form.querySelector('input[name="var2"]');
    const eMandateNoInput = form.querySelector('input[name="eMandateNo"]'); 

    payIdInput.value = payId;
    var1Input.value = var1;
    var2Input.value = var2;
    eMandateNoInput.value = eMandateNo;
    
    
    form.submit();
  };

  const handleCloseDialog = () => {
    setShowUpiBarCode(false);
    setWaitingForUpiStatus(false);
    setshowUpiPopUp(false);
    setShowRetry(false);
  };


  const retryPayment = async () => {
     setShowRetry(false);
     handlePayNow();
  };

  const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
  });

  const handleQRPayNow = async () => {
    setshowLoader(true);
    const queryParameters = new URLSearchParams(window.location.search);
    const order = queryParameters.get("orderNo");
    var1 = queryParameters.get("var1");
    var2 = queryParameters.get("var2");
    const mode = "UPI_EMANDATE_QR";
    setMode('UPI_EMANDATE_QR');
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
        setWaitingForUpiStatus(true);
        setWaitStatusTime(data.qrCodeWaitStatusTime);
        const decPayId = data.decQrPayId;
        eMandateNo = data.encryptedEMandateNo;
        var1 = data.interStatusVar1;
        var2 = data.interStatusVar2;
        setPayId(decPayId);
        console.log('statusWaitTime'+statusWaitTime);

       setTimeout(() => checkQRTransactionStatus(decPayId, var1, var2), data.qrCodeWaitStatusTime * 1000);
          
      } else {
        setshowLoader(false);
        // handle error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVpaInputClick = () => {
     setvalidVPAerror('');
    };

  return (
      <>
      {/* {showLoader && <Loader show={true} textToShow="Please wait while your transaction is being processed"/>} */}
      
      {pgpayload && (
        <form method="post" action={txnurl} id="testForm">
            {Object.keys(pgpayload).map((key, index) => (
                <input key={index} type="hidden" id={key} name={key} value={pgpayload[key]} />
            ))}
        </form>
      )}

      <form
        className="form-field"
        // action={actionUrl}
        method="post"
        id="submitUpi"
        autoComplete="off"
      >
        <input type="hidden" name="payId" id="payId" />
        <input type="hidden" name = "eMandateNo" id="eMandateNo"/>
        <input type="hidden" name="var1" id="var1" value={var1} />
        <input type="hidden" name="var2" id="var2" value={var2} />
      </form>
      
      
        <form
        className="form-field"
        // action={qRUrl}
        method="post"
        id="submitQR"
        autoComplete="off"
      >
      	 
        <input type="hidden" name="payId" id="payId" />
        <input type="hidden" name = "eMandateNo" id="eMandateNo"/>
        <input type="hidden" name="var1" id="var1" value={var1} />
        <input type="hidden" name="var2" id="var2" value={var2} />
      </form>
      

    <div className='upi-emandate-box'>
     {showUpiQR && !isMobile && (
        <>

            <div class="upi-head1 clearfix1">
              <div class="left upi-gateway-warpper ">
                Pay &amp; Register Autopay using QR Code
                <p class="small-text">Click to view &amp; scan the QR code
                  with your prefered UPI app</p>
              </div>
            </div>
           <div class="qrCodeWrapper" id="EmanQrCodeBtn" 
            style={{width: '100%',height:'229px',background: 'url(images/qr-wrapper.svg) no-repeat center', cursor: 'pointer'}}
            onClick={() => handleQRPayNow()}
           ></div>
        </>
      )}
      <div className='emandate-heading'>
        <h4>Pay & register Autopay using UPI ID</h4>
        <span className='whatIsEmandate-link' onClick={() => handleClickonWhatisEmandate()}>what is e-Mandate <em>?</em></span>

      </div>
      {upiProviderId == -1 && (
        <ul className='upi-emandate-list'>
        {subPayModes.map((mode, index)=>(
          <li>
            <div className='g-pay'
            onClick={() => handleUPIProviderChange(index)}
            >
              {isMobile && <div className='img-container'><ImageComponent className={mode.code} name={mode.code} /> </div>}
              {!isMobile && <ImageComponent className={mode.code} name={mode.code} /> }{mode.name}
            </div>
          </li>
        ))}
      </ul>
      )}

      {upiProviderId!=-1 && (
        <div className='upi-pay'>
        <div className='gpay-payment'>
        <p class="upi-provider-inner">
          <ImageComponent className={subPayModes[upiProviderId].name} name={subPayModes[upiProviderId].name} /> {subPayModes[upiProviderId].name}
        </p>
        
        <FormControl fullWidth className="dropdown-upi-provider">
          <InputLabel id="demo-simple-select-label">change</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={upiProviderId}
              label="upiProvider"
              onChange={handleProviderDropDownChange}
            >
            {subPayModes.map((mode, index)=>(
              <MenuItem value={index}>{mode.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        </div>
        <div className='gpay-payment no-bg'>
        
             <TextField 
                id="vpa-input"
                label="Enter your UPI id"
                value={vpa}
                error={!!validVPAerror}
                helperText={validVPAerror}
                onChange={handleVpaChange}
                onClick={handleVpaInputClick}
                variant="outlined"
              />

          
             <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Handle</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={upiHandleIndex}
                  label="upi"
                  onChange={handleUpiHandlerIndexChange}
                >
                {subPayModes[upiProviderId].upiHandles.map((handle, index)=>(
                  <MenuItem value={index}>{handle}</MenuItem>
                ))}
              </Select>
            </FormControl>
           
       
        
        </div>
        <FormGroup>
        <FormControlLabel
          value="end"
          control={<Checkbox id="autopayChecked" 
                    defaultChecked 
                    onChange={handleCheckboxChange} 
                  />} 
          label="Securely Save this UPI account for a faster checkout next time"
          labelPlacement="end"
          onChange={handleCheckboxChange}
        />
      </FormGroup>
      <Button variant="outlined" size="large" className='pay-upi-btn' onClick={handlePayNow}>
          Pay & Register Autopay
      </Button>

      </div>

        )}

      {showUpiQR && isMobile && (
        <>
            <div class="upi-head1 clearfix1">
              <div class="left upi-gateway-warpper ">
                Pay &amp; Register Autopay using QR Code
                <p class="small-text">Click to view &amp; scan the QR code
                  with your prefered UPI app</p>
              </div>
            </div>
           <div class="qrCodeWrapper" id="EmanQrCodeBtn" 
            style={{width: '100%',height:'229px',background: 'url(images/qr-wrapper.svg) no-repeat center', cursor: 'pointer'}}
            onClick={() => handleQRPayNow()}
           ></div>
        </>
      )} 


      <div className='note-box'>
        <strong>Note</strong>: After successful registration, autopay will be enabled. Future payments on this account will be charged automatically.
      </div>
   {<div className='disclaimer'>
        <strong>Disclaimer</strong>: Amount authorised under e-mandate registration is Rs 2 higher than your premium amount. This is for registration purpose only, the amount deducted from your 	account will be the actual premium amount.
      </div>}

      {showWhatisEmandatePopup ?
      <CustomizedDialogs className="dialog-inner-box" open={showWhatisEmandatePopup} handleClose={() => setShowWhatisEmandatePopup(false)}>
        <EmandatePopUp onClose = {handleCloseWhatisEmandate} handleClose={() => setShowWhatisEmandatePopup(false)}/>
      </CustomizedDialogs> : null}
    </div>
    <Dialog  open={showUpiPopUp} onClose={() => setshowUpiPopUp(false)} >
      <UpiPaymentProcess QrCodeData = {intermediateResponseData} handleCloseDialog={handleCloseDialog}  vpa={vpaId} />
    </Dialog>

    <Dialog open={showUpiBarCode} onClose={() => setShowUpiBarCode(false)}  className='upi-dialog'>
      <UpiQR  QrCodeData={QrCodeData} handleCloseDialog={handleCloseDialog} txAmount = {txAmount} mode = {mode}/>
    </Dialog>

    <Dialog open={showRetry} onClose={() => setShowRetry(false)}>
      <PaymentFailedPopup  handleCloseDialog={handleCloseDialog} retryPayment={retryPayment}  />
    </Dialog>
    </>
  )
}

export default UpiDetailsRecurring;
