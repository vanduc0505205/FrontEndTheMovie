
import {
  Content,
  EcosystemInvestment,
  PartnerSection,
  FoundingTeam,
  ContactForm,
  Hero,
} from "@/components/IndexPage";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-['Archivo']">
      {/* Hero Section */}
      <Hero />

      {/* Content Section */}
      <Content />

      {/* Ecosystem Investment Section */}
      <EcosystemInvestment />

      {/* Partnership Section */}
      <PartnerSection />

      {/* Founding Team Section */}
      <FoundingTeam />

      {/* Contact Form Section */}
      <ContactForm />

    </div>
  );
};

export default Index;
