import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

function CategoriesPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: "newest",
    priceRange: "all",
  });

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
    if (!categoryId) return;

    // Find current category to display its name
    const currentCategory = categories.find((cat) => cat.id == categoryId);
    if (currentCategory) {
      setSelectedCategory(currentCategory);
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/products?category=${categoryId}`
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
  }, [categoryId, categories]);

  const toggleCategory = (categoryId, hasChildren) => {
    if (hasChildren) {
      setExpandedCategories((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }));
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    // In a real app, you would fetch filtered products here
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500 items-center">
          <a href="/" className="hover:text-blue-500 transition-colors">
            Trang chủ
          </a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <a
            href="/categories"
            className="hover:text-blue-500 transition-colors">
            Danh mục
          </a>
          {selectedCategory && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span className="text-blue-500 font-medium">
                {selectedCategory.name}
              </span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-12 gap-8">
          {/* DANH MỤC - Sidebar */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            {/* Categories */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-5">
                <h2 className="text-lg font-bold flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  Danh mục sản phẩm
                </h2>
              </div>
              <div className="p-4">
                <ul className="space-y-1">
                  {categories
                    .filter((category) => !category.parentCategory)
                    .map((category) => {
                      const subCategories = categories.filter(
                        (sub) => sub.parentCategory?.id === category.id
                      );

                      return (
                        <li key={category.id} className="mb-1">
                          <button
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex justify-between items-center transition-all duration-200 
                              ${
                                categoryId == category.id
                                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                                  : "hover:bg-gray-50 hover:text-blue-500"
                              }`}
                            onClick={() =>
                              toggleCategory(
                                category.id,
                                subCategories.length > 0
                              )
                            }>
                            {category.name}
                            {subCategories.length > 0 && (
                              <span className="text-sm">
                                {expandedCategories[category.id] ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                  </svg>
                                )}
                              </span>
                            )}
                          </button>

                          {expandedCategories[category.id] && (
                            <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
                              {subCategories.map((sub) => (
                                <li key={sub.id}>
                                  <button
                                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200
                                      ${
                                        categoryId == sub.id
                                          ? "bg-blue-50 text-blue-600"
                                          : "hover:bg-gray-50 hover:text-blue-500"
                                      }`}
                                    onClick={() =>
                                      navigate(`/category/${sub.id}`)
                                    }>
                                    {sub.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>

            {/* Filters */}

            {/* <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-5">
                <h2 className="text-lg font-bold flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Bộ lọc
                </h2>
              </div>
              <div className="p-5">
                Price Range Filter
                <div className="mb-5">
                  <h3 className="font-medium mb-3 text-gray-700">Khoảng giá</h3>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "Tất cả" },
                      { id: "under-500k", label: "Dưới 500.000đ" },
                      { id: "500k-1m", label: "500.000đ - 1.000.000đ" },
                      { id: "1m-5m", label: "1.000.000đ - 5.000.000đ" },
                      { id: "over-5m", label: "Trên 5.000.000đ" },
                    ].map((range) => (
                      <div key={range.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${range.id}`}
                          name="price-range"
                          checked={activeFilters.priceRange === range.id}
                          onChange={() =>
                            handleFilterChange("priceRange", range.id)
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor={`price-${range.id}`}
                          className="ml-2 text-sm text-gray-700">
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
       Sort By Filter
                <div>
                  <h3 className="font-medium mb-3 text-gray-700">
                    Sắp xếp theo
                  </h3>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={activeFilters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }>
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="popular">Phổ biến nhất</option>
                  </select>
                </div>
              </div>
            </div> */}
          </div>

          {/* SẢN PHẨM - Main content */}
          <div className="col-span-12 md:col-span-9">
            {/* Category header */}
            <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedCategory
                      ? selectedCategory.name
                      : "Tất cả sản phẩm"}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {products.length} sản phẩm
                  </p>
                </div>
                {/* <div className="text-sm text-gray-500">
                  <span className="font-medium">Sắp xếp:</span>
                  <select
                    className="ml-2 border-0 bg-gray-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    value={activeFilters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }>
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                  </select>
                </div> */}
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="bg-white shadow-sm rounded-xl p-8 text-center border border-gray-100">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full bg-white shadow-sm rounded-xl p-10 text-center border border-gray-100">
                    <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Không có sản phẩm
                    </h3>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                      Hiện chưa có sản phẩm nào trong danh mục này. Vui lòng
                      quay lại sau hoặc khám phá các danh mục khác.
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Khám phá sản phẩm khác
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Trước
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors">
                    2
                  </button>
                  <button className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors">
                    3
                  </button>
                  <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center transition-colors">
                    Sau
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
