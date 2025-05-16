
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/95bb4ccc-0cde-4842-93ac-b14dbfa766cd.png" 
              alt="Rupiah Digital Logo" 
              className="h-10 w-10 mr-2"
            />
            <span className="font-poppins font-bold text-xl">
              Rupiah <span className="text-rupiah-red">Digital</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="font-medium hover:text-rupiah-red transition-colors">Features</a>
          <a href="#use-cases" className="font-medium hover:text-rupiah-red transition-colors">Use Cases</a>
          <a href="#roadmap" className="font-medium hover:text-rupiah-red transition-colors">Roadmap</a>
          <a href="#about" className="font-medium hover:text-rupiah-red transition-colors">About</a>
          <Link to="/login">
            <Button className="bg-rupiah-red hover:bg-red-700 text-white">Try Devnet</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container py-4 flex flex-col space-y-4">
            <a 
              href="#features" 
              className="font-medium py-2 hover:text-rupiah-red transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#use-cases" 
              className="font-medium py-2 hover:text-rupiah-red transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Use Cases
            </a>
            <a 
              href="#roadmap" 
              className="font-medium py-2 hover:text-rupiah-red transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roadmap
            </a>
            <a 
              href="#about" 
              className="font-medium py-2 hover:text-rupiah-red transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="bg-rupiah-red hover:bg-red-700 text-white w-full">
                Try Devnet
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
