import React, { memo } from 'react';
import { renderStar } from '../../ultils/renderStar';
import { formatMoney } from '../../ultils/helpers';

const ProductCard = ({ price, totalRatings, title, image }) => {
    return (
        <div className=" flex-auto w-1/3  px-[10px] mb-[20ox]">
            <div className="flex w-full border">
                <img
                    src={image}
                    alt="ảnh pr"
                    className="w-[150px] h-[150px] object-contain p-4"
                ></img>
                <div className="flex flex-col mt-[30px] items-start w-full gap-1 text-[14px] ">
                    <span className="text-sm capitalize line-clamp-1">
                        {title.toLowerCase()}
                    </span>
                    <span>{`${formatMoney(price)} VNĐ`}</span>
                    <span className="flex h-4">
                        {renderStar(totalRatings, 14)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);
