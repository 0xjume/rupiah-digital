
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import UseCasesSection from '@/components/UseCasesSection';
import RoadmapSection from '@/components/RoadmapSection';
import CTASection from '@/components/CTASection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import FloatingActionButton from '@/components/FloatingActionButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <RoadmapSection />
      <CTASection />
      <AboutSection />
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
