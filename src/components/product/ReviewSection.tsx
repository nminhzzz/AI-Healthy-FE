'use client';

import React, { useState, useEffect } from 'react';
import { Review } from '@/types/product';
import { reviewService } from '@/services/reviewService';
import { RatingStars } from '../common/RatingStars';

interface ReviewSectionProps {
  productId: number;
  averageRating: number;
  totalReviews: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, averageRating, totalReviews }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getReviewsByProduct(productId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await reviewService.createReview(productId, rating, comment);
      setSuccess(true);
      setComment('');
      setRating(5);
      fetchReviews(); // Tải lại danh sách
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Lỗi khi gửi đánh giá. Vui lòng đăng nhập.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Đánh giá của khách hàng</h2>
      
      {/* Thống kê tổng quan */}
      <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-5xl font-extrabold text-[#f36b21]">{averageRating.toFixed(1)}</div>
          <RatingStars rating={averageRating} size="md" />
          <div className="text-sm text-gray-500 mt-1">{totalReviews} đánh giá</div>
        </div>
      </div>

      {/* Form viết đánh giá */}
      <div className="mb-10 bg-white p-6 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Viết đánh giá của bạn</h3>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Cảm ơn bạn đã đánh giá sản phẩm!
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chấm điểm</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2 focus:border-[#458500] focus:ring-1 focus:ring-[#458500] outline-none"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Sản phẩm này như thế nào?"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#458500] hover:bg-[#386b00] text-white font-bold py-2 px-6 rounded"
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-6">
        {loading ? (
          <div>Đang tải đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <RatingStars rating={rev.rating} />
                <span className="text-xs text-gray-400">
                  {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="text-gray-800">{rev.comment}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
