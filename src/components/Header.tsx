import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Dropdown, Menu, MenuProps, Typography } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("login-success", loadUser);
    return () => {
      window.removeEventListener("login-success", loadUser);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/thong-tin-ca-nhan"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined style={{ color: "red" }} />,
      onClick: () => navigate("/dang-xuat"),
    },
  ];

  // function setHover(arg0: boolean): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${isScrolled
          ? "bg-black/80 backdrop-blur-sm shadow-lg"
          : "bg-custom-gradient-header"
        }`}
    >
      <nav className="container flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center space-x-2"
          >
            <img src={logo} alt="logo.png" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white">ALPHACINEMA</span>
          </Link>
        </div>

        {/* Mobile */}
        {isMobile ? (
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              className="border-2 border-main-color-100 bg-main-color-400 hover:bg-main-color-300 text-main-color-100"
              onClick={toggleMenu}
            >
              Menu
            </Button>
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-50 flex flex-col items-start justify-start p-6 bg-custom-gradient-header-menu"
                style={{ paddingTop: "60px" }}
                onClick={toggleMenu}
              >
                <button
                  className="absolute top-14 right-4 text-white"
                  onClick={toggleMenu}
                >
                  ✕
                </button>

                {/* Menu Items */}
                <Link to="/" className="block text-base text-main-color-50 mb-4">
                  Trang chủ
                </Link>
                <Link to="/ve-chung-toi" className="block text-base text-main-color-50 mb-4">
                  Lịch Chiếu
                </Link>
                <Link to="/tin-tuc" className="block text-base text-main-color-50 mb-4">
                  Tin Tức
                </Link>
                <Link to="/quy-dinh-va-chinh-sach" className="block text-base text-main-color-50 mb-4">
                  Quy định và Chính sách
                </Link>
                <Link to="/lien-he" className="block text-base text-main-color-50 mb-4">
                  Liên hệ
                </Link>

                <div className="flex flex-col w-full gap-3 mt-4">
                  {user ? (
                    <>
                      <Link to="/thong-tin-ca-nhan" className="text-white">
                        👋 {user.username}
                      </Link>
                      <Link to="/dang-xuat">
                        <Button variant="outline" size="lg" className="text-red-500 w-full">
                          Đăng xuất
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dang-nhap">
                        <Button
                          variant="secondary"
                          size="lg"
                          className="border border-main-color-100 bg-main-color-400 hover:bg-main-color-300 text-main-color-100 w-full"
                        >
                          Đăng nhập
                        </Button>
                      </Link>
                      <Link to="/dang-ky">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-main-color-100 bg-transparent hover:bg-main-color-100/20 text-main-color-100 w-full"
                        >
                          Đăng ký
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Desktop Menu
          <div className="hidden md:flex items-center gap-1 text-white">
            <Link to="/" className="relative group text-white px-4">
              Trang chủ
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link to="/ve-chung-toi" className="relative group text-white px-4">
              Lịch Chiếu
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link to="/tin-tuc" className="relative group text-white px-4">
              Tin Tức
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link to="/quy-dinh-va-chinh-sach" className="relative group text-white px-4">
              Quy định và Chính sách
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link to="/lien-he" className="relative group text-white px-4">
              Liên hệ
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />

            {/* User Section */}
            <div className="space-x-2 mx-4">
              {user ? (
                <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                  <Typography.Text
                    style={{
                      color: "white",
                      cursor: "pointer",
                      borderBottom: hover ? "2px solid #ff4d4f" : "2px solid transparent",
                      transition: "border-color 0.3s ease",
                      paddingBottom: 2,
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    👋 {user.username}
                  </Typography.Text>
                </Dropdown>
              ) : (
                <>
                  <Link to="/dang-nhap">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border border-main-color-100 bg-main-color-400 hover:bg-main-color-300 text-main-color-100 h-9"
                    >
                      Đăng Nhập
                    </Button>
                  </Link>
                  <Link to="/dang-ky">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border border-main-color-100 bg-main-color-400 hover:bg-main-color-300 text-main-color-100 h-9"
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
