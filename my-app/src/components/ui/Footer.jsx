import React from 'react';
import { Globe, Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            {/* Main Footer Content */}
            <div className="footer-content">
                {/* Support Column */}
                <div className="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Help Centre</a></li>
                        <li><a href="#">Get help with a safety issue</a></li>
                        <li><a href="#">UniCover</a></li>
                        <li><a href="#">Anti-discrimination</a></li>
                        <li><a href="#">Disability support</a></li>
                        <li><a href="#">Cancellation options</a></li>
                        <li><a href="#">Report neighbourhood concern</a></li>
                    </ul>
                </div>

                {/* Traveling Column */}
                <div className="footer-column">
                    <h4>Traveling</h4>
                    <ul>
                        <li><a href="#">Plan your trip</a></li>
                        <li><a href="#">Find travel companions</a></li>
                        <li><a href="#">Travel resources</a></li>
                        <li><a href="#">Community forum</a></li>
                        <li><a href="#">Travel responsibly</a></li>
                        <li><a href="#">Join a group trip</a></li>
                        <li><a href="#">Share your experience</a></li>
                    </ul>
                </div>

                {/* UniGo Column */}
                <div className="footer-column">
                    <h4>UniGo</h4>
                    <ul>
                        <li><a href="#">2025 Summer Release</a></li>
                        <li><a href="#">Newsroom</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Investors</a></li>
                        <li><a href="#">UniGo.org emergency stays</a></li>
                    </ul>
                </div>
            </div>

            {/* Footer Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-left">
                    <span>© {currentYear} UniGo, Inc.</span>
                    <span className="footer-dot">·</span>
                    <a href="#">Privacy</a>
                    <span className="footer-dot">·</span>
                    <a href="#">Terms</a>
                    <span className="footer-dot">·</span>
                    <a href="#">Company details</a>
                </div>

                <div className="footer-bottom-right">
                    <button className="footer-locale-btn">
                        <Globe size={16} />
                        <span>English (IN)</span>
                    </button>
                    <span className="footer-currency">₹ INR</span>
                    <div className="footer-social">
                        <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
