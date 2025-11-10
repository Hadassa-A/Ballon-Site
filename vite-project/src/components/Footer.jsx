import React from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa"; // אייקונים יפים ליצירת קשר

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <span>© כל הזכויות שמורות Hadassa_A</span>
        <div className="contact-links">
          <a href="tel:0501234567">
            <FaPhone /> 050-1234567
          </a>
          <a href="mailto:hadassa@example.com?subject=ביקרתי%20באתר%20הבלונים%20שלכם..." target="_blank">
            <FaEnvelope /> hadassa@example.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
