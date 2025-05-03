import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from '../../store/app/appSlice';
const Modal = ({ children }) => {
    const dispatch = useDispatch();
    return (
        <div
            onClick={() =>
                dispatch(showModal({ isShowModal: false, modalChildren: null }))
            }
            className="absolute h-full inset-0 z-5000 bg-[rgba(0,0,0,0.5)] flex items-center justify-center"
        >
            {children}
        </div>
    );
};

export default memo(Modal);
