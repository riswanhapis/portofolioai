
import { useState, useEffect } from 'react';
import { Github, Mail, Phone } from 'lucide-react';
import { getSiteSettings } from '../../services/dataService';
import type { SiteSettings } from '../../services/dataService';

const Footer = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSiteSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-dark-lighter py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <a href={settings?.github_url || 'https://github.com/riswanhapis'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
            <Github />
          </a>
          <a href={`mailto:${settings?.contact_email || 'attackd306@gmail.com'}`} className="text-gray-400 hover:text-primary transition-colors">
            <Mail />
          </a>
          <a href={`tel:${settings?.contact_phone || '+584168346687'}`} className="text-gray-400 hover:text-primary transition-colors">
            <Phone />
          </a>
        </div>
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} {settings?.site_title || 'Rizki Okan Saputra'}. {settings?.contact_address || 'Karanganyar, Jawa Tengah'}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
