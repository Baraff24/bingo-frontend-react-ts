import React from 'react';
import {SocialLinks} from "../index.ts";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-5 border-t">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Testo del copyright */}
        <p className="text-gray-600 text-center sm:text-left mb-4 sm:mb-0">
          &copy; 2024 AUP. All rights reserved.
        </p>

        {/* Social Links */}
          <SocialLinks />
      </div>
    </footer>
  );
};

export default Footer;