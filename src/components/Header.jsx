// import { Menu, Search, Filter, Bell, User } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const Header = ({ onMenuClick }) => {
//   const { employee } = useAuth();
  
//   return (
//     <header className="bg-white shadow-sm border-b px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onMenuClick}
//             className="lg:hidden p-2 rounded-md hover:bg-gray-100"
//           >
//             <Menu size={20} />
//           </button>
          
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search issues..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-80"
//             />
//           </div>
          
//           <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//             <Filter size={16} />
//             <span className="text-sm">Filter</span>
//           </button>
//         </div>

//         <div className="flex items-center space-x-4">
//           <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
//               5
//             </span>
//           </button>
          
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//               <User size={18} className="text-gray-600" />
//             </div>
//             <span className="text-sm font-medium text-gray-700">
//               {employee?.name || 'User'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { Menu, Search, Filter, Bell, User, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { employee } = useAuth();
  
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
            {/* <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#4B2D87] text-white text-xs rounded-full flex items-center justify-center">
              12
            </span> */}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#4B2D87] rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {employee?.name || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;