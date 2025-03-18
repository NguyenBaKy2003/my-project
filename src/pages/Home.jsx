import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductCard from "../components/ProductCard";
import ProductCardSortedByRating from "../components/product/ProductCardSortedByRating";
import ProductByTradeMark from "../components/product/ProductByTradeMark";

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Khởi tạo AOS với hiệu ứng 1s, chỉ chạy 1 lần
    document.documentElement.style.scrollBehavior = "smooth"; // Kích hoạt cuộn mượt
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
      {/* Banner chính */}
      <div
        className="container mx-auto flex flex-col items-center md:w-4/5 mt-3"
        data-aos="fade-up">
        <img
          src="https://dienmaylongnhat.vn/wp-content/uploads/2018/10/anh-top.jpg"
          alt="Banner chính"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Slider ảnh */}
      <div
        className="container mx-auto my-4 md:w-4/5 relative z-0"
        data-aos="fade-up">
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

      {/* Danh sách sản phẩm */}
      {/* <div data-aos="fade-up">
        <ProductCard />
      </div> */}

      {/* Sản phẩm theo rating */}
      <div data-aos="fade-up" className="mt-10">
        <ProductCardSortedByRating />
      </div>
      <div className="mt-5" data-aos="fade-up">
        <ProductByTradeMark />
      </div>
    </>
  );
}

export default Home;
