import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Họ và tên là bắt buộc";
    if (!form.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.message.trim()) newErrors.message = "Tin nhắn là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Thông tin liên hệ:", form);
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-16 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-12 text-center text-green-800">
        Liên hệ với chúng tôi
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Thông tin liên hệ */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-green-700 border-b border-gray-200 pb-3">
            Thông tin liên hệ
          </h3>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <span className="text-green-600 text-xl">📍</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Địa chỉ</h4>
                <p className="text-gray-600">
                  123 Nguyễn Văn A, Quận 1, TP.HCM
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <span className="text-green-600 text-xl">📞</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Số điện thoại</h4>
                <p className="text-gray-600">0123 456 789</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <span className="text-green-600 text-xl">📧</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Email</h4>
                <p className="text-gray-600">contact@yourstore.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <span className="text-green-600 text-xl">⏰</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Giờ làm việc</h4>
                <p className="text-gray-600">8:00 - 18:00 (Thứ 2 - Chủ nhật)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form liên hệ */}
        <div className="bg-white p-8 shadow-lg rounded-xl">
          <h3 className="text-xl font-bold mb-6 text-green-700 border-b border-gray-200 pb-3">
            Gửi phản hồi
          </h3>

          {isSuccess && (
            <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-lg">
              Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm
              nhất.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nhập họ và tên của bạn"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại của bạn"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2">
                Nội dung tin nhắn <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Nhập nội dung tin nhắn của bạn"
                value={form.message}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border ${
                  errors.message ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}>
              {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
