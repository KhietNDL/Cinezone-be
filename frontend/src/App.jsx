import "./App.css";
import Footer from "./layouts/User/Footer";
import Header from "./layouts/User/Header";
import LandingPage from "./layouts/User/Landing";

function App() {
  return (
    <div className="relative w-full bg-slate-900">
      <div className=" w-full flex justify-center items-center">
        <Header />
      </div>
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;
