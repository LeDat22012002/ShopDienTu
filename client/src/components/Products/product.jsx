import React, { memo } from 'react';
import { useState } from 'react';
import { formatMoney } from '../../ultils/helpers';
import { renderStar } from '../../ultils/renderStar';
import { SelectOptions } from '..';
import icons from '../../ultils/icons';
import { Link } from 'react-router-dom';
// import path from '../ultils/path';

const { AiOutlineEye, IoMdMenu, FaHeart } = icons;

const Product = ({ productData, isNew, normal }) => {
    const [isShowOption, setIsShowOption] = useState(false);
    return (
        <div className="w-full px-[10px] text-base mb-4">
            <Link
                className="w-full border border-gray-400 p-[15px] flex flex-col items-center"
                to={`/${productData?.category}/${productData?._id}/${productData?.title}`}
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    setIsShowOption(true);
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                    setIsShowOption(false);
                }}
            >
                <div className="relative w-full">
                    {isShowOption && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-up">
                            <SelectOptions icon={<AiOutlineEye />} />
                            <SelectOptions icon={<IoMdMenu />} />
                            <SelectOptions icon={<FaHeart />} />
                        </div>
                    )}
                    <img
                        src={productData?.thumb || productData?.images[0] || ''}
                        alt="ảnh Product"
                        className="object-cover w-[274px] h-[274px] "
                    ></img>

                    {!normal &&
                        (isNew ? (
                            <>
                                <div className="absolute top-[-5px] left-[-24px] bg-red-500 text-white text-sm font-medium leading-[1.6rem] pr-2 pl-3 rounded-tr-md rounded-br-md">
                                    New product
                                </div>
                                <div className="w-0 h-0 border-l-8 border-t-8 border-l-transparent border-t-red-800 absolute top-[20px] left-[-24px]"></div>
                            </>
                        ) : (
                            <>
                                <div className="absolute top-[-5px] left-[-24px] bg-blue-500 text-white text-sm font-medium leading-[1.6rem] pr-2 pl-3 rounded-tr-md rounded-br-md">
                                    Best seller
                                </div>
                                <div className="w-0 h-0 border-l-8 border-t-8 border-l-transparent border-t-blue-800 absolute top-[20px] left-[-24px]"></div>
                            </>
                        ))}
                </div>
                <div className="flex flex-col gap-1 mt-[15px] items-start w-full ">
                    <span className="flex h-4">
                        {renderStar(productData?.totalRatings)?.map(
                            (el, index) => (
                                <span key={index}>{el}</span>
                            )
                        )}
                    </span>
                    <span className="line-clamp-1">{productData?.title}</span>

                    <span>{`${formatMoney(productData.price)} VNĐ`}</span>
                </div>
            </Link>
        </div>
    );
};

export default memo(Product);
