import React, { memo, Fragment, useState } from 'react';
import avatarDefault from '../../assets/avt1.png';
import { memberSidebar } from '../../ultils/contans2';
import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import icons from '../../ultils/icons';
import { useSelector } from 'react-redux';

const { FaSortDown, FaCaretRight } = icons;

const ActiveStyle = 'px-4 py-2 flex items-center gap-2 bg-gray-300';
const NotActiveStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-gray-200 ';

const MemberSidebar = () => {
    const [actived, setActived] = useState([]);
    const { current } = useSelector((state) => state.user);
    const handleShowTabs = (tabID) => {
        if (actived.some((el) => el === tabID))
            setActived((prev) => prev.filter((el) => el !== tabID));
        else setActived((prev) => [...prev, tabID]);
    };
    // console.log(current);
    return (
        <div className="h-full py-4 bg-white border border-gray-100">
            <div className="flex flex-col items-center justify-center w-full gap-4 py-4">
                <img
                    src={current?.avatar || avatarDefault}
                    alt="avatar"
                    className="object-cover w-16 h-16 rounded-full"
                />
                <small>{current?.name}</small>
            </div>
            <div>
                {memberSidebar.map((el) => (
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

export default memo(MemberSidebar);
