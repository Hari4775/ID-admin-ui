
import axios from 'axios';

const API_URL = process.env.REACT_APP_ADMIN_API_URL;
console.log('API_URL:', API_URL); // This should log "http://localhost:5000/api"



export const  getPlan =async(category_id) =>{
    console.log(category_id)
    return await axios.get(`${API_URL}/plan/${category_id}`)
}

export const createPlan = async(data)=>{
    console.log(data,"data")
    return await axios.post(`${API_URL}/plan`,data)
}
export const  updatePlan = async(plan_id)=>{
    console.log(plan_id)
    return await axios.put(`${API_URL}/plan/${plan_id}`)
}