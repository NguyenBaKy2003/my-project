import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    console.log("Thông tin liên hệ:", form);
    alert("Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Liên hệ chúng tôi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin liên hệ */}
        <div className="bg-gray-100 p-6 rounded-md">
          <h3 className="text-lg font-bold mb-3">Thông tin liên hệ</h3>
          <p>📍 Địa chỉ: 123 Nguyễn Văn A, Quận 1, TP.HCM</p>
          <p>📞 Số điện thoại: 0123 456 789</p>
          <p>📧 Email: contact@yourstore.com</p>
          <p>⏰ Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ nhật)</p>
        </div>

        {/* Form liên hệ */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h3 className="text-lg font-bold mb-3">Gửi phản hồi</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên *"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
            <textarea
              name="message"
              placeholder="Nội dung tin nhắn *"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border rounded-md"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full">
              Gửi liên hệ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
