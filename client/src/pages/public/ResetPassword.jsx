import React from 'react';
import { useState } from 'react';
import { Button } from '../../components';
import { useParams } from 'react-router-dom';
import { apiResetPassword } from '../../apis/user';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import Swal from 'sweetalert2';
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();
    const handleResetPassword = async () => {
        const response = await apiResetPassword({ token, password });
        if (response.success) {
            toast.success(response.mess);

            Swal.fire('Congratulation', response.mess, 'success').then(() => {
                navigate(`/${path.LOGIN}`);
            });
        } else {
            toast.error(response.mess);
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="p-6 bg-white rounded-xl shadow-xl w-[400px] animate-fade-in">
                <h2 className="mb-4 text-2xl font-bold text-center text-gray-700">
                    🔒 Đặt lại mật khẩu
                </h2>
                <p className="mb-4 text-sm text-center text-gray-500">
                    Hãy nhập mật khẩu mới của bạn để tiếp tục.
                </p>
                <label htmlFor="password" className="font-medium text-gray-600">
                    Nhập mật khẩu mới:
                </label>
                <input
                    type="password"
                    id="password"
                    className="w-full p-3 mt-2 transition duration-200 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-0"
                    placeholder="Nhập mật khẩu mới..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleResetPassword}
                        className="px-5 py-3 font-semibold text-white transition-all duration-300 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg"
                    >
                        ✅ Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
