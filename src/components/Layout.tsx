import { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
 

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      
<Sidebar/>
      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
