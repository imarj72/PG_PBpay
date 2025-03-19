import { Button, IconButton } from '@mui/material'
import React from 'react'
import ImageComponent from '../../shared/ImageComponent'


function VisaMasterInfo({ handleClose }) {
    return (
        <div className='visa-master-card-info'>
            <div className="flex items-center justify-between">
                <h4>Visa network</h4>
                <IconButton className='close-btn' onClick={() => handleClose ? handleClose() : null}><ImageComponent name={'closeBtn'} /></IconButton>
            </div>
            <p>
                Here is the list of visa card networks that you can use for the payment
            </p>
            <ul>
                <div>
                    <li>Only Axis Bank </li>
                    <li>Bank of Baroda </li>
                    <li>Bank of India </li>
                    <li>Canara Bank </li>
                    <li>CUB Equitas </li>
                    <li>Federal Bank </li>
                    <li>HDFC Bank </li>
                    <li>ICICI Bank </li>
                    <li>IDBI Bank </li>
                    <li>Indian Bank</li>

                </div>
                <div>
                    <li>Indian Overseas Bank </li>
                    <li>IndusInd Bank </li>
                    <li>Jupiter </li>
                    <li>Kotak Bank</li>
                    <li>KVB </li>
                    <li>RBL Bank</li>
                    <li>SBI </li>
                    <li>SBM </li>
                    <li>Standard Chartered Bank </li>
                    <li>Union Bank of India</li>
                </div>
            </ul>
        </div>
    )
}

export default VisaMasterInfo
