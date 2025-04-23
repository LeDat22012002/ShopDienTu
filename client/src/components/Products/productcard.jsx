import React, { memo } from 'react';
import { renderStar } from '../../ultils/renderStar';
import { formatMoney } from '../../ultils/helpers';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({
    price,
    totalRatings,
    title,
    image,
    style,
    pid,
    category,
}) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/${category}/${pid}/${title}`)}
            className={clsx(' border w-full cursor-pointer')}
        >
            <div className={clsx('flex w-full ')}>
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
