import React, { Fragment, memo } from 'react';
import Logo from '../../assets/logo.png';
import icons from '../../ultils/icons';
import { Link } from 'react-router-dom';
import path from '../../ultils/path';
import { useSelector } from 'react-redux';

const Header = () => {
    const { current } = useSelector((state) => state.user);
    const { HiPhone, MdEmail, IoBagCheck, HiMiniUserCircle } = icons;
    return (
        <div className=" w-main flex justify-between h-[110px] py-[35px]  ">
            <Link to={`/${path.HOME}`}>
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-[234px] object-contain"
                ></img>
            </Link>
            <div className="flex text-[13px]">
                <div className="flex flex-col items-center px-6 border-r">
                    <span className="flex items-center gap-4">
                        <HiPhone color="red" />
                        <span className="font-semibold">(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className="flex flex-col items-center px-6 border-r">
                    <span className="flex items-center gap-4">
                        <MdEmail color="red" />
                        <span className="font-semibold">
                            support@tadathemes.com
                        </span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                {current && (
                    <Fragment>
                        <div className="flex items-center justify-center gap-2 px-6 border-r cursor-pointer ">
                            <IoBagCheck color="red" />
                            <span>0 Item (s)</span>
                        </div>
                        <Link
                            to={
                                current?.role === 'admin'
                                    ? `/${path.ADMIN}/${path.DASHBOAD}`
                                    : `/${path.MEMBER}/${path.PERSONAL}`
                            }
                            className="flex items-center justify-center gap-2 px-6 cursor-pointer "
                        >
                            <HiMiniUserCircle size={24} />
                            <span>Profile</span>
                        </Link>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default memo(Header);
