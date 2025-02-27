async function fetchTxnStatus(payId , var1 , var2) {
  try {
    const response = await fetch(`/pay/payment/upi/status?requestPayId=${payId}&var1=${var1}&var2=${var2}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default fetchTxnStatus;
