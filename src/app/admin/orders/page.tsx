'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Order, orderService } from '@/services/orderService';
import { AdminOrderFilters } from '@/components/admin/orders/AdminOrderFilters';
import { AdminOrderList } from '@/components/admin/orders/AdminOrderList';
import { AdminOrderDetailModal } from '@/components/admin/orders/AdminOrderDetailModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const statusParam = statusFilter === 'ALL' ? undefined : statusFilter;
      const searchParam = debouncedSearchQuery.trim() || undefined;

      const data = await orderService.adminGetOrders({
        skip,
        limit,
        status: statusParam,
        search: searchParam,
      });

      setOrders(data);
      setHasMore(data.length === limit);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearchQuery, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1); // Reset to page 1 on status change
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const updatedOrder = await orderService.adminUpdateOrderStatus(orderId, newStatus);
      // Update selected order in state to reflect change immediately inside modal
      setSelectedOrder(updatedOrder);
      // Refresh list to update status in the table
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title section - Flat layout */}
      <div className="bg-white p-6 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem lịch sử đơn hàng, cập nhật trạng thái thanh toán và vận chuyển.
          </p>
        </div>
      </div>

      {/* Filter and List wrapper */}
      <div className="bg-white p-6 rounded-lg">
        <AdminOrderFilters
          currentStatus={statusFilter}
          onStatusChange={handleStatusFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <AdminOrderList
          orders={orders}
          loading={loading}
          onViewDetails={handleViewDetails}
          page={page}
          onPageChange={setPage}
          hasMore={hasMore}
        />
      </div>

      {/* Order details modal */}
      <AdminOrderDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
