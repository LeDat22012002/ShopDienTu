import moment from 'moment';
import React, { memo } from 'react';
import { formatMoney } from '../../ultils/helpers';

import { apiCancelOrderByUser } from '../../apis';
import { toast } from 'react-toastify';

const CancelOrder = ({ editStatus, render, setEditStatus }) => {
    console.log(editStatus);
    const handleCancelOrder = async () => {
        const response = await apiCancelOrderByUser(editStatus?._id);
        if (response.success) {
            toast.success(response.mess);
            render();
            setEditStatus(null);
        } else {
            toast.error(response.mess);
        }
    };
    return (
        <div className="relative flex flex-col w-full min-h-screen p-4 bg-gray-100">
            {/* Header */}
            <div className="h-[75px] fixed top-0 left-[270px] right-10 z-10 bg-gray-100 border-b border-gray-300 flex justify-between items-center px-6">
                <h1 className="text-2xl font-bold">Detail Order</h1>
                <span
                    onClick={() => setEditStatus(null)}
                    className="text-base cursor-pointer text-main hover:underline"
                >
                    Back
                </span>
            </div>

            <div className="h-[75px] w-full" />

            {/* Order Info */}
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Trạng thái đơn hàng */}
                <div className="p-5 bg-white shadow-sm rounded-xl">
                    <h3 className="mb-2 font-semibold text-gray-700">
                        Trạng thái đơn hàng
                    </h3>
                    <span className="inline-block px-3 py-1 text-sm font-medium text-red-600 rounded">
                        {editStatus?.status}
                    </span>
                </div>

                {/* Thông tin giao hàng */}
                <div className="p-5 bg-white shadow-sm rounded-xl">
                    <h3 className="mb-2 font-semibold text-gray-700">
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
                            {editStatus?.userReceives?.city},
                            {editStatus?.userReceives?.district},
                            {editStatus?.userReceives?.ward},
                            {editStatus?.userReceives?.detail},
                        </span>
                    </p>
                </div>

                {/* Thanh toán */}
                <div className="p-5 bg-white shadow-sm rounded-xl">
                    <h3 className="mb-2 font-semibold text-gray-700">
                        Thanh toán
                    </h3>
                    <p>
                        <span className="mr-2 font-medium">Phương thức:</span>
                        <span>{editStatus?.paymentMethod}</span>
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

            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                {/* LEFT: Danh sách sản phẩm */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                    <h3 className="mb-4 text-lg font-semibold">Sản phẩm</h3>
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
                                                className="object-cover w-12 h-12 rounded"
                                            />
                                            <span className="block max-w-[200px] truncate whitespace-nowrap overflow-hidden">
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
                        <p className="mt-1 text-lg font-bold text-red-600">
                            Tổng cộng: {formatMoney(editStatus?.total) + ' VNĐ'}
                        </p>
                    </div>
                </div>

                {/* RIGHT: Lịch sử trạng thái đơn hàng */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                    {editStatus?.status !== 'PENDING' && (
                        <>
                            <h3 className="mb-4 text-lg font-semibold">
                                Lịch sử trạng thái
                            </h3>
                            <div className="space-y-4">
                                {editStatus?.statusHistory?.map((item) => (
                                    <div
                                        key={item?._id}
                                        className="pl-4 border-l-4 border-blue-500"
                                    >
                                        <p className="text-sm font-medium text-blue-600">
                                            {item.status}
                                        </p>
                                        <p className="text-gray-600">
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
