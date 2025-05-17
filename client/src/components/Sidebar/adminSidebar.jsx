import React, { memo, Fragment, useState } from 'react';
import logo from '../../assets/logo.png';
import { adminSidebar } from '../../ultils/contans2';
import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import icons from '../../ultils/icons';

const { FaSortDown, FaCaretRight } = icons;

const ActiveStyle = 'px-4 py-2 flex items-center gap-2 bg-gray-300';
const NotActiveStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-gray-200 ';

const AdminSidebar = () => {
    const [actived, setActived] = useState([]);

    const handleShowTabs = (tabID) => {
        if (actived.some((el) => el === tabID))
            setActived((prev) => prev.filter((el) => el !== tabID));
        else setActived((prev) => [...prev, tabID]);
    };
    // console.log(actived);
    return (
        <div className="hidden h-screen py-4 overflow-y-auto bg-white border border-gray-100 sm:hidden md:hidden lg:block">
            <Link
                to={'/'}
                className="flex flex-col items-center justify-center gap-2 p-4"
            >
                <img
                    src={logo}
                    alt="logo"
                    className="w-[200px] object-contain"
                />
                <small>Admin workspace</small>
            </Link>
            <div>
                {adminSidebar.map((el) => (
                    <Fragment key={el.id}>
                        {el.type === 'SINGLE' && (
                            <NavLink
                                to={el.path}
                                className={({ isActive }) =>
                                    clsx(
                                        isActive && ActiveStyle,
                                        !isActive && NotActiveStyle
                                    )
                                }
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>
                        )}
                        {el.type === 'PARENT' && (
                            <div
                                onClick={() => handleShowTabs(+el.id)}
                                className="flex flex-col "
                            >
                                <div className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span>{el.icon}</span>
                                        <span>{el.text}</span>
                                    </div>
                                    {actived.some((id) => id === el.id) ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaSortDown />
                                    )}
                                </div>
                                {actived.some((id) => +id === +el.id) && (
                                    <div className="flex flex-col ">
                                        {el.submenu.map((item) => (
                                            <NavLink
                                                key={item.text}
                                                to={item.path}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive && ActiveStyle,
                                                        !isActive &&
                                                            NotActiveStyle,
                                                        'pl-12'
                                                    )
                                                }
                                            >
                                                {item.text}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default memo(AdminSidebar);
