import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Link, TextField,FormControl,InputLabel,Select,MenuItem } from '@mui/material'
import React, {useState, useEffect} from 'react';
import CardValidator from '../../cardValidator';
import CustomizedDialogs from '../../../shared/CustomDialogs';
import VisaMasterInfo from '../../childComponent/VisaMasterInfo';
import CardTabs from '../../childComponent/CardTabs';
// import Loader from '../../Components/loader';
import MasterCardRupayForm from '../../MasterCardRupayForm';

function DebitCardSI({secret ,cardDownBanks, displayMode, displayModeCheck}) {
    const [selectBankName, setBankName] = React.useState('');
    const [showVisaNetwork, setVisaNetwork] = useState(false);
    const [expiryMonthYear, setExpiryMonthYear] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expity, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name , setName] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('../../../../../public/images/master_cvv.svg');
    const [cardNumberError, setCardNumberError] = useState('');
    const [cardCVVError, setCardCVVError] = useState('');
    const [cardExpiryError, setCardExpiryError] = useState('');
    const [showCardNameError , setshowCardNameError] = useState(false);
    const [cardNameError, setCardNameError] = useState('As mentioned on your debit card');
    const [txnurl , settxnurl ] = useState('');
    const [pgpayload , setpgpayload] = useState('');
    const [showLoader, setshowLoader] = useState(false);
    const [formHtml, setFormHtml] = useState('');
    const [showForm, setShowForm] = useState(0);
    const [rupayMap , setRupayMap] = useState('');
    const [isChecked, setIsChecked] =  useState(true);
    let form;
    
    
    
    const queryParameters = new URLSearchParams(window.location.search);
    const error = queryParameters.get("error");
    if(error==="1"){
     cardDownBanks ='HDFC Bank, ICICI Bank';
    }

   
      const getCardNetwork = (cardNumber) => {
        if(cardNumber.length>5){
        const bin = cardNumber.substring(0, 6);
        const visaPattern = /^4/;
        const mastercardPattern = /^5[1-5]/;
        const amexPattern = /^3[47]/;
        const discoverPattern = /^6(?:011|5[0-9]{2})/;
        const rupay = /^[508500-508999]|[606985-607984]|[608001-608500]|[652150-653149]/;
    const dinersPattern = /^3(?:0[0-5]|[68][0-9])[0-9]/;
        if (mastercardPattern.test(bin)) {
            return 'mastercard';
        } else if (visaPattern.test(bin)) {
            return 'visa';
        } else if (amexPattern.test(bin)) {
            return 'amex';
        }else if (dinersPattern.test(bin)) {
           return 'diners';
        }
        else if (rupay.test(bin)){
            return 'rupay';
        } 
         else if (discoverPattern.test(bin)) {
            return 'discover';
        } 
        else {
            return 'card';
        }
        }else{
        return 'card';
        }
    };
    
    

const handleChange = (event) => {
    setBankName(event.target.value);
};
const handleCvvChange = (event) => {
    const inputValue = event.target.value;
 
    if (!isNaN(inputValue) && inputValue.length <= 4) {
        setCvv(inputValue);
      
     }
};

const handleExpiryChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (/^[2-9]/.test(value)) {
        value = '0' + value;
    }
    if (value.length >= 2 && value.indexOf('-') === -1) {
        value = value.slice(0, 2) + '-' + value.slice(2);
    }
    const parts = value.split('-');
    if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '-' + parts[1].slice(0, 2);
    }
    setExpiryMonthYear(value);
};

const handleNameClick = () => {

setCardNameError('As mentioned on your debit card');
setshowCardNameError(false);

};

const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked); // Get the checked value
    console.log("Checkbox is checked:", event.target.checked); // Log the checked value
};

const handleExpiryClick = () => {
      setCardExpiryError('');
     if (expiryMonthYear === 'MM-YY') {
     setExpiryMonthYear('');
    }
  };

    
    
  const handleCvvClick = () => {
     setCardCVVError('');
     if (cvv === '****') {
      setCvv('');
     
    }
  };
  const handleCardNumberChange = (event) => {
        const value = event.target.value;
        const sanitizedValue = value.replace(/\D/g, '').slice(0, 16);
        if(sanitizedValue.length>6){
        const network = getCardNetwork(sanitizedValue); 
        if(network === 'Visa'){
          setBackgroundImage('../../../../../public/images/visa.svg');
          }
          console.log(backgroundImage);
        }
           const formattedValue = sanitizedValue.replace(/(.{4})/g, '$1 ').trim();
         setCardNumber(formattedValue); 
     //   setCardNumber(sanitizedValue);
    };

const handleNameChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^A-Za-z\s]/g, '');
    setName(value);
};

    const handleCardNumberClick = () => {
     setCardNumberError('');
        if(cardNumber === 'XXXX-XXXX-XXXX-XXXX'){
         setCardNumber('');
        }
        
    };
    const handleKeyDown = (event) => {
        // Allow backspace key
        if (event.key === 'Backspace') {
            setExpiryMonthYear((prevValue) => prevValue.slice(0, -1));
        }
    };
      const handlePayNow = async () => {
      
      const queryParameters = new URLSearchParams(window.location.search);
      const mode = "DC";
      let dcNo = cardNumber;
      dcNo = dcNo.replace(/\s+/g, '');
      let dcCardHolder = name;
      let dcCVV = cvv;
      let orderNo = queryParameters.get("orderNo");
      let [month, year] = expiryMonthYear.split('-');
      let isOptSi = isChecked ?'1':'0';
    
      console.log('year'+ year);
      const validator = new CardValidator();
      let isValid = false;
      setCardCVVError('');
      setCardExpiryError('');
      setCardNameError('');
      setCardNumberError('');
      if(validator.isValidCardNumber(dcNo)){
         if(validator.isValidCardName(dcCardHolder)){
            const isCardDateValid = validator.isValidExpiry(month,year);
            if (isCardDateValid) {
                if (displayModeCheck != null && displayModeCheck && isChecked) {
                    if (!validator.isValidDebitMonthYearSetup(month, year)) {
                        setCardExpiryError("Your card will expire in less than a year. Please use another card to make the payment.");
                    } else {
                        if(validator.isValidCVV(dcCVV)){
                            isValid = true;
                        }else{
                            setCardCVVError('Please enter a valid CVV');
                        }
                    }
                } else {
                    const data = await validator.isValidExpirySI(month, year);
                    if(data.msg === 'true'){
                        setCardExpiryError('Your card will expire in ' + data.days + ' days which will require you to set up autopay again with a different card. We suggest you use a different card to set up autopay.');
                    }else{
                       if(validator.isValidCVV(dcCVV)){
                            isValid = true;
                        }else{
                            setCardCVVError('Please enter a valid CVV');
                        } 
                    }
                }
            }else{
                setCardExpiryError('Please enter a valid expiry');
            }
         }else{
          setshowCardNameError(true);
          setCardNameError('Please enter a valid card holder name');
         }
       }else{
        setCardNumberError('Please enter a valid card number');
     }
       year = '20'+year;
      if(isValid){
        setshowLoader(true);
        dcNo = encodeURIComponent(validator.encrypt(dcNo, secret).toString());
        dcCVV = encodeURIComponent(validator.encrypt(dcCVV, secret).toString());
        dcCardHolder = encodeURIComponent(validator.encrypt(dcCardHolder, secret).toString());
        month = encodeURIComponent(validator.encrypt(month, secret).toString());
        year = encodeURIComponent(validator.encrypt(year, secret).toString());
        isOptSi = encodeURIComponent(validator.encrypt(isOptSi, secret).toString());
     
      const cardData = {
            dcNo,
            dcCardHolder,
            dcExpiryMonth:month,
            dcExpiryYear:year,
            dcCVV,
            orderNo,
            isOptSi,
            mode : mode
        };
    
   
    try {
        const response = await fetch('/pay/securePayment/process/paymentui', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify(cardData)
        });
        const data = await response.json();
        setshowLoader(false);
        console.log(data);
      if(data.as ===1){

        if(data.pgPayload.form){
            const formHtml = data.pgPayload.form;
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = formHtml;
      
            const formElement = tempContainer.querySelector('form');
            document.body.appendChild(formElement);
            formElement.submit();
            }

    
     
      
      else if(data.txnURL){
       settxnurl(data.txnURL);
       setpgpayload(data.pgPayload);
       await delay(1500);
       form = document.getElementById('testForm');
       form.submit();
      
      }
      
      
      } else if(data.as ===2){
       window.location.href = data.txnURL1;
      
      }else if(data.as===3){
        if(data.mastRupay){
        setShowForm(2);
        setRupayMap(data.mastRupay);
       }
        else{
          setFormHtml(data.form);
          setShowForm(data.showForm);
          await delay(1500);
        }
      
      }else if(data.error === 1){
        window.location.reload();      
        } 
    } catch (error) {
        console.error('Error:', error);
    }
    
     
  }
  
  
};


