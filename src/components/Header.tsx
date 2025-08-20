import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Dropdown, Modal } from "antd";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        localStorage.removeItem("user");
        window.location.href = "/dang-xuat";
      },
    });
  };
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${isScrolled
        ? "bg-black/80 backdrop-blur-sm shadow-lg"
        : "bg-custom-gradient-header"
        }`}
    >
      <nav className="container flex items-center justify-between">
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
                <Link
                  to="/"
                  className="block text-base text-main-color-50 mb-4"
                  onClick={toggleMenu}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/ve-chung-toi"
                  className="block text-base text-main-color-50 mb-4"
                  onClick={toggleMenu}
                >
                  Lịch Chiếu
                </Link>
                <Link
                  to="/mo-hinh-van-hanh"
                  className="block text-base text-main-color-50 mb-4"
                  onClick={toggleMenu}
                >
                  Tin Tức
                </Link>
                <Link
                  to="/cong-nghe"
                  className="block text-base text-main-color-50 mb-4"
                  onClick={toggleMenu}
                >
                  Khuyến Mãi
                </Link>
                <Link
                  to="/lien-he"
                  className="block text-base text-main-color-50 mb-4"
                  onClick={toggleMenu}
                >
                  Liên hệ
                </Link>

                <div className="flex flex-col w-full gap-3 mt-4">
                  {user ? (
                    <>
                      <span className="text-white">👋 {user.username}</span>
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
          <div className="hidden md:flex items-center gap-1 text-white">
            <Link to="/" className="relative group text-white px-4">
              Trang chủ
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link
              to="/ve-chung-toi"
              className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full px-4"
            >
              Lịch Chiếu
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link
              to="/tin-tuc"
              className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full px-4"
            >
              Tin Tức
            </Link>
            <div className="w-[1px] h-4 bg-white/30" />
            <Link
              to="/quy-dinh-va-chinh-sach"
              className="relative group text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full px-4"
            >
              Quy định và Chính sách
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
              {user ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "profile",
                        label: <Link className="block w-full" to="/profile">Thông tin người dùng</Link>,
                      },
                      {
                        key: "historyOrder",
                        label: <Link className="block w-full" to="/lichsudatve">Lịch sử đặt vé</Link>,
                      },
                      {
                        key: "logout",
                        label: (
                          <span onClick={handleLogout} className="text-red-500 block w-full">
                            Đăng xuất
                          </span>
                        ),
                      },
                    ],
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <button className="flex items-center gap-2 cursor-pointer text-white bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-200">
                    <img
                      src={user.avatar ? user.avatar : 'http://localhost:3000/uploads/avatar-default.svg'}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="truncate max-w-[120px]">{user.username}</span>
                    <DownOutlined />
                  </button>
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
