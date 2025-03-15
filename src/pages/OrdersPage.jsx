import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Lỗi tải đơn hàng:", err));
  }, [userId]);

  return (
    <div className="p-6 container mx-auto md:w-1/2">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg shadow">
              <p>
                <strong>Mã đơn hàng:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Tổng tiền:</strong> {order.totalAmount} VNĐ
              </p>
              <p>
                <strong>Trạng thái:</strong> {order.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
