import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaEnvelope } from "react-icons/fa";

const products = [
  {
    id: 1,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "THIẾT BỊ TƯỚI PHUN MƯA",
    name: "Bộ Phun Sương 4m Takagi GCA12",
    description: "Bộ phun sương cao cấp Takagi GCA12 với độ bền cao.",
    newPrice: 1254000,
    oldPrice: 1500000,
    brand: "Takagi",
    sku: "GCA12",
  },
  {
    id: 2,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "VAN ĐIỆN TỪ",
    name: "Van điện từ 24VAC ren trong 1”",
    description: "Van điện từ 24VAC cho hệ thống tưới tự động.",
    newPrice: 980000,
    brand: "Rain Bird",
    sku: "24VAC-1IN",
  },
  {
    id: 3,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "VAN ĐIỆN TỪ",
    name: "Van điện từ 9V / 9V 1/2” Male solenoid valve",
    description: "Van điện từ 9V phù hợp cho hệ thống nhỏ giọt.",
    newPrice: 398000,
    brand: "Hunter",
    sku: "9V-1/2M",
  },
  {
    id: 4,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "PHỤ KIỆN KẾT NỐI",
    name: "Vòng bảo vệ đầu béc tưới Claber",
    newPrice: 7500000,
    brand: "Hunter",
    sku: "9V-1/2M",
    description: "Van điện từ 9V phù hợp cho hệ thống nhỏ giọt.",
  },
  {
    id: 5,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "PHỤ KIỆN KẾT NỐI",
    name: "Co Claber 1” (26 – 34 mm) ren ngoài",
    newPrice: 1400000,
    brand: "Hunter",
    sku: "9V-1/2M",
    description: "Van điện từ 9V phù hợp cho hệ thống nhỏ giọt.",
  },
  {
    id: 6,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/90815-510x510-1.jpg",
    category: "PHỤ KIỆN KẾT NỐI",
    name: "Khớp nối Claber 1” ren trong",
    newPrice: 1000000,
    brand: "Hunter",
    sku: "9V-1/2M",
    description: "Van điện từ 9V phù hợp cho hệ thống nhỏ giọt.",
  },
];

function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = storedCart.find((item) => item.id === product?.id);
    if (existingProduct) {
      setQuantity(existingProduct.quantity);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="text-center text-red-500">Sản phẩm không tồn tại!</div>
    );
  }

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Ảnh sản phẩm */}
        <div className="relative w-full md:w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-full  object-cover rounded-lg"
          />
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center space-x-3">
            {product.oldPrice && (
              <span className="text-gray-500 line-through">
                {product.oldPrice.toLocaleString()} đ
              </span>
            )}
            <span className="text-red-600 font-bold text-xl">
              {product.newPrice.toLocaleString()} đ
            </span>
          </div>
          <p className="text-gray-600">{product.description}</p>

          {/* Số lượng + Nút thêm vào giỏ hàng */}
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
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
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

          {/* Thông tin sản phẩm */}
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>
              <strong>Mã sản phẩm:</strong> {product.sku}
            </li>
            <li>
              <strong>Danh mục:</strong> {product.category}
            </li>
            <li>
              <strong>Thương hiệu:</strong> {product.brand}
            </li>
          </ul>

          {/* Icon chia sẻ */}
          <div className="flex space-x-4 text-gray-500">
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaEnvelope className="cursor-pointer hover:text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs Mô tả & Đánh giá */}
      <div className="mt-8 border-t pt-6">
        <div className="flex space-x-6 border-b">
          <button className="pb-2 border-b-2 border-blue-500 text-blue-500 font-semibold">
            Mô Tả
          </button>
          <button className="pb-2 text-gray-600 hover:text-blue-500">
            Đánh Giá (0)
          </button>
        </div>
        <div className="mt-4 text-gray-700">{product.description}</div>
      </div>
    </div>
  );
}

export default ProductDetail;
