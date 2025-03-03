import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const location = useLocation();
  return (
    <div className="">
      <Header></Header>
      <main>
        <Outlet></Outlet>
        {location.pathname === "/" && <Home></Home>}
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
