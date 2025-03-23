import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">LIVAK CONSTRUCTION</h3>
            <div className="mb-4">
              <img
                src="https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/09/LIVAK-CONTRUCTION-2-e1722735184415-1.png"
                alt="Logo"
                className="h-16 bg-white rounded-lg p-2"
              />
            </div>
            <p className="mb-4 text-gray-300">
              Chuyên cung cấp các giải pháp xây dựng và trang thiết bị nông
              nghiệp chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-2xl hover:text-blue-400 transition-colors">
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-blue-400 transition-colors">
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-pink-400 transition-colors">
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-red-500 transition-colors">
                <FaYoutube />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-blue-500 transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-white transition-colors">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-gray-300 hover:text-white transition-colors">
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-gray-300 hover:text-white transition-colors">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-gray-300 hover:text-white transition-colors">
                  Điều Khoản & Điều Kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Thông Tin Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-400 flex-shrink-0" />
                <span>123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-blue-400 flex-shrink-0" />
                <a href="tel:+84901234567" className="hover:text-blue-300">
                  090 123 4567
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@livak.vn" className="hover:text-blue-300">
                  info@livak.vn
                </a>
              </li>
              <li className="flex items-start">
                <FaClock className="mt-1 mr-3 text-blue-400 flex-shrink-0" />
                <div>
                  <p>Thứ Hai - Thứ Sáu: 8:00 - 17:30</p>
                  <p>Thứ Bảy: 8:00 - 12:00</p>
                  <p>Chủ Nhật: Đóng cửa</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter & Payment */}
          <div>
            <h3 className="text-xl font-bold mb-4">Đăng Ký Nhận Tin</h3>
            <p className="mb-4 text-gray-300">
              Nhận thông tin mới nhất về sản phẩm và khuyến mãi
            </p>
            <form className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-4 py-2 w-full text-gray-800 rounded-l focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r transition-colors">
                  Đăng Ký
                </button>
              </div>
            </form>

            <h3 className="text-xl font-bold mb-3">Phương Thức Thanh Toán</h3>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white p-2 rounded">
                <FaCreditCard className="text-2xl text-gray-800" />
              </div>
              <div className="bg-white p-2 rounded">
                <FaPaypal className="text-2xl text-blue-600" />
              </div>
              <div className="bg-white p-2 rounded">
                <FaApplePay className="text-2xl text-gray-800" />
              </div>
              <div className="bg-white p-2 rounded">
                <FaGooglePay className="text-2xl text-gray-800" />
              </div>
              <img
                src="/api/placeholder/60/40"
                alt="MoMo"
                className="h-10 bg-white rounded p-1"
              />
              <img
                src="/api/placeholder/60/40"
                alt="VNPay"
                className="h-10 bg-white rounded p-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>
              &copy; {currentYear} LIVAK CONSTRUCTION. Tất cả quyền được bảo
              lưu.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link
              to="/terms-conditions"
              className="text-gray-400 hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link
              to="/sitemap"
              className="text-gray-400 hover:text-white transition-colors">
              Sơ đồ trang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
