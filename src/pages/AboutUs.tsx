import { Mission } from "@/components/AboutUs";
import BlogAbout from "@/components/AboutUs/BlogAbout";
import JourneyFar from "@/components/AboutUs/JourneyFar";
import ProjectSoul from "@/components/AboutUs/ProjectSoul";
import { Hero } from "@/components/IndexPage";
import { Info } from "lucide-react";



const Contact = () => {
  return (
    <div className="min-h-screen bg-background font-['Archivo']">

      <Hero />

      <Info />

      <Mission />

      <ProjectSoul />

      <JourneyFar />


      <BlogAbout />


    </div>
  );
};

export default Contact;