import { useEffect, useState } from "react";
import {
  FaStar,
  FaBox,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaComment,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const navigate = useNavigate();
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
        setTimeout(() => setReviewStatus(null), 3000);
      })
      .catch(() => {
        setReviewStatus("Lỗi khi gửi đánh giá!");
        setTimeout(() => setReviewStatus(null), 3000);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 container mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h2>
        {reviewStatus && (
          <div
            className={`px-4 py-2 rounded-lg ${
              reviewStatus.includes("thành công")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            } transition-all duration-300 ease-in-out`}>
            {reviewStatus}
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
            <FaBox className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-gray-500 mb-6">
            Hãy khám phá và mua sắm ngay bây giờ
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const product = order.orderDetails[0]?.product;
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative mb-4">
                  <img
                    src={
                      product?.primaryImage?.url ||
                      "https://via.placeholder.com/150"
                    }
                    alt={product?.primaryImage?.altText || "Hình ảnh sản phẩm"}
                    className="w-full h-56 object-contain rounded-lg bg-gray-50"
                  />
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaBox className="mr-2" />
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <p>
                      {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center text-red-600 font-semibold">
                    <FaMoneyBillWave className="mr-2" />
                    <p>{formatCurrency(order.totalAmount)}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <button
                      className="flex items-center justify-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                      onClick={() => navigate(`/orders/${order.id}`)}>
                      <FaInfoCircle className="mr-2" />
                      Chi tiết
                    </button>

                    {order.status === "DELIVERED" && (
                      <button
                        onClick={() => handleOpenReview(product)}
                        className="flex items-center justify-center bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition">
                        <FaComment className="mr-2" />
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal đánh giá */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Đánh giá sản phẩm
            </h3>
            <p className="text-gray-700 mb-4 font-medium">
              {selectedProduct?.name}
            </p>

            <div className="flex justify-center space-x-2 mb-6">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    size={30}
                    className={`cursor-pointer transition-colors duration-200 ${
                      starValue <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setRating(starValue)}
                  />
                );
              })}
            </div>

            <label className="block mb-2 text-gray-700 font-medium">
              Nhận xét của bạn:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows="4"></textarea>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium">
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
