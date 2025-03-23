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
  FaSearch,
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Track token changes directly
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

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
          console.error("Error fetching user data:", error);
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
  }, [authToken]);

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
        // If user is logged in, get cart by userId
        response = await fetch(
          `http://localhost:8080/api/cart?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // If no userId (guest), get cart by sessionId
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
      console.error("Error fetching cart:", error);
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
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSearchFocused(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchFocused(false);
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
                className="font-bold text-gray-700 block mb-2 hover:text-blue-600 transition-colors"
                onClick={() =>
                  handleNavigate(`/category/${group.parent.slug}`)
                }>
                {group.parent.name}
              </Link>

              {group.children.map((child) => (
                <NavLink
                  key={child.id}
                  to={`/category/${child.slug}`}
                  className="block py-1 text-gray-600 hover:text-blue-500 transition-colors pl-2 border-l-2 border-gray-200"
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
          className="block py-1 font-medium hover:text-blue-500 transition-colors"
          onClick={() => handleNavigate(`/category/${group.parent.slug}`)}>
          {group.parent.name}
        </Link>
        {group.children.length > 0 && (
          <div className="pl-4 space-y-1 mt-1 border-l-2 border-gray-200">
            {group.children.map((child) => (
              <Link
                key={child.id}
                to={`/category/${child.slug}`}
                className="block py-1 text-sm hover:text-blue-500 transition-colors"
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
    <header className="bg-white sticky top-0 z-50">
      {/* Top bar - contact and utility links */}
      <div className="bg-gray-900 text-white py-2 hidden md:block">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaPhone className="text-sm" />
              <span className="text-sm">123-456-7890</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            {!isLoading && !user && (
              <Link
                to="/auth"
                className="hover:text-blue-300 transition-colors flex items-center gap-1">
                <FaUser className="text-xs" />
                <span>Đăng Nhập / Đăng Ký</span>
              </Link>
            )}
            <Link
              to="/contact"
              className="hover:text-blue-300 transition-colors">
              Liên Hệ
            </Link>
            <Link
              to="/aboutus"
              className="hover:text-blue-300 transition-colors">
              Giới Thiệu
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b shadow-sm bg-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              className="p-2 mr-2 text-gray-700 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
            <Link to="/" className="flex-shrink-0">
              <img
                src="https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/09/LIVAK-CONTRUCTION-2-e1722735184415-1.png"
                alt="Logo"
                className="h-10 md:h-12"
              />
            </Link>
          </div>

          {/* Search bar */}
          <div
            className={`flex-1 mx-6 max-w-2xl relative ${
              searchFocused ? "z-30" : ""
            }`}
            ref={searchInputRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Tìm kiếm sản phẩm..."
                className={`w-full border ${
                  searchFocused
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300"
                } rounded-full px-4 py-2 pl-10 focus:outline-none transition-all duration-200`}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchFocused && (
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  →
                </button>
              )}
            </form>
            {/* {searchFocused && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 p-2 z-50">
                <div className="text-sm text-gray-500 mb-2">Tìm kiếm gợi ý</div>
                <div className="space-y-1">
                  <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                    Sản phẩm nông nghiệp
                  </div>
                  <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                    Máy móc công trình
                  </div>
                  <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                    Phụ kiện nông nghiệp
                  </div>
                </div>
              </div>
            )} */}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2  rounded-full hover:bg-gray-100 transition-colors"
              title="Giỏ hàng">
              <FaShoppingCart className="text-xl text-blue-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/checkout"
              className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-600 transition-colors">
              <FaShoppingCart /> Thanh Toán
            </Link>

            {isLoading ? (
              <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-full flex items-center gap-2">
                <div className="animate-pulse">Đang tải...</div>
              </div>
            ) : user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium shadow-md"
                    style={{ backgroundColor: getAvatarColor(user.name) }}>
                    {getUserInitial(user.name)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                    {user.name}
                  </span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg z-50 overflow-hidden border border-gray-100 animate-fadeIn">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-md"
                          style={{
                            backgroundColor: getAvatarColor(user.name),
                          }}>
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
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}>
                      <FaUser className="mr-3 text-gray-600" />
                      Thông tin tài khoản
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}>
                      <FaHistory className="mr-3 text-gray-600" />
                      Đơn hàng của tôi
                    </Link>

                    <Link
                      to="/wishlist"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}>
                      <FaHeart className="mr-3 text-gray-600" />
                      Sản phẩm yêu thích
                    </Link>

                    <Link
                      to="/account/settings"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}>
                      <FaCog className="mr-3 text-gray-600" />
                      Cài đặt tài khoản
                    </Link>

                    <div className="border-t border-gray-200"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
                      <FaSignOutAlt className="mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <FaUser />
                Đăng Nhập
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-1 p-2">
              <FaShoppingCart className="text-xl text-blue-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="hidden md:block bg-white border-t border-gray-100">
          <div className="container mx-auto flex items-center justify-center space-x-8 py-3 text-gray-700 font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `py-1 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600 hover:border-blue-300"
                } transition-colors duration-200`
              }>
              TRANG CHỦ
            </NavLink>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`py-1 border-b-2 ${
                  dropdownOpen
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600 hover:border-blue-300"
                } uppercase transition-colors duration-200 flex items-center gap-1`}>
                Danh Mục
                <span className="text-xs ml-1">▼</span>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-3 w-[600px] bg-white shadow-xl rounded-lg z-50 p-6 grid grid-cols-3 gap-6 border border-gray-100 animate-fadeIn">
                  {renderCategoryColumns()}
                </div>
              )}
            </div>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `py-1 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600 hover:border-blue-300"
                } transition-colors duration-200`
              }>
              SẢN PHẨM
            </NavLink>

            <NavLink
              to="/news"
              className={({ isActive }) =>
                `py-1 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600 hover:border-blue-300"
                } transition-colors duration-200`
              }>
              TIN TỨC
            </NavLink>

            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                `py-1 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600 hover:border-blue-300"
                } transition-colors duration-200`
              }>
              GIỚI THIỆU
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `py-1 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600 hover:border-blue-300"
                } transition-colors duration-200`
              }>
              LIÊN HỆ
            </NavLink>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Sidebar */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden overflow-y-auto`}>
        <div className="p-4 flex justify-between items-center border-b">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src="https://www.thietbinongnghiep.com.vn/wp-content/uploads/2024/09/LIVAK-CONTRUCTION-2-e1722735184415-1.png"
              alt="Logo"
              className="h-8"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mobile search */}
        <div className="px-4 py-3 border-b">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
        </div>

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
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium shadow-md"
                  style={{ backgroundColor: getAvatarColor(user.name) }}>
                  {getUserInitial(user.name)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate max-w-[180px]">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2 divide-y divide-gray-100">
                <div className="space-y-2 pb-2">
                  <Link
                    to="/profile"
                    className="block text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 flex items-center gap-2 py-2 px-3 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}>
                    <FaUser className="text-gray-500 w-4 h-4" />
                    Thông tin tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    className="block text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 flex items-center gap-2 py-2 px-3 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}>
                    <FaHistory className="text-gray-500 w-4 h-4" />
                    Đơn hàng của tôi
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 flex items-center gap-2 py-2 px-3 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}>
                    <FaHeart className="text-gray-500 w-4 h-4" />
                    Sản phẩm yêu thích
                  </Link>
                </div>
                <div className="space-y-2 pt-2">
                  <Link
                    to="/account/settings"
                    className="block text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 flex items-center gap-2 py-2 px-3 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}>
                    <FaCog className="text-gray-500 w-4 h-4" />
                    Cài đặt tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block text-sm text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 py-2 px-3 rounded-lg transition-colors">
                    <FaSignOutAlt className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <Link
                to="/auth"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setMenuOpen(false)}>
                <FaUser />
                <span>Đăng nhập / Đăng ký</span>
              </Link>
              <div className="mt-3 text-center text-sm text-gray-500">
                Đăng nhập để xem thông tin và quản lý đơn hàng
              </div>
            </div>
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
              Danh Mục ▼
            </button>
            {dropdownOpen && (
              <div className="pl-4 mt-2 space-y-2">
                {renderMobileCategories()}
              </div>
            )}
          </li>
          <li>
            <Link
              to="/products"
              className="block text-lg font-medium hover:text-blue-500"
              onClick={() => setMenuOpen(false)}>
              Sản Phẩm
            </Link>
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
