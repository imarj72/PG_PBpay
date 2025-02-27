import React, { useState, useEffect, useRef } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faInr, faMinus } from '@fortawesome/free-solid-svg-icons';
import Skeleton from '@mui/material/Skeleton';
import { Button } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ImageComponent from '../../shared/ImageComponent';
import CreditCard from '../../paymentModes/components/CreditCard/CreditCard';
import DebitCard from '../../paymentModes/components/DebitCard/DebitCard';
import CreditCardSI from '../../paymentModes/components/CreditCard/CreditCardSI';
import DebitCardSI from '../../paymentModes/components/DebitCard/DebitCardSI';
import Netbanking from '../../paymentModes/components/NetBanking/Netbanking';

import UpiDetails from '../../paymentModes/components/UPIpayment/UpiDetails';
import UpiDetailsEmandate from '../../paymentModes/components/UPIpayment/UpiDetailsEmandate';
import UpiDetailsRecurring from '../../paymentModes/components/UPIpayment/UpiDetailsRecurring';

import PlanAccordion from '../../paymentModes/commonDetails/PlanAccordion';

import Pos from '../../paymentModes/components/Pos/Pos';

import PaymentStepsSI from '../../paymentSteps/PaymentStepsSI';
import PaymentStepsOne from '../../paymentSteps/PaymentStepsOne';
import paymentSteps from '../../paymentSteps/PaymentSteps';
import PaymentError from '../../paymentSteps/PaymentError';


import EmandateRegistered from '../../paymentSteps/EmandateRegistered';
import EmandateOnDebit from '../../paymentModes/components/DebitCard/EmandateOnDebit';
import CreditCardRecurring from '../../paymentModes/components/CreditCard/CreditCardRecurring';
import NetbankingRecurring from '../../paymentModes/components/NetBanking/NetBankingRecurring';
import EmiTabs from '../../paymentModes/components/EmiCard/EmiTabs';

