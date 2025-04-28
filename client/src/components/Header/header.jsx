import React, { Fragment, memo, useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';
import noCart from '../../assets/no-cart.png';
import icons from '../../ultils/icons';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/user/userSlice';
// import { showModalCart } from '../../store/app/appSlice';
import { formatMoney } from '../../ultils/helpers';
import { hidePreview } from '../../store/cart/cartSlice';

const Header = () => {
    const { current } = useSelector((state) => state.user);
    const { cartItems, showPreview } = useSelector((state) => state.cart);
    const { HiPhone, MdEmail, IoBagCheck, HiMiniUserCircle } = icons;
    const [isShowOption, setIsShowOption] = useState(false);
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
                <div className="relative group">
                    {/* Nút giỏ hàng + badge */}
                    <div
                        onClick={() => navigate(`/${path.CART}`)}
                        className="relative flex items-center justify-center gap-2 px-6 py-2 border-r cursor-pointer"
                    >
                        <IoBagCheck className="text-red-500" size={25} />
                        <span className="absolute z-50 flex items-center justify-center w-6 h-5 text-xs font-bold text-white bg-red-500 border border-gray-100 rounded-full shadow-md -top-0 right-2.5">
                            {cartItems?.length || 0}
                        </span>
                    </div>

                    {/* Dropdown giỏ hàng khi hover */}
                    <div
                        className={`absolute right-0 top-[25px] mt-3 w-[400px] bg-white rounded-xl shadow-xl z-50 flex-col animate-slide-up-sm border border-gray-200
                        ${
                            showCartPreview ? 'flex' : 'hidden'
                        } group-hover:flex`}
                    >
                        {cartItems?.length > 0 ? (
                            <>
                                <h3 className="flex items-center justify-center px-4 py-2 font-semibold text-main ">
                                    Sản phẩm đã thêm
                                </h3>
                                <div className="px-4 py-2 overflow-y-auto max-h-60">
                                    {/* Map cartItems tại đây */}
                                    {cartItems?.map((item) => (
                                        <div
                                            key={item?.product}
                                            className="flex items-center gap-2 py-2"
                                        >
                                            <img
                                                src={item?.thumb}
                                                alt="thumb"
                                                className="object-cover w-10 h-10"
                                            ></img>
                                            <div className="flex flex-col">
                                                <span className="truncate max-w-[300px] block">
                                                    {item.title}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span>{item?.color}</span>
                                                    <span className="text-sm font-semibold">
                                                        {formatMoney(
                                                            item?.price
                                                        )}
                                                        VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    onClick={() => navigate(`/${path.CART}`)}
                                    className="flex items-center justify-center p-2 rounded-xl"
                                >
                                    <button className="text-white bg-main hover:bg-red-700 cursor-pointer w-[200px] h-[40px] rounded-md ">
                                        Xem giỏ hàng
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center py-6">
                                <img
                                    src={noCart}
                                    alt="Giỏ hàng trống"
                                    className="w-[100px] h-[80px] object-cover"
                                />
                                <span className="text-sm text-gray-600">
                                    Chưa có sản phẩm
                                </span>
                            </div>
                        )}
                    </div>
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
                                    className="absolute z-50 w-[170px] mt-2 bg-white border border-gray-200 shadow-lg top-full left-4 rounded-xl"
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
