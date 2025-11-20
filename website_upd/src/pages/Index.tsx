import { MaachBazarHeader } from '@/components/MaachBazarHeader';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { ForSellersSection } from '@/components/ForSellersSection';
import { ForBuyersSection } from '@/components/ForBuyersSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MaachBazarHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ForSellersSection />
        <ForBuyersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
