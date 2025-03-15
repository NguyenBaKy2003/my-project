import "./index.css";
import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProductDetail from "./pages/ProductDetail.jsx";

import Cart from "./pages/Cart.jsx";

import Checkout from "./pages/Checkout.jsx";

import Contact from "./pages/Contact.jsx";

import ThietBiPhunVaXit from "./pages/ThietBiPhunVaXit.jsx";

import ThietBiNongNghiep from "./pages/ThietBiNongNghiep.jsx";

import NewsPage from "./pages/NewsPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="product/:id" element={<ProductDetail />} />

          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact" element={<Contact />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsDetail />} />

          <Route
            path="category/thiet-bi-phun-xit"
            element={<ThietBiPhunVaXit></ThietBiPhunVaXit>}></Route>
          <Route
            path="category/thiet-bi-nong-nghiep"
            element={<ThietBiNongNghiep></ThietBiNongNghiep>}></Route>
          <Route path="aboutus" element={<AboutUs></AboutUs>}></Route>

          <Route path="order-success" element={<OrderSuccess />} />

          <Route path="auth" element={<AuthPage></AuthPage>}></Route>

          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
