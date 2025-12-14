import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100 py-12 relative z-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-text font-display font-bold text-lg">ExploreCapitals</div>
      <div className="text-gray-400 text-sm">
        © 2025 ExploreCapitals Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;