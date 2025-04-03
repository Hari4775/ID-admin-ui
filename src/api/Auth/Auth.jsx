// src/api/auth/authApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_ADMIN_API_URL;
console.log('API_URL:', API_URL); // This should log "http://localhost:5000/api"

// Function to request OTP for manual registration/login
export const requestOtp = async (email,) => {
  try {
    console.log('Requesting OTP:', {email });
    // API call to request OTP
    const response = await axios.post(`${API_URL}/auth/request_otp`, {email });
    console.log('OTP request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in requestOtp:', error.response?.data || error.message);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
    try {
      console.log('Verifying OTP:', { email, otp});
      const response = await axios.post(`${API_URL}/auth/verify_otp`, { email, otp});
      console.log('OTP verification response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in verifyOtp:', error.response?.data || error.message);
      throw error;
    }
  };
  
export const register = async(email,name,password)=>{
    try{
        const response = await axios.post(`${API_URL}/auth/register`,{email,name,password});
        return response.data;
    }catch(error){
        console.error('Error registertation:',error.response?.data || error.message);
    }
}


export const login= async(email,password)=>{
  try{
    const response = await axios.post(`${API_URL}/auth/login`,{email,password});
    console.log('Login successful:', response.data);
    return  { message: response.data.message, success: true, data: response.data };

  }catch(error){
    const errorMessage = error.response?.data?.message || 'An error occurred during login.';
    return { message: errorMessage, success: false }; // Return error message and failure status
  }
}

export const logout = async () => {
  try {
      const response = await axios.post(`${API_URL}/auth/logout`);
      console.log('Logout successful:', response.data);
      return { success: true, message: response.data.message }; // Ensure consistent structure
  } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during logout.';
      console.error('Logout error:', errorMessage);
      return { success: false, message: errorMessage }; // Consistent error structure
  }
};