// Footer.js

import React from 'react';

const Footer = () => {
  const footerStyles = {
    backgroundColor: '#E9AE05', // Cambia este color al que desees
    padding: '3px',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    color: '#000000', // Cambia este color al que desees para el texto
  };

  return (
    <footer className="bg-body-tertiary text-center text-lg-start" style={footerStyles}>
      <div className="text-center p-3" style={{ color: '#000000' }}>
        © {new Date().getFullYear()} Gerson Daniel Gómez Martínez.
      </div>
    </footer>
  );
}

export default Footer;
