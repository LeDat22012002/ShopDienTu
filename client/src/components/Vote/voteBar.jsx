import React, { memo } from 'react';
import { useRef, useEffect } from 'react';
import icons from '../../ultils/icons';

const { BsStarFill } = icons;

const VoteBar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef();
    useEffect(() => {
        const percent = Math.round((ratingCount * 100) / ratingTotal) || 0;
        percentRef.current.style.cssText = `right: ${100 - percent}%`;
    }, [ratingCount, ratingTotal]);
    return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-1 text-sm flex-1/12">
                <span className="w-[10px]">{number}</span>
                <BsStarFill color="orange" />
            </div>
            <div className=" flex-9/12">
                <div className="w-full h-[7px] relative bg-gray-200 rounded-l-full rounded-r-full">
                    <div
                        ref={percentRef}
                        className="absolute inset-0 bg-red-500 rounded-l-full right-8"
                    ></div>
                </div>
            </div>
            <div className="flex ml-[20px] text-[14px] text-400 flex-2/12">{`${
                ratingCount || 0
            } reviewrs`}</div>
        </div>
    );
};

export default memo(VoteBar);
