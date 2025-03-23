import React, { useState } from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  // const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm tính trung bình rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  // Lấy averageRating từ dữ liệu sản phẩm hoặc tính lại
  const averageRating =
    product.averageRating ?? calculateAverageRating(product.reviews);

  // const handleAddToWishlist = async () => {
  //   if (isLoading) return;

  //   const userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     alert("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/wishlists/${userId}/products/${product.id}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       setIsFavorite(true);
  //     } else {
  //       console.error("Failed to add to wishlist");
  //     }
  //   } catch (error) {
  //     console.error("Error adding to wishlist:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
      <Link to={`/product/${product.id}`} className="block">
        {/* Hình ảnh sản phẩm */}
        <div className="relative overflow-hidden rounded-lg mb-3 h-48 bg-gray-50 flex items-center justify-center">
          <img
            src={product.primaryImage?.url || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-110 p-2"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Mới
            </span>
          )}
          {product.discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
          {product.category.name}
        </p>

        <h4 className="font-semibold h-12 text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h4>

        {/* Hiển thị đánh giá trung bình */}
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="text-sm font-medium">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-400 text-xs ml-1">
            ({product.reviews?.length || 0} đánh giá)
          </span>
        </div>

        {/* Giá sản phẩm */}
        <div className="flex items-end gap-2 mb-3">
          <p className="text-blue-600 font-bold text-lg">
            {product.price.toLocaleString()} đ
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-gray-400 text-sm line-through">
              {product.originalPrice.toLocaleString()} đ
            </p>
          )}
        </div>
      </Link>

      {/* Nút hành động */}
      <div className="flex gap-2 mt-2">
        <Link
          to={`/product/${product.id}`}
          className="flex-1 text-center bg-blue-500 text-white px-3 py-2 rounded-full 
          transition duration-300 hover:bg-blue-700 text-sm font-medium">
          Xem chi tiết
        </Link>
        {/* <button
          className={`p-2 rounded-full transition duration-300 ${
            isFavorite
              ? "bg-red-100 text-red-500"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          aria-label="Add to favorites"
          onClick={handleAddToWishlist}
          disabled={isLoading}>
          {isLoading ? "..." : isFavorite ? "❤️" : "🤍"}
        </button> */}
      </div>
    </div>
  );
}

export default ProductCard;
