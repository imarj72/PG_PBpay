import logo from './logo.svg';
import './App.css';
import Header from "./components/pages/Header/Header";
import { useEffect, useState } from 'react';
// import PaymentGateway from './components/paymentGateway/PaymentGateway';
import PaymentAccordion from './components/paymentTabs/component/PaymentAccordion';
import Netbanking from './components/paymentModes/components/NetBanking/Netbanking';
import NetbankingRecurring from './components/paymentModes/components/NetBanking/NetBankingRecurring';
import Payment from '@mui/icons-material/Payment';
import CreditCard from './components/paymentModes/components/CreditCard/CreditCard';
import MasterCardRupayForm from './components/paymentModes/MasterCardRupayForm';
import VisaMasterInfo from './components/paymentModes/childComponent/VisaMasterInfo';
import CreditCardRecurring from './components/paymentModes/components/CreditCard/CreditCardRecurring';
import CreditCardSI from './components/paymentModes/components/CreditCard/CreditCardSI';
import EmiTabs from './components/paymentModes/components/EmiCard/EmiTabs';
import EmiCreditCardDetails from './components/paymentModes/childComponent/EmiCreditCardDetails';
import EmiTable from './components/paymentModes/commonDetails/EmiTable';
import CardlessEmiDetails from './components/paymentModes/childComponent/CardlessEmiDetails';
import { Card } from '@mui/material';
import UpiDetails from './components/paymentModes/components/UPIpayment/UpiDetails';
import PaymentFailedPopup from './components/paymentModes/components/UPIpayment/PaymentFailedPopup';
import UpiQR from './components/paymentModes/components/UPIpayment/UpiQR';
import UpiDetailsEmandate from './components/paymentModes/components/UPIpayment/UpiDetailsEmandate';
import UpiDetailsRecurring from './components/paymentModes/components/UPIpayment/UpiDetailsRecurring';
import PaymentView from './components/paymentModes/PaymentView';
import PaymentTabs from './components/paymentTabs/PaymentTabs';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(false);

  const apiData = [
    {
      path: "ui/getPaymentPageDetails",
      error: null,
      status: 200,
      data: [
        {
          secondryColorHex: "#000000",
          amount: 1000012,
          disabledFields: ["test4", "test5"],
          merchantId: "merchantIdWeb",
          orderId: "uiX005",
          sessionExpiryTime: 1741282230,
          logo: "https://www.coursemonster.com/assest/images/brand/google-logo.png",
          paymentModes: [
            // 1) Netbanking (existing)
            {
              id: "NB01",
              name: "netbanking",
              displayName: "Net Banking",
              nextURL: "https://www.google.com",
              order: 0,
              popularInstruments: [{
                id: "HDFC01",
                name: "HDFC",
                displayName: "HDFC Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
                code: "xax11"
              },
              {
                id: "AXIS02",
                name: "AXIS",
                displayName: "AXIS Net Banking",
                logo: "https://www.axisbank.com/assets/images/logo.png",
                code: "Axq1"
              },
              {
                id: "SBI03",
                name: "SBI",
                displayName: "SBI Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
                code: "sbix1"
              },
              {
                id: "KOTAK04",
                name: "KOTAK",
                displayName: "Kotak Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
                code: "kotakx1"
              }
              ],
              instruments: [
                {
                  id: "HDFC01",
                  name: "HDFC",
                  displayName: "HDFC Net Banking",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
                  code: "xax11"
                },
                {
                  id: "AXIS02",
                  name: "AXIS",
                  displayName: "AXIS Net Banking",
                  logo: "https://www.axisbank.com/assets/images/logo.png",
                  code: "Axq1"
                },
                {
                  id: "SBI03",
                  name: "SBI",
                  displayName: "SBI Net Banking",
                  logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
                  code: "sbix1"
                },
                {
                  id: "KOTAK04",
                  name: "KOTAK",
                  displayName: "Kotak Net Banking",
                  logo: "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
                  code: "kotakx1"
                },
                {
                  id: "PNB05",
                  name: "PNB",
                  displayName: "PNB Net Banking",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Punjab_National_Bank_new_logo.svg",
                  code: "pnbx1"
                },
                {
                  id: "BOB04",
                  name: "BANKOFBARODA",
                  displayName: "Bank of Baroda Net Banking",
                  logo: " https://upload.wikimedia.org/wikipedia/en/f/f2/BankOfBarodaLogo.svg",
                  code: "BOBx1"
                }
              ]
            },

            // 3) Credit Card (new)
            {
              id: "CC02",
              name: "creditCard",
              displayName: "Credit Card",
              nextURL: "https://www.google.com",
              order: 2,
              polpularInstruments: [],
              instruments: []
            },
            // 4) Debit Card (new)
            {
              id: "DC02",
              name: "debitCard",
              displayName: "Debit Card",
              nextURL: "https://www.google.com",
              order: 3,
              polpularInstruments: [],
              instruments: []
            },
            // 5) UPI (new)
            {
              id: "UPI02",
              name: "upi",
              displayName: "UPI",
              nextURL: "https://www.google.com",
              order: 4,
              polpularInstruments: [],
              instruments: []
            }
          ],
          primaryColorHex: "#FFFFFF",
          transactionId: "TXID1740724534700101618453",
          merchantName: "Test Merchant",
          extraFields: ["test1", "test2"]
        }
      ],
      timestamp: "2025-02-28T06:36:28.097814500"
    }
  ];


  const mockProps = {
    isSI: false,
    onCategoryValueChange: (value) => console.log("Category changed:", value),
  };

  return (
    <>
      <Header apiData={apiData}/>
      <PaymentView
        apiData={apiData}
        isSI={mockProps.isSI}
        onCategoryValueChange={mockProps.onCategoryValueChange}
      />

    </>
  );
}

export default App;
