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
  // Track animating state for each tab
  const [tabAnimating, setTabAnimating] = useState([]);

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const dataBlock = apiData[0].data?.[0];
      if (dataBlock && dataBlock.paymentModes) {
        setPaymentModes(dataBlock.paymentModes);
        setTabAnimating(Array(dataBlock.paymentModes.length).fill(false));
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
      case 'card':
      case 'creditCard':
        return 'creditCard';
      case 'debitCard':
        return 'creditCard';
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
      case 'card':
        return 'Card';
      case 'creditCard':
        return 'Credit Card';
      case 'debitCard':
        return 'Debit Card';
      case 'upi':
        return 'UPI';
      default:
        return 'Other';
    }
  };


  const getTabLabel = (mode, index) => {
    if (tabAnimating[index]) {
      return (
        <Box
          sx={{
            width: 40,
            height: 40,
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
            name={getImageSource(mode.name)}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      );
    }
    return getModeLabel(mode.name);
  };

  const renderTabContent = (mode, index) => {
    const isAnimating = tabAnimating[index] && value === index;

    let content = null;
    if (mode.name === 'netbanking') {
      content = <Netbanking apiData={apiData} nbDownBanks={[]} />;
    } else if (mode.name === 'creditCard') {
      content = <CreditCard apiData={apiData} />;
    } else if (mode.name === 'debitCard') {
      content = <DebitCard apiData={apiData} />;
    } else if (mode.name === 'upi') {
      content = <UpiDetails apiData={apiData} />;
    } else if (mode.name === 'card') {
      content = <CreditCard apiData={apiData} />;
    }

    return (
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ visibility: isAnimating ? 'hidden' : 'visible' }}>
          {content}
        </Box>

        {isAnimating && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              backgroundColor: '#fff', 
            }}
          >
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: 2 }}
            />
          </Box>
        )}
      </Box>
    );
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
                    label={getTabLabel(mode, index)}
                    {...a11yProps(index)}
                    className={`tabs-left ${mode.name.toLowerCase()}`}
                    onClick={() => handleTabClick(index)}
                    sx={{
                      minHeight: 64,
                      maxHeight: 64,
                    }}
                  />
                ))}
              </Tabs>

              {paymentModes.map((mode, index) => (
                <TabPanel key={mode.id} className="tabs" value={value} index={index}>
                  {renderTabContent(mode, index)}
                </TabPanel>
              ))}
            </Box>
          </Box>
        </div>
      )}
    </>
  );
}
