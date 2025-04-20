import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
const OrderSuccess = () => {
    const navigate = useNavigate();
    useEffect(() => {
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

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

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

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold text-green-600">
                Thanh toán thành công!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/${path.PRODUCTS}`)}
                    className="px-6 py-2 mt-6 text-white transition bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
                >
                    Tiếp tục mua hàng
                </button>
                <button
                    onClick={() =>
                        navigate(`/${path.MEMBER}/${path.HISTORY_ORDER}`)
                    }
                    className="px-6 py-2 mt-6 text-white transition bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                    Xem đơn hàng của tôi
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
