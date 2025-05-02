import React, { memo } from 'react';
import { navigation } from '../../ultils/contains';
import { NavLink } from 'react-router-dom';
import icons from '../../ultils/icons';

const Navigation = () => {
    const { IoHome } = icons;
    return (
        <div className="w-full bg-gray-200">
            <div className="w-main h-[48px] py-2  m-auto text-sm flex items-center">
                {navigation.map((el) => (
                    <NavLink
                        key={el.id}
                        to={el.path}
                        className={({ isActive }) =>
                            isActive
                                ? 'pr-12 hover:text-main text-main'
                                : 'pr-12 hover:text-main'
                        }
                    >
                        {el.value}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default memo(Navigation);
