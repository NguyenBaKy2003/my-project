import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../components/ProductCard";

function Home() {
  const images = [
    "https://dienmaylongnhat.vn/wp-content/uploads/2020/02/3de841f8d90c2152781d.jpg",

    "https://dienmaylongnhat.vn/wp-content/uploads/2020/02/Untitled-1-1.jpg",
  ];

  const settings = {
    dots: true, // Hiển thị dấu chấm chỉ số
    infinite: true, // Chạy lặp vô hạn
    speed: 500, // Tốc độ chuyển ảnh
    slidesToShow: 1, // Hiển thị 1 ảnh mỗi lần
    slidesToScroll: 1, // Cuộn từng ảnh một
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3000, // Chuyển ảnh sau 3 giây
    arrows: true, // Hiển thị nút điều hướng
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

      <div className="container mx-auto my-4 relative z-0 ">
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Danh Mục Sản Phẩm
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            to="/category/thiet-bi-phun-xit"
            className="p-4 bg-gray-100 text-center rounded hover:bg-gray-200">
            Thiết bị phun và xịt
          </Link>
          <Link
            to="/category/thiet-bi-nong-nghiep"
            className="p-4 bg-gray-100 text-center rounded hover:bg-gray-200">
            Thiết bị Nông Nghiệp
          </Link>
          <Link
            to="/category/thiet-bi-co-khi"
            className="p-4 bg-gray-100 text-center rounded hover:bg-gray-200">
            Thiết bị Cơ Khí
          </Link>
          <Link
            to="/category/thiet-bi-dien"
            className="p-4 bg-gray-100 text-center rounded hover:bg-gray-200">
            Thiết bị Điện
          </Link>
        </div>
      </div>

      <ProductCard></ProductCard>
    </>
  );
}

export default Home;
