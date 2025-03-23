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
    <div className="bg-gray-50">
      {/* Phần giới thiệu */}
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
                {/* <Link
                  to="/specials"
                  className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-300">
                  Xem khuyến mãi
                </Link> */}
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
          {/* <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Chương trình khuyến mãi
          </h2> */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Slider {...cauHinhSlider}>
              {anhBanner.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Khuyến mãi ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                  {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold">
                      Ưu đãi đặc biệt {index + 1}
                    </h3>
                    <p className="text-white text-lg">
                      Khuyến mãi có thời hạn cho các sản phẩm đã chọn
                    </p>
                  </div> */}
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
            <div className="flex justify-between items-center mb-8">
              {/* <h2 className="text-3xl font-bold text-gray-800">
                Sản phẩm đánh giá cao
              </h2>
              <Link
                to="/top-rated"
                className="text-blue-600 hover:text-blue-800 font-medium">
                Xem tất cả →
              </Link> */}
            </div>
            <ProductCardSortedByRating />
          </div>

          {/* Sản phẩm theo thương hiệu */}
          <div data-aos="fade-up">
            {/* <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Mua sắm theo thương hiệu
              </h2>
              <Link
                to="/brands"
                className="text-blue-600 hover:text-blue-800 font-medium">
                Xem tất cả thương hiệu →
              </Link>
            </div> */}
            <ProductByTradeMark />
          </div>
        </div>
      </div>

      {/* Đăng ký nhận tin */}
      {/* <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div
          className="container mx-auto px-4 max-w-6xl text-center"
          data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Đăng ký nhận bản tin
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký để nhận thông tin cập nhật về sản phẩm mới, ưu đãi đặc biệt
            và giảm giá độc quyền.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Địa chỉ email của bạn"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-300">
              Đăng ký
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
