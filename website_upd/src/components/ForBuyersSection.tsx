import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Bell, Clock, ArrowRight, Star } from 'lucide-react';

const translations = {
  en: {
    title: "For Buyers",
    subtitle: "Experience the freshest fish and poultry delivered to your doorstep",
    features: [
      {
        icon: ShieldCheck,
        title: "Fresh fish and poultry from verified sellers",
        description: "Every seller is thoroughly vetted to ensure quality and reliability"
      },
      {
        icon: Bell,
        title: "Daily updates on available stock",
        description: "Get real-time notifications when fresh stock arrives in your area"
      },
      {
        icon: Clock,
        title: "Delivery within 2 hours of ordering",
        description: "Lightning-fast delivery ensures maximum freshness for your table"
      }
    ],
    joinButton: "Join Buyer Group",
    tooltip: "Click to join our WhatsApp buyer community",
    testimonial: {
      text: "Amazing fresh fish every time! The quality is unmatched and delivery is super quick.",
      author: "Priya S.",
      rating: 5
    }
  },
  bn: {
    title: "ক্রেতাদের জন্য",
    subtitle: "আপনার দরজায় সবচেয়ে তাজা মাছ ও মুরগির অভিজ্ঞতা নিন",
    features: [
      {
        icon: ShieldCheck,
        title: "যাচাইকৃত বিক্রেতাদের কাছ থেকে তাজা মাছ ও মুরগি",
        description: "মান ও নির্ভরযোগ্যতা নিশ্চিত করতে প্রতিটি বিক্রেতাকে পুঙ্খানুপুঙ্খভাবে যাচাই করা হয়"
      },
      {
        icon: Bell,
        title: "উপলব্ধ স্টক সম্পর্কে দৈনিক আপডেট",
        description: "আপনার এলাকায় তাজা স্টক এলে রিয়েল-টাইম বিজ্ঞপ্তি পান"
      },
      {
        icon: Clock,
        title: "অর্ডারের ২ ঘন্টার মধ্যে ডেলিভারি",
        description: "বিদ্যুৎ-দ্রুত ডেলিভারি আপনার টেবিলের জন্য সর্বোচ্চ তাজাত্ব নিশ্চিত করে"
      }
    ],
    joinButton: "ক্রেতা গ্রুপে যোগ দিন",
    tooltip: "আমাদের হোয়াটসঅ্যাপ ক্রেতা কমিউনিটিতে যোগ দিতে ক্লিক করুন",
    testimonial: {
      text: "প্রতিবার অসাধারণ তাজা মাছ! মান অতুলনীয় এবং ডেলিভারি অত্যন্ত দ্রুত।",
      author: "প্রিয়া এস.",
      rating: 5
    }
  },
  hi: {
    title: "खरीदारों के लिए",
    subtitle: "अपने दरवाजे पर सबसे ताज़ी मछली और मुर्गी का अनुभव करें",
    features: [
      {
        icon: ShieldCheck,
        title: "सत्यापित विक्रेताओं से ताज़ी मछली और मुर्गी",
        description: "गुणवत्ता और विश्वसनीयता सुनिश्चित करने के लिए हर विक्रेता की पूरी तरह जांच की जाती है"
      },
      {
        icon: Bell,
        title: "उपलब्ध स्टॉक के बारे में दैनिक अपडेट",
        description: "जब आपके क्षेत्र में ताज़ा स्टॉक आए तो रियल-टाइम सूचनाएं प्राप्त करें"
      },
      {
        icon: Clock,
        title: "ऑर्डर के 2 घंटे के भीतर डिलीवरी",
        description: "बिजली-तेज़ डिलीवरी आपकी मेज़ के लिए अधिकतम ताज़गी सुनिश्चित करती है"
      }
    ],
    joinButton: "खरीदार ग्रुप में शामिल हों",
    tooltip: "हमारे व्हाट्सएप खरीदार समुदाय में शामिल होने के लिए क्लिक करें",
    testimonial: {
      text: "हर बार अद्भुत ताज़ी मछली! गुणवत्ता बेजोड़ है और डिलीवरी बहुत तेज़ है।",
      author: "प्रिया एस.",
      rating: 5
    }
  }
};

export const ForBuyersSection = () => {
  const [language] = useState<keyof typeof translations>('en');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="for-buyers" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image/Testimonial */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl transform -rotate-3 opacity-20" />
              <div className="relative bg-card rounded-2xl p-8 shadow-large hover-lift">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                    <ShieldCheck className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Trusted by Families
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join hundreds of satisfied customers who choose MaachBazar for their daily fresh needs.
                  </p>
                </div>

                {/* Testimonial */}
                <div className="bg-muted/50 rounded-xl p-6 relative">
                  <div className="flex mb-4">
                    {[...Array(t.testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground italic mb-4">
                    "{t.testimonial.text}"
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold">
                    - {t.testimonial.author}
                  </p>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">"</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-muted-foreground">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.9★</div>
                    <div className="text-muted-foreground">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                {t.title}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t.subtitle}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              {t.features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-start space-x-4 transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                    }`}
                    style={{ transitionDelay: `${index * 200 + 500}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
            }`} style={{ transitionDelay: '1100ms' }}>
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-green transition-smooth text-lg px-8 py-6 rounded-full hover-lift group"
                asChild
              >
                <a 
                  href="https://chat.whatsapp.com/HswxQuE9k4b1qcm0wWr3Mb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title={t.tooltip}
                >
                  {t.joinButton}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};