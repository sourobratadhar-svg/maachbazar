import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle, Truck } from 'lucide-react';

const translations = {
  en: {
    title: "How MaachBazar Works",
    steps: [
      {
        title: "Sellers Share Inventory",
        description: "Early morning updates with fresh stock images from verified sellers",
        detail: "Every morning, our verified sellers share real-time images of their fresh catch directly in our WhatsApp groups."
      },
      {
        title: "Quality Check",
        description: "We verify quality and freshness before posting to buyer groups",
        detail: "Our team ensures every product meets our quality standards before it reaches your feed."
      },
      {
        title: "Quick Delivery",
        description: "Orders delivered within 2 hours to maintain freshness",
        detail: "Lightning-fast delivery ensures your fish and poultry arrive at peak freshness."
      }
    ]
  },
  bn: {
    title: "মাছবাজার কিভাবে কাজ করে",
    steps: [
      {
        title: "বিক্রেতারা স্টক শেয়ার করেন",
        description: "ভোরে যাচাইকৃত বিক্রেতাদের কাছ থেকে তাজা স্টকের ছবি আপডেট",
        detail: "প্রতিদিন সকালে, আমাদের যাচাইকৃত বিক্রেতারা তাদের তাজা মাছের রিয়েল-টাইম ছবি সরাসরি আমাদের হোয়াটসঅ্যাপ গ্রুপে শেয়ার করেন।"
      },
      {
        title: "মানের যাচাই",
        description: "ক্রেতা গ্রুপে পোস্ট করার আগে আমরা মান ও তাজা থাকার বিষয়টি যাচাই করি",
        detail: "আমাদের টিম নিশ্চিত করে যে প্রতিটি পণ্য আপনার ফিডে পৌঁছানোর আগে আমাদের মানের মান পূরণ করে।"
      },
      {
        title: "দ্রুত ডেলিভারি",
        description: "তাজা রাখার জন্য ২ ঘন্টার মধ্যে ডেলিভারি",
        detail: "বিদ্যুৎ-দ্রুত ডেলিভারি নিশ্চিত করে যে আপনার মাছ এবং মুরগি সর্বোচ্চ তাজাত্বে পৌঁছায়।"
      }
    ]
  },
  hi: {
    title: "मछबाज़ार कैसे काम करता है",
    steps: [
      {
        title: "विक्रेता स्टॉक साझा करते हैं",
        description: "सत्यापित विक्रेताओं से सुबह-सुबह ताज़े स्टॉक की तस्वीरें",
        detail: "हर सुबह, हमारे सत्यापित विक्रेता अपने ताज़े उत्पादों की रियल-टाइम तस्वीरें सीधे हमारे व्हाट्सएप ग्रुप में साझा करते हैं।"
      },
      {
        title: "गुणवत्ता जांच",
        description: "खरीदार समूहों में पोस्ट करने से पहले हम गुणवत्ता और ताज़गी की जांच करते हैं",
        detail: "हमारी टीम यह सुनिश्चित करती है कि हर उत्पाद आपके फ़ीड तक पहुंचने से पहले हमारे गुणवत्ता मानकों को पूरा करे।"
      },
      {
        title: "त्वरित डिलीवरी",
        description: "ताज़गी बनाए रखने के लिए 2 घंटे के भीतर डिलीवरी",
        detail: "बिजली-तेज़ डिलीवरी यह सुनिश्चित करती है कि आपकी मछली और मुर्गी चरम ताज़गी में पहुंचे।"
      }
    ]
  }
};

export const HowItWorksSection = () => {
  const [language] = useState<keyof typeof translations>('en');
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const t = translations[language];
  const icons = [Camera, CheckCircle, Truck];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleSteps(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    stepRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient observe-fade in-view">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full observe-scale in-view" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {t.steps.map((step, index) => {
            const IconComponent = icons[index];
            const isVisible = visibleSteps[index];
            
            return (
              <div
                key={index}
                ref={el => stepRefs.current[index] = el}
                className={`text-center p-8 transition-all duration-800 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Step Number */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl transition-transform duration-500 ${
                    isVisible ? 'scale-100' : 'scale-0'
                  }`} style={{ transitionDelay: `${index * 200 + 300}ms` }}>
                    {index + 1}
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full bg-primary/20 animate-pulse-green ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`} style={{ transitionDelay: `${index * 200 + 500}ms` }} />
                </div>

                {/* Icon */}
                <div className={`mb-6 transition-all duration-500 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`} style={{ transitionDelay: `${index * 200 + 400}ms` }}>
                  <IconComponent className="h-12 w-12 text-primary mx-auto" />
                </div>

                {/* Content */}
                <div className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`} style={{ transitionDelay: `${index * 200 + 500}ms` }}>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-sm text-muted-foreground/80 italic">
                    {step.detail}
                  </p>
                </div>

                {/* Connecting Line */}
                {index < t.steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary to-primary/30 transform -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};