import React from 'react';
import ImageComponent from '../../../shared/ImageComponent';

const styles = {
  popup: {
    width: '100%',
    background: '#00000047',
    position: 'fixed',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupInner: {
    width: '',
    background: '#fff',
    position: 'relative', 
    height: 'auto',
    padding: '1em 0',
    borderRadius: '12px',
    boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.0588235294)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: '20px',
    color: '#253858',
  },
  strong: {
    color: '#ff0000',
  },
  paragraph: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#808080',
    lineHeight: '20px',
    margin: '20px 0',
    padding:"6px 10px",
  },
  retryButton: {
    background: '#0052cc',
    color: '#fff',
    border: 'none',
    minWidth: '80px',
    height: '34px',
    lineHeight: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  image: {
    width: '160px',
    borderRadius: '16px',
  },
  closeButton: {
    position: 'absolute',
    top: '7px',
    right: '-48px', 
    background: 'transparent',
    border: 'none',
    width : '25%',
    cursor: 'pointer',
  },
  alertIcon:{
   maxWidth: '20%',
    height:"auto",
  }
};

const PaymentFailedPopup = ({ handleCloseDialog, retryPayment }) => {
  return (
    <div style={styles.popup}>
      <div style={styles.popupInner}>
        <button 
          style={styles.closeButton} 
          onClick={() => handleCloseDialog ? handleCloseDialog() : null}
        >
          <ImageComponent name="closeBtn" />
        </button>
        
        <h3 style={styles.heading}>
          <strong style={styles.strong}>Payment failed!</strong>
        </h3>
       <div className = 'failed-payment-image'>
	      <ImageComponent style={styles.alertIcon} name={'Payment Failed'} /></div>
        <p style={styles.paragraph}>Please click on Retry to complete the payment</p>
        <button style={styles.retryButton} onClick={() => retryPayment()}>Retry</button>
      </div>
    </div>
  );
};

export default PaymentFailedPopup;

