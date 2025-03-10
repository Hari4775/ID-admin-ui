import React, { useState } from 'react'
import { login } from '../../../api/Auth/Auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email,setEmail] =useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate()

    const regsiterHandler = ()=>{
       navigate("/register")
    }

    const loginHandler = async()=>{
        setLoading(true)
        if(!email || !password) {
            alert("enter email id and password")
            setLoading(false)
            return;
       }
       const response= await login(email,password);
       alert(response.message);

       if (response.success) {
        console.log('Login successful:', response.data);
        document.cookie = `token=${response.token}; path=/;`; // Set token cookie
        navigate("/")
        // Log additional data if needed
        // Handle successful login actions here, like navigation or saving a token
      }
    
      setLoading(false); // Reset loading state
    }

  return (

    <div className="flex flex-col items-center  justify-center  w-full h-screen ">

    <div className=' md:w-8/12 w-11/12 mx-auto inner-container border-2 shadow-lg shadow-slate-500'>
          <div className="mid-container mb-10 text-center">
         
            
             <div className='authform-section w-8/12 mx-auto mb-5'>

    <div className="w-full p-3">
    <div className="my-5">
      <input className="w-full rounded-lg h-10 border border-slate-400 px-2"
        placeholder="Email ID" value={email} onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="mb-5">
      <input className="w-full rounded-lg h-10 border border-slate-400 px-2"
        placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <button className="w-full bg-blue-600 rounded-lg h-10 text-white font-bold"
      onClick={loginHandler} disabled={loading} 
    >
      {loading ? 'Loging' : 'Login'}
    </button>
  </div>

  <p className="mt-5">  Don't have an account?{" "}
                    <button  className="text-blue-500 underline" onClick={regsiterHandler}
                    > Register </button>
                 </p>

  </div>
  </div>
</div>
</div>

  )
}

export default Login
