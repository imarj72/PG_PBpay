async function fetchQRTxnStatus(payId , var1 , var2) {
  try {
    const response = await fetch(`/pay/payment/qrCode/status?requestPayId=${payId}&var1=${var1}&var2=${var2}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
   if(!response.ok)
   {
    console.error("Error fetching QRTxn data",response.statusText);
    return null;
   }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default fetchQRTxnStatus;



