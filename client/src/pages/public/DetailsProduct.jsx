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

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};
const DetailsProduct = () => {
    const { pid, title, category } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState(null);
    const [currentImg, setCurrentImg] = useState(null);
    const [update, setUpdate] = useState(false);
    const fetchProductData = async () => {
        const response = await apiGetDetailsProduct(pid);
        // console.log(response);
        // console.log('Category Title:', response?.productData?.category?.title);
        if (response.success) {
            setProduct(response?.productData);
            setCurrentImg(
                response?.productData?.thumb || response?.productData?.images[0]
            );
        }
        // console.log(response?.productData?.category?.brand?.title);
    };
    // const prss= product?.category?._id;
    // console.log(productsss);
    const fetchProducts = async () => {
        const response = await apiGetProduct({ category });

        if (response.success) {
            setRelatedProducts(response?.products);
        }
    };

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
            const maxQuantity = product?.quantity || 0; // Lấy số lượng tồn kho
            if (!Number(number) || Number(number) < 1) {
                return;
            } else if (Number(number) > maxQuantity) {
                setQuantity(maxQuantity); // Nếu vượt quá số lượng trong kho, đặt về max
                toast.error('Quantity exceeds inventory level!');
            } else {
                setQuantity(number);
            }
        },
        [quantity, product?.quantity]
    );

    const handleChangeQuantity = useCallback(
        (flag) => {
            const maxQuantity = product?.quantity || 0; // Số lượng tối đa trong kho

            if (flag === 'minus' && quantity === 1) return;

            if (flag === 'minus') {
                setQuantity((prev) => Math.max(1, +prev - 1)); // Không giảm dưới 1
            }

            if (flag === 'plus') {
                setQuantity((prev) => Math.min(maxQuantity, +prev + 1)); // Không tăng quá số lượng trong kho
            }
        },
        [quantity, product?.quantity]
    );

    const handleClickImage = (e, el) => {
        e.stopPropagation();
        setCurrentImg(el);
    };
    return (
        <div className="w-full ">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold">{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>
            <div className="flex gap-4 m-auto mt-4 w-main">
                <div className="flex flex-col w-2/5 gap-4">
                    <Zoom>
                        <img
                            src={currentImg}
                            alt="product"
                            className="h-[458px] w-[458px] object-cover border border-gray-200 "
                        ></img>
                    </Zoom>

                    <div className="w-[458px]">
                        <Slider
                            className="flex gap-2 imageSlider"
                            {...settings}
                        >
                            {product?.images?.map((el) => (
                                <div className="flex-1" key={el}>
                                    <img
                                        onClick={(e) => handleClickImage(e, el)}
                                        src={el}
                                        alt="itemImg"
                                        className="h-[143px] w-[143px] object-cover border  border-gray-200 cursor-pointer"
                                    ></img>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className="flex flex-col w-2/5 gap-3 ">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {product?.title}
                    </h2>

                    <h2 className="text-3xl font-bold text-red-500">
                        {`${formatMoney(product?.price)} VNĐ`}
                    </h2>

                    <div className="flex items-center gap-1">
                        {renderStar(product?.totalRatings)?.map((el, index) => (
                            <span key={index} className="text-yellow-400">
                                {el}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <h2 className="text-[20px] font-semibold text-main">{`Đã bán: ${product?.sold}`}</h2>
                        <span className="ml-2 text-sm italic font-semibold text-main">{`(Kho: ${product?.quantity})`}</span>
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
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Quantity</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button fw>Add to Cart</Button>
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
                    pid={product?._id}
                    rerender={rerender}
                />
            </div>
            <div className="m-auto mt-8 w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    PRODUCTS OF THE SAME TYPE
                </h3>
                <CustomSlider normal={true} products={relatedProducts} />
            </div>
            <div className="h-[100px] w-full"></div>
        </div>
    );
};

export default DetailsProduct;
