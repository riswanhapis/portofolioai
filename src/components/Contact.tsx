import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Github, Send, MapPin } from 'lucide-react';
import { getSiteSettings, sendMessage } from '../services/dataService';
import type { SiteSettings } from '../services/dataService';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSiteSettings();
      setSettings(data);
    };
    fetchSettings();

    const el = sectionRef.current;

    gsap.fromTo(infoRef.current,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
        }
      }
    );

    gsap.fromTo(formRef.current,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
        }
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendMessage(formData);
      alert('Pesan berhasil dikirim!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-dark relative" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-5xl font-bold mb-4">
            <span className="border-b-4 border-primary pb-2">Hubungi Saya</span>
          </h2>
          <p className="text-gray-400 mt-4">Mari berdiskusi tentang project Anda.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8" ref={infoRef}>
            <h3 className="text-2xl font-bold text-white mb-6">Informasi Kontak</h3>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-dark-lighter rounded-lg text-primary border border-gray-800">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Alamat</h4>
                <p className="text-gray-400">{settings?.contact_address || 'Karanganyar, Jawa Tengah'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-dark-lighter rounded-lg text-primary border border-gray-800">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Telepon / WhatsApp</h4>
                <p className="text-gray-400">{settings?.contact_phone || '+62 812-3456-7890'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-dark-lighter rounded-lg text-primary border border-gray-800">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Email</h4>
                <p className="text-gray-400">{settings?.contact_email || 'example@email.com'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-dark-lighter rounded-lg text-primary border border-gray-800">
                <Github size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">GitHub</h4>
                <a href={settings?.github_url || 'https://github.com/riswanhapis'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  {settings?.github_url ? settings.github_url.replace('https://', '') : 'github.com/riswanhapis'}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-dark-lighter p-8 rounded-2xl border border-gray-800 shadow-2xl" ref={formRef}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="Masukkan nama Anda"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Pesan</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors h-32 resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-dark font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : 'Kirim Pesan'} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
