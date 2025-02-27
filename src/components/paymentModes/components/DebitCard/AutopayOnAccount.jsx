import { Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField,FormHelperText,Box,Grid } from '@mui/material'
import React, {useState, useEffect, useRef} from 'react'
import Checkbox from '@mui/material/Checkbox';
import NetBankingValidator from '../../NetBankingValidator';
// import Loader from '../../Components/loader';
// import getDomain from '../../Components/getDomain';


function AutopayOnAccount({payModesToPass, displayOrderNo, eMandateNo, maxAmountLimit, parentOrderNo, order_id, cust_id, mid, expire_at,orderNo , productId}) {
    const [selectBank, setSelectBank] = useState('');
    const [loading, setLoading] = useState(false);
    const [accountNo, setAccountNo] = useState('');
    const [reAccountNo, setReAccountNo] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankBranch, setBankBranch] = useState('');
    const [holderName, setHolderName] = useState('');
    const [holderEmail, setHolderEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [bankList, setBankList] = useState([]);
    const [bankNames , setBankNames] = useState('');
    const [accountNoError, setAccountNoError] = useState('');
    const [reAccountNoError, setReAccountNoError] = useState('');
    const [selectBankError, setSelectBankError] = useState('');
    const [ifscCodeError, setIfscCodeError] = useState('');
    const [holderNameError, setHolderNameError] = useState('');
    const [holderEmailError, setHolderEmailError] = useState('');
    const [mobileNoError, setMobileNoError] = useState('');
    const [formData, setFormData] = useState({});
    const [accountType, setAccountType] = useState('saving'); // Default to 'saving'
    const [bankFullName, setBankFullName] = useState('');
    const formRef = useRef(null);
    const responseInputRef = useRef(null);
    const [redirectionUrl, setRedirectionUrl] = useState('');
    const [isHealth , setIsHealth] = useState(false);
  
  useEffect(() => {
   if (productId === 2 || productId === 147) {
    setIsHealth(true);
  }
}, [productId]);
   


      useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }, []);

      //  useEffect(() => {
      //      const rUrl =  getDomain() + `/pay/payment/thankyou/emandate`;
      //      setRedirectionUrl(rUrl);
      //      console.log('rUrl: ' + rUrl);
      //     }, []);


      const handleAccountNo = (e) => {
        setAccountNoError('');
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
         setAccountNo(value);
        }
      };

        const isValidIfsc = (value) => {
          const regex = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
          return value && value.length === 11 && regex.test(value);
        };

        const handleSelectedBankClick = () => {
           setSelectBankError('');
           setReAccountNoError('');
           setAccountNoError('');
           setIfscCodeError('');
           setHolderNameError('');
           setHolderEmailError('');
           setMobileNoError('');

           if (selectBank === 'undefined') {
            setSelectBank('');

          }
        };

       const handleAccountNoClick = () => {
           setAccountNoError('');
           console.log('accNo' + accountNo);

           if(accountNo === 'Enter account number'){
             setAccountNo('');
             console.log("acc no tab is hitted!");
           }
        };

       const handleReAccountNoClick = () => {
           setReAccountNoError('');
           if(reAccountNo === 'Confirm account number'){
             setReAccountNo('');
             console.log("re acc no tab is hitted!");
           }
        };

       const handleIfscCodeClick = () => {
           setIfscCodeError('');
           if(ifscCode === 'Enter IFSC here'){
             setIfscCode('');
           }
        };

       const handleHolderNameClick = () => {
           setHolderNameError('');
        };

       const handleEmailClick = () => {
           setHolderEmailError('');
        };

       const handleMobileNoClick = () => {
           setMobileNoError('');
        };


       const handleReAccountNo = (e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
           setReAccountNo(value);
          }
        };

       const handleIfscCodeChange = (e) => {
         const value = e.target.value.trim();  // trim any spaces
         setIfscCode(value);

         if (value.length === 11) {
           setBankCode(value);
         }else{
         setBankBranch('');
         }
       };

       const handleAccountHolderName = (e) => {
         const value = e.target.value;
         const regex = /^[A-Za-z\s]*$/;

         if (regex.test(value)) {
           setHolderName(value);
         }
       };

       const setBankCode = async (ifscCode) => {
         try {
           const url = `https://ifsc.razorpay.com/${ifscCode}`;
           console.log("Fetching from URL: " + url);

           const response = await fetch(url, { method: 'GET' });

           if (response.ok) {
             const data = await response.json();
             console.log("Response Data:", data);
             setBankBranch(data.BRANCH);
           } else {
             setBankBranch('');
           }
         } catch (error) {
           console.error('API request error:', error);
         }
       };

     const handleAccountTypeChange = (event) => {
        const selectedValue = event.target.value;
        console.log('Selected Account Type:', selectedValue);
        setAccountType(selectedValue);
     };

     const getPgCodeByBankId = (pgBankId) => {
       const bank = bankList.find(bank => bank.pgBankId === pgBankId);
       return bank ? bank.pgCode : '';
     };

    const handleChange = (event) => {
       console.log('bankId: ' + event.target.value); //bankid eg: 6
        const selectedBankId = event.target.value;
        const bankData = bankList.find(bank => bank.pgBankId === selectedBankId);
        setSelectBank(selectedBankId);
        setBankFullName(bankData.name);
        setAccountNo('');
        setReAccountNo('');
        setIfscCode('');
        setBankBranch('');
        setHolderName('');
        setHolderEmail('');
        setMobileNo('');
    };

    const handleHolderEmail =(event) => {
     setHolderEmail(event.target.value.trim());
    };

    const handleMobileNo =(event) => {
        const value = event.target.value;
            if (/^\d*$/.test(value) && value.length <= 10) {
             setMobileNo(value);
            }
        };

   useEffect(() => {
           if (payModesToPass) {

               const netBankingMethod = payModesToPass.find(method => method.code === 'RECURRING_DC');
               const NBBanks = netBankingMethod ? netBankingMethod.subPayModes : null;
               const recurringBanks = NBBanks.filter(bank => bank.isRecurringOnAccount);
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

  const handlePayNow = async () => {

      setLoading(true);
      let accountNumber = accountNo;
      let reAccountNumber = reAccountNo;
      let ifscCode1 = ifscCode;
      let accHolderName = holderName;
      let accHolderEmail = holderEmail;
      let mobile = mobileNo;
      let selectedBank = selectBank;

      console.log('accountNo1: ' + accountNumber);
      console.log('accountNo2: ' + reAccountNumber);

      const validator = new NetBankingValidator();
      let isValid = false;
      setAccountNoError('');
      setSelectBankError('');
      setReAccountNoError('');
      setIfscCodeError('');
      setHolderNameError('');
      setHolderEmailError('');
      setMobileNoError('');

      if(validator.isSelectedBankValid(selectBank)){
          if(validator.isValidInput(accountNumber)){
                if(validator.isValidInput(reAccountNumber) && validator.isBothAccountNoAndReAccNoSame(accountNumber, reAccountNumber)){
                     if(isValidIfsc(ifscCode1)){
                            if(validator.isValidCardHolderName(accHolderName)){
                              if(validator.isValidEmail(accHolderEmail)){
                                if(validator.isValidNumbersOnly(mobile)){
                                  isValid = true;
                                }else{
                                 setMobileNoError('Please enter valid mobile No');
                                }
                              }else{
                               setHolderEmailError('Please enter account holder email');
                              }

                            }else{
                              setHolderNameError('Please enter account holder name');
                            }
                     }else{
                       setIfscCodeError('Please enter IFSC code');
                     }

                }else{
                 setReAccountNoError('Please confirm account No');
                }
          }else{
            setAccountNoError('Please enter account No');
          }

       }else{
        setSelectBankError('Please select bank');
       }

       console.log('isValid: ' + isValid);
       console.log('orderNo: ' + orderNo);

       //valid case
       if(isValid){
         try {
             const response = await fetch('/pay/recurring/gateway', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                 orderNo: encodeURIComponent(orderNo),
                 mode: 'RECURRING_DC',
                 emnbCode: encodeURIComponent(selectBank),
                 isRecurringAccount: 'true'
               })
             });

            if (!response.ok) {
                 throw new Error('Network response was not ok');
             }

             const data = await response.json();
             console.log('gateway data: ' + data.gateway);
             var gatewayInResponse = data.gateway;

             const bankName = getPgCodeByBankId(selectBank); //bankName
             var accountName = 'savings';
             var accType = 'S';
             if(accountType === 'current'){
                  accType = 'C';
                  accountName = "current";
              }else if(accountType === 'other'){
                  accType = 'O';
                  accountName = "other";
              }


             if(gatewayInResponse === 'hdfcEmandate'){
               const form = document.createElement('form');
               form.method = 'POST';
              //  const domain = getDomain();
              //  const url =  getDomain() + `/pay/eMandate/process`;
              //  form.action = url; //'http://localhost:9080/pay/eMandate/process';

              const addHiddenInput = (name, value) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
              };

              // Add all hidden inputs to the form
                addHiddenInput('eMandateNo', eMandateNo);
                addHiddenInput('accountNo', accountNumber);
                addHiddenInput('ifscCode', ifscCode1);
                addHiddenInput('accountHolderName', accHolderName);
                addHiddenInput('bank',  bankFullName.split(' ')[0]);
                addHiddenInput('method', 'Debit');
                addHiddenInput('maxAmountLimit', maxAmountLimit);
                addHiddenInput('accountType', accType);
                addHiddenInput('orderNo', parentOrderNo);
                addHiddenInput('mobile', mobile);
                addHiddenInput('bankId', bankName);

                 document.body.appendChild(form);
                 console.log('form getting submitted!');
                 form.submit();

             }else{
              //razorpay call

               const jsonData = {
                    order_id: order_id,
                    accountNo: accountNumber,
                    ifscCode: ifscCode,
                    accountHolderName: accHolderName,
                    bank:  bankFullName,
                    method: 'Debit',
                    eMandateNo: eMandateNo,
                    cust_id: cust_id,
                    accountType: accType,
                    orderNo: parentOrderNo
                  };

               try {
                  const response = await fetch('/pay/eMandate/update', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                  });

                  if (!response.ok) {
                   console.log('Api failed while calling this enpoint: /pay/eMandate/update ');
                  }
                } catch (error) {
                  console.error('Request error:', error);
                }

                const options = {
                      key: mid,
                      amount: "0",
                      name: "Policy Bazaar",
                      order_id: order_id,
                      customer_id: cust_id,
                      recurring: "1",
                      "recurring_token.max_amount": maxAmountLimit,
                      "recurring_token.expire_at": expire_at,
                      prefill: {
                        name: accHolderName,
                        email: accHolderEmail,
                        contact: mobile,
                        method: "emandate",
                        bank: bankName,
                        "bank_account[name]": accHolderName,
                        "bank_account[account_number]": accountNumber,
                        "bank_account[ifsc]": ifscCode,
                        "bank_account[account_type]": accountName,
                        auth_type: "debitcard",
                      },
                      handler: function(response) {
                        responseInputRef.current.value =
                          `razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&eMandateNo=${eMandateNo}`;

                        // document.querySelector('.accountNo').setAttribute('readonly', true);
                        // document.querySelector('.raccountNo').setAttribute('readonly', true);
                        // document.querySelector('.ifscCode').setAttribute('readonly', true);

                        // Submit the form programmatically
                        formRef.current.submit();
                      },
                      notes: {
                        address: eMandateNo
                      },
                      theme: {
                        color: "#F37254",
                        hide_topbar: "true",
                      }
                    };

                    // Open Razorpay payment popup
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                  };
             } catch (error) {
              // window.location.href = "https://www.policybazaar.com";
               console.error('Payment Request Failed:', error);
           }finally {
               setLoading(false);
           }
       }


};

