import React, { memo } from 'react';
import { useState } from 'react';
import { formatMoney } from '../../ultils/helpers';
import { renderStar } from '../../ultils/renderStar';
import { SelectOptions } from '..';
import icons from '../../ultils/icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../../store/cart/cartSlice';

// import path from '../ultils/path';

const { AiOutlineEye, FaCartArrowDown, FaHeart } = icons;

const Product = ({ productData, isNew, normal }) => {
    // console.log(productData);
    const [isShowOption, setIsShowOption] = useState(false);
    const [numProduct, setNumProduct] = useState(1);
    // const defaultVariant = productData?.varriants?.[0];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const handleClickOptions = (e, flag) => {
        e.stopPropagation();

        const selectedSku = 'default';
        const price = productData?.price;
        const thumb = productData?.thumb;
        const color = productData?.color;
        const title = productData?.title;
        const quantityInStock = productData?.quantity || 0;

        const cartRedux = cartItems?.find(
            (item) =>
                item.product === productData?._id && item?.sku === selectedSku
        );

        if (flag === 'CART') {
            if (
                cartRedux?.count + numProduct <= quantityInStock ||
                (!cartRedux && numProduct <= quantityInStock)
            ) {
                dispatch(
                    addCart({
                        cartItem: {
                            product: productData?._id,
                            sku: selectedSku,
                            title,
                            thumb,
                            color,
                            price,
                            count: numProduct,
                            quantity: quantityInStock,
                        },
                    })
                );
                toast.success('Added to cart');
            } else {
                toast.error('Quantity exceeds inventory level!');
            }
        }

        if (flag === 'WISHLIST') toast.success('My add wishlist');
        if (flag === 'QUICK_VIEW') toast.success('Quick view clicked');
    };

    // console.log(productData);
    return (
        <div className="w-full px-[10px] text-base mb-4">
            <div
                className="w-full border border-gray-400 p-[15px] flex flex-col items-center"
                onClick={() =>
                    navigate(
                        `/${productData?.category}/${productData?._id}/${productData?.title}`
                    )
                }
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
                            <span
                                title="quickview"
                                onClick={(e) =>
                                    handleClickOptions(e, 'QUICK_VIEW')
                                }
                            >
                                <SelectOptions icon={<AiOutlineEye />} />
                            </span>
                            {cartItems?.length &&
                            cartItems?.some(
                                (el) => el.product === productData?._id
                            ) ? (
                                <span title="Added to cart">
                                    <SelectOptions
                                        icon={<FaCartArrowDown color="green" />}
                                    />
                                </span>
                            ) : (
                                <span
                                    title="Add to cart"
                                    onClick={(e) =>
                                        handleClickOptions(e, 'CART')
                                    }
                                >
                                    <SelectOptions icon={<FaCartArrowDown />} />
                                </span>
                            )}
                            <span
                                title="Add to wishlist"
                                onClick={(e) =>
                                    handleClickOptions(e, 'WISHLIST')
                                }
                            >
                                <SelectOptions icon={<FaHeart />} />
                            </span>
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
            </div>
        </div>
    );
};

export default memo(Product);