const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});
   
       
  return (
  
  <>
  
   {/* {showLoader && <Loader show={true}/>}
    {pgpayload && (
    <form method="post" action={txnurl} id="testForm">
        {Object.keys(pgpayload).map((key, index) => (
            <input key={index} type="hidden" id={key} name={key} value={pgpayload[key]} />
        ))}
    </form>
)} */}
   
  {showForm === 1 && (
  <div style={{
    position: 'fixed', // Ensure this div covers the whole viewport
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white', // Blank background color
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    zIndex: 9999 // Ensure it's on top of other content
  }}>
    <div dangerouslySetInnerHTML={{ __html: formHtml }} />
  </div>
)}


 {showForm === 2 && (
  <div style={{
    position: 'fixed', // Ensure this div covers the whole viewport
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white', // Blank background color
    //display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    zIndex: 9999 // Ensure it's on top of other content
  }}>
     <MasterCardRupayForm  mastRupay={rupayMap} />
  </div>
)}
 
  {cardDownBanks && cardDownBanks !== null && cardDownBanks.includes(',') && (
    <div className="generalMsgInfo">
        <strong>{cardDownBanks}</strong> are currently facing some technical issues.
    </div>
)}

{cardDownBanks && cardDownBanks !== null && !cardDownBanks.includes(',') && (
    <div className="generalMsgInfo">
        <strong>{cardDownBanks}</strong> is currently facing some technical issues.
    </div>
)}
    <div className='card-details'>
        <div class="hidden md:block"><h5>
            Enter your Debit card details
        </h5></div>
       
        <div className='card-detail-form'>
            
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}  className={`debit-card ${getCardNetwork(cardNumber)}`}>
                    <TextField
                       id="cardNumber"
                        label="Debit Card number"
                         placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={cardNumber}
                        fullWidth
                        error={!!cardNumberError}
                        helperText={cardNumberError}
                        style={{borderRadius:'8px' ,   background: `url(${backgroundImage})` }}
                        onClick={handleCardNumberClick}
                        onChange={handleCardNumberChange}
                    />
                </Grid>
               <Grid item md={12} xs={12}>
                 <TextField
         id="name"
         label="Enter your name"
         fullWidth
         onChange={handleNameChange}
                 onClick ={handleNameClick}
                 error={showCardNameError}
                 helperText={cardNameError}
                 value={name}
              />
        </Grid>
                <Grid item md={6} xs={12}>
                    <TextField
                        id="expiry"
                        placeholder="MM-YY"
                        label="Expiry Month & Year"
                         error={!!cardExpiryError}
                            helperText={cardExpiryError}
                       value = {expiryMonthYear}
                       onClick ={handleExpiryClick}
                        onChange={handleExpiryChange}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        
                    />
                </Grid>
                <Grid item md={6} xs={12}  className='cvv-box'>
                    <TextField
                        id="cvv"
                        label="CVV"
                        type="password"
                        value = {cvv}
                        placeholder="***" 
                        error={!!cardCVVError}
                         helperText={cardCVVError}
                         onChange={handleCvvChange}
                        onClick={handleCvvClick}
                         fullWidth
                    />
                </Grid>
                <Grid item md={12} xs={12} className='autopay-check'>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox id="autopayChecked" defaultChecked disabled={displayMode == 6} onChange={handleCheckboxChange}  />} label="Copy Set up Autopay on your Credit card if applicable" />
                    </FormGroup>
                    <Button variant="outlined" size="large" className='pay-now-btn' onClick={handlePayNow}>
                        Pay now
                    </Button>
                </Grid>
                <Grid item md={12} xs={12}>
                    <strong>Click an option to view the list of Credit cards allowed for Autopay facility</strong>
                    <p>
                      <Link  onClick={() => setVisaNetwork(true)}>Visa network </Link> <Link onClick={() => setVisaNetwork(true)} >Mastercard network</Link>
                    </p>
                </Grid>
              
            </Grid>
        </div>
        </div>
        <div className='card-details debit-box'>
      <div className='card-detail-form'>
        <h5>
          Select details to setup Autopay
        </h5>
        <p className=' py-1 text-xs text-gray-400 mb-4'>
          Where would you like to set up your autopay?
        </p>
        <div className='debit-card-tabs'>
          <CardTabs/>
        </div>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12} >
            <FormControl fullWidth className='form-control'>
              <InputLabel id="demo-simple-select-label">Select Bank</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectBankName}
                label="Bank Name"
                onChange={handleChange}
              >
                <MenuItem value={1}>HDFC BANK</MenuItem>
                <MenuItem value={2}>ICICI</MenuItem>
                <MenuItem value={3}>SBI</MenuItem>
                <MenuItem value={4}>Kotak Mahindra</MenuItem>
                <MenuItem value={5}>Bank of Baroda</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item md={12} xs={12}>
            <Button variant="outlined" size="large" className='pay-now-btn'>
                Pay now
            </Button>
            {/* <EmiTable/> */}
          </Grid>
          
        </Grid>
      </div>
      {showVisaNetwork ? <CustomizedDialogs className="dialog-inner-box" open={showVisaNetwork} handleClose={() => setVisaNetwork(false)}>
        <VisaMasterInfo handleClose={() => setVisaNetwork(false)}/>
      </CustomizedDialogs> : null}
    </div>
      </>
  )
}

export default DebitCardSI
