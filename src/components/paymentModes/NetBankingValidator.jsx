import React from 'react';
import CryptoJS from 'crypto-js';

class NetBankingValidator extends React.Component {

  isValidInput(value) {
    var isValid = false;

    if (value && value.length > 0 ) {
      isValid = true;
    }
    return isValid;
  }

  isBothAccountNoAndReAccNoSame(accNo1, accNo2){
    var isValid = false;
    if(accNo1.length > 0 && accNo2.length > 0){
      if(accNo1 === accNo2) isValid =true;
    }
    return isValid;
  }

  isSelectedBankValid(value){
   var isValid = false;
   if(value>0){
    isValid=true;
   }
   return isValid;
  }

   isValidCardHolderName(value) {
      var isValid = false;

      if (value.length > 0 && this.isValidCharacter_SpaceOnly(value)) {
        isValid = true;
      }
      return isValid;
    }

      isValidCharacter_SpaceOnly(key) {
        var isValid = false;
        var regex = new RegExp('^[a-zA-Z\\s]*$');
        if (regex.test(key)) {
          isValid = true;
        }
        return isValid;
      }
    
    isValidEmail(key)
    {
      var isValid=false;
      var regex=new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      if(regex.length<=0)return false;
      if(regex.test(key))
      {
        isValid=true;
      }
      return isValid;
    }

    isValidNumbersOnly(key)
    {
      var isValid=false;
      var regex=new RegExp('^[0-9]+$');
      if(key.length<10) return false;
      if(regex.test(key))
      {
        isValid=true;
      }
      return isValid;
    }


}

export default NetBankingValidator;