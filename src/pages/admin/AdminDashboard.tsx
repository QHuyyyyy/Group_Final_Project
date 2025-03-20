import React, { lazy, Suspense } from "react";
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminClaimStats from "../../components/admin/AdminClaimStats";

const AdminProjectStats = lazy(() => import('../../components/admin/AdminProjectStats'))
const AdminDashboard: React.FC = () => {


  return (
    <>
    <Suspense>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 ml-64  bg-sky-50">
          <div className="p-8 mt-1">
            <p className="text-2xl font-bold mb-4 font-mono" >Dashboard Overview</p>
            {/* Claim stats section */}
            <AdminClaimStats/>
            {/* Project stats section */}
            <AdminProjectStats/>
          </div>
        </div>

      </div>
      </Suspense>
    </>
  );
};

export default AdminDashboard;
