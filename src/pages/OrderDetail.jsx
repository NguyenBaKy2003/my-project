import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://45.122.253.163:8891/api/orders";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch(() => toast.error("Lỗi khi lấy đơn hàng!"));
  }, [id]);

  if (!order) return <p className="text-center text-gray-600">Đang tải...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Chi Tiết Đơn Hàng
      </h2>
      <p className="text-gray-600">
        Mã đơn: <span className="font-semibold">{order.orderNumber}</span>
      </p>
      <p className="text-gray-600">
        Ngày đặt:{" "}
        <span className="font-semibold">
          {new Date(order.orderDate).toLocaleDateString()}
        </span>
      </p>
      <p className="text-lg font-bold text-gray-800 mt-2">
        Tổng tiền:{" "}
        <span className="text-red-500">
          {order.totalAmount.toLocaleString()} ₫
        </span>
      </p>

      {/* Thông tin giao hàng */}
      <div className="bg-gray-100 p-4 rounded-lg mt-4">
        <h3 className="text-lg font-bold text-gray-700">Thông Tin Giao Hàng</h3>
        <p className="text-gray-600">
          👤 Người nhận:{" "}
          <span className="font-semibold">
            {order.shippingDetail.recipientName}
          </span>
        </p>
        <p className="text-gray-600">
          📍 Địa chỉ:{" "}
          <span className="font-semibold">{order.shippingDetail.address}</span>
        </p>
        <p className="text-gray-600">
          📞 Số điện thoại:{" "}
          <span className="font-semibold">
            {order.shippingDetail.phoneNumber}
          </span>
        </p>
        <p className="text-gray-600">
          📧 Email:{" "}
          <span className="font-semibold">{order.shippingDetail.email}</span>
        </p>

        {/* Hiển thị trạng thái đơn hàng */}
        <p className="mt-2 text-gray-700 font-semibold">
          🚚 Trạng thái:{" "}
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
            {order.status}
          </span>
        </p>
      </div>

      {/* Danh sách sản phẩm trong đơn hàng */}
      <h3 className="text-lg font-bold mt-4">Sản Phẩm Trong Đơn Hàng</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Hình Ảnh</th>
              <th className="p-3 border">Tên Sản Phẩm</th>
              <th className="p-3 border">Số Lượng</th>
              <th className="p-3 border">Đơn Giá</th>
              <th className="p-3 border">Tổng Tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((detail) => (
              <tr key={detail.id} className="border">
                <td className="p-3 border text-center">
                  <img
                    src={detail.product.primaryImage.url}
                    alt={detail.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 border">{detail.product.name}</td>
                <td className="p-3 border text-center">{detail.quantity}</td>
                <td className="p-3 border text-right">
                  {detail.unitPrice.toLocaleString()} ₫
                </td>
                <td className="p-3 border text-right">
                  {detail.subtotal.toLocaleString()} ₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nút quay lại */}
      <button
        className="mt-6 w-full md:w-auto bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={() => navigate("/orders")}>
        ⬅ Quay lại
      </button>
    </div>
  );
}

export default OrderDetail;
