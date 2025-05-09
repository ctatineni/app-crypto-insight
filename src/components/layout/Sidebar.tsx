
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  Search, 
  BarChart4, 
  Code2, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
};

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center p-3 ${collapsed ? 'justify-center' : 'space-x-3'} rounded-lg transition-all
      ${isActive 
        ? 'bg-crypto-teal text-white' 
        : 'hover:bg-slate-200 text-slate-700'}`
    }
  >
    <span className="text-xl">{icon}</span>
    {!collapsed && <span className="font-medium">{label}</span>}
  </NavLink>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-white border-r border-slate-200 flex flex-col transition-all ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-slate-200 flex items-center">
        {!collapsed && (
          <div className="flex-1">
            <h2 className="text-xl font-bold text-crypto-blue flex items-center gap-2">
              <Shield className="text-crypto-teal" /> CryptoGuard
            </h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-slate-200"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <NavItem to="/" icon={<LayoutDashboard />} label="Dashboard" collapsed={collapsed} />
        <NavItem to="/inventory" icon={<Search />} label="Inventory" collapsed={collapsed} />
        <NavItem to="/vulnerabilities" icon={<Shield />} label="Vulnerabilities" collapsed={collapsed} />
        <NavItem to="/libraries" icon={<Code2 />} label="Libraries" collapsed={collapsed} />
        <NavItem to="/analytics" icon={<BarChart4 />} label="Analytics" collapsed={collapsed} />
        <NavItem to="/settings" icon={<Settings />} label="Settings" collapsed={collapsed} />
      </nav>
      <div className="p-4 border-t border-slate-200">
        {!collapsed && (
          <div className="text-xs text-slate-500">
            CryptoGuard v1.0 <br />
            © 2025 CryptoGuard
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
