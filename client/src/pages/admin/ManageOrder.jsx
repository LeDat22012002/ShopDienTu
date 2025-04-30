import React, { useCallback, useEffect, useState } from 'react';
import { apiGetOrders, apiUpdateStatusOrder } from '../../apis';
import { formatMoney } from '../../ultils/helpers';
import moment from 'moment';
import UseDebouce from '../../hooks/useDebouce';
import icons from '../../ultils/icons';
import {
    createSearchParams,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CustomSelect, InputForm, Pagination } from '../../components';
import { statusOrders } from '../../ultils/contains';
import { toast } from 'react-toastify';
import { ORDER_STATUS } from '../../ultils/contains';
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
            return null; // Hoặc có thể trả về một icon mặc định nếu không có phương thức phù hợp
    }
};

const { FaRegEdit } = icons;

const ManageOrder = () => {
    const {
        register,
        formState: { errors },
        // handleSubmit,
        // reset,
        watch,
    } = useForm();

    const [orders, setOrders] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [note, setNote] = useState('');

    // update status

    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const queriesDebounce = UseDebouce(watch('q'), 800);
    const status = watch('status');
    // Api lấy ds sản phẩm
    const fetchOrders = async (params) => {
        const response = await apiGetOrders({
            ...params,
            limit: import.meta.env.VITE_LIMIT,
        });
        // console.log(response);
        if (response.success) {
            setCounts(response.counts);
            setOrders(response.dataOrder);
        }
    };

    useEffect(() => {
        if (queriesDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queriesDebounce }).toString(),
            });
        } else {
            navigate({
                pathname: location.pathname,
            });
        }
    }, [queriesDebounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);

        fetchOrders(searchParams);
    }, [params, update]);
    const handleSerchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString(),
        });
    };

    // Update Status
    const handleUpdateOrderStatus = async () => {
        if (!selectedStatus || !selectedOrder) return;
        const res = await apiUpdateStatusOrder(
            { status: selectedStatus, note },
            selectedOrder._id
        );
        if (res.success) {
            toast.success('Cập nhật trạng thái thành công');
            setIsModalOpen(false);
            setSelectedStatus('');
            setNote('');
            render();
        } else {
            toast.error('Cập nhật thất bại');
        }
    };

    return (
        <div className="relative w-full px-4">
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="relative w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
                        <h2 className="mb-4 text-xl font-semibold">
                            Cập nhật trạng thái đơn hàng
                        </h2>
                        <p className="mb-3">
                            Trạng thái hiện tại:
                            <span
                                className={`px-2 py-1 rounded text-white text-sm ${
                                    ORDER_STATUS[selectedOrder.status]?.bg
                                }`}
                            >
                                {ORDER_STATUS[selectedOrder.status]?.label}
                            </span>
                        </p>

                        <select
                            className="w-full px-3 py-2 mb-4 border rounded"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="" disabled>
                                Chọn trạng thái mới
                            </option>
                            {ORDER_STATUS[selectedOrder.status]?.nextStatus.map(
                                (status) => (
                                    <option key={status} value={status}>
                                        {ORDER_STATUS[status].label}
                                    </option>
                                )
                            )}
                        </select>

                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 mb-4 border rounded resize-none"
                            placeholder="Ghi chú (nếu có)..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedStatus('');
                                    setNote('');
                                }}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateOrderStatus}
                                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="w-full py-4 text-3xl font-semibold border-b border-gray-200">
                History Order
            </header>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col w-full gap-4 p-4">
                <div className="flex justify-end py-4">
                    <form className="w-[45%] grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <InputForm
                                id="q"
                                register={register}
                                errors={errors}
                                fullWith
                                placeholder="Search..."
                            />
                        </div>
                        <div className="flex items-center col-span-1">
                            <CustomSelect
                                options={statusOrders}
                                value={status}
                                onChange={(val) => handleSerchStatus(val)}
                                wrapClassname="w-full"
                            />
                        </div>
                    </form>
                </div>
                <table className="w-full overflow-hidden text-left border-collapse rounded-lg shadow-md">
                    <thead className="text-sm text-white uppercase bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-center w-[50px]">
                                #
                            </th>
                            <th className="px-4 py-2 text-center w-[300px]">
                                Product
                            </th>
                            <th className="px-4 py-2 text-center w-[150px]">
                                Total
                            </th>
                            <th className="px-4 py-2 text-center w-[180px]">
                                Status
                            </th>
                            <th className="px-4 py-2 text-center w-[140px]">
                                Method
                            </th>
                            <th className="px-4 py-2 text-center w-[140px]">
                                CreateAt
                            </th>
                            <th className="px-4 py-2 text-center w-[100px]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {orders?.map((el, index) => (
                            <tr
                                key={el?._id}
                                className="transition hover:bg-gray-100"
                            >
                                <td className="px-4 py-3 text-center">
                                    {(+params.get('page') > 1
                                        ? +params.get('page') - 1
                                        : 0) *
                                        import.meta.env.VITE_LIMIT +
                                        index +
                                        1}
                                </td>

                                <td className="py-3 text-center max-w-[300px]">
                                    <span className="flex flex-col gap-2 max-w-[300px] mx-auto">
                                        {el?.products?.map((item) => (
                                            <span
                                                key={item?._id}
                                                className="flex items-center gap-2"
                                            >
                                                <img
                                                    src={item?.thumb}
                                                    alt="thumb"
                                                    className="object-cover w-8 h-8 rounded-md"
                                                />
                                                <span className="flex flex-col text-left">
                                                    <span className="block text-sm truncate w-[200px] text-main">
                                                        {item?.title}
                                                    </span>
                                                    <span className="flex items-center gap-2 text-xs">
                                                        <span>Quantity:</span>
                                                        <span className="text-main">
                                                            {item?.count}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-2 text-xs">
                                                        <span>Color:</span>
                                                        <span className="text-main">
                                                            {item?.color}
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                        ))}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <span>{formatMoney(el?.total)} VNĐ</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded text-white text-sm ${
                                            ORDER_STATUS[el.status]?.bg
                                        }`}
                                    >
                                        {ORDER_STATUS[el.status]?.label}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <img
                                            src={getPaymentMethodIcon(
                                                el?.paymentMethod
                                            )}
                                            alt={el?.paymentMethod}
                                            className="object-contain w-6 h-6"
                                        />
                                        <span>{el?.paymentMethod}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span>
                                        {moment(el?.createdAt).format(
                                            'DD/MM/YYYY'
                                        )}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span
                                            onClick={() => {
                                                setSelectedOrder(el);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-blue-500 cursor-pointer hover:underline hover:text-blue-900"
                                        >
                                            <FaRegEdit size={20} />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="w-full mt-8 ">
                    <Pagination totalCount={counts} />
                </div>
            </div>
        </div>
    );
};

export default ManageOrder;
