import React, { lazy, Suspense } from "react";
import AdminSidebar from '../../components/admin/AdminSidebar';


const AdminUserStats = lazy(() => import('../../components/admin/AdminUserStats'))
const AdminClaimStats = lazy(() => import('../../components/admin/AdminClaimStats'))
const AdminProjectStats = lazy(() => import('../../components/admin/AdminProjectStats'))
const AdminDashboard: React.FC = () => {


  return (
    <>
      <Suspense>
        <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1 ml-64  bg-sky-50">
            <div className="p-8 mt-1">
              <div className="relative bg-white rounded-xl shadow-lg mb-8 p-3">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl opacity-50"></div>

                <div className="relative flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 rounded-lg p-2 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>

                    <div className="pt-4">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Dashboard Overview
                      </h1>
                    </div>
                  </div>
                </div>

              </div>
              {/* Claim stats section */}
              <AdminClaimStats />
              {/* Project stats section */}
              <AdminProjectStats />
              {/* User stats section */}
              <AdminUserStats />
            </div>
          </div>

        </div>
      </Suspense>
    </>
  );
};

export default AdminDashboard;
