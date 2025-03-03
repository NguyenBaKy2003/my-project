import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaPhone, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef(null);

  // Lấy tổng số lượng sản phẩm trong giỏ hàng từ localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    };

    updateCartCount();

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto flex items-center justify-between px-6 relative">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/09/LIVAK-CONTRUCTION-2-e1722735184415-1.png"
              alt="Logo"
              className="h-14 md:h-20"
            />
          </Link>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="md:flex flex-1 mx-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Gọi ngay & giỏ hàng & thanh toán */}
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <FaPhone />
            Gọi Ngay
          </button>
          <Link to="/cart" className="relative cursor-pointer">
            <FaShoppingCart className="text-2xl text-blue-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/checkout"
            className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <FaShoppingCart />
            Thanh Toán
          </Link>
        </div>

        {/* Giỏ hàng trên mobile */}
        <div className="md:hidden right-12 top-1/2 transform translate-y">
          <Link to="/cart" className="relative mx-2 cursor-pointer">
            <FaShoppingCart className="text-2xl text-blue-700" />
            {cartCount > 0 && (
              <span className="absolute top-2 -right-6 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Menu trên mobile */}
        <button
          className="md:hidden text-gray cursor-pointer ml-2 text-2xl z-10"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Navigation - Desktop */}
      <nav ref={menuRef} className="bg-white hidden md:block">
        <div className="container mx-auto flex items-center justify-center space-x-6 py-2 text-gray-700 font-semibold">
          <Link to="/" className="text-black font-bold">
            TRANG CHỦ
          </Link>
          <Link to="/category/thiet-bi-phun-xit">Thiết bị phun và xịt</Link>
          <Link to="/category/thiet-bi-nong-nghiep">Thiết bị Nông Nghiệp</Link>
          <Link to="/category/thiet-bi-co-khi">Thiết bị Cơ Khí</Link>
          <Link to="/category/thiet-bi-dien-nang-luong">
            Thiết bị Điện và Năng Lượng
          </Link>
          <Link to="/category/thiet-bi-cam-tay">Thiết bị Cầm Tay</Link>
          <Link to="/news">TIN TỨC</Link>
          <Link to="/contact">LIÊN HỆ</Link>
        </div>
      </nav>
      {menuOpen && (
        <nav className="md:hidden w-max fixed top-0 right-0  h-full bg-white shadow-lg z-50 transition-transform duration-300 ">
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setMenuOpen(false)}>
            <FaTimes />
          </button>
          <ul className="flex flex-col items-start space-y-4 py-10 px-6 text-gray-700 font-semibold">
            <li>
              <Link
                to="/"
                className="text-black font-bold w-full hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                TRANG CHỦ
              </Link>
            </li>
            <li>
              <Link
                to="/category/thiet-bi-phun-xit"
                className="hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                Thiết bị phun và xịt
              </Link>
            </li>
            <li>
              <Link
                to="/category/thiet-bi-nong-nghiep"
                className="hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                Thiết bị Nông Nghiệp
              </Link>
            </li>
            <li>
              <Link
                to="/category/thiet-bi-co-khi"
                className="hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                Thiết bị Cơ Khí
              </Link>
            </li>
            <li>
              <Link
                to="/category/thiet-bi-dien-nang-luong"
                className="hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                Thiết bị Điện và Năng Lượng
              </Link>
            </li>
            <li>
              <Link
                to="/category/thiet-bi-cam-tay"
                className="hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                Thiết bị Cầm Tay
              </Link>
            </li>
            <li>
              <Link
                to="/tin-tuc"
                className="hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                TIN TỨC
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-blue-500 hover:bg-gray-200 px-3 py-2 rounded transition duration-300">
                LIÊN HỆ
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
