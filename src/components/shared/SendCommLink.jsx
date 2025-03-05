import { IconButton } from '@mui/material'
import React from 'react'
function SendCommLink({handleCloseDialog}) {
  return (
    <div className='skip-autopay-dialog'>
	 <p>
        A new payment link has been generated and sent to the registered
					Email address and Phone number.Kindly check the
					same.
        </p>
         <div className='flex justify-between items-center gap-4 mt-5'>
            <button className='cancel-btn' onClick={()=> handleCloseDialog ? handleCloseDialog() : null}>Close</button>
           
        </div>
    </div>
  )
}
export default SendCommLink
