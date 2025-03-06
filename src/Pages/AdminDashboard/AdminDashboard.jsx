import { useEffect, useState } from "react";
import PackageForm from "./Card.jsx/PackageForm"
import PackageCard from "./Card.jsx/PackageCard";
import { deletePackage, getPackages } from "../../api/package/packageAPI";

const AdminDashboard = () => {
  const [packages, setPackages] = useState([]);


  const fetchPackages = async () => {
    try {
      const response = await getPackages();
      setPackages(response?.data?.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };



  const handleDeletePackage = async (packageId) => {
    try {
      await deletePackage(packageId);
      fetchPackages(); // Refresh the package list after deletion
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="dashboard w-full h-screen pt-10">
      <div className="w-11/12 mx-auto flex flex-col justify-items-center">
        <h2 className="mt-20 mb-5 text-3xl font-bold text-center">Packages</h2>
        <div className="w-full py-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <PackageForm refreshPackages={fetchPackages}  />
          {packages?.length > 0 ? (
            packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} onDelete={handleDeletePackage} refresh={fetchPackages} />
            ))
          ) : (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-center">No packages found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
