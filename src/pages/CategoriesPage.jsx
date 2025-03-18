import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:8080/api/categories");
        if (!response.ok) throw new Error("Lỗi khi tải danh mục");

        const categoryList = await response.json();
        setCategories(categoryList);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/products?category=${selectedCategory}`
        );
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm");

        const productList = await response.json();
        setProducts(productList);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* DANH MỤC (2/10) */}
        <div className="col-span-12 md:col-span-2 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md font-semibold transition flex justify-between items-center 
                    ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    toggleCategory(category.id);
                  }}>
                  {category.name}
                  {category.parentCategory ? <span>▼</span> : null}
                </button>
                {expandedCategories[category.id] && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {categories
                      .filter((sub) => sub.parentCategory?.id === category.id)
                      .map((sub) => (
                        <li key={sub.id}>
                          <button
                            className={`w-full text-left px-4 py-2 rounded-md font-medium transition 
                              ${
                                selectedCategory === sub.id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            onClick={() => setSelectedCategory(sub.id)}>
                            {sub.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* SẢN PHẨM (10/10) */}
        <div className="col-span-12 md:col-span-10">
          <h2 className="text-2xl font-bold mb-4">Sản phẩm theo danh mục</h2>
          {loading ? (
            <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white shadow-lg rounded-lg p-4 transform transition duration-300 hover:shadow-2xl hover:scale-105">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="w-full h-60 object-cover rounded-lg"
                      />
                      <h2 className="font-bold mt-2">{product.name}</h2>
                      <p className="text-blue-600 font-bold text-lg mt-1">
                        {product.price.toLocaleString()} đ
                      </p>
                    </Link>
                    <Link
                      to={`/product/${product.id}`}
                      className="block text-center mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700">
                      Xem chi tiết
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-4">
                  Không có sản phẩm nào trong danh mục này.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
