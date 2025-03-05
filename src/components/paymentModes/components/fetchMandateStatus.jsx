async function fetchMandateStatus(var1, orderNo, payId) {
    try {
        const url = `/pay/statusQuery/emandate/gateway/status?requestPayId=${payId}&requestOrderNo=${orderNo}&var1=${var1}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error('Error fetching mandate status:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching mandate status:', error);
        throw error;
    }
}
export default fetchMandateStatus;
  