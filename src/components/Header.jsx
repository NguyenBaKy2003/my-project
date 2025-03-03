import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaPhone, FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    };
    updateCartCount();
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    // Close dropdown and menu after navigation
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white sticky shadow-md w-full z-50">
      {/* Heading */}
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/">
          <img
            src="https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/09/LIVAK-CONTRUCTION-2-e1722735184415-1.png"
            alt="Logo"
            className="h-12 md:h-16"
          />
        </Link>
        <div className="md:flex flex-1 mx-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700">
            <FaPhone /> Gọi Ngay
          </button>
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-blue-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/checkout"
            className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-600">
            <FaShoppingCart /> Thanh Toán
          </Link>
        </div>

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

        <button
          className="md:hidden p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {/* Danh Mục  */}
      <nav className="hidden md:block bg-white shadow">
        <div className="container mx-auto flex items-center justify-center space-x-6 py-2 text-gray-700 font-semibold">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50
                    ${isActive ? "text-orange-700" : "text-gray-700"}
                    lg:hover:bg-transparent
                    lg:border-0 hover:text-orange-700`
            }>
            TRANG CHỦ
          </NavLink>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="block pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50">
              SẢN PHẨM ▼
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 mt-2 w-[600px] bg-white shadow-lg rounded-lg z-50 p-4 grid grid-cols-3 gap-4">
                {/* Cột 1 */}
                <div>
                  <Link
                    to="/category/thiet-bi-phun-xit"
                    className="font-bold text-gray-700"
                    onClick={() =>
                      handleNavigate("/category/thiet-bi-phun-xit")
                    }>
                    Thiết bị phun và xịt
                  </Link>

                  <NavLink
                    to="/category/bec-phun-mua"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Béc Phun Mưa
                  </NavLink>
                  <NavLink
                    to="/category/bec-tuoi-180"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Béc tưới 180°
                  </NavLink>
                  <NavLink
                    to="/category/bec-tuoi-360"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Béc tưới 360°
                  </NavLink>
                </div>

                {/* Cột 2 */}
                <div>
                  <Link
                    to="/category/thiet-bi-nong-nghiep"
                    className="font-bold text-gray-700"
                    onClick={() =>
                      handleNavigate("/category/thiet-bi-nong-nghiep")
                    }>
                    Thiết bị Nông Nghiệp
                  </Link>
                  <NavLink
                    to="/category/voi-tuoi-cay"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Vòi tưới cây
                  </NavLink>
                  <NavLink
                    to="/category/voi-da-nang"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Vòi đa năng
                  </NavLink>
                  <NavLink
                    to="/category/bo-cuon-ong"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Bộ cuộn ống
                  </NavLink>
                </div>

                {/* Cột 3 */}
                <div>
                  <h3 className="font-bold text-gray-700">
                    THIẾT BỊ TƯỚI NHỎ GIỌT
                  </h3>
                  <NavLink
                    to="/category/dau-tuoi-nho-giot"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Đầu tưới nhỏ giọt
                  </NavLink>
                  <NavLink
                    to="/category/ong-nho-giot"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Ống nhỏ giọt
                  </NavLink>
                  <NavLink
                    to="/category/bo-phun-suong"
                    className="block py-1 text-gray-600 hover:text-blue-500">
                    Bộ phun sương
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/news"
            className={({ isActive }) =>
              `block pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50
                    ${isActive ? "text-orange-700" : "text-gray-700"}
                    lg:hover:bg-transparent
                    lg:border-0 hover:text-orange-700`
            }>
            TIN TỨC
          </NavLink>
          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              `block pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50
                    ${isActive ? "text-orange-700" : "text-gray-700"}
                    lg:hover:bg-transparent
                    lg:border-0 hover:text-orange-700`
            }>
            GIỚI THIỆU
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50
                    ${isActive ? "text-orange-700" : "text-gray-700"}
                    lg:hover:bg-transparent
                    lg:border-0 hover:text-orange-700`
            }>
            LIÊN HỆ
          </NavLink>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-700">
          <FaTimes size={24} />
        </button>
        <ul className="mt-10 space-y-4 px-6">
          <li>
            <Link
              to="/"
              className="block text-lg font-medium hover:text-blue-500"
              onClick={() => setMenuOpen(false)}>
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className="block text-lg font-medium hover:text-blue-500"
              onClick={() => setMenuOpen(false)}>
              Tin Tức
            </Link>
          </li>
          <li className="relative" ref={mobileDropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="block text-lg font-medium hover:text-blue-500 w-full text-left">
              Sản Phẩm ▼
            </button>
            {dropdownOpen && (
              <div className="pl-4 mt-2 space-y-2">
                <Link
                  to="/category/thiet-bi-phun-xit"
                  className="block py-1 hover:text-blue-500"
                  onClick={() => handleNavigate("/category/thiet-bi-phun-xit")}>
                  Thiết bị phun và xịt
                </Link>
                <Link
                  to="/category/thiet-bi-nong-nghiep"
                  className="block py-1 hover:text-blue-500"
                  onClick={() =>
                    handleNavigate("/category/thiet-bi-nong-nghiep")
                  }>
                  Thiết bị Nông Nghiệp
                </Link>
                <Link
                  to="/category/thiet-bi-co-khi"
                  className="block py-1 hover:text-blue-500"
                  onClick={() => handleNavigate("/category/thiet-bi-co-khi")}>
                  Thiết bị Cơ Khí
                </Link>
                <Link
                  to="/category/thiet-bi-dien-nang-luong"
                  className="block py-1 hover:text-blue-500"
                  onClick={() =>
                    handleNavigate("/category/thiet-bi-dien-nang-luong")
                  }>
                  Thiết bị Điện và Năng Lượng
                </Link>
                <Link
                  to="/category/thiet-bi-cam-tay"
                  className="block py-1 hover:text-blue-500"
                  onClick={() => handleNavigate("/category/thiet-bi-cam-tay")}>
                  Thiết bị Cầm Tay
                </Link>
              </div>
            )}
          </li>
          <li>
            <Link
              to="/aboutus"
              className="block text-lg font-medium hover:text-blue-500">
              Giới Thiệu
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block text-lg font-medium hover:text-blue-500"
              onClick={() => setMenuOpen(false)}>
              Liên Hệ
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
