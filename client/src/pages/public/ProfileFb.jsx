import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/user/userSlice';
import path from '../../ultils/path';
import { toast } from 'react-toastify';

const ProfileFb = () => {
    const { token } = useParams(); //  Lấy token từ URL

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!token) {
            return;
        } else {
            dispatch(
                login({
                    isLoggedIn: true,
                    token: token,
                })
            );
            navigate(`/${path.HOME}`);
            toast.success('Login with Facebook successfuly !');
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"></div>
    );
};

export default ProfileFb;
