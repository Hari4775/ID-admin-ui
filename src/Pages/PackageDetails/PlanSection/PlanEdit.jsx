import React, { useState, useEffect } from 'react';
import { updatePlan } from '../../api/DayPlan/DayPlanApi';

const PlanEdit = ({ planData, onCancel, onUpdateSuccess }) => {
  const [updatedPlan, setUpdatedPlan] = useState({
    day: planData.day || 1,
    day_heading: planData.day_heading || '',
    category_id: planData.category_id || '',
    accommodation: planData.accommodation || '',
    activities: planData.activities || '',
    food: planData.food || '',
    description: planData.description || '',
  });

  const [previewImage, setPreviewImage] = useState(planData.image_url || '');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPlan((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file change for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle update functionality
  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    Object.keys(updatedPlan).forEach((key) => {
      formData.append(key, updatedPlan[key]);
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await updatePlan(planData._id, formData);
      setMessage('Plan updated successfully!');
      setTimeout(() => {
        setMessage('');
        onUpdateSuccess();
      }, 2000);
    } catch (error) {
      setMessage(`Update failed: ${error.message}`);
    }
  };

  return (
    <div className="p-5 border border-gray-300 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Edit Day Plan</h2>

      {/* Image Upload */}
      <div className="relative flex h-40 overflow-hidden rounded-md bg-gray-200 mb-4">
        {previewImage ? (
          <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <label htmlFor="imageUpload" className="absolute inset-0 flex items-center justify-center text-gray-700 cursor-pointer">
            Upload Image
          </label>
        )}
        <input type="file" id="imageUpload" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Input Fields */}
      <input type="text" name="day_heading" value={updatedPlan.day_heading} onChange={handleChange} placeholder="Day Heading" className="w-full border p-2 mb-2 rounded" />
      <input type="text" name="description" value={updatedPlan.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 mb-2 rounded" />
      <input type="text" name="accommodation" value={updatedPlan.accommodation} onChange={handleChange} placeholder="Accommodation" className="w-full border p-2 mb-2 rounded" />
      <input type="text" name="activities" value={updatedPlan.activities} onChange={handleChange} placeholder="Activities" className="w-full border p-2 mb-2 rounded" />
      <input type="text" name="food" value={updatedPlan.food} onChange={handleChange} placeholder="Food" className="w-full border p-2 mb-2 rounded" />

      {/* Update Message */}
      {message && <p className="text-sm text-green-500">{message}</p>}

      {/* Buttons */}
      <div className="flex space-x-2 mt-4">
        <button onClick={handleUpdatePlan} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default PlanEdit;
