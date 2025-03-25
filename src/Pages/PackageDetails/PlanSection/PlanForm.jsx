import React, { useState } from 'react';
import { createPlan } from '../../../api/DayPlan/DayPlanApi';
import { useParams } from 'react-router-dom';

const PlanForm = ({ categoryId, refresh}) => {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dr1ogkaha/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "my_preset";
      const { package_id } = useParams();
    

    const [planData, setPlanData] = useState({
        day: "",
        day_heading: "",
        category_id: categoryId,
        accommodations: [],
        activities: [],
        foods: [],
        description: "",
        package_id:package_id
    });

    const [message, setMessage] = useState("");
    

    const [isplan, setPlan] = useState(false);
    
    const handleCancelPlan = () => setPlan(true);

    const uploadImageToCloudinary = async (files) => {
        return Promise.all(
            Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                try {
                    const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
                    const data = await response.json();
                    return data.secure_url;
                } catch (error) {
                    console.error("Image upload failed", error);
                    return "";
                }
            })
        );
    };

    const handleFileUpload = async (files, index, section, field) => {
        const uploadedUrls = await uploadImageToCloudinary(files);
        setPlanData((prev) => {
            const updatedSection = [...prev[section]];
            const existingImages = updatedSection[index][field] || [];
            const newImages = uploadedUrls.filter(url => !existingImages.includes(url)); // Prevent duplicates
            updatedSection[index][field] = [...existingImages, ...newImages];
            return { ...prev, [section]: updatedSection };
        });
    };

    const handleInputChange = (index, field, value, section) => {
        setPlanData((prev) => {
            const updatedSection = [...prev[section]];
            updatedSection[index][field] = value;
            return { ...prev, [section]: updatedSection };
        });
    };

    const removeImage = (index, imgIndex, section, field) => {
        setPlanData((prev) => {
            const updatedSection = [...prev[section]];
            updatedSection[index][field] = updatedSection[index][field].filter((_, i) => i !== imgIndex);
            return { ...prev, [section]: updatedSection };
        });
    };

    const addNewEntry = (section, newEntry) => {
        setPlanData((prev) => ({ ...prev, [section]: [...prev[section], newEntry] }));
    };

    const removeEntry = (section, index) => {
        setPlanData((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }));
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await createPlan(planData);
            setMessage("New day plan created successfully!");
            setTimeout(() => setMessage(""), 2000);
            refresh();
        } catch (error) {
            setMessage(`Failed to create plan. Error: ${error.message}`);
            console.error(error);
        }
    };

    return (

        
        <div className="p-4 w-11/12 mx-auto bg-green-300 rounded-xl ">
            <form onSubmit={handleCreatePlan} className="space-y-4">

              
                
                {/* ✅ Day Selection */}
                {!isplan?(
                    <div className=''>
                    <div className='w-full flex space-x-3 mb-5'>
                       <select name="day" value={planData.day} onChange={(e) => setPlanData({ ...planData, day: e.target.value })} className=" border p-2 rounded w-1/12">
                          <option value="">Select Day</option>
                             {[...Array(10).keys()].map((day) => (
                           <option key={day + 1} value={day + 1}>Day {day + 1}</option>
                             ))}
                       </select>

                       <input type="text" name="day_heading" value={planData.day_heading} onChange={(e) => setPlanData({ ...planData, day_heading: e.target.value })} placeholder="Day Heading" className="w-11/12 border p-2 rounded font-bold text-xl" />
                   </div>
                   <textarea type="text" name="description" value={planData.description} onChange={(e) => setPlanData({ ...planData, description: e.target.value })} placeholder="Description" className="w-full border p-2 rounded" />
                   </div>

                ):null}
                



                <div className='flex overflow-x-scroll'>
                <button type="button" onClick={() => addNewEntry("accommodations", { hotel_name: "", hotel_description: "", hotel_images: [] })} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-5">+ Add Accommodation</button>


                {/* ✅ Accommodations */}
                {planData.accommodations.map((accommodation, index) => (
                    <div key={index} className="border p-3 rounded w-1/4 mx-1">
                        <input type="text" placeholder="Hotel Name" value={accommodation.hotel_name} onChange={(e) => handleInputChange(index, "hotel_name", e.target.value, "accommodations")} className="w-full border p-2 rounded mb-2" />
                        <select name="Hotel Type" value={accommodation.hotel_type} onChange={(e) => setPlanData({ ...planData, day: e.target.value })} className="w-full border p-2 rounded">
                             <option value="">Hotel Type</option>
                                {[...Array(10).keys()].map((day) => (
                             <option key={day + 1} value={day + 1}>Day {day + 1}</option>
                             ))}
                       </select>
                        <input type="text" placeholder="Hotel Type" value={accommodation.hotel_description} onChange={(e) => handleInputChange(index, "hotel_description", e.target.value, "accommodations")} className="w-full border p-2 rounded mb-2" />
                        <input type="text" placeholder="Hotel Description" value={accommodation.hotel_description} onChange={(e) => handleInputChange(index, "hotel_description", e.target.value, "accommodations")} className="w-full border p-2 rounded mb-2" />
                        <input type="file" multiple onChange={(e) => handleFileUpload(e.target.files, index, "accommodations", "hotel_images")} />
                        <div className="flex space-x-2 mt-2">
                        {accommodation.hotel_images?.map((img, i) => (
                                <div key={i} className="relative">
                                    <img src={img} alt="Hotel" className="w-16 h-16 object-cover rounded" />
                                    <button type="button" onClick={() => removeImage(index, i, "accommodations", "hotel_images")} className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded">X</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => removeEntry("accommodations", index)} className="bg-red-500 text-white px-3 py-1 mt-2">Remove</button>
                    </div>
                ))}
                </div>


                {/* ✅ Activities */}
                <div className='flex overflow-x-scroll'>
                <button type="button" onClick={() => addNewEntry("activities", { activity_name: "", activity_description: "", activity_images: [] })} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-5">+ Add Activity</button>

                {planData.activities.map((activity, index) => (
                    <div key={index} className="border p-3 rounded-lg w-1/4 mx-1">
                        <input type="text" placeholder="Activity Name" value={activity.activity_name} onChange={(e) => handleInputChange(index, "activity_name", e.target.value, "activities")} className="w-full border p-2 rounded mb-2" />
                        <input type="text" placeholder="Description" value={activity.activity_description} onChange={(e) => handleInputChange(index, "activity_description", e.target.value, "activities")} className="w-full border p-2 rounded mb-2" />
                        <input type="file" multiple onChange={(e) => handleFileUpload(e.target.files, index, "activities", "activity_images")} />
                        <div className="flex space-x-2 mt-2">
                            {activity.activity_images?.map((img, i) => (
                                 <div key={i} className="relative">
                                 <img src={img} alt="Hotel" className="w-16 h-16 object-cover rounded" />
                                 <button type="button" onClick={() => removeImage(index, i, "activities", "activity_images")} className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded">X</button>
                             </div>
                                // <img key={i} src={img} alt="Activity" className="w-16 h-16 object-cover rounded" />
                            ))}
                        </div>
                        <button type="button" onClick={() => removeEntry("activities", index)} className="bg-red-500 text-white px-3 py-1 mt-2">Remove</button>
                    </div>
                ))}
                </div>

                {/* ✅ Foods */}
                <div className='flex overflow-x-scroll'>
                <button type="button" onClick={() => addNewEntry("foods", { food_name: "", food_description: "", food_images: [] })} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-5">+ Add Food</button>

                {planData.foods.map((food, index) => (
                    <div key={index} className="border p-3 rounded-lg w-1/4 mx-1">
                        <input type="text" placeholder="Food Name" value={food.food_name} onChange={(e) => handleInputChange(index, "food_name", e.target.value, "foods")} className="w-full border p-2 rounded mb-2" />
                        <input type="text" placeholder="Description" value={food.food_description} onChange={(e) => handleInputChange(index, "food_description", e.target.value, "foods")} className="w-full border p-2 rounded mb-2" />
                        <input type="file" multiple onChange={(e) => handleFileUpload(e.target.files, index, "foods", "food_images")} />
                        <div className="flex space-x-2 mt-2">
                            {food.food_images?.map((img, i) => (
                                <div key={i} className="relative">
                                <img src={img} alt="food" className="w-16 h-16 object-cover rounded" />
                                <button type="button" onClick={() => removeImage(index, i, "foods", "food_images")} className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded">X</button>
                               </div>
                                // <img key={i} src={img} alt="Food" className="w-16 h-16 object-cover rounded" />
                            ))}
                        </div>
                        <button type="button" onClick={() => removeEntry("foods", index)} className="bg-red-500 text-white px-3 py-1 mt-2">Remove</button>
                    </div>
                ))}
                </div>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mx-2 font-bold">Create Plan</button>
                {message && <p className="text-center text-green-600">{message}</p>}


                <button type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={handleCancelPlan} >Cancel</button>
            </form>
        </div>
    );
};

export default PlanForm;
