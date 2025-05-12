import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { apiGetUserDetails } from '../../apis/user'; // Import API
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/user/userSlice';
import path from '../../ultils/path';
import { toast } from 'react-toastify';
// import { getCurent } from '../../store/user/asyncActions';

const Profile = () => {
    const { token } = useParams(); //  Lấy token từ URL
    // console.log(token);
    // const [user, setUser] = useState(null);
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
            toast.success('Login with Google successfuly !');
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"></div>
    );
};

export default Profile;
