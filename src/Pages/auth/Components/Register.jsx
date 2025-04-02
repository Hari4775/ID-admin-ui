import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { register, requestOtp, verifyOtp } from '../../../api/Auth/Auth';
import { bg, logo } from '../../../Assets/images/images';

const Register = () => {
  // const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(''); // Can be email or mobile number
  const [otp, setOtp] = useState(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSending, setIsSending] = useState(false); // State for disabling button
  const [resendCount, setResendCount] = useState(0); // State for tracking resend attempts
  const navigate = useNavigate();

 
  useEffect(() => {
    let countdown;
    if (timer > 0 && !canResend) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(countdown);
  }, [timer, canResend]);
  

  
  const handleRequestOtp = async () => {
    setIsSending(true); // Disable button
    try {
      console.log(email)
      await requestOtp( email); // Send OTP with selected contact type
      alert('OTP sent successfully.');
      setStep(2);
      setTimer(30);
      setCanResend(false);
      setResendCount(1); // Initialize resend count to 1 after the first send
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false); // Re-enable button in case of an error
    }
  };

  const handleResendOtp = async () => {
    if (resendCount >= 3) {
      alert('Maximum OTP request attempts expired.');
      return;
    }
    try {
      await requestOtp(email);
      alert('OTP resent successfully.');
      setTimer(30); // Reset countdown after resending
      setCanResend(false); // Disable resend button again
      setResendCount((prev) => prev + 1); // Increment resend count
    } catch (error) {
      alert('Failed to resend OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    const numericOtp = Number(otp); // Convert OTP to a number
  
    if (isNaN(numericOtp) || numericOtp.toString().length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }
  
    try {
      const response = await verifyOtp(email, numericOtp);
      if (response) {
        console.log(response.token)
        localStorage.setItem("token", response.token);
        window.dispatchEvent(new Event("storage"));
        // document.cookie = `token=${response.token}; path=/; secure; HttpOnly`;
        alert("Login successful!");
        navigate("/"); // Redirect after successful login
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    }
  };
  



  return(
    <div
    className="flex flex-col items-center justify-center w-full h-screen bg-slate-200 bg-cover bg-center"
    style={{ backgroundImage: `url(${bg})` }}
  >
      <img className='lg:w-1/12 w-2/12 ' src={logo}/>

      <div 
        style={{ backdropFilter: 'blur(30px)' }} 
        className='lg:w-1/3 md:w-8/12 w-11/12 mx-auto inner-container rounded-lg border-2 shadow-lg  bg-opacity-90 p-5'
      >  
          <div className="mid-container my-5 text-center ">
         
             <div className='authform-section w-full lg:w-11/12 mx-auto mb-5'>

   <div>
  {step === 1 ? (
    <div className="w-full p-3">
      <div className="mb-5">
        <input className="w-full rounded-lg h-10 border-blue-700 border- px-2 text-lg font-bold"
          placeholder="E-MAIL" value={email} onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="w-full bg-black rounded-lg h-10 text-white font-bold border-blue-700 border-2"
        onClick={handleRequestOtp} disabled={isSending} 
      >
        {isSending ? 'Sending...' : 'Send OTP'}
      </button>
    </div>
  ) : (
    step ===2 && (
    <div className="w-full p-5">
      <div className="my-5">
        <OtpInput value={otp} onChange={setOtp} numInputs={6}
          renderInput={(props) => (
            <input {...props} style={{}} className="border-blue-700 border-2 text-lg rounded-lg text-center font-bold ml-1 w-full h-10"
            />
          )}
        />
       

      </div>
      <button className="w-full bg-black rounded-lg h-10 text-white font-bold border-blue-700 border-2 " onClick={handleVerifyOtp}
      > Verify OTP
      </button>
      <div className="mt-3 text-center">
        {canResend ? (
          resendCount < 3 ? (
            <button className="underline" onClick={handleResendOtp}>
              Resend OTP
            </button>
          ) : (
            <p className="text-red-500">Maximum OTP request attempts expired</p>
          )
        ) : (
          <p className='text-white mt-5'>Resend OTP in {timer} seconds</p>
        )}
      </div>
    </div>
    )
  )}


    </div>



    </div>
    </div>
    </div>
    </div>
  );
};

export default Register;