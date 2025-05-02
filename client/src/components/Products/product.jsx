import React, { memo } from 'react';
import { useState } from 'react';
import { formatMoney } from '../../ultils/helpers';
import { renderStar } from '../../ultils/renderStar';
import { SelectOptions } from '..';
import icons from '../../ultils/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../../store/cart/cartSlice';
import { apiUpdateWishlist } from '../../apis';
import { getCurent } from '../../store/user/asyncActions';
import clsx from 'clsx';

// import path from '../ultils/path';

const { AiOutlineEye, FaCartArrowDown, FaHeart } = icons;

const Product = ({ productData, isNew, normal, pid, className, style }) => {
    // console.log(productData);
    const [isShowOption, setIsShowOption] = useState(false);
    const [numProduct, setNumProduct] = useState(1);
    // const defaultVariant = productData?.varriants?.[0];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { current } = useSelector((state) => state.user);
    const handleClickOptions = async (e, flag) => {
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

        if (flag === 'WISHLIST') {
            const response = await apiUpdateWishlist(pid);
            if (response.success) {
                dispatch(getCurent());
                toast.success(response.mess);
            } else {
                toast.error(response.mess);
            }
        }
        if (flag === 'QUICK_VIEW') toast.success('Quick view clicked');
    };

    // console.log(productData);

    return (
        <div className={clsx('w-full text-base', style, className)}>
            <div
                className="w-full border border-gray-200 p-[15px] flex flex-col items-center"
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
                                <SelectOptions
                                    icon={
                                        <FaHeart
                                            color={
                                                current?.wishlist?.some(
                                                    (i) => i?._id === pid
                                                )
                                                    ? 'red'
                                                    : 'black'
                                            }
                                        />
                                    }
                                />
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-center w-full h-[200px]">
                        <img
                            src={
                                productData?.thumb ||
                                productData?.images[0] ||
                                ''
                            }
                            alt="ảnh Product"
                            className="object-contain w-[180px] h-[180px]"
                        />
                    </div>

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
                <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
                    <span className="flex h-4">
                        {renderStar(productData?.totalRatings)?.map(
                            (el, index) => (
                                <span key={index}>{el}</span>
                            )
                        )}
                    </span>
                    <span className="line-clamp-1 text-main">
                        {productData?.title}
                    </span>
                    <div className="flex items-center gap-2">
                        {/* Check if there's a sale price */}
                        {productData?.salePrice ? (
                            <>
                                <span className="font-semibold text-red-500">
                                    {formatMoney(productData.salePrice)} VNĐ
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    {formatMoney(productData.price)} VNĐ
                                </span>
                            </>
                        ) : (
                            <span className="font-semibold">
                                {formatMoney(productData.price)} VNĐ
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Product);
