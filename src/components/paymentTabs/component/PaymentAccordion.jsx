import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faInr, faMinus } from '@fortawesome/free-solid-svg-icons';

import ImageComponent from '../../shared/ImageComponent';
import CreditCard from '../../paymentModes/components/CreditCard/CreditCard';
import DebitCard from '../../paymentModes/components/DebitCard/DebitCard';
import Netbanking from '../../paymentModes/components/NetBanking/Netbanking';
import UpiDetails from '../../paymentModes/components/UPIpayment/UpiDetails';
import PlanAccordion from '../../paymentModes/commonDetails/PlanAccordion';
import PaymentStepsOne from '../../paymentSteps/PaymentStepsOne';
import PaymentError from '../../paymentSteps/PaymentError';

export default function PaymentAccordion({ apiData }) {
  const [expanded, setExpanded] = useState(null);
  const [paymentModes, setPaymentModes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (apiData && apiData.length > 0 && apiData[0].data && apiData[0].data.length > 0) {
      const modes = apiData[0].data[0].paymentModes || [];
      setPaymentModes(modes);
      setIsLoading(false);
    }
  }, [apiData]);

  const handleChange = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : null);
  };

  const certifiedLogosStyle = {
    fontSize: '12px',
    color: '#0065FF',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    width: '100%',
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="card-view">
        <div className="mt-[10px] lg:hidden">
          <PaymentStepsOne />
        </div>

        <div className="payment-mob-view">
          <table className="w-full">
            <tbody>
              <tr>
                <td colSpan="2">
                  <img
                    className="source-logo"
                    src={apiData[0].data[0].logo}
                    alt={apiData[0].data[0].merchantName}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </td>
                <td colSpan="2">
                  <div className="paying-card-head">
                    <div className="flex items-center justify-end">
                      <p>
                        <span style={{ opacity: '40%' }}>Amount</span>
                        <div className="payment-accordion-head-amount">
                          <i className="text-xs">
                            <FontAwesomeIcon icon={faInr} />
                          </i>{' '}
                          {(+apiData[0].data[0].amount).toFixed(2)}
                        </div>
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="payment-accordion-box debit-card-box">
          <h4 className="my-4" style={{ fontWeight: '700', marginLeft: '10px', opacity: '60%' }}>
            Choose payment mode
          </h4>
          {/* <PaymentError style={{ marginBottom: '16px' }} /> */}

          {paymentModes.map((mode) => {
            switch (mode.id) {
              case 'card02':
                return (
                  <Accordion
                    key={mode.id}
                    expanded={expanded === mode.id}
                    onChange={handleChange(mode.id)}
                    className="shadow-none"
                  >
                    <AccordionSummary
                      expandIcon={
                        <FontAwesomeIcon icon={expanded === mode.id ? faMinus : faPlus} />
                      }
                      aria-controls={`panel-${mode.id}-content`}
                      id={`panel-${mode.id}-header`}
                    >
                      <Typography>
                        <ImageComponent name="creditCard" />
                        <span>Card</span>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CreditCard
                        secret={apiData.secret}
                        cardDownBanks={apiData.cardDownBanks}
                      />
                    </AccordionDetails>
                  </Accordion>
                );

              case 'NB01':
                return (
                  <Accordion
                    key={mode.id}
                    expanded={expanded === mode.id}
                    onChange={handleChange(mode.id)}
                    className="shadow-none"
                  >
                    <AccordionSummary
                      expandIcon={
                        <FontAwesomeIcon icon={expanded === mode.id ? faMinus : faPlus} />
                      }
                      aria-controls={`panel-${mode.id}-content`}
                      id={`panel-${mode.id}-header`}
                    >
                      <Typography>
                        <ImageComponent name="netbanking" />
                        <span>Netbanking</span>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Netbanking
                        payModesToPass={mode}
                        nbDownBanks={apiData.nbDownBanks}
                        apiData={apiData}
                      />
                    </AccordionDetails>
                  </Accordion>
                );

              case 'CC02':
                return (
                  <Accordion
                    key={mode.id}
                    expanded={expanded === mode.id}
                    onChange={handleChange(mode.id)}
                    className="shadow-none"
                  >
                    <AccordionSummary
                      expandIcon={
                        <FontAwesomeIcon icon={expanded === mode.id ? faMinus : faPlus} />
                      }
                      aria-controls={`panel-${mode.id}-content`}
                      id={`panel-${mode.id}-header`}
                    >
                      <Typography>
                        <ImageComponent name="creditCard" />
                        <span>Credit Card</span>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CreditCard
                        apiData={apiData}
                        secret={apiData.secret}
                        cardDownBanks={apiData.cardDownBanks}
                      />
                    </AccordionDetails>
                  </Accordion>
                );

              case 'DC02':
                return (
                  <Accordion
                    key={mode.id}
                    expanded={expanded === mode.id}
                    onChange={handleChange(mode.id)}
                    className="shadow-none"
                  >
                    <AccordionSummary
                      expandIcon={
                        <FontAwesomeIcon icon={expanded === mode.id ? faMinus : faPlus} />
                      }
                      aria-controls={`panel-${mode.id}-content`}
                      id={`panel-${mode.id}-header`}
                    >
                      <Typography>
                        <ImageComponent name="creditCard" />
                        <span>Debit Card</span>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <DebitCard
                        apiData={apiData}
                        secret={apiData.secret}
                        cardDownBanks={apiData.cardDownBanks}
                      />
                    </AccordionDetails>
                  </Accordion>
                );

              case 'UPI02':
                return (
                  <Accordion
                    key={mode.id}
                    expanded={expanded === mode.id}
                    onChange={handleChange(mode.id)}
                    className="shadow-none"
                  >
                    <AccordionSummary
                      expandIcon={
                        <FontAwesomeIcon icon={expanded === mode.id ? faMinus : faPlus} />
                      }
                      aria-controls={`panel-${mode.id}-content`}
                      id={`panel-${mode.id}-header`}
                    >
                      <Typography>
                        <ImageComponent name="UpiIcon" />
                        <span>UPI</span>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <UpiDetails apiData={apiData} />
                    </AccordionDetails>
                  </Accordion>
                );

              default:
                return null;
            }
          })}

          <planAccordion apiData={apiData}/>
        </div>

        <div style={certifiedLogosStyle} className="certified-logos hideSmall">
          <p className="left">
            <a
              href="https://www.policybazaar.com/legal-and-admin-policies/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            {'  |  '}
            <a
              href="https://www.policybazaar.com/legal-and-admin-policies/#termsofuse"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>
            {'  |  '}
            <a
              href="https://payment.policybazaar.com/pay/faq.jsp"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQ
            </a>
          </p>
          <p className="right rightOne">
            <a
              href="https://www.5tattva.com/verify/ftzdkix4sq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="./images/pci-dss-certified@2x.png"
                alt="PCI DSS Certified"
                width="84"
              />
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
