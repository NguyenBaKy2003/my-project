import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard"; // Import component mới

function ProductCardSortedByRating() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm");

        const productList = await response.json();

        // Tính toán rating trung bình
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

        // Sắp xếp theo rating giảm dần và lấy top 8 sản phẩm
        updatedProducts.sort((a, b) => b.averageRating - a.averageRating);
        setProducts(updatedProducts.slice(0, 8));
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl uppercase font-bold text-center mb-6">
        Sản phẩm Nổi bật
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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

export default ProductCardSortedByRating;
