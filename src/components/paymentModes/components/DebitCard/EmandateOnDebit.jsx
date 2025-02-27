import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AutoPayonAccount from'./AutopayOnAccount';
import AutoPayoncard from '../NetBanking/AutoPayoncard';

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
        <Box sx={{ p: 0 }}>
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

export default function EmandateOnDebit({payModesToPass, displayOrderNo, eMandateNo, maxAmountLimit, parentOrderNo, order_id, cust_id, mid, expire_at,sidcBankNote,secret , cardDownBanks, productId, srcSupplierId, displayMode, orderNo}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className='emadate-debit-card emandate-tabs-width'>
        <Tabs
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="tabs example"
            TabIndicatorProps={{
            style: {
                backgroundColor: "transparent"
            }
            }}
        >
            <Tab label="Autopay on Card" {...a11yProps(0)} />
            <Tab label="Autopay on Account" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
           <AutoPayoncard sidcBankNote={sidcBankNote} payModesToPass={payModesToPass} secret={secret} cardDownBanks = {cardDownBanks}
                  productId = {productId} srcSupplierId = {srcSupplierId} displayMode = {displayMode} displayOrderNo={displayOrderNo}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <AutoPayonAccount payModesToPass={payModesToPass} displayOrderNo={displayOrderNo} eMandateNo={eMandateNo}
                   maxAmountLimit={maxAmountLimit} parentOrderNo={parentOrderNo} order_id={order_id} cust_id={cust_id} mid={mid}
                   expire_at={expire_at} orderNo={orderNo} productId = {productId}/>
        </TabPanel>
    </div>
  );
}
