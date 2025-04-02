import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteCategory, updateCategory } from "../../../api/Category/CategoryApi";
import PlanCard from "../PlanSection/PlanCard";
import PlanForm from "../PlanSection/PlanForm";
import { getPlan } from "../../../api/DayPlan/DayPlanApi";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dr1ogkaha/image/upload"
const CLOUDINARY_UPLOAD_PRESET ="my_preset"

const CategoryCard = ({ category, refresh, onViewPlan }) => {
  
  const [categoryData, setCategoryData] = useState({
    categoryName: category.categoryName || "",
    categoryDescription: category.categoryDescription || "",
    categoryRegularPrice: category.categoryRegularPrice || "",
    categoryDiscountedPrice: category.categoryDiscountedPrice || "",
    categoryOffer: category.categoryOffer || "",
    categoryImage: category.categoryImage || "",
    categoryImageCloudinaryId: category.categoryImageCloudinaryId || "",
  });

  const [previewImage, setPreviewImage] = useState(category.categoryImage || "");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isCreateplan,setIsCreatePlan] = useState(false);
  const [planData, setPlanData] = useState([]);
  
  
  

  // Toggle edit mode
  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleCreatePlan = () => setIsCreatePlan((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "categoryRegularPrice" || name === "categoryOffer") {
        const regularPrice = parseFloat(updatedData.categoryRegularPrice) || 0;
        const discountRate = parseFloat(updatedData.categoryOffer) || 0;
        if (discountRate >= 0 && discountRate <= 100) {
          updatedData.categoryDiscountedPrice= regularPrice - (regularPrice * discountRate) / 100;
        }
      }
      return updatedData;
    });
  };

 
  // Handle Image Upload to Cloudinary
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    setSelectedFile(file);
  };


  const uploadImage = async () => {
    if (!selectedFile) return null;
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", selectedFile);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, uploadData);
      setUploading(false);
      return {
        categoryImage: response.data.secure_url,
        categoryImageCloudinaryId: response.data.public_id,
      };
    } catch (error) {
      setUploading(false);
      setMessage("Image upload failed. Try again.");
      console.error("Upload error:", error.response?.data || error.message);
      return null;
    }
  };

  

  // Handle category update
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setMessage("");
    let imageUrl = categoryData.categoryImage;
    let publicId = categoryData.categoryImageCloudinaryId;

    if (selectedFile) {
      // Upload new image
      const uploadedImage = await uploadImage();
      if (!uploadedImage) return;
      imageUrl = uploadedImage.categoryImage;
      publicId = uploadedImage.categoryImageCloudinaryId;
    }

    try {
      const updatedData = {...categoryData,categoryImage:imageUrl,categoryImageCloudinaryId:publicId}
      await updateCategory(category.category_id,updatedData);
      refresh();
      setMessage(`Category "${categoryData?.categoryName}" updated successfully!`);
      setTimeout(() => setMessage(""), 2000);
      setIsEditing(false);
   
    } catch (error) {
      setMessage(`Failed to update category. Error: ${error.message}`);
      console.error(error);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(category.category_id);
      refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  //  const fetchDayPlan = async () => {
  //   try {
  //     if (selectedCategoryId) {
  //       const response = await getPlan(selectedCategoryId);
  //       if (response?.data) {
  //         // Ensure planData is an array
  //         setPlanData(Array.isArray(response.data) ? response.data : [response.data]);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err, "error getting the planData");
  //   }
  // };

  // useEffect(() => {
  //   fetchDayPlan();
  // }, [selectedCategoryId]);

  return (
    <div
      className={`cursor-pointer transform hover:scale-105 transition-transform duration-300 group flex w-full flex-col self-center overflow-hidden rounded-lg border-2 shadow-md }`}
    >
      {!isEditing ? (
        <>
          {/* Display Mode */}
          <div className="relative mx-3 mt-3 flex md:h-40 h-32 overflow-hidden rounded-xl">
            <img
              className="peer absolute top-0 right-0 h-full w-full object-cover"
              src={category.categoryImage || "default-placeholder.png"}
              alt="Category"
            />
          </div>
          <div className="mt-4 md:px-5 px-2 md:pb-5 pb-1">
            <h1 className="md:text-xl text-sm tracking-tight font-bold uppercase text-black">
              {category?.categoryName}
            </h1>
            <p className="text-sm text-gray-700 h-10 overflow-y-scroll">{category?.categoryDescription}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-blue-500">{category?.categoryOffer}% OFF</p>
              <div>
                <span className="line-through text-gray-500">₹{category?.categoryRegularPrice}</span>
                <span className="text-lg font-bold text-teal-700 mx-2">₹{category?.categoryDiscountedPrice}</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                onClick={handleEditToggle}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 no-button w-full mx-auto text-white px-3 py-1 rounded-md"
                onClick={() => onViewPlan(category.category_id)}
              >
                View Details
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Edit Mode */}
          <form onSubmit={handleUpdateCategory} className="space-y-4 p-4">
            <img src={previewImage || "default-placeholder.png"} alt="Preview" className="w-full h-full object-cover" />
            <input type="file"  onChange={handleFileChange} className="w-full px-3 py-1 border rounded-md mb-2" />
            <input type="text" name="categoryName" value={categoryData.categoryName} onChange={handleInputChange} placeholder="Category Name"  className="w-full border p-2 rounded"/>
            <textarea name="categoryDescription" value={categoryData?.categoryDescription} onChange={handleInputChange} placeholder="Description"className="w-full border p-2 rounded" />
            <input
              type="number"
              name="categoryRegularPrice"
              value={categoryData?.categoryRegularPrice}
              onChange={handleInputChange}
              placeholder="Actual Price"
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="categoryDiscountedPrice"
              value={categoryData?.categoryDiscountedPrice}
              onChange={handleInputChange}
              placeholder="Offer Price"
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="categoryOffer"
              value={categoryData?.categoryOffer}
              onChange={handleInputChange}
              placeholder="Offer (%)"
              className="w-full border p-2 rounded"
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
      {/* Feedback Message */}
      {message && <p className="text-center text-sm text-green-500 mt-2">{message}</p>}
    
    
        
    </div>
  );
};

export default CategoryCard;
