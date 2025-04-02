import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase().trim();

  // State to manage products and loading/error states
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch products
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setFilteredProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`https://localhost:8080/api/products`);

        // Filter products based on name matching
        const matchedProducts = response.data.filter((product) =>
          product.name.toLowerCase().includes(query)
        );

        setProducts(response.data);
        setFilteredProducts(matchedProducts);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm: "{query}"</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="text-center py-12 col-span-full text-gray-500">
            Đang tìm kiếm sản phẩm cho "{query}"...
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm: "{query}"</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="text-center py-12 col-span-full text-red-500">
            Đã xảy ra lỗi khi tìm kiếm sản phẩm: {error.message}
          </div>
        </div>
      </div>
    );
  }

  // Render no results state
  if (filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm: "{query}"</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="text-center py-12 col-span-full text-gray-500">
            Không tìm thấy sản phẩm nào cho "{query}"
          </div>
        </div>
      </div>
    );
  }

  // Render products
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm: "{query}"</h1>

      {/* Hiển thị số lượng sản phẩm tìm thấy */}
      <p className="mb-4 text-gray-600">
        Tìm thấy {filteredProducts.length} sản phẩm
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
