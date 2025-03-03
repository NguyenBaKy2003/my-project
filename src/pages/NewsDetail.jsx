import React from "react";
import { useParams } from "react-router-dom";

const newsData = [
  {
    id: 1,
    title: "Cách bảo trì máy nông nghiệp",
    content:
      "Chi tiết về cách bảo trì máy móc nông nghiệp để đạt hiệu suất cao nhất...",
    image: "https://source.unsplash.com/800x400/?farm",
  },
  {
    id: 2,
    title: "Công nghệ tưới tiêu thông minh",
    content:
      "Hệ thống tưới tiêu tự động giúp tiết kiệm nước và tăng năng suất...",
    image: "https://source.unsplash.com/800x400/?technology",
  },
  {
    id: 3,
    title: "Phân bón hữu cơ và lợi ích",
    content:
      "Sử dụng phân bón hữu cơ giúp bảo vệ môi trường và cung cấp dinh dưỡng tốt hơn cho cây trồng...",
    image: "https://source.unsplash.com/800x400/?agriculture",
  },
];

function NewsDetail() {
  const { id } = useParams();
  const newsItem = newsData.find((news) => news.id === parseInt(id));

  if (!newsItem) {
    return (
      <h2 className="text-center text-red-600 text-xl">
        Không tìm thấy bài viết!
      </h2>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <img
        src={newsItem.image}
        alt={newsItem.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{newsItem.title}</h1>
      <p className="text-gray-700 mt-4">{newsItem.content}</p>
    </div>
  );
}

export default NewsDetail;
