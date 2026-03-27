import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useCurrency } from '../hooks/useCurrency';
import { FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar menu">
          <FiMenu size={20} />
        </button>
      </div>
      
      <div className="navbar-right">
        {/* Currency Selector */}
        <div className="currency-selector">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Select currency"
            className="currency-select"
          >
            {Object.entries(currencies).map(([code, info]) => (
              <option key={code} value={code}>{info.symbol} {code}</option>
            ))}
          </select>
        </div>

        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <div className="profile">
          <div className="avatar">
            <FiUser />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
