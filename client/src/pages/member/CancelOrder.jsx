import moment from 'moment';
import React, { memo } from 'react';
import { formatMoney } from '../../ultils/helpers';

import { apiCancelOrderByUser } from '../../apis';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import momo from '../../assets/momo.png';
import vnpay from '../../assets/vnpay.png';
import paypal from '../../assets/paypal.png';
import cod from '../../assets/cod.png';
import zalopay from '../../assets/zalopay.png';

const getPaymentMethodIcon = (method) => {
    switch (method) {
        case 'cod':
            return cod;
        case 'momo':
            return momo;
        case 'vnpay':
            return vnpay;
        case 'zalopay':
            return zalopay;
        case 'paypal':
            return paypal;
        default:
            return null;
    }
};

const getStatusClass = (status) => {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
        case 'CONFIRMED':
            return 'bg-blue-100 text-blue-800';
        case 'SHIPPING':
            return 'bg-purple-100 text-purple-800';
        case 'COMPLETED':
            return 'bg-green-100 text-green-800';
        case 'CANCELLED':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const CancelOrder = ({ editStatus, render, setEditStatus }) => {
    // console.log(editStatus);
    const handleCancelOrder = async () => {
        Swal.fire({
            title: 'Oops!',
            text: 'Are you sure cancel this ? ',
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiCancelOrderByUser(editStatus?._id);
                if (response.success) {
                    toast.success(response.mess);
                    render();
                    setEditStatus(null);
                } else {
                    toast.error(response.mess);
                }
            }
        });
    };
    return (
        <div className="relative flex flex-col w-[100%] p-2  min-h-screen mx-auto bg-gray-100">
            {/* Header */}
            <div className="h-[75px] w-[100%] ml-2 z-10 border-b mx-auto border-gray-300 flex justify-between items-center ">
                <h1 className="w-5/6 text-sm font-bold">Detail Order</h1>
                <span
                    onClick={() => setEditStatus(null)}
                    className="w-1/6 text-base cursor-pointer text-main hover:underline "
                >
                    Back
                </span>
            </div>

            <div className=" md:h-[75px] w-[100%] ml-2 mx-auto " />

            <div className="w-[100%] ml-2 mx-auto grid grid-cols-1 gap-2 mt-2 md:grid-cols-2 lg:grid-cols-3 ">
                <div className="flex flex-col gap-1 p-5 bg-white rounded-sm shadow-sm">
                    <h3 className="text-gray-700 text-md mb-2font-semibold">
                        Trạng thái đơn hàng
                    </h3>
                    <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-sm w-[100px]
                            ${
                                editStatus?.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : editStatus?.status === 'CONFIRMED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : editStatus?.status === 'SHIPPING'
                                    ? 'bg-purple-100 text-purple-800'
                                    : editStatus?.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800'
                                    : editStatus?.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : ''
                            }
                        `}
                    >
                        {editStatus?.status}
                    </span>
                </div>

                {/* Thông tin giao hàng */}
                <div className="p-5 bg-white rounded-sm shadow-sm">
                    <h3 className="mb-2 font-semibold text-gray-700 text-md">
                        Thông tin giao hàng
                    </h3>
                    <p>
                        <span className="mr-2 font-medium">Người nhận:</span>
                        <span>{editStatus?.userReceives?.name}</span>
                    </p>
                    <p>
                        <span className="mr-2 font-medium">Số điện thoại:</span>
                        <span>{editStatus?.userReceives?.phone}</span>
                    </p>
                    <p>
                        <span className="mr-2 font-medium">Địa chỉ:</span>
                        <span>
                            {editStatus?.userReceives?.detail},
                            {editStatus?.userReceives?.ward},
                            {editStatus?.userReceives?.district},
                            {editStatus?.userReceives?.city},
                        </span>
                    </p>
                </div>

                {/* Thanh toán */}
                <div className="p-5 bg-white rounded-sm shadow-sm">
                    <h3 className="mb-2 font-semibold text-gray-700">
                        Thanh toán
                    </h3>
                    <p className="flex items-center gap-2">
                        <span className="font-medium ">Phương thức:</span>
                        <span className="flex items-center gap-2">
                            <img
                                src={getPaymentMethodIcon(
                                    editStatus?.paymentMethod
                                )}
                                alt={editStatus?.paymentMethod}
                                className="object-contain w-10 h-10"
                            />
                            {editStatus?.paymentMethod}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium">Trạng thái:</span>
                        <span className="inline-block px-2 py-1 text-sm font-medium text-red-600 rounded">
                            {editStatus?.isPaid
                                ? 'Đã thanh toán'
                                : ' Chưa thanh toán '}
                        </span>
                    </p>
                    {editStatus?.isPaid && (
                        <p>
                            <span className="font-medium">
                                Thời gian thanh toán :
                            </span>
                            <span className="inline-block px-2 py-1 text-sm font-medium text-red-600 rounded">
                                {moment(editStatus?.paidAt).format(
                                    'dddd, DD/MM/YYYY HH:mm'
                                )}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            <div className="grid w-[100%] ml-2 mx-auto grid-cols-1 gap-6 mt-2 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-sm shadow-sm">
                    <h3 className="mb-4 font-semibold text-md">Sản phẩm</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-500 border-b">
                                    <th className="py-2">Sản phẩm</th>
                                    <th className="py-2">Color</th>
                                    <th className="py-2 text-center">
                                        Số lượng
                                    </th>
                                    <th className="py-2 text-right">
                                        Tổng tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {editStatus?.products?.map((el) => (
                                    <tr key={el?._id} className="border-b">
                                        <td className="flex items-center gap-3 py-3">
                                            <img
                                                src={el?.thumb}
                                                alt="thumb"
                                                className="object-cover w-8 h-8 rounded md:w-12 md:h-12"
                                            />
                                            <span className="block max-w-[100px] text-sm md:max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                                                {el?.title}
                                            </span>
                                        </td>
                                        <td className="py-3">{el?.color}</td>
                                        <td className="py-3 text-center">
                                            {el?.count}
                                        </td>
                                        <td className="py-3 text-right">
                                            {formatMoney(el?.price) + ' VNĐ'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tổng tiền */}
                    <div className="mt-6 text-right">
                        <p className="m-2 text-sm">
                            Tạm tính:
                            <span className="font-medium">
                                {formatMoney(editStatus?.itemsPrice) + ' VNĐ'}
                            </span>
                        </p>
                        <p className="mr-2 text-sm">
                            Promotion:
                            <span className="font-medium">
                                {formatMoney(editStatus?.discountAmount) +
                                    ' VNĐ'}
                            </span>
                        </p>
                        <p className="mt-1 font-bold text-red-600 text-md md:text-xl">
                            Tổng cộng: {formatMoney(editStatus?.total) + ' VNĐ'}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-sm shadow-sm">
                    {editStatus?.status !== 'PENDING' && (
                        <>
                            <h3 className="mb-4 font-semibold text-md md:text-lg">
                                Lịch sử trạng thái
                            </h3>
                            <div className="space-y-4">
                                {editStatus?.statusHistory?.map((item) => (
                                    <div
                                        key={item?._id}
                                        className="pl-4 border-l-4 border-blue-500"
                                    >
                                        <span
                                            className={`inline-block px-3 py-1 text-sm font-medium rounded-sm ${getStatusClass(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>

                                        <p className="text-sm text-gray-600 md:text-md">
                                            {item.note}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {moment(item.updatedAt).format(
                                                'DD/MM/YYYY HH:mm'
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Nút huỷ đơn nếu đang ở trạng thái PENDING */}
                    {(editStatus?.status === 'PENDING' ||
                        editStatus?.status === 'COMPLETED') && (
                        <div className="flex flex-col gap-4 p-4 mt-6 border border-yellow-200 rounded-lg bg-yellow-50">
                            <div className="flex items-start gap-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 mt-1 text-yellow-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                                    />
                                </svg>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>
                                        <strong>Điều kiện hủy đơn:</strong> Đơn
                                        hàng phải ở trạng thái{' '}
                                        <span className="font-semibold text-blue-600">
                                            chờ xử lý
                                        </span>{' '}
                                        hoặc{' '}
                                        <span className="font-semibold text-green-600">
                                            hoàn thành
                                        </span>
                                        .
                                    </li>
                                    <li>
                                        <strong>Lưu ý:</strong> Vui lòng quay
                                        video khi mở hàng. Nếu sản phẩm bị lỗi
                                        kỹ thuật, bạn có thể hoàn trả trong vòng{' '}
                                        <span className="font-semibold">
                                            7 ngày
                                        </span>
                                        .
                                    </li>
                                </ul>
                            </div>

                            <div className="text-right">
                                <button
                                    onClick={handleCancelOrder}
                                    className="px-5 py-2 text-sm font-semibold text-white transition duration-200 bg-red-500 rounded-md hover:bg-red-600"
                                >
                                    Huỷ đơn hàng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(CancelOrder);
