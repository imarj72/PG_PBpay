import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, InputAdornment, Typography } from '@mui/material';
import React, { useState } from 'react';
// import VisaIcon from '../../assets/visa-icon.svg';  
// import RupayIcon from '../../assets/rupay-icon.svg'; 
// import AmexIcon from '../../assets/amex-icon.svg'; 
// import DiscoverIcon from '../../assets/discover-icon.svg'; 
import CardValidator from '../../cardValidator';
import MasterCardRupayForm from '../../MasterCardRupayForm';
// import CustomizedDialogs from '../../../shared/CustomDialogs';
// import VisaMasterInfo from '../../childComponent/VisaMasterInfo';

function CreditCardSI({ secret, cardDownBanks, displayMode, displayModeCheck }) {
    const [cardType, setCardType] = useState(''); 
    const [expiryMonthYear, setExpiryMonthYear] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [cardNumberError, setCardNumberError] = useState('');
    const [cardCVVError, setCardCVVError] = useState('');
    const [cardExpiryError, setCardExpiryError] = useState('');
    const [showCardNameError, setshowCardNameError] = useState(false);
    const [cardNameError, setCardNameError] = useState('As mentioned on your Credit Card');
    const [txnurl, settxnurl] = useState('');
    const [pgpayload, setpgpayload] = useState('');
    const [showLoader, setshowLoader] = useState(false);
    const [formHtml, setFormHtml] = useState('');
    const [showForm, setShowForm] = useState(0);
    const [rupayMap, setRupayMap] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    let form;
    const queryParameters = new URLSearchParams(window.location.search);
    const error = queryParameters.get("error");
    if (error === '1') {
        cardDownBanks = 'ICICI Bank, HDFC Bank';
    }

    const getCardNetwork = (cardNumber) => {
        if (cardNumber.length >= 6) {
            const bin = cardNumber.substring(0, 6);
            const binNum = parseInt(bin, 10);

            // Visa: Starts with 4
            if (/^4/.test(bin)) {
                setCardType('visa');
                return 'visa';
            }
            // MasterCard: 51-55 or 2221-2720
            else if ((binNum >= 222100 && binNum <= 272099) || 
                    (binNum >= 510000 && binNum <= 559999)) {
                setCardType('mastercard');
                return 'mastercard';
            }
            // Amex: Starts with 34 or 37
            else if (/^3[47]/.test(bin)) {
                setCardType('amex');
                return 'amex';
            }
            // Discover: Starts with 6011, 622126-622925, 644-649, 65
            else if (/^(6011|622(1[2-9][0-9]|2[0-9]{2})|64[4-9]|65)/.test(bin)) {
                setCardType('discover');
                return 'discover';
            }
            // RuPay: Specific BIN ranges
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
        setCardNameError('As mentioned on your Credit Card');
        setshowCardNameError(false);
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
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
        const formattedValue = sanitizedValue.replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(formattedValue);
        getCardNetwork(sanitizedValue);
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

    const handlePayNow = async () => {
        const queryParameters = new URLSearchParams(window.location.search);
        const mode = "CC";
        let ccNo = cardNumber.replace(/\s+/g, '');
        let ccCardHolder = name;
        let ccCVV = cvv;
        let orderNo = queryParameters.get("orderNo");
        let [month, year] = expiryMonthYear.split('-');
        let isOptSi = isChecked ? '1' : '0';

        const validator = new CardValidator();
        let isValid = false;
        setCardCVVError('');
        setCardExpiryError('');
        setCardNameError('');
        setCardNumberError('');
        if (validator.isValidCardNumber(ccNo)) {
            if (validator.isValidCardName(ccCardHolder)) {
                const isCardDateValid = validator.isValidExpiry(month, year);
                if (isCardDateValid) {
                    if (displayModeCheck != null && displayModeCheck && isChecked) {
                        if (!validator.isValidDebitMonthYearSetup(month, year)) {
                            setCardExpiryError("The card expires soon putting your auto-debit at risk. Please use another card.");
                        } else {
                            if (validator.isValidCVV(ccCVV)) {
                                isValid = true;
                            } else {
                                setCardCVVError('Please enter a valid CVV');
                            }
                        }
                    } else {
                        const data = await validator.isValidExpirySI(month, year);
                        if (data.msg === 'true') {
                            setCardExpiryError('The card expires soon putting your auto-debit at risk. Please use another card.');
                        } else {
                            if (validator.isValidCVV(ccCVV)) {
                                isValid = true;
                            } else {
                                setCardCVVError('Please enter a valid CVV');
                            }
                        }
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
        year = '20' + year;
        if (isValid) {
            setshowLoader(true);
            ccNo = encodeURIComponent(validator.encrypt(ccNo, secret).toString());
            ccCVV = encodeURIComponent(validator.encrypt(ccCVV, secret).toString());
            ccCardHolder = encodeURIComponent(validator.encrypt(ccCardHolder, secret).toString());
            month = encodeURIComponent(validator.encrypt(month, secret).toString());
            year = encodeURIComponent(validator.encrypt(year, secret).toString());
            isOptSi = encodeURIComponent(validator.encrypt(isOptSi, secret).toString());

            const cardData = {
                ccNo,
                ccCardHolder,
                ccExpiryMonth: month,
                ccExpiryYear: year,
                ccCVV,
                orderNo,
                isOptSi,
                mode: mode
            };

            try {
                const response = await fetch('/pay/securePayment/process/paymentui', {   //to be updated by @aniket
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cardData)
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
            } catch (error) {
                console.error('Error:', error);
                window.location.reload();
            }
        }
    };

    const delay = millis => new Promise(resolve => setTimeout(resolve, millis));

    return (
        <>
            {showForm === 1 && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
                }}>
                    <div dangerouslySetInnerHTML={{ __html: formHtml }} />
                </div>
            )}

            {showForm === 2 && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'white', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 9999
                }}>
                    <MasterCardRupayForm mastRupay={rupayMap} />
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

            <div className="card-details">
                <h5>Enter your Credit Card details</h5>
                <div className="card-detail-form">
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
                                    </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                id="name"
                                label="Enter Your Name"
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
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={6} xs={12} className="cvv-box">
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
                        <Grid item md={12} xs={12} className="autopay-check">
                            <FormGroup>
                                <FormControlLabel control={<Checkbox id="autopayChecked" defaultChecked disabled={displayMode == 6} onChange={handleCheckboxChange} />} label="Set up Autopay on your Credit Card if applicable" />
                            </FormGroup>
                            <Button variant="outlined" size="large" className="pay-now-btn" onClick={handlePayNow}>
                                Pay now
                            </Button>
                        </Grid>
                    </Grid>
                        <Grid>
                            <Typography className='footer-credit-card' sx={{
                                paddingLeft:'8px'
                            }}>Click an option to view the list of Credit cards allowed for Autopay facility</Typography>
                            <Button className='footer-credit-card-btn' sx={{
                                textTransform: 'Capitalize',
                            }}>
                                Visa network
                            </Button>
                            <Button className='footer-credit-card-btn' sx={{textTransform:'capitalize'}}>
                                Mastercard network
                            </Button>
                        </Grid>
                </div>
            </div>
        </>
    );
}

export default CreditCardSI;
