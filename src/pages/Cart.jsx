import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Tính tổng tiền
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.newPrice * item.quantity,
    0
  );

  return (
    <div className="container  mx-auto py-10 px-4">
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
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg p-4 rounded-lg flex flex-col h-full">
              {/* Hình ảnh sản phẩm */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded-md"
              />

              {/* Thông tin sản phẩm */}
              <div className="flex-grow flex flex-col justify-between mt-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <p className="text-red-500 font-bold text-lg">
                    {item.newPrice.toLocaleString()} đ
                  </p>
                </div>

                {/* Chỉnh số lượng sản phẩm */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    className="bg-gray-300 px-3 py-1 rounded-md"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span className="px-5 py-1 bg-gray-200 text-lg">
                    {item.quantity}
                  </span>
                  <button
                    className="bg-gray-300 px-3 py-1 rounded-md"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>

              {/* Nút xóa sản phẩm */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition">
                ❌ Xóa sản phẩm
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tổng tiền và Thanh toán */}
      {cart.length > 0 && (
        <div className="mt-8 text-right">
          <h3 className="text-xl font-bold">
            Tổng tiền:{" "}
            <span className="text-red-500">
              {totalAmount.toLocaleString()} đ
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
