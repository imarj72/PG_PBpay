import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Grid, TextField, FormGroup, FormControlLabel, Checkbox, Link, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import CardValidator from '../cardValidator';
// import Loader from '../../Components/loader';
import MasterCardRupayForm from '../MasterCardRupayForm';


function EmiCreditCardDetails({ secret, bankId, displayOrderNo, selectEmiCode, bankList, handleCloseDialog }) {
  useEffect(() => {
    if (bankId > 0) {
      const selectedBank = bankList.find(bank => bank.code === bankId);
      setBankName(selectedBank.name);
    }
  }, [bankId]);

  const [selectEmiDuration, setEmiDuration] = React.useState('');

  const handleSelectChange = (event) => {
    setEmiDuration(event.target.value);
  };

  const bankImages = {
    21: './images/hdfc.svg',
    22: './images/icici.svg',
    4: './images/axis.svg',
    6: './images/BOB.svg',
    32: './images/kotak_mahindra.svg',
    48: './images/sbi.svg',
    59: './images/yes.svg',
    73: './images/citi.svg',
    76: './images/hsbc.svg',
    41: './images/rbl.svg',
    45: './images/standardchartered.svg',
    27: './images/indusind.svg',
    84: './images/amexbank.svg',
    20: './images/federal.svg',
    85: './images/aubank.svg',
    24: './images/idfc.svg',
    292: './images/onecard.svg',
    23: './images/idbi.svg',
    9: './images/canara.svg',

  };

  const [cardType, setCardType] = useState('');
  const [showVisaNetwork, setVisaNetwork] = useState(false);
  const [expiryMonthYear, setExpiryMonthYear] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expity, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardCVVError, setCardCVVError] = useState('');
  const [cardExpiryError, setCardExpiryError] = useState('');
  const [binError, setBinError] = useState('');
  const [showCardNameError, setshowCardNameError] = useState(false);
  const [cardNameError, setCardNameError] = useState('As mentioned on your credit card');
  const [bankName, setBankName] = useState('');
  const [txnurl, settxnurl] = useState('');
  const [pgpayload, setpgpayload] = useState('');
  const [showLoader, setshowLoader] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [formHtml, setFormHtml] = useState('');
  const [showForm, setShowForm] = useState(0);
  const [rupayMap, setRupayMap] = useState('');
  let form;
  let data;
  let mode = 'EMI';
  let id;
  let emicode;
  let firstSixDigits;
  let isValidBin = false;




  const getCardNetwork = (cardNumber) => {
    if (cardNumber.length >= 6) {
      const bin = cardNumber.substring(0, 6);
      const binNum = parseInt(bin, 10);

      if (/^4/.test(bin)) {
        setCardType('visa');
        return 'visa';
      }
      else if ((binNum >= 222100 && binNum <= 272099) ||
        (binNum >= 510000 && binNum <= 559999)) {
        setCardType('mastercard');
        return 'mastercard';
      }
      else if (/^3[47]/.test(bin)) {
        setCardType('amex');
        return 'amex';
      }
      else if (/^(6011|622(1[2-9][0-9]|2[0-9]{2})|64[4-9]|65)/.test(bin)) {
        setCardType('discover');
        return 'discover';
      }
      else if (/^3(?:0[0-5]|[68][0-9])[0-9]/.test(bin)) {
        setCardType('diners');
        return 'diners';
      }

      else if ((binNum >= 508500 && binNum <= 508999) ||
        (binNum >= 606985 && binNum <= 607984) ||
        (binNum >= 608001 && binNum <= 608500) ||
        (binNum >= 652150 && binNum <= 653149)) {
        setCardType('rupay');
        return 'rupay';
      }
    }
    setCardType('');
    return '';
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

    setCardNameError('As mentioned on your credit card');
    setshowCardNameError(false);

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

  const handleCardNumberChange = async (event) => {



    const value = event.target.value;
    const sanitizedValue = value.replace(/\D/g, '').slice(0, 16);
    const formattedValue = sanitizedValue.replace(/(.{4})/g, '$1 ').trim();
    getCardNetwork(sanitizedValue);
    setCardNumber(formattedValue);
    if (sanitizedValue.length < 6) {
      setCardNumberError('');
    }
    if (sanitizedValue.length > 5) {
      const checkEligibility = async () => {
        firstSixDigits = sanitizedValue.slice(0, 6);
        try {
          const response = await fetch(`/pay/emiDetails/eligibility?cardBin=${firstSixDigits}&bankId=${bankId}&mode=${mode}`, {// to be updated by @aniket
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            setIsEligible(false);
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('iseligible' + response);
          if (data && data.isEligible === '1') {
            console.log('iseligible');
            setIsEligible(true);
            setCardNumberError('');
          } else {
            setIsEligible(false);
            setCardNumberError('Card bin is not valid');
          }
        } catch (error) {
          setIsEligible(false);
          console.error("Error checking EMI eligibility:", error);

        } finally {

        }
      };

      checkEligibility();
    }
  };


  const handleNameChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^A-Za-z\s]/g, '');
    setName(value);
  };

  const handleCardNumberClick = () => {
    setCardNumberError('');
    if (cardNumber === 'XXXX-XXXX-XXXX-XXXX') {
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
    const mode = "EMI";
    let emiNo = cardNumber;
    emiNo = emiNo.replace(/\s+/g, '');
    let emiCardHolder = name;
    let emiCVV = cvv;
    let orderNo = queryParameters.get("orderNo");
    let [month, year] = expiryMonthYear.split('-');
    let isOptSi = '0';
    const validator = new CardValidator();
    let isValid = false;
    setCardCVVError('');
    setCardExpiryError('');
    setCardNameError('');
    setCardNumberError('');
    firstSixDigits = emiNo.slice(0, 6);
    if (isEligible) {
      if (validator.isValidCardNumber(emiNo)) {
        if (validator.isValidCardName(emiCardHolder)) {
          if (validator.isValidExpiry(month, year)) {
            if (validator.isValidCVV(emiCVV)) {
              isValid = true;
            } else {
              setCardCVVError('Please enter a valid CVV');
            }
          } else {
            setCardExpiryError('Please enter a valid expiry');
          }
        } else {
          setshowCardNameError(true);
          setCardNameError('Please enter a valid card holder name');
        }
      } else {
        setCardNumberError('Please enter a valid card number');
      }
    } else {
      setCardNumberError('Card is not eligible for EMI');
    }



    year = '20' + year;
    if (isValid) {
      setshowLoader(true);
      emiNo = encodeURIComponent(validator.encrypt(emiNo, secret).toString());
      emiCVV = encodeURIComponent(validator.encrypt(emiCVV, secret).toString());
      emiCardHolder = encodeURIComponent(validator.encrypt(emiCardHolder, secret).toString());
      month = encodeURIComponent(validator.encrypt(month, secret).toString());
      year = encodeURIComponent(validator.encrypt(year, secret).toString());
      id = encodeURIComponent(validator.encrypt(bankId, secret).toString());
      emicode = encodeURIComponent(validator.encrypt(selectEmiCode, secret).toString());

      const cardData = {
        emiNo,
        emiCardHolder,
        emiExpiryMonth: month,
        emiExpiryYear: year,
        emiCVV,
        orderNo,
        mode: mode,
        emiBankCode: emicode,
        emiBankId: id,
        displayOrderNo: displayOrderNo
      };


      try {
        const response = await fetch('/pay/securePayment/process/paymentui', { //to be updated by @aniket
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cardData)
        });
        data = await response.json();
        setshowLoader(false);
        console.log(data);
        if (data.as === 1) {

          if (data.pgPayload.form) {
            const formHtml = data.pgPayload.form;
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = formHtml;

            const formElement = tempContainer.querySelector('form');
            document.body.appendChild(formElement);
            formElement.submit();
          }




          else if (data.txnURL) {
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
          }
          else {
            setFormHtml(data.form);
            setShowForm(data.showForm);
            await delay(1500);
          }

        } else if (data.error === 1) {
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
      {/* {showLoader && <Loader show={true} textToShow="Please wait while your transaction is being processed"/>}
    {pgpayload && (
    <form method="post" action={txnurl} id="testForm">
        {Object.keys(pgpayload).map((key, index) => (
            <input key={index} type="hidden" id={key} name={key} value={pgpayload[key]} />
        ))}
    </form>
)}
    */}
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
          position: 'fixed',
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
          <MasterCardRupayForm mastRupay={rupayMap} />
        </div>
      )}

      <div className='enter-bank-details'>
        <div className='bank-info-edit'>
          <div className='head'>
            <p>
              <img src={bankImages[bankId]} alt={bankName} />
              <span
                style={{
                  fontSize:'14px',
                  margin:'auto 5px',
                }}
              > {bankName} </span>
            </p>
            <p className='edit-pen'>
              <Button onClick={() => handleCloseDialog ? handleCloseDialog() : null}><FontAwesomeIcon icon={faPencilAlt} /></Button>
            </p>
          </div>
        </div>
        <h5>
          Enter your credit card details
        </h5>
        <div className='card-detail-form'>

          <Grid container spacing={3}>
            <Grid item md={12} xs={12} className={`debit-card ${cardType}`}>
              <TextField
                id="cardNumber"
                label="Credit Card Number"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={cardNumber}
                fullWidth
                error={!!cardNumberError}
                helperText={cardNumberError}
                onClick={handleCardNumberClick}
                onChange={handleCardNumberChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {cardType === 'mastercard' && (
                        <img src='/images/mastercard-icon.svg' alt="MasterCard" style={{ width: '40px' }} />
                      )}
                      {cardType === 'visa' && (
                        <img src='/images/visa.svg' alt="Visa" style={{ width: '40px' }} />
                      )}
                      {cardType === 'rupay' && (
                        <img src='/images/rupay.svg' alt="Rupay" style={{ width: '40px' }} />
                      )}
                      {cardType === 'amex' && (
                        <img src='/images/amex.png' alt="Amex" style={{ width: '40px' }} />
                      )}
                      {cardType === 'discover' && (
                        <img src='/images/discover.svg' alt="Discover" style={{ width: '40px' }} />
                      )}
                      {cardType === 'diners' && (
                        <img src='/images/diners.svg' alt="Diners" style={{ width: '40px' }} />
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <TextField
                id="name"
                label="Enter your name"
                fullWidth
                onChange={handleNameChange}
                onClick={handleNameClick}
                error={showCardNameError}
                helperText={cardNameError}
                value={name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="expiry"
                label="Expiry Month & Year"
                placeholder="MM-YY"
                error={!!cardExpiryError}
                helperText={cardExpiryError}
                value={expiryMonthYear}
                onClick={handleExpiryClick}
                onChange={handleExpiryChange}
                onKeyDown={handleKeyDown}
                fullWidth

              />
            </Grid>
            <Grid item md={6} xs={12} className='cvv-box'>
              <TextField
                id="cvv"
                label="CVV"
                type="password"
                value={cvv}
                placeholder="***"
                error={!!cardCVVError}
                helperText={cardCVVError}
                onChange={handleCvvChange}
                onClick={handleCvvClick}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <img src="/images/cvv_card.svg" alt="CVV Icon" style={{ width: '25px' }} />
                    </InputAdornment>
                  )
                }}
                fullWidth
              />
            </Grid>

          </Grid>
          <div className='autopay-check'>
            <Button variant="outlined" size="large" className='pay-now-btn' onClick={handlePayNow}>
              Pay now
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmiCreditCardDetails




