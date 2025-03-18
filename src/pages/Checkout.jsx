import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Checkout() {
  const [cart, setCart] = useState({ items: [] });
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    note: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedSessionId = localStorage.getItem("sessionId");

    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      if (!storedSessionId) {
        const newSessionId = Date.now().toString();
        localStorage.setItem("sessionId", newSessionId);
        setSessionId(newSessionId);
      } else {
        setSessionId(storedSessionId);
      }
    }

    fetchCartData(storedUserId ? parseInt(storedUserId) : null, storedSessionId);
  }, []);

  const fetchCartData = async (userIdInt, sessionIdStr) => {
    try {
      setIsLoading(true);
      let url = "http://localhost:8080/api/cart";

      if (userIdInt) {
        url += `?userId=${userIdInt}`;
      } else if (sessionIdStr) {
        url += `?sessionId=${sessionIdStr}`;
      }

      const response = await axios.get(url);
      if (response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      toast.error("Không thể tải thông tin giỏ hàng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    return cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const totalAmount = calculateTotalAmount();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const shippingDetail = {
      recipientName: form.name,
      phoneNumber: form.phone,
      address: form.address,
      email: form.email,
      note: form.note,
      shippingMethod: "Standard",
      status: "PENDING",
    };

    try {
      let url = "http://localhost:8080/api/orders/checkout";

      if (userId) {
        url += `?userId=${userId}`;
      } else if (sessionId) {
        url += `?sessionId=${sessionId}`;
      }

      const response = await axios.post(url, shippingDetail);

      if (response.status === 201) {
        toast.success("Đặt hàng thành công! Cảm ơn bạn.", {
          onClose: () => navigate("/order-success", {
            state: { orderNumber: response.data.orderNumber }
          }),
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error("Đặt hàng thất bại! Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-10 px-4 text-center">
        <p>Đang tải thông tin giỏ hàng...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Thanh toán</h2>

      {!cart.items || cart.items.length === 0 ? (
        <p className="text-gray-500 text-center">
          Không có sản phẩm nào trong giỏ hàng.
        </p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-3">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.primaryImage?.url || "https://via.placeholder.com/150"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-500">
                    {item.product.price.toLocaleString()} đ x {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold text-red-500">
                {(item.product.price * item.quantity).toLocaleString()} đ
              </p>
            </div>
          ))}

          <div className="text-right mt-4">
            <h3 className="text-xl font-bold">
              Tổng tiền: <span className="text-red-500">{totalAmount.toLocaleString()} đ</span>
            </h3>
          </div>

          <div className="mt-6 bg-gray-100 p-6 rounded-md">
            <h3 className="text-lg font-bold mb-4">Thông tin giao hàng</h3>
            <input type="text" name="name" placeholder="Họ và tên" value={form.name} onChange={handleChange} className="w-full px-4 py-2 mb-3 border rounded-md" />

            <input type="text" name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 mb-3 border rounded-md" />
            <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 mb-3 border rounded-md" />
            <input type="text" name="address" placeholder="Địa chỉ giao hàng" value={form.address} onChange={handleChange} className="w-full px-4 py-2 mb-3 border rounded-md" />
            <textarea name="note" placeholder="Ghi chú (nếu có)" value={form.note} onChange={handleChange} className="w-full px-4 py-2 mb-3 border rounded-md" />
          </div>

          <button onClick={handleOrder} className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 transition">
            ✅ Xác nhận đặt hàng
          </button>

          {!userId && (
            <p className="mt-4 text-center text-gray-500">
              Bạn đang mua hàng với tư cách khách.
              <button onClick={() => navigate("/auth")} className="text-blue-500 ml-1 font-semibold hover:underline">
                Đăng nhập
              </button> để lưu thông tin đơn hàng.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkout;
