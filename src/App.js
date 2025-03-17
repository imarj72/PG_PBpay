import { useState } from 'react';
import './App.css';
import Header from "./components/pages/Header/Header";
// import PaymentGateway from './components/paymentGateway/PaymentGateway';
import PaymentView from './components/paymentModes/PaymentView';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(false);

  const apiData=
  {
    "path": "ui/getPaymentPageDetails",
    "error": null,
    "status": 200,
    "data": {
      "secondryColorHex": "#000000",
      "amount": 1000012,
      "disabledFields": "test4, test5",
      "merchantId": "merchantIdWeb",
      "orderId": "uiX005",
      "sessionExpiryTime": 17412659018000,
      "logo": "https://www.coursemonster.com/assest/images/brand/google-logo.png",
      "paymentModes": {
        "netbanking": {
          "id": "NB01",
          "name": "netbanking",
          "displayName": "Net Banking",
          "nextURL": "https://example.com/api/nextBanks?page=2",
          "order": 0,
          "popularInstruments": {
            "HDFC": {
              "id": "HDFC01",
              "name": "HDFC",
              "displayName": "HDFC Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
              "code": "xax11"
            },
            "AXIS": {
              "id": "AXIS02",
              "name": "AXIS",
              "displayName": "AXIS Net Banking",
              "logo": "https://www.axisbank.com/assets/images/logo.png",
              "code": "Axq1"
            },
            "SBI": {
              "id": "SBI03",
              "name": "SBI",
              "displayName": "SBI Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
              "code": "sbix1"
            },
            "KOTAK": {
              "id": "KOTAK04",
              "name": "KOTAK",
              "displayName": "Kotak Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
              "code": "kotakx1"
            }
          },
          "instruments": {
            "HDFC": {
              "id": "HDFC01",
              "name": "HDFC",
              "displayName": "HDFC Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
              "code": "xax11"
            },
            "AXIS": {
              "id": "AXIS02",
              "name": "AXIS",
              "displayName": "AXIS Net Banking",
              "logo": "https://www.axisbank.com/assets/images/logo.png",
              "code": "Axq1"
            },
            "SBI": {
              "id": "SBI03",
              "name": "SBI",
              "displayName": "SBI Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
              "code": "sbix1"
            },
            "KOTAK": {
              "id": "KOTAK04",
              "name": "KOTAK",
              "displayName": "Kotak Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
              "code": "kotakx1"
            },
            "PNB": {
              "id": "PNB05",
              "name": "PNB",
              "displayName": "PNB Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Punjab_National_Bank_new_logo.svg",
              "code": "pnbx1"
            },
            "BANKOFBARODA": {
              "id": "BOB04",
              "name": "BANKOFBARODA",
              "displayName": "Bank of Baroda Net Banking",
              "logo": "https://upload.wikimedia.org/wikipedia/en/f/f2/BankOfBarodaLogo.svg",
              "code": "BOBx1"
            }
          }
        },
        "creditCard": {
          "id": "CC02",
          "name": "creditCard",
          "displayName": "Credit Card",
          "order": 2,
          "popularInstruments": {},
          "instruments": {}
        },
        "debitCard": {
          "id": "DC02",
          "name": "debitCard",
          "displayName": "Debit Card",
          "order": 3,
          "popularInstruments": {},
          "instruments": {}
        },
        "upi": {
          "id": "UPI02",
          "name": "upi",
          "displayName": "UPI",
          "order": 4,
          "popularInstruments": {},
          "instruments": {}
        }
      },
      "primaryColorHex": "#FFFFFF",
      "transactionId": "TXID1740724534700101618453",
      "merchantName": "Test Merchant",
      "extraFields": "test1, test2"
    },
    "timestamp": "2025-02-28T06:36:28.097814500"
  }
  


  const mockProps = {
    isSI: false,
    onCategoryValueChange: (value) => console.log("Category changed:", value),
  };

  return (
    <>
      <Header apiData={apiData} />
      <PaymentView
        apiData={apiData}
        isSI={mockProps.isSI}
        onCategoryValueChange={mockProps.onCategoryValueChange}
      />

    </>
  );
}

export default App;
