import React, { memo } from 'react';
import icons from '../../ultils/icons';
import { useDispatch, useSelector } from 'react-redux';
import { showModalCart } from '../../store/app/appSlice';
import { formatMoney } from '../../ultils/helpers';

const { MdClose } = icons;

const ModalCart = () => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
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

            <section className="flex flex-col h-full max-h-full row-span-6 gap-3 overflow-y-auto">
                {cartItems?.length === 0 && (
                    <span className="text-xs italic text-main">
                        Your cart is empty!
                    </span>
                )}
                {cartItems?.length > 0 &&
                    cartItems?.map((el) => (
                        <div key={el?._id} className="flex gap-2">
                            <img
                                src={el?.thumb}
                                alt="thumb"
                                className="object-cover w-18 h-18"
                            ></img>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold">
                                    {el?.title}
                                </span>
                                <span className={`text-[12px]`}>
                                    {el?.color}
                                </span>
                                <span className="text-sm">
                                    {formatMoney(el?.price) + 'VNĐ'}
                                </span>
                                <span>{el?.count}</span>
                            </div>
                        </div>
                    ))}
            </section>
            <div className="h-full row-span-3">checkout</div>
        </div>
    );
};

export default memo(ModalCart);
