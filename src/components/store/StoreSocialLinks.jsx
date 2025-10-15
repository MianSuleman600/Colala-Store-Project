// src/components/store/StoreSocialLinks.jsx
import React from 'react';

// Import social media icons
import whatsappIcon from '../../assets/icons/whatsapp.png';
import instagramIcon from '../../assets/icons/instagram.png';
import xIcon from '../../assets/icons/twitter.png';
import facebookIcon from '../../assets/icons/facebook.png';

// A configuration map to easily link the 'type' from your API to the correct icon.
const socialIconMap = {
  whatsapp: { icon: whatsappIcon, alt: 'WhatsApp' },
  instagram: { icon: instagramIcon, alt: 'Instagram' },
  twitter: { icon: xIcon, alt: 'X (Twitter)' },
  facebook: { icon: facebookIcon, alt: 'Facebook' },
};

/**
 * StoreSocialLinks Component
 * Dynamically displays social media icons based on the provided links.
 *
 * @param {object} props
 * @param {Array<{type: string, url: string}>} props.socialLinks - The array of social links from the store data.
 */
const StoreSocialLinks = ({ socialLinks = [] }) => {
    // Don't render the component at all if the socialLinks array is missing or empty.
    if (!socialLinks || socialLinks.length === 0) {
        return null;
    }

    return (
       <div className="flex justify-start space-x-4 w-full py-4">
        {socialLinks.map((link) => {
          // Find the correct icon and alt text from our map using the link's type.
          const config = socialIconMap[link.type.toLowerCase()];

          // Only render the link if we have a matching icon and a URL exists.
          // Note: Your data uses 'url' as the key for the link.
          if (config && link.url) {
            return (
              <a 
                key={link.type} 
                href={link.url} // Use the dynamic URL from your data
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 shadow-md shadow-emerald-700 rounded-lg bg-white"
              >
                <img src={config.icon} alt={config.alt} className="w-6 h-6" />
              </a>
            );
          }
          // If the type doesn't match any of our icons, render nothing.
          return null;
        })}
      </div>
    );
};

export default StoreSocialLinks;