import React from 'react'

const CommonHeadingSection = ({ planItem }) => {
    return (
      <div>
        <div className="each-day-headings flex bg-blue-600 rounded-t-lg text-white font-bold">
          <button className="bg-blue-950 font-bold rounded-xl lg:w-1/12 w-3/12 my-2 mx-2 p-2 ">
            Day {planItem?.day}
          </button>
          <p className="ml-5 my-5 sub-heading">{planItem?.day_Heading}</p>
          <p className="ml-4 my-5 sub-heading lg:text-lg text-xs">Included:</p>
          {planItem?.accommodations?.length > 0 && (
            <p className="my-5 ml-3 sub-heading lg:text-lg text-xs">
              {planItem?.accommodations?.length} Hotel
            </p>
          )}
          {planItem?.activities?.length > 0 && (
            <p className="my-5 ml-3 sub-heading lg:text-lg text-xs">
              {planItem?.activities?.length} Activities
            </p>
          )}
          {planItem?.foods?.length > 0 && (
            <p className="my-5 ml-3 sub-heading lg:text-lg text-xs">
              {planItem?.foods?.length} Meals
            </p>
          )}
        </div>
  
        <div className="place-details-section w-10/12 mx-auto">
          <p className="mb-5 resort-name lg:text-lg text-xs">
            {/* {planItem?.description} */}
          </p>
        </div>
      </div>
    );
  };
  

export default CommonHeadingSection