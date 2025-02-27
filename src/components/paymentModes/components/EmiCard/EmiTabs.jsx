import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Box, Grid, TextField, Button, FormControlLabel, FormGroup, Checkbox, FormControl, Select, MenuItem, InputLabel, Link } from '@mui/material';
// import Loader from '../../Components/loader';
import CardlessEmiDetails from '../../childComponent/CardlessEmiDetails';
import EmiCreditCardDetails from '../../childComponent/EmiCreditCardDetails';
import EmiDebitCardDetails from '../../childComponent/EMiDebitCardDetails';
import EmiTable from '../../commonDetails/EmiTable';
const mockApiData = {
  secret: 'someSecretKey',
  beans: {
    payModes: [
      {
        code: 'EMI',
        subPayModes: [
          { code: '21', name: 'HDFC Bank' },
          { code: '22', name: 'ICICI Bank' },
          { code: '48', name: 'SBI Bank' },
          {code:'32',name:'Kotak Mahindra'},
          {code:'39',name:'Punjab National Bank'},
          {code:'6', name:'Bank of Baroda'}
        ]
      },
      {
        code: 'EMI_DC',
        subPayModes: [
          { code: '21', name: 'HDFC Bank' },
          { code: '22', name: 'ICICI Bank' },
          {code:'48',name:'SBI Bank'},
          {code:'32',name:'Kotak Mahindra'},
        ]
      },
      {
        code: 'EMI_CARDLESS',
        subPayModes: [
          { code: '241', name: 'ShopSe' },
          { code: '236', name: 'Axio' },
          { code: '80', name: 'Bajaj Finserv' },
          { code: '232', name: 'Early Salary' },
          { code: '242', name: 'Paytm Postpaid' }
        ]
      }
    ]
  },
  amount: 5000,
  displayOrderNo: '12345678'
};
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function EmiTabs({ apiData }) {

  const data = apiData || mockApiData;

  const [selectBankName, setBankName] = useState('');
  const [bankList, setBankList] = useState(null);
  const [DCbankList, setDCBankList] = useState(null);
  const [selectBankCode, setBankCode] = useState('');
  const [selectDCBankCode, setDCBankCode] = useState('');
  const [value, setValue] = useState(0);
  const [codeList, setCodeList] = useState('');
  const [DCcodeList, setDCcodeList] = useState('');
  const [cardlessBankList, setCardlessBankList] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showBanks, setShowBanks] = useState(true);
  const [showCCCardForm, setShowCardForm] = useState(false);
  const [showDCCardForm, setShowDCCardForm] = useState(false);
  const [NBerror, setNBerror] = useState(false);
  const [showEmiTable, setShowEmitable] = useState(false);
  const [mode, setMode] = useState('');
  const [bankId, setBankId] = useState('');
  const [selectEmiCode, setSelectEmiCode] = useState('');

  const handleBankCodeSelection = (bankCode) => {
    setSelectEmiCode(bankCode);
    console.log('Selected Bank Code:', bankCode);
  };

  let secret = data.secret;
  const cardlessMode = 'EMI_CARDLESS';

  useEffect(() => {
    if (data) {
      const payModesToPass = data.beans.payModes;
      const subPayModeCC = payModesToPass.find((method) => method.code === 'EMI');
      const subPayModeDC = payModesToPass.find((method) => method.code === 'EMI_DC');
      const subPayModeCardless = payModesToPass.find((method) => method.code === 'EMI_CARDLESS');
      const EMIBanks = subPayModeCC ? subPayModeCC.subPayModes : null;
      const DCBanks = subPayModeDC ? subPayModeDC.subPayModes : null;
      const cardLess = subPayModeCardless ? subPayModeCardless.subPayModes : null;

      setBankList(EMIBanks);
      setDCBankList(DCBanks);
      setCardlessBankList(cardLess);

      var bankcodes = [];
      var DCbankcodes = [];
      var cardlessCode = [];
      if (EMIBanks) {
        EMIBanks.forEach(function (item) {
          bankcodes.push(item.code);
        });
        setCodeList(bankcodes);
      }
      if (DCBanks) {
        DCBanks.forEach(function (item) {
          DCbankcodes.push(item.code);
        });
        setDCcodeList(DCbankcodes);
      }
      if (cardLess) {
        cardLess.forEach(function (item) {
          cardlessCode.push(item.code);
        });
        setCardlessBankList(cardlessCode);
      }
    }
  }, [data]); 

  useEffect(() => {
    if (selectBankCode > 0) {
      setNBerror(false);
      setShowEmitable(true);
      setMode('EMI');
    }
  }, [selectBankCode]);

  useEffect(() => {
    if (selectDCBankCode > 0) {
      setNBerror(false);
      setShowEmitable(true);
      setMode('EMI_DC');
    }
  }, [selectDCBankCode]);

  const EMIhandleChange = (event) => {
    setSelectEmiCode('');
    const selectedBankCode = event.target.value;
    setBankCode(selectedBankCode);
    setShowEmitable(true);
    setMode('EMI');
  };

  const handleCloseDialog = () => {
    setMode('EMI');
    setShowBanks(true);
    setShowEmitable(true);
    setShowCardForm(false);
  };

  const handleDCCloseDialog = () => {
    setMode('EMI_DC');
    setShowBanks(true);
    setShowEmitable(true);
    setShowDCCardForm(false);
  };

  const DCEMIhandleChange = (event) => {
    setSelectEmiCode('');
    const selectedBankCode = event.target.value;
    setDCBankCode(selectedBankCode);
    setShowEmitable(true);
    setMode('EMI_DC');
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleBankSelect = async () => {
    if (selectBankCode > 0 && selectEmiCode !== '') {
      setShowBanks(false);
      setShowEmitable(false);
      setShowCardForm(true);
      setMode('EMI_CC');
    } else {
      setNBerror(true);
    }
  };

  const handleDCBankSelect = async () => {
    if (selectDCBankCode > 0 && selectEmiCode !== '') {
      setShowBanks(false);
      setShowEmitable(false);
      setShowDCCardForm(true);
      setMode('EMI_DC');
    } else {
      setNBerror(true);
    }
  };

  const handleTabChange = async () => {
    setShowBanks(true);
    setShowEmitable(false);
    setShowCardForm(false);
    setShowDCCardForm(false);
    setBankCode('');
    setDCBankCode('');
  };

  const handleSelectChange = (event) => {
    setBankName(event.target.value);
    setBankId(event.target.value);
    console.log('Selected Bank:', event.target.value);
  };

  return (
    <>
      <div className="card-details">
        <div className="card-detail-form">
          <h5>Select an option</h5>
          <Box sx={{ width: '100%', textTransform:'capitalize' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
              <Tabs
                value={value}
                className="tab-header"
                variant="scrollable"
                onChange={handleChange}
                aria-label="scrollable auto tabs example"
                TabIndicatorProps={{
                  style: { display: 'none', position: 'unset'}
                }}
              >
                <Tab label="Credit Card" {...a11yProps(0)} onClick={handleTabChange}  sx={{textTransform:'capitalize',}}/>
                <Tab label="Debit Card" {...a11yProps(1)} onClick={handleTabChange} sx={{textTransform:'capitalize',}}/>
                <Tab label="Cardless EMI" {...a11yProps(2)} onClick={handleTabChange} sx={{textTransform:'capitalize',}}/>
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {showBanks && (
                <div>
                  <div className="card-info">
                    <ul>

                      {codeList && codeList.includes("21") && (
                        <li className={selectBankCode === '21' ? 'active' : ''} onClick={() => setBankCode('21')}>
                          <Link>
                            <img src="./images/hdfc.svg" alt="hdfc" /> <span>HDFC</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("22") && (
                        <li className={selectBankCode === '22' ? 'active' : ''} onClick={() => setBankCode('22')}>

                          <Link>
                            <img src="./images/icici.svg" alt="icici" /> <span>ICICI</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("48") && (
                        <li className={selectBankCode === '48' ? 'active' : ''} onClick={() => setBankCode('48')}>

                          <Link>
                            <img src="./images/sbi.svg" alt="SBI" /> <span>SBI</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("32") && (
                        <li className={selectBankCode === '32' ? 'active' : ''} onClick={() => setBankCode('32')}>

                          <Link>
                            <img src="./images/kotak_mahindra.svg" alt="Kotak Mahindra" /> <span>Kotak Mahindra</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("39") && (
                        <li className={selectBankCode === '39' ? 'active' : ''} onClick={() => setBankCode('39')}>

                          <Link>
                            <img src="./images/PNB.svg" alt="PNB" /> <span>Punjab National Bank</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("6") && (
                        <li className={selectBankCode === '6' ? 'active' : ''} onClick={() => setBankCode('6')}>

                          <Link>
                            <img src="./images/BOB.svg" alt="hdfc" /> <span>Bank of Baroda</span>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <FormControl fullWidth className="form-control">
                        <InputLabel id="demo-simple-select-label">Select another bank</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectBankCode}
                          label="Bank Name"
                          onChange={EMIhandleChange}
                        >
                          {bankList &&
                            bankList.map((bank, index) => (
                              <MenuItem key={index} value={bank.code}>
                                {bank.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {showEmiTable && (
                      <EmiTable
                        amountToBePaid={data.amount}
                        displayOrderNo={data.displayOrderNo}
                        mode={mode}
                        bankId={selectBankCode}
                        onBankCodeSelect={handleBankCodeSelection}
                        selectEmiCode={selectEmiCode}
                      />
                    )}
                    {NBerror && (
                      <p style={{ color: 'red', paddingTop: '10px', marginLeft: '27px' }}>
                        Please select valid bank and tenure!
                      </p>
                    )}
                    <Grid item md={12} xs={12}>
                      <Button variant="outlined" size="large" className="pay-now-btn" onClick={handleBankSelect}>
                        Continue
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              )}
              {showCCCardForm && (
                <EmiCreditCardDetails
                  secret={data.secret}
                  bankId={selectBankCode}
                  displayOrderNo={data.displayOrderNo}
                  selectEmiCode={selectEmiCode}
                  bankList={bankList}
                  handleCloseDialog={handleCloseDialog}
                />
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {showBanks && (
                <div>
                  <div className="card-info">
                    <ul>
                    {codeList && codeList.includes("21") && (
                        <li className={selectBankCode === '21' ? 'active' : ''} onClick={() => setDCBankCode('21')}>
                          <Link>
                            <img src="./images/hdfc.svg" alt="hdfc" /> <span>HDFC</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("22") && (
                        <li className={selectBankCode === '22' ? 'active' : ''} onClick={() => setDCBankCode('22')}>

                          <Link>
                            <img src="./images/icici.svg" alt="icici" /> <span>ICICI</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("48") && (
                        <li className={selectBankCode === '48' ? 'active' : ''} onClick={() => setDCBankCode('48')}>

                          <Link>
                            <img src="./images/sbi.svg" alt="SBi" /> <span>SBI</span>
                          </Link>
                        </li>
                      )}
                      {codeList && codeList.includes("32") && (
                        <li className={selectBankCode === '32' ? 'active' : ''} onClick={() => setBankCode('32')}>

                          <Link>
                            <img src="./images/kotak_mahindra.svg" alt="Kotak Mahindra" /> <span>Kotak Mahindra</span>
                          </Link>
                        </li>
                      )}
                     
                    </ul>
                  </div>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <FormControl fullWidth className="form-control">
                        <InputLabel id="demo-simple-select-label">Select another bank</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectDCBankCode}
                          label="Bank Name"
                          onChange={DCEMIhandleChange}
                        >
                          {DCbankList &&
                            DCbankList.map((bank, index) => (
                              <MenuItem key={index} value={bank.code}>
                                {bank.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {showEmiTable && (
                      <EmiTable
                        amountToBePaid={data.amount}
                        displayOrderNo={data.displayOrderNo}
                        mode={mode}
                        bankId={selectDCBankCode}
                        onBankCodeSelect={handleBankCodeSelection}
                        selectEmiCode={selectEmiCode}
                      />
                    )}
                    {NBerror && (
                      <p style={{ color: 'red', paddingTop: '10px', marginLeft: '27px' }}>
                        Please select valid bank and tenure!
                      </p>
                    )}
                    <Grid item md={12} xs={12}>
                      <Button variant="outlined" size="large" className="pay-now-btn" onClick={handleDCBankSelect}>
                        Continue
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              )}
              {showDCCardForm && (
                <EmiDebitCardDetails
                  secret={data.secret}
                  bankId={selectDCBankCode}
                  displayOrderNo={data.displayOrderNo}
                  selectEmiCode={selectEmiCode}
                  DCbankList={DCbankList}
                  handleDCCloseDialog={handleDCCloseDialog}
                  amount={data.amount}
                />
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <CardlessEmiDetails
                cardlessBankList={cardlessBankList}
                mode={cardlessMode}
                secret={data.secret}
                amountToBePaid={data.amount}
              />
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </>
  );
}
