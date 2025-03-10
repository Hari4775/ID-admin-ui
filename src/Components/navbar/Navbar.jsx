import React from 'react'
import { logout } from '../../api/Auth/Auth';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
    const currentDate = new Date().toLocaleDateString();

  //   const logoutHandler = async () => {     
  //     try {
  //         // Call the logout API
  //         const response = await logout();
  
  //         if (response.success) {
  //             // Clear the token cookie
  //             // document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  //             console.log('Logout message:', response.message);
  
  //             // Navigate to the admin login page
  //             navigate('/admin/login');
  //         } else {
  //             // Handle unsuccessful logout
  //             alert(`Logout failed: ${response.message}`);
  //         }
  //     } catch (error) {
  //         // Handle any unexpected errors
  //         console.error('An error occurred during the logout process:', error);
  //         alert('An unexpected error occurred during logout. Please try again.');
  //     }
  // };
  
  
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

  return (
    <div>
         <div className="w-11/12 mx-auto flex my-10 ">

      
        <div>
          <h1 className="text-3xl mb-7"><strong>Welcome</strong> harikumar </h1>
          <p className="font-bold text-xl">email</p>
        </div>

        <div className="ml-auto">
          <h1 className="text-xl mb-10">Date: <strong>{currentDate}</strong></h1>
          <button onClick={logoutHandler} className="w-full bg-blue-600 rounded-lg h-10 text-white font-bold">
            Logout
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default Navbar
