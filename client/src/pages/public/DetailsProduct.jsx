import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetDetailsProduct, apiGetProduct } from '../../apis';
import { useEffect, useState } from 'react';
import {
    Breadcrumb,
    Button,
    SelectQuantity,
    ProductExtrainInfo,
    ProductInfomation,
    CustomSlider,
} from '../../components';
import Slider from 'react-slick';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { formatMoney } from '../../ultils/helpers';
import { renderStar } from '../../ultils/renderStar';
import { toast } from 'react-toastify';
import { productExtraInfomation } from '../../ultils/contans2';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../../store/cart/cartSlice';

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};
const DetailsProduct = () => {
    // const { pid, title, category } = useParams();
    const dispatch = useDispatch();
    const { pid, category } = useParams();
    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [relatedProducts, setRelatedProducts] = useState(null);
    const [currentImg, setCurrentImg] = useState(null);
    const [update, setUpdate] = useState(false);
    const { cartItems } = useSelector((state) => state.cart);

    // Varriant
    const [varriant, setVarriant] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: 0,
        color: '',
    });

    const [selectedImg, setSelectedImg] = useState(currentProduct?.thumb);

    const handleClickImage = (e, img) => {
        setCurrentImg(img);
        setSelectedImg(img); // để hiển thị border
    };
    const fetchProductData = async () => {
        const response = await apiGetDetailsProduct(pid);

        if (response.success) {
            setProduct(response?.productData);
            setCurrentImg(
                response?.productData?.thumb || response?.productData?.images[0]
            );
        }
    };

    const fetchProducts = async () => {
        const response = await apiGetProduct({ category });

        if (response.success) {
            const filteredProducts = response?.products?.filter(
                (item) => item._id !== pid
            );
            setRelatedProducts(filteredProducts);
        }
    };

    useEffect(() => {
        if (varriant) {
            const selected = product?.varriants?.find(
                (el) => el?.sku === varriant
            );
            if (selected) {
                setCurrentProduct({
                    title: selected?.title,
                    color: selected?.color,
                    price: selected?.price,
                    images: selected?.images,
                    thumb: selected?.thumb,
                    quantity: selected?.quantity,
                    sold: selected?.sold,
                });
                setCurrentImg(selected?.thumb || selected?.images?.[0]); // Cập nhật ảnh chính
            }
        } else {
            setCurrentProduct({
                title: product?.title,
                color: product?.color,
                price: product?.price,
                images: product?.images,
                thumb: product?.thumb,
                quantity: product?.quantity,
                sold: product?.sold,
            });
            setCurrentImg(product?.thumb || product?.images?.[0]); // Reset lại ảnh chính
        }
    }, [varriant, product]);

    useEffect(() => {
        if (pid) {
            fetchProductData();
            fetchProducts();
        }
        window.scrollTo(0, 0);
    }, [pid]);

    useEffect(() => {
        if (pid) {
            fetchProductData();
        }
    }, [update]);
    // console.log(pid);
    const rerender = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    const handleQuantity = useCallback(
        (number) => {
            const maxQuantity = currentProduct?.quantity || 0;

            if (!Number(number) || Number(number) < 1) {
                return;
            } else if (Number(number) > maxQuantity) {
                setQuantity(maxQuantity);
                toast.error('Quantity exceeds inventory level!');
            } else {
                setQuantity(Number(number));
            }
        },
        [currentProduct?.quantity]
    );

    const handleChangeQuantity = useCallback(
        (flag) => {
            const maxQuantity = currentProduct?.quantity || 0;

            if (flag === 'minus' && quantity === 1) return;

            if (flag === 'minus') {
                setQuantity((prev) => Math.max(1, +prev - 1));
            }

            if (flag === 'plus') {
                setQuantity((prev) => Math.min(maxQuantity, +prev + 1));
            }
        },
        [quantity, currentProduct?.quantity]
    );

    const handleAddCart = () => {
        const selectedSku = varriant || 'default';
        const selectedVariant =
            product?.varriants?.find((el) => el?.sku === varriant) || null;

        const price = selectedVariant?.price || product?.price;
        const thumb = selectedVariant?.thumb || product?.thumb;
        const color = selectedVariant?.color || product?.color;
        const title = selectedVariant?.title || product?.title;
        const quantityInStock =
            selectedVariant?.quantity || product?.quantity || 0;

        const cartRedux = cartItems?.find(
            (item) => item.product === product?._id && item?.sku === selectedSku
        );

        if (
            cartRedux?.count + quantity <= quantityInStock ||
            (!cartRedux && quantity <= quantityInStock)
        ) {
            dispatch(
                addCart({
                    cartItem: {
                        product: product?._id,
                        sku: selectedSku,
                        title,
                        thumb,
                        color,
                        price,
                        count: quantity,
                        quantity: quantityInStock,
                    },
                })
            );
            toast.success('Added to cart');
        } else {
            toast.error('Quantity exceeds inventory level!');
        }
    };

    return (
        <div className="w-full ">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold">
                        {currentProduct?.title || product?.title}
                    </h3>
                    <Breadcrumb
                        title={currentProduct?.title || product?.title}
                        category={category}
                    />
                </div>
            </div>
            <div className="flex gap-4 m-auto mt-4 w-main">
                <div className="flex flex-col w-[458px] gap-4">
                    <div className="h-[458px] w-[458px] border flex items-center justify-center border-gray-500">
                        <Zoom>
                            <img
                                key={selectedImg || currentProduct?.thumb}
                                src={currentImg || currentProduct?.thumb}
                                alt="product"
                                className="h-[400px] w-[400px] object-contain animate-slide-up"
                            />
                        </Zoom>
                    </div>

                    <div className="w-[458px]">
                        <Slider
                            className="flex gap-2 imageSlider"
                            {...settings}
                        >
                            {(currentProduct?.images?.length === 0
                                ? product?.images
                                : currentProduct?.images
                            )?.map((el, index) => (
                                <div
                                    key={index}
                                    className="w-[143px] h-[143px] px-1"
                                >
                                    <img
                                        onClick={(e) => handleClickImage(e, el)}
                                        src={el}
                                        alt="itemImg"
                                        className={`
                                            h-full w-full object-contain cursor-pointer border-2
                                            ${
                                                selectedImg === el
                                                    ? 'border-main'
                                                    : 'border-white'
                                            }
                                            rounded-md transition
                                        `}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className="flex flex-col w-2/5 gap-3 ">
                    <h2 className="text-xl w-[500px] font-semibold text-gray-800 truncate">
                        {currentProduct?.title || product?.title}
                    </h2>

                    <h2 className="text-3xl font-bold text-red-500">
                        {`${formatMoney(
                            +currentProduct?.price || product?.price
                        )} VNĐ`}
                    </h2>

                    <div className="flex items-center gap-1">
                        {renderStar(product?.totalRatings)?.map((el, index) => (
                            <span key={index} className="text-yellow-400">
                                {el}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <h2 className="text-[20px] font-semibold text-main">{`Đã bán: ${
                            currentProduct?.sold || product?.sold
                        }`}</h2>
                        <span className="ml-2 text-sm italic font-semibold text-main">{`(Kho: ${
                            currentProduct?.quantity || product?.quantity
                        })`}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        {product?.shortDescription && (
                            <div
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        product?.shortDescription
                                    ),
                                }}
                            ></div>
                        )}
                    </div>
                    <div className="flex gap-4 my-4">
                        <span className="font-bold">Color:</span>
                        <div className="flex flex-wrap items-center w-full gap-4">
                            <div
                                onClick={() => setVarriant(null)}
                                className={clsx(
                                    'flex items-center gap-2 p-2 border border-gray-500 cursor-pointer',
                                    !varriant && 'border-main'
                                )}
                            >
                                <img
                                    src={product?.thumb}
                                    alt="thumb"
                                    className="w-[30px] h-[30px] object-cover"
                                ></img>
                                <span className="flex flex-col">
                                    <span>{product?.color}</span>
                                </span>
                            </div>
                            {product?.varriants?.map((el) => (
                                <div
                                    key={el?._id}
                                    className={clsx(
                                        'flex items-center gap-2 p-2 border border-gray-500 cursor-pointer',
                                        varriant === el.sku && 'border-main'
                                    )}
                                    onClick={() => setVarriant(el?.sku)}
                                >
                                    <img
                                        src={el?.thumb || el?.images[0]}
                                        alt="thumb"
                                        className="w-[30px] h-[30px]  object-cover"
                                    ></img>
                                    <span className="flex flex-col">
                                        <span>{el?.color}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Quantity</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button handleOnclick={handleAddCart} fw>
                            Add to Cart
                        </Button>
                    </div>
                </div>
                <div className="w-1/5 ">
                    {productExtraInfomation?.map((el) => (
                        <ProductExtrainInfo
                            key={el.id}
                            title={el.title}
                            icon={el.icon}
                            sub={el.sub}
                        />
                    ))}
                </div>
            </div>
            <div className="m-auto mt-8 w-main">
                <ProductInfomation
                    totalRatings={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    description={product?.description}
                    pid={product?._id}
                    rerender={rerender}
                />
            </div>

            {relatedProducts?.length > 0 && (
                <div className="m-auto mt-8 w-main">
                    <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main mb-5">
                        PRODUCTS OF THE SAME TYPE
                    </h3>
                    <CustomSlider normal={true} products={relatedProducts} />
                </div>
            )}
            <div className="h-[30px] w-full"></div>
        </div>
    );
};

export default DetailsProduct;
