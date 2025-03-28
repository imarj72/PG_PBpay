import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Link,
} from "@mui/material";
import React, { useState, useEffect } from "react";

function Netbanking({ apiData, nbDownBanks }) {
  const [selectBankName, setBankName] = useState("");
  const [selectBankCode, setBankCode] = useState("");
  const [selectBankId, setBankId] = useState("");
  const [bankList, setBankList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [txnurl, setTxnUrl] = useState("");
  const [pgpayload, setPgPayload] = useState("");
  const [NBerror, setNBerror] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);

  useEffect(() => {
    if (apiData?.data) {
      const netBankingMethod = apiData.data.paymentModes?.find(
        (mode) => mode.name === "netbanking"
      );
      if (netBankingMethod) {
        setPopularList(netBankingMethod.popularInstruments || []);
        setBankList(Object.values(netBankingMethod.instruments || {}));
        setNextUrl(netBankingMethod.nextURL || null);
      }
    }
  }, [apiData]);

  const handleChange = (event) => {
    setNBerror(false);
    const selectedBankCode = event.target.value;
    const selectedBank = bankList.find(
      (bank) => bank.code === selectedBankCode
    );
    setBankName(selectedBank?.displayName ?? "");
    setBankCode(selectedBankCode);
    setBankId(selectedBank?.id);
  };

  useEffect(() => {
    if (selectBankCode) {
      const selectedBank = bankList.find(
        (bank) => bank.code === selectBankCode
      );
      setBankName(selectedBank?.displayName ?? "");
    }
    setNBerror(false);
  }, [selectBankCode, bankList]);

  const handlePayNow = async () => {
    if (!selectBankCode) {
      setNBerror(true);
      return;
    }

    setNBerror(false);

    try {
      const queryParams = new URLSearchParams(window.location.search);
      const sessionId = queryParams.get("sessionId");
      const response = await fetch(
        `http://localhost:8090/session/payment/pay/v1/makePayment?sessionId=${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              merchantId: apiData.data.merchantId,
              transactionId: apiData.data.transactionId,
              paymentMode: "NB",
              netBankingDetails: {
                bankId: selectBankId,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      if (nextUrl && !isLoadingMore) {
        setIsLoadingMore(true);
        fetch(nextUrl)
          .then((response) => response.json())
          .then((data) => {
            const newBanks = data.instruments || [];
            setBankList((prevBanks) => [...prevBanks, ...newBanks]);
            setNextUrl(data.nextURL || null);
            setIsLoadingMore(false);
          })
          .catch((err) => {
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
            <input
              key={index}
              type="hidden"
              id={key}
              name={key}
              value={pgpayload[key]}
            />
          ))}
        </form>
      )}

      {nbDownBanks && nbDownBanks.length > 0 ? (
        <div className="generalMsgInfo">
          <strong style={{ fontWeight: "bold", fontSize: "12px" }}>
            {nbDownBanks}
          </strong>{" "}
          {nbDownBanks.includes(",") ? "are" : "is"} currently facing some
          technical issues.
        </div>
      ) : null}

      <div className="card-details">
        <div className="card-detail-form">
          <h5>Select your Bank</h5>

          <div className="card-info">
            <ul>
              {popularList.map((bank, index) => (
                <li
                  key={index}
                  className={selectBankCode === bank.code ? "active" : ""}
                  onClick={() => {
                    setBankCode(bank.code);
                    setBankId(bank.id);
                    setBankName(bank.displayName);
                  }}
                >
                  <Link>
                    <img
                      src={bank.logo}
                      alt={bank.displayName}
                      className="bankLogo"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth className="form-control">
                <InputLabel id="demo-simple-select-label">
                  Select another bank
                </InputLabel>
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
                      style: { maxHeight: 150, overflowY: "auto" },
                    },
                  }}
                >
                  {bankList.map((bank) => (
                    <MenuItem key={bank.code} value={bank.code}>
                      {bank.displayName}
                    </MenuItem>
                  ))}
                  {isLoadingMore && (
                    <MenuItem disabled style={{ opacity: 0.6 }}>
                      Loading more banks...
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {NBerror && <p style={{ color: "red" }}>Please select a bank!</p>}

          <div className="mt-4">
            <Button
              variant="outlined"
              size="large"
              className="pay-now-btn"
              onClick={handlePayNow}
            >
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Netbanking;
