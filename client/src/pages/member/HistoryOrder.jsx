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
        <div className="relative w-full flex flex-col md:w-[96%] md:px-4 ">
            {editStatus && (
                <div className="absolute inset-0 z-50 w-[95%]  min-h-screen mx-auto bg-gray-100">
                    <CancelOrder
                        editStatus={editStatus}
                        render={render}
                        setEditStatus={setEditStatus}
                    />
                </div>
            )}
            <header className="w-[90%] mx-auto px-2 ml-6 md:ml-0 md:w-full py-4 text-xl font-semibold border-gray-200 md:px-0 lg:text-3xl ">
                History Order
            </header>
            <div className="h-[69px] w-[90%] mx-auto flex ml-6 mt-2 md:ml-0 md:w-full "></div>
            {orders?.length > 0 ? (
                <div className="flex flex-col w-[90%] mx-auto ml-6 gap-4 md:ml-0 md:w-full">
                    <div className="flex justify-end px-2 py-4 md:px-0">
                        <form className="grid w-full grid-cols-2 gap-2 md:gap-4 ">
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
                    <div className="w-full px-2 overflow-x-auto md:px-0">
                        <div className="w-full sm:min-w-full">
                            <table className="w-full text-left border-collapse rounded-md shadow-md table-auto ">
                                <thead className="text-[8px] md:text-sm text-white uppercase bg-gray-700">
                                    <tr>
                                        <th className="w-[10px] md:w-[20px] lg:w-[40px] px-1 py-1 text-center">
                                            #
                                        </th>
                                        <th className="w-[100px] md:w-[200px] lg:w-[400px] px-2 py-2 text-center">
                                            Product
                                        </th>
                                        <th className="w-[50px] md:w-[100px] lg:w-[140px] px-2 py-2 text-center">
                                            Total
                                        </th>
                                        <th className="w-[30px] md:w-[70px] lg:w-[120px] px-2 py-2 text-center">
                                            Status
                                        </th>
                                        <th className="w-[30px] md:w-[70px] lg:w-[120px] px-2 py-2 text-center">
                                            Method
                                        </th>
                                        <th className="w-[30px] md:w-[70px] lg:w-[140px] px-2 py-2 text-center">
                                            CreateAt
                                        </th>
                                        <th className="w-[20px] md:w-[50px] lg:w-[80px] px-2 py-2 text-center">
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
                                            <td className="px-2 py-3 text-center text-[8px] md:text-[14px]">
                                                {(+params.get('page') > 1
                                                    ? +params.get('page') - 1
                                                    : 0) *
                                                    import.meta.env.VITE_LIMIT +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="flex flex-col items-start gap-2">
                                                    {el?.products?.map(
                                                        (item) => (
                                                            <span
                                                                key={item?._id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <img
                                                                    src={
                                                                        item?.thumb
                                                                    }
                                                                    alt="thumb"
                                                                    className="object-cover w-4 h-4 rounded-md md:w-4 md:h-4"
                                                                />
                                                                <span className="flex flex-col text-left">
                                                                    <span className="block text-[8px] md:text-[16px] truncate text-main ">
                                                                        {
                                                                            item?.title
                                                                        }
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-[8px] md:text-xs">
                                                                        <span>
                                                                            Quantity:
                                                                        </span>
                                                                        <span className="text-main">
                                                                            {
                                                                                item?.count
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-[8px] md:text-xs">
                                                                        <span>
                                                                            Color:
                                                                        </span>
                                                                        <span className="text-main">
                                                                            {
                                                                                item?.color
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        )
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 text-center text-[8px] md:text-[14px]">
                                                <span>
                                                    {formatMoney(el?.total)} VNĐ
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 w-[20px] text-center text-[8px] md:text-[14px]">
                                                <span
                                                    className={`px-2 py-1 w-[10px] rounded-full font-medium 
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
                                                    <span className="text-[8px] md:text-[14px]">
                                                        {el?.status}
                                                    </span>
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-center text-[8px] md:text-[14px]">
                                                <div className="flex items-center justify-center gap-1 md:gap-2">
                                                    <img
                                                        src={getPaymentMethodIcon(
                                                            el?.paymentMethod
                                                        )}
                                                        alt={el?.paymentMethod}
                                                        className="object-contain w-3 h-3 md:w-6 md:h-6"
                                                    />
                                                    <span>
                                                        {el?.paymentMethod}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-3 text-center text-[8px] md:text-[14px]">
                                                <span>
                                                    {moment(
                                                        el?.createdAt
                                                    ).format('DD/MM/YYYY')}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 text-center text-[8px] md:text-[14px]">
                                                <span
                                                    onClick={() =>
                                                        setEditStatus(el)
                                                    }
                                                    className="inline-flex items-center justify-center text-blue-500 cursor-pointer hover:underline hover:text-blue-900"
                                                >
                                                    <FaRegEdit size={18} />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-full mt-4 mb-4 text-[8px] md:text-[16px] px-2 md:px-4">
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
