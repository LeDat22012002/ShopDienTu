import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../components';
const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const resultCode = queryParams.get('resultCode');

        // Momo trả resultCode === '0' là thanh toán thành công
        if (resultCode === '0') {
            setStatus('success');
        } else {
            setStatus('fail');
        }
    }, [location]);

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 text-center bg-white shadow-xl rounded-2xl">
                {status === 'success' ? (
                    <>
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <h2 className="text-2xl font-bold text-green-600">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-gray-600">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi
                            nhận.
                        </p>
                    </>
                ) : status === 'fail' ? (
                    <>
                        <XCircle className="w-16 h-16 mx-auto text-red-500" />
                        <h2 className="text-2xl font-bold text-red-600">
                            Thanh toán thất bại!
                        </h2>
                        <p className="text-gray-600">
                            Đã có lỗi xảy ra trong quá trình thanh toán. Vui
                            lòng thử lại.
                        </p>
                    </>
                ) : (
                    <p>Đang xử lý...</p>
                )}

                <Button handleOnclick={() => navigate('/')} className="w-full">
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
