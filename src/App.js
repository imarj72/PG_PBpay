import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/pages/Header/Header";
import PaymentView from "./components/paymentModes/PaymentView";

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("sessionId");

  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is missing in the URL.");
      setIsLoading(false);
      return;
    }

    const fetchApiData = async () => {
      try {
        setIsLoading(true);
        const requestBody = { data: { id: sessionId } };
        const apiUrl = `http://localhost:8090/session/payment/ui/v1/getPaymentPageDetails?sessionId=${sessionId}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }).then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(`API endpoint not found: ${response.url}`);
            } else if (response.status >= 500) {
              throw new Error(`Server error: ${response.status}`);
            } else {
              throw new Error(
                `Failed to fetch data (Status: ${response.status})`
              );
            }
          }
          return response.json();
        });

        setApiData(response);
      } catch (err) {
        console.error("Error fetching API data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiData();
  }, [sessionId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {apiData && (
        <>
          <Header apiData={apiData} />
          <PaymentView apiData={apiData} />
        </>
      )}
    </>
  );
}

export default App;
