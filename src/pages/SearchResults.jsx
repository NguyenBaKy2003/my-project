import { useSearchParams } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  // Use the query to fetch and display search results

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm: "{query}"</h1>

      {/* Phần hiển thị sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Đây là nơi bạn sẽ hiển thị danh sách sản phẩm sau khi tìm kiếm */}
        <div className="text-center py-12 col-span-full text-gray-500">
          Đang tìm kiếm sản phẩm cho "{query}"...
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
