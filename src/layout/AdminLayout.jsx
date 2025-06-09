import {useState} from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen]= useState(false);
    return(
        <div className='flex h-screen bg-gray-100'>
            <AdminSidebar isOpen={isSidebarOpen} onClose={()=>setIsSidebarOpen(false)} />
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <AdminHeader onMenuClick={()=>setIsSidebarOpen(!isSidebarOpen)}/>
                    <main className='flex-1 overflow-auto bg-gray-50'>
                        {children}
                    </main>

                </div>
        </div>
    );
};
export default AdminLayout;