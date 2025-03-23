import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Loader,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const WishList = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [removingItems, setRemovingItems] = useState([]);

  useEffect(() => {
    // Lấy userID từ localStorage
    const userID = localStorage.getItem("userId");
    if (userID) {
      setUserId(userID);
    } else {
      console.error("User ID not found in localStorage");
      setError("User not logged in");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/wishlists/${userId}`
      );
      setWishlist(response.data);
    } catch (err) {
      setError("Failed to load wishlist items");
      console.error("Error fetching wishlist data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cart/${userId}`
      );
      setCartCount(response.data.count); // Giả sử API trả về { count: 5 }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartCount();
    }
  }, [userId]);

  const removeFromWishlist = async (productId) => {
    setRemovingItems([...removingItems, productId]);
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/wishlists/${userId}/products/${productId}`
      );
      setWishlist(response.data);
      toast.success("✅ Sản phẩm đã được xóa khỏi danh sách yêu thích!");
    } catch (err) {
      toast.error("❌ Không thể xóa sản phẩm");
      console.error("Error removing item from wishlist:", err);
    } finally {
      setRemovingItems(removingItems.filter((id) => id !== productId));
    }
  };

  const clearWishlist = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa tất cả các mục trong danh sách yêu thích không?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/wishlists/${userId}`);
      setWishlist({ products: [] });
      toast.success("🗑️ Đã xóa tất cả sản phẩm yêu thích!");
    } catch (err) {
      toast.error("❌ Không thể xóa danh sách yêu thích");
      console.error("Error clearing wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("productId", productId);
      formData.append("quantity", quantity);

      await axios.post("http://localhost:8080/api/cart/add", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      toast.success("🛒 Đã thêm vào giỏ hàng!");

      // Cập nhật số lượng giỏ hàng
      fetchCartCount();
    } catch (err) {
      toast.error("❌ Không thể thêm vào giỏ hàng");
      console.error("Error adding item to cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Đang tải danh sách yêu thích...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-red-500">
          Đã xảy ra lỗi
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        {!userId && (
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Đăng nhập
          </Link>
        )}
        {userId && (
          <button
            onClick={fetchWishlist}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-16 px-4">
          <Heart className="w-20 h-20 text-gray-300 mb-4 stroke-1" />
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Danh sách yêu thích của bạn trống
          </h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Thêm sản phẩm vào danh sách yêu thích để dễ dàng theo dõi và mua
            sau!
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Heart className="mr-3 text-red-500" />
          Danh sách yêu thích
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {wishlist.products.length} sản phẩm yêu thích
          </p>
          {wishlist.products.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 text-red-500 rounded-md hover:bg-red-50 transition flex items-center border border-red-200">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.products.map((product) => (
          <div
            key={product.id}
            className="bg-white  rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-56 bg-gray-50 flex items-center justify-center p-4">
              {product.primaryImage?.url ? (
                <img
                  src={product.primaryImage.url}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Không có hình ảnh</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              <div className="font-bold text-xl mb-4 text-red-600">
                {product.price
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)
                  : "N/A"}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(product.id)}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ
                </button>
                <button
                  disabled={removingItems.includes(product.id)}
                  onClick={() => removeFromWishlist(product.id)}
                  className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center">
                  {removingItems.includes(product.id) ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishList;
