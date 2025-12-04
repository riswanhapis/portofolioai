import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Server, Shield, Globe, Database, Terminal, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    
    gsap.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, 
        opacity: 1, 
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(contentRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0, 
        opacity: 1, 
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        }
      }
    );

    if (skillsRef.current) {
      gsap.fromTo(skillsRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          stagger: 0.1,
          delay: 0.4,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  const skills = [
    { name: 'Cyber Security', icon: <Shield className="text-primary" />, level: 'Advanced' },
    { name: 'Web Development', icon: <Globe className="text-secondary" />, level: 'Advanced' },
    { name: 'Backend Systems', icon: <Server className="text-purple-500" />, level: 'Intermediate' },
    { name: 'Database Design', icon: <Database className="text-yellow-500" />, level: 'Intermediate' },
    { name: 'Linux / Server', icon: <Terminal className="text-red-500" />, level: 'Advanced' },
    { name: 'System Arch', icon: <Cpu className="text-blue-500" />, level: 'Intermediate' },
  ];

  return (
    <section id="about" className="py-20 bg-dark-lighter relative" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16" ref={titleRef}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="border-b-4 border-primary pb-2">Tentang Saya</span>
            </h2>
            <p className="text-gray-400 mt-4">Perjalanan dari nol hingga menjadi profesional.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16" ref={contentRef}>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Halo! Saya <span className="text-white font-bold">Rizki Okan Saputra</span>, seorang lulusan SMK Muhammadiyah 2 Karanganyar yang memiliki passion mendalam di dunia teknologi.
              </p>
              <p>
                Saya belajar secara <span className="text-primary">otodidak</span>, mengeksplorasi setiap sudut dunia Cyber Security dan Web Development. Ketertarikan saya bermula dari rasa ingin tahu bagaimana sebuah sistem bekerja dan bagaimana melindunginya.
              </p>
              <p>
                Saat ini, saya fokus membangun aplikasi web yang tidak hanya fungsional dan indah, tetapi juga <span className="text-secondary">aman</span> dan <span className="text-secondary">skalabel</span>.
              </p>
            </div>
            
            <div className="bg-dark p-6 rounded-2xl border border-gray-800 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Terminal size={20} className="text-primary" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'Python', 'PHP', 'Laravel', 'Supabase', 'Docker', 'Kali Linux', 'Burp Suite'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6" ref={skillsRef}>
            {skills.map((skill, index) => (
              <div key={index} className="p-6 bg-dark rounded-xl border border-gray-800 hover:border-primary/50 transition-all hover:-translate-y-1 group">
                <div className="mb-4 p-3 bg-dark-lighter rounded-lg w-fit group-hover:bg-primary/10 transition-colors">
                  {skill.icon}
                </div>
                <h4 className="font-bold text-lg mb-1">{skill.name}</h4>
                <p className="text-sm text-gray-500">{skill.level}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
