import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 bg-custom-gradient-2">
      <nav className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center space-x-2"
          >
            <img src={logo} alt="logo.png" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white">FARMBLOCK</span>
          </Link>
        </div>

        {isMobile ? (
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              className="border-2 border-primary-green-100 bg-primary-green-400 hover:bg-primary-green-300 text-primary-green-100"
              onClick={toggleMenu}
            >
              Menu
            </Button>
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-50 flex flex-col items-start justify-start p-6 bg-custom-gradient-header-menu"
                style={{ paddingTop: "60px" }} // Adds 10px + header height (approx 50px)
                onClick={toggleMenu}
              >
                <button
                  className="absolute top-14 right-4 text-white" // Adjusted top to 14 (10px + header height)
                  onClick={toggleMenu}
                >
                  ✕
                </button>
                <Link
                  to="/"
                  className="block text-base text-primary-green-50 mb-4"
                  onClick={toggleMenu}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/ve-chung-toi"
                  className="block text-base text-primary-green-50 mb-4"
                  onClick={toggleMenu}
                >
                  Về chúng tôi
                </Link>
                <Link
                  to="/mo-hinh-van-hanh"
                  className="block text-base text-primary-green-50 mb-4"
                  onClick={toggleMenu}
                >
                  Mô hình
                </Link>
                <Link
                  to="/cong-nghe"
                  className="block text-base text-primary-green-50 mb-4"
                  onClick={toggleMenu}
                >
                  Công nghệ
                </Link>
                <Link
                  to="/lien-he"
                  className="block text-base text-primary-green-50 mb-4"
                  onClick={toggleMenu}
                >
                  Liên hệ
                </Link>
                <div className="block text-base text-primary-green-50 mb-4">VN</div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="border border-primary-green-100 bg-primary-green-400 hover:bg-primary-green-200 text-primary-green-100 w-full"
                  onClick={toggleMenu}
                >
                  Truy cập ứng dụng
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1 text-white">
            <Link to="/" className="relative group text-white px-4">
              Trang chủ
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link
              to="/ve-chung-toi"
              className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full px-4"
            >
              Về chúng tôi
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link
              to="/mo-hinh-van-hanh"
              className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full px-4"
            >
              Mô hình
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link
              to="/cong-nghe"
              className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full px-4"
            >
              Công nghệ
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link
              to="/lien-he"
              className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full px-4"
            >
              Liên hệ
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <div className="space-x-2 mx-4">
              <Link
                to="#"
                className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full"
              >
                VN
              </Link>
              <Link
                to="#"
                className="relative group text-white/30 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full"
              >
                EN
              </Link>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="border-2 border-primary-green-100 bg-primary-green-400 hover:bg-primary-green-200 text-primary-green-100"
            >
              Truy cập ứng dụng
              <ArrowRight className="h-2 w-2" />
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;