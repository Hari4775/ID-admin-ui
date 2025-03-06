// src/api/project/projectApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_ADMIN_API_URL   
// http://localhost:8000/api/admin

export const createPackage = async (data)=>{
    console.log(data)
   return  await axios.post(`${API_URL}/packages`, data);
};
     
export const getPackages = async () => {
    return await axios.get(`${API_URL}/packages`);
};

export const getPackage = async (projectId) => {
    return await axios.get(`${API_URL}/packages/${projectId}`,);
};

export const updatePackage = async (pkg_id,updatedDetails) => {
    console.log(pkg_id,updatedDetails);
    return await axios.put(`${API_URL}/packages/${pkg_id}`,updatedDetails);
};

export const deletePackage = async (pkg_id) => {
    console.log(pkg_id)
    return await axios.delete(`${API_URL}/packages/${pkg_id}`,);
};


