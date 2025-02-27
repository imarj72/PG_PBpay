import React , {useState , useEffect} from 'react'
import { Link,Button,TextField } from '@mui/material';
// import Loader from '../../Components/loader';
import ImageComponent from '../../shared/ImageComponent';
import CardValidator from '../cardValidator';
import { FourMpRounded } from '@mui/icons-material';
function CardlessEmiDetails({cardlessBankList , mode , secret , amountToBePaid }) {

  const [codeList , setcodeList] = useState([]);
  const [selectBankCode, setBankCode] = useState('');
  const [NBerror, setNBerror] = useState(false);
  const [txnurl , settxnurl ] = useState('');
  const [pgpayload , setpgpayload] = useState('');
  const [showLoader, setshowLoader] = useState(false);
  const [mobileNumber , setMobileNumber] = useState('');
  const [mobileNumberError , setMobileNumberError] = useState('');
   let form;
   let modeType;
   let encryptedMob;
   const modeToPass = 'CARDLESS_EMI';
   
   
     const handleCardNumberClick = () => {
     setMobileNumberError('');
    };
   
   const handleMobileNumberChange =  (event) => {
     const value = event.target.value;
     const sanitizedValue = value.replace(/\D/g, '').slice(0, 12);
     setMobileNumber(sanitizedValue);	
   };

    const queryParameters = new URLSearchParams(window.location.search);
    let orderNo = queryParameters.get("orderNo");
  
  const handleChange = (event) => {
  setNBerror(false);
  const selectedBankCode = event.target.value;
  
  setBankCode(selectedBankCode); 
 
};
useEffect(() => {
   setcodeList(cardlessBankList);
  }, [cardlessBankList]); 
  
  const handlePayNow = async () => {
    let isValid = true;
    if(selectBankCode === '241'){
    if (/^[1-9][0-9]{4,14}$/.test(mobileNumber)) {
       setshowLoader(true);
        const validates = new CardValidator();
        encryptedMob = encodeURIComponent(validates.encrypt(mobileNumber, secret).toString());
        const postData = JSON.stringify({
        orderNo: orderNo,
        custAmount: amountToBePaid,
        custMob: encryptedMob,
      });

      try {
        const response = await fetch('/pay/emi/shopSe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: postData,
        });

        const data = await response.json();
        

        if (data.status) {
          setshowLoader(false);
        } else {
          setshowLoader(false);
          isValid = false;
          alert('Not eligible for EMI');
        }
      } catch (error) {
        isValid = false;
        console.error('Error:', error);
      } finally {
        setshowLoader(false);
      }
    } else {
      isValid = false;
      setshowLoader(false);
      setMobileNumberError('Please enter valid mobile number');
    }
  }  
  
    if(isValid){
    if(selectBankCode > 0){
    setshowLoader(true);
    const queryParameters = new URLSearchParams(window.location.search);
    const order = queryParameters.get("orderNo");
    if(mode === 'EMI'){
     modeType = "EMI_CARDLESS";
    }
    if(mode === 'NCEMI'){
     modeType = "NCEMI_CARDLESS";
    }

    try {
      const response = await fetch('/pay/securePayment/process/paymentui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNo: order,
          mode: modeToPass,
          modeType: modeType,
          emiBankId : selectBankCode,
          custMobi : encryptedMob
        })
      });
      const data = await response.json();
      
      if(data.as ===1){
      if(data.pgPayload.form){
      const formHtml = data.pgPayload.form;
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = formHtml;
      const formElement = tempContainer.querySelector('form');
      document.body.appendChild(formElement);
      setshowLoader(false);
      formElement.submit();
      }
      else if(data.txnURL){
       settxnurl(data.txnURL);
       setpgpayload(data.pgPayload);
       await delay(1500);
       form=document.getElementById('testForm');
       form.submit();
      }  }else if(data.as ===2){
       window.location.href = data.txnURL1;
      
      }else if(data.error === 1){
        window.location.reload();      
        }  
         } catch (error) {
        setshowLoader(false);
        console.error('Error:', error);
        
    }
    }else{
    setNBerror(true);
    }
    }
    } 
  
  
  useEffect(() => {
        if (selectBankCode){
          }
	setNBerror(false);	
          }, [selectBankCode]); 
  
const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});
  
  return (
  <>
   {/* {showLoader && <Loader show={true} textToShow="Please wait while your transaction is being processed"/>}
   {pgpayload && (
    <form method="post" action={txnurl} id="testForm">
        {Object.keys(pgpayload).map((key, index) => (
            <input key={index} type="hidden" id={key} name={key} value={pgpayload[key]} />
        ))}
    </form>
)} */}
  	
    <div className='cardless-emi-box'>
        <ul>
            {codeList && codeList.includes("236") && (<li className={selectBankCode === '236' ? 'active' : ''} onClick={() => setBankCode('236')}>
                <Link>
                    <ImageComponent name={'Axio'} />  <span>Axio</span>
                </Link>
            </li>)}
           {codeList && codeList.includes("80") && (<li className={selectBankCode === '80' ? 'active' : ''} onClick={() => setBankCode('80')}>
                <Link>
                    <ImageComponent name={'BajajFinserv'} /> <span>Bajaj Finserv</span>
                </Link>
            </li>)}
           {codeList && codeList.includes("241") && (<li className={selectBankCode === '241' ? 'active' : ''} onClick={() => setBankCode('241')}>
                <Link>
                    <ImageComponent name={'ShopSe'} /> <span>ShopSe</span>
                </Link>
                
            </li>)}
             {selectBankCode === '241' && (
              <>
                <div>Customer Mobile (Number linked to Aadhar is preferred)</div>
             
                  <TextField fullWidth type="text" placeholder="Enter your mobile number" 
                  style={{
                    marginBottom:'20px',
                  }}
                   value = {mobileNumber}
                   onChange = {handleMobileNumberChange}
                   error={mobileNumberError}
                   helperText={mobileNumberError}
                   onClick = {handleCardNumberClick} 
                  />
                
              </>
            )}
           {codeList && codeList.includes("232") && (<li className={selectBankCode === '232' ? 'active' : ''}  onClick={() => setBankCode('232')}>
                <Link>
                    <ImageComponent name={'EarlySalary'} /> <span>Early Salary</span>
                </Link>
            </li>)}
            {codeList && codeList.includes("242") && (<li className={selectBankCode === '242' ? 'active' : ''} onClick={() => setBankCode('242')}>
                <Link>
                    <ImageComponent name={'Paytm'} /> <span>Paytm Postpaid</span>
                </Link>
            </li>)}
            <li>
             {NBerror && (
      <p style={{ color: 'red' }}>Please select a bank!</p>
    	)}	
    	 
    	
                <Button variant="outlined" size="large" className='pay-now-btn' onClick={handlePayNow}>
                  Continue
                </Button>
            </li>
        </ul>
      
    </div>
    </>
  )
}

export default CardlessEmiDetails
