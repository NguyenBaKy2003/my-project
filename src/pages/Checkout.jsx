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
  const [step, setStep] = useState(1); // 1: Review Cart, 2: Shipping Info

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

    fetchCartData(
      storedUserId ? parseInt(storedUserId) : null,
      storedSessionId
    );
  }, []);

  const fetchCartData = async (userIdInt, sessionIdStr) => {
    try {
      setIsLoading(true);
      let url = "https://45.122.253.163:8891/api/cart";

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

  const goToNextStep = () => {
    if (cart.items.length > 0) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      toast.warn("Giỏ hàng của bạn đang trống!");
    }
  };

  const goBack = () => {
    setStep(1);
    window.scrollTo(0, 0);
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
      let url = "https://45.122.253.163:8891/api/orders/checkout";

      if (userId) {
        url += `?userId=${userId}`;
      } else if (sessionId) {
        url += `?sessionId=${sessionId}`;
      }

      const response = await axios.post(url, shippingDetail);

      if (response.status === 201) {
        toast.success("Đặt hàng thành công! Cảm ơn bạn.");

        // Phát sự kiện cập nhật giỏ hàng
        window.dispatchEvent(new Event("cartUpdated"));

        setTimeout(() => {
          navigate("/order-success", {
            state: { orderNumber: response.data.order.orderNumber },
          });
        }, 1500);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error.response?.data || error.message);
      toast.error("Đặt hàng thất bại! Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-10 px-4 text-center">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
        <p className="text-gray-600 mt-4">Đang tải thông tin giỏ hàng...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-emerald-600" : "text-gray-400"
              }`}>
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                  step >= 1
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } flex items-center justify-center font-bold text-sm md:text-base shadow-md transition-all duration-300`}>
                1
              </div>
              <span className="mt-2 text-xs md:text-sm font-medium">
                Giỏ hàng
              </span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 2 ? "bg-emerald-600" : "bg-gray-200"
              } transition-all duration-300`}></div>
            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-emerald-600" : "text-gray-400"
              }`}>
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                  step >= 2
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } flex items-center justify-center font-bold text-sm md:text-base shadow-md transition-all duration-300`}>
                2
              </div>
              <span className="mt-2 text-xs md:text-sm font-medium">
                Thanh toán
              </span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm md:text-base shadow-md">
                3
              </div>
              <span className="mt-2 text-xs md:text-sm font-medium">
                Hoàn tất
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold p-5 md:p-6 border-b text-center bg-emerald-50 text-emerald-800 flex items-center justify-center">
            {step === 1 ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Xem lại giỏ hàng
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Thông tin giao hàng
              </>
            )}
          </h2>

          {!cart.items || cart.items.length === 0 ? (
            <div className="p-8 md:p-10 text-center">
              <div className="text-5xl md:text-6xl mb-4 opacity-80">🛒</div>
              <p className="text-gray-500 mb-6">
                Không có sản phẩm nào trong giỏ hàng.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200">
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="p-4 md:p-6">
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <div className="hidden md:block">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sản phẩm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Số lượng
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cart.items.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={
                                      item.product.primaryImage?.url ||
                                      "https://via.placeholder.com/150"
                                    }
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded-lg shadow-sm transition-transform hover:scale-105 duration-200"
                                  />
                                  <div>
                                    <h3 className="font-medium text-gray-900">
                                      {item.product.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                      {item.product.price.toLocaleString()} đ
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString()}{" "}
                                đ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile view for cart items */}
                    <div className="md:hidden space-y-4 p-3">
                      {cart.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex space-x-3 border-b pb-4">
                          <img
                            src={
                              item.product.primaryImage?.url ||
                              "https://via.placeholder.com/150"
                            }
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-sm text-gray-600">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                  {item.quantity} x
                                </span>
                                <span className="ml-1">
                                  {item.product.price.toLocaleString()} đ
                                </span>
                              </div>
                              <span className="font-bold text-gray-900">
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString()}{" "}
                                đ
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-700">
                        Tổng tiền
                      </span>
                      <span className="text-xl md:text-2xl font-bold text-red-600">
                        {totalAmount.toLocaleString()} đ
                      </span>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={goToNextStep}
                        className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200">
                        Tiếp tục thanh toán
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="p-4 md:p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <h3 className="text-lg font-bold mb-4 pb-2 border-b flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-emerald-600"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Thông tin giao hàng
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên *
                          </label>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Nguyễn Văn A"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại *
                          </label>
                          <input
                            id="phone"
                            type="text"
                            name="phone"
                            placeholder="0912 345 678"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ giao hàng *
                          </label>
                          <input
                            id="address"
                            type="text"
                            name="address"
                            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="note"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú
                          </label>
                          <textarea
                            id="note"
                            name="note"
                            placeholder="Vui lòng ghi chú nếu có yêu cầu đặc biệt"
                            value={form.note}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"></textarea>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-lg font-bold mb-4 pb-2 border-b flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-emerald-600"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                          Thông tin đơn hàng
                        </h3>

                        <div className="space-y-4">
                          {cart.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors duration-150">
                              <div className="flex items-center">
                                <span className="bg-emerald-50 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 font-medium">
                                  {item.quantity}
                                </span>
                                <span className="text-gray-800 truncate max-w-xs">
                                  {item.product.name}
                                </span>
                              </div>
                              <span className="font-medium text-emerald-800">
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString()}{" "}
                                đ
                              </span>
                            </div>
                          ))}

                          <div className="border-t pt-4 mt-2 space-y-3">
                            <div className="flex justify-between font-medium text-gray-600">
                              <span>Phí vận chuyển</span>
                              <span className="text-emerald-600">Miễn phí</span>
                            </div>
                            <div className="flex justify-between mt-3 text-lg font-bold">
                              <span>Tổng cộng</span>
                              <span className="text-red-600">
                                {totalAmount.toLocaleString()} đ
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-lg font-bold mb-4 pb-2 border-b flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-emerald-600"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path
                              fillRule="evenodd"
                              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Phương thức thanh toán
                        </h3>

                        <div className="space-y-3">
                          <div className="flex items-center p-3 border rounded-lg bg-emerald-50 border-emerald-200 hover:shadow-sm transition-shadow duration-200">
                            <input
                              type="radio"
                              id="cod"
                              name="payment"
                              checked={true}
                              readOnly
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label
                              htmlFor="cod"
                              className="ml-3 block text-sm font-medium text-gray-700">
                              Thanh toán khi nhận hàng (COD)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col-reverse md:flex-row md:justify-between gap-4">
                    <button
                      onClick={goBack}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition flex items-center justify-center shadow-md hover:shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Quay lại
                    </button>

                    <button
                      onClick={handleOrder}
                      className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200">
                      Xác nhận đặt hàng
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!userId && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800">
              Bạn đang mua hàng với tư cách khách.
              <button
                onClick={() => navigate("/auth")}
                className="text-blue-600 ml-1 font-semibold hover:underline">
                Đăng nhập
              </button>{" "}
              để lưu thông tin đơn hàng và theo dõi trạng thái.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
