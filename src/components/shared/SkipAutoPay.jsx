import { IconButton } from '@mui/material'
import React from 'react'
import ImageComponents from './ImageComponents'
import  getDomain  from '../Pages/PaymentMode/Components/getDomain'; 
function SkipAutoPay({handleCloseDialog}) {
	
    
     const handleSubmit = (event) => {
    event.preventDefault();
	const domain = getDomain();
	// const url = domain+'/pay/payment/autopay/thankyou';
  const url=domain+'apitobeadded';
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url; 
      const queryParameters = new URLSearchParams(window.location.search);
      const orderNo = queryParameters.get("orderNo");
      const var1 = queryParameters.get("var1");
      const var2 = queryParameters.get("var2");
      
    
    const inputs = [
      { name: 'orderNo', value: orderNo },
      { name: 'isSkipRegister', value: 'true' },
      { name: 'var1', value: var1 },
      { name: 'var2', value: var2 },
    ];

    
    inputs.forEach((input) => {
      const inputElement = document.createElement('input');
      inputElement.type = 'hidden';
      inputElement.name = input.name;
      inputElement.value = input.value;
      form.appendChild(inputElement);
    });

    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className='skip-autopay-dialog'>
        <IconButton className='close-btn' onClick={()=> handleCloseDialog ? handleCloseDialog() : null}><ImageComponents name={'closeBtn'} /></IconButton>
        <h3>Skip Autopay Registration</h3>
        <p>
        Registration of Mandate provides convenience in case of recurring transactions. Are you sure you want to skip the mandate Registration process?</p>
        <div className='flex justify-between items-center gap-4 mt-5'>
            <button className='cancel-btn' onClick={()=> handleCloseDialog ? handleCloseDialog() : null}>Cancel</button>
            <button className='proceed-btn' onClick={handleSubmit}>Proceed</button>
        </div>
    </div>
  )
}
export default SkipAutoPay
