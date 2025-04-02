import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaEnvelope,
  FaStar,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
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
  const [isWishListed, setIsWishListed] = useState(false);

  useEffect(() => {
    async function fetchSessionId() {
      try {
        const response = await fetch(
          "https://45.122.253.163:8891/api/cart/session",
          {
            credentials: "include",
          }
        );
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
          `https://45.122.253.163:8891/api/products/${id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Không thể tải sản phẩm!");
        const data = await response.json();
        setProduct(data);
        document.title = `${data.name} | Shop Của Bạn`;
      } catch (error) {
        setError(error.message);
      }
    }

    async function fetchImages() {
      try {
        const response = await fetch(
          `https://45.122.253.163:8891/api/product-images/product/${id}`,
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
          `https://45.122.253.163:8891/api/reviews/product/${id}`,
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-8 text-red-500 font-semibold">{error}</div>
    );
  if (!product)
    return (
      <div className="text-center p-8 text-red-500 font-semibold">
        Sản phẩm không tồn tại!
      </div>
    );

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    const sessionId = localStorage.getItem("sessionId");

    const cartUrl = userId
      ? `https://45.122.253.163:8891/api/cart/add?userId=${userId}&productId=${product.id}&quantity=${quantity}`
      : `https://45.122.253.163:8891/api/cart/add?sessionId=${sessionId}&productId=${product.id}&quantity=${quantity}`;

    try {
      const response = await fetch(cartUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok)
        throw new Error("Không thể thêm sản phẩm vào giỏ hàng!");

      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");

      // Phát sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
        return;
      }

      const response = await fetch(
        `https://45.122.253.163:8891/api/wishlists/${userId}/products/${product.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setIsWishListed(!isWishListed);
        toast.success(
          isWishListed
            ? "Đã xóa sản phẩm khỏi danh sách yêu thích"
            : "Đã thêm sản phẩm vào danh sách yêu thích"
        );
      } else {
        toast.error("Thêm sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào Wishlist:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Format descriptions to display with line breaks
  const formatDescription = (description) => {
    if (!description) return null;

    // Split the description into content and parse out image URLs
    const imageRegex = /\[image:([^\]]+)\]/g;
    const textWithoutImages = description.replace(imageRegex, "");
    const imageUrls = [];
    let match;

    while ((match = imageRegex.exec(description)) !== null) {
      imageUrls.push(match[1]);
    }

    return (
      <div className="space-y-6">
        {/* Render text paragraphs */}
        {textWithoutImages.split("\n").map(
          (line, index) =>
            line.trim() && (
              <p key={`text-${index}`} className="text-gray-700 mb-4">
                {line}
              </p>
            )
        )}

        {/* Render images if any */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <img
                key={`desc-img-${index}`}
                src={url}
                alt={`Mô tả sản phẩm ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Breadcrumb */}
      <nav className="flex mb-6 text-sm text-gray-500">
        <a href="/" className="hover:text-blue-500">
          Trang chủ
        </a>
        <span className="mx-2">/</span>
        <a
          href={`/category/${product.category.id}`}
          className="hover:text-blue-500">
          {product.category.name}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className=" rounded-lg overflow-hidden shadow-md bg-white">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-96 object-contain p-4"
              />
            </div>

            {/* Danh sách hình ảnh nhỏ */}
            {images.length > 0 && (
              <div className="flex mt-4 gap-3 overflow-x-auto pb-2">
                {images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={img.altText || "Hình ảnh sản phẩm"}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === img.url
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < Math.floor(calculateAverageRating())
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {calculateAverageRating()} ({reviews.length} đánh giá)
                  </span>
                </div>
                <span className="text-gray-500">
                  Mã SP: <span className="font-medium">{product.sku}</span>
                </span>
              </div>
            </div>

            <div className="py-4 border-t border-b">
              <div className="flex items-baseline space-x-4 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  {product.price.toLocaleString()} đ
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.oldPrice.toLocaleString()} đ
                  </span>
                )}
                {product.oldPrice && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                    Giảm{" "}
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>
              {product.stockQuantity > 0 ? (
                <div className="text-green-600 font-medium">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Còn hàng
                </div>
              ) : (
                <div className="text-red-500 font-medium">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  Hết hàng
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Mô tả ngắn */}
              <p className="text-gray-600">
                {product.description ||
                  (product.descriptions && product.descriptions.length > 0
                    ? product.descriptions[0].content.substring(0, 150) + "..."
                    : "Sản phẩm chất lượng cao, đảm bảo độ bền và hiệu suất tốt nhất trong phân khúc giá.")}
              </p>

              {/* Điều chỉnh số lượng */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={handleDecrease}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-lg focus:outline-none">
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 py-2 text-center border-none focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={handleIncrease}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-lg focus:outline-none">
                    +
                  </button>
                </div>
              </div>

              {/* Nút thêm vào giỏ và yêu thích */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold transition duration-200 flex-grow">
                  <FaShoppingCart className="mr-2" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded font-semibold transition duration-200">
                  <FaHeart
                    className={`${
                      isWishListed ? "text-red-500" : "text-gray-400"
                    } mr-2`}
                  />
                  Yêu thích
                </button>
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <h3 className="font-semibold text-gray-700 mb-2">
                Thông tin sản phẩm:
              </h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <span className="text-gray-600">Danh mục:</span>
                </div>
                <div>
                  <a
                    href={`/category/${product.category.id}`}
                    className="text-blue-500 hover:underline">
                    {product.category.name}
                  </a>
                </div>
                <div>
                  <span className="text-gray-600">Thương hiệu:</span>
                </div>
                <div>
                  <a
                    href={`/brand/${product.tradeMark}`}
                    className="text-blue-500 hover:underline">
                    {product.tradeMark || "N/A"}
                  </a>
                </div>
              </div>
            </div>

            {/* Chia sẻ */}
            <div className="pt-4 border-t">
              <p className="text-gray-600 mb-2">Chia sẻ sản phẩm:</p>
              <div className="flex space-x-3">
                <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
                  <FaFacebookF />
                </button>
                <button className="w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500">
                  <FaTwitter />
                </button>
                <button className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                  <FaEnvelope />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-6 font-medium text-gray-700 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab)}>
              {tab === "description"
                ? "Mô Tả Sản Phẩm"
                : tab === "specifications"
                ? "Thông Số Kỹ Thuật"
                : `Đánh Giá (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Nội dung tab */}
        <div className="p-6">
          {activeTab === "description" ? (
            <div className="prose max-w-none">
              {product.descriptions && product.descriptions.length > 0 ? (
                <div className="space-y-6">
                  {product.descriptions.map((desc, index) => (
                    <div
                      key={desc.id || index}
                      className="bg-white p-4 rounded-lg">
                      <div className="text-gray-700">
                        {formatDescription(desc.content)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : product.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có mô tả chi tiết cho sản phẩm này.</p>
                </div>
              )}
            </div>
          ) : activeTab === "specifications" ? (
            product.details && product.details.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-3 text-left text-gray-700 font-semibold w-1/3">
                        Thông số
                      </th>
                      <th className="border px-4 py-3 text-left text-gray-700 font-semibold">
                        Giá trị
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.details.map((detail, index) => (
                      <tr
                        key={detail.id}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="border px-4 py-3 font-medium text-gray-700">
                          {detail.attributeName}
                        </td>
                        <td className="border px-4 py-3 text-gray-600">
                          {detail.attributeValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có thông số kỹ thuật cho sản phẩm này.</p>
              </div>
            )
          ) : activeTab === "reviews" ? (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Đánh giá từ khách hàng
                  </h3>
                  <p className="text-gray-500">
                    {reviews.length} đánh giá | Điểm trung bình:{" "}
                    {calculateAverageRating()} / 5
                  </p>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border rounded-lg p-5 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {review.user.firstName} {review.user.lastName}
                          </h4>
                          <div className="flex items-center mt-1">
                            <div className="flex mr-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(review.reviewDate).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        {review.verifiedPurchase && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                            Đã mua hàng
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      {review.pros && (
                        <div className="text-sm mb-2">
                          <span className="font-medium text-green-600">
                            Ưu điểm:
                          </span>{" "}
                          {review.pros}
                        </div>
                      )}
                      {review.cons && (
                        <div className="text-sm">
                          <span className="font-medium text-red-600">
                            Nhược điểm:
                          </span>{" "}
                          {review.cons}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="mb-2">Chưa có đánh giá nào cho sản phẩm này.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
