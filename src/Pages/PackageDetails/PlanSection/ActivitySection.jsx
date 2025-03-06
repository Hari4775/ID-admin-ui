import React from 'react'
import { FaTrash } from "react-icons/fa";
const ActivitiesSection = ({ activities,isEditing,updateActivities  }) => {
    console.log(activities,"activities")

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const updatedImages = [...activities.activity_images, URL.createObjectURL(file)];
        updateActivities(activities.activity_id, { activity_images: updatedImages });
      }
    };
  
    const handleDeleteImage = (index) => {
      const updatedImages = activities.activity_images.filter((_, i) => i !== index);
      updateActivities(activities.activity_id, { activity_images: updatedImages });
    };

    
    return (
      <div className="w-10/12 mx-auto md:my-10 my-4">
        <div>
        {isEditing?(
            <input className="resort-name font-bold mb-1"
              type="text"
              value={activities?.activity_name}   onChange={(e) => updateActivities(activities._id, {activity_name: e.target.value })}            
            />
          ):(
          <h1 className="resort-name font-bold mb-1">{activities?.activity_name}</h1>
          )}
        </div>

         <div className="h-48 flex overflow-x-auto custom-scrollbar">
                {activities.activity_images.map((img, index) => (
                  <div key={index} className="relative">
                    <img className="h-full  object-cover mx-2" src={img} alt={`Hotel Image ${index + 1}`} />
                    {isEditing && (
                      <button className="absolute top-0 right-0 bg-red-500 p-1" onClick={() => handleDeleteImage(index)}>
                        <FaTrash className="text-white" />
                      </button>
                    )}
                  </div>
                ))}
          </div>
          {isEditing && <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />}


        {/* {activities?.activity_images.length > 0 && (
          <div className="h-48 flex overflow-x-auto custom-scrollbar">
            {activities.activity_images.map((img, imgIndex) => (
              <img
                key={imgIndex}
                className="h-full mx-2"
                src={img}
                alt={`Activity Image ${imgIndex + 1}`}
              />
            ))}
          </div>
        )} */}
        <p className="mb-2 text-xs">{activities?.activity_description}</p>

      </div>
    );
  };

export default ActivitiesSection