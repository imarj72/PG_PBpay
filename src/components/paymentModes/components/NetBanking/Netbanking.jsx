import { Grid,FormControl,InputLabel,MenuItem,Select,Button,Link } from '@mui/material'
import React, { useState, useEffect } from 'react';
const payModesToPass = [
  {
      code: "NB",
      subPayModes: [
          { code: "21", name: "HDFC" },
          { code: "22", name: "ICICI" },
          { code: "48", name: "SBI" },
          { code: "32", name: "Kotak Mahindra" },
          { code: "40", name: "PNB" },
          { code: "6", name: "Bank of Baroda" }
      ]
  }
];

function Netbanking({nbDownBanks}) {
  
    
    const [selectBankName, setBankName] = useState('');
    const [selectBankCode, setBankCode] = useState('');
    const [bankList, setBankList] = useState(null);
    const [txnurl , settxnurl ] = useState('');
    const [pgpayload , setpgpayload] = useState('');
    const [codeList , setcodeList] = useState('');
    const [NBerror, setNBerror] = useState(false);
    const [showLoader, setshowLoader] = useState(false);
    const [downNBbanks , setDownNBbanks] = useState('');
    const queryParameters = new URLSearchParams(window.location.search);
    const error = queryParameters.get("error");
     if(error === "1"){
       nbDownBanks='ICICI Bank, HDFC Bank';
       }
    
    let form;
    useEffect(() => {
        if (payModesToPass) {
             
            const netBankingMethod = payModesToPass.find(method => method.code === 'NB');
            const NBBanks = netBankingMethod ? netBankingMethod.subPayModes : null;
            setBankList(NBBanks);
	    setDownNBbanks(nbDownBanks);
	    var bankcodes = [];
            if(NBBanks){
            NBBanks.forEach(function(item) {
            bankcodes.push(item.code);
            });
           
		setcodeList(bankcodes);
		}
            
        }
    }, [payModesToPass]); 
    
const handleChange = (event) => {
  setNBerror(false);
  const selectedBankCode = event.target.value;
  const selectedBank = bankList.find(bank => bank.code === selectedBankCode);
  setBankName(selectedBank.name);
  setBankCode(selectedBankCode); 
 
};


 useEffect(() => {
        if (selectBankCode) {
            const selectedBank = bankList.find(bank => bank.code === selectBankCode);
            setBankName(selectedBank.name);
		}
	setNBerror(false);	
          }, [selectBankCode]); 

  const handlePayNow = async () => {
    if(selectBankCode > 0){
    setshowLoader(true);
    const queryParameters = new URLSearchParams(window.location.search);
    const order = queryParameters.get("orderNo");
    const mode = "NB";
    const nbCode = selectBankCode;		
	
    try {
         const response = await fetch('/pay/securePayment/process/paymentui', { //to be updated @aniket
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderNo: order,
                mode: mode,
                nbCode: selectBankCode
                
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
      formElement.submit();
      }
      else if(data.txnURL){
       settxnurl(data.txnURL);
       setpgpayload(data.pgPayload);
       await delay(1500);
       form = document.getElementById('testForm');
       form.submit();
      
      }
      }    } catch (error) {
        console.error('Error:', error);
    }
    }else{
    setNBerror(true);
    }
};

const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});
  
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
 	

  {nbDownBanks && nbDownBanks !== null && nbDownBanks.includes(',') && (
    <div className="generalMsgInfo">
       <strong style={{ fontWeight: 'bold', fontSize: '12px' }}>{nbDownBanks}</strong> are currently facing some technical issues.
    </div>
)}

{nbDownBanks && nbDownBanks !== null && !nbDownBanks.includes(',') && (
    <div className="generalMsgInfo">
       <strong style={{ fontWeight: 'bold', fontSize: '12px' }}>{nbDownBanks}</strong> is currently facing some technical issues.
    </div>
)}	
 	
    <div className='card-details'>
      <div className='card-detail-form'>
        <h5>
            Select your Bank
        </h5>
           
        <div className='card-info'>
        <ul>
        {codeList && codeList.includes("21") && (
           <li className={selectBankCode === '21' ? 'active' : ''} onClick={() => setBankCode('21')}>
                <Link>
                    <img src="./images/hdfc.svg" alt="hdfc"/> <span>HDFC</span>
                </Link>
            </li>
          )}
           {codeList.includes("22") && (
           <li className={selectBankCode === '22' ? 'active' : ''} onClick={() => setBankCode('22')}>
                <Link>
                    <img src="./images/icici.svg" alt="icici"/> <span>ICICI</span>
                </Link>
            </li>
            )}
             {codeList && codeList.includes("48") && (
            <li className={selectBankCode === '48' ? 'active' : ''} onClick={() => setBankCode('48')}>
                <Link>
                    <img src="./images/sbi.svg" alt="SBi"/> <span>SBI</span>
                </Link>
            </li>
            )}
	   {codeList && codeList.includes("32") && (
            <li className={selectBankCode === '32' ? 'active' : ''} onClick={() =>setBankCode('32')}>
                <Link>
                    <img src="./images/kotak_mahindra.svg" alt="Kotak Mahindra"/> <span>Kotak Mahindra</span>
                </Link>
            </li>
            )}
           {codeList && codeList.includes("40") && (
             <li className={selectBankCode === '40' ? 'active' : ''} onClick={() => setBankCode('40')}>
                <Link>
                    <img src="./images/PNB.svg" alt="PNB"/> <span>Punjab National Bank</span>
                </Link>
            </li>
            )}
            {codeList && codeList.includes("6") && (
            <li className={selectBankCode === '6' ? 'active' : ''} onClick={() => setBankCode('6')}>
                <Link>
                    <img src="./images/BOB.svg" alt="hdfc"/> <span>Bank of Baroda</span>
                </Link>
            </li>
            )}
        </ul>
    </div>
  <Grid container spacing={3}>
  <Grid item md={12} xs={12} >
    <FormControl fullWidth className='form-control'>
      <InputLabel id="demo-simple-select-label">Select another bank</InputLabel>
   <Select
  labelId="demo-simple-select-label"
  id="demo-simple-select"
   value={selectBankCode}
  label="Bank Name"
  onChange={handleChange}
  error={NBerror}
  helperText={NBerror}
   >
  {bankList && bankList.map((bank, index) => (
    <MenuItem key={index} value={bank.code}>
      {bank.name}
    </MenuItem>
  ))}
</Select>
    </FormControl>
  </Grid>
</Grid>
 {NBerror && (
      <p style={{ color: 'red' }}>Please select a bank!</p>
    )}
          <div className="mt-4"> 
            <Button variant="outlined" size="large" className='pay-now-btn' onClick={handlePayNow}>
              Pay Now
            </Button>
          </div>
         
       
      </div>
    </div>
    </>
  )
}

export default Netbanking
