import React from "react";
import { Link } from "react-router-dom";

const newsData = [
  {
    id: 1,
    title: "Cách bảo trì máy nông nghiệp",
    summary: "Hướng dẫn bảo trì máy móc nông nghiệp hiệu quả...",
    image: "https://source.unsplash.com/400x250/?farm",
  },
  {
    id: 2,
    title: "Công nghệ tưới tiêu thông minh",
    summary: "Tìm hiểu về các hệ thống tưới tiêu tự động...",
    image: "https://source.unsplash.com/400x250/?technology",
  },
  {
    id: 3,
    title: "Phân bón hữu cơ và lợi ích",
    summary: "Phân bón hữu cơ giúp cây trồng phát triển bền vững...",
    image: "https://source.unsplash.com/400x250/?agriculture",
  },
];

function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">
        Tin Tức Mới Nhất
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-3 text-green-700">
                {news.title}
              </h2>
              <p className="text-gray-600 mb-4">{news.summary}</p>
              <Link
                to={`/news/${news.id}`}
                className="inline-block px-5 py-2 bg-green-600 text-white font-medium rounded-lg transition-colors hover:bg-green-700">
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
