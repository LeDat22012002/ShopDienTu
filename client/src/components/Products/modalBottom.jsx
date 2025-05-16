import { memo } from 'react';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { GiPc } from 'react-icons/gi';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import path from '../../ultils/path';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/user/userSlice';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ModalBottom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { current } = useSelector((state) => state.user);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isShowOption, setIsShowOption] = useState(false);
    const profileRef = useRef();

    useEffect(() => {
        let timeout;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            setLastScrollY(currentScrollY);
            clearTimeout(timeout);
            timeout = setTimeout(() => setVisible(true), 1500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);
    // profile
    useEffect(() => {
        if (!isShowOption) return;

        const handleClickOutOption = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsShowOption(false);
            }
        };

        document.addEventListener('click', handleClickOutOption);

        return () => {
            document.removeEventListener('click', handleClickOutOption);
        };
    }, [isShowOption]);
    const handleLogout = () => {
        dispatch(logout());
        setIsShowOption(false);
    };

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[100] flex justify-center transition-transform duration-300 lg:hidden ${
                visible ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            <div className="w-full h-[70px] py-3 text-sm text-center bg-main border text-gray-900 border-t-gray-200 shadow-md">
                <div className="flex items-center justify-center gap-9 md:gap-35">
                    <Link
                        to={`/`}
                        className="flex flex-col items-center justify-center"
                    >
                        <FaHome size={20} />
                        <span>Trang chủ</span>
                    </Link>
                    <Link
                        to={`/${path.BUILD_PC}`}
                        className="flex flex-col items-center justify-center"
                    >
                        <GiPc size={20} />
                        <span>Build PC</span>
                    </Link>
                    <div className="flex flex-col items-center justify-center">
                        <RiCustomerService2Fill size={20} />
                        <span>Tư vấn</span>
                    </div>

                    <div
                        ref={profileRef}
                        className="relative flex flex-col items-center justify-center"
                        id="profile"
                        onClick={() => {
                            if (current) {
                                setIsShowOption((prev) => !prev);
                            } else {
                                navigate(`/${path.LOGIN}`);
                            }
                        }}
                    >
                        {current?.avatar ? (
                            <img
                                src={current.avatar}
                                alt="avatar"
                                className="w-[28px] h-[28px] rounded-full object-cover"
                            />
                        ) : (
                            <FaUser size={20} />
                        )}

                        {current?.name ? (
                            <span>{current?.name}</span>
                        ) : (
                            <span>Account</span>
                        )}
                        {current && isShowOption && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute bottom-full mb-2 z-50 w-[160px] bg-white border border-gray-200 shadow-lg right-0 rounded-md text-sm"
                            >
                                <Link
                                    to={`/${path.MEMBER}/${path.PERSONAL}`}
                                    onClick={() => setIsShowOption(false)}
                                    className="block px-4 py-2 text-left text-gray-700 hover:bg-sky-100"
                                >
                                    Personal
                                </Link>
                                {current.role === 'admin' && (
                                    <Link
                                        to={`/${path.ADMIN}/${path.DASHBOAD}`}
                                        onClick={() => setIsShowOption(false)}
                                        className="block px-4 py-2 text-gray-700 hover:bg-sky-100"
                                    >
                                        Admin workspace
                                    </Link>
                                )}
                                <button
                                    onClick={() => handleLogout()}
                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ModalBottom);
