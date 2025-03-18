import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ProductCardSortedByRating() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Dùng để điều hướng trang

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

        // Sắp xếp theo rating giảm dần và lấy top 20
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
      <h2 className="text-3xl   font-bold text-center uppercase mb-6">
        Sản phẩm Nổi bật
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
