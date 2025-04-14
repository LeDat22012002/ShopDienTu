import React, { Fragment, memo, useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';
import icons from '../../ultils/icons';
import { Link } from 'react-router-dom';
import path from '../../ultils/path';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/user/userSlice';
import { showModalCart } from '../../store/app/appSlice';

const Header = () => {
    const { current } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);
    const { HiPhone, MdEmail, IoBagCheck, HiMiniUserCircle } = icons;
    const [isShowOption, setIsShowOption] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        const handleClickOutOption = (e) => {
            const profile = document.getElementById('profile');
            if (!profile?.contains(e.target)) {
                setIsShowOption(false);
            }
        };
        document.addEventListener('click', handleClickOutOption);

        return () => {
            document.removeEventListener('click', handleClickOutOption);
        };
    }, []);
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
                <div
                    onClick={() => dispatch(showModalCart())}
                    className="flex items-center justify-center gap-2 px-6 border-r cursor-pointer "
                >
                    <IoBagCheck color="red" />
                    <span>{cartItems?.length || 0} (s)</span>
                </div>
                {current && (
                    <Fragment>
                        <div
                            onClick={() => setIsShowOption((prev) => !prev)}
                            id="profile"
                            className="relative flex items-center justify-center gap-2 px-6 cursor-pointer "
                        >
                            {current?.avatar ? (
                                <img
                                    src={current?.avatar}
                                    alt="avata"
                                    className="w-[30px] h-[30px] rounded-full object-cover"
                                ></img>
                            ) : (
                                <HiMiniUserCircle size={30} />
                            )}
                            <span>Profile</span>
                            {isShowOption && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute z-50 w-56 mt-2 bg-white border border-gray-200 shadow-lg top-full left-4 rounded-xl"
                                >
                                    <Link
                                        to={`/${path.MEMBER}/${path.PERSONAL}`}
                                        className="block px-4 py-2 text-sm text-gray-700 transition-all hover:bg-sky-100"
                                    >
                                        Personal
                                    </Link>
                                    {current.role === 'admin' && (
                                        <Link
                                            to={`/${path.ADMIN}/${path.DASHBOAD}`}
                                            className="block px-4 py-2 text-sm text-gray-700 transition-all hover:bg-sky-100"
                                        >
                                            Admin workspace
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => dispatch(logout())}
                                        className="w-full px-4 py-2 text-sm text-left text-red-600 transition-all hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default memo(Header);
