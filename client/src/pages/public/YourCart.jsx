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
import { useNavigate } from 'react-router-dom';
import path from '../../ultils/path';

const { ImBin } = icons;
const YourCart = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const cart = useSelector((state) => state.cart);
    // console.log(cart.productsSelected);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listChecked, setListChecked] = useState([]);
    // Lấy danh product đc check
    useEffect(() => {
        dispatch(selectedCart({ listChecked }));
    }, [listChecked]);

    //Checkbox
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter(
                (item) => item !== e.target.value
            );
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    };

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = [];
            cartItems?.forEach((item) => {
                newListChecked.push(item?.product);
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    const handleChangeCount = (type, pid, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increase({ pid }));
            }
        } else {
            if (!limited) {
                dispatch(decrease({ pid }));
            }
        }
    };
    // Delete Cart
    const handleDeleteCart = (pid) => {
        dispatch(removeCart({ pid }));
    };

    const handleRemoveAllCart = () => {
        if (listChecked?.length) {
            dispatch(removeAllProductCart({ listChecked }));
        }
    };

    // Tạm tính
    const temporaryPrice = useMemo(() => {
        const result = cart?.productsSelected?.reduce((total, cur) => {
            return total + cur.price * cur.count;
        }, 0);
        return result;
    }, [cart]);

    // Tổng
    const totalPrice = useMemo(() => {
        return Number(temporaryPrice);
    }, [temporaryPrice]);

    return (
        <div className="py-6 mt-4 w-main">
            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 bg-white shadow rounded-xl">
                    <img
                        src={noCart}
                        alt="Giỏ hàng trống"
                        className="w-[100px] h-[80px] object-cover"
                    />
                    <span className="text-gray-600">
                        Chưa có sản phẩm nào trong giỏ hàng
                    </span>
                    <div
                        onClick={() => navigate(`/${path.PRODUCTS}`)}
                        className="px-4 py-2 text-white transition rounded bg-main hover:bg-red-600"
                    >
                        Mua sắm ngay
                    </div>
                </div>
            ) : (
                <div className="grid w-full grid-cols-1 lg:grid-cols-3 bg-gray-50">
                    {/* Danh sách sản phẩm */}
                    <div className="w-full p-4 bg-white shadow rounded-xl lg:col-span-2">
                        {/* Header */}
                        <div className="flex items-center pb-3 mb-3 border-b">
                            <input
                                type="checkbox"
                                className="w-5 h-5 mr-2"
                                onChange={handleOnchangeCheckAll}
                                checked={
                                    listChecked?.length === cartItems?.length
                                }
                            />
                            <span className="font-medium">
                                Tất cả ({cartItems?.length} sản phẩm)
                            </span>
                            <div className="hidden md:grid grid-cols-5 gap-4 ml-auto w-[65%] text-sm font-semibold text-center text-gray-600">
                                <span>Color</span>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <span
                                    className="hover:cursor-pointer hover:text-main"
                                    onClick={handleRemoveAllCart}
                                >
                                    Xóa
                                </span>
                            </div>
                        </div>

                        {/* Sản phẩm */}
                        {cartItems?.length > 0 &&
                            cartItems.map((el) => (
                                <div
                                    key={el?.product}
                                    className="flex flex-col items-center gap-4 py-4 border-b md:flex-row"
                                >
                                    <div className="flex items-center w-[258px] ">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 mr-3"
                                            onChange={onChange}
                                            value={el?.product}
                                            checked={listChecked.includes(
                                                el?.product
                                            )}
                                        />
                                        <img
                                            src={el?.thumb}
                                            alt="thumb"
                                            className="object-contain mr-3 rounded w-14 h-14"
                                        />
                                        <div className="font-medium w-[200px] ">
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
                                                handleDeleteCart(el?.product)
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
                    <div className="p-4 bg-white shadow rounded-xl">
                        <div className="mb-2">
                            <span className="text-gray-600">
                                Địa chỉ nhận hàng:
                            </span>{' '}
                            <span className="font-medium">_</span>
                        </div>
                        <div className="flex justify-between pt-2 mt-2 text-sm border-t">
                            <span>Tạm tính</span>
                            <span className="font-semibold">
                                {formatMoney(temporaryPrice)} VNĐ
                            </span>
                        </div>
                        <div className="flex justify-between mt-4 text-lg font-semibold">
                            <span>Tổng tiền</span>
                            <span className="text-red-500">
                                {formatMoney(totalPrice)} VNĐ
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            (Đã bao gồm VAT nếu có)
                        </p>
                        <button className="w-full py-2 mt-4 text-white transition bg-red-500 rounded-lg hover:bg-red-600">
                            Mua hàng
                        </button>
                    </div>
                </div>
            )}
            {/* <h2 className="mb-4 text-xl font-semibold">Giỏ Hàng</h2> */}
        </div>
    );
};

export default YourCart;
