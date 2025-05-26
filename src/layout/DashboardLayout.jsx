// // import { useState } from 'react';
// // import { useAuth } from '../context/AuthContext'; 
// // import Sidebar from '../components/Sidebar';
// // import Header from '../components/Header';
// // import HomePage from '../components/HomePage';

// // const DashboardLayout = () => {
// //   const { employee } = useAuth(); 
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   const toggleSidebar = () => {
// //     setSidebarOpen(!sidebarOpen);
// //   };

// //   if (!employee) return null; 

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
// //       {/* Main Content */}
// //       <div className="flex-1 flex flex-col lg:ml-0">
// //         <Header onMenuClick={toggleSidebar} />
        
// //         <main className="flex-1 overflow-y-auto">
// //           <HomePage />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardLayout;

// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext'; 
// import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';

// const DashboardLayout = () => {
//   const { employee } = useAuth(); 
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   if (!employee) return null; 

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <Header onMenuClick={toggleSidebar} />
        
//         <main className="flex-1 overflow-y-auto">
//           <Outlet /> {/* Replace HomePage with Outlet */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  const { employee } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!employee) return null;

  return (
    <div className="flex h-screen bg-[#F3F4F8]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        
        {/* Main Content Area with shadow and rounded corners */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-2xl shadow-sm h-full">
             
                <Outlet />
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;