import React from 'react'
function PaymentStepsOne() {
  return (
    <div id="stepper">
      <ul className="steps">
        <li className="active">
          <span>Payment Mode</span>
        </li>
        <li className="non-active">
          <span>Payment Complete</span>
        </li>
    </ul>
  </div>
  )
}
export default PaymentStepsOne
