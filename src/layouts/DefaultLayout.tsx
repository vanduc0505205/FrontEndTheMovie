import { Outlet } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DefaultLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
