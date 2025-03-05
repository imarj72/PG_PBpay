import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faInr, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import Dialog from '@mui/material/Dialog';
import { Button, Link } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const apiData = {
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
            sessionExpiryTime: 1740725434928,
            logo: "https://www.coursemonster.com/assest/images/brand/google-logo.png",
            paymentModes: [
                {
                    id: "NB01",
                    name: "netbanking",
                    displayName: "Net Banking",
                    nextURL: "https://www.google.com",
                    order: 0,
                    polpularInstruments: [
                        {
                            id: "HDFC01",
                            name: "HDFC",
                            dislayName: "HDFC Net Banking",
                            logo: "https://www.hdfcbank.com/assets/images/logo.png",
                            code: "xax11"
                        },
                        {
                            id: "AXIS02",
                            name: "AXIS",
                            dislayName: "AXIS Net Banking",
                            logo: "https://www.axisbank.com/assets/images/logo.png",
                            code: "Axq1"
                        }
                    ],
                    instruments: [
                        {
                            id: "HDFC01",
                            name: "HDFC",
                            dislayName: "HDFC Net Banking",
                            logo: "https://www.hdfcbank.com/assets/images/logo.png",
                            code: "xax11"
                        },
                        {
                            id: "AXIS02",
                            name: "AXIS",
                            dislayName: "AXIS Net Banking",
                            logo: "https://www.axisbank.com/assets/images/logo.png",
                            code: "Axq1"
                        }
                    ]
                },
                {
                    id: "card02",
                    name: "card",
                    displayName: "Card",
                    nextURL: "https://www.google.com",
                    order: 1,
                    polpularInstruments: [
                        {
                            id: "Debit",
                            name: "HDFC",
                            dislayName: "Debit card",
                            logo: null,
                            code: null
                        },
                        {
                            id: "credit",
                            name: "AXIS",
                            dislayName: "credit card",
                            logo: null,
                            code: null
                        }
                    ],
                    instruments: [
                        {
                            id: "Debit",
                            name: "HDFC",
                            dislayName: "Debit card",
                            logo: null,
                            code: null
                        },
                        {
                            id: "credit",
                            name: "AXIS",
                            dislayName: "credit card",
                            logo: null,
                            code: null
                        }
                    ]
                }
            ],
            primaryColorHex: "#FFFFFF",
            transactionId: "TXID1740724534700101618453",
            merchantName: "Test Merchant",
            extraFields: ["test1", "test2"]
        }
    ],
    timestamp: "2025-02-28T06:36:28.097814500"
};

export default function PlanAccordion() {
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    const [expandedPanel, setExpandedPanel] = useState(null);

    useEffect(() => {
        // setTimeout(() => setIsLoading(false), 500);

        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 820);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //   if (isLoading) {
    //     return <Skeleton animation="wave" className="card-view" height={600} variant="text" />;
    //   }

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : null);
    };

    return (
        <div>
            <div className="card-view">
                <div className="plan-details-view">
                    <div className="plan-detail-header">
                        <div>
                            <p>Order Number</p>
                        </div>
                        <div>
                            <p>{apiData.data[0].orderId}</p>
                        </div>
                    </div>

                    <div className="plan-detail-table">
                        {!isMobileView && (
                            <table className="w-full ">
                                {apiData.data.map((merchant, index) => (
                                    <tr key={index}>
                                        <td colSpan="2">
                                            <img
                                                className="source-logo"
                                                src={
                                                    /^https?:\/\//i.test(merchant.logo)
                                                        ? merchant.logo
                                                        : `./images/${merchant.logo}`
                                                }
                                                alt={merchant.merchantName}
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </td>
                                        <td colSpan="2">
                                            <div className="paying-card-head">
                                                <span>Amount</span>
                                                <strong className="block">
                                                    <i className="text-xs">
                                                        <FontAwesomeIcon icon={faInr} />
                                                    </i>{' '}
                                                    {(+merchant.amount).toFixed(2)}
                                                </strong>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        )}
                    </div>

                    <table className="w-full">
                        {!isMobileView && (
                            <div>
                                <tr className="flex w-full">
                                    <td colSpan="2">
                                        <p>Total Amount</p>
                                    </td>
                                    <td colSpan="2">
                                        <strong className="block">
                                            <i className="text-xs">
                                                <FontAwesomeIcon icon={faInr} />
                                            </i>{' '}
                                            {(+apiData.data[0].amount).toFixed(2)}
                                        </strong>
                                    </td>
                                </tr>
                            </div>
                        )}

                        {isMobileView && (
                            <div>
                                <tr className="totalAmount-mob flex w-full">
                                    <td colSpan="2">
                                        <p style={{ fontSize: '14px' }}>Total Amount</p>
                                    </td>
                                    <td colSpan="2">
                                        <p
                                            className="block"
                                            style={{ fontSize: '14px', fontWeight: '700', opacity: '100%' }}
                                        >
                                            <i className="text-xs" style={{ fontSize: '14px' }}>
                                                <FontAwesomeIcon icon={faInr} />
                                            </i>{' '}
                                            {(+apiData.data[0].amount).toFixed(2)}
                                        </p>
                                    </td>
                                </tr>
                            </div>
                        )}
                    </table>
                </div>
            </div>

            <Accordion
                expanded={expandedPanel === 'orderDetailsPanel'}
                onChange={handleAccordionChange('orderDetailsPanel')}
                className="shadow-none plan-detail-accodion"
                sx={{
                    boxShadow: 'none',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    '&:before': {
                        display: 'none',
                    },
                    marginTop:'20px'

                }}
      >
            <AccordionSummary
                expandIcon={
                    <FontAwesomeIcon
                        icon={expandedPanel === 'orderDetailsPanel' ? faMinus : faPlus}
                    />
                }
                aria-controls="order-details-content"
                id="order-details-header"
            >
                <Typography variant="h7" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                    Order Details
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div className="plan-details-view plan-details-box">
                    {apiData.data.map((order, index) => (
                        <div key={index}>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td colSpan="2">
                                            <p>Order Id:</p>
                                        </td>
                                        <td colSpan="2">
                                            <strong className="block">{order.orderId}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <p>Merchant ID:</p>
                                        </td>
                                        <td colSpan="2">
                                            <strong className="block">{order.merchantId}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <p>Merchant Name:</p>
                                        </td>
                                        <td colSpan="2">
                                            <strong className="block">{order.merchantName}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <p>Amount:</p>
                                        </td>
                                        <td colSpan="2">
                                            <strong className="block">
                                                <i className="text-xs">
                                                    <FontAwesomeIcon icon={faInr} />
                                                </i>{' '}
                                                {(+order.amount).toFixed(2)}
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {index < apiData.data.length - 1 && <hr />}
                        </div>
                    ))}
                </div>
            </AccordionDetails>
        </Accordion>
    </div >
  );
}
