import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import path from '../../ultils/path';
import { useSelector } from 'react-redux';
import { MemberSidebar } from '../../components';
const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector((state) => state.user);
    if (!isLoggedIn || !current)
        return <Navigate to={`/${path.LOGIN}`} replace={true} />;
    return (
        <div className="relative flex w-full min-h-screen text-gray-900 bg-gray-100 ">
            <div className="w-[100px] md:w-[250px] flex-none fixed top-0 bottom-0">
                <MemberSidebar />
            </div>
            <div className="w-[100px] md:w-[250px]"></div>
            <div className="flex-auto w-[300px] lg:w-[1000px]">
                <Outlet />
            </div>
        </div>
    );
};

export default MemberLayout;
