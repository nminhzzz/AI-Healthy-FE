'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import apiClient from '@/services/apiClient';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Lấy thông tin Sản phẩm & Kho hàng (Đã có API)
        const products = await productService.adminGetProducts();
        const lowStock = products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock).slice(0, 5);
        
        setLowStockProducts(lowStock);
        
        let usersCount = 0;
        let ordersData: any[] = [];
        let revenue = 0;

        // 2. Lấy thông tin Users (Try-Catch vì có thể API chưa hoàn thiện)
        try {
          const resUsers = await apiClient.get('/admin/users');
          usersCount = resUsers.data?.length || 0;
        } catch (error) {
          console.log('User API chưa sẵn sàng:', error);
        }

        // 3. Lấy thông tin Đơn hàng (Try-Catch)
        try {
          const resOrders = await apiClient.get('/admin/orders/');
          ordersData = resOrders.data || [];
          revenue = ordersData.reduce((acc, order) => acc + (order.total_price || 0), 0);
        } catch (error) {
          console.log('Order API chưa sẵn sàng:', error);
        }

        setStats({
          totalRevenue: revenue,
          totalOrders: ordersData.length,
          totalProducts: products.length,
          totalUsers: usersCount,
        });

        setRecentOrders(ordersData.slice(0, 5));

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const summaryCards = [
    { title: 'Tổng doanh thu', value: `${stats.totalRevenue.toLocaleString('vi-VN')}₫`, trend: '+0%', color: 'text-emerald-600', icon: '💰' },
    { title: 'Đơn hàng mới', value: stats.totalOrders.toString(), trend: '+0%', color: 'text-blue-600', icon: '🛒' },
    { title: 'Tổng sản phẩm', value: stats.totalProducts.toString(), trend: '+0%', color: 'text-orange-600', icon: '📦' },
    { title: 'Khách hàng', value: stats.totalUsers.toString(), trend: '+0%', color: 'text-purple-600', icon: '👥' },
  ];

  if (loading) {
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
              <h3 className={`text-2xl font-black ${card.color}`}>{card.value}</h3>
              <p className="text-sm text-gray-400 mt-2">
                <span className="text-green-500 font-medium">{card.trend}</span> so với tháng trước
              </p>
            </div>
            <div className="text-4xl opacity-80">{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center">
            Đơn hàng gần đây
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">Xem tất cả</Link>
          </h2>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">Chưa có đơn hàng nào.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã ĐH</th>
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order, i) => {
                    const statusBadgeClass = 
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'SHIPPING' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800';

                    const statusLabel = 
                      order.status === 'PENDING' ? 'Chờ duyệt' :
                      order.status === 'PAID' ? 'Đã thanh toán' :
                      order.status === 'SHIPPING' ? 'Đang giao' :
                      order.status === 'COMPLETED' ? 'Hoàn thành' :
                      'Đã hủy';

                    return (
                      <tr key={i}>
                        <td className="py-3 text-sm font-semibold text-blue-600">{order.order_code}</td>
                        <td className="py-3 text-sm font-medium text-gray-600">
                          {order.receiver_name || `Khách hàng #${order.user_id}`}
                        </td>
                        <td className="py-3 text-sm">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${statusBadgeClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-right font-black text-slate-800">
                          {order.total_price?.toLocaleString('vi-VN')}₫
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-red-600">⚠️ Cảnh báo tồn kho</h2>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">Tất cả sản phẩm đều đủ hàng.</p>
            ) : (
              lowStockProducts.map((prod) => (
                <div key={prod.id} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1 pr-2">
                    <p className="text-sm font-bold text-gray-800 truncate" title={prod.name}>{prod.name}</p>
                    <p className="text-xs text-gray-500">SKU: {prod.sku}</p>
                  </div>
                  <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                    Còn {prod.stock}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/products" className="block text-center mt-6 text-sm font-medium text-blue-600 hover:underline">
            Quản lý kho hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
