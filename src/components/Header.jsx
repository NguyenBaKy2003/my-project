import React, { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaPhone,
  FaBars,
  FaTimes,
  FaUser,
  FaHistory,
  FaHeart,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Track token changes directly
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  // let sessionId = localStorage.getItem("sessionId") || Date.now().toString();
  // localStorage.setItem("sessionId", sessionId);

  // Get first letter of user's name for avatar
  const getUserInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Get background color based on user's name
  const getAvatarColor = (name) => {
    if (!name) return "#3B82F6"; // Default blue

    // Simple hash function to generate consistent color for same name
    const colors = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#6366F1", // Indigo
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Transform data to match the expected structure
        const transformedData = data.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          parentId: category.parentCategory ? category.parentCategory.id : null,
          slug: category.slug || category.name.toLowerCase().replace(/ /g, "-"),
        }));

        setCategories(transformedData);
      } catch (error) {
        console.error("Error processing categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (userId && token) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            setUser(await response.json());
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    fetchUserData();
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setAuthToken(localStorage.getItem("token"));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [authToken]);

  // Initial fetch of user data and set up event listeners
  useEffect(() => {
    // Add event listener for login events
    const handleUserLoggedIn = () => {
      const token = localStorage.getItem("token");
      setAuthToken(token);
    };

    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    // Set up interval to check auth token periodically
    const checkAuthInterval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== authToken) {
        setAuthToken(currentToken);
      }
    }, 1000);

    // Clean up event listeners and intervals
    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      clearInterval(checkAuthInterval);
    };
  }, [authToken]); // Added authToken as dependency

  // Listen for storage changes (in case user logs in from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "userId") {
        setAuthToken(localStorage.getItem("token"));
      } else if (e.key === "cart") {
        // Update cart when localStorage cart changes
        updateCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to update cart count - extracted for reuse
  const updateCartCount = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let sessionId = localStorage.getItem("sessionId");

    try {
      let response;
      if (userId && token) {
        // Nếu có user đăng nhập, lấy giỏ hàng theo userId
        response = await fetch(
          `http://localhost:8080/api/cart?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Nếu không có userId (khách vãng lai), lấy giỏ hàng theo sessionId
        response = await fetch(
          `http://localhost:8080/api/cart?sessionId=${sessionId}`
        );
      }

      if (response.ok) {
        const data = await response.json();
        const totalQuantity = data.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalQuantity);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setCartCount(0);
    }
  };

  // Update cart count - improved to work with all updates
  useEffect(() => {
    // Initial cart count update
    updateCartCount();

    // Listen for cart updates via custom events
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Additional event listeners for specific cart actions
    window.addEventListener("productAddedToCart", handleCartUpdate);
    window.addEventListener("productRemovedFromCart", handleCartUpdate);
    window.addEventListener("cartQuantityChanged", handleCartUpdate);
    window.addEventListener("cartCleared", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("productAddedToCart", handleCartUpdate);
      window.removeEventListener("productRemovedFromCart", handleCartUpdate);
      window.removeEventListener("cartQuantityChanged", handleCartUpdate);
      window.removeEventListener("cartCleared", handleCartUpdate);
    };
  }, [user]); // Added user as dependency to re-run when login status changes

  // Handle clicks outside menus to close them
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
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
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
    setUserDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setAuthToken(null);
    setUser(null);
    setUserDropdownOpen(false);
    // Reset cart count for logged out user
    setCartCount(0);
    // Redirect to home page after logout
    navigate("/");
    // Show success notification (if you have a notification system)
    if (window.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent("showNotification", {
          detail: {
            message: "Đăng xuất thành công",
            type: "success",
          },
        })
      );
    }
  };

  // Group categories by parent for dropdown menu
  const groupedCategories = React.useMemo(() => {
    if (!categories.length) return {};

    const grouped = {};
    // First, identify parent categories (those with no parent or parentId is null)
    const parentCategories = categories.filter((cat) => !cat.parentId);

    // For each parent category, find its children
    parentCategories.forEach((parent) => {
      const children = categories.filter((cat) => cat.parentId === parent.id);
      grouped[parent.id] = {
        parent: parent,
        children: children,
      };
    });

    return grouped;
  }, [categories]);

  // Function to render category items in dropdown columns
  const renderCategoryColumns = () => {
    if (categoriesLoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <div className="animate-pulse">Đang tải danh mục...</div>
        </div>
      );
    }

    // Get parent categories
    const parentGroups = Object.values(groupedCategories);

    // If no categories fetched
    if (parentGroups.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          Không tìm thấy danh mục
        </div>
      );
    }

    // Calculate number of columns (max 3)
    const numColumns = Math.min(parentGroups.length, 3);

    // Split parent categories into columns
    const columnsContent = [];
    for (let i = 0; i < numColumns; i++) {
      const startIdx = Math.floor((i * parentGroups.length) / numColumns);
      const endIdx = Math.floor(((i + 1) * parentGroups.length) / numColumns);
      const columnItems = parentGroups.slice(startIdx, endIdx);

      columnsContent.push(
        <div key={`column-${i}`}>
          {columnItems.map((group) => (
            <div key={group.parent.id} className="mb-4">
              <Link
                to={`/category/${group.parent.slug}`}
                className="font-bold text-gray-700 block mb-2"
                onClick={() =>
                  handleNavigate(`/category/${group.parent.slug}`)
                }>
                {group.parent.name}
              </Link>

              {group.children.map((child) => (
                <NavLink
                  key={child.id}
                  to={`/category/${child.slug}`}
                  className="block py-1 text-gray-600 hover:text-blue-500"
                  onClick={() => setDropdownOpen(false)}>
                  {child.name}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return columnsContent;
  };

  // Function to render mobile category items
  const renderMobileCategories = () => {
    if (categoriesLoading) {
      return (
        <div className="pl-4 mt-2">
          <div className="animate-pulse">Đang tải danh mục...</div>
        </div>
      );
    }

    return Object.values(groupedCategories).map((group) => (
      <div key={group.parent.id} className="mb-2">
        <Link
          to={`/category/${group.parent.slug}`}
          className="block py-1 font-medium hover:text-blue-500"
          onClick={() => handleNavigate(`/category/${group.parent.slug}`)}>
          {group.parent.name}
        </Link>
        {group.children.length > 0 && (
          <div className="pl-4 space-y-1 mt-1">
            {group.children.map((child) => (
              <Link
                key={child.id}
                to={`/category/${child.slug}`}
                className="block py-1 text-sm hover:text-blue-500"
                onClick={() => handleNavigate(`/category/${child.slug}`)}>
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <header className="bg-white sticky top-0 shadow-md w-full z-50">
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

          {isLoading ? (
            // Show loading state
            <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-full flex items-center gap-2">
              <div className="animate-pulse">Đang tải...</div>
            </div>
          ) : !user ? (
            <Link
              to="/auth"
              className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-600">
              <FaUser />
              Đăng Nhập
            </Link>
          ) : (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full">
                {/* Letter Avatar - First letter of user's name */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: getAvatarColor(user.name) }}>
                  {getUserInitial(user.name)}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                  {user.name}
                </span>
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-50 overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: getAvatarColor(user.name) }}>
                        {getUserInitial(user.name)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}>
                    <FaUser className="mr-3 text-gray-600" />
                    Thông tin tài khoản
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}>
                    <FaHistory className="mr-3 text-gray-600" />
                    Đơn hàng của tôi
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}>
                    <FaHeart className="mr-3 text-gray-600" />
                    Sản phẩm yêu thích
                  </Link>

                  <Link
                    to="/account/settings"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}>
                    <FaCog className="mr-3 text-gray-600" />
                    Cài đặt tài khoản
                  </Link>

                  <div className="border-t border-gray-200"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100">
                    <FaSignOutAlt className="mr-3" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <NavLink to="/cart" className="relative mx-2 cursor-pointer">
            <FaShoppingCart className="text-2xl text-blue-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </NavLink>

          <button
            className="p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
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
              <div className="absolute left-0 mt-2 w-[600px] bg-white shadow-lg rounded-lg z-50 p-4 grid grid-cols-3 gap-4">
                {renderCategoryColumns()}
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
        } md:hidden overflow-y-auto`}>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-700">
          <FaTimes size={24} />
        </button>

        {/* User info in mobile menu */}
        <div className="px-6 py-4 border-b">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ) : user ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: getAvatarColor(user.name) }}>
                  {getUserInitial(user.name)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  to="/profile"
                  className="block text-sm text-gray-600 hover:text-blue-500 flex items-center gap-2 py-1"
                  onClick={() => setMenuOpen(false)}>
                  <FaUser className="text-gray-500" />
                  Thông tin tài khoản
                </Link>
                <Link
                  to="/orders"
                  className="block text-sm text-gray-600 hover:text-blue-500 flex items-center gap-2 py-1"
                  onClick={() => setMenuOpen(false)}>
                  <FaHistory className="text-gray-500" />
                  Đơn hàng của tôi
                </Link>
                <Link
                  to="/wishlist"
                  className="block text-sm text-gray-600 hover:text-blue-500 flex items-center gap-2 py-1"
                  onClick={() => setMenuOpen(false)}>
                  <FaHeart className="text-gray-500" />
                  Sản phẩm yêu thích
                </Link>
                <Link
                  to="/account/settings"
                  className="block text-sm text-gray-600 hover:text-blue-500 flex items-center gap-2 py-1"
                  onClick={() => setMenuOpen(false)}>
                  <FaCog className="text-gray-500" />
                  Cài đặt tài khoản
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-sm text-red-500 hover:text-red-700 flex items-center gap-2 py-1">
                  <FaSignOutAlt />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 text-blue-600"
              onClick={() => setMenuOpen(false)}>
              <FaUser />
              <span>Đăng nhập / Đăng ký</span>
            </Link>
          )}
        </div>

        <ul className="mt-4 space-y-4 px-6">
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
                {renderMobileCategories()}
              </div>
            )}
          </li>
          <li>
            <Link
              to="/aboutus"
              className="block text-lg font-medium hover:text-blue-500"
              onClick={() => setMenuOpen(false)}>
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
