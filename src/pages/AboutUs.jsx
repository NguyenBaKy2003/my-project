import React from "react";

function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm">
      <div className="space-y-8">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-lg text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            CHÀO MỪNG QUÝ KHÁCH ĐẾN VỚI CÔNG TY TNHH ĐIỆN MÁY LONG NHẤT
          </h2>
          <div className="w-16 h-1 bg-white mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Company information */}
        <div className="space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            Được thành lập ngày 03-09-2015. Văn phòng đặt tại Số 65 – Đông Mỹ –
            Thanh Trì – Hà Nội với một đội ngũ Quản Lý và nhân viên trẻ trung,
            nhiệt huyết và giàu kinh nghiệm. Công ty TNHH điện máy Long Nhất
            chuyên phân phối toàn quốc các loại máy Nông – Lâm – Ngư – Cơ, Máy
            công trình của các hãng nổi tiếng như Stihl, Husqvarna, Honda,
            Oshima, ChanChan…
          </p>

          {/* Slogan with highlight */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-gray-700 text-lg">
              Với Slogan:{" "}
              <span className="font-bold text-blue-600 text-xl">
                "Trao đi chất lượng, nhận lại niềm tin"
              </span>
              , chúng tôi luôn cung ứng những sản phẩm tốt nhất với giá cả hợp
              lý và dịch vụ tận tâm.
            </p>
          </div>
        </div>

        {/* Image container with hover effects */}
        <div className="overflow-hidden rounded-xl shadow-lg">
          <img
            src="/api/placeholder/800/500"
            alt="Công ty TNHH Điện Máy Long Nhất"
            className="w-full object-cover h-64 hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
