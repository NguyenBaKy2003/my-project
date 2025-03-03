import React, { useState } from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "THIẾT BỊ TƯỚI PHUN MƯA",
    name: "Bộ Phun Sương 4m Takagi GCA12",
    oldPrice: "1.500.000 đ",
    newPrice: "1.254.000 đ",
    discount: "Giảm giá!",
  },
  {
    id: 2,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "VAN ĐIỆN TỪ",
    name: "Van điện từ 24VAC ren trong 1”",
    newPrice: "980.000 đ",
  },
  {
    id: 3,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "VAN ĐIỆN TỪ",
    name: "Van điện từ 9V / 9V 1/2” Male solenoid valve",
    newPrice: "398.000 đ",
  },
  {
    id: 4,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "PHỤ KIỆN KẾT NỐI",
    name: "Vòng bảo vệ đầu béc tưới Claber",
    newPrice: "75.000 đ",
  },
  {
    id: 5,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/cuon-coil-van-dien-tu-280x280.png",
    category: "PHỤ KIỆN KẾT NỐI",
    name: "Co Claber 1” (26 – 34 mm) ren ngoài",
    newPrice: "140.000 đ",
  },
  {
    id: 6,
    image:
      "https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/08/90815-510x510-1.jpg",
    category: "PHỤ KIỆN KẾT NỐI",
    name: "Khớp nối Claber 1” ren trong",
    newPrice: "100.000 đ",
  },
];

const categories = [
  "TẤT CẢ",
  "THIẾT BỊ TƯỚI PHUN MƯA",
  "VAN ĐIỆN TỪ",
  "PHỤ KIỆN KẾT NỐI",
];

function ProductCard() {
  const [selectedCategory, setSelectedCategory] = useState("TẤT CẢ");

  // Lọc sản phẩm theo danh mục được chọn
  const filteredProducts =
    selectedCategory === "TẤT CẢ"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="container mx-auto py-10">
      {/* Tabs - Điều chỉnh cuộn ngang trên mobile */}
      <div className="flex justify-center space-x-2 overflow-x-auto whitespace-nowrap pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md transition duration-300 ${
              selectedCategory === category
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory(category)}>
            {category}
          </button>
        ))}
      </div>

      {/* Grid sản phẩm - Hiển thị sản phẩm theo danh mục */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col h-full transform transition duration-300 hover:shadow-2xl hover:scale-105">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-60 object-cover rounded-md"
              />
              <h3 className="text-sm text-gray-600 mt-2">{product.category}</h3>
              <h2 className="font-bold flex-grow">{product.name}</h2>
              <p className="text-blue-500 font-bold">{product.newPrice}</p>

              {/* Nút "Thêm vào giỏ hàng" và "Xem chi tiết" luôn thẳng hàng */}
              <div className="mt-auto">
                <Link
                  to={`/product/${product.id}`}
                  className="block text-center mt-2 bg-blue-500 text-white px-3 py-2 rounded-md w-full transition duration-300 hover:bg-blue-700 hover:shadow-md">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Nút xem thêm */}
      <div className="flex justify-center mt-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105">
          XEM THÊM
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
