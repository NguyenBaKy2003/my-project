import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const location = useLocation();
  return (
    <div className="flex flex-col ">
      <Header />
      <main className="flex-grow py-8 min-h-screen">
        {" "}
        {/* Thêm khoảng cách */}
        <Outlet />
        {location.pathname === "/" && <Home />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
