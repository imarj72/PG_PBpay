import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CreditCardRecurring from '../PaymentMode/Components/CreditCard/CreditCardRecurring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBank, faCreditCard, faWallet } from '@fortawesome/free-solid-svg-icons';
import Skeleton from '@mui/material/Skeleton'; 
import AadharRecurring from '../PaymentMode/Components/Aadhar/AadharRecurring';
import NetbankingRecurring from '../PaymentMode/Components/NetBanking/NetBankingRecurring';
import EmandateOnDebit from '../PaymentMode/Components/DebitCard/EmandateOnDebit';
import UpiDetailsRecurring from '../PaymentMode/Components/UpiPayments/UpiDetailsRecurring';


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
          <Typography>{children}</Typography>
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

export default function PaymentTabsRecurring() {

  const [value, setValue] = React.useState(0);
  const [payModes, setPayModes] = useState([]);
  const [payModesToPass, setPayModesToPass] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eligibleModes , setEligibleModes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParameters = new URLSearchParams(window.location.search);
        const order = queryParameters.get("orderNo");
        const var1  = queryParameters.get("var1");
        const var2  = queryParameters.get("var2");
        const temp = { orderNo: order };

        const response = await fetch(`/pay/securePayment/details/paymentModes?var1=${var1}&var2=${var2}&isRecurring=true`, {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(temp),
        });

        const data = await response.json();
        setApiData(data);
        setIsLoading(false);
        const extractedPayModes = data.beans.payModes;
        const codeList = extractedPayModes.map(method => method.code);
        setPayModes(codeList);
        setPayModesToPass(data.beans.payModes);
        setEligibleModes(data.eligibleModes);
        console.log(extractedPayModes);
      } catch (error) {
        console.error('API request error:', error);
      }
    };

     if (!apiData) {
      fetchData();
    }
  }, []);


useEffect(() => {
    
    if (eligibleModes.length > 0) {
        console.log('dasdj'+eligibleModes);
        console.log('dasdj'+apiData.defaultMode);
      if(apiData.defaultMode){
        for (let i = 0; i < eligibleModes.length; i++) {
          if(eligibleModes[i].code === apiData.defaultMode){
            setValue(i);
            break;
          }
        }
        
      }
    }
  }, [eligibleModes , apiData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 return (
  <>
    
    {isLoading ? (
   
     <div>
              <Skeleton animation="wave" className="md:block" height={600} variant="text"/>
             
              {/* Add more skeleton components as needed */}
            </div>
    ) : (
       
      
      <div className="hidden md:block">
        <Box sx={{ flexGrow: 1, display: 'flex', height: "100%" }}>
          <Tabs
            orientation="vertical"
            // variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
            className='tabs-container left-sidebar'
          >
          {eligibleModes.map((mode, index) => {
            switch(mode.code){
              case 'SI_CC':
                return ( <Tab className="tabs-left credit-card" label="Credit Card" {...a11yProps({index})} />);
              case 'EMANDATE_NB':
                 return ( <Tab className="tabs-left net-banking" label="NetBanking" {...a11yProps({index})} />);
              case 'EMANDATE_ADHR':
                 return ( <Tab className="tabs-left pos" label="Aadhar Card" {...a11yProps({index})} />);
                break;
              case 'RECURRING_DC':
                 return ( <Tab className="tabs-left credit-card" label="Debit Card" {...a11yProps({index})} />);
                break;
              case 'UPI_EMANDATE':
                return (<Tab className="tabs-left upi" label="UPI Emandate" {...a11yProps({index})} />);
                break;
              default:
                break;
            }
          })}
          </Tabs>
          {eligibleModes.map((mode, index) => {
            switch(mode.code){
              case 'SI_CC':
                return (<TabPanel className="tabs" value={value} index={index}>
                          <CreditCardRecurring  secret={apiData.secret} cardDownBanks = {apiData.cardDownBanks}
                            productId = {apiData.productId} srcSupplierId = {apiData.srcSupplierId} displayMode = {apiData.displayMode}/>
                        </TabPanel>);
                break;
              case 'EMANDATE_NB':
                return (<TabPanel className="tabs" value={value} index={index}>
                  <NetbankingRecurring payModesToPass={payModesToPass} displayOrderNo={apiData.encryptParentOrderNo} eMandateNo={apiData.eMandateNo}
                                     maxAmountLimit={apiData.maxAmountLimit} parentOrderNo={apiData.parentOrderNo} order_id={apiData.order_id} cust_id={apiData.cust_id} mid={apiData.mid}
                                     expire_at={apiData.expire_at} orderNo={apiData.orderNo} productId = {apiData.productId} />
                </TabPanel>);
                break;
               case 'EMANDATE_ADHR':
                  return (<TabPanel className="tabs" value={value} index={index}>
                            <AadharRecurring payModesToPass={payModesToPass} displayOrderNo={apiData.encryptParentOrderNo} eMandateNo={apiData.eMandateNo}
                               maxAmountLimit={apiData.maxAmountLimit} parentOrderNo={apiData.parentOrderNo} order_id={apiData.order_id} cust_id={apiData.cust_id} mid={apiData.mid}
                               expire_at={apiData.expire_at} orderNo={apiData.orderNo}  productId = {apiData.productId}/>
                          </TabPanel>);
                  break;
              case 'RECURRING_DC':
                  return (<TabPanel className="tabs" value={value} index={index}>
                             <EmandateOnDebit payModesToPass={payModesToPass} displayOrderNo={apiData.displayOrderNo} eMandateNo={apiData.eMandateNo}
                                 maxAmountLimit={apiData.maxAmountLimit} parentOrderNo={apiData.parentOrderNo} order_id={apiData.order_id} cust_id={apiData.cust_id} mid={apiData.mid}
                                 expire_at={apiData.expire_at} sidcBankNote={apiData.sidcBankNote} secret={apiData.secret} cardDownBanks = {apiData.cardDownBanks}
                                 productId = {apiData.productId} srcSupplierId = {apiData.srcSupplierId} displayMode = {apiData.displayMode} orderNo={apiData.orderNo} />
                          </TabPanel>);
                  break;
              case 'UPI_EMANDATE':
                return (<TabPanel className="tabs" value={value} index={index}>
                          <UpiDetailsRecurring payMode={apiData.eligibleModes[index]} 
                          productId = {apiData.productId} txAmount = {apiData.amount}
                          showEmanQrCode = {apiData.showEmanQrCode}/>
                         </TabPanel>); 
              default:
                break; 
            }
          })}
          
            
        </Box>
      </div>
      
    )}
  </>
);
}
