import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderSuccess() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    setOrder(storedOrder);
  }, []);

  return (
    <div className="container md:w-1/2 mx-auto py-10 px-4 text-center">
      <h2 className="text-2xl font-bold text-green-600">
        🎉 Đặt hàng thành công!
      </h2>

      {order ? (
        <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-lg font-semibold">🛍 Đơn hàng #{order.id}</h3>
          <p className="text-gray-500">Ngày đặt hàng: {order.date}</p>

          {/* Danh sách sản phẩm */}
          <div className="mt-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="border-b py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-red-500 font-bold">
                  {(item.newPrice * item.quantity).toLocaleString()} đ
                </p>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <h3 className="text-xl font-bold mt-4">
            Tổng tiền:{" "}
            <span className="text-red-500">
              {order.total.toLocaleString()} đ
            </span>
          </h3>

          {/* Nút quay về trang chủ */}
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            🏠 Quay về trang chủ
          </Link>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Không tìm thấy đơn hàng nào.</p>
      )}
    </div>
  );
}

export default OrderSuccess;
