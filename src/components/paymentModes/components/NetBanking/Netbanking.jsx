import { Grid, FormControl, InputLabel, MenuItem, Select, Button, Link } from '@mui/material';
import React, { useState, useEffect } from 'react';

const apiData = [
  {
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
        sessionExpiryTime: 1741259018000,
        logo: "https://www.coursemonster.com/assest/images/brand/google-logo.png",
        paymentModes: [
          {
            id: "NB01",
            name: "netbanking",
            displayName: "Net Banking",
            nextUrl: "https://example.com/api/nextBanks?page=2",
            order: 0,
            popularInstruments: [
              {
                id: "HDFC01",
                name: "HDFC",
                displayName: "HDFC Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
                code: "xax11"
              },
              {
                id: "AXIS02",
                name: "AXIS",
                displayName: "AXIS Net Banking",
                logo: "https://www.axisbank.com/assets/images/logo.png",
                code: "Axq1"
              },
              {
                id: "SBI03",
                name: "SBI",
                displayName: "SBI Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
                code: "sbix1"
              },
              {
                id: "KOTAK04",
                name: "KOTAK",
                displayName: "Kotak Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
                code: "kotakx1"
              }
            ],
            instruments: [
              {
                id: "HDFC01",
                name: "HDFC",
                displayName: "HDFC Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
                code: "xax11"
              },
              {
                id: "AXIS02",
                name: "AXIS",
                displayName: "AXIS Net Banking",
                logo: "https://www.axisbank.com/assets/images/logo.png",
                code: "Axq1"
              },
              {
                id: "SBI03",
                name: "SBI",
                displayName: "SBI Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
                code: "sbix1"
              },
              {
                id: "KOTAK04",
                name: "KOTAK",
                displayName: "Kotak Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/en/3/39/Kotak_Mahindra_Group_logo.svg",
                code: "kotakx1"
              },
              {
                id: "PNB05",
                name: "PNB",
                displayName: "PNB Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Punjab_National_Bank_new_logo.svg",
                code: "pnbx1"
              },
              {
                id: "BOB04",
                name: "BANKOFBARODA",
                displayName: "Bank of Baroda Net Banking",
                logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/BankOfBarodaLogo.svg",
                code: "BOBx1"
              }
            ]
          },
          {
            id: "CC02",
            name: "creditCard",
            displayName: "Credit Card",
            order: 2,
            popularInstruments: [],
            instruments: []
          },
          {
            id: "DC02",
            name: "debitCard",
            displayName: "Debit Card",
            order: 3,
            popularInstruments: [],
            instruments: []
          },
          {
            id: "UPI02",
            name: "upi",
            displayName: "UPI",
            order: 4,
            popularInstruments: [],
            instruments: []
          }
        ],
        primaryColorHex: "#FFFFFF",
        transactionId: "TXID1740724534700101618453",
        merchantName: "Test Merchant",
        extraFields: ["test1", "test2"]
      }
    ],
    timestamp: "2025-02-28T06:36:28.097814500"
  }
];

const nextBanksResponse = {
  instruments: [
    {
      id: "test",
      name: "ICICI",
      displayName: "nextURL Net Banking",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/ICICI_Bank_logo.svg",
      code: "icicix1"
    },
    {
      id: "test",
      name: "YESBANK",
      displayName: "nextURL Net Banking",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Yes_Bank_logo.svg",
      code: "yesx1"
    }
  ]
};

function simulateFetch(url) {
  console.log("fetch for URL:", url);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === "https://example.com/api/nextBanks?page=2") {
        resolve({
          json: () => Promise.resolve(nextBanksResponse)
        });
      } else if (url === "https://example.com/api/nextBanks?page=3") {
        resolve({
          json: () => Promise.resolve({ instruments: [] })
        });
      } else {
        reject(new Error("nextURL not found"));
      }
    }, 1000);
  });
}

