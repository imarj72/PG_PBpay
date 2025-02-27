import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Link, TextField,FormControl,InputLabel,Select,MenuItem,Box,FormHelperText } from '@mui/material'
import React, {useState, useEffect} from 'react'
import CardValidator from '../../cardValidator';
import CustomizedDialogs from '../../../shared/CustomDialogs';
// import Loader from '../../Components/loader';
import MasterCardRupayForm from '../../MasterCardRupayForm';
import VisaRecurringInfo from '../../childComponent/VisaRecurringInfo';
import MastercardRecurringInfo from '../../childComponent/MastercardRecurringInfo';

export default function AutoPayoncard({sidcBankNote,payModesToPass,secret , cardDownBanks, productId, srcSupplierId, displayMode, displayOrderNo}) {
    const [selectBankName, setBankName] = React.useState('');
    const [showVisaNetwork, setVisaNetwork] = useState(false);
    const [showMastercardNetwork, setMastercardNetwork] = useState(false);
    const [bankList, setBankList] = useState([]);
    const [bankNames , setBankNames] = useState('');
    const [selectBank, setSelectBank] = useState('');
    const [selectBankError, setSelectBankError] = useState('');
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
    const [cardNameError, setCardNameError] = useState('As mentioned on your Debit Card');
    const [txnurl , settxnurl ] = useState('');
    const [pgpayload , setpgpayload] = useState('');
    const [showLoader, setshowLoader] = useState(false);
    const [formHtml, setFormHtml] = useState('');
    const [showForm, setShowForm] = useState(0);
    const [rupayMap , setRupayMap] = useState('');
    const [isChecked, setIsChecked] =  useState(true);
    let form;



//    const queryParameters = new URLSearchParams(window.location.search);
//    const error = queryParameters.get("error");
//    if(error==="1"){
//     cardDownBanks ='HDFC Bank, ICICI Bank';
//    }

    useEffect(() => {
           if (payModesToPass) {

               const netBankingMethod = payModesToPass.find(method => method.code === 'RECURRING_DC');
               const NBBanks = netBankingMethod ? netBankingMethod.subPayModes : null;
               const recurringBanks = NBBanks.filter(bank => !bank.isRecurringOnAccount);
               setBankList(recurringBanks);
        //setDownNBbanks(nbDownBanks);
        var bankNames = [];
               if(recurringBanks){
               recurringBanks.forEach(function(item) {
               bankNames.push(item.name);
               });

        setBankNames(bankNames);
        }

           }
   }, [payModesToPass]);

        const handleSelectedBankClick = () => {
           setSelectBankError('');
           if (selectBank === 'undefined') {
            setSelectBank('');

          }
        };


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
          console.log('bankId: ' + event.target.value); //bankid eg: 6
           const selectedBankId = event.target.value;
           const bankData = bankList.find(bank => bank.pgBankId === selectedBankId);
           setSelectBank(selectedBankId);
         //  setBankFullName(bankData.name);
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

setCardNameError('As mentioned on your Debit Card');
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

const isSelectedBankValid = (value) => {
    return value > 0;
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
      let selectedBank = document.getElementById('selectedBank').value;
       let data;
       let form;

      console.log('year'+ year);
      const validator = new CardValidator();
      let isValid = false;
      setCardCVVError('');
      setCardExpiryError('');
      setCardNameError('');
      setSelectBankError('');
      setCardNumberError('');

   console.log('selectBank: ' + selectBank);
   if(isSelectedBankValid(selectBank)){
      if(validator.isValidCardNumber(dcNo)){
         if(validator.isValidCardName(dcCardHolder)){
            const isCardDateValid = validator.isValidExpiry(month,year);
            if (isCardDateValid) {
                 setshowLoader(true);
                 const isValidBinForSI = await validator.isCardBinValidForSI(dcNo.substring(0, 6), productId, srcSupplierId,
                                             orderNo,getCardNetwork(cardNumber),/*mode*/ 'SI_DC', /*isNewUI*/ true);
                 setshowLoader(false);
                 if(!isValidBinForSI && (displayMode == 1 || displayMode == 7)){
                     setCardNumberError('Sorry! setting up of auto-pay on this card is not supported. Please try with auto-pay on account.');
                 } else {
                     isValid = true;
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
     }else{
       setSelectBankError('Please select bank');
     }
       year = '20'+year;

      if(isValid){
        setshowLoader(true);
        console.log('REAched here :)');

        dcNo = encodeURIComponent(validator.encrypt(dcNo, secret).toString());
        dcCVV = encodeURIComponent(validator.encrypt(dcCVV, secret).toString());
        dcCardHolder = encodeURIComponent(validator.encrypt(dcCardHolder, secret).toString());
        month = encodeURIComponent(validator.encrypt(month, secret).toString());
        year = encodeURIComponent(validator.encrypt(year, secret).toString());
        isOptSi = encodeURIComponent(validator.encrypt('1', secret).toString());


        const cardData = {
            dcNo,
            dcCardHolder,
            dcExpiryMonth:month,
            dcExpiryYear:year,
            dcCVV,
            orderNo,
            isOptSi,
            mode : "DC",
            forceGateway: "",
            displayOrderNo
        };


        try {
        const response = await fetch('/pay/securePayment/process/recurring/paymentui', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify(cardData)
        });
        data = await response.json();
        setshowLoader(false);

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
         window.location.reload();
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
     <div className='emandate-card-details'>
        Debit card details
           <Box mt={2}>
           
              </Box>

               <div className='card-details' style = {{marginTop: '12px'}}>
               <div className='card-detail-form'>
               
               
               
               
                <Grid container spacing={2}>
                
                <FormControl  fullWidth error={!!selectBankError} className='form-control'>
                <InputLabel id="bank-select-label">Select Bank</InputLabel>
                <Select
                  labelId="bank-select-label"
                  id="selectedBank"
                  label="selectBank"
                  value={selectBank}
                  onClick={handleSelectedBankClick}
                  onChange={handleChange}
                >
                  {bankList.map((mode) => (
                    <MenuItem key={mode.pgBankId} value={mode.pgBankId}>
                      {mode.name}
                    </MenuItem>
                ))}
                </Select>
                <FormHelperText>{selectBankError}</FormHelperText>
              </FormControl>
                
                
                
                <FormControl fullWidth className='form-control'>
                   <Grid item md={12} xs={12}  className={`debit-card ${getCardNetwork(cardNumber)}`}>
                       <TextField
                          id="cardNumber"
                           label="Debit Card Number"
                           placeholder="XXXX-XXXX-XXXX-XXXX"
                           value={cardNumber}
                           fullWidth
                           error={!!cardNumberError}
                           helperText={cardNumberError}
                           style={{borderRadius:'8px',width: '100%' }}
                           onClick={handleCardNumberClick}
                           onChange={handleCardNumberChange}
                       />
                   </Grid>
                </FormControl>


                <FormControl fullWidth className='form-control'>
                <Grid item md={12} xs={12}>
                                 <TextField
                         id="name"
                         label="Enter Your Name"
                         fullWidth
                         onChange={handleNameChange}
                                 onClick ={handleNameClick}
                                 error={showCardNameError}
                                 helperText={cardNameError}
                                 style={{borderRadius:'8px',width: '100%' }}
                                 value={name}
                              />
                        </Grid>
                </FormControl>

                </Grid>
                     <Grid container spacing={2}>
                            <Grid item md={6} xs={6} style={{ marginLeft: '-15px' }}>
                             <FormControl fullWidth className='form-control'>
                              <TextField
                                 id="expiry"
                                 label="Expiry Month & Year"
                                   placeholder="MM-YY"
                                  error={!!cardExpiryError}
                                     helperText={cardExpiryError}
                                 value = {expiryMonthYear}
                                 style={{borderRadius:'8px',width: '100%' }}
                                 onClick ={handleExpiryClick}
                                 onChange={handleExpiryChange}
                                 onKeyDown={handleKeyDown}
                                 fullWidth

                             />
                               </FormControl>

                                </Grid>
                                <Grid item md={6} xs={6} className='cvv-box'>
                                 <FormControl fullWidth className='form-control'>
                                    <TextField
                                       id="cvv"
                                       label="CVV"
                                       type="password"
                                       value = {cvv}
                                       placeholder="***"
                                       style={{borderRadius:'8px',width: '107%' }}
                                        error={!!cardCVVError}
                                        helperText={cardCVVError}
                                        onChange={handleCvvChange}
                                       onClick={handleCvvClick}
                                        fullWidth
                                   />
                                    </FormControl>
                                 </Grid>
                                 </Grid>


       <FormControlLabel
           value="end"
           control={<Checkbox checked={true} disabled={true} />}
           label={<span style={{ color: 'black' }}>I agree to set up on my Debit Card if applicable</span>}
           labelPlacement="end"
           style={{ marginLeft: '-25px', width: '110%' }}
       />


                  </div></div>
                       <div className='text-right'>
                           <Button className="register-autopay-btn" onClick={handlePayNow} sx={{ width: { xs: '100%', sm: 'auto' }}}>Register Autopay</Button>
                       </div>

                {showVisaNetwork ? <CustomizedDialogs className="dialog-inner-box" open={showVisaNetwork} handleClose={() => setVisaNetwork(false)}>
                       <VisaRecurringInfo handleClose={() => setVisaNetwork(false)}/>
                     </CustomizedDialogs> : null}
                 {showMastercardNetwork ? <CustomizedDialogs className="dialog-inner-box" open={showMastercardNetwork} handleClose={() => setMastercardNetwork(false)}>
                           <MastercardRecurringInfo handleClose={() => setMastercardNetwork(false)}/>
                         </CustomizedDialogs> : null}
            </div>
      </>
  );
}
