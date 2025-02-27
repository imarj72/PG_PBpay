import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import BankinfoTab from './BankinfoTab';

function BankDetails() {
  return (
    <div className='enter-bank-deatils'>
        Enter bank details
        <div className='bank-info-edit'>
            <div className='head'>
                <p>
                    <img src="./images/hdfc.svg" alt="hdfc"/> <span>HDFC</span>
                </p>
                <p className='edit-pen'>
                    <Button><FontAwesomeIcon icon={faPencilAlt}/></Button>
                </p>
            </div>
        </div>
        <div className='debit-card-tabs'>
            <BankinfoTab/>
        </div>
    </div>
  )
}

export default BankDetails
