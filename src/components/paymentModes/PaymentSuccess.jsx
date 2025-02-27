// import React, { useEffect, useState } from 'react'
// import PaymentSteps from '../../PaymentSteps/PaymentSteps';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInr } from '@fortawesome/free-solid-svg-icons';
// import GetDomain from './GetDomain';
// import ImageComponent from '../shared/ImageComponent';
// function paymentSuccess() {
//     const [transactionTime, setTransactionTime] = useState('');
//     const queryParameters = new URLSearchParams(window.location.search);
//     const orderNo = queryParameters.get('order');
//     const amount = queryParameters.get('totalAmount');


//     useEffect(() => {
//         const currentTime = new Date();
//         const options = { hour: '2-digit', minute: '2-digit', hour12: true };
//         const formattedTime = currentTime.toLocaleTimeString([], options);
//         setTransactionTime(formattedTime);


//         const order = queryParameters.get('orderNo');
//         const maxAmount = queryParameters.get('maxRecurringAmount');
//         const queryParams = {
//             reRegister: '2',
//             isInternal: '1',
//             isNewUi: '1',
//             orderNo: order,
//             maxRecurringAmount: maxAmount
//         };

//         const domain = GetDomain();
//         const form = document.createElement('form');
//         form.method = 'POST';
//         //  form.action = domain+'/pay/payment/initiate/emandate';   --->api to be changed here //@aniket


//         for (const key in queryParams) {
//             if (queryParams.hasOwnProperty(key)) {
//                 const input = document.createElement('input');
//                 input.type = 'hidden';
//                 input.name = key;
//                 input.value = queryParams[key];
//                 form.appendChild(input);
//             }
//         }


//         document.body.appendChild(form);


//         setTimeout(function () {
//             form.submit();
//         }, 3000);

//     }), [];
//     return (

//         <Box sx={{ mt: 4 }}>
//             <PaymentSteps />

//             <Card sx={{ mt: 6, textAlign: 'center' }}>
//                 <CardContent>
//                     <Box>
//                         <ImageComponent name="successIcon" />

//                         <Typography variant="h5" component="h5" sx={{ mt: 2 }}>
//                             Payment successful!
//                         </Typography>
//                         <Typography variant="body1" sx={{ mt: 1 }}>
//                             Your payment is complete
//                         </Typography>

//                         <Box sx={{ mt: 3 }}>
//                             <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                                 Transaction details
//                             </Typography>
//                             <List>
//                                 <ListItem sx={{ justifyContent: 'space-between' }}>
//                                     <ListItemText primary="Amount paid" />
//                                     <Typography variant="subtitle1" component="div">
//                                         <FontAwesomeIcon icon={faInr} /> {amount}
//                                     </Typography>
//                                 </ListItem>
//                                 <Divider component="li" />
//                                 <ListItem sx={{ justifyContent: 'space-between' }}>
//                                     <ListItemText primary="Transaction ID" />
//                                     <Typography variant="subtitle1" component="div">
//                                         {orderNo}
//                                     </Typography>
//                                 </ListItem>
//                                 <Divider component="li" />
//                                 <ListItem sx={{ justifyContent: 'space-between' }}>
//                                     <ListItemText primary="Transaction time" />
//                                     <Typography variant="subtitle1" component="div">
//                                         {transactionTime}
//                                     </Typography>
//                                 </ListItem>
//                             </List>
//                         </Box>
//                         <Box sx={{ mt: 3 }}>
//                             <Typography variant="h4" component="h4">
//                                 Redirecting you to set up Autopay
//                             </Typography>
//                             <ImageComponent name="loaderGif"/>
//                         </Box>
//                     </Box>
//                 </CardContent>
//             </Card>
//         </Box>

//     )
// };

// export default paymentSuccess;












