import React from 'react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

// Define the SocialLink interface
interface SocialLink {
    href: string;
    icon: React.ReactNode;
    label: string;
}

// Array of social links
const socialLinks: SocialLink[] = [
    {
        href: 'https://www.instagram.com/aup.poliba/',
        icon: <FaInstagram />,
        label: 'Instagram',
    },
    {
        href: 'https://www.facebook.com/associazioneulissepolitecnico',
        icon: <FaFacebookF />,
        label: 'Facebook',
    },
];

const SocialLinks: React.FC = () => {
    return (
        <ul className="flex space-x-4">
            {socialLinks.map((link) => (
                <li key={link.href}>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.label}
                        className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                        {link.icon}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default SocialLinks;