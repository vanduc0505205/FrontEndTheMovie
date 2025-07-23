import Hero from "@/components/IndexPage/Hero";
import Content from "@/components/IndexPage/Content";


const Index = () => {
  return (
    <div className="min-h-screen bg-background font-['Archivo']">
      {/* Hero Section */}
      <Hero />

      {/* Content Section */}
      <Content />

      {/* Contact Form Section */}
      {/* <ContactForm /> */}

    </div>
  );
};

export default Index;
