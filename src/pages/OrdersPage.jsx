import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [reviewStatus, setReviewStatus] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Lỗi tải đơn hàng:", err));
  }, [userId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    if (!selectedProduct) return;
    fetch(
      `http://localhost:8080/api/reviews/user/${userId}/product/${selectedProduct.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setReviewStatus("Đánh giá thành công!");
        setShowReviewModal(false);
        setRating(5);
        setComment("");
      })
      .catch(() => setReviewStatus("Lỗi khi gửi đánh giá!"));
  };

  return (
    <div className="p-6 container mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📦 Danh sách đơn hàng
      </h2>
      {reviewStatus && (
        <p className="text-center text-green-600 font-semibold">
          {reviewStatus}
        </p>
      )}
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const product = order.orderDetails[0]?.product;
            return (
              <div
                key={order.id}
                className="border rounded-lg shadow-lg p-4 bg-white">
                <img
                  src={
                    product?.primaryImage?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={product?.primaryImage?.altText || "Hình ảnh sản phẩm"}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-4 space-y-2">
                  <p className="text-gray-700">
                    <strong>Mã đơn hàng:</strong> {order.orderNumber}
                  </p>
                  <p className="text-gray-700">
                    <strong>Ngày đặt:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="text-red-600 font-semibold">
                    <strong>Tổng tiền:</strong>{" "}
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p
                    className={`font-semibold ${
                      order.status === "PENDING"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}>
                    <strong>Trạng thái:</strong> {order.status}
                  </p>
                  <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                    Xem chi tiết
                  </button>
                  {order.status === "DELIVERED" && (
                    <button
                      onClick={() => handleOpenReview(product)}
                      className="mt-3 ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal đánh giá */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h3>
            <p className="text-gray-700 mb-2">{selectedProduct?.name}</p>
            <div className="flex mb-4">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    size={24}
                    className={
                      starValue <= (hover || rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setRating(starValue)}
                  />
                );
              })}
            </div>
            <label className="block mt-4 mb-2">Bình luận:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="3"></textarea>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