const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});



    return (
        <div className='emandate-card-details'>
          To register Autopay, provide below details
          <Box mt={2}>
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
           </Box>

            <Box mt={1}>
            <div className='select-account-type'>
                <FormControl>
                    <FormLabel id="accountTYpe">Select Account Type</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="accountType"
                        name="accountType"
                        value={accountType}
                        defaultValue="top"
                        onChange={handleAccountTypeChange}

                    >
                       <Grid container spacing={2}>
                       <Grid item>
                         <FormControlLabel value="saving" control={<Radio />} label="Saving" />
                       </Grid>
                       <Grid item>
                         <FormControlLabel value="current" control={<Radio />} label="Current" />
                       </Grid>
                       <Grid item>
                         <FormControlLabel value="other" control={<Radio />} label="Other" />
                       </Grid>
                     </Grid>
                    </RadioGroup>
                </FormControl>
            </div>
            </Box>

            <div className='card-detail-form'>
            <Grid container spacing={2}>

            <Grid item md={6} xs={6}>
             <FormControl fullWidth className='form-control'>
            <TextField
                   id="accountNo"
               label="Your account No"
               variant="outlined"
               placeholder="Enter account No"
               value={accountNo}
               error={!!accountNoError}
               helperText={accountNoError}
               onClick={handleAccountNoClick}
               onChange={handleAccountNo}

               />
               </FormControl>

                </Grid>
                <Grid item md={6} xs={6}>
                 <FormControl fullWidth className='form-control'>
                    <TextField
                          id="reAccountNo"
                          label="Re-enter account No"
                          variant="outlined"
                          placeholder="Confirm account No"
                          value={reAccountNo}
                          error={!!reAccountNoError}
                          helperText={reAccountNoError}
                          type="password"
                          onClick={handleReAccountNoClick}
                          onChange={handleReAccountNo}
                         />
                    </FormControl>
                 </Grid>
                 </Grid>

              <Grid container spacing={2}>
              <Grid item md={6} xs={6}>
               <FormControl fullWidth className='form-control'>
                 <TextField
                     id="ifsc"
                     label="Enter IFSC Code"
                     placeholder="Enter IFSC here"
                     variant="outlined"
                     value={ifscCode}
                     error={!!ifscCodeError}
                     helperText={ifscCodeError}
                     onChange={handleIfscCodeChange}
                     onClick={handleIfscCodeClick}
                    />
                </FormControl>
              </Grid>
            <Grid item md={6} xs={6}>
            <FormControl fullWidth className='form-control'>
                   <TextField
                      id="bankBranch"
                      label="Bank Branch"
                      variant="outlined"
                      value={bankBranch}
                      InputProps={{
                            readOnly: true,
                          }}
                     />
                  </FormControl>
              </Grid>
              </Grid>

              <Grid container spacing={2} >
              <Grid item md={6} xs={6}>
              <FormControl fullWidth className='form-control'>
               <TextField
                    id="holderName"
                    label="Account holder name"
                    variant="outlined"
                    value={holderName}
                    error={!!holderNameError}
                    helperText={holderNameError}
                    onChange={handleAccountHolderName}
                    onClick={handleHolderNameClick}
               />
               </FormControl>
              </Grid>
             <Grid item md={6} xs={6}>
               <FormControl fullWidth className='form-control'>
               <TextField
                   id="email"
                   label="Account holder email"
                   variant="outlined"
                   value={holderEmail}
                   error={!!holderEmailError}
                   helperText={holderEmailError}
                   onChange={handleHolderEmail}
                   onClick={handleEmailClick}
              />
              </FormControl>
              </Grid>
              </Grid>
               <Grid container spacing={2} >
               <Grid item md={6} xs={6} >
               <FormControl fullWidth className='form-control'>
               <TextField
                  id="mobile"
                  label="Mobile No"
                  variant="outlined"
                  value={mobileNo}
                  error={!!mobileNoError}
                  helperText={mobileNoError}
                  onChange={handleMobileNo}
                  onClick={handleMobileNoClick}
             />
             </FormControl>
              </Grid>
              </Grid>
              </div>


            <div className='note-msg'>
                <strong>Note</strong>: Future payments on this  account will be charged automatically
            </div>
          {!isHealth && <div className='disclaimer'>
        <strong>Disclaimer</strong>: Amount authorised under e-mandate registration is Rs 2 higher than your premium amount. This is for registration purpose only, the amount deducted from your 	account will be the actual premium amount.
      </div>}
      {isHealth &&   <div className='disclaimer'>
        <strong>Disclaimer</strong>:  Amount authorised under e-mandate registration is 1.25 times of your transaction amount. This is for registration purpose only, the amount deducted from your account will be the actual installment amount.
      </div>}
   <div className='text-right'>
                <Button className="register-autopay-btn" onClick={handlePayNow}  sx={{ width: { xs: '100%', sm: 'auto' }}}>Register Autopay</Button>
            </div>

      <form
        ref={formRef}
        action={redirectionUrl}
        method="post"
        id="submitEmandate"
      >
        <input
          type="hidden"
          name="response"
          id="response"
          ref={responseInputRef}
        />
      </form>
        </div>
    )
}

export default AutopayOnAccount
