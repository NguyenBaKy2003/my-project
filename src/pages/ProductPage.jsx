import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("TẤT CẢ");
  const [trademarks, setTrademarks] = useState([]);
  const [selectedTrademark, setSelectedTrademark] = useState("TẤT CẢ");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortOption, setSortOption] = useState("none");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm");
        const productList = await response.json();

        setProducts(productList);
        setTrademarks([...new Set(productList.map((p) => p.tradeMark))]);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:8080/api/categories");
        if (!response.ok) throw new Error("Lỗi khi tải danh mục");
        const categoryList = await response.json();
        setCategories(["TẤT CẢ", ...categoryList.map((c) => c.name)]);
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
      if (sortOption === "rating-desc") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="p-2 border rounded w-full md:w-1/3"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedTrademark(e.target.value)}
          className="p-2 border rounded">
          <option value="TẤT CẢ">TẤT CẢ</option>
          {trademarks.map((trademark) => (
            <option key={trademark} value={trademark}>
              {trademark}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded">
          <option value="none">Mặc định</option>
          <option value="price-asc">Giá: Thấp đến cao</option>
          <option value="price-desc">Giá: Cao đến thấp</option>
          <option value="rating-desc">Đánh giá cao</option>
        </select>
      </div>
      <div className="mb-6">
        <Slider
          range
          min={0}
          max={50000000}
          step={1000000}
          value={priceRange}
          onChange={setPriceRange}
        />
        <p className="text-center">
          Khoảng giá: {priceRange[0].toLocaleString()} đ -{" "}
          {priceRange[1].toLocaleString()} đ
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-xl p-4 hover:scale-105 transition">
            <Link to={`/product/${product.id}`}>
              <img
                src={
                  product.primaryImage.url || "https://via.placeholder.com/150"
                }
                alt={product.name}
                className="w-full h-60 object-cover rounded-lg"
              />
              <h3 className="text-sm text-gray-500 mt-2">
                {product.category.name}
              </h3>
              <h2 className="font-bold">{product.name}</h2>
              <p className="text-blue-600 font-bold text-xl">
                {product.price.toLocaleString()} đ
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductPage;
