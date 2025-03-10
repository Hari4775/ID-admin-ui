import React, { useEffect, useState } from "react";
import { getCategories } from "../../api/Category/CategoryApi";
import CategoryCard from "./CategorySection/CategoryCard";
import { Link, useParams } from "react-router-dom";
import { getPlan } from "../../api/DayPlan/DayPlanApi";
import PlanCard from "./PlanSection/PlanCard";
import PlanForm from "./PlanSection/PlanForm";
import CategoryForm from "./CategorySection/CategoryForm";

const AdminPackageDetails = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [planData, setPlanData] = useState([]);
  const [isCreateplan, setIsCreatePlan] = useState(false);

  const { package_id } = useParams();
  const [categories, setCategories] = useState([]);

  console.log(categories, "categories");
  console.log(selectedCategoryId,"selectedCategoryId");
  

  const handleViewPlan = (category_id) => {
    setSelectedCategoryId(category_id);
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories(package_id);
      setCategories(response?.data?.categories);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log(selectedCategoryId, "cat id");
  console.log(planData, "plandata");

  const handleCreatePlan = () => setIsCreatePlan((prev) => !prev);

  const fetchDayPlan = async () => {
    try {
      if (selectedCategoryId) {
        const response = await getPlan(selectedCategoryId);
        if (response?.data) {
          // Ensure planData is an array
          setPlanData(
            Array.isArray(response.data) ? response.data : [response.data]
          );
        }
      }

      setIsCreatePlan(false);
    } catch (err) {
      console.log(err, "error getting the planData");
    }
  };

  useEffect(() => {
    fetchDayPlan();
  }, [selectedCategoryId]);

  return (
    <>
    <div className=" mr-2 ">
     <Link to="/">
         <img className="w-8 h-4 mr-4" src="https://e7.pngegg.com/pngimages/622/678/png-clipart-computer-icons-arrow-symbol-back-button-blue-angle.png" alt=""/>
         </Link>
         </div>
         <div className="w-full items-center justify-items-center">
      <h1>Package Categories</h1>
      
      <div>
        <div className="w-full py-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <CategoryForm refreshCategories={fetchCategories} />
          {categories?.length > 0 ? (
            categories.map((cat) => (
              <CategoryCard
                key={cat.category_id}
                category={cat}
                refresh={fetchCategories}
                onViewPlan={handleViewPlan}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-full w-full col-span-full">
              <p className="text-center">No Category found</p>
            </div>
          )}
        </div>
      </div>

      {selectedCategoryId && (
        <>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md mb-4"
            onClick={handleCreatePlan}
          >
            Create New Plan
          </button>

          {isCreateplan && (
            <PlanForm categoryId={selectedCategoryId} refresh={fetchDayPlan} />
          )}

          {planData.length > 0 ? (
            <div className="bg-slate-500 w-11/12 mx-auto py-10">

              <h2>Day Plan for Category {selectedCategoryId}</h2>


              {planData.map((plan) => (
                <PlanCard
                  key={plan.plan_id || plan._id}
                  planData={plan.plans}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full w-full col-span-full">
              <p className="text-center">No Plan found for this category</p>
            </div>
          )}
        </>
      )}
    </div>

    </>
  );
};

export default AdminPackageDetails;
