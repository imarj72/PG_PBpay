import { Button, Grid, TextField, InputAdornment } from "@mui/material";
import React, { useState, useEffect } from "react";
import CardValidator from "../../cardValidator";
import VisaMasterInfo from "../../childComponent/VisaMasterInfo";
import CustomizedDialogs from "../../../shared/CustomDialogs";

function CreditCard({ apiData, cardDownBanks }) {
  const [showVisaNetwork, setVisaNetwork] = useState(false);
  const [expiryMonthYear, setExpiryMonthYear] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardCVVError, setCardCVVError] = useState("");
  const [cardExpiryError, setCardExpiryError] = useState("");
  const [showCardNameError, setshowCardNameError] = useState(false);
  const [cardNameError, setCardNameError] = useState(
    "As mentioned on your Credit Card"
  );
  const [cardType, setCardType] = useState("");
  const [showLoader, setshowLoader] = useState(false);

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

      if (/^4/.test(bin)) {
        setCardType("visa");
        return "visa";
      } else if (
        (binNum >= 222100 && binNum <= 272099) ||
        (binNum >= 510000 && binNum <= 559999)
      ) {
        setCardType("mastercard");
        return "mastercard";
      } else if (/^3[47]/.test(bin)) {
        setCardType("amex");
        return "amex";
      } else if (/^(6011|622(1[2-9][0-9]|2[0-9]{2})|64[4-9]|65)/.test(bin)) {
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

  const handleCardNumberChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = sanitizedValue.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
    getCardNetwork(sanitizedValue);
  };

  const handleCardNumberClick = () => {
    setCardNumberError("");
    if (cardNumber === "XXXX-XXXX-XXXX-XXXX") {
      setCardNumber("");
    }
  };

  const handleNameChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^A-Za-z\s]/g, "");
    setName(value);
  };

  const handleNameClick = () => {
    setCardNameError("As mentioned on your Credit Card");
    setshowCardNameError(false);
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

  const handleExpiryClick = () => {
    setCardExpiryError("");
    if (expiryMonthYear === "MM-YY") {
      setExpiryMonthYear("");
    }
  };

  const handleCvvChange = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue) && inputValue.length <= 4) {
      setCvv(inputValue);
    }
  };

  const handleCvvClick = () => {
    setCardCVVError("");
    if (cvv === "****") {
      setCvv("");
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
    const paymentMode = "CC";

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
        <div className="hidden md:block">
          <h5>Enter your Credit Card details</h5>
        </div>

        <div className="card-detail-form">
          <Grid container spacing={3}>
            <Grid item md={12} xs={12} className={`debit-card ${cardType}`}>
              <TextField
                id="cardNumber"
                label="Credit Card Number"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={cardNumber}
                fullWidth
                error={!!cardNumberError}
                helperText={cardNumberError}
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
                label="Expiry Month & Year"
                placeholder="MM-YY"
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
          </Grid>

          <div className="autopay-check" style={{ marginTop: "30px" }}>
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

export default CreditCard;
