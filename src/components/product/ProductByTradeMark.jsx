import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ProductByTradeMark() {
  const [products, setProducts] = useState([]);
  const [tradeMarks, setTradeMarks] = useState([]);
  const [selectedTradeMark, setSelectedTradeMark] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Dùng để điều hướng trang

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm");

        const productList = await response.json();

        // Lấy danh sách thương hiệu duy nhất
        const uniqueTradeMarks = [
          ...new Set(productList.map((product) => product.tradeMark)),
        ];

        // Thêm ảnh chính cho sản phẩm (nếu có)
        const updatedProducts = productList.map((product) => {
          const averageRating =
            product.reviews.length > 0
              ? product.reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
                ) / product.reviews.length
              : 0;

          return {
            ...product,
            image:
              product.primaryImage?.url || "https://via.placeholder.com/150",
            averageRating,
          };
        });

        setTradeMarks(uniqueTradeMarks);
        setProducts(updatedProducts);
        if (uniqueTradeMarks.length > 0) {
          setSelectedTradeMark(uniqueTradeMarks[0]); // Chọn thương hiệu đầu tiên mặc định
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Lọc sản phẩm theo thương hiệu được chọn (hiển thị tối đa 8 sản phẩm)
  const filteredProducts = products
    .filter((product) => product.tradeMark === selectedTradeMark)
    .slice(0, 8);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl uppercase font-bold text-center mb-6">
        Sản phẩm theo thương hiệu
      </h2>

      {/* Tabs thương hiệu */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {tradeMarks.map((tradeMark) => (
          <button
            key={tradeMark}
            className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transition-all 
              ${
                selectedTradeMark === tradeMark
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setSelectedTradeMark(tradeMark)}>
            {tradeMark}
          </button>
        ))}
      </div>

      {/* Hiển thị sản phẩm */}
      {loading ? (
        <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-lg rounded-xl p-4 flex flex-col h-full transform transition duration-300 
                           hover:shadow-2xl hover:scale-105">
                <Link to={`/product/${product.id}`} className="block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                  <h3 className="text-sm text-gray-500 mt-2">
                    {product.category.name}
                  </h3>
                  <h2 className="font-bold flex-grow">{product.name}</h2>

                  {/* Hiển thị rating trung bình */}
                  <p className="text-yellow-500 font-bold">
                    ⭐ {product.averageRating.toFixed(1)} / 5
                  </p>

                  {/* Giá sản phẩm */}
                  <p className="text-blue-600 font-bold text-xl mt-1">
                    {product.price.toLocaleString()} đ
                  </p>
                </Link>

                {/* Nút Xem chi tiết */}
                <Link
                  to={`/product/${product.id}`}
                  className="block text-center mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg 
                             transition duration-300 hover:bg-blue-700 hover:shadow-md">
                  Xem chi tiết
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-4">
              Không có sản phẩm nào cho thương hiệu này.
            </p>
          )}
        </div>
      )}
      {/* Nút XEM THÊM */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300 
          hover:bg-blue-700 hover:shadow-lg hover:scale-105"
          onClick={() => navigate("/products")}>
          XEM THÊM
        </button>
      </div>
    </div>
  );
}

export default ProductByTradeMark;
