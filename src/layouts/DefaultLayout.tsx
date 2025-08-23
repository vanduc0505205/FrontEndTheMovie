import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const DefaultLayout = () => {
  const location = useLocation();
  useEffect(() => {
    if (!document.querySelector('script[src="https://app.preny.ai/embed-global.js"]')) {
      const script = document.createElement("script");
      script.src = "https://app.preny.ai/embed-global.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("Preny script loaded ");
      };

      script.setAttribute("data-name-bot", "bot-demo");
      script.setAttribute("data-button-style", "width:300px;height:300px;");
      script.setAttribute("data-language", "vi");
      script.setAttribute("data-preny-bot-id", "689f655146712d0465a3bc03");

      document.body.appendChild(script);
    }
  }, []);


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
