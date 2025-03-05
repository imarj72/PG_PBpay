import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import ImageComponent from '../../shared/ImageComponent';
import AlertDialog from './sessionPopUp';
// import  getDomain  from '../PaymentMode/Components/getDomain'; 

function Header({ apiData }) {
  const [showSessionPopUp, setShowSessionPopUp] = useState(false);
  const handleSubmitCalled = useRef(false);
  // const domain = getDomain();

  const SessionTimer = ({ endTime }) => {
    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());


    function calculateRemainingTime() {
      // console.log('endtime:',endTime);
      if (!endTime) return 0;
      const currTime = new Date().getTime();
      const expiryTime = new Date(parseInt(endTime) * 1000).getTime();

      const diff = expiryTime - currTime;
      // console.log('difference:',diff);
      return diff > 0 ? diff : 0;
    }
    useEffect(() => {
      let timer;
      if (remainingTime > 0) {
        timer = setInterval(() => {
          setRemainingTime(calculateRemainingTime());
        }, 1000);
      } else {

        setShowSessionPopUp(true);
        if (!handleSubmitCalled.current) {
          setTimeout(() => {
            setShowSessionPopUp(false);
            handleSubmit();
          }, 5000);
          handleSubmitCalled.current = true;
        }
      }

      return () => clearInterval(timer);
    }, [endTime, remainingTime]);

    function formatTime(remainingTime) {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      return `${minutes}m:${seconds.toString().padStart(2, '0')}s`;
    }

    return formatTime(remainingTime);
  };


  const handleSubmit = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const orderNo = encodeURIComponent(queryParameters.get("orderNo"));
    const var1 = queryParameters.get("var1");
    const var2 = queryParameters.get("var2");
    // window.location.href = domain+`/pay/payment/sessionOut?orderNo=${orderNo}&var1=${var1}&var2=${var2}`;
    console.log('Form submitted after 5 seconds');
  };

  return (
    <>
      <header className='header h-4 relative sm:h-20 lg:h-20 w-auto'>
        <Grid container spacing={1}>
          <Grid item xs={false} sm={8} md={8} className='none md:block'>
            <ImageComponent name={'pbpay_logo'} className="hidden md:block" />
          </Grid>
          <Grid item sm={12} md={4} xs={12}>
            <div className='session-timer right-0 relative sm:right-0 top-0 px-2 md:px-4  md:absolute sm:right-8 md:right-12 md:top-5 bottom-0 m-auto'>
              <p className='text-right md:text-center '>
                Session expires in
                <span className="SessionTimer">
                  {apiData && <SessionTimer endTime={apiData[0].data[0].sessionExpiryTime} />}
                </span>
              </p>
            </div>
          </Grid>
        </Grid>
      </header>
      {apiData &&
        <Dialog open={showSessionPopUp}>
          <AlertDialog sessionExpiryTime={apiData[0].data[0].sessionExpiryTime} />
        </Dialog>}
    </>
  );
}

export default Header;

