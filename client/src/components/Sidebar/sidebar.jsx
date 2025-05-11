import React from 'react';
// import { useState ,useEffect } from "react";
// import { apiGetCategories } from "../apis/app";
import { NavLink } from 'react-router-dom';

// import { createSlug } from '../../ultils/helpers';
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { categories } = useSelector((state) => state.app);
    // console.log(categories)
    return (
        <div className="flex flex-col bg-white border border-gray-100 rounded-md">
            {categories?.map((el) => (
                <NavLink
                    key={el._id}
                    to={el.title}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-main text-white px-5 pt-[14px] pb-[12px] text-sm hover:text-main'
                            : 'px-5 pt-[14px] pb-[12px] text-sm hover:text-main'
                    }
                >
                    {el.title}
                </NavLink>
            ))}
        </div>
    );
};

export default Sidebar;
