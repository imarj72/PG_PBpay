// import React, { useEffect } from 'react'
// import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Link } from '@mui/material';
// import PaymentStepsRecurring from './PaymentStepsRecurring';
// import PaymentError from './PaymentError';
// import PaymnetTabsRecurring from './PaymnetTabsRecurring';
// import PlanAccordion from './PlanAccordion';
// // import PaymentAccordionRecurring from './PaymentAccordionRecurring';
// // import CustomizedDialogs from './CustomizedDialogs';
// import SkipAutoPay from './SkipAutoPay';

// function PaymentViewRecurring() {
//     const [isMobileView, setIsMobileView]=useState(false);
//     const [showSkipAutoPay, setShowSkipAutoPay]=useState(false);
//     const [showDialog, setShowDialog]=useState(false);

   
//    useEffect(() => {
//     const handleResize=()=>{
//         setIsMobileView(window.innerWidth<=820)
//     }
//     handleResize();
//     window.addEventListener('resize',handleResize);
//      return () => {
//         window.removeEventListener('resize',handleResize);
//      }
//    }, [])
   
    
//     useEffect(() => {
    
//         setShowDialog(apiData.isSkipAutoRegister);
//     }, [apiData]);
    
// const certifiedLogoStyle=()=>{
//     display:'flex';
//     justifyContent:'space-between';
//     alignItem:'center';
//     padding:'10px';
//     color:$blueColor;
//     overflow:'hidden';
//     fontSize:'12px';
// };
//   return (
//      <>
//       <Grid container spacing={2} className="payment-mode mt-1 md:mt-10">
        
//         <Grid item xs={12} md={8}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <PaymentStepsRecurring />
//               {apiData.retry && <PaymentError retry={apiData.retry} />}
//             </Grid>

//             <Grid item xs={12} className="debit-card-tab">
//               {!isMobileView && <PaymnetTabsRecurring />}
//             </Grid>

//             {!isMobileView && (
//               <Grid item xs={12} className="certified-logos hideSmall" style={certifiedLogoStyle}>
//                 <Typography className="left">
//                   <Link href="https://www.policybazaar.com/legal-and-admin-policies/" target="_blank" rel="noopener noreferrer">
//                     Privacy Policy
//                   </Link>
//                   {'  |  '}
//                   <Link href="https://www.policybazaar.com/legal-and-admin-policies/#termsofuse" target="_blank" rel="noopener noreferrer">
//                     Terms & Conditions
//                   </Link>
//                   {'  |  '}
//                   <Link href="https://payment.policybazaar.com/pay/faq.jsp" target="_blank" rel="noopener noreferrer">
//                     FAQ
//                   </Link>
//                 </Typography>
//                 <Typography className="right">
//                   <Link href="https://seal.gtisec.com/policybazaar" target="_blank" rel="noopener noreferrer">
//                     <img src="./images/pci-dss-certified@2x.png" alt="PCI DSS Certified" width="84" />
//                   </Link>
//                 </Typography>
//               </Grid>
//             )}
//           </Grid>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           {!isMobileView && <PlanAccordion />}
//           {!isMobileView && showDialog && (
//             <Button 
//               onClick={() => setShowSkipAutoPay(true)} 
//               variant="contained" 
//               className="skip-autopay-btn"
//             >
//               Skip Autopay Registration
//             </Button>
//           )}
//         </Grid>

//         {/* {isMobileView && (
//           <Grid item xs={12}>
//             <PaymentAccordionRecurring showDialog={showDialog} />
//           </Grid>
//         )} */}
//       </Grid>

//       {showSkipAutoPay && (
//         <Dialog open={showSkipAutoPay} onClose={() => setShowSkipAutoPay(false)} className="razor-pay-dialog">
//           <DialogTitle>Skip Autopay Registration</DialogTitle>
//           <DialogContent>
//             <SkipAutoPay handleCloseDialog={() => setShowSkipAutoPay(false)} />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setShowSkipAutoPay(false)} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </>
//   )
// }

// export default PaymentViewRecurring
