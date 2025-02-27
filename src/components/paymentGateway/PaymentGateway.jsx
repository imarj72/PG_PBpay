import React, { useState, useEffect } from 'react';

import { Grid, Link } from '@mui/material';
import PaymentView from '../PaymentMode/PaymentView';
import UpiPaymentProcess from '../PaymentMode/Components/UpiPayments/UpiPaymentProcess';
import PaymentDetails from '../PaymentMode/Components/CommonDetails/PaymentDetails';
import UpiDialog from '../../Shared/UpiDialog';
import PaymentViewRecurring from '../PaymentMode/PaymentViewRecurring';
import PaymentSuccess from '../PaymentMode/Components/PaymentSuccess';
import DebitCradPaymentProcess from '../PaymentMode/Components/CommonDetails/DebitCradPaymentProcess';



function PaymentGateway({apiData}) {
  const [eligibleForSecureRecurring, setEligibleForSecureRecurring] = useState(null);
  // Get the current pathname
  const pathname = window.location.pathname;

  useEffect(() => {
    // Run only if the pathname is '/secureRecurring'
    if (pathname === '/secureRecurring' && eligibleForSecureRecurring === null) {
      const checkEligibility = async () => {
        const queryParameters = new URLSearchParams(window.location.search);
        const order = queryParameters.get('orderNo');
        const var1 = queryParameters.get('var1');
        const var2 = queryParameters.get('var2');

        const data = await checkIfEligibleForEmandate(order, var1, var2);
        if (data != null && data.status === 'OK') {
          setEligibleForSecureRecurring(true);
        } else {
          window.location.href = 'https://policybazaar.com/';
        }
      };

      checkEligibility(); 
    }
  }, [pathname, eligibleForSecureRecurring]);
  
  // Render different components based on the URL
  if (pathname === '/secure') {
    return <PaymentView apiData={apiData} />;
  } else if (pathname === '/secureRecurring') {
      if (eligibleForSecureRecurring === null) {
      return "";
    } else if (eligibleForSecureRecurring) {
      return <PaymentViewRecurring apiData={apiData} />;
    }
    }else if (pathname === '/initiateEmandate') {
    return <PaymentSuccess />;
   }  
   else {
    window.location.href = 'https://policybazaar.com/';
    return null;
   }
 }

async function checkIfEligibleForEmandate(orderNo, var1, var2) {    
  try {
      
      const temp = { orderNo };
      const response = await fetch(`/pay/payment/emandate/isEligible?var1=${var1}&var2=${var2}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(temp),
      });
      const result = await response.json();
      return result;
  } catch (error) {
      console.error('API request error:', error);
      return null; 
  }
}


export default PaymentGateway;
