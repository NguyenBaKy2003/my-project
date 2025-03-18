import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaEnvelope, FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    async function fetchSessionId() {
      try {
        const response = await fetch("http://localhost:8080/api/cart/session", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể lấy session ID!");
        const data = await response.json();

        // Lưu sessionId vào localStorage
        localStorage.setItem("sessionId", data.sessionId);
      } catch (error) {
        console.error("Lỗi khi lấy session ID:", error);
      }
    }

    fetchSessionId();
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Không thể tải sản phẩm!");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      }
    }

    async function fetchImages() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/product-images/product/${id}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Không thể tải hình ảnh sản phẩm!");
        const data = await response.json();
        setImages(data);
        setSelectedImage(
          data.find((img) => img.primary)?.url ||
            data[0]?.url ||
            "https://via.placeholder.com/300"
        );
      } catch (error) {
        console.error("Lỗi khi tải ảnh sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchReviews() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/reviews/product/${id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Không thể tải đánh giá!");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
      }
    }

    fetchProduct();
    fetchImages();
    fetchReviews();
  }, [id]);

  if (loading)
    return <div className="text-center text-blue-500">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product)
    return (
      <div className="text-center text-red-500">Sản phẩm không tồn tại!</div>
    );

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    const sessionId = localStorage.getItem("sessionId");

    const cartUrl = userId
      ? `http://localhost:8080/api/cart/add?userId=${userId}&productId=${product.id}&quantity=${quantity}`
      : `http://localhost:8080/api/cart/add?sessionId=${sessionId}&productId=${product.id}&quantity=${quantity}`;

    try {
      const response = await fetch(cartUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok)
        throw new Error("Không thể thêm sản phẩm vào giỏ hàng!");

      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");

      // 🔥 Phát sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="container md:w-3/4  mx-auto px-4 lg:px-8 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Hình ảnh sản phẩm */}
        <div className="w-5/6 mx-auto lg:w-3/4">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full object-cover rounded-lg shadow-md"
          />
          {/* Danh sách hình ảnh nhỏ */}
          <div className="flex mt-3 gap-2">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={img.altText || "Hình ảnh sản phẩm"}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === img.url
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center space-x-3">
            {product.oldPrice && (
              <span className="text-gray-500 line-through">
                {product.oldPrice.toLocaleString()} đ
              </span>
            )}
            <span className="text-red-600 font-bold text-xl">
              {product.price.toLocaleString()} đ
            </span>
          </div>

          {/* Điều chỉnh số lượng */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 bg-gray-300 rounded">
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-xl border rounded text-center"
            />
            <button
              onClick={handleIncrease}
              className="px-3 py-1 bg-gray-300 rounded">
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded font-semibold">
            Thêm vào giỏ hàng
          </button>

          {/* Thông tin bổ sung */}
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>
              <strong>Mã sản phẩm:</strong> {product.sku}
            </li>
            <li>
              <strong>Danh mục:</strong> {product.category.name}
            </li>
            <li>
              <strong>Thương hiệu:</strong> {product.tradeMark || "N/A"}
            </li>
          </ul>

          {/* Chia sẻ */}
          <div className="flex space-x-4 text-gray-500">
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaEnvelope className="cursor-pointer hover:text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8  border-t pt-6">
        <div className="flex space-x-6 border-b">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab)}>
              {tab === "description" ? "Mô Tả" : `Đánh Giá (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Nội dung tab */}
        <div className="mt-4 text-gray-700">
          {activeTab === "description" ? (
            product.description ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-gray-600">Chưa có mô tả cho sản phẩm này.</p>
            )
          ) : activeTab === "reviews" ? (
            reviews.length > 0 ? (
              <div className="space-y-4 md:w-3/4  mx-auto">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border p-4 rounded-lg shadow-sm bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {review.user.firstName} {review.user.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {review.user.email}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          review.verifiedPurchase
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                        {review.verifiedPurchase
                          ? "Đã mua hàng"
                          : "Chưa mua hàng"}
                      </span>
                    </div>
                    <div className="flex items-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-400">
                      Đánh giá vào{" "}
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Chưa có đánh giá nào.</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
