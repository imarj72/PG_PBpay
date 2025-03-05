 import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({session_time}) {
  const [open, setOpen] = React.useState(true);
   let domain;
  const handleClickOpen = () => {
    setOpen(true);
  };
   const currentUrl = window.location.href;
  const getDomain = () => {
  if (currentUrl.includes('paymentuiqa')) {
    domain = 'https://paymentqa.policybazaar.com';
  } else {
    domain = 'https://payment.policybazaar.com';
  }
}

 const handleClose = () => {
  getDomain();
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.append('session', session_time);
  const newUrl = `${domain}/pay/payment/secure?${queryParams.toString()}`;
  console.log(newUrl);
  window.location.href = newUrl;
  setOpen(false);
};

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your current session is expired. If you want to extend the session ,
		Please <a href="#" onClick={handleClose}  style={{ fontWeight: 'bold' }}> click here</a>.
          </DialogContentText>
        </DialogContent>
       
      </Dialog>
    </React.Fragment>
  );
}

