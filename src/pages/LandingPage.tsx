import Hero from "@/components/LandingPage/Hero";
import Content from "@/components/LandingPage/Content";
import { useEffect } from "react";


const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="min-h-screen bg-[#121212] font-['Archivo']">
      <Hero />
      <Content />

    </div>
  );
};

export default LandingPage;
