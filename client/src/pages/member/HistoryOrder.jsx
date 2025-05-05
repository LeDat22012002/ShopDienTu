import React, { useCallback, useEffect, useState } from 'react';
import { apiGetOrderByUser } from '../../apis';
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
import { CancelOrder } from '.';
import { statusOrders } from '../../ultils/contains';
import momo from '../../assets/momo.png';
import vnpay from '../../assets/vnpay.png';
import paypal from '../../assets/paypal.png';
import cod from '../../assets/cod.png';
import zalopay from '../../assets/zalopay.png';

const { FaRegEdit } = icons;

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

const HistoryOrder = () => {
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

    // update status
    const [editStatus, setEditStatus] = useState(null);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const queriesDebounce = UseDebouce(watch('q'), 800);
    const status = watch('status');
    // Api lấy ds sản phẩm
    const fetchOrderByUser = async (params) => {
        const response = await apiGetOrderByUser({
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

        fetchOrderByUser(searchParams);
    }, [params, update]);
    const handleSerchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString(),
        });
    };

    return (
        <div className="relative w-full px-4">
            {editStatus && (
                <div className="absolute inset-0 z-50 min-h-screen bg-gray-100">
                    <CancelOrder
                        editStatus={editStatus}
                        render={render}
                        setEditStatus={setEditStatus}
                    />
                </div>
            )}
            <header className="w-full py-4 text-3xl font-semibold border-b border-gray-200">
                History Order
            </header>
            <div className="h-[69px] w-full mt-2"></div>
            {orders?.length > 0 ? (
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
                                <th className="w-[40px] px-2 py-2 text-center">
                                    #
                                </th>
                                <th className="w-[400px] px-2 py-2 text-center">
                                    Product
                                </th>
                                <th className="w-[140px] px-2 py-2 text-center">
                                    Total
                                </th>
                                <th className="w-[120px] px-2 py-2 text-center">
                                    Status
                                </th>
                                <th className="w-[120px] px-2 py-2 text-center">
                                    Method
                                </th>
                                <th className="w-[140px] px-2 py-2 text-center">
                                    CreateAt
                                </th>
                                <th className="w-[80px] px-2 py-2 text-center">
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
                                    <td className="px-2 py-3 text-center">
                                        {(+params.get('page') > 1
                                            ? +params.get('page') - 1
                                            : 0) *
                                            import.meta.env.VITE_LIMIT +
                                            index +
                                            1}
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className="flex flex-col items-start gap-2">
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
                                                        <span className="block text-sm truncate text-main max-w-[350px]">
                                                            {item?.title}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <span>
                                                                Quantity:
                                                            </span>
                                                            <span className="text-main">
                                                                {item?.count}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs">
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
                                    <td className="px-2 py-3 text-center">
                                        <span>
                                            {formatMoney(el?.total)} VNĐ
                                        </span>
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${
                                                el?.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : el?.status === 'CONFIRMED'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : el?.status === 'SHIPPING'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : el?.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : el?.status === 'CANCELLED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : ''
                                            }
                                        `}
                                        >
                                            {el?.status}
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
                                    <td className="px-2 py-3 text-center">
                                        <span>
                                            {moment(el?.createdAt).format(
                                                'DD/MM/YYYY'
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        <span
                                            onClick={() => setEditStatus(el)}
                                            className="inline-flex items-center justify-center text-blue-500 cursor-pointer hover:underline hover:text-blue-900"
                                        >
                                            <FaRegEdit size={18} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="w-full mt-8 ">
                        <Pagination totalCount={counts} />
                    </div>
                </div>
            ) : (
                `You don't have any orders yet!`
            )}
        </div>
    );
};

export default HistoryOrder;
