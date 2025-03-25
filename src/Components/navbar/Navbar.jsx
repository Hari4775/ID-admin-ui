import React, { useEffect, useState } from 'react'
import { logout } from '../../api/Auth/Auth';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
    const currentDate = new Date().toLocaleDateString();

    const [userEmail, setUserEmail] = useState('');
  
  const logoutHandler = async () => {     
    try {
        // Call the logout API
        const response = await logout();

        if (response.success) {
            // Clear the token cookie
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            console.log('Logout message:', response.message);

            // Navigate to the admin login page
            navigate('/login');
        } else {
            // Handle unsuccessful logout
            alert(`Logout failed: ${response.message}`);
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('An error occurred during the logout process:', error);
        alert('An unexpected error occurred during logout. Please try again.');
    }
};

useEffect(() => {
  const email = localStorage.getItem("userEmail");
  if (email) {
      setUserEmail(email);
  }
}, []);

  return (
    <div className='bg-blue-950 w-11/12 mx-auto rounded-lg p-2 mt-5 flex'>     
        <div>
          <h1 className="text-3xl text-red-600"><strong>Hi..</strong> {userEmail} </h1>
        </div>
        <div className="ml-auto">
          {/* <h1 className="text-xl mb-2">Date: <strong>{currentDate}</strong></h1> */}
          <button onClick={logoutHandler} className="w-full px-2 bg-blue-600 rounded-lg h-10 text-white font-bold ml-auto">
            Logout
          </button>
        </div>
     
      
    </div>
  )
}

export default Navbar
