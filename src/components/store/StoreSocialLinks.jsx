// src/components/store/StoreSocialLinks.jsx
import React from 'react';

// Import social media icons (ensure paths are correct relative to this component)
import whatsappIcon from '../../assets/icons/whatsapp.png';
import instagramIcon from '../../assets/icons/instagram.png';
import xIcon from '../../assets/icons/twitter.png';
import facebookIcon from '../../assets/icons/facebook.png';

/**
 * StoreSocialLinks Component
 * Displays social media icons for the store.
 *
 * @param {object} props
 * @param {boolean} props.isLoggedIn - Indicates if the user is logged in (to show/hide icons).
 */
const StoreSocialLinks = ({ isLoggedIn }) => {
    if (!isLoggedIn) {
        return null; // Don't render if not logged in
    }

    return (
        <div className="flex justify-start  space-x-4 w-full py-4"> {/* Added padding for spacing */}
            <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={xIcon} alt="X (Twitter)" className="w-6 h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
            </a>
        </div>
    );
};

export default StoreSocialLinks;
