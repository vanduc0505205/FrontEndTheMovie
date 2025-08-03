import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DefaultLayout = () => {
  const location = useLocation();

  // Các route cần ẩn footer
  const hideFooterRoutes = ["/forgot-password", "/reset-password", "/dang-nhap", "/dang-ky"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default DefaultLayout;
