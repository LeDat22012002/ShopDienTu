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
        <div className="h-[38px] w-full bg-main flex items-center justify-center">
            <div className="flex items-center justify-between text-xs text-white w-main ">
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                {isLoggedIn ? (
                    <div className="flex items-center gap-4 text-sm">
                        <span>{`Wellcome, ${current?.name} `}</span>
                        <span
                            onClick={() => dispatch(logout())}
                            className="p-2 cursor-pointer hover:bg-gray-100 hover:rounded-full hover:text-main"
                        >
                            <RiLogoutCircleRLine size={20} />
                        </span>
                    </div>
                ) : (
                    <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>
                        Sign In or Create Account
                    </Link>
                )}
            </div>
        </div>
    );
};

export default memo(TopHeader);
