// import React from 'react'
// import { Grid } from '@mui/material'
// import { Block, DisplaySettingsOutlined, PaddingOutlined, WindowRounded } from '@mui/icons-material';
// function PaymentView({apiData}) {

//     const [isMobileView, setIsMobileView]=useState(false);
//     const [callbackFailureUrl, setCallbackFailureUrl]=useState('');
//     const [showSkipAutoPay, setShowSkipAutopay]=useState(false);
//     const [categoryValue, setCategoryValue]=useState(0);
    

//     const handleCategoryValueChange=((newCategoryValue)=>{
//         console.log("Category value changed to:",newCategoryValue);
//         setCategoryValue(newCategoryValue);
//     });

//    useEffect(() => {
//      const handleResize=()=>{
//         setIsMobileView(window.innerWidth<=820);
//      }
//      handleResize();
//      window.addEventListener('resize',handleResize);
   
//      return () => {
//        window.removeEventListener('resize',handleResize);
//      }
//    }, [])
   
    

//     const handleClick=()=>{
//         window.location.href=callbackFailureUrl;
//     };
    
//     useEffect(() => {
//       if(apiData)
//       {
//         const callbackFailureUrl=api.callbackFailureUrl;
//         setCallbackFailureUrl(callbackFailureUrl);
//       }
//     }, [apiData]);

//     const certifiedLogoStyle=()=>{
//         display:'flex';
//         justifyContent:'space-between';
//         alignItem:'center';
//         padding:'10px';
//         color:$blueColor;
//         overflow:'hidden';
//         fontSize:'12px';
//     }
//   return (
//     <>
//       <Grid container spacing={2} className="payment-mode"
//       sx={{
//         marginTop:{xs:1,md:10}
//       }}>
        
//         {apiData.isBackButtonVisible && (
//           <Grid item xs={12} style={{ marginBottom: '5px' }}>
//             <Button onClick={handleClick} variant="outlined">
//               &lt; Back
//             </Button>
//           </Grid>
//         )}
//         <Grid item xs={12} md={8}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               {!apiData.isSI ? <PaymentStepsOne /> : <PaymentStepsSI />}
//               {apiData.retry && <PaymentError retry={apiData.retry} />}
//               {apiData.emandateRegistered && <EmandateRegistered />}
//             </Grid>
            
//             <Grid item xs={12} className="debit-card-tab">
//               {!isMobileView && <PaymentTabs onCategoryValueChange={handleCategoryValueChange} />}
//               <div className="hidden sm:block mt-6 bg-slate-100" />
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
//                   <Link href="https://www.5tattva.com/verify/ftzdkix4sq" target="_blank" rel="noopener noreferrer">
//                     <img src="./images/pci-dss-certified@2x.png" alt="PCI DSS Certified" width="84" />
//                   </Link>
//                 </Typography>
//               </Grid>
//             )}
//           </Grid>
//         </Grid>


//         <Grid item xs={12} md={4}>
//           {!isMobileView && <PlanAccordion categoryValue={categoryValue} />}
          
//           {apiData.isSkipAutoRegister && (
//             <Button onClick={() => setShowSkipAutopay(true)} variant="contained" className="skip-autopay-btn">
//               Skip Autopay Registration
//             </Button>
//           )}
//         </Grid>
//         {isMobileView && (
//           <Grid item xs={12} className="mobile-tabs">
//             <PaymentAccordion isSI={apiData.isSI} onCategoryValueChange={handleCategoryValueChange} />
//           </Grid>
//         )}
//       </Grid>

//       {showSkipAutoPay && (
//         <Dialog open={showSkipAutoPay} onClose={() => setShowSkipAutopay(false)} className="razor-pay-dialog">
//           <DialogTitle>Skip Autopay Registration</DialogTitle>
//           <DialogContent>
//             <SkipAutoPay handleCloseDialog={() => setShowSkipAutopay(false)} />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setShowSkipAutopay(false)} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </>
//   )
// }

// export default PaymentView;