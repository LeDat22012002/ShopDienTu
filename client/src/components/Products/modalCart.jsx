import React, { memo } from 'react';
import icons from '../../ultils/icons';
import { useDispatch, useSelector } from 'react-redux';
import { showModalCart } from '../../store/app/appSlice';
import { formatMoney } from '../../ultils/helpers';
import { Button } from '..';
import { useNavigate } from 'react-router-dom';
import path from '../../ultils/path';

const { MdClose } = icons;

const ModalCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const handleYourCart = () => {
        navigate(`/${path.CART}`);
        dispatch(showModalCart());
    };
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-[400px] h-screen overflow-y-auto bg-white text-black grid grid-rows-10 p-6 "
        >
            <header className="flex items-center justify-between h-full row-span-1 text-xl font-bold border-b border-gray-200">
                <span> Your Cart</span>
                <span
                    onClick={() => dispatch(showModalCart())}
                    className="p-2 cursor-pointer"
                >
                    <MdClose size={25} />
                </span>
            </header>

            <section className="flex flex-col h-full max-h-full gap-5 mt-3 overflow-y-auto row-span-7">
                {cartItems?.length === 0 && (
                    <span className="text-xs italic text-main">
                        Your cart is empty!
                    </span>
                )}
                {cartItems?.length > 0 &&
                    cartItems?.map((el) => (
                        <div
                            key={el?._id}
                            className="flex items-center justify-between "
                        >
                            <div className="flex gap-2">
                                <img
                                    src={el?.thumb}
                                    alt="thumb"
                                    className="object-cover w-18 h-18"
                                ></img>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-semibold">
                                        {el?.title}
                                    </span>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-main">
                                            {formatMoney(el?.price) + 'VNĐ'}
                                        </span>
                                        <span className={`text-[12px]`}>
                                            {el?.color}
                                        </span>
                                        <span> sold: {el?.count}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-gray-200">
                                <MdClose color="red" size={15} />
                            </span>
                        </div>
                    ))}
            </section>
            <div className="flex flex-col justify-between h-full row-span-2">
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span>Subtotal: </span>
                    <span>
                        {formatMoney(
                            cartItems?.reduce(
                                (sum, el) => sum + Number(el?.price),
                                0
                            )
                        ) + 'VNĐ'}
                    </span>
                </div>
                <span className="text-xs italic text-center text-main ">
                    Shipping, taxes, and discounts calculated at checkout.
                </span>
                <Button
                    handleOnclick={handleYourCart}
                    style="rounded-none w-full bg-main py-3 text-white"
                >
                    Shopping Cart
                </Button>
            </div>
        </div>
    );
};

export default memo(ModalCart);
