import { useEffect, useState } from 'react';
import './App.css';
import Header from "./components/pages/Header/Header";
import PaymentView from './components/paymentModes/PaymentView';

function App() {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = 'https://localhost:8080/api/getPaymentPageDetails';  

    const fetchApiData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch API data');
        }
        const data = await response.json();
        setApiData(data);
      } catch (err) {
        console.error('Error fetching API data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiData();
  }, []);

  const mockProps = {
    isSI: false,
    onCategoryValueChange: (value) => console.log("Category changed:", value),
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {apiData && (
        <>
          <Header apiData={apiData} />
          <PaymentView
            apiData={apiData}
            isSI={mockProps.isSI}
            onCategoryValueChange={mockProps.onCategoryValueChange}
          />
        </>
      )}
    </>
  );
}

export default App;
