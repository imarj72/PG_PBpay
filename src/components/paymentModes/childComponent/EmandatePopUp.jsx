import React from 'react';
import ImageComponent from '../../shared/ImageComponent';

const EmandatePopUp = ({ onClose }) => {
  return (
    <div className="popup-wrapper emandate-info">
      <div className="popup-box">
      <div className="popup-head">
        <a className="popup-close gpay-info" onClick={onClose}>
          <ImageComponent name="closeBtn" />
        </a>
      </div>
      <div className="popup-content">
        <div className="popup-info-box">
          <div className="popup-data">
            <h4>What is e-mandate?</h4>
            <p className="info">
              e-Mandate is a digital payment service initiated by RBI and the National Payments 
              Corporation of India (NPCI). It serves as an underlying infrastructure for businesses 
              in India to collect recurring payments without any human intervention.
            </p>
            <p className="info">
              A mandate is a standard instruction that you provide to your issuing bank and other 
              institutions allowing them to automatically debit the mentioned amount from your 
              bank account. eMandate is a convenient way for businesses and their customers to 
              easily manage all the recurring payments like insurance premiums, SIPs, loan 
              installment collections, etc. This eliminates the hassles of reminders and late 
              penalty charges that eventually proves to be a win-win for both businesses as well 
              as their customers.
            </p>
          </div>
          
        </div>
        <div className="img-block">
          <ImageComponent name="Emandate Banner" />
          </div>
      </div>
    </div>  
  </div>
    
  );
};

export default EmandatePopUp;
