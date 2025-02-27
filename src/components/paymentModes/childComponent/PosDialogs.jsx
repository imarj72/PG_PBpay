import React from 'react'

function PosDialogs() {
  return (
    <div className='pos-dialog-box'>
      <h4>Complete your payment</h4>
      <div className='link-expired'>
        <p>
            Payment link will expire in
        </p>
        <span>05 m</span> : <span>35 s</span>
      </div>
        <div className='payment-table'>
            <table>
                <tr>
                    <td>
                        <span>Merchant name</span>
                        <strong>PBPay</strong>
                    </td>
                    <td>
                        <span>Payment amount</span>
                        <strong>₹2,838.00</strong>
                    </td>
                    <td>
                        <span>Order ID</span>
                        <strong>PGT6850768</strong>
                    </td>
                </tr>
            </table>
        </div>
        <h6>Steps to follow:</h6>
        <ul>
            <li>
                Choose your preferred mode of payment
            </li>
            <li>
                Authorize payment
            </li>
        </ul>
        <div className='error-box text-center'>
            <p>
                Please do not click your browser’s back or refresh button
            </p>
        </div>
    </div>
  )
}

export default PosDialogs
