import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const translations = {
  en: {
    title: "Get in Touch",
    subtitle: "Have questions? We're here to help!",
    description: "Connect with us through WhatsApp for instant support or any inquiries about MaachBazar.",
    contactButton: "Contact Support",
    phoneNumber: "+91 98187 43327",
    features: [
      {
        icon: MessageCircle,
        title: "24/7 WhatsApp Support",
        description: "Get instant responses to your queries"
      },
      {
        icon: Phone,
        title: "Direct Phone Support",
        description: "Call us for immediate assistance"
      },
      {
        icon: Mail,
        title: "Email Support",
        description: "Detailed support via email"
      },
      {
        icon: MapPin,
        title: "Local Service",
        description: "Serving your neighborhood"
      }
    ]
  },
  bn: {
    title: "যোগাযোগ করুন",
    subtitle: "প্রশ্ন আছে? আমরা সাহায্য করতে এখানে আছি!",
    description: "তাৎক্ষণিক সহায়তা বা মাছবাজার সম্পর্কে যেকোনো অনুসন্ধানের জন্য হোয়াটসঅ্যাপের মাধ্যমে আমাদের সাথে যোগাযোগ করুন।",
    contactButton: "সাপোর্টের সাথে যোগাযোগ করুন",
    phoneNumber: "+৯১ ৯৮১৮৭ ৪৩৩২৭",
    features: [
      {
        icon: MessageCircle,
        title: "২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট",
        description: "আপনার প্রশ্নের তাৎক্ষণিক উত্তর পান"
      },
      {
        icon: Phone,
        title: "সরাসরি ফোন সাপোর্ট",
        description: "তাৎক্ষণিক সহায়তার জন্য আমাদের কল করুন"
      },
      {
        icon: Mail,
        title: "ইমেইল সাপোর্ট",
        description: "ইমেইলের মাধ্যমে বিস্তারিত সহায়তা"
      },
      {
        icon: MapPin,
        title: "স্থানীয় সেবা",
        description: "আপনার এলাকায় সেবা প্রদান"
      }
    ]
  },
  hi: {
    title: "संपर्क करें",
    subtitle: "कोई प्रश्न है? हम मदद के लिए यहां हैं!",
    description: "तत्काल सहायता या मछबाज़ार के बारे में किसी भी पूछताछ के लिए व्हाट्सएप के माध्यम से हमसे जुड़ें।",
    contactButton: "सहायता से संपर्क करें",
    phoneNumber: "+९१ ९८१८७ ४३३२७",
    features: [
      {
        icon: MessageCircle,
        title: "24/7 व्हाट्सएप सहायता",
        description: "अपने प्रश्नों के तुरंत जवाब पाएं"
      },
      {
        icon: Phone,
        title: "सीधा फोन सहायता",
        description: "तत्काल सहायता के लिए हमें कॉल करें"
      },
      {
        icon: Mail,
        title: "ईमेल सहायता",
        description: "ईमेल के माध्यम से विस्तृत सहायता"
      },
      {
        icon: MapPin,
        title: "स्थानीय सेवा",
        description: "आपके पड़ोस में सेवा"
      }
    ]
  }
};

export const ContactSection = () => {
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
    <section id="contact" ref={sectionRef} className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              {t.title}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              {t.subtitle}
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Features */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`} style={{ transitionDelay: '300ms' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {t.features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`bg-card rounded-xl p-6 text-center shadow-soft hover-lift transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                    style={{ transitionDelay: `${index * 150 + 500}ms` }}
                  >
                    <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Contact Card */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`} style={{ transitionDelay: '600ms' }}>
            <div className="bg-card rounded-2xl p-8 shadow-large text-center relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent opacity-10 rounded-full transform -translate-x-12 translate-y-12" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-green">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Ready to Connect?
                </h3>
                
                <p className="text-muted-foreground mb-8">
                  Get instant support and join our growing community of fish and poultry lovers.
                </p>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-primary hover:shadow-green transition-smooth text-lg py-6 rounded-full hover-lift group"
                    asChild
                  >
                    <a 
                      href="https://wa.me/919818743327" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <MessageCircle className="mr-3 h-6 w-6" />
                      {t.contactButton}
                    </a>
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <Phone className="inline h-4 w-4 mr-2" />
                    {t.phoneNumber}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Available 24/7 • Quick Response Guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};