export default function PaymentAccordion({apiData, isSI, onCategoryValueChange }) {
  const [isShowLess, setIsShowLess] = useState(true);
  const [isShowPlanDetail, setIsShowPlanDetail] = useState(true);
  const [isShowProposerDetail, setShowProposerDetail] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [value, setValue] = useState(0);
  const [payModes, setPayModes] = useState([]);
  const [payModesToPass, setPayModesToPass] = useState([]);
  // const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eligibleModes, setEligibleModes] = useState([]);
  const [eligibleRecurringModes, setEligibleRecurringModes] = useState([]);
  const [isDisplayModeFive, setIsDisplayModeFive] = useState(false);
  const [categoryValue, setCategoryValue] = useState(0);
  const [multiplier, setMultiplier] = useState(false);

  const certifiedLogosStyle = {
    fontSize: '12px',
    color: '#0065FF',
    overflow: 'hidden',
    display: 'flex',
    // position: 'fixed',
    justifyContent: 'space-between', // Align items to the edges
    alignItems: 'center', // Vertically center items
    padding: '10px',
    width: '100%',
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const queryParameters = new URLSearchParams(window.location.search);
  //       const order = queryParameters.get("orderNo");
  //       const var1 = queryParameters.get("var1");
  //       const var2 = queryParameters.get("var2");
  //       const temp = { orderNo: order, isMobileView: true };

  //       const response = await fetch(`/pay/securePayment/details/paymentModes?var1=${var1}&var2=${var2}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(temp),
  //       });

  //       const data = await response.json();
  //       // setApiData(data);
  //       setIsLoading(false);
  //       const extractedPayModes = data.beans.payModes;
  //       const codeList = extractedPayModes.map(method => method.code);
  //       setPayModes(codeList);
  //       setPayModesToPass(data.beans.payModes);
  //       setEligibleModes(data.eligibleModes);
  //       setEligibleRecurringModes(data.eligibleRecurringModes);
  //       if (data.displayMode === 5) {
  //         setIsDisplayModeFive(true);
  //       }
  //       if (data.tabIndex === 1) {
  //         setCategoryValue(1);
  //       }

  //     } catch (error) {
  //       console.error('API request error:', error);
  //     }
  //   };

  //   if (!apiData) {
  //     fetchData();
  //   }
  // }, [apiData]);

  // useEffect(() => {
  //   if (apiData && apiData.isMultiplier > 0) {
  //     setMultiplier(true);
  //   }
  // }, [apiData]);


  // useEffect(() => {
//orih
  //   if (eligibleModes.length > 0) {
  //     if (apiData.defaultMode) {
  //       for (let i = 0; i < eligibleModes.length; i++) {
  //         if (eligibleModes[i].code === apiData.defaultMode) {
  //           setValue(i);
  //           break;
  //         }
  //       }
        
  //     }
  //   }
  // }, [eligibleModes, apiData]);

  useEffect(() => {
    if (apiData && apiData.eligibleModes) {
      setEligibleModes(apiData.eligibleModes); // Set the eligible modes from apiData
      setIsLoading(false); // Stop loading once we have the modes
    }
  }, [apiData]);
  
  
  console.log('Eligible Modes:', eligibleModes)


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);

  };

  const handleCategoryChange = (event, newCategoryValue) => {
    setCategoryValue(newCategoryValue);
    setValue(0); // Reset the payment mode tab to the first one when category changes
  };

  useEffect(() => {
    onCategoryValueChange(categoryValue);
  }, [categoryValue]);

  return (
    <>
      {
        // isLoading ? (
        //   <div>
        //     <Skeleton animation="wave" className="md:block" height={600} variant="text" />
        //     {/* Add more skeleton components as needed */}
        //   </div>
        // ) : (
          <div className='card-view'>

            <div className='mt-10 lg:hidden'>
              {!isSI && <PaymentStepsOne />}
              {isSI && <PaymentStepsSI />}
            </div>
            <div className="payment-mob-view">
              <table className='w-full' >
                {apiData.planDetails.map((insurer, index) => (
                  <tr key={index} >
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
                    {!multiplier && <td colSpan="2">
                      <div className='paying-card-head'>
                        <div className='flex items-center justify-end'>
                          <p>
                            <span>Premium</span>
                            <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i> {insurer.txAmount}</strong>
                          </p>

                        </div>
                      </div>
                    </td>}
                    {multiplier && categoryValue === 1 && <td colSpan="2">
                      <div className='paying-card-head'>
                        <div className='flex items-center justify-end'>
                          <p>
                            <span>Premium</span>
                            <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i>  {insurer.txAmount} </strong>
                          </p>

                        </div>
                      </div>
                    </td>}
                    {multiplier && categoryValue === 0 && <td colSpan="2">
                      <div className='paying-card-head'>
                        <div className='flex items-center justify-end'>
                          <p>
                            <span>Premium</span>
                            <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i>  {insurer.premium} * {insurer.multiplier}</strong>
                          </p>

                        </div>
                      </div>
                    </td>}
                  </tr>
                ))}
                {!isShowLess && (
                  <>
                    <tr>
                      <td colSpan="2">
                        <div className='border-tab'></div>
                      </td>
                      <td colSpan="2">
                        <div className='border-tab'></div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <p>Premium amount</p>
                      </td>
                      <td colSpan="2">
                        <strong className='block'><i className='text-xs'><FontAwesomeIcon icon={faInr} /></i>{apiData.totalAmount} </strong>
                      </td>
                    </tr>

                  </>
                )}
              </table>
            </div>

            {(!isDisplayModeFive && <div className='payment-accordion-box debit-card-box'>
              <h4 className='my-4' style={{ fontWeight: 'bold', marginLeft: '10px' }}>Choose payment mode</h4>
              {apiData.retry && <PaymentError retry={apiData.retry} style={{ marginBottom: '16px' }} />}
              {apiData.emandateRegistered && <EmandateRegistered style={{ marginBottom: '16px' }} />}
              {eligibleModes.map((mode, index) => {
                switch (mode.code) {
                  case 'CC':
                    return (
                      <Accordion expanded={expanded === 'creditCard'} onChange={handleChange('creditCard')} className='shadow-none'>
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'creditCard' ? faMinus : faPlus} />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'creditCard'} /><span>Credit Card</span>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <CreditCard secret={apiData.secret} cardDownBanks={apiData.cardDownBanks} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  case 'DC':
                    return (
                      <Accordion expanded={expanded === 'debitCard'} onChange={handleChange('debitCard')} className='shadow-none' >
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'debitCard' ? faMinus : faPlus} />}
                          aria-controls="panel3bh-content"
                          id="panel3bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'creditCard'} /><span>Debit Card</span> 
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <DebitCard secret={apiData.secret} cardDownBanks={apiData.cardDownBanks} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  // case 'SI_CC':
                  //   return (<Accordion expanded={expanded === 'creditCard'} onChange={handleChange('creditCard')} className='shadow-none'>
                  //     <AccordionSummary
                  //       expandIcon={<FontAwesomeIcon icon={expanded === 'creditCard' ? faMinus : faPlus} />}
                  //       aria-controls="panel1bh-content"
                  //       id="panel1bh-header">
                  //       <Typography>
                  //         <ImageComponent name={'creditCard'} /> Credit Card
                  //       </Typography>
                  //     </AccordionSummary>
                  //     <AccordionDetails>
                  //       <CreditCardSI secret={apiData.secret} cardDownBanks={apiData.cardDownBanks}
                  //         displayMode={apiData.displayMode} displayModeCheck={apiData.displayModeCheck} />
                  //     </AccordionDetails>
                  //   </Accordion>);
                  //   break;
                  // case 'SI_DC':
                  //   return (<Accordion expanded={expanded === 'debitCard'} onChange={handleChange('debitCard')} className='shadow-none' >
                  //     <AccordionSummary
                  //       expandIcon={<FontAwesomeIcon icon={expanded === 'debitCard' ? faMinus : faPlus} />}
                  //       aria-controls="panel3bh-content"
                  //       id="panel3bh-header">
                  //       <Typography>
                  //         <ImageComponent name={'creditCard'} /> Debit Card
                  //       </Typography>
                  //     </AccordionSummary>
                  //     <AccordionDetails>
                  //       <DebitCardSI secret={apiData.secret} cardDownBanks={apiData.cardDownBanks}
                  //         displayMode={apiData.displayMode} displayModeCheck={apiData.displayModeCheck} />
                  //     </AccordionDetails>
                  //   </Accordion>);
                  //   break;
                  // case 'PPI':
                  //   return (
                  //     <Accordion expanded={expanded === 'wallet'} onChange={handleChange('wallet')} className='shadow-none' >
                  //       <AccordionSummary
                  //         expandIcon={<FontAwesomeIcon icon={expanded === 'wallet' ? faMinus : faPlus} />}
                  //         aria-controls="panel3bh-content"
                  //         id="panel3bh-header"
                  //       >
                  //         <Typography>
                  //           <ImageComponent name={'wallet'} /> Wallet
                  //         </Typography>
                  //       </AccordionSummary>
                  //       <AccordionDetails>
                  //         <WalletPayment payModesToPass={payModesToPass} displayOrderNo={apiData.displayOrderNo} />
                  //       </AccordionDetails>
                  //     </Accordion>
                  //   )
                  case 'NB':
                    return (
                      <Accordion expanded={expanded === 'netbanking'} onChange={handleChange('netbanking')} className='shadow-none'>
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'netbanking' ? faMinus : faPlus} />}
                          aria-controls="panel3bh-content"
                          id="panel3bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'netbanking'} /><span>Netbanking</span> 
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Netbanking payModesToPass={payModesToPass} nbDownBanks={apiData.nbDownBanks} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  case 'UPI':
                    return (
                      <Accordion expanded={expanded === 'UpiIcon'} onChange={handleChange('UpiIcon')} className='shadow-none' >
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'UpiIcon' ? faMinus : faPlus} />}
                          aria-controls="panel3bh-content"
                          id="panel3bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'UpiIcon'} /> <span>UPI</span>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <UpiDetails payModesToPass={apiData} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  // case 'POS':
                  //   return (
                  //     <Accordion expanded={expanded === 'pos'} onChange={handleChange('pos')} className='shadow-none'>
                  //       <AccordionSummary
                  //         expandIcon={<FontAwesomeIcon icon={expanded === 'pos' ? faMinus : faPlus} />}
                  //         aria-controls="panel3bh-content"
                  //         id="panel3bh-header"
                  //       >
                  //         <Typography>
                  //           <ImageComponent name={'pos'} /> POS
                  //         </Typography>
                  //       </AccordionSummary>
                  //       <AccordionDetails>
                  //         <Pos />
                  //       </AccordionDetails>
                  //     </Accordion>
                  //   )

                  // case 'EMI':
                  //   return (
                  //     <Accordion expanded={expanded === 'emi'} onChange={handleChange('emi')} className='shadow-none'>
                  //       <AccordionSummary
                  //         expandIcon={<FontAwesomeIcon icon={expanded === 'emi' ? faMinus : faPlus} />}
                  //         aria-controls="panel3bh-content"
                  //         id="panel3bh-header"
                  //       >
                  //         <Typography>
                  //           <ImageComponent name={'pos'} /> EMI
                  //         </Typography>
                  //       </AccordionSummary>
                  //       <AccordionDetails>
                  //         <EmiTabs apiData = {apiData}/>
                  //       </AccordionDetails>
                  //     </Accordion>
                  //   )
                  // case 'NCEMI':
                  //   return (
                  //     <Accordion expanded={expanded === 'ncemi'} onChange={handleChange('ncemi')} className='shadow-none'>
                  //       <AccordionSummary
                  //         expandIcon={<FontAwesomeIcon icon={expanded === 'ncemi' ? faMinus : faPlus} />}
                  //         aria-controls="panel3bh-content"
                  //         id="panel3bh-header"
                  //       >
                  //         <Typography>
                  //           <ImageComponent name={'pos'} /> NCEMI
                  //         </Typography>
                  //       </AccordionSummary>
                  //       <AccordionDetails>
                  //            <NcemiTabs apiData = {apiData} />
                  //       </AccordionDetails>
                  //     </Accordion>
                  //   )

                  //             case 'SMARTCOLLECT':
                  //               return (
                  //                 <Accordion expanded={expanded === 'neft'} onChange={handleChange('neft')} className='shadow-none'>
                  //                   <AccordionSummary
                  //                     expandIcon={<FontAwesomeIcon icon={expanded === 'neft' ? faMinus : faPlus} />}
                  //                     aria-controls="panel3bh-content"
                  //                   id="panel3bh-header"
                  //                 >
                  // <Typography>
                  //                       <ImageComponent name={'pos'} /> NEFT/IMPS/RTGS
                  //                       <span style={{ fontSize: '12px' }}>
                  //                         (Pay Via Bank Account Transfer)
                  //                       </span>
                  //                     </Typography>
                  //                   </AccordionSummary>
                  //                   <AccordionDetails>
                  //                     <NeftImps payModesToPass={apiData} />
                  //                   </AccordionDetails>
                  //                 </Accordion>);
                  //             break;
                  // case 'UPI_EMANDATE':
                  //   return (<Accordion expanded={expanded === 'UpiIcon'} onChange={handleChange('UpiIcon')} className='shadow-none'>
                  //     <AccordionSummary
                  //       expandIcon={<FontAwesomeIcon icon={expanded === 'UpiIcon' ? faMinus : faPlus} />}
                  //       aria-controls="panel3bh-content"
                  //       id="panel3bh-header">
                  //       <Typography>
                  //         <ImageComponent name={'UpiIcon'} /> UPI Emandate
                  //       </Typography>
                  //     </AccordionSummary>
                  //     <AccordionDetails>
                  //       <UpiDetailsEmandate payMode={apiData.eligibleModes[index]} productId={apiData.productId}
                  //         txAmount={apiData.amount} showEmanQrCode={apiData.showEmanQrCode} />
                  //     </AccordionDetails>
                  //   </Accordion>);
                  //   break;

                  default:
                    break;
                }
              })}


              {/* <PlanAccordion /> */}



            </div>)}

            {(isDisplayModeFive && <div className='payment-accordion-box debit-card-box'>
              <Tabs
                value={categoryValue}
                onChange={handleCategoryChange}
                aria-label="Payment Mode Categories"
                variant="fullWidth"
                sx={{ marginBottom: 2 }}
              >
                <Tab label="One Time Payment" {...a11yProps(0)} />
                <Tab label="Recurring Payment" {...a11yProps(1)} />
              </Tabs>
              <h4 className='my-4' style={{ fontWeight: 'bold', marginLeft: '10px' }}>Choose payment mode</h4>
              {apiData.retry && <PaymentError retry={apiData.retry} style={{ marginBottom: '16px' }} />}

              {categoryValue === 0 && eligibleModes.map((mode, index) => {
                switch (mode.code) {
                  case 'CC':
                    return (
                      <Accordion expanded={expanded === 'creditCard'} onChange={handleChange('creditCard')} className='shadow-none'>
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'creditCard' ? faMinus : faPlus} />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'creditCard'} /> Credit Card
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <CreditCard secret={apiData.secret} cardDownBanks={apiData.cardDownBanks} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  case 'DC':
                    return (
                      <Accordion expanded={expanded === 'debitCard'} onChange={handleChange('debitCard')} className='shadow-none' >
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'debitCard' ? faMinus : faPlus} />}
                          aria-controls="panel3bh-content"
                          id="panel3bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'creditCard'} /> Debit Card
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <DebitCard secret={apiData.secret} cardDownBanks={apiData.cardDownBanks} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  case 'SI_CC':
                    return (<Accordion expanded={expanded === 'creditCard'} onChange={handleChange('creditCard')} className='shadow-none'>
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={expanded === 'creditCard' ? faMinus : faPlus} />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header">
                        <Typography>
                          <ImageComponent name={'creditCard'} /> Credit Card
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <CreditCardSI secret={apiData.secret} cardDownBanks={apiData.cardDownBanks}
                          displayMode={apiData.displayMode} displayModeCheck={apiData.displayModeCheck} />
                      </AccordionDetails>
                    </Accordion>);
                    break;
                  case 'SI_DC':
                    return (<Accordion expanded={expanded === 'debitCard'} onChange={handleChange('debitCard')} className='shadow-none' >
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={expanded === 'debitCard' ? faMinus : faPlus} />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header">
                        <Typography>
                          <ImageComponent name={'creditCard'} /> Debit Card
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <DebitCardSI secret={apiData.secret} cardDownBanks={apiData.cardDownBanks}
                          displayMode={apiData.displayMode} displayModeCheck={apiData.displayModeCheck} />
                      </AccordionDetails>
                    </Accordion>);
                    break;
                  // case 'PPI':
                  //   return (
                  //     <Accordion expanded={expanded === 'wallet'} onChange={handleChange('wallet')} className='shadow-none' >
                  //       <AccordionSummary
                  //         expandIcon={<FontAwesomeIcon icon={expanded === 'wallet' ? faMinus : faPlus} />}
                  //         aria-controls="panel3bh-content"
                  //         id="panel3bh-header"
                  //       >
                  //         <Typography>
                  //           <ImageComponent name={'wallet'} /> Wallet
                  //         </Typography>
                  //       </AccordionSummary>
                  //       <AccordionDetails>
                  //         <WalletPayment payModesToPass={payModesToPass} />
                  //       </AccordionDetails>
                  //     </Accordion>
                  //   )
                  case 'NB':
                    return (
                      <Accordion expanded={expanded === 'netbanking'} onChange={handleChange('netbanking')} className='shadow-none'>
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'netbanking' ? faMinus : faPlus} />}
                          aria-controls="panel3bh-content"
                          id="panel3bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'netbanking'} /> Netbanking
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Netbanking payModesToPass={payModesToPass} nbDownBanks={apiData.nbDownBanks} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  case 'UPI':
                    return (
                      <Accordion expanded={expanded === 'UpiIcon'} onChange={handleChange('UpiIcon')} className='shadow-none' >
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'UpiIcon' ? faMinus : faPlus} />}
                          aria-controls="panel3bh-content"
                          id="panel3bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'UpiIcon'} /> UPI
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <UpiDetails payModesToPass={apiData} />
                        </AccordionDetails>
                      </Accordion>
                    )
                  // case 'POS':
                  //   return (
                  //     <Accordion expanded={expanded === 'pos'} onChange={handleChange('pos')} className='shadow-none'>
                  //       <AccordionSummary
                  //         expandIcon={<FontAwesomeIcon icon={expanded === 'pos' ? faMinus : faPlus} />}
                  //         aria-controls="panel3bh-content"
                  //         id="panel3bh-header"
                  //       >
                  //         <Typography>
                  //           <ImageComponent name={'pos'} /> POS
                  //         </Typography>
                  //       </AccordionSummary>
                  //       <AccordionDetails>
                  //         <Pos />
                  //       </AccordionDetails>
                  //     </Accordion>
                  //   )

                  case 'EMI':
                    return (
                      <Accordion expanded={expanded === 'emi'} onChange={handleChange('emi')} className='shadow-none'>
                        <AccordionSummary
                          expandIcon={<FontAwesomeIcon icon={expanded === 'emi' ? faMinus : faPlus} />}
                          aria-controls="panel3bh-content"
                          id="panel3bh-header"
                        >
                          <Typography>
                            <ImageComponent name={'pos'} /> EMI
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <EmiTabs apiData = {apiData}/>
                        </AccordionDetails>
                      </Accordion>
                    )
                  // case 'NCEMI':
                  //   return (
                  //     <Accordion expanded={expanded === 'ncemi'} onChange={handleChange('ncemi')} className='shadow-none'>
                  //       <AccordionSummary
                  //         expandIcon={<FontAwesomeIcon icon={expanded === 'ncemi' ? faMinus : faPlus} />}
                  //         aria-controls="panel3bh-content"
                  //         id="panel3bh-header"
                  //       >
                  //         <Typography>
                  //           <ImageComponent name={'pos'} /> NCEMI
                  //         </Typography>
                  //       </AccordionSummary>
                  //       <AccordionDetails>
                  //            <NcemiTabs apiData = {apiData} />
                  //       </AccordionDetails>
                  //     </Accordion>
                  //   )

                  //             case 'SMARTCOLLECT':
                  //               return (
                  //                 <Accordion expanded={expanded === 'neft'} onChange={handleChange('neft')} className='shadow-none'>
                  //                   <AccordionSummary
                  //                     expandIcon={<FontAwesomeIcon icon={expanded === 'neft' ? faMinus : faPlus} />}
                  //                     aria-controls="panel3bh-content"
                  //                   id="panel3bh-header"
                  //                 >
                  // <Typography>
                  //                       <ImageComponent name={'pos'} /> NEFT/IMPS/RTGS
                  //                       <span style={{ fontSize: '12px' }}>
                  //                         (Pay Via Bank Account Transfer)
                  //                       </span>
                  //                     </Typography>
                  //                   </AccordionSummary>
                  //                   <AccordionDetails>
                  //                     <NeftImps payModesToPass={apiData} />
                  //                   </AccordionDetails>
                  //                 </Accordion>);
                  //             break;
                  case 'UPI_EMANDATE':
                    return (<Accordion expanded={expanded === 'UpiIcon'} onChange={handleChange('UpiIcon')} className='shadow-none'>
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={expanded === 'UpiIcon' ? faMinus : faPlus} />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header">
                        <Typography>
                          <ImageComponent name={'UpiIcon'} /> UPI Emandate
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <UpiDetailsEmandate payMode={apiData.eligibleModes[index]} productId={apiData.productId}
                          txAmount={apiData.amount} showEmanQrCode={apiData.showEmanQrCode} />
                      </AccordionDetails>
                    </Accordion>);
                    break;

                  default:
                    break;
                }
              })}

              {categoryValue === 1 && eligibleRecurringModes.map((mode, index) => {
                switch (mode.code) {
                  case 'EMANDATE_NB':
                    return (<Accordion expanded={expanded === 'netbanking'} onChange={handleChange('netbanking')} className='shadow-none' >
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={expanded === 'netbanking' ? faMinus : faPlus} />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header">
                        <Typography>
                          <ImageComponent name={'netbanking'} /> Netbanking
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <NetbankingRecurring payModesToPass={payModesToPass} displayOrderNo={apiData.encryptParentOrderNo} eMandateNo={apiData.eMandateNo}
                          maxAmountLimit={apiData.maxAmountLimit} parentOrderNo={apiData.parentOrderNo} order_id={apiData.order_id} cust_id={apiData.cust_id} mid={apiData.mid}
                          expire_at={apiData.expire_at} orderNo={apiData.encryptParentOrderNo} productId={apiData.productId} />
                      </AccordionDetails>
                    </Accordion>);
                    break;

                  case 'RECURRING_DC':
                    return (<Accordion expanded={expanded === 'sidebitCard'} onChange={handleChange('sidebitCard')} className='shadow-none' >
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={expanded === 'sidebitCard' ? faMinus : faPlus} />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header">
                        <Typography>
                          <ImageComponent name={'creditCard'} /> Debit Card
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <EmandateOnDebit payModesToPass={payModesToPass} displayOrderNo={apiData.encryptParentOrderNo} eMandateNo={apiData.eMandateNo}
                          maxAmountLimit={apiData.maxAmountLimit} parentOrderNo={apiData.parentOrderNo} order_id={apiData.order_id} cust_id={apiData.cust_id} mid={apiData.mid}
                          expire_at={apiData.expire_at} sidcBankNote={apiData.sidcBankNote} secret={apiData.secret} cardDownBanks={apiData.cardDownBanks}
                          productId={apiData.productId} srcSupplierId={apiData.srcSupplierId} displayMode={apiData.displayMode} orderNo={apiData.orderNo} />
                      </AccordionDetails>
                    </Accordion>);
                    break;
                  case 'UPI_EMANDATE':
                    return (<Accordion expanded={expanded === 'upieman'} onChange={handleChange('upieman')} className='shadow-none'>
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={expanded === 'upieman' ? faMinus : faPlus} />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header">
                        <Typography>
                          <ImageComponent name={'UpiIcon'} /> UPI Emandate
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <UpiDetailsRecurring payMode={apiData.eligibleRecurringModes[index]} productId={apiData.productId}
                          txAmount={apiData.amount} showEmanQrCode={apiData.showEmanQrCode} />
                      </AccordionDetails>
                    </Accordion>);
                    break;
                  case 'SI_CC':
                    return (<Accordion expanded={expanded === 'sicreditCard'} onChange={handleChange('sicreditCard')} className='shadow-none'>
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={expanded === 'sicreditCard' ? faMinus : faPlus} />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header">
                        <Typography>
                          <ImageComponent name={'creditCard'} /> Credit Card
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <CreditCardRecurring secret={apiData.secret} cardDownBanks={apiData.cardDownBanks}
                          productId={apiData.productId} srcSupplierId={apiData.srcSupplierId} displayMode={apiData.displayMode} />
                      </AccordionDetails>
                    </Accordion>);
                    break;

                  default:
                    break;
                }
              })}


              <PlanAccordion categoryValue={categoryValue} />



            </div>)}

            <div style={certifiedLogosStyle} className="certified-logos hideSmall">
              <p className="left">
                <a href="https://www.policybazaar.com/legal-and-admin-policies/" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                {'  |  '}
                <a href="https://www.policybazaar.com/legal-and-admin-policies/#termsofuse" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>
                {'  |  '}
                <a href="https://payment.policybazaar.com/pay/faq.jsp" target="_blank" rel="noopener noreferrer">
                  FAQ
                </a>
              </p>    <p className="right rightOne">
                <a href="https://www.5tattva.com/verify/ftzdkix4sq" target="_blank" rel="noopener noreferrer">

                  <img
                    src="./images/pci-dss-certified@2x.png"
                    alt="PCI DSS Certified"
                    width="84"
                  />
                </a>
              </p>
            </div>
          </div>
        // )
      }

    </>
  );
}
