import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updatePackage } from "../../../api/package/packageAPI";

const PackageCard = ({ pkg, onDelete, onPackageUpdated, refresh }) => {
  const navigate = useNavigate();
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dr1ogkaha/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "my_preset";

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    package_name: pkg.package_name || "",
    description: pkg.description || "",
    regular_price: pkg.regular_price || "",
    discounted_price: pkg.discounted_price || "",
    discount_rate: pkg.discount_rate || "",
    coverImage: pkg.coverImage || "",
    coverImageCloudinaryId:pkg.coverImageCloudinaryId || "",
  });


  const [previewImage, setPreviewImage] = useState(pkg.coverImage || "");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "regular_price" || name === "discount_rate") {
        const regularPrice = parseFloat(updatedData.regular_price) || 0;
        const discountRate = parseFloat(updatedData.discount_rate) || 0;
        if (discountRate >= 0 && discountRate <= 100) {
          updatedData.discounted_price = regularPrice - (regularPrice * discountRate) / 100;
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
        imageUrl: response.data.secure_url,
        publicId: response.data.public_id, // Store for deletion
      };
    } catch (error) {
      setUploading(false);
      setMessage("Image upload failed. Try again.");
      console.error("Upload error:", error.response?.data || error.message);
      return null;
    }
  };

 
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    let imageUrl = formData.coverImage;
    let publicId = formData.coverImageCloudinaryId;

    if (selectedFile) {
      // Upload new image
      const uploadedImage = await uploadImage();
      if (!uploadedImage) return;
      imageUrl = uploadedImage.imageUrl;
      publicId = uploadedImage.publicId;
    }

    try {
      const updatedData = { ...formData, coverImage: imageUrl, coverImageCloudinaryId:publicId };
      await updatePackage(pkg.package_id, updatedData);
      refresh();
      setMessage("Package updated successfully!");
      setTimeout(() => setMessage(""), 2000);
      setIsEditing(false);
      if (onPackageUpdated) {
        onPackageUpdated();
      }
    } catch (error) {
      console.error("Error updating package:", error);
      setMessage("Failed to update package. Please try again.");
    }
  };

  return (
    <div className="cursor-pointer transform hover:scale-105 transition-transform duration-300 group border-gray-100/30 flex w-full max-w-xs flex-col self-center overflow-hidden rounded-lg border-2 shadow-md">
      {!isEditing ? (
        <>
          <div className="relative mx-3 mt-3 flex md:h-40 h-32 overflow-hidden rounded-xl">
            <img className="absolute top-0 right-0 h-full w-full object-cover" src={previewImage || "default-placeholder.png"} alt="Package" />
          </div>
          <div className="mt-4 md:px-5 px-2 md:pb-5 pb-1">
            <h1 className="md:text-xl text-sm tracking-tight font-bold uppercase text-black">{pkg?.package_name}</h1>
            <p className="text-sm text-gray-700">{pkg?.description}</p>
            <div className="mt-2 md:mb-5 mb-2 flex items-center justify-between">
              <p>
                <span className="md:text-lg text-blue-500">{pkg?.discount_rate}% off</span>
                <span className="md:text-lg text-xs line-through mx-2">₹{pkg?.regular_price}</span>
                <span className="md:text-lg text-lg font-bold text-teal-700">₹{pkg?.discounted_price}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded-md" onClick={() => navigate(`package_details/${pkg.package_id}`)}>View</button>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded-md" onClick={handleEditToggle}>Edit</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded-md" onClick={() => onDelete(pkg.package_id)}>Delete</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <img className="w-full h-40 object-cover mb-2" src={previewImage || "default-placeholder.png"} alt="Preview" />
          <input type="file" onChange={handleFileChange} className="w-full px-3 py-1 border rounded-md mb-2" />
          <input type="text" name="package_name" value={formData.package_name} onChange={handleInputChange} placeholder="Package Name" className="w-full px-3 py-1 border rounded-md mb-2" />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full px-3 py-1 border rounded-md mb-2"></textarea>
          <input type="number" name="regular_price" value={formData.regular_price} onChange={handleInputChange} placeholder="Regular Price" className="w-full px-3 py-1 border rounded-md mb-2" />
          <input type="number" name="discount_rate" value={formData.discount_rate} onChange={handleInputChange} placeholder="Discount Rate" className="w-full px-3 py-1 border rounded-md mb-2" />
          <button className="bg-green-600 text-white px-3 py-1 rounded-md" onClick={handleUpdateSubmit}>Update Package</button>
          <button className="bg-gray-600 text-white px-3 py-1 rounded-md ml-2" onClick={handleEditToggle}>Cancel</button>
          {message && <p className="text-sm text-green-500 mt-2">{message}</p>}
        </>
      )}
    </div>
  );
};

export default PackageCard;
