import React from 'react';
import CryptoJS from 'crypto-js';


class CardValidator extends React.Component {
  isValidCardNumber(value) {
    if (value.length <= 0) {
      return false;
    }
    if (/[^0-9-\s]+/.test(value)) {
      return false;
    }

    var nCheck = 0,
      nDigit = 0,
      bEven = false;
    value = value.replace(/\D/g, '');

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n);
      nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }
      nCheck += nDigit;
      bEven = !bEven;
    }

    return nCheck % 10 === 0;
  }

 
  isValidCharacter_SpaceOnly(key) {
    var isValid = false;
    var regex = new RegExp('^[a-zA-Z\\s]*$');
    if (regex.test(key)) {
      isValid = true;
    }
    return isValid;
  }
  

    isValidCardName(value)
    {
      var isValid=false;
      if(value.length>0 && this.isValidCharacter_SpaceOnly(value))
      {
        isValid=true;
      }
      return isValid;
    }

  isValidExpiry(month, year) {
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    if(isNaN(month) || isNaN(year)){
      return false;
    }
    if(month<1 || month>12){
      return false;
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; 
    const maxYear = currentDate.getFullYear() % 100 + 10;
    return (year > currentYear && year <= maxYear) || (year === currentYear && month >= currentDate.getMonth() + 1);
  }

  async isValidExpirySI(month, year) {    
    try {
        year = `20${year}`;
        const temp = { month, year };
        const response = await fetch(`/pay/payment/isCardExpired`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(temp),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API request error:', error);
        return null; 
    }
  }
  
  encrypt(message, secret) {
    return CryptoJS.AES.encrypt(message, secret).toString();
  }

  isValidCVV(value) {
    var cvv = value.length;
    var isValid = false;
    if (cvv > 2 && cvv < 5 && !isNaN(value)) {
		isValid = true;
	}
    return isValid; 
  }

  render() {
    return null; // Since this is just a utility component, it doesn't render anything
  }
  
  isValidDebitMonthYearSetup(month, year) {

    var isValid = true;
    if (this.isValidNumbersOnly(month) && this.isValidNumbersOnly(year) && month > 0 &&
        year > 0) {
        isValid = this.monthYear(month, year - 1);
    } else {
        isValid = false
    }
    return isValid;
  }

  isValidNumbersOnly(key) {
    var isValid = false;
    var regex = new RegExp('^[0-9]+$');
    if (regex.test(key)) {
      isValid = true;
    }
    return isValid;
  }

  monthYear(month, year) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; // say 08
    var currentYear = currentDate.getFullYear(); // say 2018
    var isValid = true;

    if (year < currentYear) { // 2018 < 2018 valid for 2019 < 2018
      isValid = false;
    } else if (year == currentYear) { // 2018 == 2018
      if (month < currentMonth) // 5 < 8 false
        isValid = false;
    }
    return isValid;
  } 


   isValidMobile(value) {
    var mobile = value.length;
    var isValid = false;
    if (mobile == 10 && !isNaN(value)) {
		isValid = true;
	}
    return isValid; 
  }
  

  async isCardBinValidForEMI(cardBin, bankId, mode) {
    try {
      const response = await fetch(`/pay/emiDetails/eligibility?cardBin=${cardBin}&bankId=${bankId}&mode=${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.isEligible === 1; 
    } catch (error) {
      console.error('Error checking card BIN eligibility:', error);
      return false;
    }
  }

  async isCardBinValidForSI(cardBin,  prodId, srcSupplierId, orderNo, cardType, mode, isNewUI) { 
    let isValid = false;
    const url = `/pay/cardBin/info?isNewUI=`+isNewUI;
    try {
        
        const payload = { 
          cardType:encodeURIComponent(cardType),
          json:encodeURIComponent(cardBin),
          prodId:encodeURIComponent(prodId),
          srcSupplierId:encodeURIComponent(srcSupplierId), 
          orderNo:orderNo,
          mode:encodeURIComponent(mode)
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        if(result && result.data && result.data.is_si_supported == '1'){
          isValid = true;
        }
    } catch (error) {
        console.error('API request error:', error);
        return false; 
    }
    return isValid;
  }


}

export default CardValidator;

