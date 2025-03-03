import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const navigate = useNavigate();

  // Lấy giỏ hàng từ localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Tính tổng tiền
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.newPrice * item.quantity,
    0
  );

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý đặt hàng
  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const orderDetails = {
      id: new Date().getTime(),
      customer: form,
      items: cart,
      total: totalAmount,
      date: new Date().toLocaleString(),
    };

    // Lưu đơn hàng vào localStorage
    localStorage.setItem("order", JSON.stringify(orderDetails));

    // Xóa giỏ hàng
    localStorage.removeItem("cart");
    setCart([]);

    alert("Đặt hàng thành công! Cảm ơn bạn.");
    navigate("/order-success"); // Chuyển đến trang xác nhận đơn hàng
  };

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Thanh toán</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">
          Không có sản phẩm nào trong giỏ hàng.
        </p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-3">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">
                    {item.newPrice.toLocaleString()} đ x {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold text-red-500">
                {(item.newPrice * item.quantity).toLocaleString()} đ
              </p>
            </div>
          ))}

          {/* Tổng tiền */}
          <div className="text-right mt-4">
            <h3 className="text-xl font-bold">
              Tổng tiền:{" "}
              <span className="text-red-500">
                {totalAmount.toLocaleString()} đ
              </span>
            </h3>
          </div>

          {/* Form thông tin khách hàng */}
          <div className="mt-6 bg-gray-100 p-6 rounded-md">
            <h3 className="text-lg font-bold mb-4">Thông tin giao hàng</h3>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ giao hàng"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
            <textarea
              name="note"
              placeholder="Ghi chú (nếu có)"
              value={form.note}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
          </div>

          {/* Nút đặt hàng */}
          <button
            onClick={handleOrder}
            className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 transition">
            ✅ Xác nhận đặt hàng
          </button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
