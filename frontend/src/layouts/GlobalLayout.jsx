import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const GlobalLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="page-root font-sans antialiased">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <div className="page-content">
        <Navbar toggleMobile={() => setMobileOpen(v => !v)} />
        <main className="page-main" id="main-content">
          <div className="page-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GlobalLayout;
