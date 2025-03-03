import React from "react";

function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto text-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        CHÀO MỪNG QUÝ KHÁCH ĐẾN VỚI CÔNG TY TNHH ĐIỆN MÁY LONG NHẤT
      </h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        Được thành lập ngày 03-09-2015. Văn phòng đặt tại Số 65 – Đông Mỹ –
        Thanh Trì – Hà Nội với một đội ngũ Quản Lý và nhân viên trẻ trung, nhiệt
        huyết và giàu kinh nghiệm. Công ty TNHH điện máy Long Nhất chuyên phân
        phối toàn quốc các loại máy Nông – Lâm – Ngư – Cơ, Máy công trình của
        các hãng nổi tiếng như Stihl, Husqvarna, Honda, Oshima, ChanChan…
      </p>
      <p className="text-gray-600 text-lg mt-4">
        Với Slogan:{" "}
        <span className="font-semibold text-blue-600">
          “Trao đi chất lượng, nhận lại niềm tin”
        </span>
        , chúng tôi luôn cung ứng những sản phẩm tốt nhất với giá cả hợp lý và
        dịch vụ tận tâm.
      </p>
      <img
        src="https://dienmaylongnhat.vn/wp-content/uploads/2021/03/119800ee2b53c60d9f42.jpg"
        alt="Công ty TNHH Điện Máy Long Nhất"
        className="mt-6 rounded-lg shadow-lg w-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}

export default AboutUs;
