import React, { useState } from "react";
import axios from "axios";
import { createPackage } from "../../../api/package/packageAPI";

const PackageForm = ({refreshPackages }) => {
  const [formData, setFormData] = useState({
    package_name: "",
    description: "",
    regular_price: "",
    discounted_price: "",
    discount_rate: "",
    coverImage: "",
    coverImageCloudinaryId: "",
  });

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

      if (name === "regular_price" || name === "discount_rate") {
        const regularPrice = parseFloat(updatedData.regular_price) || 0;
        const discountRate = parseFloat(updatedData.discount_rate) || 0;

        if (discountRate >= 0 && discountRate <= 100) {
          updatedData.discounted_price = (regularPrice - (regularPrice * discountRate) / 100).toFixed(2);
        }
      }

      return updatedData;
    });
  };

  const handleCancel = () => {
    setFormData({
      package_name: "",
      description: "",
      regular_price: "",
      discounted_price: "",
      discount_rate: "",
      coverImage: "",
      coverImageCloudinaryId: "",
    });
    setPreviewImage("");
    setSelectedFile(null);
    setMessage("");
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
        coverImage: response.data.secure_url,
        coverImageCloudinaryId: response.data.public_id,
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
      coverImage: formData.coverImage,
      coverImageCloudinaryId: formData.coverImageCloudinaryId,
    };

    if (selectedFile) {
      const uploadedImage = await uploadImage();
      if (!uploadedImage) return;
      imageDetails = uploadedImage;
    }

    try {
      await createPackage({ ...formData, ...imageDetails });
      setMessage("Package created successfully!");
      setTimeout(() => setMessage(""), 2000);
      refreshPackages();
      setFormData({
        package_name: "",
        description: "",
        regular_price: "",
        discounted_price: "",
        discount_rate: "",
        coverImage: "",
        coverImageCloudinaryId: "",
      });
      setPreviewImage("");
      setSelectedFile(null);
    } catch (error) {
      setMessage(`Failed to create package. Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4  overflow-hidden rounded-lg border-2 shadow-md">
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
          id="coverImage"
          name="coverImage"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>

      <div className="w-10/12 mx-auto">
        <input
          type="text"
          placeholder="Name"
          name="package_name"
          value={formData.package_name}
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
            name="regular_price"
            value={formData.regular_price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-1 text-xs text-center"
          />
        </div>
        <div className="mx-2 w-3/12">
          <input
            type="number"
            placeholder="Discount %"
            name="discount_rate"
            value={formData.discount_rate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-1 text-xs text-center"
          />
        </div>
        <div className="w-4/12">
          <input
            type="number"
            placeholder="Final Price"
            name="discounted_price"
            value={formData.discounted_price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-1 text-xs text-center"
          />
        </div>
      </div>

      <div className="flex space-x-2 w-11/12 mx-auto pb-5">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-8 rounded-lg"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Create Package"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 h-8 rounded-lg"
        >
          Cancel
        </button>
      </div>
      {message && <p className="text-center text-gray-700 mt-4">{message}</p>}
    </form>
  );
};

export default PackageForm;