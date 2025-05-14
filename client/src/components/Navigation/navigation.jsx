import React, { memo } from 'react';
import { navigation } from '../../ultils/contains';
import { NavLink } from 'react-router-dom';
import icons from '../../ultils/icons';

const Navigation = () => {
    const { IoHome } = icons;
    return (
        <div className="w-full bg-gray-200">
            {/* Mobile: thanh cuộn ngang */}
            {/* <div className="block overflow-x-auto md:hidden scrollbar-hide">
                <div className="flex w-max h-[48px] py-2 px-4 items-center gap-6 text-sm whitespace-nowrap">
                    {navigation.map((el) => (
                        <NavLink
                            key={el.id}
                            to={el.path}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-main font-semibold'
                                    : 'hover:text-main'
                            }
                        >
                            {el.value}
                        </NavLink>
                    ))}
                </div>
            </div> */}

            {/* Tablet/PC: layout cố định */}
            <div className="w-full flex h-[48px] py-2 m-auto overflow-x-auto  scrollbar-hide md:overflow-visible md:scrollbar-default lg:w-main items-center gap-12 text-sm">
                <div className="flex h-[48px] px-4 lg:px-0 items-center gap-6 text-sm whitespace-nowrap">
                    {navigation.map((el) => (
                        <NavLink
                            key={el.id}
                            to={el.path}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-main font-semibold'
                                    : 'hover:text-main'
                            }
                        >
                            {el.value}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(Navigation);
