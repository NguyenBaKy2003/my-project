import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Cột 1: Thông tin công ty */}
          <div>
            <h2 className="text-lg font-bold uppercase">CÔNG TY TNHH THƯƠNG MẠI LIVAK</h2>
            <p className="mt-2 text-gray-300">
              <strong>Địa chỉ:</strong> 17/6 Thạnh Lộc 44 - Phường Thạnh Lộc - Q.12 - TP Hồ Chí Minh
            </p>
            <p className="mt-1 text-gray-300">
              <strong>Mã số doanh nghiệp:</strong> 0318371447
            </p>
            <p className="mt-1 text-gray-300">
              <strong>Tư vấn Kỹ thuật:</strong> <span className="text-green-400">0362 672 638</span>
            </p>
          </div>

          {/* Cột 2: Thiết Bị Tưới */}
          <div>
            <h2 className="text-lg font-bold uppercase">Thiết Bị Tưới</h2>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:text-green-400">➤ Thiết Bị Tưới Phun Mưa</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Thiết Bị Tưới Cầm Tay</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Thiết Bị Tưới Nhỏ Giọt</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Phụ Kiện Hỗ Trợ</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Thiết Kế Hệ Thống Tưới</a></li>
            </ul>
          </div>

          {/* Cột 3: Chính Sách & Quy Định */}
          <div>
            <h2 className="text-lg font-bold uppercase">Chính Sách & Quy Định</h2>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:text-green-400">➤ Hướng Dẫn Mua Hàng</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Đổi Trả & Bảo Hành</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Vận Chuyển & Thanh Toán</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Hoàn Tiền & Trả Hàng</a></li>
            </ul>
          </div>

          {/* Cột 4: Về Chúng Tôi */}
          <div>
            <h2 className="text-lg font-bold uppercase">Về Chúng Tôi</h2>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:text-green-400">➤ Thông Tin</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Dịch Vụ Thi Công</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Tin Tức</a></li>
              <li><a href="#" className="hover:text-green-400">➤ Liên Hệ</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
