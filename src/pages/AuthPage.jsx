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

  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập, tự động chuyển hướng
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <Input
                label="Họ"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                label="Tên"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </>
          )}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {!isLogin && (
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline">
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
}

const Input = ({ label, type = "text", name, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
      placeholder={`Nhập ${label.toLowerCase()}`}
    />
  </div>
);
