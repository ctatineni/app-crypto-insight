
import React from 'react';
import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/inventory') return 'Cryptographic Inventory';
    if (path === '/vulnerabilities') return 'Vulnerabilities';
    if (path === '/libraries') return 'Libraries & Languages';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    
    // Extract app ID from path if present
    if (path.startsWith('/app/')) {
      const appId = path.split('/')[2];
      return `App: ${appId}`;
    }
    
    return 'CryptoGuard';
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-crypto-blue">{getPageTitle()}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="text-slate-500 hover:text-crypto-teal cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-crypto-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-crypto-blue text-white rounded-full h-8 w-8 flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="text-sm font-medium">Security Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
