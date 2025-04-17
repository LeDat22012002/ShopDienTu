import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Breadcrumb } from '../../components';
import { formatMoney } from '../../ultils/helpers';
import { apiGetAllPromotions, applyPromotionCode } from '../../apis';
import { toast } from 'react-toastify';

const Payment = () => {
    const { productsSelected } = useSelector((state) => state.cart);
    console.log(productsSelected);
    const location = useLocation();

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

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">Payment</h3>
                    <Breadcrumb category={location?.pathname} />
                </div>
            </div>
            <div className="flex flex-col items-start gap-2 mx-auto my-8 lg:flex-row w-main bg-gray-50">
                {/* Danh sách sản phẩm */}
                <div className="w-full p-4 bg-white border border-gray-200 rounded-md shadow lg:w-2/3">
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
                                    <span>{formatMoney(el?.price)} VNĐ</span>

                                    <div className="flex items-center justify-center gap-2">
                                        <span className="min-w-[20px] text-center">
                                            {el?.count}
                                        </span>
                                    </div>

                                    <span className="font-semibold text-red-500">
                                        {formatMoney(el?.price * el?.count)} VNĐ
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Thanh toán */}
                <div className="w-full p-4 bg-white border border-gray-200 rounded-md shadow lg:w-1/3">
                    {/* <div className="mb-2">
                                        <span className="text-gray-600">
                                            Địa chỉ nhận hàng:
                                        </span>
                                        <span className="font-medium">_</span>
                                    </div> */}
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
                    <button
                        // onClick={handleCheckout}
                        className="w-full py-2 mt-4 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
