// src/pages/auth/LoginRegisterPage.js
import React, { useState } from 'react';
import AuthForm from "./Components/Register";
import Login from './Components/Login';
const LoginRegisterPage = () => {
  const [isRegistering, setIsRegistering] = useState(true);

  const toggleAuthMode = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center  justify-center  w-full h-screen ">

    <div className='lg:w-1/3 md:w-8/12 w-11/12 mx-auto inner-container border-2 shadow-lg shadow-slate-500'>
          <div className="mid-container mb-10 text-center">
            {
              isRegistering? (
            
             <div className='authform-section w-8/12 mx-auto mb-5'>
                  <Login/>
                  <p className="mt-5">  Don't have an account?{" "}
                    <button  className="text-blue-500 underline" onClick={toggleAuthMode}
                    > Register </button>
                 </p>
             </div>
             ):(

             <div className='authform-section w-8/12 mx-auto mb-5'>
                  <AuthForm/>

                  <p className="mt-5">
                Already have an account?{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={toggleAuthMode}
                >
                  Login
                </button>
              </p>
             </div>
             )
            }

          </div>
      </div>
  </div>
  );
};

export default LoginRegisterPage;
