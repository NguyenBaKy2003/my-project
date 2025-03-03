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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tin Tức Mới Nhất</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{news.title}</h2>
              <p className="text-gray-600">{news.summary}</p>
              <Link
                to={`/news/${news.id}`}
                className="text-blue-600 font-bold mt-2 inline-block">
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
