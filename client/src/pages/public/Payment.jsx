import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, InputForm, Select } from '../../components';
import { useForm } from 'react-hook-form';
import { formatMoney } from '../../ultils/helpers';
import {
    apiGetAllPromotions,
    applyPromotionCode,
    apiCreateOrder,
    apiCreateMomoPayment,
} from '../../apis';
import { toast } from 'react-toastify';
import dataGoogleMap from '../../data/data.json';
import { resetCart } from '../../store/cart/cartSlice';
import path from '../../ultils/path';

const Payment = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        setValue,
        reset,
    } = useForm();

    const { productsSelected } = useSelector((state) => state.cart);
    const { current } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    // console.log(productsSelected);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (current) {
            reset({
                name: current?.name || '',
                email: current?.email || '',
                phone: current?.phone || '',
                city: current?.city || '',
                district: current?.district || '',
                ward: current?.ward || '',
                detail: current?.detail || '',
            });

            setTimeout(() => {
                setValue('city', current?.city || '');
                setValue('district', current?.district || '');
                setValue('ward', current?.ward || '');
            }, 10); // delay 1 tick để render kịp options
        }
    }, [current]);

    // Promotion
    const [promotions, setPromotions] = useState([]);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // API Promotions
    const fetchPromotions = async () => {
        const rsPromotions = await apiGetAllPromotions();
        if (rsPromotions.success) {
            setPromotions(rsPromotions?.promotions);
        }
    };
    useEffect(() => {
        fetchPromotions();
    }, []);

    const temporaryPrice = useMemo(() => {
        return productsSelected.reduce((total, item) => {
            return total + item.price * item.count;
        }, 0);
    }, [productsSelected]);

    useEffect(() => {
        if (!selectedPromo) {
            setDiscountAmount(0);
            return;
        }

        if (productsSelected.length === 0) {
            toast.warning('Không có sản phẩm để áp dụng mã!');
            setDiscountAmount(0);
            return;
        }

        const applyPromotion = async () => {
            const res = await applyPromotionCode({
                code: selectedPromo,
                orderValue: temporaryPrice,
            });
            if (res.success) {
                toast.success(res.mess);
                setDiscountAmount(res.discountAmount);
            } else {
                toast.error(res.mess);
                setDiscountAmount(0);
            }
        };
        applyPromotion();
    }, [selectedPromo, temporaryPrice, productsSelected]);

    // Tổng
    const totalPrice = useMemo(() => {
        return temporaryPrice - discountAmount;
    }, [temporaryPrice, discountAmount]);

    //Xử lý checkout
    const handleCheckout = async (data) => {
        if (!current || !productsSelected.length) {
            toast.error('Không có sản phẩm để đặt hàng');
            return;
        }

        const orderData = {
            products: productsSelected.map((item) => ({
                productId: item.product,
                title: item.title,
                sku: item.sku,
                color: item.color,
                quantity: item.count,
                price: item.price,
                thumb: item.thumb,
            })),
            shippingAddress: {
                name: data.name,
                phone: data.phone,
                city: data.city,
                district: data.district,
                ward: data.ward,
                detail: data.detail,
            },
            promotionCode: selectedPromo || null,
            itemsPrice: temporaryPrice,
            discountAmount,
            totalAmount: totalPrice,
            paymentMethod: data.paymentMethod,
        };

        if (data.paymentMethod === 'momo') {
            const res = await apiCreateMomoPayment(orderData);
            if (res?.payUrl) {
                window.location.href = res.payUrl;
            } else {
                toast.error('Tạo thanh toán Momo thất bại');
            }

            return;
        }

        // COD hoặc khác
        const response = await apiCreateOrder(orderData);
        if (response.success) {
            toast.success(response.mess);

            reset();
            dispatch(resetCart());
            navigate(`${path.PAYMENT_SUCCESS}`);
        } else {
            toast.error(response.mess);
        }
    };

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">Payment</h3>
                    <Breadcrumb category={location?.pathname} />
                </div>
            </div>
            <form
                onSubmit={handleSubmit(handleCheckout)}
                className="flex flex-col items-start gap-2 mx-auto my-8 lg:flex-row w-main bg-gray-50"
            >
                <div className="w-full lg:w-2/3">
                    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-md shadow">
                        {/* Header */}
                        <div className="flex items-center justify-center pb-3 mb-3 border-b border-gray-200">
                            <div className="hidden md:grid grid-cols-4 gap-4 ml-auto w-[65%] text-sm font-semibold text-center text-gray-600">
                                <span>Color</span>
                                <span>Unit price</span>
                                <span>Quantity</span>
                                <span> Money</span>
                            </div>
                        </div>

                        {/* Sản phẩm */}
                        {productsSelected?.length > 0 &&
                            productsSelected.map((el, index) => (
                                <div
                                    key={`${el?.product}_${el?.sku}`}
                                    className={`flex flex-col items-center justify-center gap-4 py-4 md:flex-row ${
                                        index !== productsSelected?.length - 1
                                            ? 'border-b border-gray-200'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-center w-[258px] ">
                                        <img
                                            src={el?.thumb}
                                            alt="thumb"
                                            className="object-cover mr-3 w-14 h-14"
                                        />
                                        <div className="flex items-center font-medium w-[200px] ">
                                            {el?.title}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:w-[65%] w-full text-center items-center text-sm">
                                        <span>{el?.color}</span>
                                        <span>
                                            {formatMoney(el?.price)} VNĐ
                                        </span>

                                        <div className="flex items-center justify-center gap-2">
                                            <span className="min-w-[20px] text-center">
                                                {el?.count}
                                            </span>
                                        </div>

                                        <span className="font-semibold text-red-500">
                                            {formatMoney(el?.price * el?.count)}{' '}
                                            VNĐ
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="p-4 bg-white border border-gray-200 rounded-md shadow">
                        <h3 className="flex text-[16px] font-medium">
                            Thông tin người nhận
                        </h3>
                        <div className="border-gray-500">
                            <div
                                // onSubmit={handleSubmit(handleUpdateInformation)}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex gap-2">
                                    <InputForm
                                        label="Name"
                                        register={register}
                                        errors={errors}
                                        id="name"
                                        validate={{
                                            required: 'name cannot be blank !',
                                            pattern: {
                                                value: /^[^\s]/,
                                                message:
                                                    ' name cannot start with a space !',
                                            },
                                        }}
                                        style="flex-auto "
                                    />

                                    <InputForm
                                        label="Phone"
                                        register={register}
                                        style="flex-auto "
                                        errors={errors}
                                        id="phone"
                                        validate={{
                                            required: 'Required fill',
                                            pattern: {
                                                value: /^(0|\+84)[0-9]{9}$/,
                                                message: 'Invalid phone number',
                                            },
                                        }}
                                    />
                                </div>

                                <Select
                                    label="Province / City"
                                    options={dataGoogleMap?.map((el) => ({
                                        code: el?.name,
                                        value: el?.name,
                                    }))}
                                    register={register}
                                    id="city"
                                    validate={{
                                        required:
                                            'Please select a province / City!',
                                    }}
                                    withFull
                                    errors={errors}
                                />
                                <Select
                                    label="District"
                                    options={dataGoogleMap
                                        ?.find(
                                            (el) => el?.name === watch('city')
                                        )
                                        ?.level2s?.map((item) => ({
                                            code: item?.name,
                                            value: item?.name,
                                        }))}
                                    register={register}
                                    id="district"
                                    validate={{
                                        required: 'Please select a dstrict !',
                                    }}
                                    errors={errors}
                                    withFull
                                />
                                <Select
                                    label="Ward / Commune"
                                    options={dataGoogleMap
                                        ?.find(
                                            (el) => el.name === watch('city')
                                        ) // Tìm thành phố theo ID
                                        ?.level2s?.find(
                                            (d) => d.name === watch('district')
                                        ) // Tìm quận theo ID
                                        ?.level3s?.map((item) => ({
                                            code: item.name, // ID của phường
                                            value: item.name, // Hiển thị tên phường
                                        }))}
                                    register={register}
                                    id="ward"
                                    validate={{
                                        required:
                                            'Please select a ward / wommune!',
                                    }}
                                    errors={errors}
                                    withFull
                                />

                                <InputForm
                                    label="Home address"
                                    register={register}
                                    fullWith
                                    errors={errors}
                                    id="detail"
                                    validate={{
                                        required: 'Required fill',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thanh toán */}
                <div className="w-full p-4 bg-white border border-gray-200 rounded-md shadow lg:w-1/3">
                    <div className="mt-1">
                        <label className="text-[16px] font-medium">
                            Chose code promotion:
                        </label>
                        <select
                            className="w-full p-2 mt-1 border border-gray-300 rounded"
                            onChange={(e) => setSelectedPromo(e.target.value)}
                            value={selectedPromo || ''}
                        >
                            <option value="">-- Chose code --</option>
                            {promotions?.map((promo) => (
                                <option key={promo._id} value={promo.code}>
                                    {promo?.description}
                                    {/* {promo?.discountType === 'fixed'
                                                        ? `${formatMoney(
                                                              promo?.discountValue
                                                          )} VNĐ`
                                                        : `${promo?.discountValue}%`} */}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between pt-2 mt-2 text-[16px] font-medium ">
                        <span>Temporary price</span>
                        <span className="font-semibold">
                            {formatMoney(temporaryPrice)} VNĐ
                        </span>
                    </div>
                    {/* Hiển thị giá giảm nếu có */}
                    {discountAmount > 0 && (
                        <div className="flex justify-between mt-2 text-[16px] text-green-500">
                            <span>Promotion</span>
                            <span>{formatMoney(discountAmount)} VNĐ</span>
                        </div>
                    )}
                    <div className="flex justify-between mt-4 text-lg font-semibold">
                        <span>Total price</span>
                        <span className="text-red-500">
                            {formatMoney(totalPrice)} VNĐ
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        (VAT included if applicable)
                    </p>
                    <div className="flex flex-col gap-2 mt-4">
                        <span className="font-semibold">
                            Chọn phương thức thanh toán
                        </span>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="cod"
                                {...register('paymentMethod', {
                                    required:
                                        'Vui lòng chọn phương thức thanh toán',
                                })}
                            />
                            <span>Thanh toán khi nhận hàng (COD)</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="momo"
                                {...register('paymentMethod')}
                            />
                            <span>Thanh toán qua Momo</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="vnpay"
                                {...register('paymentMethod')}
                            />
                            <span>Thanh toán qua VN Pay</span>
                        </label>

                        {errors.paymentMethod && (
                            <p className="text-sm text-red-500">
                                {errors.paymentMethod.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 mt-4 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                    >
                        Checkout
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Payment;
