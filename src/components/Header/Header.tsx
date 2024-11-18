import React from 'react';
import {SocialLinks} from "../index.ts";

const Header: React.FC = () => {
  return (
    <header className="py-3 border-b bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo and Name */}
        <a
          href="https://aup.it/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center mb-4 md:mb-0"
        >
          <img
            src="https://aup.it/images/Loghi/logo150x150.png"
            width={50}
            height={50}
            alt="Logo AUP"
            className="h-12 w-12 mr-3"
          />
          <span className="text-xl font-semibold text-gray-800">AUP</span>
        </a>

        {/* Social Links */}
        <SocialLinks />

      </div>
    </header>
  );
};

export default Header;