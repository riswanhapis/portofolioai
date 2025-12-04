
import { Github, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-lighter py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://github.com/riswanhapis" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
            <Github />
          </a>
          <a href="mailto:attackd306@gmail.com" className="text-gray-400 hover:text-primary transition-colors">
            <Mail />
          </a>
          <a href="tel:+584168346687" className="text-gray-400 hover:text-primary transition-colors">
            <Phone />
          </a>
        </div>
        <p className="text-gray-500">
          &copy; 2025 Rizki Okan Saputra. Karanganyar, Jawa Tengah.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
