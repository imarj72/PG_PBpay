import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import CreditCard from '../paymentModes/components/CreditCard/CreditCard';
import DebitCard from '../paymentModes/components/DebitCard/DebitCard';
import Netbanking from '../paymentModes/components/NetBanking/Netbanking';
import UpiDetails from '../paymentModes/components/UPIpayment/UpiDetails';
import ImageComponent from '../shared/ImageComponent';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function PaymentTabs({ apiData }) {
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentModes, setPaymentModes] = useState([]);
    const [tabAnimating, setTabAnimating] = useState([]);
    const [showUPI, setShowUPI] = useState(false);

    useEffect(() => {
        if (apiData && apiData.data) {
            const dataBlock = apiData.data;
            if (dataBlock.paymentModes) {
                const modes = Object.values(dataBlock.paymentModes);
                const hasUPICollect = modes.some(mode => mode.name === 'UPI_COLLECT' || mode.name === 'upi_collect');
                const hasUPIQR = modes.some(mode => mode.name === 'UPI_QR' || mode.name === 'upi_qr');
                setShowUPI(hasUPICollect || hasUPIQR);
                const filteredModes = modes.filter(mode => !(mode.name === 'UPI_COLLECT' || mode.name === 'upi_collect' || mode.name === 'UPI_QR' || mode.name === 'upi_qr'));
                setPaymentModes(filteredModes);
                setTabAnimating(Array(filteredModes.length + (hasUPICollect || hasUPIQR ? 1 : 0)).fill(false));
            }
            setIsLoading(false);
        }
    }, [apiData]);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTabClick = (clickedIndex) => {
        setTabAnimating((prev) => {
            const updated = [...prev];
            updated[clickedIndex] = true;
            return updated;
        });

        setTimeout(() => {
            setTabAnimating((prev) => {
                const updated = [...prev];
                updated[clickedIndex] = false;
                return updated;
            });
        }, 2000);
    };

    const getImageSource = (modeName) => {
        switch (modeName) {
            case 'netbanking':
                return 'netbanking';
            case 'creditCard':
                return 'creditCard';
            case 'debitCard':
                return 'creditCard';
            case 'UPI_COLLECT':
            case 'UPI_QR':
            case 'upi': 
                return 'UpiIcon';
            default:
                return '/assets/default-mode.png';
        }
    };

    const getModeLabel = (modeName) => {
        switch (modeName) {
            case 'netbanking':
                return 'Net Banking';
            case 'creditCard':
                return 'Credit Card';
            case 'debitCard':
                return 'Debit Card';
            case 'UPI_COLLECT':
            case 'UPI_QR':
            case 'upi': 
                return 'UPI';
            default:
                return 'Other';
        }
    };

    const getTabLabel = (modeName, index) => {
        if (tabAnimating[index]) {
            return (
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '@keyframes popoutRight': {
                            '0%': {
                                transform: 'scale(0) translateX(0)',
                                opacity: 1,
                            },
                            '90%': {
                                transform: 'scale(1.5) translateX(0)',
                                opacity: 0.8,
                            },
                            '100%': {
                                transform: 'scale(2) translateX(180px)',
                                opacity: 0,
                            },
                        },
                        animation: 'popoutRight 2s forwards',
                        overflow: 'hidden',
                    }}
                >
                    <ImageComponent
                        name={getImageSource(modeName)}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            );
        }
        return getModeLabel(modeName);
    };

    const renderTabContent = (mode) => {
        switch (mode.name) {
            case 'netbanking':
                return <Netbanking apiData={apiData} />;
            case 'creditCard':
                return <CreditCard apiData={apiData} />;
            case 'debitCard':
                return <DebitCard apiData={apiData} />;
            default:
                return null;
        }
    };

    return (
        <>
            {isLoading ? (
                <Skeleton animation="wave" className="md:block" height={600} variant="text" />
            ) : (
                <div className="hidden md:block">
                    <Box className="mode-five" sx={{ flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', height: '100%' }}>
                            <Tabs
                                orientation="vertical"
                                value={value}
                                onChange={handleTabChange}
                                aria-label="Payment Modes"
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                                className="tabs-container left-sidebar"
                            >
                                {paymentModes.map((mode, index) => (
                                    <Tab
                                        key={mode.id}
                                        label={getTabLabel(mode.name, index)}
                                        {...a11yProps(index)}
                                        className={`tabs-left ${mode.name.toLowerCase()}`}
                                        onClick={() => handleTabClick(index)}
                                        sx={{
                                            minHeight: 64,
                                            maxHeight: 64,
                                        }}
                                    />
                                ))}
                                {showUPI && (
                                    <Tab
                                        key="upi"
                                        label={getTabLabel('upi', paymentModes.length)} 
                                        {...a11yProps(paymentModes.length)}
                                        className="tabs-left upi"
                                        onClick={() => handleTabClick(paymentModes.length)}
                                        sx={{
                                            minHeight: 64,
                                            maxHeight: 64,
                                        }}
                                    />
                                )}
                            </Tabs>

                            {paymentModes.map((mode, index) => (
                                <TabPanel key={mode.id} className="tabs" value={value} index={index}>
                                    {renderTabContent(mode)}
                                </TabPanel>
                            ))}
                            {showUPI && (
                                <TabPanel key="upi" className="tabs" value={value} index={paymentModes.length}>
                                    <UpiDetails apiData={apiData} />
                                </TabPanel>
                            )}
                        </Box>
                    </Box>
                </div>
            )}
        </>
    );
}