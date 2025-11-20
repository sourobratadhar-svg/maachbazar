import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Users, Smartphone, DollarSign, ArrowRight } from 'lucide-react';

const translations = {
  en: {
    title: "For Sellers",
    subtitle: "Join our community of trusted local sellers",
    features: [
      {
        icon: Users,
        title: "Connect directly with local customers",
        description: "Build relationships with your community and grow your customer base"
      },
      {
        icon: Smartphone,
        title: "Simple WhatsApp-based inventory management",
        description: "No complex apps - just share your fresh stock photos on WhatsApp"
      },
      {
        icon: DollarSign,
        title: "Guaranteed payments and order fulfillment",
        description: "Secure transactions and reliable payment processing"
      }
    ],
    joinButton: "Join as Seller",
    tooltip: "Click to join our WhatsApp seller community"
  },
  bn: {
    title: "বিক্রেতাদের জন্য",
    subtitle: "আমাদের বিশ্বস্ত স্থানীয় বিক্রেতাদের সম্প্রদায়ে যোগ দিন",
    features: [
      {
        icon: Users,
        title: "স্থানীয় ক্রেতাদের সাথে সরাসরি যোগাযোগ",
        description: "আপনার সম্প্রদায়ের সাথে সম্পর্ক গড়ুন এবং আপনার গ্রাহক বেস বাড়ান"
      },
      {
        icon: Smartphone,
        title: "সহজ হোয়াটসঅ্যাপ-ভিত্তিক ইনভেন্টরি ব্যবস্থাপনা",
        description: "কোন জটিল অ্যাপ নেই - শুধু হোয়াটসঅ্যাপে আপনার তাজা স্টকের ছবি শেয়ার করুন"
      },
      {
        icon: DollarSign,
        title: "নিশ্চিত পেমেন্ট এবং অর্ডার পূরণ",
        description: "নিরাপদ লেনদেন এবং নির্ভরযোগ্য পেমেন্ট প্রসেসিং"
      }
    ],
    joinButton: "বিক্রেতা হিসেবে যোগ দিন",
    tooltip: "আমাদের হোয়াটসঅ্যাপ বিক্রেতা কমিউনিটিতে যোগ দিতে ক্লিক করুন"
  },
  hi: {
    title: "विक्रेताओं के लिए",
    subtitle: "हमारे विश्वसनीय स्थानीय विक्रेताओं के समुदाय में शामिल हों",
    features: [
      {
        icon: Users,
        title: "स्थानीय ग्राहकों से सीधा जुड़ें",
        description: "अपने समुदाय के साथ संबंध बनाएं और अपना ग्राहक आधार बढ़ाएं"
      },
      {
        icon: Smartphone,
        title: "सरल व्हाट्सएप-आधारित इन्वेंटरी प्रबंधन",
        description: "कोई जटिल ऐप नहीं - बस व्हाट्सएप पर अपने ताज़े स्टॉक की तस्वीरें साझा करें"
      },
      {
        icon: DollarSign,
        title: "गारंटीड भुगतान और ऑर्डर पूर्ति",
        description: "सुरक्षित लेनदेन और विश्वसनीय भुगतान प्रसंस्करण"
      }
    ],
    joinButton: "विक्रेता के रूप में शामिल हों",
    tooltip: "हमारे व्हाट्सएप विक्रेता समुदाय में शामिल होने के लिए क्लिक करें"
  }
};

export const ForSellersSection = () => {
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
    <section id="for-sellers" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
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
                    style={{ transitionDelay: `${index * 200 + 300}ms` }}
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
            }`} style={{ transitionDelay: '900ms' }}>
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-green transition-smooth text-lg px-8 py-6 rounded-full hover-lift group"
                asChild
              >
                <a 
                  href="https://chat.whatsapp.com/HrV7fbRE2328BgbMuA9X4N" 
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

          {/* Image */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`} style={{ transitionDelay: '400ms' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl transform rotate-3 opacity-20" />
              <div className="relative bg-card rounded-2xl p-8 shadow-large hover-lift">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Ready to Start Selling?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of local sellers who trust MaachBazar for their business growth.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">25+</div>
                      <div className="text-muted-foreground">Active Sellers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};