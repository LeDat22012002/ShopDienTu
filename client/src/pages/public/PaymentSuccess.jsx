import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../../components';
import path from '../../ultils/path';
const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const resultCode = queryParams.get('resultCode');

        if (resultCode === '0') {
            setStatus('success');
            triggerConfetti(); // Bắn pháo hoa khi thành công
        } else {
            setStatus('fail');
        }
    }, [location]);

    const triggerConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 1000,
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2,
                },
            });
        }, 250);
    };

    return (
        <div className="flex items-center justify-center p-2 mx-auto ">
            <div className="w-full p-8 space-y-6 text-center bg-white shadow-xl rounded-2xl">
                {status === 'success' ? (
                    <>
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <h2 className="font-bold text-green-600 text-md lg:text-2xl">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-gray-600">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi
                            nhận.
                        </p>
                        <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-center">
                            <button
                                onClick={() => navigate(`/${path.PRODUCTS}`)}
                                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Tiếp tục mua hàng
                            </button>
                            <button
                                onClick={() =>
                                    navigate(
                                        `/${path.MEMBER}/${path.HISTORY_ORDER}`
                                    )
                                }
                                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Xem đơn hàng của tôi
                            </button>
                        </div>
                    </>
                ) : status === 'fail' ? (
                    <>
                        <XCircle className="w-16 h-16 mx-auto text-red-500" />
                        <h2 className="font-bold text-red-600  text-md lg:text-2xl">
                            Thanh toán thất bại!
                        </h2>
                        <p className="text-gray-600">
                            Đã có lỗi xảy ra trong quá trình thanh toán. Vui
                            lòng thử lại.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 mt-6 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                        >
                            Quay về trang chủ
                        </button>
                    </>
                ) : (
                    <p>Đang xử lý...</p>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
