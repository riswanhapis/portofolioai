import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Settings, Clock, ShieldAlert } from 'lucide-react';

const Maintenance = () => {
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )
    .fromTo(iconRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
    )
    .fromTo(textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 }
    );

    // Continuous rotation for the gear
    gsap.to(iconRef.current, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "linear"
    });
  }, []);

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div ref={containerRef} className="relative z-10 p-8 text-center max-w-2xl mx-auto">
        <div className="mb-12 relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          <div ref={iconRef} className="relative bg-dark-lighter p-6 rounded-2xl border border-gray-800 shadow-2xl">
            <Settings size={64} className="text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 bg-secondary text-dark font-bold text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-bounce">
            <Clock size={12} />
            Updating
          </div>
        </div>

        <div ref={textRef} className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            System Upgrade
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Kami sedang melakukan peningkatan sistem untuk memberikan pengalaman yang lebih baik. 
            Website akan segera kembali online.
          </p>
          
          <div className="flex justify-center gap-8 mt-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>Secure Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Est. Time: ~1 Hour</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Rizki Okan Saputra. All rights reserved.
      </div>
    </div>
  );
};

export default Maintenance;
