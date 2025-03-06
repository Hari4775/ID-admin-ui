import React, { useEffect, useState } from 'react';
import { createPlan } from '../../../api/DayPlan/DayPlanApi';
import FoodSection from './FoodSection';
import ActivitiesSection from './ActivitySection';
import CommonHeadingSection from './CommonHeadingSection';
import AccommodationSection from './AccomodationSection';
import { FaPen } from 'react-icons/fa'; // Import pen icon

const PlanCard = ({ planData }) => {
  const [planCategorySection, setPlanCategorySection] = useState('features');
  const [dayPlan, setDayPlan] = useState(planData || []);

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(planData.image_url || "");
  const [images, setImages] = useState(null);

  const handleEditToggle = () => setIsEditing((prev) => !prev); 
  console.log(dayPlan,"day plan updated")

  const updateAccommodation = (accommodationId, updatedData) => {
    setDayPlan((prevPlan) =>
      prevPlan.map((day) => ({
        ...day,
        accommodations: day.accommodations.map((acc) =>
          acc._id === accommodationId ? { ...acc, ...updatedData } : acc
        ),
      }))
    );
  };
  


  // Update activities
  const updateActivities = (activityId, updatedData) => {
    setDayPlan((prevPlan) =>
      prevPlan.map((day) => ({
        ...day,
        activities: day.activities.map((act) =>
          act._id === activityId ? { ...act, ...updatedData } : act
        ),
      }))
    );
  };
   

  // Update food
  const updateFood = (foodId, updatedData) => {
    setDayPlan((prevPlan) =>
      prevPlan.map((day) => ({
        ...day,
        foods: day.foods.map((fod) =>
          fod._id === foodId ? { ...fod, ...updatedData } : fod
        ),
      }))
    );
  };
   
 

  const handleUpdatePlan = async () => {
    setMessage("");

  
    try {
      await createPlan(dayPlan);
      setMessage(`Day plan updated successfully!`);
      setTimeout(() => setMessage(""), 2000);
      setIsEditing(false);
    } catch (error) {
      setMessage(`Failed to update category. Error: ${error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (planData) {
      setDayPlan(planData);
    }
  }, [planData]);

  const planCategoryUnderLines = (section) => {
    return planCategorySection === section
      ? 'border-b-4 border-[blue] font-bold text-[blue] opacity-100'
      : 'border-b-2 border-transparent text-white text-opacity-50';
  };

  const calculateTotals = () => {
    let totalDays = dayPlan.length;
    let totalActivities = 0;
    let totalFood = 0;
    let totalAccommodations = 0;

    dayPlan.forEach((day) => {
      if (day?.activities) totalActivities += day.activities.length;
      if (day?.foods) totalFood += day.foods.length;
      if (day?.accommodations) totalAccommodations += day.accommodations.length;
    });

    return { totalDays, totalActivities, totalFood, totalAccommodations };
  };

  const totals = calculateTotals();

  const renderSelectedSection = () => {
    switch (planCategorySection) {
      case 'features':
        return (
          <div className="features-container w-11/12 mx-auto">
            <h1>Features</h1>
              <p>{dayPlan?.description}</p>
          </div>
        );

      case 'day':
        return (
          <div className="day-plan-data-container w-11/12 mx-auto h-80 overflow-y-scroll mb-3">
            {dayPlan.map((planItem, index) => (
              <div key={index}>
                <CommonHeadingSection planItem={planItem} />
                
                {planItem?.accommodations?.map((accommodationItem) => (
                  <AccommodationSection
                    key={accommodationItem?._id}
                    accommodation={accommodationItem}
                    isEditing={isEditing}
                    updateAccommodation={updateAccommodation}
                  />
                ))}
             
                  <p>{planItem?.description}</p>
              
                {planItem?.activities?.map((activityItem) => (
                  <ActivitiesSection
                    key={activityItem?._id}
                    activities={activityItem}
                    isEditing={isEditing}
                    updateActivities={updateActivities}
                  />
                ))}
                {planItem?.foods?.map((foodItem, foodIndex) => (
                  <FoodSection
                    key={foodIndex}
                    food={foodItem}
                    isEditing={isEditing}
                    updateFood={updateFood}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case 'accomadation':
        return (
          <div className="day-plan-data-container w-11/12 mx-auto h-80 overflow-y-scroll mb-3">
            {dayPlan.map((planItem, index) => (
              <div key={index}>
                <CommonHeadingSection planItem={planItem} />
                {planItem?.accommodations?.map((accommodationItem) => (
                  <AccommodationSection
                    key={accommodationItem?._id}
                    accommodation={accommodationItem}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case 'activity':
        return (
          <div className="day-plan-data-container w-11/12 mx-auto h-80 overflow-y-scroll mb-3">
            {dayPlan.map((planItem, index) => (
              <div key={index}>
                <CommonHeadingSection planItem={planItem} />
                {planItem?.activities?.map((activityItem) => (
                  <ActivitiesSection
                    key={activityItem?._id}
                    activities={activityItem}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case 'food':
        return (
          <div className="day-plan-data-container w-11/12 mx-auto h-80 overflow-y-scroll mb-3">
            {dayPlan.map((planItem, index) => (
              <div key={index}>
                <CommonHeadingSection planItem={planItem} />
                {planItem?.foods?.map((foodItem, foodIndex) => (
                  <FoodSection key={foodIndex} food={foodItem} />
                ))}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="image-container w-full ml-auto">
        <div className="menu-bar flex w-full lg:space-x-12 space-x-2">
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center"
            onClick={isEditing ? handleUpdatePlan : handleEditToggle}
          >
            {isEditing ? 'Save' : 'Edit'} <FaPen className="ml-2" />
          </button>
          <p
            className={`sub-heading lg:text-lg text-xs my-5 lg:ml-5 ${planCategoryUnderLines(
              'features'
            )} transition-all duration-300 ease-in-out`}
            onClick={() => setPlanCategorySection('features')}
          >
            Features
          </p>
          <p
            className={`sub-heading lg:text-lg text-xs my-5 ${planCategoryUnderLines(
              'day'
            )} transition-all duration-300 ease-in-out`}
            onClick={() => setPlanCategorySection('day')}
          >
            {totals.totalDays} Days Plan
          </p>
          <p
            className={`sub-heading lg:text-lg text-xs my-5 ${planCategoryUnderLines(
              'accomadation'
            )} transition-all duration-300 ease-in-out`}
            onClick={() => setPlanCategorySection('accomadation')}
          >
            {totals.totalAccommodations} Hotels
          </p>
          <p
            className={`sub-heading lg:text-lg text-xs my-5 ${planCategoryUnderLines(
              'activity'
            )} transition-all duration-300 ease-in-out`}
            onClick={() => setPlanCategorySection('activity')}
          >
            {totals.totalActivities} Activities
          </p>
          <p
            className={`sub-heading lg:text-lg text-xs my-5 ${planCategoryUnderLines(
              'food'
            )} transition-all duration-300 ease-in-out`}
            onClick={() => setPlanCategorySection('food')}
          >
            {totals.totalFood} Meals
          </p>
        </div>

        <div className="plan-details-container flex w-full">
          {renderSelectedSection()}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;