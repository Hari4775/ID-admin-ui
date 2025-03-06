import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { register, requestOtp, verifyOtp } from '../../../api/Auth/Auth';

const Register = () => {
  // const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Can be email or mobile number
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
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
  

  const loginHAndler =()=>{
    navigate("/login")
  }
  const handleRequestOtp = async () => {
    setIsSending(true); // Disable button
    try {
      console.log(name,email)
      await requestOtp(name, email); // Send OTP with selected contact type
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
      await requestOtp(name, email);
      alert('OTP resent successfully.');
      setTimer(30); // Reset countdown after resending
      setCanResend(false); // Disable resend button again
      setResendCount((prev) => prev + 1); // Increment resend count
    } catch (error) {
      alert('Failed to resend OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(email, otp, name);
      if (response.message === 'OTP verified successfully.') {
        // const { token } = response;
        // // login({ fullName, contact}, token);
        // alert('OTP verified successfully!');
        setStep(3)
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handlePasswordSubmit =async () => {
    
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
    try{
      await register(email,name,password);
      navigate('/admin/login_register');
      // API call to set the password could go here
      alert("admin registered successfully. please Login and Continue");
    }catch(error){
      alert ('Error for changing passeword')
    }
  
  };

  return(
   
    <div className="flex flex-col items-center  justify-center  w-full h-screen ">

    <div className='lg:w-1/3 md:w-8/12 w-11/12 mx-auto inner-container border-2 shadow-lg shadow-slate-500'>
          <div className="mid-container mb-10 text-center">
         
            
             <div className='authform-section w-8/12 mx-auto mb-5'>


   
   
   
   <div>


  
  {step === 1 ? (
    <div className="w-full p-3">
      <div className="my-5">
        <input className="w-full rounded-lg h-10 border border-slate-400 px-2"
          placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <input className="w-full rounded-lg h-10 border border-slate-400 px-2"
          placeholder="E-MAIL" value={email} onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="w-full bg-blue-600 rounded-lg h-10 text-white font-bold"
        onClick={handleRequestOtp} disabled={isSending} 
      >
        {isSending ? 'Sending...' : 'Send OTP'}
      </button>
    </div>
  ) : step ===2 ?(
    <div className="w-full p-5">
      <div className="my-5">
        <OtpInput value={otp} onChange={setOtp} numInputs={6}
          renderInput={(props) => (
            <input {...props} style={{}} className="border border-slate-400 rounded-lg text-center ml-1 w-full h-10"
            />
          )}
        />
      </div>
      <button className="w-full bg-blue-600 rounded-lg h-10 text-white font-bold" onClick={handleVerifyOtp}
      > Verify OTP
      </button>
      <div className="mt-3 text-center">
        {canResend ? (
          resendCount < 3 ? (
            <button className="text-blue-500 underline" onClick={handleResendOtp}>
              Resend OTP
            </button>
          ) : (
            <p className="text-red-500">Maximum OTP request attempts expired</p>
          )
        ) : (
          <p>Resend OTP in {timer} seconds</p>
        )}
      </div>
    </div>
  ):(
    <div className="w-full p-5">
      <div className="my-5">
        <input
          type="password"
          className="w-full rounded-lg h-10 border border-slate-400 px-2"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="my-5">
        <input
          type="password"
          className="w-full rounded-lg h-10 border border-slate-400 px-2"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        className="w-full bg-blue-600 rounded-lg h-10 text-white font-bold"
        onClick={handlePasswordSubmit}
      >
        Set Password
      </button>
    </div>
  )}


    </div>
    <p className="mt-5">
                Already have an account?{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={loginHAndler}
                >
                  Login
                </button>
              </p>


    </div>
    </div>
    </div>
    </div>
  );
};

export default Register;