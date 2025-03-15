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
      let url = `http://localhost:8080/api/cart?${
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
      let url = `http://localhost:8080/api/cart/items/${id}?quantity=${newQuantity}&${
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
      let url = `http://localhost:8080/api/cart/items/${id}?${
        userID ? `userId=${userID}` : `sessionId=${sessionId}`
      }`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm!");
      toast.success("Sản phẩm đã được xóa!");
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.newPrice * item.quantity,
    0
  );

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center">
        🛒 Giỏ hàng của bạn
      </h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">
          Giỏ hàng trống!{" "}
          <Link to="/" className="text-blue-500 font-semibold">
            Tiếp tục mua sắm
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg p-4 rounded-lg flex flex-col h-full">
              <img
                src={item.image}
                alt={item.name}
                className="w-full object-cover rounded-md"
              />
              <div className="flex-grow flex flex-col justify-between mt-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <p className="text-red-500 font-bold text-lg">
                    {item.newPrice?.toLocaleString()} đ
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    disabled={updating}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span className="px-5 py-1 bg-gray-200 text-lg">
                    {item.quantity}
                  </span>
                  <button
                    disabled={updating}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition">
                ❌ Xóa sản phẩm
              </button>
            </div>
          ))}
        </div>
      )}
      {cart.length > 0 && (
        <div className="mt-8 text-right">
          <h3 className="text-xl font-bold">
            Tổng tiền:{" "}
            <span className="text-red-500">
              {totalAmount?.toLocaleString()} đ
            </span>
          </h3>
          <Link
            to="/checkout"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            🛒 Tiến hành thanh toán
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
