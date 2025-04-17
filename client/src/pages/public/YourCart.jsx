import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatMoney } from '../../ultils/helpers';
import icons from '../../ultils/icons';
import noCart from '../../assets/no-cart.png';
import {
    decrease,
    increase,
    removeAllProductCart,
    removeCart,
    selectedCart,
} from '../../store/cart/cartSlice';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import { Breadcrumb } from '../../components';
import { apiGetAllPromotions, applyPromotionCode } from '../../apis';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const { ImBin } = icons;
const YourCart = () => {
    const { cartItems, productsSelected } = useSelector((state) => state.cart);
    const { isLoggedIn } = useSelector((state) => state.user);
    const location = useLocation();
    // console.log(cart.productsSelected);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listChecked, setListChecked] = useState([]);

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
        return cartItems.reduce((total, item) => {
            const key = `${item.product}_${item.sku}`;
            if (listChecked.includes(key)) {
                return total + item.price * item.count;
            }
            return total;
        }, 0);
    }, [cartItems, listChecked]);
    useEffect(() => {
        if (!selectedPromo) {
            setDiscountAmount(0);
            return;
        }

        if (listChecked.length === 0) {
            toast.warning('Please select a product!');
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
    }, [selectedPromo, temporaryPrice, listChecked]);

    // Lấy danh product đc check
    useEffect(() => {
        dispatch(selectedCart({ listChecked }));
    }, [listChecked]);

    //Checkbox
    const onChange = (e) => {
        const value = e.target.value;
        if (listChecked.includes(value)) {
            setListChecked(listChecked.filter((item) => item !== value));
        } else {
            setListChecked([...listChecked, value]);
        }
    };

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = cartItems.map(
                (item) => `${item.product}_${item.sku}`
            );
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    const handleChangeCount = (type, pid, sku, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increase({ pid, sku }));
            }
        } else {
            if (!limited) {
                dispatch(decrease({ pid, sku }));
            }
        }
    };

    // Delete Cart
    const handleDeleteCart = (pid, sku) => {
        dispatch(removeCart({ pid, sku }));
    };

    const handleRemoveAllCart = () => {
        if (listChecked?.length) {
            dispatch(removeAllProductCart({ listChecked }));
        }
    };

    // Tổng
    const totalPrice = useMemo(() => {
        return temporaryPrice - discountAmount;
    }, [temporaryPrice, discountAmount]);

    // handle qua trang thanh toán
    const handleCheckout = () => {
        // Chưa chọn sản phẩm
        if (!productsSelected?.length) {
            toast.error('Vui lòng chọn sản phẩm!');
            return;
        }

        // Chưa đăng nhập
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Oops!',
                text: 'Bạn cần đăng nhập để thanh toán',
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Đăng nhập',
                showCancelButton: true,
            }).then((rs) => {
                if (rs.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({
                            redirect: location?.pathname,
                        }).toString(),
                    });
                }
            });
            return;
        }

        // Điều kiện hợp lệ, điều hướng đến thanh toán
        navigate(`/${path.PAYMENT}`);
    };

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">My cart</h3>
                    <Breadcrumb category={location?.pathname} />
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 mx-auto bg-white w-main ">
                    <img
                        src={noCart}
                        alt="Giỏ hàng trống"
                        className="w-[100px] h-[80px] object-cover"
                    />
                    <span className="text-gray-600">
                        There are no products in the cart yet
                    </span>
                    <div
                        onClick={() => navigate(`/${path.PRODUCTS}`)}
                        className="px-4 py-2 text-white transition rounded bg-main hover:bg-red-600"
                    >
                        Shop now
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-start gap-2 mx-auto my-8 lg:flex-row w-main bg-gray-50">
                    {/* Danh sách sản phẩm */}
                    <div className="w-full p-4 bg-white border border-gray-200 rounded-md shadow lg:w-2/3">
                        {/* Header */}
                        <div className="flex items-center justify-center pb-3 mb-3 border-b border-gray-200">
                            <input
                                type="checkbox"
                                className="w-5 h-5 mr-2"
                                onChange={handleOnchangeCheckAll}
                                checked={
                                    listChecked?.length === cartItems?.length
                                }
                            />
                            <span className="font-medium">
                                All ({cartItems?.length} product)
                            </span>
                            <div className="hidden md:grid grid-cols-5 gap-4 ml-auto w-[65%] text-sm font-semibold text-center text-gray-600">
                                <span>Color</span>
                                <span>Unit price</span>
                                <span>Quantity</span>
                                <span> Money</span>
                                <span
                                    className="hover:cursor-pointer hover:text-main"
                                    onClick={handleRemoveAllCart}
                                >
                                    Remove
                                </span>
                            </div>
                        </div>

                        {/* Sản phẩm */}
                        {cartItems?.length > 0 &&
                            cartItems.map((el, index) => (
                                <div
                                    key={`${el?.product}_${el?.sku}`}
                                    className={`flex flex-col items-center justify-center gap-4 py-4 md:flex-row ${
                                        index !== cartItems.length - 1
                                            ? 'border-b border-gray-200'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-center w-[258px] ">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 mr-3"
                                            onChange={onChange}
                                            value={`${el.product}_${el.sku}`}
                                            checked={listChecked.includes(
                                                `${el.product}_${el.sku}`
                                            )}
                                        />
                                        <img
                                            src={el?.thumb}
                                            alt="thumb"
                                            className="object-cover mr-3 w-14 h-14"
                                        />
                                        <div className="flex items-center font-medium w-[200px] ">
                                            {el?.title}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:w-[65%] w-full text-center items-center text-sm">
                                        <span>{el?.color}</span>
                                        <span>
                                            {formatMoney(el?.price)} VNĐ
                                        </span>

                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleChangeCount(
                                                        'decrease',
                                                        el?.product,
                                                        el?.sku,
                                                        el?.count === 1
                                                    )
                                                }
                                                className="px-2 border rounded hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[20px] text-center">
                                                {el?.count}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleChangeCount(
                                                        'increase',
                                                        el?.product,
                                                        el?.sku,
                                                        el?.count ===
                                                            el?.quantity
                                                    )
                                                }
                                                className="px-2 border rounded hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span className="font-semibold text-red-500">
                                            {formatMoney(el?.price * el?.count)}{' '}
                                            VNĐ
                                        </span>

                                        <button
                                            onClick={() =>
                                                handleDeleteCart(
                                                    el?.product,
                                                    el?.sku
                                                )
                                            }
                                            className="flex items-center justify-center text-gray-500 hover:text-red-600"
                                        >
                                            <ImBin size={16} />
                                        </button>
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
                                onChange={(e) =>
                                    setSelectedPromo(e.target.value)
                                }
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
                            onClick={handleCheckout}
                            className="w-full py-2 mt-4 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YourCart;
