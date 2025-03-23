import "./index.css";
import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchResults from "./pages/SearchResults";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contact from "./pages/Contact.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";

import OrderDetail from "./pages/OrderDetail.jsx";
import WishList from "./pages/WishList.jsx";
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

          {/* Cập nhật route danh mục */}
          <Route path="category/:categoryId?" element={<CategoriesPage />} />

          <Route path="aboutus" element={<AboutUs />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          <Route path="wishlist" element={<WishList></WishList>}></Route>

          <Route path="/search" element={<SearchResults />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
