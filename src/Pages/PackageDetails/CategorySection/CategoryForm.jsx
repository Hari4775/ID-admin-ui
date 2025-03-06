import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { createCategory } from '../../../api/Category/CategoryApi';
import { useParams } from 'react-router-dom';

const CategoryForm = ({ onClose, refreshCategories }) => {
  const { package_id } = useParams();
  const [formData, setFormData] = useState({
    package_id: "",
    categoryName: "",
    categoryDescription: "",
    categoryFeatures: "",
    categoryRegularPrice: "",
    categoryDiscountedPrice: "",
    categoryOffer: "",
    categoryImage: "",
    categoryImageCloudinaryId: "",
  });

  // Set package_id from useParams when component mounts
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, package_id }));
  }, [package_id]);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dr1ogkaha/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "my_preset";

  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "categoryRegularPrice" || name === "categoryOffer") {
        const regularPrice = parseFloat(updatedData.categoryRegularPrice) || 0;
        const discountRate = parseFloat(updatedData.categoryOffer) || 0;

        if (discountRate >= 0 && discountRate <= 100) {
          updatedData.categoryDiscountedPrice = regularPrice - (regularPrice * discountRate) / 100;
        }
      }

      return updatedData;
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    let imageDetails = {
      categoryImage: formData.categoryImage,
      categoryImageCloudinaryId: formData.categoryImageCloudinaryId,
    };

    if (selectedFile) {
      const uploadedImage = await uploadImage();
      if (!uploadedImage) return;
      imageDetails = uploadedImage;
    }

    try {
      await createCategory({ ...formData, ...imageDetails });
      setMessage("Category created successfully!");
      setTimeout(() => setMessage(""), 2000);
      refreshCategories();
      setFormData({
        package_id: package_id,  // Keep package_id after reset
        categoryName: "",
        categoryDescription: "",
        categoryFeatures: "",
        categoryRegularPrice: "",
        categoryDiscountedPrice: "",
        categoryOffer: "",
        categoryImage: "",
        categoryImageCloudinaryId: "",
      });
      setPreviewImage("");
      setSelectedFile(null);
    } catch (error) {
      setMessage(`Failed to create category. Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-center text-lg font-bold">Create Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative mx-3 my-3 flex md:h-40 h-32 overflow-hidden rounded-xl bg-gray-200">
          {previewImage ? (
            <img src={previewImage} alt="Cover Preview" className="w-full h-full object-cover" />
          ) : (
            <label htmlFor="coverImage" className="absolute inset-0 flex items-center justify-center text-gray-700 font-medium cursor-pointer">
              Upload Cover Image
            </label>
          )}
          <input
            type="file"
            id="categoryImage"
            name="categoryImage"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </div>

        <div className="w-10/12 mx-auto">
          <input
            type="text"
            placeholder="Name"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            required
            className="w-full text-lg border-b-2 border-gray-300 text-center"
          />
        </div>

        <div className="flex w-11/12 mx-auto">
          <div className="w-4/12">
            <input
              type="number"
              placeholder="Price"
              name="categoryRegularPrice"
              value={formData.categoryRegularPrice}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-1 text-xs text-center"
            />
          </div>
          <div className="mx-2 w-3/12">
            <input
              type="number"
              placeholder="Discount %"
              name="categoryOffer"
              value={formData.categoryOffer}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-1 text-xs text-center"
            />
          </div>
          <div className="w-4/12">
            <input
              type="number"
              placeholder="Final Price"
              name="categoryDiscountedPrice"
              value={formData.categoryDiscountedPrice}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-1 text-xs text-center bg-gray-100"
            />
          </div>
        </div>

        <div className="w-10/12 mx-auto">
          <input
            type="text"
            placeholder="Features"
            name="categoryFeatures"
            value={formData.categoryFeatures}
            onChange={handleChange}
            required
            className="w-full text-lg border-b-2 border-gray-300 text-center"
          />
        </div>

        <div className="w-11/12 mx-auto">
          <input
            type="text"
            placeholder="Description"
            name="categoryDescription"
            value={formData.categoryDescription}
            onChange={handleChange}
            required
            className="w-full text-lg border-b-2 border-gray-300 text-center"
          />
        </div>

        <div className="flex space-x-2 w-11/12 mx-auto pb-5">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-8 rounded-lg"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Create Category"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 h-8 rounded-lg"
          >
            Cancel
          </button>
        </div>
        {message && <p className="text-center text-green-600 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default CategoryForm;
