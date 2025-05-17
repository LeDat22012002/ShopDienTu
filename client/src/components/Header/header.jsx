import React, { Fragment, memo, useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';
import avatarDefault from '../../assets/avt1.png';
import noCart from '../../assets/no-cart.png';
import icons from '../../ultils/icons';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/user/userSlice';
// import { showModalCart } from '../../store/app/appSlice';
import { formatMoney } from '../../ultils/helpers';
import { hidePreview } from '../../store/cart/cartSlice';
import { ModalMobile, Search } from '..';
import { HiMenu } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';

const Header = () => {
    const { current } = useSelector((state) => state.user);
    const { cartItems, showPreview } = useSelector((state) => state.cart);
    const { IoBagCheck, HiMiniUserCircle, FaSearch } = icons;
    const [isShowOption, setIsShowOption] = useState(false);
    const [showModalMobile, setShowModalMobile] = useState(false);
    // console.log('dat', isShowOption);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Tự động hiển thị giỏ hàng
    const [showCartPreview, setShowCartPreview] = useState(false);

    useEffect(() => {
        if (showPreview) {
            const delayTimeout = setTimeout(() => {
                setShowCartPreview(true);

                const hideTimeout = setTimeout(() => {
                    setShowCartPreview(false);
                    dispatch(hidePreview());
                }, 3000); // 3s hiện giỏ hàng

                // Dọn timeout khi component unmount hoặc showPreview đổi
                return () => clearTimeout(hideTimeout);
            }, 1000); // Delay 2s mới hiện giỏ hàng

            return () => clearTimeout(delayTimeout);
        }
    }, [showPreview, dispatch]);

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
        <div className="w-full bg-white ">
            <div className="flex items-center justify-center w-full mx-auto lg:w-main ">
                <div className="flex items-center w-1/3 ">
                    <div
                        className="block border-white lg:hidden ml-2.5 "
                        onClick={() => setShowModalMobile(true)}
                    >
                        <HiMenu size={28} />
                    </div>

                    {/* Logo */}
                    <Link to={`/${path.HOME}`} className="hidden lg:block ">
                        <img
                            src={Logo}
                            alt="Logo"
                            className=" lg:w-[234px] object-contain "
                        />
                    </Link>
                </div>

                {/* Search */}
                <div className="flex w-2/3">
                    <Search />
                </div>

                <div className="relative flex items-center justify-end w-1/3 gap-4 lg:justify-center ">
                    <div className="relative flex mr-2.5 lg:ml-4 group ">
                        <div
                            onClick={() => navigate(`/${path.CART}`)}
                            className="relative flex items-center justify-center md:ml-[40px] gap-2 px-3 py-2 cursor-pointer"
                        >
                            <FaShoppingCart className="text-red-500 text-[25px] lg:text-[30px]" />
                            <span className="absolute z-29 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border border-gray-100 rounded-full shadow-md -top-1 right-1.5">
                                {cartItems?.length || 0}
                            </span>
                        </div>
                        <div
                            className={`absolute w-0 h-0 top-[35px] right-4 border-b-9 border-l-9 border-r-9 
                                border-l-transparent border-r-transparent animate-slide-up-sm z-50 border-b-gray-100 
                                ${
                                    showCartPreview ? 'flex' : 'hidden'
                                } sm:group-hover:flex`}
                        />

                        <div
                            className={`absolute right-0 top-[35px] mt-2 w-[300px] bg-white rounded-md shadow-xl z-48 
                                flex-col animate-slide-up-sm border border-gray-200 
                                ${
                                    showCartPreview ? 'flex' : 'hidden'
                                } sm:group-hover:flex`}
                        >
                            {cartItems?.length > 0 ? (
                                <>
                                    <h3 className="flex items-center justify-center px-4 py-2 font-semibold text-main ">
                                        Sản phẩm đã thêm
                                    </h3>
                                    <div className="px-4 py-2 overflow-y-auto max-h-60">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item.product}
                                                className="flex items-center gap-2 py-2"
                                            >
                                                <img
                                                    src={item.thumb}
                                                    alt="thumb"
                                                    className="object-cover w-10 h-10"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="truncate max-w-[200px] block text-sm">
                                                        {item.title}
                                                    </span>
                                                    <div className="flex flex-col text-xs">
                                                        <span>
                                                            {item.color}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {formatMoney(
                                                                item.price
                                                            )}{' '}
                                                            VNĐ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        onClick={() =>
                                            navigate(`/${path.CART}`)
                                        }
                                        className="flex items-center justify-center p-2"
                                    >
                                        <button className="text-white bg-main hover:bg-red-700 cursor-pointer w-[160px] h-[36px] rounded-md text-sm">
                                            Xem giỏ hàng
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center py-6">
                                    <img
                                        src={noCart}
                                        alt="Giỏ hàng trống"
                                        className="w-[80px] h-[60px] object-cover"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Chưa có sản phẩm
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        id="profile"
                        onClick={() => {
                            if (current) {
                                setIsShowOption((prev) => !prev);
                            } else {
                                navigate(`/${path.LOGIN}`);
                            }
                        }}
                        className="relative items-center justify-center hidden gap-2 px-3 cursor-pointer lg:flex w-[100px] h-[50px] bg-gray-50 border border-red-100 rounded-sm shadow-amber-50 "
                    >
                        {current ? (
                            <img
                                src={current?.avatar || avatarDefault}
                                alt="avatar"
                                className="w-[30px] h-[30px] rounded-full object-cover"
                            />
                        ) : (
                            <div>
                                <FaUser size={26} />
                            </div>
                        )}
                        {current?.name ? (
                            <span className="hidden text-[14px] sm:block">
                                {current?.name}
                            </span>
                        ) : (
                            <span className="hidden text-[14px] sm:block">
                                Register Login
                            </span>
                        )}

                        {isShowOption && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute z-50 w-[160px] mt-2 bg-white border border-gray-200 shadow-lg top-full left-2 rounded-sm text-sm"
                            >
                                <Link
                                    to={`/${path.MEMBER}/${path.PERSONAL}`}
                                    className="block px-4 py-2 text-gray-700 hover:bg-sky-100"
                                >
                                    Personal
                                </Link>
                                {current?.role === 'admin' && (
                                    <Link
                                        to={`/${path.ADMIN}/${path.DASHBOAD}`}
                                        className="block px-4 py-2 text-gray-700 hover:bg-sky-100"
                                    >
                                        Admin workspace
                                    </Link>
                                )}
                                <button
                                    onClick={() => dispatch(logout())}
                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <>
                {/* Overlay - z-40 */}
                {showModalMobile && (
                    <div
                        className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40"
                        onClick={() => setShowModalMobile(false)}
                    ></div>
                )}

                {/* Sidebar - z-50 */}
                {showModalMobile && (
                    <div className="fixed top-10 left-0 w-[81%] md:w-[75%] h-full bg-white z-50 shadow-lg animate-slide-in">
                        <ModalMobile
                            onClose={() => setShowModalMobile(false)}
                        />
                    </div>
                )}
            </>
        </div>
    );
};

export default memo(Header);
