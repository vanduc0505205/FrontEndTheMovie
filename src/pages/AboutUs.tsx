
import { Hero, Info, Mission } from "@/components/AboutUs";
import BlogAbout from "@/components/AboutUs/BlogAbout";
import JourneyFar from "@/components/AboutUs/JourneyFar";
import ProjectSoul from "@/components/AboutUs/ProjectSoul";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background font-['Archivo']">

      <Hero />

      <Info />

      <Mission />

      <ProjectSoul/>

      <JourneyFar/>


      <BlogAbout/>


    </div>
  );
};

export default Contact;
