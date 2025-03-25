 import React from 'react'
  
  const FoodSection = ({ food }) => {
    return (
      <div className="w-10/12 mx-auto mb-2">
        <h1 className='text-left font-bold text-xl mb-5'>{food?.food_name}</h1>
        {food?.food_images?.length > 0 && (
          <div className="h-48 flex mb-2 ">
            {food.food_images.map((img, imgIndex) => (
              <img key={imgIndex} className="h-full w-1/3 object-cover mx-2 rounded-xl border-2 border-blue-600 " src={img.image} alt={`Hotel Image ${imgIndex + 1}`}/>
            ))}
          </div>
        )}

        <h1 className='text-left'>{food?.food_description}</h1>
      </div>
    );
  };
  export default FoodSection