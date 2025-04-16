import React, { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { InputField, Button, Loading } from '../../components';
import trongdong from '../../assets/trongdong.png';
import {
    apiRegister,
    apiLogin,
    apiForgotPassword,
    apiFinalRegister,
} from '../../apis/user';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import path from '../../ultils/path';
import Swal from 'sweetalert2';
import { login } from '../../store/user/userSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import icons from '../../ultils/icons';
import { validate } from '../../ultils/helpers';
import { showModal } from '../../store/app/appSlice';

const Login = () => {
    const { FcGoogle, FaFacebook } = icons;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    console.log(searchParams.get('redirect'));
    // const location = useLocation();
    // console.log(location);
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
    });
    const [token, setToken] = useState('');
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const [isRegiter, setIsRegiter] = useState(false);
    // const [isResetPassword, setIsResetPassword] = useState(false);

    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            name: '',
            phone: '',
        });
    };
    const [email, setEmail] = useState('');
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email });
        // console.log(response);
        if (response.success) {
            toast.success(response.mess);
        } else {
            toast.error(response.mess);
        }
    };

    //SUBMIT

    useEffect(() => {
        resetPayload();
    }, [isRegiter]);
    const handleForgotPasswords = () => {
        setIsForgotPassword(false);
        setEmail('');
    };

    const handleVerifiedIngister = () => {
        setIsVerifiedEmail(false);
        setToken('');
    };
    const handleSubmit = useCallback(async () => {
        const { name, phone, ...data } = payload;
        const invalids = isRegiter
            ? validate(payload, setInvalidFields)
            : validate(data, setInvalidFields);
        if (invalids === 0) {
            if (isRegiter) {
                dispatch(
                    showModal({ isShowModal: true, modalChildren: <Loading /> })
                );
                const response = await apiRegister(payload);
                dispatch(
                    showModal({ isShowModal: false, modalChildren: null })
                );
                if (response.success) {
                    setIsVerifiedEmail(true);
                } else {
                    Swal.fire('Oops!', response.mess, 'error');
                }
            } else {
                const rs = await apiLogin(data);
                if (rs.success) {
                    dispatch(
                        login({
                            isLoggedIn: true,
                            token: rs.accessToken,
                            userData: rs.userData,
                        })
                    );
                    searchParams.get('redirect')
                        ? navigate(searchParams.get('redirect'))
                        : navigate(`/${path.HOME}`);
                    toast.success('Login with account successfully !');
                } else {
                    Swal.fire('Oops!', rs.mess, 'error');
                }
            }
        }
    }, [payload, isRegiter]);

    const finalRegister = async () => {
        const response = await apiFinalRegister(token);
        if (response.success) {
            Swal.fire('Congratulation', response.mess, 'success').then(() => {
                setIsRegiter(false);
                setIsVerifiedEmail(false);
                resetPayload();
                setToken('');
            });
        } else {
            Swal.fire('Oops!', response.mess, 'error');
        }
    };

    const handleLogin = () => {
        window.open('http://localhost:5000/api/user/google', '_self');
    };
    const handleFacebookLogin = () => {
        window.open('http://localhost:5000/api/user/facebook', '_self');
    };
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-900">
            <img
                className="absolute z-0 object-center w-[1200px] h-[1200px] animate-spin-slow opacity-10"
                src={trongdong}
                alt="trongdong"
            ></img>
            {isVerifiedEmail && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-80">
                    <img
                        className="absolute z-0 object-center w-[1200px] h-[1200px] animate-spin-slow opacity-40"
                        src={trongdong}
                        alt="trongdong"
                    ></img>
                    <div className="relative flex flex-col items-center justify-center w-[400px] min-h-[450px] bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
                        <h4 className="text-[14px] font-semibold text-center text-gray-800">
                            We sent code your Email. Please check your Email and
                            enter your code !
                        </h4>

                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border rounded-sm outline-none placeholder:text-sm placeholder:italic"
                            placeholder="Please enter your code"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />

                        <div className="flex items-center justify-between w-full gap-4 mt-8">
                            <button
                                onClick={finalRegister}
                                className="w-full px-4 py-2 text-white transition-all bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Gửi yêu cầu
                            </button>
                            <button
                                onClick={handleVerifiedIngister}
                                className="w-full px-4 py-2 text-white transition-all bg-red-500 rounded-lg shadow-md hover:bg-red-600"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isForgotPassword && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-80">
                    <img
                        className="absolute z-0 object-center w-[1200px] h-[1200px] animate-spin-slow opacity-40"
                        src={trongdong}
                        alt="trongdong"
                    ></img>
                    <div className="relative flex flex-col items-center justify-center w-[400px] min-h-[450px] bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
                        <h2 className="text-2xl font-semibold text-center text-gray-800">
                            Nhập Email của bạn
                        </h2>

                        <input
                            type="text"
                            id="email"
                            className="w-full px-4 py-2 mt-2 border rounded-sm outline-none placeholder:text-sm placeholder:italic"
                            placeholder="Exp: email@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="flex items-center justify-between w-full gap-4 mt-8">
                            <button
                                onClick={handleForgotPassword}
                                className="w-full px-4 py-2 text-white transition-all bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Gửi yêu cầu
                            </button>
                            <button
                                onClick={handleForgotPasswords}
                                className="w-full px-4 py-2 text-white transition-all bg-red-500 rounded-lg shadow-md hover:bg-red-600"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 bg-white rounded-md min-w-[500px] flex flex-col items-center shadow-lg z-10">
                <h1 className="text-[28px] font-semibold text-main mb-8">
                    {isRegiter ? 'Regiter' : 'Login'}
                </h1>
                {isRegiter && (
                    <div className="flex flex-col items-center w-full gap-2">
                        <InputField
                            value={payload.name}
                            setValue={setPayload}
                            nameKey="name"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            fullWith
                        />

                        <InputField
                            value={payload.phone}
                            setValue={setPayload}
                            nameKey="phone"
                            type="phone"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            fullWith
                        />
                    </div>
                )}

                <InputField
                    value={payload.email}
                    setValue={setPayload}
                    nameKey="email"
                    type="email"
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    fullWith
                />

                <InputField
                    value={payload.password}
                    setValue={setPayload}
                    nameKey="password"
                    type="password"
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    fullWith
                />
                <Button handleOnclick={handleSubmit} fw>
                    {isRegiter ? 'Regiter' : 'Login'}
                </Button>
                <div className="flex w-full gap-4 mt-2 mb-2">
                    <button
                        onClick={handleLogin}
                        className="flex items-center justify-center w-full p-2 text-white bg-red-500 rounded"
                    >
                        <FcGoogle className="mr-2" /> Google
                    </button>
                    <button
                        onClick={handleFacebookLogin}
                        className="flex items-center justify-center w-full p-2 text-white bg-blue-600 rounded"
                    >
                        <FaFacebook className="mr-2" /> Facebook
                    </button>
                </div>
                <div className="flex items-center justify-between w-full my-2 text-sm ">
                    {!isRegiter && (
                        <span
                            onClick={() => setIsForgotPassword(true)}
                            className="text-blue-500 cursor-pointer hover:underline"
                        >
                            Fogot your Account ?
                        </span>
                    )}
                    {!isRegiter && (
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => setIsRegiter(true)}
                        >
                            Create Account
                        </span>
                    )}
                    {isRegiter && (
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => setIsRegiter(false)}
                        >
                            Go Login
                        </span>
                    )}
                </div>
                <Link
                    className="text-blue-500 cursor-pointer hover:underline"
                    to={`/${path.HOME}`}
                >
                    Go home ?
                </Link>
            </div>
        </div>
    );
};

export default Login;
