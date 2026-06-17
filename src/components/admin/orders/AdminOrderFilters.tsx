import React from 'react';

interface AdminOrderFiltersProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả đơn' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export const AdminOrderFilters: React.FC<AdminOrderFiltersProps> = ({
  currentStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Tab filter trạng thái - flat design, borderless */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-lg">
        {STATUS_OPTIONS.map((option) => {
          const isActive = currentStatus === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Tìm kiếm phẳng - border-0 */}
      <div className="w-full md:w-80">
        <input
          type="text"
          placeholder="Tìm mã đơn, tên, sđt..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors placeholder-slate-400 border-none"
        />
      </div>
    </div>
  );
};