function Netbanking({ nbDownBanks }) {
  const [selectBankName, setBankName] = useState('');
  const [selectBankCode, setBankCode] = useState('');
  const [bankList, setBankList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [txnurl, setTxnUrl] = useState('');
  const [pgpayload, setPgPayload] = useState('');
  const [codeList, setCodeList] = useState('');
  const [NBerror, setNBerror] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [downNBbanks, setDownNBbanks] = useState('');

  const [nextUrl, setNextUrl] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (apiData && apiData.length > 0 && apiData[0].data && apiData[0].data.length > 0) {
      const paymentModes = apiData[0].data[0].paymentModes;
      const netBankingMethod = paymentModes.find(method => method.id === 'NB01');
      if (netBankingMethod) {
        setPopularList(netBankingMethod.popularInstruments || []);
        setBankList(netBankingMethod.instruments || []);
        const bankcodes = (netBankingMethod.instruments || []).map(item => item.code);
        setCodeList(bankcodes);
        setNextUrl(netBankingMethod.nextUrl || null);
      }
    }
  }, [apiData]);

  const handleChange = (event) => {
    setNBerror(false);
    const selectedBankCode =event.target.value;
    const selectedBank = bankList.find(bank => bank.code === selectedBankCode);
    setBankName(selectedBank?.displayName ?? '');
    setBankCode(selectedBankCode);
  };

  useEffect(() => {
    if (selectBankCode) {
      const selectedBank = bankList.find(bank => bank.code === selectBankCode);
      setBankName(selectedBank?.displayName ?? ''); 
    }
    setNBerror(false);
  }, [selectBankCode, bankList]);

  const handlePayNow = async () => {
    if (selectBankCode) {
      setShowLoader(true);
      const queryParameters = new URLSearchParams(window.location.search);
      const order = queryParameters.get("orderNo");
      const mode = "NB";

      try {
        const response = await fetch('/pay/securePayment/process/paymentui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNo: order,
            mode: mode,
            nbCode: selectBankCode
          })
        });
        const data = await response.json();

        if (data.as === 1) {
          if (data.pgPayload.form) {
            const formHtml = data.pgPayload.form;
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = formHtml;
            const formElement = tempContainer.querySelector('form');
            document.body.appendChild(formElement);
            formElement.submit();
          } else if (data.txnURL) {
            setTxnUrl(data.txnURL);
            setPgPayload(data.pgPayload);
            await new Promise(resolve => setTimeout(resolve, 1500));
            const form = document.getElementById('testForm');
            form.submit();
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      setNBerror(true);
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      if (nextUrl && !isLoadingMore) {
        setIsLoadingMore(true);
        simulateFetch(nextUrl)
          .then(response => response.json())
          .then(data => {
            const newBanks = data.instruments || [];
            setBankList(prevBanks => [...prevBanks, ...newBanks]);
            setNextUrl(data.nextUrl || null);
            setIsLoadingMore(false);
          })
          .catch(err => {
            console.error("Error fetching next bank list:", err);
            setIsLoadingMore(false);
          });
      }
    }
  };

  return (
    <>
      {pgpayload && (
        <form method="post" action={txnurl} id="testForm">
          {Object.keys(pgpayload).map((key, index) => (
            <input key={index} type="hidden" id={key} name={key} value={pgpayload[key]} />
          ))}
        </form>
      )}

      {nbDownBanks && nbDownBanks !== null && nbDownBanks.includes(',') && (
        <div className="generalMsgInfo">
          <strong style={{ fontWeight: 'bold', fontSize: '12px' }}>{nbDownBanks}</strong> are currently facing some technical issues.
        </div>
      )}

      {nbDownBanks && nbDownBanks !== null && !nbDownBanks.includes(',') && (
        <div className="generalMsgInfo">
          <strong style={{ fontWeight: 'bold', fontSize: '12px' }}>{nbDownBanks}</strong> is currently facing some technical issues.
        </div>
      )}

      <div className='card-details'>
        <div className='card-detail-form'>
          <h5>Select your Bank</h5>

          <div className='card-info'>
            <ul>
              {popularList.map((bank, index) => (
                <li
                  key={index}
                  className={selectBankCode === bank.code ? 'active' : ''}
                  onClick={() => {
                    setBankCode(bank.code);
                    setBankName(bank.displayName);
                  }}
                >
                  <Link>
                    <img src={bank.logo} alt={bank.displayName} className="bankLogo" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth className='form-control'>
                <InputLabel id="demo-simple-select-label">Select another bank</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectBankCode}
                  label="Bank Name"
                  onChange={handleChange}
                  error={NBerror}
                  MenuProps={{
                    MenuListProps: {
                      onScroll: handleScroll,
                      style: { maxHeight: 150, overflowY: 'auto' }
                    }
                  }}
                >
                  {bankList.map((bank) => (
                    <MenuItem key={bank.code} value={bank.code}>
                      {bank.displayName}
                    </MenuItem>
                  ))}
                  {isLoadingMore && (
                    <MenuItem disabled style={{opacity:0.6}}>
                      Loading more banks....
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {NBerror && (
            <p style={{ color: 'red' }}>Please select a bank!</p>
          )}
          <div className="mt-4">
            <Button variant="outlined" size="large" className='pay-now-btn' onClick={handlePayNow}>
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Netbanking;
