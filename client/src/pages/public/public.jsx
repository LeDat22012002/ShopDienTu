import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Navigation, TopHeader, Footer } from '../../components';
const Public = () => {
    return (
        <div className="flex flex-col items-center w-full">
            <TopHeader />
            <Header />
            <Navigation />
            <div className="flex flex-col items-center w-full">
                <Outlet></Outlet>
            </div>
            <Footer />
        </div>
    );
};

export default Public;
