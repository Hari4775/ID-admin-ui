import React from 'react'
import { FaTrash } from "react-icons/fa";
const AccommodationSection = ({ accommodation,isEditing,updateAccommodation }) => {
  console.log(isEditing,"editing")
  console.log(accommodation,"Accommodation");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...accommodation.hotel_images, URL.createObjectURL(file)];
      updateAccommodation(accommodation._id, { hotel_images: updatedImages });
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = accommodation.hotel_images.filter((_, i) => i !== index);
    updateAccommodation(accommodation._id, { hotel_images: updatedImages });
  };

    return (
      <div className="accomodation-image-container my-4 lg:my-12 w-10/12 mx-auto">
        <div className="flex">
          {isEditing?(
            <input
              type="text"
              value={accommodation?.hotel_name}   onChange={(e) => updateAccommodation(accommodation._id, { hotel_name: e.target.value })}            
            />
          ):(
            <h1 className="mb-2 resort-name font-bold">{accommodation?.hotel_name}</h1>
          )}
          <p className="mb-2 sub-heading ml-auto">Rating: {accommodation?.rating}</p>
        </div>

         {/* Image Display with Delete Option */}
      <div className="h-48 flex">
        {accommodation.hotel_images.map((img, index) => (
          <div key={index} className="relative">
            <img className="h-full w-1/3 object-cover" src={img} alt={`Hotel Image ${index + 1}`} />
            {isEditing && (
              <button className="absolute top-0 right-0 bg-red-500 p-1" onClick={() => handleDeleteImage(index)}>
                <FaTrash className="text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
      {isEditing && <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />}

        <div>
          <p className="mb-2 text-xs mt-2">{accommodation?.location}</p>
          <p className="mb-2 text-xs">{accommodation?.type}</p>
        </div>
      </div>
    );
  };

export default AccommodationSection