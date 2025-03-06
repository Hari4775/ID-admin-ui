 import React from 'react'
  
  const FoodSection = ({ food }) => {
    console.log(food,"food")

    return (
      <div className="w-10/12 mx-auto mb-2  s">
        <h1>{food?.food_name}</h1>
        {food?.food_images?.length > 0 && (
          <div className="h-48 flex">
            {food.food_images.map((img, imgIndex) => (
              <img
                key={imgIndex}
                className="h-full w-1/3 object-cover mx-2"
                src={img}
                alt={`Hotel Image ${imgIndex + 1}`}
              />
            ))}
          </div>
        )}

        <h1>{food?.food_description}</h1>
      </div>
    );
  };
  export default FoodSection