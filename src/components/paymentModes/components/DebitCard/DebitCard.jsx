import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  TextField,
  InputAdornment,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CardValidator from "../../cardValidator";
import CustomizedDialogs from "../../../shared/CustomDialogs";
import VisaMasterInfo from "../../childComponent/VisaMasterInfo";
// import Loader from '../../Components/loader';
import MasterCardRupayForm from "../../MasterCardRupayForm";

function DebitCard({ apiData, cardDownBanks }) {
  const [showVisaNetwork, setVisaNetwork] = useState(false);
  const [expiryMonthYear, setExpiryMonthYear] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expity, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(
    "../../../../../public/images/master_cvv.svg"
  );
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardCVVError, setCardCVVError] = useState("");
  const [cardExpiryError, setCardExpiryError] = useState("");
  const [showCardNameError, setshowCardNameError] = useState(false);
  const [cardNameError, setCardNameError] = useState(
    "As mentioned on your Debit Card"
  );
  const [txnurl, settxnurl] = useState("");
  const [pgpayload, setpgpayload] = useState("");
  const [showLoader, setshowLoader] = useState(false);
  const [formHtml, setFormHtml] = useState("");
  const [showForm, setShowForm] = useState(0);
  const [rupayMap, setRupayMap] = useState("");
  const [cardType, setCardType] = useState("");
  let form;

  const [htmlSnippet, setHtmlSnippet] = useState("");
  const queryParameters = new URLSearchParams(window.location.search);

  const rupayRanges = [
    [508500, 508999],
    [606985, 607984],
    [608001, 608500],
    [652150, 653149],
  ];

  const getCardNetwork = (cardNumber) => {
    if (cardNumber.length >= 6) {
      const bin = cardNumber.substring(0, 6);
      const binNum = parseInt(bin, 10);

      // Visa: Starts with 4
      if (/^4/.test(bin)) {
        setCardType("visa");
        return "visa";
      }
      // MasterCard: 51-55 or 2221-2720
      else if (
        (binNum >= 222100 && binNum <= 272099) ||
        (binNum >= 510000 && binNum <= 559999)
      ) {
        setCardType("mastercard");
        return "mastercard";
      }
      // Amex: Starts with 34 or 37
      else if (/^3[47]/.test(bin)) {
        setCardType("amex");
        return "amex";
      }
      // Discover: Starts with 6011, 622126-622925, 644-649, 65
      else if (/^(6011|622(1[2-9][0-9]|2[0-9]{2})|64[4-9]|65)/.test(bin)) {
        setCardType("discover");
        return "discover";
      } else if (
        rupayRanges.some(([min, max]) => binNum >= min && binNum <= max)
      ) {
        setCardType("rupay");
        return "rupay";
      }
    }
    setCardType("");
    return "";
  };
  const handleCvvChange = (event) => {
    const inputValue = event.target.value;

    if (!isNaN(inputValue) && inputValue.length <= 4) {
      setCvv(inputValue);
    }
  };

  const handleExpiryChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\D/g, "");
    if (/^[2-9]/.test(value)) {
      value = "0" + value;
    }
    if (value.length >= 2 && value.indexOf("-") === -1) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    }
    const parts = value.split("-");
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + "-" + parts[1].slice(0, 2);
    }
    setExpiryMonthYear(value);
  };

  const handleNameClick = () => {
    setCardNameError("As mentioned on your Debit Card");
    setshowCardNameError(false);
  };

  const handleExpiryClick = () => {
    setCardExpiryError("");
    if (expiryMonthYear === "MM-YY") {
      setExpiryMonthYear("");
    }
  };

  const handleCvvClick = () => {
    setCardCVVError("");
    if (cvv === "****") {
      setCvv("");
    }
  };

  const handleCardNumberChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = sanitizedValue.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
    getCardNetwork(sanitizedValue);
  };

  const handleNameChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^A-Za-z\s]/g, "");
    setName(value);
  };

  const handleCardNumberClick = () => {
    setCardNumberError("");
    if (cardNumber === "XXXX-XXXX-XXXX-XXXX") {
      setCardNumber("");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      setExpiryMonthYear((prevValue) => prevValue.slice(0, -1));
    }
  };

  const handlePayNow = async () => {
    const merchantId = apiData.data.merchantId;
    const transactionId = apiData.data.transactionId;
    const paymentMode = "DC";

    let ccNo = cardNumber.replace(/\s+/g, "");
    let ccCardHolder = name;
    let ccCVV = cvv;

    let [month, year] = expiryMonthYear.split("-") || ["", ""];
    if (!year) year = "";

    const validator = new CardValidator();
    let isValid = true;

    setCardCVVError("");
    setCardExpiryError("");
    setCardNameError("");
    setCardNumberError("");

    if (!validator.isValidCardNumber(ccNo)) {
      setCardNumberError("Please enter a valid card number");
      isValid = false;
    }
    if (!validator.isValidCardName(ccCardHolder)) {
      setshowCardNameError(true);
      setCardNameError("Please enter a valid card holder name");
      isValid = false;
    }
    if (!validator.isValidExpiry(month, year)) {
      setCardExpiryError("Please enter a valid expiry");
      isValid = false;
    }
    if (!validator.isValidCVV(ccCVV)) {
      setCardCVVError("Please enter a valid CVV");
      isValid = false;
    }

    if (!isValid) return;

    if (year.length === 2) {
      year = "20" + year;
    }

    const payload = {
      data: {
        merchantId: merchantId,
        transactionId: transactionId,
        paymentMode: paymentMode,
        cardDetails: {
          cardNo: ccNo,
          cardHolderName: ccCardHolder,
          cardCvv: ccCVV,
          expiryMonth: parseInt(month),
          expiryYear: parseInt(year),
        },
      },
    };

    try {
      setshowLoader(true);
      const sessionId = queryParameters.get("sessionId");
      const response = await fetch(
      //  `https://qapaymentapi.pbpay.com/session/payment/pay/v1/makePayment?sessionId=${sessionId}`,
        `http://localhost:8090/session/payment/pay/v1/makePayment?sessionId=${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment Response:", data);

      if (data?.data?.htmlData) {
        setHtmlSnippet(data.data.htmlData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setshowLoader(false);
    }
  };

  useEffect(() => {
    if (htmlSnippet) {
      const newWindow = window.open("", "_self");
      newWindow.document.write(htmlSnippet);
      newWindow.document.close();
    }
  }, [htmlSnippet]);
  return (
    <>
      {cardDownBanks &&
        cardDownBanks !== null &&
        cardDownBanks.includes(",") && (
          <div className="generalMsgInfo">
            <strong>{cardDownBanks}</strong> are currently facing some technical
            issues.
          </div>
        )}

      {cardDownBanks &&
        cardDownBanks !== null &&
        !cardDownBanks.includes(",") && (
          <div className="generalMsgInfo">
            <strong>{cardDownBanks}</strong> is currently facing some technical
            issues.
          </div>
        )}
      <div className="card-details">
        <div class="hidden md:block">
          <h5>Enter your Debit Card details</h5>
        </div>

        <div className="card-detail-form">
          <Grid container spacing={3}>
            <Grid item md={12} xs={12} className={`debit-card ${cardType}`}>
              <TextField
                id="cardNumber"
                label="Debit Card Number"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={cardNumber}
                fullWidth
                error={!!cardNumberError}
                helperText={cardNumberError}
                style={{
                  borderRadius: "8px",
                  background: `url(${backgroundImage})`,
                }}
                onClick={handleCardNumberClick}
                onChange={handleCardNumberChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {cardType === "mastercard" && (
                        <img
                          src="/images/mastercard-icon.svg"
                          alt="MasterCard"
                          style={{ width: "40px" }}
                        />
                      )}
                      {cardType === "visa" && (
                        <img
                          src="/images/visa.svg"
                          alt="Visa"
                          style={{ width: "40px" }}
                        />
                      )}
                      {cardType === "rupay" && (
                        <img
                          src="/images/rupay.svg"
                          alt="Rupay"
                          style={{ width: "40px" }}
                        />
                      )}
                      {cardType === "amex" && (
                        <img
                          src="/images/amex.png"
                          alt="Amex"
                          style={{ width: "40px" }}
                        />
                      )}
                      {cardType === "discover" && (
                        <img
                          src="/images/discover.svg"
                          alt="Discover"
                          style={{ width: "40px" }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                id="name"
                label="Enter Your Name"
                fullWidth
                onChange={handleNameChange}
                onClick={handleNameClick}
                error={showCardNameError}
                helperText={cardNameError}
                value={name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="expiry"
                placeholder="MM-YY"
                label="Expiry Month & Year"
                error={!!cardExpiryError}
                helperText={cardExpiryError}
                value={expiryMonthYear}
                onClick={handleExpiryClick}
                onChange={handleExpiryChange}
                onKeyDown={handleKeyDown}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12} className="cvv-box">
              <TextField
                id="cvv"
                label="CVV"
                type="password"
                value={cvv}
                placeholder="***"
                error={!!cardCVVError}
                helperText={cardCVVError}
                onChange={handleCvvChange}
                onClick={handleCvvClick}
                fullWidth
              />
            </Grid>
            <Grid item md={12} xs={12} className="autopay-check">
              <Button
                variant="outlined"
                size="large"
                className="pay-now-btn"
                onClick={handlePayNow}
              >
                Pay Now
              </Button>
            </Grid>
          </Grid>
        </div>
        {showVisaNetwork ? (
          <CustomizedDialogs
            className="dialog-inner-box"
            open={showVisaNetwork}
            handleClose={() => setVisaNetwork(false)}
          >
            <VisaMasterInfo handleClose={() => setVisaNetwork(false)} />
          </CustomizedDialogs>
        ) : null}
      </div>
    </>
  );
}

export default DebitCard;
