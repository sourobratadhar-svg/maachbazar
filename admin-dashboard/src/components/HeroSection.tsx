import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Truck } from 'lucide-react';

const translations = {
  en: {
    heroTitle: "Fresh Fish & Poultry",
    heroSubtitle: "Delivered to Your Door",
    heroDescription: "Connect with local sellers and get fresh catches delivered within 2 hours",
    joinBuyer: "Join Buyer Group",
    becomeSeller: "Become a Seller",
    stats: {
      customers: "Happy Customers",
      deliveries: "Daily Deliveries",
      sellers: "Verified Sellers"
    }
  },
  bn: {
    heroTitle: "তাজা মাছ ও মুরগি",
    heroSubtitle: "আপনার দরজায় পৌঁছে দেওয়া হবে",
    heroDescription: "স্থানীয় বিক্রেতাদের সাথে যোগাযোগ করুন এবং ২ ঘন্টার মধ্যে তাজা মাছ পৌঁছে নিন",
    joinBuyer: "ক্রেতা গ্রুপে যোগ দিন",
    becomeSeller: "বিক্রেতা হোন",
    stats: {
      customers: "খুশি গ্রাহক",
      deliveries: "দৈনিক ডেলিভারি",
      sellers: "যাচাইকৃত বিক্রেতা"
    }
  },
  hi: {
    heroTitle: "ताज़ी मछली और मुर्गी",
    heroSubtitle: "आपके द्वार पर",
    heroDescription: "स्थानীय विक्रেताओं से जुड़ें और 2 घंटे के भीতर ताज़ी मछली प्राप्त करें",
    joinBuyer: "खरीदार ग्रुप में शामिल हों",
    becomeSeller: "विक्रेता बनें",
    stats: {
      customers: "खुश ग्राहक",
      deliveries: "दैनिक डिलीवरी",
      sellers: "सत्यापित विक्रेता"
    }
  }
};

export const HeroSection = () => {
  const [language] = useState<keyof typeof translations>('en');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const t = translations[language];

  const stats = [
    { number: '500+', label: t.stats.customers, icon: Users },
    { number: '50+', label: t.stats.deliveries, icon: Truck },
    { number: '25+', label: t.stats.sellers, icon: Users },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          {/* Main Title */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">{t.heroTitle}</span>
              <span className="block text-4xl md:text-6xl font-light opacity-90">
                {t.heroSubtitle}
              </span>
            </h1>
          </div>

          {/* Description */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
              MaachBazar is your local community for the freshest fish and poultry,
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              {t.heroDescription}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-smooth text-lg px-8 py-6 rounded-full hover-lift group"
              asChild
            >
              <a href="https://chat.whatsapp.com/HswxQuE9k4b1qcm0wWr3Mb" target="_blank" rel="noopener noreferrer">
                {t.joinBuyer}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary transition-smooth text-lg px-8 py-6 rounded-full hover-lift"
              asChild
            >
              <a href="https://chat.whatsapp.com/HrV7fbRE2328BgbMuA9X4N" target="_blank" rel="noopener noreferrer">
                {t.becomeSeller}
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconComponent className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-white/70">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse mt-2" />
        </div>
      </div>
    </section>
  );
};