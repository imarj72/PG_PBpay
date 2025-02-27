import React from 'react'
function PaymentError({retry}) {
  return (
    <div className="payment-error-box">
     {retry === 'retry' &&  <p>
       Your last attempt didn't go through please try again!
      </p>}
      {retry && retry !== 'retry' && retry !== 'no' && (
       <p>{retry}</p>
      )}
  </div>
  )
}
export default PaymentError
