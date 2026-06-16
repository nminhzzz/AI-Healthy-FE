import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard - HealthShop AI',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 absolute inset-0 z-50">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header of Admin Panel */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center px-6 shadow-sm flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-700">Trang quản trị hệ thống</h2>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Admin User</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                AD
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
