import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';
import { getProjects } from '../services/dataService';
import type { Project } from '../services/dataService';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      gsap.fromTo('.project-card',
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
  }, [projects]);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  return (
    <section id="projects" className="py-20 bg-dark relative" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="border-b-4 border-primary pb-2">Portfolio</span>
          </h2>
          <p className="text-gray-400 mt-4">Karya terbaik yang pernah saya buat.</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full border transition-all ${
                filter === cat 
                  ? 'bg-primary text-dark border-primary font-bold' 
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card group bg-dark-lighter rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={project.demo_url} className="p-2 bg-primary text-dark rounded-full hover:bg-white transition-colors" title="View Demo">
                    <ExternalLink size={20} />
                  </a>
                  <a href={project.repo_url} className="p-2 bg-dark text-white border border-gray-600 rounded-full hover:border-primary hover:text-primary transition-colors" title="View Code">
                    <Github size={20} />
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech_stack.map((tech, i) => (
                    <span key={i} className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
