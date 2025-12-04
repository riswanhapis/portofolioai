import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { getCertificates } from '../services/dataService';
import type { Certificate } from '../services/dataService';

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      const data = await getCertificates();
      setCertificates(data);
    };
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (certificates.length > 0) {
      gsap.fromTo('.cert-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, [certificates]);

  return (
    <section id="certificates" className="py-20 bg-dark-lighter relative" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="border-b-4 border-primary pb-2">Sertifikat</span>
          </h2>
          <p className="text-gray-400 mt-4">Pengakuan atas kompetensi dan keahlian.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card bg-dark rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="h-48 overflow-hidden relative group">
                <img 
                  src={cert.image_url} 
                  alt={cert.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={cert.credential_url} className="px-4 py-2 bg-primary text-dark font-bold rounded-full flex items-center gap-2 hover:bg-white transition-colors">
                    <ExternalLink size={16} />
                    Lihat Kredensial
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Award size={20} />
                  <span className="text-sm font-bold">{cert.issuer}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{cert.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={16} />
                  <span>{cert.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
