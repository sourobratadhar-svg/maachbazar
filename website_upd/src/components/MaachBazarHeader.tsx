import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const translations = {
  en: {
    title: "MaachBazar",
    howItWorks: "How It Works",
    forSellers: "For Sellers", 
    forBuyers: "For Buyers",
    contact: "Contact",
  },
  bn: {
    title: "মাছবাজার",
    howItWorks: "কিভাবে কাজ করে",
    forSellers: "বিক্রেতাদের জন্য",
    forBuyers: "ক্রেতাদের জন্য", 
    contact: "যোগাযোগ",
  },
  hi: {
    title: "मछबाज़ार",
    howItWorks: "यह कैसे काम करता है",
    forSellers: "विक्रेताओं के लिए",
    forBuyers: "खरीदारों के लिए",
    contact: "संपर्क करें",
  }
};

export const MaachBazarHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<keyof typeof translations>('en');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[language];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-soft' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost" 
            size="icon"
            className="md:hidden transition-smooth hover:bg-primary/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <h1 className="text-2xl font-bold text-gradient animate-fade-in">
              {t.title}
            </h1>
          </div>

          {/* Desktop Navigation + Language (grouped so contact can be nudged right) */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {[
                { key: 'howItWorks', href: 'how-it-works' },
                { key: 'forSellers', href: 'for-sellers' },
                { key: 'forBuyers', href: 'for-buyers' },
                { key: 'contact', href: 'contact' },
              ].map(({ key, href }) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(href)}
                  className={`text-muted-foreground hover:text-primary transition-smooth relative group ${key === 'contact' ? 'ml-4' : ''}`}
                >
                  {t[key as keyof typeof t]}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Language Selector - slightly larger on small screens for better touch targets */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as keyof typeof translations)}
                className="appearance-none bg-background border border-border rounded-full px-4 py-2 pr-8 text-sm sm:px-5 sm:py-3 sm:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-smooth hover:border-primary cursor-pointer"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
                <option value="hi">हिंदी</option>
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" />
        <div className="relative h-full flex flex-col">
          <div className="flex justify-end p-4 pt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="transition-smooth hover:bg-primary/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          {/* Mobile language selector for easier access on phones */}
          <div className="px-6 mb-4">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as keyof typeof translations)}
                className="w-full appearance-none bg-background border border-border rounded-full px-4 py-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-smooth cursor-pointer"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
                <option value="hi">हिंदी</option>
              </select>
              <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center space-y-8">
            {[
              { key: 'howItWorks', href: 'how-it-works' },
              { key: 'forSellers', href: 'for-sellers' },
              { key: 'forBuyers', href: 'for-buyers' },
              { key: 'contact', href: 'contact' },
            ].map(({ key, href }, index) => (
              <button
                key={key}
                onClick={() => scrollToSection(href)}
                className={`text-2xl font-medium text-foreground hover:text-gradient transition-smooth animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {t[key as keyof typeof t]}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};