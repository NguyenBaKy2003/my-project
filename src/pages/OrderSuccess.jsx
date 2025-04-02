import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const orderId =
      location.state?.orderNumber || localStorage.getItem("orderNumber");

    if (orderId) {
      fetchOrder(orderId);
    }
  }, [location]);

  const fetchOrder = async (orderId) => {
    try {
      const response = await axios.get(
        `https://45.122.253.163:8891/api/orders/number/${orderId}`
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    }
  };

  return (
    <div className="container md:w-1/2 mx-auto   py-10 px-4 text-center">
      <h2 className="text-2xl font-bold text-green-600">
        🎉 Đặt hàng thành công!
      </h2>

      {order ? (
        <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-lg font-semibold">
            🛍 Đơn hàng #{order.orderNumber}
          </h3>
          <p className="text-gray-500">
            Ngày đặt hàng: {new Date(order.orderDate).toLocaleString()}
          </p>

          {/* Tổng tiền */}
          <h3 className="text-xl font-bold mt-4">
            Tổng tiền:{" "}
            <span className="text-red-500">
              {order.totalAmount.toLocaleString()} đ
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
