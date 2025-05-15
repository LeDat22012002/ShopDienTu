import React from 'react';
import { memo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import { getCurent } from '../../store/user/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import icons from '../../ultils/icons';
import { logout, clearMessage } from '../../store/user/userSlice';
import Swal from 'sweetalert2';
const TopHeader = () => {
    const { RiLogoutCircleRLine } = icons;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, current, mess } = useSelector((state) => state.user);
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) {
                dispatch(getCurent());
            }
        }, 100);
        return () => {
            clearTimeout(setTimeoutId);
        };
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (mess)
            Swal.fire('Oops!', mess, 'info').then(() => {
                dispatch(clearMessage());
                navigate(`/${path.LOGIN}`);
            });
    }, [mess]);
    return (
        <div className="h-[38px] w-full bg-main flex items-center justify-center px-4">
            <div className="flex items-center justify-between text-white w-full lg:w-main text-[10px] lg:text-[12px] ">
                <span className="sm:block"></span>

                {/* Right side */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-[12px]">
                        <span className=" sm:inline">{`Welcome, ${current?.name}`}</span>
                        <span
                            onClick={() => dispatch(logout())}
                            className="p-1 cursor-pointer sm:p-2 hover:bg-gray-100 hover:rounded-full hover:text-main"
                        >
                            <RiLogoutCircleRLine
                                size={18}
                                className="sm:size-5"
                            />
                        </span>
                    </div>
                ) : (
                    <Link
                        className="hover:text-gray-200 text-[11px] sm:text-sm"
                        to={`/${path.LOGIN}`}
                    >
                        Sign In or Create Account
                    </Link>
                )}
            </div>
        </div>
    );
};

export default memo(TopHeader);
