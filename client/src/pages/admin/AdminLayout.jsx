import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import path from '../../ultils/path';
import { useSelector } from 'react-redux';
import { AdminSidebar } from '../../components';
const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector((state) => state.user);
    if (!isLoggedIn || !current || current.role !== 'admin')
        return <Navigate to={`/${path.LOGIN}`} replace={true} />;
    return (
        <div className="relative flex w-full min-h-screen text-gray-900 bg-gray-100">
            <div className="w-[327px] flex-none fixed top-0 bottom-0">
                <AdminSidebar />
            </div>
            <div className="w-[327px]"></div>
            <div className="flex-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
