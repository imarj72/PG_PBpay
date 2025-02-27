import React, { useState, useEffect, useRef } from 'react';

function MasterCardRupayForm() {
  const mastRupay = {
    callbackUrl: 'https://yourcallbackurl.com',
    binNo: '1234',
    txAmount: 99999999999.99999,
    payId: 'pay123',
    var1: 'var1_value',
    var2: 'var2_value',
  };

  const { callbackUrl, binNo, txAmount, payId, var1, var2 } = mastRupay;

  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const [otp, setOtp] = useState('');
  const otpRef = useRef(null);

  const evaluateCustomValidityForOtp = () => {
    const otpInput = otpRef.current;
    const validityState = otpInput.validity;

    if (otp === '' || otp.length < 4 || validityState.valueMissing) {
      otpInput.setCustomValidity('Invalid OTP entered');
      setError('Invalid OTP entered');
      return false;
    } else {
      otpInput.setCustomValidity('');
      setError('');
      return true;
    }
  };

  const handleResendOtp = async (event) => {
    document.getElementById('verifyOtpError').innerHTML = '';
    if (canResend) {
      console.log("Resend OTP triggered");
      const url = `/pay/otp/submit?var1=${encodeURIComponent(var1)}&var2=${encodeURIComponent(var2)}`;
      setOtp('');
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payId: payId,
            otp: otp,
            gateway: 'mastercard3ds2'
          }),
        });

        const data = await response.json();
        if (data.status) {
          setStatus(data.status);
        } else {
          setStatus(false);
        }
      } catch (err) {
        setError(err.message);
        setStatus(false);
      }

      setTimer(30);
      setCanResend(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    
    if (!evaluateCustomValidityForOtp()) {
      setError('Invalid OTP format. Please check your OTP.');
      return;
    }

    verifyOTP((isValid) => {
      setError('');
      if (isValid) {
        const rform = document.getElementById('redirectToNpciForm');
        rform.submit();
      } else {
        setError('Provided OTP is invalid. Please try again.');
      }
    });
  };

  const verifyOTP = (callback) => {
    fetch(`/pay/otp/submit?var1=${encodeURIComponent(var1)}&var2=${encodeURIComponent(var2)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payId: payId,
        otp: otp,
        gateway: 'mastercard3ds2',
      }),
    })
      .then(response => response.json())
      .then(data => callback(data.status))
      .catch(error => {
        console.error('Error:', error);
        callback(false);
      });
  };

  useEffect(() => {
    let timerId;
    if (!canResend && timer > 0) {
      timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(timerId);
  }, [timer, canResend]);

  const redirectCancel = () => {
    window.location.href = callbackUrl;
  };

  const [isOtpVisible, setOtpVisible] = useState(false);
  const toggleOtpVisibility = () => {
    setOtpVisible(!isOtpVisible);
  };

  return (
    <div>
      <div id="redirectToNpciAcsSimple">
        <form
          id="redirectToNpciForm"
          onSubmit={handleSubmit}
          name="redirectToNpciForm"
          method="POST"
          action={callbackUrl}
        >
          <fieldset id="rupayOTP">
          <div align="left">
              {" "}
              <img
                className="RupayLogo"
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzgiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA3OCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNzMuNjEgMS40N0w3Ny45NiAxMGwtOS4xMyA4LjUzTDczLjYgMS40N3oiIGZpbGw9IiMwMDhDNDQiLz48cGF0aCBkPSJNNzAuNiAxLjQ3TDc0Ljk1IDEwbC05LjEyIDguNTNMNzAuNiAxLjQ3eiIgZmlsbD0iI0Y0NzkyMCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNLjk2IDE1LjQzTDUuMjkgMGg2LjkyYzIuMTcgMCAzLjYxLjM0IDQuMzUgMS4wNC43My42OS44NyAxLjgyLjQzIDMuNGE1Ljg1IDUuODUgMCAwMS0xLjIzIDIuMzUgNS43IDUuNyAwIDAxLTIuMTcgMS40N2MuNzYuMTggMS4yNC41NCAxLjQ2IDEuMDguMjEuNTQuMTkgMS4zMi0uMDcgMi4zNWwtLjUzIDIuMTV2LjA2Yy0uMTUuNi0uMS45My4xNC45NWwtLjE2LjU4SDkuNzVjLjAxLS4zNy4wNC0uNy4wNy0uOTYuMDQtLjI4LjA4LS41LjEyLS42NWwuNDQtMS41NGMuMjItLjguMjMtMS4zNi4wMy0xLjY4LS4yMS0uMzMtLjY3LS41LTEuNC0uNUg3LjA0bC0xLjUgNS4zM0guOTZ6bTcuMDYtOC44aDIuMWMuNzQgMCAxLjI5LS4xIDEuNjItLjMyLjM0LS4yMi42LS41OC43NC0xLjExLjE1LS41NS4xMS0uOTItLjEtMS4xNC0uMjItLjIxLS43NC0uMzItMS41Ny0uMzJIOC44M2wtLjgxIDIuOXptMjEuODMtMi41OWwtMy4yIDExLjM5aC0zLjg4bC40OC0xLjY3YTcuNTcgNy41NyAwIDAxLTIuMDkgMS40OWMtLjcuMzItMS40My40OS0yLjIuNDktLjY1IDAtMS4yLS4xMi0xLjY1LS4zNWEyLjIyIDIuMjIgMCAwMS0xLTEuMDNjLS4yLS40LS4yOS0uOS0uMjYtMS40OC4wNC0uNTguMjUtMS41Ni42My0yLjkzbDEuNjYtNS45aDQuMjRsLTEuNjUgNS44N2MtLjI0Ljg2LS4zIDEuNDctLjE4IDEuOC4xMi4zMy40NS41Ljk4LjVzLjk4LS4yIDEuMzUtLjU4Yy4zOC0uMzkuNjctLjk3Ljg5LTEuNzNsMS42NC01Ljg3aDQuMjR6TTMyLjYzIDBsLTQuMzIgMTUuNDNoNC42NGwxLjMyLTQuNzNoMi43OWMxLjggMCAzLjMtLjQ1IDQuNS0xLjM3YTcuMjggNy4yOCAwIDAwMi41NS0zLjk2Yy4yOC0uOTguMzUtMS44Mi4yMy0yLjU0YTMuMTMgMy4xMyAwIDAwLS45OS0xLjggMy44IDMuOCAwIDAwLTEuNzEtLjc4QzQwLjkuMDggMzkuOSAwIDM4LjU4IDBoLTUuOTV6bTQuMiA2Ljk0aC0xLjVsLjg5LTMuMTZoMS40OWMxIDAgMS42Mi4xMiAxLjg2LjM1LjI1LjIzLjMuNjQuMTMgMS4yNC0uMTcuNTgtLjQ0Ljk5LS44MyAxLjIyYTQuNCA0LjQgMCAwMS0yLjA1LjM1em0xMi4yOCA4LjQ5bC4wNC0xLjA5Yy0uNjguNTEtMS4zOC45LTIuMDcgMS4xMy0uNy4yNS0xLjQ0LjM3LTIuMjMuMzctMS4yIDAtMi4wNC0uMzItMi41Mi0uOTUtLjQ4LS42Mi0uNTYtMS41Mi0uMjQtMi42N2E0LjIgNC4yIDAgMDExLjY4LTIuNWMuOC0uNTQgMi4xMy0uOTIgNC0xLjE3bC42LS4wNy4zNS0uMDRjMS4zOC0uMTYgMi4xNi0uNTMgMi4zMi0xLjEyLjEtLjMzLjA0LS41Ny0uMTctLjcxLS4yLS4xNi0uNTYtLjIzLTEuMS0uMjMtLjQzIDAtLjc5LjA5LTEuMDguMjgtLjMuMTktLjUuNDYtLjY2Ljg2SDQzLjlhNC43MyA0LjczIDAgMDEyLjI4LTIuOSA5IDkgMCAwMTQuNTEtLjk4Yy44OCAwIDEuNjYuMDggMi4zNi4yNi43LjE3IDEuMi40IDEuNTMuNy40LjM2LjY1Ljc4LjcyIDEuMjMuMDguNDYtLjAxIDEuMTEtLjI1IDEuOTdsLTEuNzggNi4zNWMtLjA2LjItLjA3LjM5LS4wNC41Ni4wNC4xNi4xLjMuMjMuNGwtLjEuMzJoLTQuMjV6bTEuMDMtNS4wOWMtLjQ1LjE4LTEuMDQuMzUtMS43Ny41NC0xLjE0LjMtMS43OC43MS0xLjkyIDEuMjEtLjEuMzItLjA2LjU3LjEuNzYuMTYuMTguNDMuMjcuODEuMjcuNyAwIDEuMjctLjE4IDEuNy0uNTMuNDItLjM1LjczLS45Ljk2LTEuNjZsLjA2LS4yNy4wMy0uMS4wMy0uMjJ6bTQuMiA2LjJsLS45NCAzLjM3YTI5LjE2IDI5LjE2IDAgMDAyLjEyLjEgOC43IDguNyAwIDAwMi4yNi0uMjJjLjUtLjE1Ljk1LS4zOSAxLjM2LS43My4zMi0uMjUuNjQtLjYxLjk5LTEuMDguMzQtLjQ3Ljg5LTEuMzQgMS42NC0yLjZMNjguNCA0LjAzaC00bC0zLjc0IDYuOTEuMDYtNi45aC00LjNsLjY2IDEwLjQydi42MmMtLjAyLjE4LS4wNS4zNC0uMS40OS0uMDkuMzQtLjI0LjU5LS40Ny43NC0uMjMuMTQtLjU1LjIyLS45NS4yMmgtMS4yMnoiIGZpbGw9IiMxQjMyODEiLz48L3N2Zz4="
              />{" "}
            </div>
            <div className="npciMessage">
              <label id="infoHeaderId" className="rupayLabelheader">
                Please enter your One Time Password (OTP) sent to your registered Mobile No.
              </label>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td><label id="cardNoId" className="rupayLabel">Card No</label></td>
                    <td>: XXXX XXXX XXXX {binNo}</td>
                  </tr>
                  <tr>
                    <td><label id="merchant" className="rupayLabel">Merchant</label></td>
                    <td>: PBPAY PRIVATE LIMITED</td>
                  </tr>
                  <tr>
                    <td><label id="amount" className="rupayLabel">Amount</label></td>
                    <td>: {txAmount} INR</td>
                  </tr>
                  <tr>
                    <td><label id="otpId" className="enterOtpLabel">Enter OTP</label></td>
                    <td>
                      <div className='otpinput'>
                        <div className="alignEye">
                          <input
                            id="otp"
                            name="otp"
                            type={isOtpVisible ? 'text' : 'password'}
                            minLength={4}
                            maxLength={10}
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            ref={otpRef}
                            style={{ border: '2px solid #ccc', paddingTop: '8px', fontSize: '13px', justifyContent:'flex-start' }}
                          />
                        </div>
                        <div className="eye alignEye" onClick={toggleOtpVisibility} id="toggleOtp" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      {/* Only render the error message when there's an error */}
                      <span 
                        id="verifyOtpError" 
                        style={{
                          color: "red", 
                          fontSize: "14px", 
                          display: error ? 'block' : 'none'
                        }}
                      >
                        {error}
                      </span>
                    </td>
                  </tr>
                  <tr id="buttonDiv" className="resendLabel">
                    <td colSpan={2} style={{ width: "100%", textAlign: "center" }}>
                      <button type="submit" style={{ background: "#3965fb", color: "#fff", padding: "10px 20px", borderRadius: "5px" }}>
                        Submit
                      </button>
                      <button type="button" id='cancel' onClick={redirectCancel} style={{ background: "#ccc", color: "#253858", padding: "10px 20px", borderRadius: "5px" }}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
                        <div className="resenddiv">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      id="resendOtpHref"
                      className="resendOtpHrefClass"
                      disabled={!canResend}
                    >
                      Resend OTP
                    </button>
                    </div>
                    &nbsp;
                    <span id="countdowntimer" style={{ fontSize: 14 }}>
                      {canResend ? '' : `Wait ${timer} seconds`}
                    </span>
              <input type="hidden" name="payId" id="payId" defaultValue={payId} />
              <input type="hidden" name="secureVar1" id="secureVar1" defaultValue={var1} />
              <input type="hidden" name="secureVar2" id="secureVar2" defaultValue={var2} />
            </div>
          </fieldset>
        </form>
        <style dangerouslySetInnerHTML={{
  __html: `
    #redirectToNpciAcsSimple { 
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #2d3748;
      background: 'linear-gradient(to bottom, #E9F7FF, #DDEFFF, #FFFFFF)';
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    fieldset {
      margin:auto;
      border: none;
      background: linear-gradient(145deg, #ffffff, #f7faff);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      width: 500px;
      margin: 2rem;
      transition: transform 0.2s ease;
    }
   
    .RupayLogo {
      width: 180px;
      margin-bottom: 1.5rem;
      margin:auto;
    }
    .otpinput{
      vertical-align: middle;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #2d3748;
    }
    .resenddiv{
     display:flex;
     flex-direction:col;
     align-items:center;
     justify-content:center;

    }
    .npciMessage {
      font-size: 20px;
      line-height: .85;
      margin: 1rem 0;
      color: #4a5568;
      text-align: justify;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }

    td {
      padding: 0.75rem 0;
      vertical-align: middle;
      border-bottom: 1px solid #edf2f7;
      font-weight: 700;
      color:#7f7f7f;
    }

    .rupayLabel {
      font-weight: 600;
      color: #2d3748;
      font-size: 0.95rem;
    }
    .rupayLabelheader{
      font-weight: 600;
      color: #2d3748;
      text-align: center;
      font-size: 0.75rem;
    }

    #otp {
      width: 180px;
      padding: 0.25rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 2rem;
      transition: all 0.3s ease;
    }

    #otp:focus {
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66,153,225,0.2);
      outline: none;
    }
  
    button[type="submit"] {
      background:#132d43;
      border: none;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-transform: capitalize;
      width:45%;
    }
    button[type="submit"]:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(66,153,225,0.3);
    }

    #cancel {
      background: linear-gradient(135deg, #4299e1, #3182ce);
      border: none;
      width:45%;
      color: white;
      margin-left: 15px;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-right: 1rem;
      text-transform: capitalize;
    }

    #cancel:hover {
      box-shadow: 0 4px 12px rgba(245,101,101,0.3);
      transform: translateY(-1px);
    }

    .resendOtpHrefClass {
      width: 100%;
      border: 2px solid #4299e1;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      background: #4299e1;
      color: white;
      transition: all 0.2s ease;
    }
    
    .resendOtpHrefClass:hover:not(:disabled) {
      background: none;
      color: #4299e1;
    }

    .resendOtpHrefClass:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      border-color: #cbd5e0;
      color: #cbd5e0;
    }

    #countdowntimer {
      color: #718096;
      font-size: 0.9rem;
      vertical-align: top;
      display: flex;
      justify-content: center;
      margin-top:-1rem;
    }

    #verifyOtpError {
      display: block;
      padding: 0.75rem;
      background: #fff5f5;
      color: #c53030;
      border-radius: 6px;
      margin: 1rem 0;
      border: 1px solid #fed7d7;
      font-size: 0.9rem;
    }

    .eye {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      margin-left: -32px;
      padding: 8px;
      color: #718096;
      transition: color 0.2s ease;
    }

    .eye:hover {
      color: #2d3748;
    }

    @media (max-width: 480px) {
      fieldset {
        width: 90%;
        padding: 1.5rem;
        margin: auto;
      }
      .otpinput{
        justify-content: center;
      }
      #otp {
        width: 80%;
      }
      
      button[type="submit"], #cancel {
        width: 100%;
        margin: 0.5rem 0;
      }
      #verifyOtpError {
        text-align: center;
      }
      .npciMessage{
        text-align: justify;
      }
    }
  `
}} />
      </div>
    </div>
  );
}

export default MasterCardRupayForm;
