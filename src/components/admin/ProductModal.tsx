import React, { useEffect, useState } from "react";
import { Product, Category } from "@/types/product";
import { productService } from "@/services/productService";
import { uploadService } from "@/services/uploadService";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: () => void;
}

const initialForm = {
  name: "",
  slug: "",
  sku: "",
  brand: "",
  price: 0,
  sale_price: 0,
  stock: 0,
  category_id: 0,
  description: "",
  ingredients: "",
  usage_guide: "",
  benefits: "",
  warnings: "",
  image_url: "",
  is_active: true,
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brand: product.brand || "",
        price: product.price,
        sale_price: product.sale_price || 0,
        stock: product.stock,
        category_id: product.category_id,
        description: product.description || "",
        ingredients: product.ingredients || "",
        usage_guide: product.usage_guide || "",
        benefits: product.benefits || "",
        warnings: product.warnings || "",
        image_url: product.image_url || "",
        is_active: product.is_active,
      });
    } else {
      setFormData({
        ...initialForm,
        category_id: categories.length > 0 ? categories[0].id : 0,
      });
    }
  }, [product, categories, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setFormData((prev: any) => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error(err);
      alert("Lỗi tải ảnh lên Cloudinary");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.sale_price) payload.sale_price = null; // Backend accepts null

      if (product) {
        await productService.adminUpdateProduct(product.id, payload);
      } else {
        await productService.adminCreateProduct(payload);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Lỗi khi lưu sản phẩm");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          {product ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                required
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá cơ bản *
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá khuyến mãi (Tùy chọn)
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded p-2 bg-emerald-50 text-sm focus:border-emerald-500 outline-none"
                value={formData.sale_price || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sale_price: e.target.value ? Number(e.target.value) : 0,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thương hiệu
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tồn kho (Stock) *
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full border border-gray-300 rounded p-2 bg-yellow-50 font-bold text-sm focus:border-yellow-500 outline-none"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col justify-end pb-2">
              <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                Cho phép bán sản phẩm
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh sản phẩm
            </label>
            {formData.image_url && (
              <div className="mb-2 relative w-48 h-48 bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image_url}
                  alt="Product Preview"
                  className="object-contain max-h-full max-w-full"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: "" })}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 text-xs shadow"
                  title="Xóa ảnh"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tải ảnh lên
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-1">
                    Đang tải ảnh lên...
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Hoặc dán URL hình ảnh
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả ngắn
            </label>
            <textarea
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành phần{" "}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                rows={3}
                placeholder="Ví dụ: Vitamin C 500mg, Zinc 15mg..."
                value={formData.ingredients || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hướng dẫn sử dụng{" "}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                rows={3}
                placeholder="Ví dụ: Uống 1 viên sau ăn sáng..."
                value={formData.usage_guide || ""}
                onChange={(e) =>
                  setFormData({ ...formData, usage_guide: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Công dụng nổi bật{" "}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                rows={3}
                placeholder="Ví dụ: Tăng đề kháng, giảm mệt mỏi..."
                value={formData.benefits || ""}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cảnh báo an toàn
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                rows={3}
                placeholder="Ví dụ: Không dùng cho người cao huyết áp..."
                value={formData.warnings || ""}
                onChange={(e) =>
                  setFormData({ ...formData, warnings: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium text-sm hover:bg-gray-300 transition-colors"
              disabled={uploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition-colors"
              disabled={uploading}
            >
              Lưu Sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
