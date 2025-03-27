import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Registration-specific validations
    if (!isLogin) {
      // First name validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = "Tên không được để trống";
      }

      // Last name validation
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Họ không được để trống";
      }

      // Phone number validation
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Số điện thoại không được để trống";
      } else if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ";
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear specific field error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const endpoint = isLogin
        ? "http://localhost:8080/api/users/login"
        : "http://localhost:8080/api/users/register";

      const dataToSend = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        if (isLogin) {
          if (result.token && result.userId) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("userId", result.userId.id);
            toast.success("Đăng nhập thành công!");
            setTimeout(() => navigate("/"), 1000);
          } else {
            throw new Error("Dữ liệu phản hồi không hợp lệ!");
          }
        } else {
          toast.success("Đăng ký thành công!");
          setIsLogin(true); // Switch to login form after successful registration
        }
      } else {
        throw new Error(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      toast.error(
        error.message || (isLogin ? "Đăng nhập thất bại!" : "Đăng ký thất bại!")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
        </p>

        <div className="mb-6">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 font-medium text-center ${
                isLogin
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}>
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 font-medium text-center ${
                !isLogin
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}>
              Đăng ký
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              />
              <Input
                label="Tên"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              />
            </div>
          )}

          {!isLogin && (
            <Input
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              }
            />
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
          />

          {!isLogin && (
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />
          )}

          {isLogin && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium shadow-md">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        {isLogin && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.195,1.045-0.564,2.032-1.091,2.917c-0.563,0.949-1.283,1.764-2.163,2.449c-0.882,0.684-1.897,1.221-3.044,1.607C10.542,21.393,9.315,21.6,8,21.6c-1.313,0-2.544-0.207-3.688-0.618c-1.146-0.386-2.157-0.923-3.037-1.608c-0.881-0.686-1.602-1.501-2.165-2.45C-1.4,15.96-1.768,14.973-1.963,13.927H2.545c0.341,0.622,0.794,1.165,1.365,1.632s1.214,0.823,1.934,1.07c0.72,0.245,1.492,0.368,2.312,0.368c0.822,0,1.593-0.123,2.312-0.368c0.719-0.247,1.363-0.602,1.934-1.07c0.573-0.467,1.025-1.01,1.365-1.632H8v-1.909c0-1.054,0.855-1.909,1.909-1.909h2.636V7.04c-0.997-0.347-2.031-0.531-3.09-0.54C8.28,6.49,7.12,6.688,6.037,7.083c-1.084,0.397-2.037,0.945-2.857,1.643C2.356,9.427,1.706,10.27,1.218,11.29H-1.96c0.196-1.089,0.564-2.098,1.108-3.027c0.543-0.93,1.252-1.752,2.133-2.465c0.882-0.714,1.907-1.264,3.08-1.65C5.532,3.761,6.829,3.567,8.255,3.567c1.428,0,2.725,0.194,3.893,0.581c1.167,0.386,2.192,0.936,3.071,1.65c0.879,0.713,1.589,1.535,2.131,2.465c0.543,0.929,0.913,1.938,1.11,3.027l0,0.861H12.545z" />
                </svg>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  icon,
  error,
}) => (
  <div className="relative">
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? "focus:ring-red-500 focus:border-red-500"
            : "focus:ring-blue-500 focus:border-blue-500"
        } transition duration-200`}
        placeholder={`Nhập ${label.toLowerCase()}`}
        required
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
