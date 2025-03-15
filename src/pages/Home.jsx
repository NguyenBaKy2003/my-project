import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../components/ProductCard";

function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:8080/api/categories");
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh mục");
        }
        const categoryList = await response.json();

        // Lọc chỉ danh mục cha (parentCategory === null)
        const parentCategories = categoryList.filter(
          (category) => category.parentCategory === null
        );

        setCategories(parentCategories);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    }

    fetchCategories();
  }, []);

  const images = [
    "https://dienmaylongnhat.vn/wp-content/uploads/2020/02/3de841f8d90c2152781d.jpg",
    "https://dienmaylongnhat.vn/wp-content/uploads/2020/02/Untitled-1-1.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <>
      <div className="container mx-auto flex flex-col items-center mt-4">
        <img
          src="https://dienmaylongnhat.vn/wp-content/uploads/2018/10/anh-top.jpg"
          alt="Banner chính"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="container mx-auto my-4 relative z-0">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover z-0"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Danh mục sản phẩm */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Danh Mục Sản Phẩm
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 justify-center  lg:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="p-4 bg-gray-100 text-center rounded hover:bg-gray-200">
                {category.name}
              </Link>
            ))
          ) : (
            <p className="text-center col-span-4">Đang tải danh mục...</p>
          )}
        </div>
      </div>

      <ProductCard />
    </>
  );
}

export default Home;
