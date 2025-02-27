import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faInr, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import PaymentSteps from '../../paymentSteps/PaymentSteps';
import Dialog from '@mui/material/Dialog';
import { Button, Link } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
// import SendCommLink from '../../../../Shared/SendCommLink';

const apiData= {
    secret: "someSecretKey123",
    cardDownBanks: ["Bank A", "Bank B"],
    nbDownBanks: ["Bank C", "Bank D"],
    displayMode: 5,
    displayModeCheck: true,
    retry: false,
    emandateRegistered: false,
    planDetails: [
      {
        insurerLogo: "pol",
        insurerName: "Digit Insurance",
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
      { code: "UPI", name: "UPI" }
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
export default function PlanAccordion({categoryValue}) {
    console.log('categoryValue'+categoryValue);
    // const [apiData, setApiData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const apiCallMade = useRef(false);
    const titles = ["First Plan", "Second Plan", "Third Plan", "Fourth Plan" , "Fifth Plan" , "Sixth Plan"];
    const [isMobileView, setIsMobileView] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showCommPopUp, setShowCommPopUp] = useState(false);
    const [multiplier, setMultiplier] = useState(false);
    const [isDisplayModeFive, setIsDisplayModeFive] = useState(false);
    

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 820);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
       const handleCloseDialog = () => {
   setShowCommPopUp(false);
  };
      const certifiedLogosStyle = {
      fontSize: '12px',
      color: '#0065FF',	
      overflow: 'hidden',
      display: 'flex',
      position: 'fixed',
      justifyContent: 'space-between', // Align items to the edges
      alignItems: 'center', // Vertically center items
      padding: '10px',
      width: '100%',
    };


     const handleSharePaymentLink = async() => {
      try {
      const queryParameters = new URLSearchParams(window.location.search);
      const orderNo = queryParameters.get("orderNo");
      const temp = { orderNo: orderNo };
      const response = await fetch('/pay/sendLink/instant/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( temp ),
      });

      const data = await response.json();

      if (response.ok && data.isSendPaymentLink) {
        setIsSuccess(true);
        setShowCommPopUp(true);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
    };

//     useEffect(() => {
//         const fetchData = async () => {
//             if (apiCallMade.current) return;
//             try {

//                 const queryParameters = new URLSearchParams(window.location.search);
//                 const order = queryParameters.get("orderNo");
//                 const temp = { orderNo: order };
//                 const var1 = queryParameters.get("var1");
//                 const var2 = queryParameters.get("var2");
//                 const response = await fetch(`/pay/securePayment/details/customerProduct?var1=${var1}&var2=${var2}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(temp),
//                 });

//                 const data = await response.json();
//                 setApiData(data);
//                 setIsLoading(false);
//                 apiCallMade.current = true;
//                 if(data.displayMode === 5){
//                  setIsDisplayModeFive(true);
//                 }

//             } catch (error) {
//                 console.error('API request error:', error);
//             }
//         };

//         if (!apiData) {
//             fetchData();
//         }
//     }, []);
//    useEffect(() => {
//    if (apiData && apiData.isMultiplier > 0) {
//     setMultiplier(true);
//   }
// }, [apiData]);
    const [isShowLess, setIsShowLess] = useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [isShowPlanDetail, setIsShowPlanDetail] = useState(true);
    const [isShowProposerDetail, setShowProposerDetail] = useState(true);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    return (
        <>
            {/* {isLoading ? (
                <Skeleton animation="wave" className="card-view" height={600} variant="text" />
            ) : ( */}
                <div>
                    <div className='card-view'>
                        <div className='mt-10 hidden lg:hidden'><PaymentSteps /></div>
                        <div className='plan-details-view'>
                            <div className='plan-detail-header'>
                                <div>
                                    <p>Order Number</p>
                                </div>
                                <div>
                                    <p>{apiData.orderNo}</p>
                                </div>
                            </div>
                            <div className='plan-detail-table'>
                                {!isMobileView && <table className='w-full '>
                                    {apiData.planDetails.map((insurer, index) => (
                                        <tr key={index}>
                                            <td colSpan="2">
  <img class="source-logo"
    src={
      /^https?:\/\//i.test(insurer.insurerLogo)
        ? insurer.insurerLogo
        : `./images/${insurer.insurerLogo}`
    } 
    alt={insurer.insurerName} 
    style={{ maxWidth: '100%', height: 'auto' }} 
  />
</td>
                                           {multiplier &&  categoryValue === 0 && <td colSpan="2">
                                                <div className='paying-card-head'>
                                                    <span>Premium</span>
                                                    <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {insurer.premium} * {insurer.multiplier}</strong>
                                                </div>
                                            </td>}
                                            {multiplier && categoryValue === 1 && <td colSpan="2">
                                                <div className='paying-card-head'>
                                                    <span>Premium</span>
                                                    <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {insurer.txAmount} </strong>
                                                </div>
                                            </td>}
                                               {!multiplier && <td colSpan="2">
                                                <div className='paying-card-head'>
                                                    <span>Premium</span>
                                                    <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {insurer.txAmount}</strong>
                                                </div>
                                            </td>}
                                        </tr>
                                    ))}

                                </table>}
                            </div>
                            <table className='w-full'>
                               {!isMobileView &&( <div>
                               {multiplier && categoryValue === 0  && <tr  className="flex w-full">
				 <td colSpan="2">
                                        <p>Total Premium</p>
                                    </td>
                                    <td colSpan="2">
                                        <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {apiData.multipliedAmount}</strong>
                                    </td> </tr>}
                                    {!multiplier && <tr  className="flex w-full">
				 <td colSpan="2">
                                        <p>Total Premium</p>
                                    </td> <td colSpan="2">
                                        <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {apiData.totalAmount}</strong>
                                    </td>
                                </tr>}
                              
                               {!isDisplayModeFive && apiData.maxAmount &&  <tr>
                                    <td colSpan="2">
                                        <p>Max Recurring Amount</p>
                                    </td>
                                    <td colSpan="2">
                                        <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {apiData.maxAmount}</strong>
                                    </td>
                                </tr>}
                                {isDisplayModeFive && categoryValue === 1 && apiData.premium &&  <tr>
                                    <td colSpan="2">
                                        <p>Actual Amount to be Deducted</p>
                                    </td>
                                    <td colSpan="2">
                                        <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {apiData.totalAmount}</strong>
                                    </td>
                                </tr>}
                                 {isDisplayModeFive && categoryValue === 1 && apiData.maxAmount &&  <tr>
                                    <td colSpan="2">
                                        <p>Max Recurring Amount</p>
                                    </td>
                                    <td colSpan="2">
                                        <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {apiData.maxAmount}</strong>
                                    </td>
                                </tr>}
                                
                               
                                </div>)}
                             { isMobileView && (
                             <div>
   {multiplier && categoryValue === 0 && <tr className='totalAmount-mob flex w-full'>
        <td colSpan="2">
            <p style={{ fontSize: '14px' }}>Total Premium</p>
        </td>
         <td colSpan="2">
            <strong className='block' style={{ fontSize: '14px' }}>
                <i className='text-xs' style={{ fontSize: '14px' }}>
                    <FontAwesomeIcon icon={faInr} />
                </i>
                {apiData.multipliedAmount}
            </strong>
        </td> </tr>}
         {!multiplier && <tr className='totalAmount-mob flex w-full'>
        <td colSpan="2">
            <p style={{ fontSize: '14px' }}>Total Premium</p>
        </td> 
        <td colSpan="2">
            <strong className='block' style={{ fontSize: '14px' }}>
                <i className='text-xs' style={{ fontSize: '14px' }}>
                    <FontAwesomeIcon icon={faInr} />
                </i>
                {apiData.totalAmount}
            </strong>
        </td>
    </tr>}
    {!isDisplayModeFive && apiData.maxAmount && <tr className='totalAmount-mob flex w-full'>
        <td colSpan="2">
            <p style={{ fontSize: '14px' }}>Max Recurring Amount</p>
        </td>
        <td colSpan="2">
            <strong className='block' style={{ fontSize: '14px' }}>
                <i className='text-xs' style={{ fontSize: '14px' }}>
                    <FontAwesomeIcon icon={faInr} />
                </i>
                {apiData.maxAmount}
            </strong>
        </td>
    </tr>}
     {isDisplayModeFive && categoryValue === 1 && apiData.premium && <tr className='totalAmount-mob flex w-full'>
        <td colSpan="2">
            <p style={{ fontSize: '14px' }}>Actual Amount to be Deducted</p>
        </td>
        <td colSpan="2">
            <strong className='block' style={{ fontSize: '14px' }}>
                <i className='text-xs' style={{ fontSize: '14px' }}>
                    <FontAwesomeIcon icon={faInr} />
                </i>
                {apiData.totalAmount}
            </strong>
        </td>
    </tr>}
      {isDisplayModeFive && categoryValue === 1 && apiData.maxAmount && <tr className='totalAmount-mob flex w-full'>
        <td colSpan="2">
            <p style={{ fontSize: '14px' }}>Max Recurring Amount</p>
        </td>
        <td colSpan="2">
            <strong className='block' style={{ fontSize: '14px' }}>
                <i className='text-xs' style={{ fontSize: '14px' }}>
                    <FontAwesomeIcon icon={faInr} />
                </i>
                {apiData.maxAmount}
            </strong>
        </td>
    </tr>}
    
    </div>
)}

                            </table>
                            
		       {apiData.displayLinkButton &&<div className='payment-link-pos'>
 			<div className='payment-link'><Button onClick={handleSharePaymentLink}>Send Payment Link</Button></div>
                   		</div>}	
                        </div>
                    </div>

		  {!isMobileView && apiData.frequency &&<div className='card-view mt-4 py-4 px-4'>
                        <table className='w-full'>
                            <tr>
                                <td colSpan="2">
                                    <h4 style={{ fontSize: '16px',fontWeight:"600" }}>Pay frequency</h4>
                                </td>
                                <td colSpan="2" align='right'>
                                    <strong className='block' style={{ fontSize: '14px' }}>
                                       {apiData.frequency}
                                    </strong>
                                </td>
                            </tr>
                        </table>
                    </div>}
                    
                    
                    <div className='accordion-box'>
                    {isMobileView && apiData.frequency &&(
                  <div className="plan-detail-accodion" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
		  <h3 style={{ margin: 0, textAlign: 'left' }}>Pay frequency</h3>
                  <h3 style={{ margin: 0, textAlign: 'right' }}>{apiData.frequency}</h3>     </div>
                    )}
                        <div className='plan-detail-accodion'>
                            <h3>
                                Plan Details
                                <Button className='dropdown-btn' onClick={() => setIsShowPlanDetail(!isShowPlanDetail)} >{isShowPlanDetail ? <FontAwesomeIcon icon={faPlus} /> : <FontAwesomeIcon icon={faMinus} />}</Button></h3>
                            {apiData.showDiscountTab && (
                                <>
                                    <div className='payment-info'>
                                        <p>
                                            Your premium is <FontAwesomeIcon icon={faInr} />{apiData.totalAmount} for the first year. From 2nd year onwards your premium will be <FontAwesomeIcon icon={faInr} />{apiData.discountDetails.secondYrPremium}.
                                        </p>
                                        <p>
                                            <span>
                                                You save <FontAwesomeIcon icon={faInr} />{apiData.discountDetails.discountedAmt} ({apiData.discountDetails.discount}%)
                                            </span>
                                        </p>
                                    </div>
                                </>
                            )}
                            <div className='insurer-detail-table'>
                            {!isShowPlanDetail && (
                                <> <div className='plan-details-view plan-details-box'>
                                    {apiData.planDetails.map((plan, index) => (
                                        <div key={index}>
                                            {apiData.planDetails.length > 1 && (
                                                <h4>{titles[index] || `Plan ${index + 1}`}</h4>
                                            )}
                                            <table className='w-full  '>
                                                <tr>
                                                    <td colSpan="2">
                                                        <p>Insurer</p>
                                                    </td>
                                                    <td colSpan="2">
                                                        <strong className='block'>{plan.insurerName}</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">
                                                        <p>Plan</p>
                                                    </td>
                                                    <td colSpan="2">
                                                        <strong className='block'>{plan.planName}</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">
                                                        <p>Policy Type</p>
                                                    </td>
                                                    <td colSpan="2">
                                                        <strong className='block'>{plan.productName}</strong>
                                                    </td>
                                                </tr>
                                                {plan.proposalNo !== '-2' && plan.proposalNo !== 'Not Generated Yet' && (
                                                    <tr>
                                                        <td colSpan="2">
                                                            <p>Proposal No.</p>
                                                        </td>
                                                        <td colSpan="2">
                                                            <strong className='block'>{plan.proposalNo}</strong>
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td colSpan="2">
                                                        <p>Order No.</p>
                                                    </td>
                                                    <td colSpan="2">
                                                        <strong className='block'>{apiData.orderNo}</strong>
                                                    </td>
                                                </tr>
                                            </table>
                                        {index < apiData.planDetails.length - 1 && <hr />}
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                            </div>
                        </div>
                        <div className='plan-detail-accodion'>
                            <h3>
                                Proposer Details
                                <Button className='dropdown-btn' onClick={() => setShowProposerDetail(!isShowProposerDetail)} >{isShowProposerDetail ? <FontAwesomeIcon icon={faPlus} /> : <FontAwesomeIcon icon={faMinus} />}</Button></h3>
                            {!isShowProposerDetail && (
                                <>
                                    <div className='plan-details-view plan-details-box'>
                                        <table className='w-full' >
                                            <tr>
                                                <td colSpan="2">
                                                    <p>Name</p>
                                                </td>
                                                <td colSpan="2" style={{ paddingRight: '20px' }}>
                                                    <strong className='block'>{apiData.proposerDetails.name}</strong>
                                                </td>
                                            </tr>
                                          {apiData.proposerDetails.email && <tr>

                                                <td colSpan="2">
                                                    <p>Email ID</p>
                                                </td>
                                                <td colSpan="2">
                                                    <strong className='block' style={{ paddingRight: '20px' }}>{apiData.proposerDetails.email}</strong>
                                                </td>
                                            </tr>}
                                            <tr>
                                                <td colSpan="2">
                                                    <p>Mobile Number</p>
                                                </td>
                                                <td colSpan="2">
                                                    <strong className='block' style={{ paddingRight: '20px' }}>{apiData.proposerDetails.mobile}</strong>
                                                </td>
                                            </tr>
                                            
                                        </table>
                                          
                                    </div>
                                </>
                            )}
                        </div>
                      
                    </div></div>
                    <div>
                      {/* <Dialog  open={showCommPopUp} >
     			   {/* <SendCommLink  handleCloseDialog={handleCloseDialog} /> */}
    			  {/* </Dialog> */} 
                    </div>
        </>
    );
}
