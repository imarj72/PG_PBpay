import { Button,  IconButton  } from '@mui/material'
import React from 'react'
import ImageComponent from '../../shared/ImageComponent'


function MastercardRecurringInfo({handleClose}) {
  return (
    <div className='visa-master-card-info'>
        <div className="flex items-center justify-between">
   	<h4>Mastercard network</h4>
    	<IconButton className='close-btn' onClick={()=> handleClose ? handleClose() : null}><ImageComponent name={'closeBtn'} /></IconButton>
    </div>
        <p>
            Here is the list of mastercard networks that you can use for the payment
        </p>
        <ul>
            <div>
            <li>Axis Bank</li>
            <li>Bank of Baroda</li>
            <li>Bank of India</li>
            <li>Canara Bank</li>
            <li>CITI Bank</li>
            <li>Federal Bank</li>
            <li>HDFC Bank</li>
            <li>ICICI Bank</li>
            <li>IDBI Bank</li>
            <li>IndusInd Bank</li>
            </div>
            <div>
                <li>RBL Bank</li>
                <li>SBI</li>
                <li>SBM</li>
                <li>Union Bank of India</li>
            </div>
        </ul>
    </div>
  )
}

export default MastercardRecurringInfo
