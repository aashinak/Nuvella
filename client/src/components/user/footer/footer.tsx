import React from 'react';

function Footer() {
  return (
    <div className="w-full bg-gray-900 text-white min-h-28 flex flex-col items-center justify-center space-y-2">
      <p className="text-2xl font-semibold font-italiana tracking-wider">Nuvella</p>
      <p className="text-sm">
        © {new Date().getFullYear()} Nuvella. All rights reserved.
      </p>
      <p className="text-xs">
        Designed with ❤️ by the Nuvella Team.
      </p>
    </div>
  );
}

export default Footer;
