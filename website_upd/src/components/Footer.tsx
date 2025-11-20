import { Heart } from 'lucide-react';

const translations = {
  en: {
    copyright: "© 2025 MaachBazar. All rights reserved.",
    tagline: "Made with",
    location: "for fresh food lovers"
  },
  bn: {
    copyright: "© ২০২৫ মাছবাজার। সর্বস্বত্ব সংরক্ষিত।",
    tagline: "ভালোবাসা দিয়ে তৈরি",
    location: "তাজা খাবার প্রেমীদের জন্য"
  },
  hi: {
    copyright: "© २०२५ मछबाज़ार। सर्वाधिकार सुरक्षित।",
    tagline: "प्यार से बनाया गया",
    location: "ताज़े भोजन प्रेमियों के लिए"
  }
};

export const Footer = () => {
  const t = translations['en'];

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-primary">
              MaachBazar
            </h3>
            <p className="text-background/70 mt-2">
              Your trusted source for fresh fish & poultry
            </p>
          </div>

          {/* Tagline */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-background/80">{t.tagline}</span>
            <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
            <span className="text-background/80">{t.location}</span>
          </div>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-primary mx-auto mb-6 opacity-50" />

          {/* Copyright */}
          <p className="text-background/60 text-sm">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};