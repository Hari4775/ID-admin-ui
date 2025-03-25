import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
const ActivitiesSection = ({ activities, isEditing, updateActivities }) => {
  const [activity_images, setActivityImages] = useState([]);
  console.log(activity_images, "activity_images");


  useEffect(() => {
    if (activities?.activity_images) {
      setActivityImages(activities.activity_images);
    }
  }, [activities]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [
        ...activities.activity_images,
        URL.createObjectURL(file),
      ];
      updateActivities(activities.activity_id, {
        activity_images: updatedImages,
      });
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = activities.activity_images.filter(
      (_, i) => i !== index
    );
    updateActivities(activities.activity_id, {
      activity_images: updatedImages,
    });
  };

  // activities?.activity_images.map((img, index) => (

  //   setActivityImages(img)
  // ))

  return (
    <div className="w-10/12 mx-auto md:my-10 my-4">
      <div>
        {isEditing ? (
          <input className="resort-name font-bold mb-1"  type="text" value={activities?.activity_name}
            onChange={(e) => updateActivities(activities._id, { activity_name: e.target.value,})}
          />
          ) : (
          <h1 className="font-bold mb-1 text-left text-xl">
            {activities?.activity_name}
          </h1>
        )}
      </div>

      <div className="h-48 my-5 flex overflow-x-auto custom-scrollbar">
        {activity_images.map((img, index) => (
          <div key={index} className="relative w-full">
            <img className="h-full  object-cover mx-2 rounded-xl border-2 border-blue-600"  src={img.image} alt={`Hotel Image ${index + 1}`}/>
            {isEditing && (
              <button className="absolute top-0 right-0 bg-red-500 p-1" onClick={() => handleDeleteImage(index)} >
                <FaTrash className="text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
      )}

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
      <p className="mb-2 text-xs text-left">{activities?.activity_description}</p>
    </div>
  );
};

export default ActivitiesSection;
