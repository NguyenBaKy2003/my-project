import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const userID = localStorage.getItem("userId");
  let sessionId = localStorage.getItem("sessionId") || Date.now().toString();
  localStorage.setItem("sessionId", sessionId);

  useEffect(() => {
    fetchCart();
  }, [userID, sessionId]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      let url = `https://45.122.253.163:8891/api/cart?${
        userID ? `userId=${userID}` : `sessionId=${sessionId}`
      }`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Không thể tải giỏ hàng");
      const data = await response.json();
      setCart(
        data?.items?.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          category: item.product.category?.name || "Không phân loại",
          newPrice: item.product.price,
          image:
            item.product.primaryImage?.url || "https://via.placeholder.com/150",
          quantity: item.quantity,
        })) || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(id);
    setUpdating(true);
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    try {
      let url = `https://45.122.253.163:8891/api/cart/items/${id}?quantity=${newQuantity}&${
        userID ? `userId=${userID}` : `sessionId=${sessionId}`
      }`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Lỗi khi cập nhật số lượng!");
      toast.success("Cập nhật số lượng thành công!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (id) => {
    setCart(cart.filter((item) => item.id !== id));
    try {
      let url = `https://45.122.253.163:8891/api/cart/items/${id}?${
        userID ? `userId=${userID}` : `sessionId=${sessionId}`
      }`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm!");
      toast.success("Sản phẩm đã được xóa!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.newPrice * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <p className="font-bold">Lỗi</p>
          <p>{error}</p>
          <button
            onClick={fetchCart}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Thử lại
          </button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          🛒 Giỏ hàng của bạn
        </h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto mt-2"></div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-xl text-gray-600 mt-4">
            Giỏ hàng của bạn đang trống
          </p>
          <p className="text-gray-500 mt-2">
            Thêm một vài sản phẩm và quay lại nhé!
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="hidden md:grid md:grid-cols-5 bg-gray-100 p-4 font-medium text-gray-700">
                <div className="col-span-2">Sản phẩm</div>
                <div className="text-center">Đơn giá</div>
                <div className="text-center">Số lượng</div>
                <div className="text-center">Thao tác</div>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <div className="md:grid md:grid-cols-5 p-4 items-center">
                    {/* Mobile + Desktop: Product info */}
                    <div className="md:col-span-2 flex gap-3 mb-3 md:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-sm">{item.category}</p>
                      </div>
                    </div>

                    {/* Mobile: Price + Quantity in a row */}
                    <div className="flex justify-between items-center md:hidden mb-3">
                      <p className="text-red-500 font-bold">
                        {item.newPrice?.toLocaleString()} đ
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={updating}
                          className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }>
                          -
                        </button>
                        <span className="w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          disabled={updating}
                          className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }>
                          +
                        </button>
                      </div>
                    </div>

                    {/* Desktop: Price */}
                    <div className="hidden md:block text-center">
                      <p className="text-red-500 font-bold">
                        {item.newPrice?.toLocaleString()} đ
                      </p>
                    </div>

                    {/* Desktop: Quantity controls */}
                    <div className="hidden md:flex justify-center items-center gap-1">
                      <button
                        disabled={updating}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }>
                        -
                      </button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button
                        disabled={updating}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }>
                        +
                      </button>
                    </div>

                    {/* Mobile + Desktop: Remove button */}
                    <div className="md:text-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition">
                        <span className="md:hidden">Xóa</span>
                        <span className="hidden md:inline">❌ Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4 pb-4 border-b">
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tạm tính ({cart.length} sản phẩm)
                  </span>
                  <span>{totalAmount?.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-red-500">
                    {totalAmount?.toLocaleString()} đ
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium">
                Tiến hành thanh toán
              </Link>

              <Link
                to="/"
                className="w-full block text-center mt-3 border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
