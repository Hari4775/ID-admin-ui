import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { register, requestOtp, verifyOtp } from "../../../api/Auth/Auth";
import { bg, logo } from "../../../Assets/images/images";

const Register = () => {
  // const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(""); // Can be email or mobile number
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSending, setIsSending] = useState(false); // State for disabling button
  const [resendCount, setResendCount] = useState(0); // State for tracking resend attempts
  const [message, setMessage] = useState(null);
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
    setMessage(null);
    try {
      const response = await requestOtp(email);
      setMessage({ text: response.message, type: "success" });
      setStep(2);
      setTimer(30);
      setCanResend(false);
      setResendCount(1); // Initialize resend count to 1 after the first send
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to send OTP.", type: "error" });
    } finally {
      setIsSending(false); // Re-enable button in case of an error
    }
  };

  const handleResendOtp = async () => {
    if (resendCount >= 3) {
      setMessage({ text: "Maximum OTP request attempts expired.", type: "error" });
      return;
    }
    try {
      const response = await requestOtp(email);
      setMessage({ text: response.message, type: "success" });
      setTimer(30);
      setCanResend(false);
      setResendCount((prev) => prev + 1);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to resend OTP.", type: "error" });
    }
  };


  const handleVerifyOtp = async () => {
    const numericOtp = Number(otp); // Convert OTP to a number

    if (isNaN(numericOtp) || numericOtp.toString().length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await verifyOtp(email, otp);
      setMessage({ text: response.message, type: "success" });
      if (response) {
        localStorage.setItem("token", response.token);
        window.dispatchEvent(new Event("storage"));
        alert("Login successful!");
        navigate("/"); // Redirect after successful login
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Invalid OTP. Please try again.", type: "error" });
    }
  };

  return (
    <div
      className="flex flex-col items-center  w-full h-screen bg-slate-200 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="w-full mt-10 items-center flex-col flex justify-items-end  ">
          <img className="lg:w-1/12 w-2/12 " src={logo} />

      </div>

      <div
        style={{ backdropFilter: "blur(30px)" }}
        className="lg:w-1/3 md:w-8/12 w-11/12 mx-auto inner-container rounded-3xl border-blue-400 border-2 shadow-lg  bg-opacity-90 p-5"
      >
        <div className="mid-container my-5 text-center ">
          <div className="authform-section w-full lg:w-11/12 mx-auto mb-5">
          <div className="text-center">
          {message && (
            <p className={`text-lg font-bold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
            <div>
              {step === 1 ? (
                <div className="w-full p-3">
                  <div className="mb-5">
                    <input
                      className="w-full rounded-lg h-10 border-blue-700 border- px-2 text-lg font-bold"
                      placeholder="E-MAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full bg-slate-950 rounded-lg h-10 text-white font-bold border-blue-700 border-2"
                    onClick={handleRequestOtp}
                    disabled={isSending}
                  >
                    {isSending ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              ) : (
                step === 2 && (
                  <div className="w-full p-5">
                    <div className="my-5">
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                          <input
                            {...props}
                            style={{}}
                            className="border-blue-700 border-2 text-lg rounded-lg text-center font-bold ml-1 w-full h-10"
                          />
                        )}
                      />
                    </div>
                    <button
                      className="w-full bg-black rounded-lg h-10 text-white font-bold border-blue-700 border-2 "
                      onClick={handleVerifyOtp}
                    >
                      {" "}
                      Verify OTP
                    </button>
                    <div className="mt-3 text-center">
                      {canResend ? (
                        resendCount < 3 ? (
                          <button
                            className="underline text-white"
                            onClick={handleResendOtp}
                          >
                            Resend OTP
                          </button>
                        ) : (
                          <p className="text-red-500">
                            Maximum OTP request attempts expired
                          </p>
                        )
                      ) : (
                        <p className="text-white mt-5">
                          Resend OTP in {timer} seconds
                        </p>
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
