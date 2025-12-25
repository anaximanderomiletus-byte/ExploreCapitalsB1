
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100 py-12 md:py-16 relative z-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <Link to="/" className="text-text font-display font-black text-2xl tracking-tighter inline-block mb-4">
            ExploreCapitals
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            A premium, high-fidelity platform for mastering world geography, demographics, and capitals through design-led education.
          </p>
        </div>

        {/* Navigation Column - Matching Main Menu Labels */}
        <div>
          <h4 className="font-display font-bold text-text text-sm uppercase tracking-widest mb-6">Navigation</h4>
          <ul className="space-y-3 md:space-y-4">
            <li>
              <Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Home</Link>
            </li>
            <li>
              <Link to="/games" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Games</Link>
            </li>
            <li>
              <Link to="/directory" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Directory</Link>
            </li>
            <li>
              <Link to="/map" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Map</Link>
            </li>
          </ul>
        </div>

        {/* Project Column */}
        <div>
          <h4 className="font-display font-bold text-text text-sm uppercase tracking-widest mb-6">ABOUT</h4>
          <ul className="space-y-3 md:space-y-4">
            <li>
              <Link to="/about" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">About Us</Link>
            </li>
            <li>
              <Link to="/about#contact" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-400 text-xs font-medium text-center md:text-left">
          © 2025 ExploreCapitals
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
