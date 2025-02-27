// import logo from './logo.svg';
// import './App.css';
// import Header from "./components/pages/Header/Header"
// import { useEffect, useState } from 'react';
// import PaymentGateway from './components/paymentGateway/PaymentGateway';
// function App() {
//   const [appData,setAppData]=useState(null);
//   const[isLoading,setIsLoading]=useState(true);
//   const [healthStatus, setHealthStatus]=useState(false);
// useEffect(()=>
// {
//   const pathname=window.location.pathname;
//   let fetchData;
//   if(pathname==='/healthstatus')
//   {
//     setHealthStatus(true);
//     setIsLoading(false);
//     return;
//   }
// })
  
//   return (
//    <>
//    {healthStatus?(
//     <>
//     <div>success</div>
//     </>
//    ):(
//     <>
//     {!isLoading && <Header apiData={apiData} />}
//     <div className='wrapper'>
//             {!isLoading && <PaymentGateway apiData={apiData} />}
//           </div>
//     </>

//    )}
//    </>
//   );
// }

// export default App;

import logo from './logo.svg';
import './App.css';
// import Header from "./components/pages/Header/Header";
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
function App() {
  const [appData, setAppData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(false);
  const mockApiData= {
    secret: "someSecretKey123",
    cardDownBanks: ["Bank A", "Bank B"],
    nbDownBanks: ["Bank C", "Bank D"],
    displayMode: 5,
    displayModeCheck: true,
    retry: false,
    emandateRegistered: false,
    planDetails: [
      {
        insurerLogo: "digit.png",
        insurerName: "digit Insurance Co.",
        txAmount: "5000",
        premium: "4500",
        multiplier: 1.1
      }
    ],
    totalAmount: "5000",
    eligibleModes: [
      { code: "CC", name: "Credit Card" },
      { code: "DC", name: "Debit Card" },
      { code: "NB", name: "Net Banking" },
      { code: "UPI", name: "UPI" },
      // { code: "EMI", name: "emi" },
      
    ],
    eligibleRecurringModes: [
      { code: "EMANDATE_NB", name: "E-Mandate Net Banking" },
      { code: "RECURRING_DC", name: "Recurring Debit Card" },
      { code: "UPI_EMANDATE", name: "UPI E-Mandate" }
    ],
    amount: "5000",
    encryptParentOrderNo: "ENC123456",
    eMandateNo: "EMAN789012",
    maxAmountLimit: "10000",
    parentOrderNo: "PO345678",
    order_id: "ORD901234",
    cust_id: "CUST567890",
    mid: "MERCHANT123",
    expire_at: "2023-12-31T23:59:59",
    sidcBankNote: "Some note about SIDC bank",
    productId: "PROD123",
    srcSupplierId: "SUPP456",
    orderNo: "ORD789012",
    showEmanQrCode: true,
    isMultiplier: 1,
    defaultMode: "CC",
    tabIndex: 0
  };
  const mockProps = {
    isSI: false,
    onCategoryValueChange: (value) => console.log("Category changed:", value)
  };
  

  // useEffect(() => {
  //   const pathname = window.location.pathname;
  //   let fetchData;
  //   if (pathname === '/healthstatus') {
  //     setHealthStatus(true);
  //     setIsLoading(false);
  //     return;
  //   }

  //   setAppData(dummyApiData);
  //   setIsLoading(false);
  // }, []);

  return (
    <>
      {/* {healthStatus ? (
        <div>success</div>
      ) : (
        <>
          {!isLoading && <Header apiData={appData} />}
          <PaymentGateway apiData={appData} />
        </>
      )}*/}
      {/* <Netbanking/> */}
      {/* <CreditCard/> */}
      {/* <MasterCardRupayForm/> */}
      {/* <CreditCardRecurring/> */}
      {/* <CreditCardSI/> */}
      {/* <EmiTabs/> */}
      {/* <UpiDetails/> */}
      {/* <PaymentFailedPopup/> */}
      {/* <UpiQR/> */}
      {/* <UpiDetailsEmandate/> */}
      {/* <UpiDetailsRecurring/> */}
      <PaymentAccordion 
      apiData={mockApiData}
  isSI={mockProps.isSI} 
  onCategoryValueChange={mockProps.onCategoryValueChange} 
/>
      {/* <EmiTable/> */}
      {/* <CardlessEmiDetails/> */}
      {/* <BankDetails/> */}
      {/* <EmiCreditCardDetails/> */}
      {/* <VisaMasterInfo/> */}

      {/* <NetbankingRecurring/> */}
        {/* <PaymentAccordion/> */}
    </>
  );
}

export default App;
