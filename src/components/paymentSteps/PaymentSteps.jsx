import React from 'react'

function PaymentSteps() {
  return (
    <div id="stepper">
      <ul class="steps">
        <li class="complete">
          <span>Payment Completed</span>
        </li>
        <li class="non-active">
          <span>Autopay Mode</span>
        </li>
      <li class="">
        <span>Setup Autopay</span>
      </li>
    </ul>
  </div>
  )
}

export default PaymentSteps
