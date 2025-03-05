import React, { useState, useEffect } from 'react';
import PaymentStepsOne from '../paymentSteps/PaymentStepsOne';
import PaymentStepsSI from '../paymentSteps/PaymentStepsSI';
import PlanAccordion from './commonDetails/PlanAccordion';
import PaymentAccordion from '../paymentTabs/component/PaymentAccordion';
import PaymentError from '../paymentSteps/PaymentError';
import EmandateRegistered from '../paymentSteps/EmandateRegistered';
import CustomizedDialogs from '../shared/CustomDialogs';
import PaymentTabs from '../paymentTabs/PaymentTabs';


function PaymentView({apiData}) {

   const[isMobileView, setIsMobileView] = useState(false);   
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };
	handleResize();
	window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    

    const certifiedLogosStyle = {
      fontSize: '12px',
      color: '#0065FF',	
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px',
      
    };

return (
    <>
        <div className='mt-10'>
            <ul className='payment-list-main'>
            <li className='hidden md:block col-left-panel'>
                {!isMobileView && <PaymentStepsOne/>} 
                   
                   {/* {apiData.retry && <PaymentError retry = {apiData.retry}/>} */}

                    <div className='hidden md:block mt-6 bg-slate-100 debit-card-tab'>
                        {!isMobileView && <PaymentTabs apiData={apiData}/>}
                    </div>
                     {!isMobileView && (
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
                          </p>
                          <p className="right rightOne">
                            <a href="https://www.5tattva.com/verify/ftzdkix4sq" target="_blank" rel="noopener noreferrer">
                          
                              <img
                                src="./images/pci-dss-certified@2x.png"
                                alt="PCI DSS Certified"
                                width="84"
                              />
                            </a>
                          </p>
                    </div>
            )}
                </li>
                <li className='hidden md:block col-right-panel'>
                    {!isMobileView &&  <PlanAccordion/>}
                    
                </li>
		<li className='md:hidden'>
                 {isMobileView &&  <PaymentAccordion apiData={apiData}/>}
                </li>
            </ul>
        </div>
    </>
);
}

export default PaymentView;