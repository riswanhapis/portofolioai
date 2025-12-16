import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Code, Terminal } from 'lucide-react';
import { getSiteSettings } from '../services/dataService';

const Hero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const subRef = useRef(null);
  const btnRef = useRef(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSiteSettings();
      if (settings?.hero_image_url) {
        setHeroImage(settings.hero_image_url);
      }
    };
    fetchSettings();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(heroRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1 }
    )
    .fromTo(textRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2 },
      "-=0.5"
    )
    .fromTo(subRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.6"
    )
    .fromTo(btnRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.6"
    );
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark pt-24 md:pt-20" ref={heroRef}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-lighter border border-gray-800 mb-6 text-sm text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for Freelance
          </div>
          
          <h1 className="text-3xl md:text-7xl font-bold mb-6 leading-tight" ref={textRef}>
            <span className="block text-white">Cyber Security</span>
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">& Web Developer</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto md:mx-0" ref={subRef}>
            Membangun sistem aman dan modern. Saya membantu bisnis mengamankan aset digital dan membangun aplikasi web yang handal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start" ref={btnRef}>
            <a href="#contact" className="px-8 py-3 rounded-full bg-primary text-dark font-bold hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Hubungi Saya <Shield size={18} />
            </a>
            <a href="#projects" className="px-8 py-3 rounded-full border border-gray-700 hover:border-primary text-white hover:text-primary transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Lihat Portfolio <Code size={18} />
            </a>
          </div>
        </div>

        {/* Hero Image / Illustration */}
        <div className="flex-1 flex justify-center relative">
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full rounded-2xl bg-dark-lighter border border-gray-800 flex items-center justify-center overflow-hidden">
               {heroImage ? (
                 <img src={heroImage} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <Terminal size={120} className="text-gray-600" />
               )}
            </div>
            
            {/* Floating Cards */}
            <div className="hidden md:block absolute -top-4 -right-4 p-4 bg-dark-lighter border border-gray-800 rounded-lg shadow-xl animate-bounce delay-700">
              <Shield className="text-primary mb-2" />
              <div className="text-xs text-gray-400">Security Audit</div>
              <div className="font-bold text-white">100% Secure</div>
            </div>
            
            <div className="hidden md:block absolute -bottom-4 -left-4 p-4 bg-dark-lighter border border-gray-800 rounded-lg shadow-xl animate-bounce">
              <Code className="text-secondary mb-2" />
              <div className="text-xs text-gray-400">Clean Code</div>
              <div className="font-bold text-white">Modern Stack</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
