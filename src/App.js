import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/pages/Header/Header";
import PaymentView from "./components/paymentModes/PaymentView";
import PaymentResponse from "./components/PaymentResponse";
import ErrorPage from "./components/utility/ErrorPage";
import PaymentStatus from "./components/paymentModes/PaymentStatus";
function PaymentPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("sessionId");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);

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

  // const apiData = {
  //   path: "ui/getPaymentPageDetails",
  //   error: null,
  //   status: 200,
  //   data: {
  //     secondryColorHex: "#000000",
  //     amount: 10012,
  //     disabledFields: ["test4", "test5"],
  //     merchantId: "merchantIdWeb",
  //     orderId: "uiX032",
  //     sessionExpiryTime: 1746300405981,
  //     logo: "https://www.google.com/logo.png",
  //     paymentModes: [
  //       {
  //         id: "NB01",
  //         name: "netbanking",
  //         displayName: "Net Banking",
  //         nextURL: "https://www.google.com",
  //         order: 0,
  //         popularInstruments: [
  //           {
  //             id: "HDFC01",
  //             name: "HDFC",
  //             displayName: "HDFC Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
  //             code: "hdfcX01",
  //           },
  //           {
  //             id: "AXIS02",
  //             name: "AXIS",
  //             displayName: "AXIS Net Banking",
  //             logo: "https://www.axisbank.com/assets/images/logo.png",
  //             code: "Axq1",
  //           },
  //           {
  //             id: "SBI03",
  //             name: "SBI",
  //             displayName: "SBI Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
  //             code: "sbix1",
  //           },
  //           {
  //             id: "KOTAK04",
  //             name: "KOTAK",
  //             displayName: "Kotak Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
  //             code: "kotakx1",
  //           },
  //         ],
  //         instruments: [
  //           {
  //             id: "HDFC01",
  //             name: "HDFC",
  //             displayName: "HDFC Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
  //             code: "hdfcX01",
  //           },
  //           {
  //             id: "AXIS02",
  //             name: "AXIS",
  //             displayName: "AXIS Net Banking",
  //             logo: "https://www.axisbank.com/assets/images/logo.png",
  //             code: "Axq1",
  //           },
  //           {
  //             id: "SBI03",
  //             name: "SBI",
  //             displayName: "SBI Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
  //             code: "sbix1",
  //           },
  //           {
  //             id: "KOTAK04",
  //             name: "KOTAK",
  //             displayName: "Kotak Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
  //             code: "kotakx1",
  //           },
  //           {
  //             id: "PNB05",
  //             name: "PNB",
  //             displayName: "PNB Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Punjab_National_Bank_new_logo.svg",
  //             code: "pnbx1",
  //           },
  //           {
  //             id: "BOB04",
  //             name: "BANKOFBARODA",
  //             displayName: "Bank of Baroda Net Banking",
  //             logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/BankOfBarodaLogo.svg",
  //             code: "BOBx1",
  //           },
  //         ],
  //       },
  //       {
  //         id: "CC02",
  //         name: "creditCard",
  //         displayName: "Credit Card",
  //         nextURL: null,
  //         order: 1,
  //         popularInstruments: null,
  //         instruments: null,
  //       },
  //       {
  //         id: "DC02",
  //         name: "debitCard",
  //         displayName: "Debit Card",
  //         nextURL: null,
  //         order: 2,
  //         popularInstruments: null,
  //         instruments: null,
  //       },
  //       {
  //         id: "UPI_QR",
  //         name: "UPI_QR",
  //         displayName: "UPI",
  //         nextURL: null,
  //         order: 3,
  //         popularInstruments: null,
  //         instruments: null,
  //       },
  //       {
  //         id: "UPI_COLLECT",
  //         name: "UPI_COLLECT",
  //         displayName: "UPI",
  //         nextURL: null,
  //         order: 3,
  //         popularInstruments: null,
  //         instruments: null,
  //       },
  //     ],
  //     primaryColorHex: "#FFFFFF",
  //     transactionId: "TXID174219940596110244014635",
  //     merchantName: "Test Merchant",
  //     extraFields: ["test1", "test2"],
  //   },
  //   timestamp: "2025-03-17T08:23:55.901609300",
  // };

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentPage />} />
        <Route path="/paymentresponse" element={<PaymentResponse />} />
        <Route
          path="/error"
          element={<ErrorPage onClose={() => (window.location.href = "/")} />}
        />
        <Route
          path="/paymentstatus"
          element={
            <PaymentStatus
              handleCloseDialog={() => (window.location.href = "/")}
            />
          }
        />
        <Route
        path="/healthstatus"
        element={<div>OK</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
