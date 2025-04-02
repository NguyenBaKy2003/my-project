import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ProductCard from "../components/ProductCard";
import { Search, Filter, ArrowUpDown, X, RefreshCw } from "lucide-react";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("TẤT CẢ");
  const [trademarks, setTrademarks] = useState([]);
  const [selectedTrademark, setSelectedTrademark] = useState("TẤT CẢ");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortOption, setSortOption] = useState("none");
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          "https://45.122.253.163:8891/api/products"
        );
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm");
        const productList = await response.json();
        setProducts(productList);
        setTrademarks([...new Set(productList.map((p) => p.tradeMark))]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch(
          "https://45.122.253.163:8891/api/categories"
        );
        if (!response.ok) throw new Error("Lỗi khi tải danh mục");
        const categoryList = await response.json();

        setCategories([
          { id: "TẤT CẢ", name: "TẤT CẢ", parentCategory: null },
          ...categoryList,
        ]);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "TẤT CẢ" ||
        product.category.name === selectedCategory
    )
    .filter(
      (product) =>
        selectedTrademark === "TẤT CẢ" ||
        product.tradeMark === selectedTrademark
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "rating-desc")
        return b.averageRating - a.averageRating;
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      if (sortOption === "newest")
        return new Date(b.createdDate) - new Date(a.createdDate);
      if (sortOption === "oldest")
        return new Date(a.createdDate) - new Date(b.createdDate);
      return 0;
    });

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("TẤT CẢ");
    setSelectedTrademark("TẤT CẢ");
    setPriceRange([0, 50000000]);
    setSortOption("none");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sản phẩm</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2">•</span>
            <span className="text-gray-800">Sản phẩm</span>
            <div className="ml-auto">
              Hiển thị{" "}
              <span className="font-medium text-gray-800">
                {filteredProducts.length}
              </span>{" "}
              trong số{" "}
              <span className="font-medium text-gray-800">
                {products.length}
              </span>{" "}
              sản phẩm
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
            {/* Header with search */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-500" />
                  Bộ lọc
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-3 transition-colors duration-150">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Đặt lại
                  </button>
                </div>
              </div>

              <div className="relative mt-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-10 py-2.5 px-4 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter controls */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Danh mục
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="block w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none appearance-none transition-all duration-200">
                      {categories
                        .filter(
                          (category) =>
                            category.parentCategory !== null ||
                            category.id === "TẤT CẢ"
                        )
                        .map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thương hiệu
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTrademark}
                      onChange={(e) => setSelectedTrademark(e.target.value)}
                      className="block w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none appearance-none transition-all duration-200">
                      <option value="TẤT CẢ">TẤT CẢ</option>
                      {trademarks.map((trademark) => (
                        <option key={trademark} value={trademark}>
                          {trademark}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Sắp xếp theo
                  </label>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="block w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none appearance-none transition-all duration-200">
                      <option value="none">Mặc định</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                      <option value="rating-desc">Đánh giá cao nhất</option>
                      <option value="name-asc">Tên: A → Z</option>
                      <option value="name-desc">Tên: Z → A</option>
                      <option value="newest">Sản phẩm mới nhất</option>
                      <option value="oldest">Sản phẩm cũ nhất</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Khoảng giá
                  </label>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{priceRange[0].toLocaleString()} ₫</span>
                    <span>—</span>
                    <span>{priceRange[1].toLocaleString()} ₫</span>
                  </div>
                </div>
                <div className="px-1 py-2">
                  <Slider
                    range
                    min={0}
                    max={50000000}
                    step={1000000}
                    value={priceRange}
                    onChange={setPriceRange}
                    trackStyle={[{ backgroundColor: "#3b82f6" }]}
                    handleStyle={[
                      {
                        backgroundColor: "#fff",
                        borderColor: "#3b82f6",
                        boxShadow: "0 0 0 2px #bfdbfe",
                      },
                      {
                        backgroundColor: "#fff",
                        borderColor: "#3b82f6",
                        boxShadow: "0 0 0 2px #bfdbfe",
                      },
                    ]}
                    railStyle={{ backgroundColor: "#e5e7eb" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden mb-6">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
            <Filter className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-medium">Bộ lọc & Tìm kiếm</span>
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {filteredProducts.length}
            </span>
          </button>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-opacity-30 z-50 transition-opacity duration-200">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-800">Bộ lọc</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto h-full pb-32">
                  {/* Search */}
                  <div className="mb-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="pl-10 py-2.5 px-4 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Danh mục
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none appearance-none transition-all duration-200">
                        {categories
                          .filter(
                            (category) =>
                              category.parentCategory !== null ||
                              category.id === "TẤT CẢ"
                          )
                          .map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Thương hiệu
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTrademark}
                        onChange={(e) => setSelectedTrademark(e.target.value)}
                        className="block w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none appearance-none transition-all duration-200">
                        <option value="TẤT CẢ">TẤT CẢ</option>
                        {trademarks.map((trademark) => (
                          <option key={trademark} value={trademark}>
                            {trademark}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Sắp xếp theo
                    </label>
                    <div className="relative">
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="block w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none appearance-none transition-all duration-200">
                        <option value="none">Mặc định</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="rating-desc">Đánh giá cao nhất</option>
                        <option value="name-asc">Tên: A → Z</option>
                        <option value="name-desc">Tên: Z → A</option>
                        <option value="newest">Sản phẩm mới nhất</option>
                        <option value="oldest">Sản phẩm cũ nhất</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Khoảng giá
                      </label>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{priceRange[0].toLocaleString()} ₫</span>
                        <span>—</span>
                        <span>{priceRange[1].toLocaleString()} ₫</span>
                      </div>
                    </div>
                    <div className="px-1 py-2">
                      <Slider
                        range
                        min={0}
                        max={50000000}
                        step={1000000}
                        value={priceRange}
                        onChange={setPriceRange}
                        trackStyle={[{ backgroundColor: "#3b82f6" }]}
                        handleStyle={[
                          {
                            backgroundColor: "#fff",
                            borderColor: "#3b82f6",
                            boxShadow: "0 0 0 2px #bfdbfe",
                          },
                          {
                            backgroundColor: "#fff",
                            borderColor: "#3b82f6",
                            boxShadow: "0 0 0 2px #bfdbfe",
                          },
                        ]}
                        railStyle={{ backgroundColor: "#e5e7eb" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-gray-50">
                      Đặt lại
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-blue-700">
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== "TẤT CẢ" ||
          selectedTrademark !== "TẤT CẢ" ||
          priceRange[0] > 0 ||
          priceRange[1] < 50000000 ||
          searchTerm ||
          sortOption !== "none") && (
          <div className="bg-white rounded-lg p-3 mb-6 shadow-sm flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 mr-2">
              Bộ lọc đang dùng:
            </span>

            {selectedCategory !== "TẤT CẢ" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("TẤT CẢ")}
                  className="ml-1.5 text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedTrademark !== "TẤT CẢ" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                {selectedTrademark}
                <button
                  onClick={() => setSelectedTrademark("TẤT CẢ")}
                  className="ml-1.5 text-purple-500 hover:text-purple-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 50000000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                {priceRange[0].toLocaleString()} ₫ —{" "}
                {priceRange[1].toLocaleString()} ₫
                <button
                  onClick={() => setPriceRange([0, 50000000])}
                  className="ml-1.5 text-green-500 hover:text-green-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1.5 text-amber-500 hover:text-amber-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {sortOption !== "none" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                {sortOption === "price-asc"
                  ? "Giá: Thấp đến Cao"
                  : sortOption === "price-desc"
                  ? "Giá: Cao đến Thấp"
                  : sortOption === "rating-desc"
                  ? "Đánh giá cao nhất"
                  : sortOption === "name-asc"
                  ? "Tên: A → Z"
                  : sortOption === "name-desc"
                  ? "Tên: Z → A"
                  : sortOption === "newest"
                  ? "Sản phẩm mới nhất"
                  : "Sản phẩm cũ nhất"}
                <button
                  onClick={() => setSortOption("none")}
                  className="ml-1.5 text-rose-500 hover:text-rose-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleReset}
              className="ml-auto text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Product Display */}
        {loading ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100 text-gray-400">
                  <svg
                    className="h-8 w-8"
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
                <h3 className="text-lg font-medium text-gray-900">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
                  Hãy thử điều chỉnh các bộ lọc để xem nhiều sản phẩm hơn.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination (static example) */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
                    &laquo; Trước
                  </button>
                  <button className="px-3 py-2 rounded-md bg-blue-600 text-white">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
                    3
                  </button>
                  <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
                    Sau &raquo;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
