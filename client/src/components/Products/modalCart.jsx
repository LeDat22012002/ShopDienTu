import React, { memo } from 'react';
import icons from '../../ultils/icons';
import { useDispatch } from 'react-redux';
import { showModalCart } from '../../store/app/appSlice';

const { MdClose } = icons;

const ModalCart = () => {
    const dispatch = useDispatch();
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-[400px] max-h-screen overflow-y-auto bg-white text-black "
        >
            <header className="flex items-center justify-between p-6 text-xl font-bold">
                <span> Your Cart</span>
                <span
                    onClick={() => dispatch(showModalCart())}
                    className="p-2 cursor-pointer"
                >
                    <MdClose size={25} />
                </span>
            </header>
            <div className="w-full border-b border-gray-200"></div>
        </div>
    );
};

export default memo(ModalCart);
