import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard.jsx";

function ProductByTradeMark() {
  const [products, setProducts] = useState([]);
  const [tradeMarks, setTradeMarks] = useState([]);
  const [selectedTradeMark, setSelectedTradeMark] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://45.122.253.163:8891/api/products"
        );
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm");

        const productList = await response.json();
        const uniqueTradeMarks = [
          ...new Set(productList.map((product) => product.tradeMark)),
        ];

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
          setSelectedTradeMark(uniqueTradeMarks[0]);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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
            className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transition-all ${
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
              <ProductCard key={product.id} product={product} />
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
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
          onClick={() => navigate("/products")}>
          XEM THÊM
        </button>
      </div>
    </div>
  );
}

export default ProductByTradeMark;
