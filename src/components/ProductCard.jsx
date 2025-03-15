import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductCard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["TẤT CẢ"]);
  const [selectedCategory, setSelectedCategory] = useState("TẤT CẢ");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:8080/api/categories");
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh mục");
        }
        const categoryList = await response.json();

        // Lọc danh mục con (chỉ lấy danh mục có parentCategory)
        const filteredCategories = categoryList
          .filter((category) => category.parentCategory !== null)
          .map((category) => category.name);

        setCategories(["TẤT CẢ", ...filteredCategories]);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    }

    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) {
          throw new Error("Lỗi khi tải sản phẩm");
        }
        const productList = await response.json();

        // Gán ảnh chính vào sản phẩm (nếu có)
        const updatedProducts = productList.map((product) => ({
          ...product,
          image: product.primaryImage?.url || "https://via.placeholder.com/150",
        }));

        setProducts(updatedProducts);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
    fetchProducts();
  }, []);

  // Lọc sản phẩm theo danh mục được chọn
  const filteredProducts =
    selectedCategory === "TẤT CẢ"
      ? products
      : products.filter(
          (product) => product.category.name === selectedCategory
        );

  return (
    <div className="container mx-auto py-10">
      {/* Tabs danh mục */}
      <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-hidden">
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

      {/* Hiển thị sản phẩm */}
      {loading ? (
        <p className="text-center mt-4">Đang tải sản phẩm...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
          {filteredProducts.map((product) => (
           <div key={product.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col h-full transform transition duration-300 hover:shadow-2xl hover:scale-105">
             <Link to={`/product/${product.id}`} className="block">
               <img src={product.image} alt={product.name} className="w-full h-60 object-cover rounded-md" />
               <h3 className="text-sm text-gray-600 mt-2">{product.category.name}</h3>
               <h2 className="font-bold flex-grow">{product.name}</h2>
               <p className="text-blue-500 font-bold">{product.price} đ</p>
             </Link>

             {/* Chỉ giữ lại một nút bấm không dùng <Link> nữa */}
             <Link to={`/product/${product.id}`}  className="block text-center mt-2 bg-blue-500 text-white px-3 py-2 rounded-md w-full transition duration-300 hover:bg-blue-700 hover:shadow-md">
               Xem chi tiết
             </Link>
           </div>

          ))}
        </div>
      )}

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
