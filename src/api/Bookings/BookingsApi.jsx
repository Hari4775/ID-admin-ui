import axios from 'axios';

const API_URL = process.env.REACT_APP_ADMIN_API_URL;
console.log('API_URL:', API_URL); // This should log "http://localhost:5000/api"


export const  fetchAllBookings =async() =>{
    return await axios.get(`${API_URL}/booking`)
}