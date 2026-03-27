import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiList, FiPieChart, FiSettings, FiPlusCircle, FiChevronLeft, FiChevronRight, FiMessageSquare, FiCpu } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar, toggleCollapse }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <h2>{isCollapsed ? 'FT' : 'FinTrack'}</h2>
          <button className="collapse-btn d-none-mobile" onClick={toggleCollapse} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                <FiHome className="nav-icon" /> <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/transactions" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                <FiList className="nav-icon" /> <span className="nav-text">Transactions</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/analytics" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                <FiPieChart className="nav-icon" /> <span className="nav-text">Analytics</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/budget" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                <FiSettings className="nav-icon" /> <span className="nav-text">Budget</span>
              </NavLink>
            </li>
          </ul>

          <div className="sidebar-heading" style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {!isCollapsed && 'AI Tools'}
          </div>
          <ul>
            <li>
              <NavLink to="/ai-advisor" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                <FiMessageSquare className="nav-icon" /> <span className="nav-text">Financial Advisor</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/ai-analyzer" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                <FiCpu className="nav-icon" /> <span className="nav-text">Expense Analyzer</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
