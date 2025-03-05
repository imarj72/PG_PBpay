import { Grid,FormControl,InputLabel,MenuItem,Select,Button,Link } from '@mui/material'
import React, { useState, useEffect } from 'react';


function Netbanking({apiData, nbDownBanks}) {
  
    
    const [selectBankName, setBankName] = useState('');
    const [selectBankCode, setBankCode] = useState('');
    const [bankList, setBankList] = useState([]);
    const [popularList,setPopularList]=useState([]);
    const [txnurl , settxnurl ] = useState('');
    const [pgpayload , setpgpayload] = useState('');
    const [codeList , setcodeList] = useState('');
    const [NBerror, setNBerror] = useState(false);
    const [showLoader, setshowLoader] = useState(false);
    const [downNBbanks , setDownNBbanks] = useState('');
    const queryParameters = new URLSearchParams(window.location.search);
    const error = queryParameters.get("error");
 
    
    let form;
    useEffect(() => {
      if (apiData && apiData.length > 0 && apiData[0].data && apiData[0].data.length > 0) {
          const paymentModes = apiData[0].data[0].paymentModes;
          const netBankingMethod = paymentModes.find(method => method.id === 'NB01');
          if (netBankingMethod) {
             setPopularList(netBankingMethod.popularInstruments);
              setBankList(netBankingMethod.instruments);
              const bankcodes = netBankingMethod.instruments.map(item => item.code);
              setcodeList(bankcodes);
          }
      }
  }, [apiData]);
  
    
  const handleChange = (event) => {
    setNBerror(false);
    const selectedBankCode = event.target.value;
    const selectedBank = bankList.find(bank => bank.code === selectedBankCode);
    setBankName(selectedBank.displayName);
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
    {popularList.map((bank, index) => (
        <li key={index} className={selectBankCode === bank.code ? 'active' : ''} onClick={() => setBankCode(bank.code)}>
            <Link>
                <img src={bank.logo} alt={bank.name} className="bankLogo"/> 
            </Link>
        </li>
    ))}
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
>
    {bankList.map((bank, index) => (
        <MenuItem key={index} value={bank.code}>
            {bank.displayName}
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
