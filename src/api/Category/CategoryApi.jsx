import axios from 'axios';

const API_URL = process.env.REACT_APP_ADMIN_API_URL;
console.log('API_URL:', API_URL); // This should log "http://localhost:5000/api"



export const  createCategory = async (data)=>{
    console.log(data,"categoryCreation")
   return  await axios.post(`${API_URL}/category`, data);
};

export const  getCategories =async(package_id) =>{
    console.log(package_id)
    return await axios.get(`${API_URL}/category/${package_id}`)
}

export const deleteCategory = async (category_id) => {
    return await axios.delete(`${API_URL}/category/${category_id}`);
};

export const updateCategory = async (category_id,updatedDetails)=>{
    console.log(category_id,updatedDetails,"category updations");
    return await axios.put(`${API_URL}/category/${category_id}`,updatedDetails);
}

// export const categoryCreation= async( 
//     features,
//     description,
//     actual_price,
//     offer_price,
//     offer,
//     package_id,
// )=>{
//     try{
//         console.log('Login successful:', package_id);

//       const response = await axios.post(`${API_URL}/category`,{features,
//         description,
//         actual_price,
//         offer_price,
//         offer,
//         package_id,});
//       console.log('Login successful:', package_id, response.data);
//       return  { message: response.data.message, success: true, data: response.data };
  
//     }catch(error){
//       const errorMessage = error.response?.data?.message || 'An error occurred during login.';
//       return { message: errorMessage, success: false }; // Return error message and failure status
//     }
//   }
  