
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Certificates from '../components/Certificates';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <div className="bg-dark min-h-screen text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
