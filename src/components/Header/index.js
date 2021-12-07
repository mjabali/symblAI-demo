import React from 'react';

function Header() {
  return (
    <div className="header">
      <img
        src={process.env.PUBLIC_URL + '/Vonage.png'}
        className="vonage-logo"
        alt="vonage-logo"
        style={{ height: 50, alignSelf: 'center', marginTop: 'auto' }}
      />
      <h3 className="text">Symbl AI integration</h3>
    </div>
  );
}

export default Header;
