import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { MessageCircle, Send } from "lucide-react"; // More descriptive icons

import ProductCardSortedByRating from "../components/product/ProductCardSortedByRating";
import ProductByTradeMark from "../components/product/ProductByTradeMark";
import { FaFacebookMessenger as MessengerLogo } from "react-icons/fa"; // Messenger
import { SiZalo as ZaloLogo } from "react-icons/si"; // Zalo

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const anhBanner = [
    "https://dienmaylongnhat.vn/wp-content/uploads/2020/02/3de841f8d90c2152781d.jpg",
    "https://dienmaylongnhat.vn/wp-content/uploads/2020/02/Untitled-1-1.jpg",
  ];

  const cauHinhSlider = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true,
    cssEase: "linear",
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-50 relative">
      {/* Social Icons - Fixed Position */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col space-y-4">
        <a
          href="https://zalo.me/0395038729"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 p-3 rounded-full shadow-lg  hover:bg-blue-600 transition group"
          title="Zalo">
          <ZaloLogo
            color="white"
            size={26}
            className="group-hover:scale-110  transition"
          />
        </a>
        <a
          href="https://m.me/your-messenger-page"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition group"
          title="Messenger">
          <MessengerLogo
            color="white"
            size={24}
            className="group-hover:scale-110 transition"
          />
        </a>
      </div>

      {/* Giới thiệu */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Khám phá thiết bị công nghiệp cao cấp
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Trải nghiệm đa dạng sản phẩm công nghiệp chất lượng cao từ các
                thương hiệu uy tín
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                  Mua ngay
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2" data-aos="fade-left">
              <img
                src="https://dienmaylongnhat.vn/wp-content/uploads/2018/10/anh-top.jpg"
                alt="Sản phẩm nổi bật"
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slider ảnh banner */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl" data-aos="fade-up">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Slider {...cauHinhSlider}>
              {anhBanner.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Khuyến mãi ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Phần sản phẩm */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Sản phẩm đánh giá cao */}
          <div data-aos="fade-up" className="mb-16">
            <ProductCardSortedByRating />
          </div>

          {/* Sản phẩm theo thương hiệu */}
          <div data-aos="fade-up">
            <ProductByTradeMark />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
